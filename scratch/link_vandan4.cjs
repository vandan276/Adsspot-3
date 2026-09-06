const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/web/.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function updateVandan() {
  const client = await pool.connect();
  
  // Update Vandan's primary user account to vandan4@gmail.com with password adsspot123
  await client.query(`
    UPDATE users
    SET email = 'vandan4@gmail.com',
        password_hash = 'adsspot123',
        full_name = 'Vandan Panchal',
        role = 'super_admin',
        role_id = 'role-super-admin',
        updated_at = NOW()
    WHERE id = 'usr-1787826217468-6tkbh';
  `);

  console.log('✅ Success! Linked user usr-1787826217468-6tkbh to email: vandan4@gmail.com (Super Admin, Password: adsspot123)');
  client.release();
  await pool.end();
}

updateVandan().catch((e) => {
  console.error(e);
  process.exit(1);
});
