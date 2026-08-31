import { NextResponse } from 'next/server';
import { queryPostgres, requirePermission } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/roles/[id]
 * Get details of a single role
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const roleId = params.id;
    const roleRes = await queryPostgres(
      `SELECT 
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
      WHERE r.id = $1 OR r.slug = $1
      GROUP BY r.id`,
      [roleId]
    );

    if (!roleRes?.rows || roleRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
    }

    const r = roleRes.rows[0];

    // Fetch assigned users
    const usersRes = await queryPostgres(
      `SELECT id, full_name, email, phone, avatar_url, role FROM users WHERE role_id = $1 OR role = $2`,
      [r.id, r.slug]
    );

    return NextResponse.json({
      success: true,
      role: {
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
        assigned_users: usersRes?.rows || [],
      },
    });
  } catch (error: any) {
    console.error('[API /roles/[id] GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/roles/[id]
 * Update a role's metadata, dashboard_type, status, and permissions
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, 'roles.edit');
    if (auth.errorResponse) return auth.errorResponse;

    const roleId = params.id;
    const body = await req.json();
    const { name, description, dashboard_type, is_active, permissions } = body;

    // 1. Fetch current role
    const currentRes = await queryPostgres('SELECT * FROM roles WHERE id = $1', [roleId]);
    if (!currentRes?.rows || currentRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
    }

    // 2. Update role details in DB
    const updateRes = await queryPostgres(
      `UPDATE roles 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           dashboard_type = COALESCE($3, dashboard_type),
           is_active = COALESCE($4, is_active),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [
        name ? name.trim() : null,
        description !== undefined ? description : null,
        dashboard_type || null,
        is_active !== undefined ? Boolean(is_active) : null,
        roleId,
      ]
    );

    // 3. Update permissions if provided
    if (Array.isArray(permissions)) {
      // Clear existing mappings
      await queryPostgres('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);

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
        ...updateRes?.rows[0],
        permissions: permissions || [],
      },
    });
  } catch (error: any) {
    console.error('[API /roles/[id] PUT] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/roles/[id]
 * Delete a custom role (Protected against deleting system roles)
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, 'roles.delete');
    if (auth.errorResponse) return auth.errorResponse;

    const roleId = params.id;

    const roleRes = await queryPostgres('SELECT * FROM roles WHERE id = $1', [roleId]);
    if (!roleRes?.rows || roleRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
    }

    const role = roleRes.rows[0];
    if (role.is_system_role) {
      return NextResponse.json(
        { success: false, error: 'System roles are permanent and cannot be deleted.' },
        { status: 403 }
      );
    }

    // Reassign users of this role to default consumer role
    await queryPostgres(
      `UPDATE users SET role_id = 'role-consumer', role = 'consumer' WHERE role_id = $1`,
      [roleId]
    );

    // Delete role (cascade deletes role_permissions)
    await queryPostgres('DELETE FROM roles WHERE id = $1', [roleId]);

    return NextResponse.json({ success: true, message: `Role ${role.name} deleted successfully.` });
  } catch (error: any) {
    console.error('[API /roles/[id] DELETE] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
