const { Pool } = require('pg');
require('dotenv').config({ path: './apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  const plansRes = await pool.query('SELECT * FROM plans');
  console.log('Plans:', plansRes.rows);
  const subRes = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1', ['subscriptions']);
  console.log('Subscriptions columns:', subRes.rows);
  await pool.end();
}
check();
