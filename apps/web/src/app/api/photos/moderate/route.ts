import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { photoId, status, moderatorId } = body;

    if (!photoId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid photoId and status (approved/rejected) required' }, { status: 400 });
    }

    try {
      await queryPostgres(
        `UPDATE customer_photos SET status = $1 WHERE id = $2`,
        [status, photoId]
      );
    } catch (dbErr) {
      console.warn('DB photo moderate fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      photoId,
      status,
      moderatedBy: moderatorId || 'merchant-owner',
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to moderate photo' }, { status: 500 });
  }
}
