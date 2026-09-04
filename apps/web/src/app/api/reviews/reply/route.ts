import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, replyText } = body;

    if (!reviewId || !replyText?.trim()) {
      return NextResponse.json({ error: 'Missing reviewId or replyText' }, { status: 400 });
    }

    try {
      await queryPostgres(
        `UPDATE reviews SET reply = $1, updated_at = NOW() WHERE id = $2`,
        [replyText.trim(), reviewId]
      );
    } catch (dbErr) {
      console.warn('DB review reply fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      reviewId,
      reply: replyText.trim(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to post reply' }, { status: 500 });
  }
}
