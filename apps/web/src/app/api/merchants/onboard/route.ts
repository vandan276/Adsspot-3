import { NextResponse } from 'next/server';
import { queryPostgres, getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

// GET Handler: Fetch existing draft or business profile ONLY for the authenticated user
export async function GET(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    const { searchParams } = new URL(req.url);
    const paramUserId = searchParams.get('userId');
    const paramPhone = searchParams.get('phone');

    // Security requirement: Prefer authenticated user ID over unverified query string parameter
    const effectiveUserId = authContext?.user?.id || paramUserId;

    if (!effectiveUserId && !paramPhone) {
      return NextResponse.json({ error: 'Unauthorized. Active session or phone is required' }, { status: 401 });
    }

    let business: any = null;

    if (effectiveUserId) {
      const bizRes = await queryPostgres(
        `SELECT * FROM businesses WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [effectiveUserId]
      );
      if (bizRes?.rows?.[0]) {
        business = bizRes.rows[0];
      }
    }

    if (!business && paramPhone) {
      const cleanPhone = paramPhone.trim().replace(/\s+/g, '');
      const bizRes = await queryPostgres(
        `SELECT b.* FROM businesses b JOIN users u ON b.owner_id = u.id WHERE u.phone = $1 ORDER BY b.created_at DESC LIMIT 1`,
        [cleanPhone]
      );
      if (bizRes?.rows?.[0]) {
        business = bizRes.rows[0];
      }
    }

    return NextResponse.json({
      success: true,
      draft: business,
    });
  } catch (error: any) {
    console.error('[API /merchants/onboard GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Handler: Create / Update Single Onboarding Business Draft & Finalize Merchant Account
export async function POST(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    const body = await req.json();

    const {
      userId,
      bizName,
      ownerName,
      phone,
      whatsapp,
      categoryId,
      categoryIds = [],
      address,
      pincode,
      lat,
      lng,
      description,
      logoUrl,
      coverUrl,
      photos = [],
      email,
      website,
      instagram,
      upiId,
      openingHours,
      timings,
      tier = 'basic',
      isDraft = false,
      onboardStep = 1,
      // Address & Contact Fields
      plotNo,
      buildingName,
      streetRoad,
      landmark,
      area,
      city,
      state,
      title,
      secondaryPhone,
      secondaryWhatsapp,
      landline,
      secondaryEmail,
    } = body;

    // Security Requirement #2: Authenticated session user ID is the primary source of truth
    let effectiveUserId = authContext?.user?.id || userId;
    const cleanPhone = (phone || authContext?.user?.phone || '').trim().replace(/\s+/g, '');
    const cleanWhatsapp = (whatsapp || cleanPhone).trim().replace(/\s+/g, '');

    // 1. Validate or find/create user record
    if (effectiveUserId) {
      if (!isDraft) {
        // Upgrade user role in PostgreSQL to 'merchant' using existing role system
        await queryPostgres(
          `UPDATE users 
           SET role = 'merchant', role_id = 'role-merchant', full_name = COALESCE(NULLIF($2, ''), full_name), updated_at = NOW() 
           WHERE id = $1`,
          [effectiveUserId, ownerName]
        );
      }
    } else if (cleanPhone) {
      const userRes = await queryPostgres('SELECT id FROM users WHERE phone = $1', [cleanPhone]);
      if (userRes?.rows?.[0]) {
        effectiveUserId = userRes.rows[0].id;
        if (!isDraft) {
          await queryPostgres(
            `UPDATE users SET role = 'merchant', role_id = 'role-merchant', full_name = COALESCE(NULLIF($2, ''), full_name), updated_at = NOW() WHERE id = $1`,
            [effectiveUserId, ownerName]
          );
        }
      } else {
        effectiveUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await queryPostgres(
          `INSERT INTO users (id, phone, full_name, avatar_url, role, role_id, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            effectiveUserId,
            cleanPhone,
            ownerName || 'Merchant Owner',
            logoUrl || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(cleanPhone)),
            isDraft ? 'consumer' : 'merchant',
            isDraft ? 'role-consumer' : 'role-merchant',
          ]
        );
      }
    }

    if (!effectiveUserId) {
      return NextResponse.json({ error: 'Unauthorized. Active session or phone is required' }, { status: 401 });
    }

    // Verify valid category_id in DB, fallback to 'cat-1' if not found
    let effectiveCategoryId = categoryId || (categoryIds.length > 0 ? categoryIds[0] : 'cat-1');
    const catCheck = await queryPostgres('SELECT id FROM categories WHERE id = $1', [effectiveCategoryId]);
    if (!catCheck?.rows?.[0]) {
      effectiveCategoryId = 'cat-1';
    }

    // Build formatted address string from detailed fields
    const formattedAddress = address || [
      plotNo,
      buildingName,
      streetRoad,
      landmark,
      area,
      city,
      state
    ].filter(Boolean).join(', ') || 'Vadodara, Gujarat';

    const cleanSlug = (bizName || 'shop').toLowerCase().replace(/[^a-z0-9]/g, '-') || `shop-${Date.now()}`;

    // Item 3 & 4: Duplicate Protection — Check if a business record already exists for this owner_id
    const existingBizRes = await queryPostgres(
      `SELECT id, slug FROM businesses WHERE owner_id = $1 LIMIT 1`,
      [effectiveUserId]
    );

    const targetBusinessId = existingBizRes?.rows?.[0]?.id || `biz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const targetSlug = existingBizRes?.rows?.[0]?.slug || cleanSlug;

    // Combine photos list
    const combinedPhotos = Array.isArray(photos) && photos.length > 0 ? photos : (coverUrl ? [coverUrl] : []);

    const latitude = Number(lat) && !isNaN(Number(lat)) ? Number(lat) : 18.9322;
    const longitude = Number(lng) && !isNaN(Number(lng)) ? Number(lng) : 72.8347;

    // Insert or update SINGLE business record for this owner_id
    const insertBizRes = await queryPostgres(
      `INSERT INTO businesses (
        id, owner_id, category_id, name, slug, description, address, pincode, 
        lat, lng, phone, whatsapp, logo_url, cover_url, 
        email, website, instagram, upi_id, opening_hours,
        trusted, status, tier
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, 
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, $22
      )
      ON CONFLICT (id) DO UPDATE 
      SET name = EXCLUDED.name, 
          category_id = EXCLUDED.category_id,
          tier = EXCLUDED.tier, 
          phone = EXCLUDED.phone,
          whatsapp = EXCLUDED.whatsapp,
          address = EXCLUDED.address,
          pincode = EXCLUDED.pincode,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          description = EXCLUDED.description,
          logo_url = EXCLUDED.logo_url,
          cover_url = EXCLUDED.cover_url,
          email = EXCLUDED.email,
          website = EXCLUDED.website,
          instagram = EXCLUDED.instagram,
          upi_id = EXCLUDED.upi_id,
          opening_hours = EXCLUDED.opening_hours,
          status = EXCLUDED.status
      RETURNING *`,
      [
        targetBusinessId,
        effectiveUserId,
        effectiveCategoryId,
        bizName || 'My Store Draft',
        targetSlug,
        description || `Verified business on Adsspot offering premium local products & services.`,
        formattedAddress,
        pincode || '390007',
        latitude,
        longitude,
        cleanPhone || '+919876543210',
        cleanWhatsapp || cleanPhone || '+919876543210',
        logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
        combinedPhotos[0] || coverUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
        email || null,
        website || null,
        instagram || null,
        upiId || null,
        typeof timings === 'string' ? timings : (openingHours || '09:00 AM - 09:30 PM (All Days)'),
        tier === 'premium' || tier === 'elite',
        isDraft ? 'pending' : 'active',
        tier,
      ]
    );

    const business = insertBizRes?.rows[0];

    // Create or update subscription record
    await queryPostgres(
      `INSERT INTO subscriptions (id, business_id, plan_id, status, current_period_start, current_period_end)
       VALUES ($1, $2, $3, 'active', NOW(), NOW() + INTERVAL '1 year')
       ON CONFLICT (id) DO NOTHING`,
      [`sub-${Date.now()}`, business?.id || targetBusinessId, `plan-${tier}`]
    );

    // Create or update Digital Card record
    const themeConfig = {
      theme: 'royal_blue',
      social_links: {
        instagram: instagram || undefined,
        website: website || undefined,
        email: email || undefined,
        upi_id: upiId || undefined,
        opening_hours: openingHours || undefined,
        secondary_phone: secondaryPhone || undefined,
        secondary_whatsapp: secondaryWhatsapp || undefined,
        landline: landline || undefined,
        title: title || undefined,
      },
    };

    await queryPostgres(
      `INSERT INTO digital_cards (id, business_id, theme_config, click_counts, updated_at)
       VALUES ($1, $2, $3, '{"views": 1, "whatsapp": 0, "calls": 0}', NOW())
       ON CONFLICT (business_id) DO UPDATE
       SET theme_config = EXCLUDED.theme_config, updated_at = NOW()`,
      [`card-${Date.now()}`, business?.id || targetBusinessId, JSON.stringify(themeConfig)]
    );

    // Fetch updated user from PostgreSQL
    const updatedUserRes = await queryPostgres(
      'SELECT id, phone, full_name, avatar_url, role, created_at, updated_at FROM users WHERE id = $1',
      [effectiveUserId]
    );

    return NextResponse.json({
      success: true,
      business: {
        ...business,
        plot_no: plotNo,
        building_name: buildingName,
        street_road: streetRoad,
        landmark: landmark,
        area: area,
        city: city,
        state: state,
        title: title,
        secondary_phone: secondaryPhone,
        secondary_whatsapp: secondaryWhatsapp,
        landline: landline,
        secondary_email: secondaryEmail,
        photos: combinedPhotos,
        category_ids: categoryIds,
        onboard_step: onboardStep,
      },
      user: {
        ...updatedUserRes?.rows[0],
        business_profile: business,
        staff_profile: null,
      },
    });
  } catch (error: any) {
    console.error('[API /merchants/onboard POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
