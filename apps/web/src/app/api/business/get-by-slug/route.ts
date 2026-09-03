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
      const business = res.rows[0];
      // Query microsite for gallery photos
      const siteRes = await queryPostgres(
        'SELECT * FROM microsites WHERE business_id = $1 LIMIT 1',
        [business.id]
      );

      let gallery: string[] = [];
      let microsite: any = null;

      if (siteRes?.rows && siteRes.rows.length > 0) {
        microsite = siteRes.rows[0];
        const raw = microsite.gallery_urls;
        if (Array.isArray(raw)) {
          gallery = raw;
        } else if (typeof raw === 'string') {
          try {
            gallery = JSON.parse(raw);
          } catch {
            gallery = [raw];
          }
        }
      }

      if (!Array.isArray(gallery) || gallery.length === 0) {
        if (business.cover_url) {
          gallery = [business.cover_url];
        }
      }

      return NextResponse.json({
        success: true,
        business: {
          ...business,
          photos: gallery,
          microsite: microsite ? {
            ...microsite,
            gallery_urls: gallery,
          } : {
            gallery_urls: gallery,
          },
        },
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
