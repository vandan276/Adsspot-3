import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

// Automatically load environment variables from apps/web/.env.local or .env
function loadEnv() {
  const envPaths = [
    join(__dirname, '../../../../apps/web/.env.local'),
    join(__dirname, '../../../../apps/web/.env'),
    join(__dirname, '../../.env'),
    join(process.cwd(), 'apps/web/.env.local'),
    join(process.cwd(), '.env.local'),
  ];

  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
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
      console.log(`Loaded environment from: ${envPath}`);
      break;
    }
  }
}

async function runMigration() {
  loadEnv();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('YOUR_PASSWORD')) {
    console.error('❌ Error: Please set your actual database password in apps/web/.env.local (DATABASE_URL)');
    process.exit(1);
  }

  console.log('🚀 Connecting to AWS Aurora PostgreSQL cluster in Mumbai...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully to AWS Aurora PostgreSQL!');

    const schemaPath = join(__dirname, 'schema.sql');
    const sql = readFileSync(schemaPath, 'utf8');

    console.log('⚡ Executing schema migration (34 tables + PostGIS)...');
    await client.query(sql);

    console.log('🎉 Migration completed! All 34 PostgreSQL tables and PostGIS spatial extensions are live in AWS Aurora.');
    client.release();
  } catch (err: any) {
    console.error('❌ Migration Error:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
