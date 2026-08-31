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
      categoryId,
      address,
      pincode,
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
    const baseSlug = cleanBizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `shop-${Date.now()}`;
    let cleanSlug = baseSlug;
    const slugCheck = await queryPostgres('SELECT id, owner_id FROM businesses WHERE slug = $1 LIMIT 1', [cleanSlug]);
    if (slugCheck?.rows?.length && slugCheck.rows[0].owner_id !== userId) {
      cleanSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    const generatedPaymentId = paymentId || `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

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
      // Update existing business tier & status
      businessId = existingBizRes.rows[0].id;
      const updateBizRes = await queryPostgres(
        `UPDATE businesses 
         SET name = COALESCE(NULLIF($1, ''), name),
             tier = $2,
             trusted = $3,
             category_id = COALESCE(NULLIF($4, ''), category_id),
             address = COALESCE(NULLIF($5, ''), address),
             pincode = COALESCE(NULLIF($6, ''), pincode),
             status = 'active'
         WHERE id = $7
         RETURNING *`,
        [cleanBizName, tier, isTrusted, effectiveCategoryId, address || 'Fort, Mumbai', pincode || '400001', businessId]
      );
      business = updateBizRes?.rows[0];
    } else {
      // Insert new business
      const insertBizRes = await queryPostgres(
        `INSERT INTO businesses (
          id, owner_id, category_id, name, slug, description, address, pincode,
          lat, lng, phone, whatsapp, logo_url, cover_url, trusted, status, tier, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, 'active', $16, NOW()
        )
        ON CONFLICT (slug) DO UPDATE
        SET owner_id = EXCLUDED.owner_id,
            name = EXCLUDED.name,
            tier = EXCLUDED.tier,
            trusted = EXCLUDED.trusted,
            category_id = EXCLUDED.category_id,
            status = 'active'
        RETURNING *`,
        [
          businessId,
          userId,
          effectiveCategoryId,
          cleanBizName,
          cleanSlug,
          `Verified business on Adsspot offering premium local products & services.`,
          address || 'Fort, Mumbai',
          pincode || '400001',
          18.9322,
          72.8347,
          cleanPhone,
          cleanPhone,
          dbUser.avatar_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
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

    // 5. Create / ensure Digital Card entry
    const cardId = `card-${Date.now()}`;
    await queryPostgres(
      `INSERT INTO digital_cards (id, business_id, theme_config, click_counts, updated_at)
       VALUES ($1, $2, '{"theme": "royal_blue"}', '{"views": 1, "whatsapp": 0, "calls": 0}', NOW())
       ON CONFLICT (business_id) DO NOTHING`,
      [cardId, business?.id || businessId]
    );

    // 6. Upgrade user role in users table
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
