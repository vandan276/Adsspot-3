import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/permissions
 * Returns all system permissions grouped by module
 */
export async function GET() {
  try {
    const res = await queryPostgres(`
      SELECT id, key, name, description, module, created_at
      FROM permissions
      ORDER BY module ASC, key ASC
    `);

    const permissions = res?.rows || [];

    // Group by module
    const grouped: Record<string, any[]> = {};
    for (const p of permissions) {
      const mod = p.module || 'general';
      if (!grouped[mod]) {
        grouped[mod] = [];
      }
      grouped[mod]!.push(p);
    }

    return NextResponse.json({
      success: true,
      permissions,
      grouped,
    });
  } catch (error: any) {
    console.error('[API /permissions GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
