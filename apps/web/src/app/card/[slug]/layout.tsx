import React from 'react';
import type { Metadata } from 'next';
import { queryPostgres } from '@adsspot/api/server';

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adsspot.in';
  const cardUrl = `${baseUrl}/card/${slug}`;

  try {
    const bizRes = await queryPostgres(
      `SELECT id, name, description, address, pincode, cover_url, logo_url, tier FROM businesses WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (bizRes?.rows && bizRes.rows.length > 0) {
      const biz = bizRes.rows[0];

      // Fetch microsite gallery as photo source fallback
      const siteRes = await queryPostgres(
        `SELECT gallery_urls FROM microsites WHERE business_id = $1 LIMIT 1`,
        [biz.id]
      );

      let galleryPhotos: string[] = [];
      if (siteRes?.rows?.[0]?.gallery_urls) {
        const raw = siteRes.rows[0].gallery_urls;
        if (Array.isArray(raw)) galleryPhotos = raw;
        else if (typeof raw === 'string') {
          try {
            galleryPhotos = JSON.parse(raw);
          } catch {
            galleryPhotos = [raw];
          }
        }
      }

      const rawCoverUrl = biz.cover_url || (galleryPhotos && galleryPhotos[0]) || biz.logo_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200';
      const absoluteCoverUrl = rawCoverUrl.startsWith('http://') || rawCoverUrl.startsWith('https://')
        ? rawCoverUrl
        : `${baseUrl}${rawCoverUrl.startsWith('/') ? '' : '/'}${rawCoverUrl}`;

      const title = `${biz.name} — Digital Business Card | Adsspot`;
      const description = biz.description || `Verified business in ${biz.address || 'India'} on Adsspot offering premium local products & services.`;

      return {
        title,
        description,
        metadataBase: new URL(baseUrl),
        openGraph: {
          title: `${biz.name} — Digital Visiting Card`,
          description,
          url: cardUrl,
          siteName: 'Adsspot Local Platform',
          images: [
            {
              url: absoluteCoverUrl,
              width: 1200,
              height: 630,
              alt: `${biz.name} Storefront Cover`,
            },
          ],
          locale: 'en_IN',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${biz.name} — Digital Visiting Card`,
          description,
          images: [absoluteCoverUrl],
        },
      };
    }
  } catch (err) {
    console.warn('[CardLayout] Error generating Open Graph metadata:', err);
  }

  return {
    title: 'Digital Business Card | Adsspot',
    description: 'Discover and connect with verified local businesses on Adsspot.',
  };
}

export default function DigitalCardLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
