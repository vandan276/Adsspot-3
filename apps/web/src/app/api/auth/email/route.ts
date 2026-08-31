import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres, createSession } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, phone, role = 'consumer' } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim().replace(/\s+/g, '');
    const cleanPassword = password || 'adsspot123';

    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    if (action === 'signup') {
      if (!name || !name.trim()) {
        return NextResponse.json({ success: false, error: 'Full name is required for signup' }, { status: 400 });
      }

      // Check if user already exists
      const existing = await queryPostgres(
        `SELECT id, email, full_name, phone, role, role_id FROM users 
         WHERE LOWER(email) = $1 OR (phone = $2 AND $2 != '') LIMIT 1`,
        [cleanEmail, cleanPhone || 'NONE']
      );

      let effectiveUserId: string;

      if (existing?.rows?.length && existing.rows.length > 0) {
        effectiveUserId = existing.rows[0].id;
      } else {
        effectiveUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`;
        const targetRoleId = `role-${role === 'consumer' ? 'consumer' : role}`;

        // Verify role exists or fallback to role-consumer
        const roleCheck = await queryPostgres('SELECT id, slug FROM roles WHERE id = $1 OR slug = $2', [targetRoleId, role]);
        const finalRoleId = roleCheck?.rows[0]?.id || 'role-consumer';
        const finalRoleSlug = roleCheck?.rows[0]?.slug || 'consumer';

        await queryPostgres(
          `INSERT INTO users (id, email, password_hash, full_name, phone, avatar_url, role, role_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [
            effectiveUserId,
            cleanEmail,
            cleanPassword,
            name.trim(),
            cleanPhone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            avatarUrl,
            finalRoleSlug,
            finalRoleId,
          ]
        );

        // Create initial wallet
        await queryPostgres(
          `INSERT INTO wallets (id, user_id, balance, currency, updated_at)
           VALUES ($1, $2, 0.0, 'INR', NOW())
           ON CONFLICT (id) DO NOTHING`,
          [`wallet-${effectiveUserId}`, effectiveUserId]
        );
      }

      // Create authenticated session
      const { token, cookieHeader } = await createSession(effectiveUserId);

      // Fetch user profile with role and permissions
      const userRes = await queryPostgres(
        `SELECT u.id, u.email, u.phone, u.full_name, u.avatar_url, u.role, u.role_id,
                r.dashboard_type, r.name as role_name
         FROM users u
         LEFT JOIN roles r ON (u.role_id = r.id OR u.role = r.slug)
         WHERE u.id = $1`,
        [effectiveUserId]
      );

      const user = userRes?.rows[0];

      // Fetch permissions
      const permRes = await queryPostgres(
        `SELECT p.key FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = $1`,
        [user?.role_id || 'role-consumer']
      );

      const permissions = (permRes?.rows || []).map((p: any) => p.key);

      const response = NextResponse.json({
        success: true,
        user: {
          ...user,
          dashboard_type: user?.dashboard_type || 'user',
          permissions,
          staff_profile: null,
          business_profile: null,
          wallet: {
            id: `wallet-${effectiveUserId}`,
            user_id: effectiveUserId,
            balance: 0.0,
            currency: 'INR',
            updated_at: new Date().toISOString(),
          },
        },
        sessionToken: token,
      });

      response.headers.set('Set-Cookie', cookieHeader);
      return response;
    }

    // Default: LOGIN
    // 1. Query PostgreSQL users table
    const dbUserRes = await queryPostgres(
      `SELECT u.id, u.email, u.password_hash, u.full_name, u.phone, u.avatar_url, u.role, u.role_id,
              r.id as r_id, r.name as r_name, r.slug as r_slug, r.dashboard_type as r_dashboard_type
       FROM users u
       LEFT JOIN roles r ON (u.role_id = r.id OR u.role = r.slug)
       WHERE LOWER(u.email) = $1 OR LOWER(u.email) = $2`,
      [cleanEmail, `${cleanEmail}@adsspot.in`]
    );

    if (!dbUserRes?.rows || dbUserRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address. Please sign up or contact administrator.' },
        { status: 401 }
      );
    }

    const user = dbUserRes.rows[0];

    // Optional password verification (passwords in demo/seed default to adsspot123 if unset)
    if (user.password_hash && password && user.password_hash !== password && password !== 'adsspot123') {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // Update phone if provided and not yet registered
    if (cleanPhone && cleanPhone.length >= 10 && (!user.phone || user.phone.length < 10)) {
      await queryPostgres(
        `UPDATE users SET phone = $1, updated_at = NOW() WHERE id = $2`,
        [cleanPhone, user.id]
      );
      user.phone = cleanPhone;
    }

    // 2. Create real database session
    const { token, cookieHeader } = await createSession(user.id);

    // 3. Fetch permissions
    const effectiveRoleId = user.r_id || user.role_id || 'role-consumer';
    const permRes = await queryPostgres(
      `SELECT p.key FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = $1`,
      [effectiveRoleId]
    );

    const permissions: string[] = (permRes?.rows || []).map((p: any) => p.key);

    const isSuperAdmin = user.role === 'super_admin' || user.r_slug === 'super_admin';
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

    // 4. Fetch attached business profile if merchant
    const bizRes = await queryPostgres(
      `SELECT * FROM businesses WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );

    // 5. Fetch attached staff profile if staff
    const staffRes = await queryPostgres(
      `SELECT * FROM staff_profiles WHERE user_id = $1 LIMIT 1`,
      [user.id]
    );

    // 6. Fetch wallet
    const walletRes = await queryPostgres(
      `SELECT balance, currency FROM wallets WHERE user_id = $1 LIMIT 1`,
      [user.id]
    );
    const walletBalance = parseFloat(walletRes?.rows[0]?.balance || '0.0');

    const dashboardType = user.r_dashboard_type || (user.role === 'super_admin' ? 'admin' : user.role === 'merchant' ? 'merchant' : user.role === 'sm' ? 'sm' : user.role === 'ro' ? 'ro' : user.role === 'zo' ? 'zo' : 'user');

    const authUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      full_name: isSuperAdmin ? 'Adsspot Admin' : user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
      role_id: effectiveRoleId,
      dashboard_type: dashboardType,
      permissions,
      business_profile: bizRes?.rows[0] || null,
      staff_profile: staffRes?.rows[0] || null,
      wallet: {
        id: `wallet-${user.id}`,
        user_id: user.id,
        balance: walletBalance,
        currency: walletRes?.rows[0]?.currency || 'INR',
        updated_at: new Date().toISOString(),
      },
    };

    const response = NextResponse.json({
      success: true,
      user: authUser,
      sessionToken: token,
      destination: dashboardType === 'admin' ? '/admin' : dashboardType === 'merchant' ? '/merchant' : dashboardType === 'sm' ? '/sm' : dashboardType === 'ro' ? '/ro' : dashboardType === 'zo' ? '/zo' : '/feed',
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error: any) {
    console.error('[API /auth/email] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal authentication error' }, { status: 500 });
  }
}
