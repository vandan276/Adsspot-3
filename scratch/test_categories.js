const { Pool } = require('pg');
require('dotenv').config({ path: './apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  const cats = await pool.query('SELECT * FROM categories');
  console.log('Categories count:', cats.rows.length);
  console.log('Categories:', cats.rows);
  await pool.end();
}
check();
