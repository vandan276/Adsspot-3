import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Query business by slug from Aurora DB
    const res = await queryPostgres(
      'SELECT * FROM businesses WHERE slug = $1 LIMIT 1',
      [slug]
    );

    if (res?.rows && res.rows.length > 0) {
      return NextResponse.json({
        success: true,
        business: res.rows[0],
      });
    }

    return NextResponse.json({
      success: false,
      business: null,
    });
  } catch (error: any) {
    console.error('[API /business/get-by-slug] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
