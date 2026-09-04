const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const B2B_BUSINESSES = [
  {
    name: 'PrecisionEng CNC & Heavy Machinery Works',
    slug: 'precisioneng-cnc-heavy-machinery-works',
    category_id: 'industrial-machinery',
    description: 'Premier CNC Turning, Milling, Heavy Lathe & Tool Room Machinery in GIDC Makarpura.',
    address: 'Plot 108, GIDC Industrial Zone, Makarpura, Vadodara',
    pincode: '390010',
    lat: 22.2560,
    lng: 73.1910,
    phone: '+919876543201',
    whatsapp: '+919876543201',
    logo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1200&auto=format&fit=crop&q=80',
    email: 'contact@precisioneng.in',
    website: 'https://precisioneng.adsspot.in',
    instagram: '@precisioneng_vadodara',
    upi_id: 'precisioneng@okhdfcbank',
    opening_hours: '08:30 AM - 08:00 PM (Mon - Sat)',
    tier: 'elite',
  },
  {
    name: 'Zenith BioPharma Intermediates & Labs',
    slug: 'zenith-biopharma-intermediates-labs',
    category_id: 'chemicals',
    description: 'Specialty API Intermediates, Bulk Chemical Solvents & Analytical Testing in Nandesari GIDC.',
    address: 'Plot 42, Nandesari GIDC Industrial Estate, Vadodara',
    pincode: '391340',
    lat: 22.4120,
    lng: 73.0850,
    phone: '+919876543202',
    whatsapp: '+919876543202',
    logo_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
    email: 'sales@zenithbiopharma.in',
    website: 'https://zenithbiopharma.adsspot.in',
    instagram: '@zenithbiopharma',
    upi_id: 'zenithbio@okhdfcbank',
    opening_hours: '09:00 AM - 07:00 PM (Mon - Sat)',
    tier: 'elite',
  },
  {
    name: 'Vertex Power Systems Ltd',
    slug: 'vertex-power-systems-ltd',
    category_id: 'electronic-component',
    description: 'Industrial Communications Boards, Multilayer PCBs, Inverters & Heavy Switchgear Components.',
    address: 'Plot 214, Makarpura GIDC Industrial Estate, Vadodara',
    pincode: '390010',
    lat: 22.2580,
    lng: 73.1935,
    phone: '+919876543203',
    whatsapp: '+919876543203',
    logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=1200&auto=format&fit=crop&q=80',
    email: 'info@vertexpower.in',
    website: 'https://vertexpower.adsspot.in',
    instagram: '@vertexpowersystems',
    upi_id: 'vertexpower@okhdfcbank',
    opening_hours: '09:00 AM - 07:30 PM (Mon - Sat)',
    tier: 'elite',
  },
  {
    name: 'Matrix Audio Instruments',
    slug: 'matrix-audio-instruments',
    category_id: 'electronics',
    description: 'Professional Audio Control Boards, Broadcast Transmitters & Digital Acoustic Systems.',
    address: 'Phase 2, Manjusar GIDC, Savli, Vadodara',
    pincode: '391775',
    lat: 22.4580,
    lng: 73.2120,
    phone: '+919876543204',
    whatsapp: '+919876543204',
    logo_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    email: 'orders@matrixaudio.in',
    website: 'https://matrixaudio.adsspot.in',
    instagram: '@matrixaudioinstruments',
    upi_id: 'matrixaudio@okhdfcbank',
    opening_hours: '09:30 AM - 06:30 PM (Mon - Sat)',
    tier: 'premium',
  },
  {
    name: 'Gujarat TMT & Steel Fabrication Works',
    slug: 'gujarat-tmt-steel-fabrication-works',
    category_id: 'construction-real-estate',
    description: 'Structural Steel Beams, Fe550D TMT Bars, Prefabricated Industrial Sheds & Scaffolding.',
    address: 'National Highway 48, Ranoli Industrial Area, Vadodara',
    pincode: '391750',
    lat: 22.3810,
    lng: 73.1520,
    phone: '+919876543205',
    whatsapp: '+919876543205',
    logo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    email: 'sales@gujarattmt.in',
    website: 'https://gujarattmt.adsspot.in',
    instagram: '@gujarattmtsteel',
    upi_id: 'gujarattmt@okhdfcbank',
    opening_hours: '08:00 AM - 08:00 PM (Mon - Sun)',
    tier: 'elite',
  },
  {
    name: 'SunShine Agro & Solar Irrigation Systems',
    slug: 'sunshine-agro-solar-irrigation-systems',
    category_id: 'agriculture',
    description: 'Solar Agricultural Pumps, Drip Micro-Irrigation Lines, Farm Harvesters & Hybrid Seeds.',
    address: 'Near APMC Market, Padra Road, Vadodara',
    pincode: '391440',
    lat: 22.2400,
    lng: 73.0800,
    phone: '+919876543206',
    whatsapp: '+919876543206',
    logo_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    email: 'care@sunshineagro.in',
    website: 'https://sunshineagro.adsspot.in',
    instagram: '@sunshineagro',
    upi_id: 'sunshineagro@okhdfcbank',
    opening_hours: '09:00 AM - 07:00 PM (Mon - Sat)',
    tier: 'elite',
  },
  {
    name: 'SuratTex Synthetic & Cotton Mill Works',
    slug: 'surattex-synthetic-cotton-mill-works',
    category_id: 'apparel-fashion',
    description: 'Bulk Polyester & Cotton Fabrics, Industrial Uniforms, High-Speed Weaving & Dyeing Works.',
    address: 'Waghodia GIDC Industrial Zone, Vadodara',
    pincode: '391760',
    lat: 22.3020,
    lng: 73.3510,
    phone: '+919876543207',
    whatsapp: '+919876543207',
    logo_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    email: 'export@surattex.in',
    website: 'https://surattex.adsspot.in',
    instagram: '@surattexmills',
    upi_id: 'surattex@okhdfcbank',
    opening_hours: '08:30 AM - 07:30 PM (Mon - Sat)',
    tier: 'premium',
  },
  {
    name: 'Shreeji Industrial Packaging & Corrugated Boxes',
    slug: 'shreeji-industrial-packaging-corrugated-boxes',
    category_id: 'packaging-printing',
    description: '3-Ply/5-Ply/7-Ply Heavy Duty Corrugated Boxes, Bubble Wraps, Stretch Films & Wooden Pallets.',
    address: 'Por-Ramangamdi GIDC Industrial Estate, Vadodara',
    pincode: '391243',
    lat: 22.1850,
    lng: 73.1890,
    phone: '+919876543208',
    whatsapp: '+919876543208',
    logo_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    email: 'sales@shreejipack.in',
    website: 'https://shreejipack.adsspot.in',
    instagram: '@shreejipackaging',
    upi_id: 'shreejipack@okhdfcbank',
    opening_hours: '08:00 AM - 08:00 PM (Mon - Sat)',
    tier: 'elite',
  },
];

const B2B_CATEGORIES_TO_ENSURE = [
  { id: 'agriculture', name: 'Agriculture & Farming', slug: 'agriculture', icon: 'Sun', sort_order: 37 },
  { id: 'apparel-fashion', name: 'Apparel & Textiles', slug: 'apparel-fashion', icon: 'Shirt', sort_order: 38 },
  { id: 'automobiles-accessories', name: 'Automobiles Accessories', slug: 'automobiles-accessories', icon: 'Car', sort_order: 39 },
  { id: 'baby-care', name: 'Baby Care & Toys Wholesale', slug: 'baby-care', icon: 'ShoppingBag', sort_order: 40 },
  { id: 'beauty-personal-care', name: 'Beauty & Personal Care', slug: 'beauty-personal-care', icon: 'Sparkles', sort_order: 41 },
  { id: 'chemicals', name: 'Chemicals & Solvents', slug: 'chemicals', icon: 'Printer', sort_order: 42 },
  { id: 'construction-real-estate', name: 'Construction & Real Estate', slug: 'construction-real-estate', icon: 'Building2', sort_order: 43 },
  { id: 'electronic-component', name: 'Electronic Components', slug: 'electronic-component', icon: 'Cpu', sort_order: 44 },
  { id: 'electronics', name: 'Electronics & Appliances', slug: 'electronics', icon: 'Smartphone', sort_order: 45 },
  { id: 'energy', name: 'Energy & Solar Power', slug: 'energy', icon: 'Calendar', sort_order: 46 },
  { id: 'food-beverage', name: 'Food & Beverage Wholesale', slug: 'food-beverage', icon: 'Utensils', sort_order: 47 },
  { id: 'footwear-accessories', name: 'Footwear & Accessories', slug: 'footwear-accessories', icon: 'ShoppingBag', sort_order: 48 },
  { id: 'furniture', name: 'Furniture & Fixtures', slug: 'furniture', icon: 'Home', sort_order: 49 },
  { id: 'gifts-crafts', name: 'Gifts & Crafts Wholesale', slug: 'gifts-crafts', icon: 'Sparkles', sort_order: 50 },
  { id: 'health-medical', name: 'Health & Medical Equipment', slug: 'health-medical', icon: 'Stethoscope', sort_order: 51 },
  { id: 'home-garden', name: 'Home & Garden', slug: 'home-garden', icon: 'Home', sort_order: 52 },
  { id: 'industrial-machinery', name: 'Industrial Machinery & CNC', slug: 'industrial-machinery', icon: 'Factory', sort_order: 53 },
  { id: 'it-components', name: 'IT Components & Servers', slug: 'it-components', icon: 'Cpu', sort_order: 54 },
  { id: 'jewellery-gems', name: 'Jewellery, Gems & Gold', slug: 'jewellery-gems', icon: 'Gem', sort_order: 55 },
  { id: 'packaging-printing', name: 'Packaging & Printing Materials', slug: 'packaging-printing', icon: 'Printer', sort_order: 56 },
];

async function run() {
  const client = await pool.connect();
  console.log('🚀 Ensuring all B2B categories and authentic merchants in AWS Aurora PostgreSQL...');

  for (const cat of B2B_CATEGORIES_TO_ENSURE) {
    const existing = await client.query('SELECT id FROM categories WHERE slug = $1 LIMIT 1', [cat.slug]);
    if (existing.rows && existing.rows.length > 0) {
      await client.query(
        `UPDATE categories SET name = $1, icon = $2 WHERE id = $3`,
        [cat.name, cat.icon, existing.rows[0].id]
      );
    } else {
      await client.query(
        `INSERT INTO categories (id, name, slug, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, slug = EXCLUDED.slug, icon = EXCLUDED.icon`,
        [cat.id, cat.name, cat.slug, cat.icon, cat.sort_order]
      );
    }
  }

  const merchantUserId = 'usr-demo-merchant-master';

  for (const b of B2B_BUSINESSES) {
    // Resolve valid category_id
    const catCheck = await client.query(
      `SELECT id FROM categories WHERE id = $1 OR slug = $1 LIMIT 1`,
      [b.category_id]
    );
    const validCatId = catCheck.rows[0]?.id || 'b2b-manufacturers';

    const bizId = 'biz-' + b.category_id + '-' + Math.random().toString(36).substring(2, 7);
    const insertRes = await client.query(
      `INSERT INTO businesses (
        id, owner_id, category_id, name, slug, description, address, pincode,
        lat, lng, phone, whatsapp, logo_url, cover_url,
        email, website, instagram, upi_id, opening_hours,
        trusted, status, tier, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        true, 'active', $20, NOW()
      )
      ON CONFLICT (slug) DO UPDATE
      SET category_id = EXCLUDED.category_id,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          address = EXCLUDED.address,
          pincode = EXCLUDED.pincode,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          logo_url = EXCLUDED.logo_url,
          cover_url = EXCLUDED.cover_url,
          email = EXCLUDED.email,
          website = EXCLUDED.website,
          instagram = EXCLUDED.instagram,
          upi_id = EXCLUDED.upi_id,
          opening_hours = EXCLUDED.opening_hours,
          trusted = true,
          status = 'active',
          tier = EXCLUDED.tier
      RETURNING id, name, slug;`,
      [
        bizId,
        merchantUserId,
        validCatId,
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
        b.email,
        b.website,
        b.instagram,
        b.upi_id,
        b.opening_hours,
        b.tier,
      ]
    );

    const currentBizId = insertRes.rows[0]?.id || bizId;

    const themeConfig = {
      theme: 'spot_ring',
      social_links: {
        instagram: b.instagram,
        website: b.website,
        email: b.email,
        upi_id: b.upi_id,
        opening_hours: b.opening_hours,
      },
    };

    await client.query(
      `INSERT INTO digital_cards (id, business_id, theme_config, click_counts, updated_at)
       VALUES ($1, $2, $3, '{"views": 380, "whatsapp": 65, "calls": 28}', NOW())
       ON CONFLICT (business_id) DO UPDATE
       SET theme_config = EXCLUDED.theme_config, updated_at = NOW()`,
      ['card-' + currentBizId, currentBizId, JSON.stringify(themeConfig)]
    );

    await client.query(
      `INSERT INTO microsites (id, business_id, hero_title, about_text, gallery_urls, hours, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (business_id) DO UPDATE
       SET hero_title = EXCLUDED.hero_title,
           about_text = EXCLUDED.about_text,
           hours = EXCLUDED.hours,
           updated_at = NOW()`,
      [
        'site-' + currentBizId,
        currentBizId,
        b.name,
        b.description,
        [
          b.cover_url,
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1200&auto=format&fit=crop&q=80',
        ],
        JSON.stringify({ all_days: b.opening_hours }),
      ]
    );
  }

  console.log('✅ Success: Seeded B2B categories and businesses into AWS PostgreSQL!');
  client.release();
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
