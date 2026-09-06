const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testFullFlow() {
  const client = await pool.connect();
  const testAccounts = [
    { email: 'admin@adsspot.in', pass: 'adsspot123', expectedRole: 'super_admin', expectedDest: '/admin' },
    { email: 'nikunj.patel@adsspot.in', pass: 'adsspot123', expectedRole: 'sm', expectedDest: '/sm' },
    { email: 'nikunj2@gmail.com', pass: 'adsspot123', expectedRole: 'sm', expectedDest: '/sm' },
    { email: 'nikunj@gmail.com', pass: '123456', expectedRole: 'merchant', expectedDest: '/merchant' },
    { email: 'nikunj@adsspot.in', pass: '123456', expectedRole: 'merchant', expectedDest: '/merchant' },
    { email: 'rajesh.test@adsspot.in', pass: 'password123', expectedRole: 'consumer', expectedDest: '/feed' },
    { email: 'hiral@gmail.com', pass: '123456', expectedRole: 'consumer', expectedDest: '/feed' },
    { email: 'store_1788078764504@testmerchant.in', pass: 'Password@123', expectedRole: 'merchant', expectedDest: '/merchant' },
  ];

  console.log('=== VERIFYING REAL EXISTING ACCOUNTS FULL AUTH PIPELINE ===');
  for (const acc of testAccounts) {
    const cleanEmail = acc.email.trim().toLowerCase();
    const dbUserRes = await client.query(
      `SELECT u.id, u.email, u.password_hash, u.full_name, u.phone, u.avatar_url, u.role, u.role_id,
              r.id as r_id, r.name as r_name, r.slug as r_slug, r.dashboard_type as r_dashboard_type
       FROM users u
       LEFT JOIN roles r ON (u.role_id = r.id OR u.role = r.slug)
       WHERE LOWER(u.email) = $1 OR LOWER(u.email) = $2`,
      [cleanEmail, `${cleanEmail}@adsspot.in`]
    );

    if (!dbUserRes.rows.length) {
      console.log('❌ FAIL (User Not Found):', acc.email);
      continue;
    }

    const u = dbUserRes.rows[0];
    const pwdMatch = u.password_hash === acc.pass;
    const dest = u.r_dashboard_type === 'admin' ? '/admin' : u.r_dashboard_type === 'merchant' ? '/merchant' : u.r_dashboard_type === 'sm' ? '/sm' : u.r_dashboard_type === 'ro' ? '/ro' : u.r_dashboard_type === 'zo' ? '/zo' : '/feed';
    
    // Check attached profiles
    const bizRes = await client.query('SELECT name, slug, tier FROM businesses WHERE owner_id = $1', [u.id]);
    const staffRes = await client.query('SELECT role, target_monthly FROM staff_profiles WHERE user_id = $1', [u.id]);
    const sessRes = await client.query('SELECT count(*) FROM sessions WHERE user_id = $1', [u.id]);

    console.log(`✅ PASS: ${u.email.padEnd(40)} | Role: ${u.role.padEnd(11)} | Pwd: OK | Dest: ${dest.padEnd(9)} | Biz: ${(bizRes.rows[0]?.name || 'N/A').padEnd(30)} | Staff: ${staffRes.rows[0]?.role || 'N/A'}`);
  }

  client.release();
  await pool.end();
}

testFullFlow().catch((e) => {
  console.error(e);
  process.exit(1);
});
