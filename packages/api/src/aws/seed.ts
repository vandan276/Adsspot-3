import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import { SEED_CATEGORIES, SEED_BUSINESSES, SEED_POSTS, SEED_STORIES, SEED_LEADS } from '../seedData';

function loadEnv() {
  const envPaths = [
    join(__dirname, '../../../../apps/web/.env.local'),
    join(__dirname, '../../../../apps/web/.env'),
    join(process.cwd(), 'apps/web/.env.local'),
  ];
  for (const p of envPaths) {
    if (existsSync(p)) {
      const content = readFileSync(p, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/(^['"]|['"]$)/g, '');
          if (key && val && !process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
      break;
    }
  }
}

async function seedDatabase() {
  loadEnv();
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log('🌱 Seeding initial records into AWS Aurora PostgreSQL...');

    // 1. Seed Users
    const users = [
      { id: 'usr-consumer-1', phone: '+919876543210', full_name: 'Aarav Sharma', role: 'consumer' },
      { id: 'usr-merchant-1', phone: '+919820012345', full_name: 'Rajesh Mehta', role: 'merchant' },
      { id: 'usr-sm-1', phone: '+919811122233', full_name: 'Vikram Desai', role: 'sm' },
      { id: 'usr-ro-1', phone: '+919822233344', full_name: 'Sunita Rao', role: 'ro' },
      { id: 'usr-zo-1', phone: '+919833344455', full_name: 'Amitabh Joshi', role: 'zo' },
      { id: 'usr-admin-1', phone: '+919844455566', full_name: 'Rohan Varma', role: 'super_admin' },
    ];

    for (const u of users) {
      await client.query(
        `INSERT INTO users (id, phone, full_name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [u.id, u.phone, u.full_name, u.role]
      );
    }

    // 2. Seed Categories
    for (const c of SEED_CATEGORIES) {
      await client.query(
        `INSERT INTO categories (id, name, slug, icon, sort_order) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
        [c.id, c.name, c.slug, c.icon, c.sort_order]
      );
    }

    // 3. Seed Businesses
    for (const b of SEED_BUSINESSES) {
      await client.query(
        `INSERT INTO businesses (id, owner_id, category_id, name, slug, description, address, pincode, lat, lng, phone, whatsapp, logo_url, cover_url, trusted, tier, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (id) DO NOTHING`,
        [
          b.id,
          'usr-merchant-1',
          b.category_id,
          b.name,
          b.slug,
          b.description,
          b.address,
          b.pincode,
          b.lat,
          b.lng,
          b.phone,
          b.whatsapp || null,
          b.logo_url || null,
          b.cover_url || null,
          b.trusted || false,
          b.tier,
          b.status,
        ]
      );
    }

    // 4. Seed Posts
    for (const p of SEED_POSTS) {
      await client.query(
        `INSERT INTO posts (id, business_id, caption, image_urls, likes_count, comments_count)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.business_id, p.caption, p.image_urls, p.likes_count, p.comments_count]
      );
    }

    // 5. Seed Stories
    for (const s of SEED_STORIES) {
      await client.query(
        `INSERT INTO stories (id, business_id, media_url, expires_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.business_id, s.media_url, s.expires_at]
      );
    }

    // 6. Seed Leads
    for (const l of SEED_LEADS) {
      await client.query(
        `INSERT INTO leads (id, sm_user_id, business_name, owner_name, phone, pincode, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [l.id, l.sm_user_id, l.business_name, l.owner_name, l.phone, l.pincode, l.status]
      );
    }

    console.log('✅ Seeding completed successfully in AWS Aurora PostgreSQL!');
    client.release();
  } catch (err: any) {
    console.error('❌ Seeding Error:', err.message);
  } finally {
    await pool.end();
  }
}

seedDatabase();
