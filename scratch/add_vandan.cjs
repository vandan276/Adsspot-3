const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function addVandan() {
  const client = await pool.connect();
  const userId = 'usr-vandan4-admin';
  const avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=vandan4%40gmail.com';

  const existing = await client.query('SELECT id FROM users WHERE LOWER(email) = $1', ['vandan4@gmail.com']);

  if (existing.rows && existing.rows.length > 0) {
    await client.query(
      `UPDATE users
       SET password_hash = $1, full_name = $2, role = $3, role_id = $4, updated_at = NOW()
       WHERE id = $5`,
      ['adsspot123', 'Vandan Panchal', 'super_admin', 'role-super-admin', existing.rows[0].id]
    );
    console.log('✅ Updated existing user record for vandan4@gmail.com');
  } else {
    await client.query(
      `INSERT INTO users (id, email, password_hash, full_name, phone, avatar_url, role, role_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        userId,
        'vandan4@gmail.com',
        'adsspot123',
        'Vandan Panchal',
        '+919876543299',
        avatar,
        'super_admin',
        'role-super-admin',
      ]
    );
    console.log('✅ Inserted new user record for vandan4@gmail.com');
  }

  // Also ensure wallet
  await client.query(
    `INSERT INTO wallets (id, user_id, balance, currency, updated_at)
     VALUES ($1, $2, 5000.00, 'INR', NOW())
     ON CONFLICT (id) DO NOTHING`,
    [`wallet-${userId}`, userId]
  );

  console.log('🎉 Successfully verified vandan4@gmail.com in AWS PostgreSQL database!');
  client.release();
  await pool.end();
}

addVandan().catch((e) => {
  console.error(e);
  process.exit(1);
});
