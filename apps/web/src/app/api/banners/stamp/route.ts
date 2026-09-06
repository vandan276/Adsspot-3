import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TemplateLayout {
  title: string;
  subtitle: string;
  bgColor1: string;
  bgColor2: string;
  accentColor: string;
  theme: string;
}

const TEMPLATES: Record<string, TemplateLayout> = {
  diwali: {
    title: 'Happy Diwali & Prosperous New Year!',
    subtitle: 'Exclusive Festive Offers & Discounts',
    bgColor1: '#3A0B13',
    bgColor2: '#981837',
    accentColor: '#F2B604',
    theme: 'Deepavali Festival Special',
  },
  holi: {
    title: 'Colors of Joy & Happiness!',
    subtitle: 'Grand Festive Sale This Week',
    bgColor1: '#4A154B',
    bgColor2: '#E01E5A',
    accentColor: '#ECB22E',
    theme: 'Holi Dhamaka Sale',
  },
  weekend: {
    title: 'Super Weekend Mega Clearance!',
    subtitle: 'Flat 30% Off on All Best Sellers',
    bgColor1: '#0E2A47',
    bgColor2: '#4787F2',
    accentColor: '#F2B604',
    theme: 'Weekend Special Offer',
  },
  daily: {
    title: 'Daily Fresh Deals & Highlights',
    subtitle: 'Visit our Store or Call Today',
    bgColor1: '#064E3B',
    bgColor2: '#35AB4E',
    accentColor: '#F2B604',
    theme: 'Daily Store Highlight',
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const templateKey = searchParams.get('template') || 'diwali';
    const bizName = (searchParams.get('bizName') || 'Adsspot Merchant').slice(0, 32);
    const phone = (searchParams.get('phone') || '+91 98765 43210').slice(0, 20);
    const address = (searchParams.get('address') || 'Main Market, India').slice(0, 45);
    const category = (searchParams.get('category') || 'Retail & Shopping').slice(0, 25);

    const tpl: TemplateLayout = TEMPLATES[templateKey] ?? TEMPLATES.diwali!;

    // Build pure scalable SVG banner (1080x1080 standard square banner)
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${tpl.bgColor1}" />
      <stop offset="100%" stop-color="${tpl.bgColor2}" />
    </linearGradient>
    <linearGradient id="spotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4787F2" />
      <stop offset="33%" stop-color="#35AB4E" />
      <stop offset="66%" stop-color="#F2B604" />
      <stop offset="100%" stop-color="#981837" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1080" fill="url(#bgGrad)" />

  <!-- Decorative Patterns -->
  <circle cx="950" cy="150" r="300" fill="${tpl.accentColor}" opacity="0.08" />
  <circle cx="100" cy="850" r="250" fill="${tpl.accentColor}" opacity="0.06" />

  <!-- Header Category Pill -->
  <g transform="translate(60, 60)">
    <rect width="260" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.15" />
    <text x="130" y="33" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="700" text-anchor="middle" letter-spacing="1">${tpl.theme.toUpperCase()}</text>
  </g>

  <!-- Brand Signature Top Right -->
  <g transform="translate(860, 60)">
    <rect width="160" height="52" rx="26" fill="url(#spotGrad)" opacity="0.9" />
    <text x="80" y="33" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="800" text-anchor="middle">ADSSPOT</text>
  </g>

  <!-- Central Festive Offer Card -->
  <g transform="translate(70, 200)" filter="url(#shadow)">
    <rect width="940" height="580" rx="36" fill="#FFFFFF" fill-opacity="0.07" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2" />
    
    <!-- Accent Badge inside Hero -->
    <rect x="370" y="50" width="200" height="44" rx="22" fill="${tpl.accentColor}" />
    <text x="470" y="78" fill="#17181C" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="800" text-anchor="middle">SPECIAL PROMO</text>

    <!-- Main Title -->
    <text x="470" y="190" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-size="52" font-weight="800" text-anchor="middle">${tpl.title}</text>
    
    <!-- Subtitle -->
    <text x="470" y="260" fill="${tpl.accentColor}" font-family="Inter, sans-serif" font-size="30" font-weight="600" text-anchor="middle">${tpl.subtitle}</text>

    <!-- Decorative Divider Line -->
    <line x1="200" y1="320" x2="740" y2="320" stroke="#FFFFFF" stroke-opacity="0.25" stroke-dasharray="8 8" stroke-width="2" />

    <!-- Offer Callout Box -->
    <rect x="180" y="370" width="580" height="130" rx="24" fill="#FFFFFF" fill-opacity="0.12" />
    <text x="470" y="425" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-size="34" font-weight="800" text-anchor="middle">VISIT US FOR EXCLUSIVE IN-STORE DEALS</text>
    <text x="470" y="465" fill="#E2E8F0" font-family="Inter, sans-serif" font-size="20" font-weight="500" text-anchor="middle">Show this banner to unlock bonus cashback on Spot Wallet!</text>
  </g>

  <!-- Bottom Dynamic Stamped Merchant Brand Plate -->
  <g transform="translate(70, 820)" filter="url(#shadow)">
    <rect width="940" height="190" rx="28" fill="#FFFFFF" />

    <!-- Spot Ring Avatar Frame for Business Logo/Initial -->
    <g transform="translate(30, 25)">
      <rect width="140" height="140" rx="24" fill="url(#spotGrad)" />
      <rect x="4" y="4" width="132" height="132" rx="20" fill="#17181C" />
      <text x="70" y="85" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-size="52" font-weight="800" text-anchor="middle">${bizName.charAt(0).toUpperCase()}</text>
    </g>

    <!-- Business Details -->
    <g transform="translate(195, 35)">
      <text x="0" y="36" fill="#17181C" font-family="Plus Jakarta Sans, sans-serif" font-size="36" font-weight="800">${bizName}</text>
      <text x="0" y="70" fill="#35AB4E" font-family="Inter, sans-serif" font-size="20" font-weight="700">✓ Verified Merchant • ${category}</text>
      <text x="0" y="105" fill="#64748B" font-family="Inter, sans-serif" font-size="20" font-weight="500">📍 ${address}</text>
    </g>

    <!-- Contact & Call-to-action Pill -->
    <g transform="translate(680, 55)">
      <rect width="230" height="80" rx="40" fill="#4787F2" />
      <text x="115" y="35" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" text-anchor="middle">CALL / WHATSAPP</text>
      <text x="115" y="62" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="800" text-anchor="middle">${phone}</text>
    </g>
  </g>
</svg>
`.trim();

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to stamp banner' }, { status: 500 });
  }
}
