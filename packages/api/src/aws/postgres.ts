import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;

export const DEFAULT_AURORA_DATABASE_URL =
  'postgresql://postgres:zygpaf-7fomji-nokguS@database-1.cluster-cn06w4osksyi.ap-south-1.rds.amazonaws.com:5432/postgres';

export const getPostgresPool = (): Pool => {
  const connectionString = process.env.DATABASE_URL || DEFAULT_AURORA_DATABASE_URL;

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('[AWS Aurora Postgres] Unexpected client error:', err);
    });
  }

  return pool;
};

/**
 * Execute a parameterized query against Amazon Aurora PostgreSQL
 */
export async function queryPostgres<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T> | null> {
  const p = getPostgresPool();
  if (!p) {
    return null;
  }
  return p.query<T>(text, params);
}

/**
 * Hyperlocal PostGIS Distance Query Helper
 * Finds businesses within `radiusMeters` from given (lat, lng) sorted by distance.
 */
export async function findBusinessesNearby(
  lat: number,
  lng: number,
  radiusMeters: number = 3000,
  limit: number = 20
) {
  const sql = `
    SELECT 
      id, name, slug, address, pincode, lat, lng, phone, whatsapp, 
      logo_url, cover_url, trusted, tier,
      ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_meters
    FROM businesses
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
      AND status = 'active'
    ORDER BY distance_meters ASC
    LIMIT $4;
  `;
  return queryPostgres(sql, [lng, lat, radiusMeters, limit]);
}
