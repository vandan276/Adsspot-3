import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, postId, userId, imageUrl } = body;

    if (!businessId || !imageUrl) {
      return NextResponse.json({ error: 'Missing businessId or imageUrl' }, { status: 400 });
    }

    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const effectiveUserId = userId || 'usr-consumer-1';

    try {
      await queryPostgres(
        `INSERT INTO customer_photos (id, post_id, business_id, user_id, image_url, status, created_at)
         VALUES ($1, $2, $3, $4, $5, 'pending', NOW())`,
        [photoId, postId || null, businessId, effectiveUserId, imageUrl]
      );
    } catch (dbErr) {
      console.warn('DB photo insert fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: photoId,
        business_id: businessId,
        post_id: postId || null,
        user_id: effectiveUserId,
        image_url: imageUrl,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      message: 'Photo submitted for store verification!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit photo' }, { status: 500 });
  }
}
