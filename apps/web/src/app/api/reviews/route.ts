import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('business_id') || searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ success: false, error: 'business_id is required' }, { status: 400 });
    }

    const res = await queryPostgres(
      `SELECT r.id, r.business_id, r.user_id, r.rating, r.comment, r.reply, r.created_at, u.full_name as author_name, u.avatar_url as author_avatar 
       FROM reviews r 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.business_id = $1 
       ORDER BY r.created_at DESC`,
      [businessId]
    );

    return NextResponse.json({
      success: true,
      reviews: res?.rows || [],
    });
  } catch (error: any) {
    console.error('Reviews API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
