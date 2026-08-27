import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';
import { SEED_STORIES } from '@adsspot/api';

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

    if (res && res.rows && res.rows.length > 0) {
      const stories = res.rows.map((r: any) => ({
        id: r.id,
        business_id: r.business_id,
        media_url: r.media_url,
        tag: r.tag,
        coupon_code: r.coupon_code,
        caption: r.caption,
        expires_at: r.expires_at,
        created_at: r.created_at,
      }));
      return NextResponse.json({ stories });
    }

    return NextResponse.json({ stories: SEED_STORIES });
  } catch (error: any) {
    console.error('Fetch stories error:', error);
    return NextResponse.json({ stories: SEED_STORIES });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_id, media_url, caption, tag, coupon_code } = body;

    if (!business_id || !media_url) {
      return NextResponse.json({ error: 'business_id and media_url are required' }, { status: 400 });
    }

    // Verify tier constraint: Elite only
    const bizRes = await queryPostgres(`SELECT tier FROM businesses WHERE id = $1`, [business_id]);
    const tier = bizRes?.rows?.[0]?.tier || 'elite';
    if (tier !== 'elite') {
      return NextResponse.json(
        { error: 'Stories are strictly exclusive to Elite Tier merchants (1 story / 24 hours).' },
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
        { error: '24h Quota Reached: Elite businesses are capped at max ONE story per 24 hours.' },
        { status: 429 }
      );
    }

    const storyId = `story-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await queryPostgres(
      `INSERT INTO stories (id, business_id, media_url, tag, coupon_code, caption, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '24 HOURS', NOW())`,
      [storyId, business_id, media_url, tag || null, coupon_code || null, caption || null]
    );

    const newStory = {
      id: storyId,
      business_id,
      media_url,
      tag: tag || 'Flash Offer',
      coupon_code: coupon_code || 'SPECIAL20',
      caption: caption || 'Special 24-hour flash deal',
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, story: newStory });
  } catch (error: any) {
    console.error('Create story error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
