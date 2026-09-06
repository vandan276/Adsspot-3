const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const B2B_MERCHANTS_LIST = [
  {
    name: 'PrecisionEng CNC & Heavy Machinery Works',
    slug: 'precisioneng-cnc-heavy-machinery-works',
    cat_slug: 'industrial-machinery',
    description: 'Premier CNC Turning, Milling, Heavy Lathe & Tool Room Machinery in GIDC Makarpura.',
    address: 'Plot 108, GIDC Industrial Zone, Makarpura, Vadodara',
    pincode: '390010',
    lat: 22.2560,
    lng: 73.1910,
    phone: '+919876543201',
    whatsapp: '+919876543201',
    logo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1200&auto=format&fit=crop&q=80',
    tier: 'elite'
  },
  {
    name: 'Zenith BioPharma Intermediates & Labs',
    slug: 'zenith-biopharma-intermediates-labs',
    cat_slug: 'chemicals',
    description: 'Specialty API Intermediates, Bulk Chemical Solvents & Analytical Testing in Nandesari GIDC.',
    address: 'Plot 42, Nandesari GIDC Industrial Estate, Vadodara',
    pincode: '391340',
    lat: 22.4120,
    lng: 73.0850,
    phone: '+919876543202',
    whatsapp: '+919876543202',
    logo_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
    tier: 'elite'
  },
  {
    name: 'Vertex Power Systems Ltd',
    slug: 'vertex-power-systems-ltd',
    cat_slug: 'electronic-component',
    description: 'Industrial Communications Boards, Multilayer PCBs, Inverters & Heavy Switchgear Components.',
    address: 'Plot 214, Makarpura GIDC Industrial Estate, Vadodara',
    pincode: '390010',
    lat: 22.2580,
    lng: 73.1935,
    phone: '+919876543203',
    whatsapp: '+919876543203',
    logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=1200&auto=format&fit=crop&q=80',
    tier: 'elite'
  },
  {
    name: 'Matrix Audio Instruments',
    slug: 'matrix-audio-instruments',
    cat_slug: 'cat-3',
    description: 'Professional Audio Control Boards, Broadcast Transmitters & Digital Acoustic Systems.',
    address: 'Phase 2, Manjusar GIDC, Savli, Vadodara',
    pincode: '391775',
    lat: 22.4580,
    lng: 73.2120,
    phone: '+919876543204',
    whatsapp: '+919876543204',
    logo_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    tier: 'premium'
  },
  {
    name: 'Gujarat TMT & Steel Fabrication Works',
    slug: 'gujarat-tmt-steel-fabrication-works',
    cat_slug: 'construction-real-estate',
    description: 'Structural Steel Beams, Fe550D TMT Bars, Prefabricated Industrial Sheds & Scaffolding.',
    address: 'National Highway 48, Ranoli Industrial Area, Vadodara',
    pincode: '391750',
    lat: 22.3810,
    lng: 73.1520,
    phone: '+919876543205',
    whatsapp: '+919876543205',
    logo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    tier: 'elite'
  },
  {
    name: 'SunShine Agro & Solar Irrigation Systems',
    slug: 'sunshine-agro-solar-irrigation-systems',
    cat_slug: 'agriculture',
    description: 'Solar Agricultural Pumps, Drip Micro-Irrigation Lines, Farm Harvesters & Hybrid Seeds.',
    address: 'Near APMC Market, Padra Road, Vadodara',
    pincode: '391440',
    lat: 22.2400,
    lng: 73.0800,
    phone: '+919876543206',
    whatsapp: '+919876543206',
    logo_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    tier: 'elite'
  },
  {
    name: 'SuratTex Synthetic & Cotton Mill Works',
    slug: 'surattex-synthetic-cotton-mill-works',
    cat_slug: 'apparel-fashion',
    description: 'Bulk Polyester & Cotton Fabrics, Industrial Uniforms, High-Speed Weaving & Dyeing Works.',
    address: 'Waghodia GIDC Industrial Zone, Vadodara',
    pincode: '391760',
    lat: 22.3020,
    lng: 73.3510,
    phone: '+919876543207',
    whatsapp: '+919876543207',
    logo_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    tier: 'premium'
  },
  {
    name: 'Shreeji Industrial Packaging & Corrugated Boxes',
    slug: 'shreeji-industrial-packaging-corrugated-boxes',
    cat_slug: 'packaging-printing',
    description: '3-Ply/5-Ply/7-Ply Heavy Duty Corrugated Boxes, Bubble Wraps, Stretch Films & Wooden Pallets.',
    address: 'Por-Ramangamdi GIDC Industrial Estate, Vadodara',
    pincode: '391243',
    lat: 22.1850,
    lng: 73.1890,
    phone: '+919876543208',
    whatsapp: '+919876543208',
    logo_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    tier: 'elite'
  }
];

async function seed() {
  const client = await pool.connect();
  for (const m of B2B_MERCHANTS_LIST) {
    const catRes = await client.query('SELECT id FROM categories WHERE id = $1 OR slug = $2 LIMIT 1', [m.cat_slug, m.cat_slug]);
    const catId = catRes.rows[0]?.id || 'industrial-machinery';
    const bizId = 'biz-' + m.slug.substring(0, 16) + '-' + Math.random().toString(36).substring(2, 6);
    
    await client.query(`
      INSERT INTO businesses (
        id, owner_id, category_id, name, slug, description, address, pincode,
        lat, lng, phone, whatsapp, logo_url, cover_url,
        trusted, status, tier, created_at
      ) VALUES (
        $1, 'usr-demo-merchant-master', $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        true, 'active', $14, NOW()
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
          phone = EXCLUDED.phone,
          whatsapp = EXCLUDED.whatsapp,
          tier = EXCLUDED.tier,
          trusted = true,
          status = 'active';
    `, [
      bizId, catId, m.name, m.slug, m.description, m.address, m.pincode,
      m.lat, m.lng, m.phone, m.whatsapp, m.logo_url, m.cover_url, m.tier
    ]);
    console.log('Seeded/Updated:', m.name, '-> Cat ID:', catId);
  }
  client.release();
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
