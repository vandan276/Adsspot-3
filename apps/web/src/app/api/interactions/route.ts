import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres, getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authContext = await getAuthenticatedUser(req);
    const body = await req.json();
    const { action, userId: bodyUserId, postId, businessId, content, rating } = body;

    // Use authenticated user ID or body user ID
    const userId = authContext?.user?.id || bodyUserId;

    if (!userId) {
      return NextResponse.json({ error: 'User must be authenticated to perform interactions' }, { status: 401 });
    }

    if (action === 'save' || action === 'bookmark') {
      if (!postId) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

      const existing = await queryPostgres(
        `SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]
      );

      if (existing && existing.rowCount && existing.rowCount > 0) {
        // Unsave
        await queryPostgres(`DELETE FROM saved_posts WHERE user_id = $1 AND post_id = $2`, [userId, postId]);
        return NextResponse.json({ saved: false, message: 'Removed from bookmarks' });
      } else {
        // Save
        await queryPostgres(
          `INSERT INTO saved_posts (user_id, post_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
          [userId, postId]
        );
        return NextResponse.json({ saved: true, message: 'Saved to bookmarks' });
      }
    }

    if (action === 'like') {
      if (!postId) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
      
      // Check if already liked
      const existing = await queryPostgres(
        `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]
      );

      if (existing && existing.rowCount && existing.rowCount > 0) {
        // Unlike
        await queryPostgres(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`, [userId, postId]);
        await queryPostgres(`UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1`, [postId]);
        return NextResponse.json({ liked: false, message: 'Unliked post' });
      } else {
        // Like
        await queryPostgres(
          `INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
          [userId, postId]
        );
        await queryPostgres(`UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1`, [postId]);
        return NextResponse.json({ liked: true, message: 'Liked post' });
      }
    }

    if (action === 'comment') {
      if (!postId || !content) return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
      
      const commentId = `comm-${Date.now()}`;
      await queryPostgres(
        `INSERT INTO comments (id, post_id, user_id, content, created_at) VALUES ($1, $2, $3, $4, NOW())`,
        [commentId, postId, userId, content]
      );
      await queryPostgres(`UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1`, [postId]);

      const userRes = await queryPostgres(`SELECT full_name, avatar_url FROM users WHERE id = $1`, [userId]);
      const authorName = userRes?.rows?.[0]?.full_name || 'Anonymous User';

      return NextResponse.json({
        success: true,
        comment: {
          id: commentId,
          postId,
          userId,
          author: authorName,
          text: content,
          time: 'Just now',
        },
      });
    }

    if (action === 'follow') {
      if (!businessId) return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
      
      const existing = await queryPostgres(
        `SELECT * FROM follows WHERE user_id = $1 AND business_id = $2`,
        [userId, businessId]
      );

      if (existing && existing.rowCount && existing.rowCount > 0) {
        await queryPostgres(`DELETE FROM follows WHERE user_id = $1 AND business_id = $2`, [userId, businessId]);
        return NextResponse.json({ following: false, message: 'Unfollowed business' });
      } else {
        await queryPostgres(
          `INSERT INTO follows (user_id, business_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
          [userId, businessId]
        );
        return NextResponse.json({ following: true, message: 'Followed business' });
      }
    }

    if (action === 'review') {
      if (!businessId || !rating) return NextResponse.json({ error: 'Business ID and rating are required' }, { status: 400 });
      
      const reviewId = `rev-${Date.now()}`;
      await queryPostgres(
        `INSERT INTO reviews (id, business_id, user_id, rating, comment, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [reviewId, businessId, userId, rating, content || '']
      );

      return NextResponse.json({
        success: true,
        review: {
          id: reviewId,
          businessId,
          userId,
          rating,
          comment: content || '',
          time: 'Just now',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Interaction API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const postId = searchParams.get('postId');
    const businessId = searchParams.get('businessId');

    if (postId) {
      const res = await queryPostgres(
        `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.full_name, u.avatar_url 
         FROM comments c 
         LEFT JOIN users u ON c.user_id = u.id 
         WHERE c.post_id = $1 
         ORDER BY c.created_at DESC`,
        [postId]
      );
      return NextResponse.json({ comments: res?.rows || [] });
    }

    if (businessId) {
      const res = await queryPostgres(
        `SELECT r.id, r.business_id, r.user_id, r.rating, r.comment, r.created_at, u.full_name, u.avatar_url 
         FROM reviews r 
         LEFT JOIN users u ON r.user_id = u.id 
         WHERE r.business_id = $1 
         ORDER BY r.created_at DESC`,
        [businessId]
      );
      return NextResponse.json({ reviews: res?.rows || [] });
    }

    if (userId) {
      const [likesRes, followsRes, reviewsRes, savedRes] = await Promise.all([
        queryPostgres(`SELECT post_id FROM likes WHERE user_id = $1`, [userId]),
        queryPostgres(`SELECT business_id FROM follows WHERE user_id = $1`, [userId]),
        queryPostgres(`SELECT * FROM reviews WHERE user_id = $1`, [userId]),
        queryPostgres(`SELECT post_id FROM saved_posts WHERE user_id = $1`, [userId]),
      ]);

      const likedMap: Record<string, boolean> = {};
      (likesRes?.rows || []).forEach((r: any) => {
        likedMap[r.post_id] = true;
      });

      const followMap: Record<string, boolean> = {};
      (followsRes?.rows || []).forEach((r: any) => {
        followMap[r.business_id] = true;
      });

      const savedMap: Record<string, boolean> = {};
      (savedRes?.rows || []).forEach((r: any) => {
        savedMap[r.post_id] = true;
      });

      return NextResponse.json({
        likes: likedMap,
        follows: followMap,
        saved: savedMap,
        reviews: reviewsRes?.rows || [],
      });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Interaction GET API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
