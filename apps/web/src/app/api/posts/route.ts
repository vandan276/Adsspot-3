import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres, requireAuth } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await queryPostgres(
      `SELECT p.id, p.business_id, p.caption, p.image_urls, p.likes_count, p.comments_count, p.created_at,
              b.name as business_name, b.slug as business_slug, b.logo_url as business_logo, 
              b.tier as business_tier, b.trusted as business_trusted, b.address as business_address, 
              b.category_id as business_category
       FROM posts p
       JOIN businesses b ON p.business_id = b.id
       ORDER BY p.created_at DESC`
    );

    const posts = (res?.rows || []).map((r: any) => ({
      id: r.id,
      business_id: r.business_id,
      caption: r.caption,
      image_urls: Array.isArray(r.image_urls) ? r.image_urls : [r.image_urls],
      likes_count: Number(r.likes_count) || 0,
      comments_count: Number(r.comments_count) || 0,
      created_at: r.created_at,
      business_name: r.business_name,
      business_slug: r.business_slug,
      business_logo: r.business_logo,
      business_tier: r.business_tier,
      business_trusted: Boolean(r.business_trusted),
      business_address: r.business_address,
      business_category: r.business_category,
    }));

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('[API /posts GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth.errorResponse) return auth.errorResponse;
    const { context } = auth;

    const body = await req.json();
    const { business_id, caption, image_url, image_urls } = body;

    if (!business_id || !caption) {
      return NextResponse.json({ success: false, error: 'business_id and caption are required' }, { status: 400 });
    }

    // Verify user owns this business or is Admin
    const isSuperAdmin = context.user.role === 'super_admin' || context.roleData.slug === 'super_admin';
    const bizRes = await queryPostgres('SELECT id, owner_id, name, logo_url, tier FROM businesses WHERE id = $1', [business_id]);
    
    if (!bizRes?.rows || bizRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Business not found.' }, { status: 404 });
    }

    const business = bizRes.rows[0];
    if (!isSuperAdmin && business.owner_id !== context.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have permission to post for this business.' },
        { status: 403 }
      );
    }

    const postId = `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const finalImageUrls = Array.isArray(image_urls) && image_urls.length > 0
      ? image_urls
      : [image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'];

    // Insert into PostgreSQL posts table
    await queryPostgres(
      `INSERT INTO posts (id, business_id, caption, image_urls, likes_count, comments_count, created_at)
       VALUES ($1, $2, $3, $4, 0, 0, NOW())`,
      [postId, business_id, caption.trim(), finalImageUrls]
    );

    const newPost = {
      id: postId,
      business_id,
      caption: caption.trim(),
      image_urls: finalImageUrls,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      business_name: business.name,
      business_logo: business.logo_url,
      business_tier: business.tier,
    };

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error('[API /posts POST] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
