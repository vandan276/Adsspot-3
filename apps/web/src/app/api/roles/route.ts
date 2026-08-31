import { NextResponse } from 'next/server';
import { queryPostgres, requirePermission } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/roles
 * List all roles, their assigned permissions, and active user counts
 */
export async function GET(_req: Request) {
  try {
    const rolesRes = await queryPostgres(`
      SELECT 
        r.id, r.name, r.slug, r.description, r.dashboard_type, 
        r.is_system_role, r.is_active, r.created_at, r.updated_at,
        COUNT(DISTINCT u.id) as user_count,
        COALESCE(
          json_agg(DISTINCT p.key) FILTER (WHERE p.key IS NOT NULL),
          '[]'::json
        ) as permissions
      FROM roles r
      LEFT JOIN users u ON (u.role_id = r.id OR u.role = r.slug)
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      GROUP BY r.id
      ORDER BY r.is_system_role DESC, r.created_at ASC
    `);

    const roles = (rolesRes?.rows || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      dashboard_type: r.dashboard_type || 'user',
      is_system_role: Boolean(r.is_system_role),
      is_active: r.is_active !== false,
      created_at: r.created_at,
      updated_at: r.updated_at,
      user_count: parseInt(r.user_count || '0', 10),
      permissions: Array.isArray(r.permissions) ? r.permissions : [],
    }));

    return NextResponse.json({ success: true, roles });
  } catch (error: any) {
    console.error('[API /roles GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/roles
 * Create a new dynamic role with permissions (Admin only)
 */
export async function POST(req: Request) {
  try {
    // 1. Check authorization (roles.create permission required)
    const auth = await requirePermission(req, 'roles.create');
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const {
      name,
      slug,
      description,
      dashboard_type = 'employee',
      permissions = [],
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Role name is required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = (slug || cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_')).trim();
    const roleId = `role-${cleanSlug.replace(/_/g, '-')}-${Date.now().toString(36)}`;

    // 2. Insert into roles table
    const insertRes = await queryPostgres(
      `INSERT INTO roles (id, name, slug, description, dashboard_type, is_system_role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, FALSE, TRUE, NOW(), NOW())
       RETURNING *`,
      [roleId, cleanName, cleanSlug, description || null, dashboard_type]
    );

    const createdRole = insertRes?.rows[0];

    // 3. Assign permissions in role_permissions table
    if (Array.isArray(permissions) && permissions.length > 0) {
      for (const pKey of permissions) {
        const permRes = await queryPostgres('SELECT id FROM permissions WHERE key = $1', [pKey]);
        if (permRes?.rows && permRes.rows.length > 0) {
          await queryPostgres(
            `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [roleId, permRes.rows[0].id]
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      role: {
        ...createdRole,
        permissions,
        user_count: 0,
      },
    });
  } catch (error: any) {
    console.error('[API /roles POST] Error:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'A role with this slug or name already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
