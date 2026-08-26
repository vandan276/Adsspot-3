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
      categoryId,
      address,
      pincode,
      tier = 'basic',
    } = body;

    if (!bizName || !phone) {
      return NextResponse.json({ error: 'Business name and phone are required' }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanSlug = bizName.toLowerCase().replace(/[^a-z0-9]/g, '-') || `shop-${Date.now()}`;
    const businessId = `biz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 1. Ensure user exists and upgrade role to 'merchant' in Aurora PostgreSQL
    let effectiveUserId = userId;
    if (effectiveUserId) {
      await queryPostgres(
        `UPDATE users 
         SET role = 'merchant', full_name = COALESCE(NULLIF($2, ''), full_name), updated_at = NOW() 
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
          `UPDATE users SET role = 'merchant', full_name = COALESCE(NULLIF($2, ''), full_name), updated_at = NOW() WHERE id = $1`,
          [effectiveUserId, ownerName]
        );
      } else {
        effectiveUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await queryPostgres(
          `INSERT INTO users (id, phone, full_name, avatar_url, role) 
           VALUES ($1, $2, $3, $4, 'merchant')`,
          [
            effectiveUserId,
            cleanPhone,
            ownerName || 'Merchant Owner',
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          ]
        );
      }
    }

    // 2. Insert or Update Business in AWS Aurora PostgreSQL
    const insertBizRes = await queryPostgres(
      `INSERT INTO businesses (
        id, owner_id, category_id, name, slug, description, address, pincode, 
        lat, lng, phone, whatsapp, logo_url, cover_url, trusted, status, tier
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, 
        $9, $10, $11, $12, $13, $14, $15, 'active', $16
      )
      ON CONFLICT (slug) DO UPDATE 
      SET name = EXCLUDED.name, 
          tier = EXCLUDED.tier, 
          phone = EXCLUDED.phone
      RETURNING *`,
      [
        businessId,
        effectiveUserId,
        categoryId || 'cat-food',
        bizName,
        cleanSlug,
        `Verified business on Adsspot offering premium local services.`,
        address || 'Fort, Mumbai',
        pincode || '400001',
        18.9322,
        72.8347,
        cleanPhone,
        cleanPhone,
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
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

    // 4. Create Digital Card record in Aurora
    await queryPostgres(
      `INSERT INTO digital_cards (id, business_id, theme_config, click_counts)
       VALUES ($1, $2, '{"theme": "royal_blue"}', '{"views": 1, "whatsapp": 0, "calls": 0}')
       ON CONFLICT (business_id) DO NOTHING`,
      [`card-${Date.now()}`, business?.id || businessId]
    );

    // 5. Fetch fully updated user
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
