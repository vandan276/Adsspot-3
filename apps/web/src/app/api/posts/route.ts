import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';
import { SEED_POSTS } from '@adsspot/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await queryPostgres(
      `SELECT p.id, p.business_id, p.caption, p.image_urls, p.likes_count, p.comments_count, p.created_at,
              b.name as business_name, b.slug as business_slug, b.logo_url as business_logo, b.tier as business_tier, b.trusted as business_trusted, b.address as business_address, b.category_id as business_category
       FROM posts p
       JOIN businesses b ON p.business_id = b.id
       ORDER BY p.created_at DESC`
    );

    if (res && res.rows && res.rows.length > 0) {
      const posts = res.rows.map((r: any) => ({
        id: r.id,
        business_id: r.business_id,
        caption: r.caption,
        image_urls: Array.isArray(r.image_urls) ? r.image_urls : [r.image_urls],
        likes_count: Number(r.likes_count) || 0,
        comments_count: Number(r.comments_count) || 0,
        created_at: r.created_at,
      }));
      return NextResponse.json({ posts });
    }

    return NextResponse.json({ posts: SEED_POSTS });
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ posts: SEED_POSTS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_id, caption, image_url } = body;

    if (!business_id || !caption) {
      return NextResponse.json({ error: 'business_id and caption are required' }, { status: 400 });
    }

    const postId = `post-${Date.now()}`;
    const imgUrl = image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800';

    // Insert into PostgreSQL posts table
    await queryPostgres(
      `INSERT INTO posts (id, business_id, caption, image_urls, likes_count, comments_count, created_at)
       VALUES ($1, $2, $3, $4, 0, 0, NOW())`,
      [postId, business_id, caption, [imgUrl]]
    );

    const newPost = {
      id: postId,
      business_id,
      caption,
      image_urls: [imgUrl],
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
