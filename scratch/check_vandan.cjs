const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  const client = await pool.connect();
  const res = await client.query('SELECT id, email, password_hash, full_name, phone, role, role_id FROM users WHERE email = $1', ['vandan4@gmail.com']);
  console.log('=== VANDAN4 USER IN AWS POSTGRESQL ===');
  console.table(res.rows);
  client.release();
  await pool.end();
}

check().catch(console.error);
