import { NextResponse } from 'next/server';
import { queryPostgres, requirePermission } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/users/assign-role
 * Assigns a dynamic role to a user (Admin/Role Manager only)
 */
export async function POST(req: Request) {
  try {
    const auth = await requirePermission(req, 'roles.edit');
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const { userId, roleId } = body;

    if (!userId || !roleId) {
      return NextResponse.json(
        { success: false, error: 'Both userId and roleId are required.' },
        { status: 400 }
      );
    }

    // 1. Verify role exists
    const roleRes = await queryPostgres(
      `SELECT id, name, slug, dashboard_type FROM roles WHERE id = $1 OR slug = $1`,
      [roleId]
    );

    if (!roleRes?.rows || roleRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Role not found.' }, { status: 404 });
    }

    const role = roleRes.rows[0];

    // 2. Update user
    const updateRes = await queryPostgres(
      `UPDATE users 
       SET role_id = $1, role = $2, updated_at = NOW() 
       WHERE id = $3
       RETURNING id, email, full_name, role, role_id, updated_at`,
      [role.id, role.slug, userId]
    );

    if (!updateRes?.rows || updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updateRes.rows[0],
      role,
      message: `User ${updateRes.rows[0].full_name} assigned role ${role.name}.`,
    });
  } catch (error: any) {
    console.error('[API /users/assign-role] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
