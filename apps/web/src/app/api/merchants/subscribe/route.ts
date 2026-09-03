import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres, getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/merchants/subscribe
 * Processes membership plan selection and payment activation for a merchant.
 * Persists business, subscription, digital card, and updates user role in PostgreSQL.
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    const body = await req.json();

    const {
      tier = 'basic',
      billingCycle = 'monthly',
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
      paymentMethod = 'UPI',
      paymentId,
      amount,
    } = body;

    // Validate tier
    if (!['basic', 'premium', 'elite'].includes(tier)) {
      return NextResponse.json({ success: false, error: 'Invalid membership tier selected.' }, { status: 400 });
    }

    const userId = authUser?.user?.id || body.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User must be authenticated to subscribe.' }, { status: 401 });
    }

    // 1. Fetch user from database
    const userRes = await queryPostgres('SELECT * FROM users WHERE id = $1', [userId]);
    if (!userRes?.rows || userRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 });
    }
    const dbUser = userRes.rows[0];

    const cleanBizName = (bizName || dbUser.full_name || 'My Store').trim();
    const cleanOwnerName = (ownerName || dbUser.full_name || 'Store Owner').trim();
    const cleanPhone = (phone || dbUser.phone || '+919876543210').trim().replace(/\s+/g, '');
    const cleanWhatsapp = (whatsapp || cleanPhone).trim().replace(/\s+/g, '');
    const baseSlug = cleanBizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `shop-${Date.now()}`;
    let cleanSlug = baseSlug;
    const slugCheck = await queryPostgres('SELECT id, owner_id FROM businesses WHERE slug = $1 LIMIT 1', [cleanSlug]);
    if (slugCheck?.rows?.length && slugCheck.rows[0].owner_id !== userId) {
      cleanSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    const generatedPaymentId = paymentId || `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Parse coordinates
    const latitude = Number(lat) && !isNaN(Number(lat)) ? Number(lat) : 18.9322;
    const longitude = Number(lng) && !isNaN(Number(lng)) ? Number(lng) : 72.8347;

    // 2. Validate / fallback category
    let effectiveCategoryId = categoryId || 'cat-1';
    const catCheck = await queryPostgres('SELECT id FROM categories WHERE id = $1', [effectiveCategoryId]);
    if (!catCheck?.rows || catCheck.rows.length === 0) {
      effectiveCategoryId = 'cat-1';
    }

    // 3. Check if user already owns a business
    const existingBizRes = await queryPostgres('SELECT * FROM businesses WHERE owner_id = $1 LIMIT 1', [userId]);
    let businessId = `biz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let business: any;

    const isTrusted = tier === 'premium' || tier === 'elite';

    if (existingBizRes?.rows && existingBizRes.rows.length > 0) {
      // Update existing business tier, coordinates, & status
      businessId = existingBizRes.rows[0].id;
      const updateBizRes = await queryPostgres(
        `UPDATE businesses 
         SET name = COALESCE(NULLIF($1, ''), name),
             tier = $2,
             trusted = $3,
             category_id = COALESCE(NULLIF($4, ''), category_id),
             address = COALESCE(NULLIF($5, ''), address),
             pincode = COALESCE(NULLIF($6, ''), pincode),
             lat = $7,
             lng = $8,
             phone = COALESCE(NULLIF($9, ''), phone),
             whatsapp = COALESCE(NULLIF($10, ''), whatsapp),
             description = COALESCE(NULLIF($11, ''), description),
             logo_url = COALESCE(NULLIF($12, ''), logo_url),
             cover_url = COALESCE(NULLIF($13, ''), cover_url),
             email = COALESCE(NULLIF($14, ''), email),
             website = COALESCE(NULLIF($15, ''), website),
             instagram = COALESCE(NULLIF($16, ''), instagram),
             upi_id = COALESCE(NULLIF($17, ''), upi_id),
             opening_hours = COALESCE(NULLIF($18, ''), opening_hours),
             status = 'active'
         WHERE id = $19
         RETURNING *`,
        [
          cleanBizName,
          tier,
          isTrusted,
          effectiveCategoryId,
          address || 'Fort, Mumbai',
          pincode || '400001',
          latitude,
          longitude,
          cleanPhone,
          cleanWhatsapp,
          description || null,
          logoUrl || null,
          coverUrl || null,
          email || null,
          website || null,
          instagram || null,
          upiId || null,
          openingHours || '09:00 AM - 09:30 PM (All Days)',
          businessId,
        ]
      );
      business = updateBizRes?.rows[0];
    } else {
      // Insert new business
      const insertBizRes = await queryPostgres(
        `INSERT INTO businesses (
          id, owner_id, category_id, name, slug, description, address, pincode,
          lat, lng, phone, whatsapp, logo_url, cover_url,
          email, website, instagram, upi_id, opening_hours,
          trusted, status, tier, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19,
          $20, 'active', $21, NOW()
        )
        ON CONFLICT (slug) DO UPDATE
        SET owner_id = EXCLUDED.owner_id,
            name = EXCLUDED.name,
            tier = EXCLUDED.tier,
            trusted = EXCLUDED.trusted,
            category_id = EXCLUDED.category_id,
            address = EXCLUDED.address,
            pincode = EXCLUDED.pincode,
            lat = EXCLUDED.lat,
            lng = EXCLUDED.lng,
            phone = EXCLUDED.phone,
            whatsapp = EXCLUDED.whatsapp,
            description = EXCLUDED.description,
            logo_url = EXCLUDED.logo_url,
            cover_url = EXCLUDED.cover_url,
            email = EXCLUDED.email,
            website = EXCLUDED.website,
            instagram = EXCLUDED.instagram,
            upi_id = EXCLUDED.upi_id,
            opening_hours = EXCLUDED.opening_hours,
            status = 'active'
        RETURNING *`,
        [
          businessId,
          userId,
          effectiveCategoryId,
          cleanBizName,
          cleanSlug,
          description || `Verified business on Adsspot offering premium local products & services.`,
          address || 'Fort, Mumbai',
          pincode || '400001',
          latitude,
          longitude,
          cleanPhone,
          cleanWhatsapp,
          logoUrl || dbUser.avatar_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
          coverUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
          email || null,
          website || null,
          instagram || null,
          upiId || null,
          openingHours || '09:00 AM - 09:30 PM (All Days)',
          isTrusted,
          tier,
        ]
      );
      business = insertBizRes?.rows[0];
    }

    // 4. Create active subscription in PostgreSQL
    const subId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const planId = `plan-${tier}`;
    const periodInterval = billingCycle === 'yearly' ? "INTERVAL '1 year'" : "INTERVAL '1 month'";

    await queryPostgres(
      `INSERT INTO subscriptions (
        id, business_id, plan_id, status, current_period_start, current_period_end, razorpay_subscription_id
      ) VALUES (
        $1, $2, $3, 'active', NOW(), NOW() + ${periodInterval}, $4
      )
      ON CONFLICT (id) DO UPDATE
      SET plan_id = EXCLUDED.plan_id,
          status = 'active',
          current_period_end = NOW() + ${periodInterval}`,
      [subId, business?.id || businessId, planId, generatedPaymentId]
    );

    // 5. Create / ensure Digital Card entry with social & upi config
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

    const cardId = `card-${Date.now()}`;
    await queryPostgres(
      `INSERT INTO digital_cards (id, business_id, theme_config, click_counts, updated_at)
       VALUES ($1, $2, $3, '{"views": 1, "whatsapp": 0, "calls": 0}', NOW())
       ON CONFLICT (business_id) DO UPDATE
       SET theme_config = EXCLUDED.theme_config, updated_at = NOW()`,
      [cardId, business?.id || businessId, JSON.stringify(themeConfig)]
    );

    // 6. Fetch or prepare real gallery photos for Microsite
    const inputPhotos = Array.isArray(body.photos) && body.photos.length > 0 ? body.photos : (coverUrl ? [coverUrl] : []);
    let finalGallery: string[] = inputPhotos;

    if (finalGallery.length === 0) {
      const existingSite = await queryPostgres('SELECT gallery_urls FROM microsites WHERE business_id = $1 LIMIT 1', [business?.id || businessId]);
      if (existingSite?.rows?.[0]?.gallery_urls) {
        const raw = existingSite.rows[0].gallery_urls;
        finalGallery = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : []);
      }
    }

    if (finalGallery.length === 0 && (business?.cover_url || coverUrl)) {
      finalGallery = [business?.cover_url || coverUrl];
    }

    await queryPostgres(
      `INSERT INTO microsites (id, business_id, hero_title, about_text, gallery_urls, hours, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (business_id) DO UPDATE
       SET hero_title = EXCLUDED.hero_title,
           about_text = EXCLUDED.about_text,
           gallery_urls = CASE WHEN jsonb_array_length(EXCLUDED.gallery_urls::jsonb) > 0 THEN EXCLUDED.gallery_urls ELSE microsites.gallery_urls END,
           hours = EXCLUDED.hours,
           updated_at = NOW()`,
      [
        `site-${Date.now()}`,
        business?.id || businessId,
        cleanBizName,
        description || 'Welcome to our official business microsite on Adsspot.',
        JSON.stringify(finalGallery),
        JSON.stringify({ "all_days": openingHours || "09:00 AM - 10:00 PM" })
      ]
    );

    // 7. Upgrade user role in users table
    await queryPostgres(
      `UPDATE users 
       SET role = 'merchant', 
           role_id = 'role-merchant',
           full_name = COALESCE(NULLIF($2, ''), full_name),
           updated_at = NOW() 
       WHERE id = $1`,
      [userId, cleanOwnerName]
    );

    // 7. Insert audit log
    await queryPostgres(
      `INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, meta, created_at)
       VALUES ($1, $2, 'merchant.subscription_activated', 'subscription', $3, $4, NOW())`,
      [
        `audit-${Date.now()}`,
        userId,
        subId,
        JSON.stringify({
          tier,
          billingCycle,
          amount: amount || (tier === 'basic' ? 999 : tier === 'premium' ? 2499 : 4999),
          paymentMethod,
          paymentId: generatedPaymentId,
          business_id: business?.id || businessId,
        }),
      ]
    );

    // 8. Fetch refreshed user profile with business details
    const updatedUserRes = await queryPostgres(
      `SELECT u.id, u.email, u.phone, u.full_name, u.avatar_url, u.role, u.role_id,
              r.dashboard_type, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON (u.role_id = r.id OR u.role = r.slug)
       WHERE u.id = $1`,
      [userId]
    );

    const updatedUser = updatedUserRes?.rows[0];

    return NextResponse.json({
      success: true,
      message: `🎉 Membership activated! You are now an active ${tier.toUpperCase()} merchant.`,
      tier,
      billingCycle,
      paymentId: generatedPaymentId,
      business,
      subscription: {
        id: subId,
        business_id: business?.id || businessId,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        razorpay_subscription_id: generatedPaymentId,
      },
      user: {
        ...updatedUser,
        dashboard_type: 'merchant',
        business_profile: business,
      },
    });
  } catch (error: any) {
    console.error('[API /merchants/subscribe POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error processing subscription.' },
      { status: 500 }
    );
  }
}
