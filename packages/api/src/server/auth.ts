import { queryPostgres } from '../aws/postgres';
import { AuthUser, DashboardType, Role, StaffProfile, Business } from '@adsspot/types';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'adsspot_session';
export const SESSION_DURATION_DAYS = 30;

export interface SessionContext {
  user: AuthUser;
  sessionId: string;
  roleData: Role;
  permissions: string[];
}

/**
 * Extract session token from Request (Cookie header, x-session-token header, or Authorization: Bearer header)
 */
export function extractSessionToken(req: Request): string | null {
  // 1. Check Authorization: Bearer <token>
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  // 2. Check x-session-token header
  const xSessionToken = req.headers.get('x-session-token');
  if (xSessionToken && xSessionToken.trim()) {
    return xSessionToken.trim();
  }

  // 3. Check Cookie: adsspot_session=<token>
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith(`${SESSION_COOKIE_NAME}=`)) {
        const token = decodeURIComponent(c.substring(SESSION_COOKIE_NAME.length + 1));
        if (token) return token;
      }
    }
  }

  return null;
}

/**
 * Create a new cryptographic session in PostgreSQL and return token + cookie string
 */
export async function createSession(userId: string): Promise<{
  token: string;
  expiresAt: Date;
  cookieHeader: string;
}> {
  const token = `adsspot_sess_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await queryPostgres(
    `INSERT INTO sessions (id, user_id, expires_at, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [token, userId, expiresAt.toISOString()]
  );

  // Note: Only set Secure flag when served over HTTPS. On HTTP/localhost, SameSite=Lax HttpOnly ensures proper persistence without Safari cookie drops.
  const cookieHeader = `${SESSION_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}`;

  return { token, expiresAt, cookieHeader };
}

/**
 * Destroy a session from PostgreSQL
 */
export async function destroySession(token: string): Promise<void> {
  if (!token) return;
  await queryPostgres(`DELETE FROM sessions WHERE id = $1`, [token]);
}

/**
 * Get authenticated user, role, permissions, and business/staff profiles from database session
 */
export async function getAuthenticatedUser(req: Request): Promise<SessionContext | null> {
  try {
    const token = extractSessionToken(req);
    if (!token) return null;

    // 1. Verify session in PostgreSQL
    const sessionRes = await queryPostgres(
      `SELECT s.id as session_id, s.user_id, s.expires_at,
              u.id, u.email, u.phone, u.full_name, u.avatar_url, u.role, u.role_id, u.created_at, u.updated_at,
              r.id as r_id, r.name as r_name, r.slug as r_slug, r.description as r_description, 
              r.dashboard_type as r_dashboard_type, r.is_system_role, r.is_active
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN roles r ON (u.role_id = r.id OR u.role = r.slug)
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (!sessionRes?.rows || sessionRes.rows.length === 0) {
      return null;
    }

    const row = sessionRes.rows[0];

    // 2. Fetch all assigned permissions for user's role
    const effectiveRoleId = row.r_id || row.role_id || 'role-consumer';
    const permRes = await queryPostgres(
      `SELECT p.key 
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = $1`,
      [effectiveRoleId]
    );

    const permissions: string[] = (permRes?.rows || []).map((p: any) => p.key);

    // If Super Admin, grant all permissions
    const isSuperAdmin = row.role === 'super_admin' || row.r_slug === 'super_admin';
    if (isSuperAdmin && !permissions.includes('roles.create')) {
      permissions.push(
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
        'merchants.view', 'merchants.create', 'merchants.edit', 'merchants.delete', 'merchants.manage_own',
        'posts.view', 'posts.create', 'posts.edit', 'posts.delete',
        'stories.view', 'stories.create', 'stories.delete',
        'media.view', 'media.upload', 'media.delete',
        'staff.view', 'staff.create', 'staff.edit', 'staff.delete',
        'field.checkin', 'field.visits',
        'reports.view', 'settings.manage'
      );
    }

    // 3. Fetch linked Business Profile if merchant
    const bizRes = await queryPostgres(
      `SELECT * FROM businesses WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [row.id]
    );
    const businessProfile: Business | null = bizRes?.rows[0] || null;

    // 4. Fetch linked Staff Profile if staff
    const staffRes = await queryPostgres(
      `SELECT * FROM staff_profiles WHERE user_id = $1 LIMIT 1`,
      [row.id]
    );
    const staffProfile: StaffProfile | null = staffRes?.rows[0] || null;

    // 5. Fetch Wallet
    const walletRes = await queryPostgres(
      `SELECT balance, currency FROM wallets WHERE user_id = $1 LIMIT 1`,
      [row.id]
    );
    const walletBalance = parseFloat(walletRes?.rows[0]?.balance || '0.0');

    const roleData: Role = {
      id: effectiveRoleId,
      name: row.r_name || (row.role ? row.role.toUpperCase() : 'Consumer'),
      slug: row.r_slug || row.role || 'consumer',
      description: row.r_description || null,
      dashboard_type: (row.r_dashboard_type || (row.role === 'super_admin' ? 'admin' : row.role === 'merchant' ? 'merchant' : row.role === 'sm' ? 'sm' : row.role === 'ro' ? 'ro' : row.role === 'zo' ? 'zo' : 'user')) as DashboardType,
      is_system_role: Boolean(row.is_system_role),
      is_active: row.is_active !== false,
      created_at: row.created_at,
      updated_at: row.updated_at,
      permissions,
    };

    const authUser: AuthUser = {
      id: row.id,
      email: row.email,
      phone: row.phone,
      full_name: isSuperAdmin ? 'Adsspot Admin' : row.full_name,
      avatar_url: row.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.email || row.id)}`,
      role: row.role,
      role_id: effectiveRoleId,
      dashboard_type: roleData.dashboard_type,
      permissions,
      created_at: row.created_at,
      updated_at: row.updated_at,
      staff_profile: staffProfile,
      business_profile: businessProfile,
      wallet: {
        id: `wallet-${row.id}`,
        user_id: row.id,
        balance: walletBalance,
        currency: 'INR',
        updated_at: new Date().toISOString(),
      },
    };

    return {
      user: authUser,
      sessionId: row.session_id,
      roleData,
      permissions,
    };
  } catch (error) {
    console.error('[getAuthenticatedUser] Error:', error);
    return null;
  }
}

/**
 * Require valid authenticated session or return error Response
 */
export async function requireAuth(req: Request): Promise<
  | { context: SessionContext; errorResponse: null }
  | { context: null; errorResponse: Response }
> {
  const context = await getAuthenticatedUser(req);
  if (!context) {
    return {
      context: null,
      errorResponse: new Response(
        JSON.stringify({ success: false, error: 'Unauthorized. Valid session required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
  return { context, errorResponse: null };
}

/**
 * Require user to possess specific permission
 */
export async function requirePermission(
  req: Request,
  permissionKey: string
): Promise<
  | { context: SessionContext; errorResponse: null }
  | { context: null; errorResponse: Response }
> {
  const auth = await requireAuth(req);
  if (auth.errorResponse) return auth;

  const { context } = auth;
  const isSuperAdmin = context.user.role === 'super_admin' || context.roleData.slug === 'super_admin';

  if (!isSuperAdmin && !context.permissions.includes(permissionKey)) {
    return {
      context: null,
      errorResponse: new Response(
        JSON.stringify({
          success: false,
          error: `Forbidden: Missing required permission "${permissionKey}".`,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  return { context, errorResponse: null };
}

/**
 * Require user to have one of the allowed roles
 */
export async function requireRole(
  req: Request,
  allowedRoles: string[]
): Promise<
  | { context: SessionContext; errorResponse: null }
  | { context: null; errorResponse: Response }
> {
  const auth = await requireAuth(req);
  if (auth.errorResponse) return auth;

  const { context } = auth;
  const isSuperAdmin = context.user.role === 'super_admin' || context.roleData.slug === 'super_admin';

  if (!isSuperAdmin && !allowedRoles.includes(context.user.role) && !allowedRoles.includes(context.roleData.slug)) {
    return {
      context: null,
      errorResponse: new Response(
        JSON.stringify({
          success: false,
          error: `Forbidden: Access restricted to [${allowedRoles.join(', ')}].`,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  return { context, errorResponse: null };
}
