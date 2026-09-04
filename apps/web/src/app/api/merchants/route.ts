import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Query all businesses from PostgreSQL
    const res = await queryPostgres(`
      SELECT 
        b.id,
        b.owner_id,
        b.category_id,
        b.name,
        b.slug,
        b.description,
        b.address,
        b.pincode,
        b.lat,
        b.lng,
        b.phone,
        b.whatsapp,
        b.logo_url,
        b.cover_url,
        b.trusted,
        b.status,
        b.tier,
        b.created_at,
        u.full_name as owner_name,
        u.phone as owner_phone
      FROM businesses b
      LEFT JOIN users u ON b.owner_id = u.id
      ORDER BY b.created_at DESC
    `);

    const dbBusinesses = (res?.rows || []).map((row: any) => ({
      id: row.id,
      owner_id: row.owner_id,
      category_id: row.category_id || 'cat-food',
      name: row.name,
      slug: row.slug,
      description: row.description,
      address: row.address,
      pincode: row.pincode,
      lat: Number(row.lat) || 18.9322,
      lng: Number(row.lng) || 72.8347,
      phone: row.phone,
      whatsapp: row.whatsapp || row.phone,
      logo_url: row.logo_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
      cover_url: row.cover_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      trusted: Boolean(row.trusted),
      status: row.status || 'active',
      tier: row.tier || 'basic',
      created_at: row.created_at || new Date().toISOString(),
      owner_name: row.owner_name,
      stats: {
        views_count: 14,
        likes_count: 0,
        followers_count: 0,
        reviews_count: 0,
        avg_rating: 0,
        card_clicks: 0,
      },
    }));

    return NextResponse.json({
      success: true,
      merchants: dbBusinesses,
      count: dbBusinesses.length,
    });
  } catch (error: any) {
    console.error('Error fetching merchants list:', error);
    return NextResponse.json(
      { success: false, error: 'Database query failed', merchants: [] },
      { status: 500 }
    );
  }
}
