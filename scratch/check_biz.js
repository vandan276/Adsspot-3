const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:zygpaf-7fomji-nokguS@database-1.cluster-cn06w4osksyi.ap-south-1.rds.amazonaws.com:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

async function test() {
  const users = await pool.query('SELECT id, email, role FROM users ORDER BY created_at DESC LIMIT 3');
  console.log('Recent users:', users.rows);
  const biz = await pool.query('SELECT id, owner_id, name, slug, tier, trusted, created_at FROM businesses ORDER BY created_at DESC LIMIT 3');
  console.log('Recent businesses:', biz.rows);
  await pool.end();
}

test();
