import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      bizName,
      ownerName,
      phone,
      whatsapp,
      categoryId,
      address,
      pincode,
      lat,
      lng,
      description,
      logoUrl,
      coverUrl,
      email,
      website,
      instagram,
      upiId,
      openingHours,
      tier = 'basic',
    } = body;

    if (!bizName || !phone) {
      return NextResponse.json({ error: 'Business name and phone are required' }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanWhatsapp = (whatsapp || phone).trim().replace(/\s+/g, '');
    const cleanSlug = bizName.toLowerCase().replace(/[^a-z0-9]/g, '-') || `shop-${Date.now()}`;
    const businessId = `biz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Parse coordinates, default to Fort, Mumbai (18.9322, 72.8347) if invalid
    const latitude = Number(lat) && !isNaN(Number(lat)) ? Number(lat) : 18.9322;
    const longitude = Number(lng) && !isNaN(Number(lng)) ? Number(lng) : 72.8347;

    // 1. Ensure user exists and upgrade role to 'merchant' in Aurora PostgreSQL
    let effectiveUserId = userId;
    if (effectiveUserId) {
      await queryPostgres(
        `UPDATE users 
         SET role = 'merchant', role_id = 'role-merchant', full_name = COALESCE(NULLIF($2, ''), full_name), updated_at = NOW() 
         WHERE id = $1`,
        [effectiveUserId, ownerName]
      );
    } else {
      // Find or create user by phone
      const userRes = await queryPostgres(
        'SELECT id FROM users WHERE phone = $1',
        [cleanPhone]
      );
      if (userRes?.rows[0]) {
        effectiveUserId = userRes.rows[0].id;
        await queryPostgres(
          `UPDATE users SET role = 'merchant', role_id = 'role-merchant', full_name = COALESCE(NULLIF($2, ''), full_name), updated_at = NOW() WHERE id = $1`,
          [effectiveUserId, ownerName]
        );
      } else {
        effectiveUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await queryPostgres(
          `INSERT INTO users (id, phone, full_name, avatar_url, role, role_id, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, 'merchant', 'role-merchant', NOW(), NOW())`,
          [
            effectiveUserId,
            cleanPhone,
            ownerName || 'Merchant Owner',
            logoUrl || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(cleanPhone)),
          ]
        );
      }
    }

    // Verify valid category_id in DB, fallback to 'cat-1' if not found
    let effectiveCategoryId = categoryId || 'cat-1';
    const catCheck = await queryPostgres('SELECT id FROM categories WHERE id = $1', [effectiveCategoryId]);
    if (!catCheck?.rows?.[0]) {
      effectiveCategoryId = 'cat-1';
    }

    // 2. Insert or Update Business in AWS Aurora PostgreSQL with exact coordinates & rich fields
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
        $20, 'active', $21
      )
      ON CONFLICT (slug) DO UPDATE 
      SET name = EXCLUDED.name, 
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
          opening_hours = EXCLUDED.opening_hours
      RETURNING *`,
      [
        businessId,
        effectiveUserId,
        effectiveCategoryId,
        bizName,
        cleanSlug,
        description || `Verified business on Adsspot offering premium local products & services.`,
        address || 'Fort, Mumbai',
        pincode || '400001',
        latitude,
        longitude,
        cleanPhone,
        cleanWhatsapp,
        logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
        coverUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
        email || null,
        website || null,
        instagram || null,
        upiId || null,
        openingHours || '09:00 AM - 09:30 PM (All Days)',
        tier === 'premium' || tier === 'elite',
        tier,
      ]
    );

    const business = insertBizRes?.rows[0];

    // 3. Create active subscription record in Aurora
    await queryPostgres(
      `INSERT INTO subscriptions (id, business_id, plan_id, status, current_period_start, current_period_end)
       VALUES ($1, $2, $3, 'active', NOW(), NOW() + INTERVAL '1 year')
       ON CONFLICT (id) DO NOTHING`,
      [`sub-${Date.now()}`, business?.id || businessId, `plan-${tier}`]
    );

    // 4. Create Digital Card record in Aurora with social & custom theme config
    const themeConfig = {
      theme: 'royal_blue',
      social_links: {
        instagram: instagram || undefined,
        website: website || undefined,
        email: email || undefined,
        upi_id: upiId || undefined,
        opening_hours: openingHours || undefined,
      },
    };

    await queryPostgres(
      `INSERT INTO digital_cards (id, business_id, theme_config, click_counts, updated_at)
       VALUES ($1, $2, $3, '{"views": 1, "whatsapp": 0, "calls": 0}', NOW())
       ON CONFLICT (business_id) DO UPDATE
       SET theme_config = EXCLUDED.theme_config, updated_at = NOW()`,
      [`card-${Date.now()}`, business?.id || businessId, JSON.stringify(themeConfig)]
    );

    // 5. Create / Update Microsite if provided
    await queryPostgres(
      `INSERT INTO microsites (id, business_id, hero_title, about_text, gallery_urls, hours, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (business_id) DO UPDATE
       SET hero_title = EXCLUDED.hero_title,
           about_text = EXCLUDED.about_text,
           hours = EXCLUDED.hours,
           updated_at = NOW()`,
      [
        `site-${Date.now()}`,
        business?.id || businessId,
        bizName,
        description || 'Welcome to our official business microsite on Adsspot.',
        JSON.stringify([
          coverUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
        ]),
        JSON.stringify({ "all_days": openingHours || "09:00 AM - 10:00 PM" })
      ]
    );

    // 6. Fetch fully updated user
    const updatedUserRes = await queryPostgres(
      'SELECT id, phone, full_name, avatar_url, role, created_at, updated_at FROM users WHERE id = $1',
      [effectiveUserId]
    );

    return NextResponse.json({
      success: true,
      business,
      user: {
        ...updatedUserRes?.rows[0],
        business_profile: business,
        staff_profile: null,
      },
    });
  } catch (error: any) {
    console.error('[API /merchants/onboard] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
