import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, reason, reportedBy } = body;

    if (!reviewId || !reason) {
      return NextResponse.json({ error: 'Missing reviewId or reason' }, { status: 400 });
    }

    const auditId = `audit-rev-${Date.now()}`;
    try {
      await queryPostgres(
        `INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, meta, created_at)
         VALUES ($1, $2, 'REVIEW_DISPUTED', 'review', $3, $4, NOW())`,
        [auditId, reportedBy || 'merchant-owner', reviewId, JSON.stringify({ reason })]
      );
    } catch (dbErr) {
      console.warn('DB audit log insert fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      reviewId,
      disputeTicket: auditId,
      message: 'Review dispute logged. Our trust & safety team will review it within 24 hours.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to file dispute' }, { status: 500 });
  }
}
