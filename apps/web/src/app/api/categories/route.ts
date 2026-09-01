import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';
import { SEED_CATEGORIES } from '@adsspot/api';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';

    // 1. Try querying PostgreSQL database categories table
    let dbCategories: any[] = [];
    try {
      const res = await queryPostgres(
        `SELECT id, name, slug, icon, sort_order FROM categories 
         WHERE name ILIKE $1 OR slug ILIKE $1 
         ORDER BY sort_order ASC, name ASC 
         LIMIT 50`,
        [`%${query}%`]
      );
      if (res?.rows && res.rows.length > 0) {
        dbCategories = res.rows;
      }
    } catch (dbErr) {
      console.warn('[API /categories] DB query warning, falling back to seed categories:', dbErr);
    }

    // 2. Combine with SEED_CATEGORIES for instant reliable search results
    const combinedMap = new Map<string, any>();
    
    // Add DB categories first
    dbCategories.forEach((cat) => {
      combinedMap.set(cat.id, cat);
      combinedMap.set(cat.slug, cat);
    });

    // Add seed categories if matching search query
    SEED_CATEGORIES.forEach((cat) => {
      if (!combinedMap.has(cat.id) && !combinedMap.has(cat.slug)) {
        if (!query || cat.name.toLowerCase().includes(query.toLowerCase()) || cat.slug.toLowerCase().includes(query.toLowerCase())) {
          combinedMap.set(cat.id, cat);
        }
      }
    });

    const categoriesList = Array.from(new Set(combinedMap.values())).filter((cat) => {
      if (!query) return true;
      return (
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.slug.toLowerCase().includes(query.toLowerCase())
      );
    });

    return NextResponse.json({
      success: true,
      categories: categoriesList,
      count: categoriesList.length,
    });
  } catch (error: any) {
    console.error('[API /categories] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
