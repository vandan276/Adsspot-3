import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres, requireAuth } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await queryPostgres(
      `SELECT s.id, s.business_id, s.media_url, s.tag, s.coupon_code, s.caption, s.expires_at, s.created_at,
              b.name as business_name, b.slug as business_slug, b.logo_url as business_logo, b.tier as business_tier, b.trusted as business_trusted
       FROM stories s
       JOIN businesses b ON s.business_id = b.id
       WHERE s.expires_at > NOW()
       ORDER BY s.created_at DESC`
    );

    const stories = (res?.rows || []).map((r: any) => ({
      id: r.id,
      business_id: r.business_id,
      media_url: r.media_url,
      tag: r.tag,
      coupon_code: r.coupon_code,
      caption: r.caption,
      expires_at: r.expires_at,
      created_at: r.created_at,
      business_name: r.business_name,
      business_logo: r.business_logo,
      business_tier: r.business_tier,
      business_trusted: Boolean(r.business_trusted),
    }));

    return NextResponse.json({ success: true, stories });
  } catch (error: any) {
    console.error('[API /stories GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth.errorResponse) return auth.errorResponse;
    const { context } = auth;

    const body = await req.json();
    const { business_id, media_url, caption, tag, coupon_code } = body;

    if (!business_id || !media_url) {
      return NextResponse.json({ success: false, error: 'business_id and media_url are required' }, { status: 400 });
    }

    // Verify business exists and tier constraint: Elite only
    const bizRes = await queryPostgres(`SELECT id, owner_id, tier, name, logo_url FROM businesses WHERE id = $1`, [business_id]);
    if (!bizRes?.rows || bizRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Business not found.' }, { status: 404 });
    }

    const business = bizRes.rows[0];
    const isSuperAdmin = context.user.role === 'super_admin' || context.roleData.slug === 'super_admin';
    if (!isSuperAdmin && business.owner_id !== context.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have permission to publish stories for this business.' },
        { status: 403 }
      );
    }

    if (business.tier !== 'elite') {
      return NextResponse.json(
        { success: false, error: 'Stories are strictly exclusive to Elite Tier merchants (1 story / 24 hours). Please upgrade your tier.' },
        { status: 403 }
      );
    }

    // Check active story in last 24h
    const existingRes = await queryPostgres(
      `SELECT id FROM stories WHERE business_id = $1 AND expires_at > NOW()`,
      [business_id]
    );

    if (existingRes && existingRes.rowCount && existingRes.rowCount > 0) {
      return NextResponse.json(
        { success: false, error: '24h Quota Reached: Elite businesses are capped at max ONE story per 24 hours.' },
        { status: 429 }
      );
    }

    const storyId = `story-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await queryPostgres(
      `INSERT INTO stories (id, business_id, media_url, tag, coupon_code, caption, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '24 HOURS', NOW())`,
      [storyId, business_id, media_url, tag || null, coupon_code || null, caption || null]
    );

    const newStory = {
      id: storyId,
      business_id,
      media_url,
      tag: tag || 'Flash Offer',
      coupon_code: coupon_code || null,
      caption: caption || null,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
      business_name: business.name,
      business_logo: business.logo_url,
      business_tier: business.tier,
    };

    return NextResponse.json({ success: true, story: newStory });
  } catch (error: any) {
    console.error('[API /stories POST] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
