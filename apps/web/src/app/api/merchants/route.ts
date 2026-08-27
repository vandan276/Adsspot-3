import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';
import { SEED_BUSINESSES } from '@adsspot/api';

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

    // Merge: Put DB businesses first, then append seed businesses if not already included
    const existingIds = new Set(dbBusinesses.map((b: any) => b.id));
    const existingSlugs = new Set(dbBusinesses.map((b: any) => b.slug));

    const combined = [
      ...dbBusinesses,
      ...SEED_BUSINESSES.filter((b) => !existingIds.has(b.id) && !existingSlugs.has(b.slug)),
    ];

    return NextResponse.json({
      success: true,
      merchants: combined,
      count: combined.length,
    });
  } catch (error: any) {
    console.error('Error fetching merchants list:', error);
    // Fallback to SEED_BUSINESSES if DB error
    return NextResponse.json({
      success: true,
      merchants: SEED_BUSINESSES,
      count: SEED_BUSINESSES.length,
      fallback: true,
    });
  }
}
