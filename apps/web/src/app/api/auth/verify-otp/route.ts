import { NextResponse } from 'next/server';
import { queryPostgres, createSession } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    if (!otp) {
      return NextResponse.json({ success: false, error: 'OTP is required' }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const phoneSuffix = cleanPhone.slice(-4) || '1234';

    // 1. Check if user exists in AWS Aurora
    const checkUserRes = await queryPostgres(
      `SELECT u.id, u.phone, u.email, u.full_name, u.avatar_url, u.role, u.role_id,
              r.dashboard_type, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON (u.role_id = r.id OR u.role = r.slug)
       WHERE u.phone = $1`,
      [cleanPhone]
    );

    let userRecord = checkUserRes?.rows[0];

    if (!userRecord) {
      // Create new user in AWS Aurora
      const newUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const defaultName = `User ${phoneSuffix}`;
      const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanPhone)}`;

      const insertRes = await queryPostgres(
        `INSERT INTO users (id, phone, full_name, avatar_url, role, role_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, 'consumer', 'role-consumer', NOW(), NOW()) 
         RETURNING id, phone, email, full_name, avatar_url, role, role_id, created_at, updated_at`,
        [newUserId, cleanPhone, defaultName, defaultAvatar]
      );
      userRecord = insertRes?.rows[0];

      // Initialize wallet for new user in Aurora
      await queryPostgres(
        `INSERT INTO wallets (id, user_id, balance, currency, updated_at) 
         VALUES ($1, $2, 0.00, 'INR', NOW()) 
         ON CONFLICT (id) DO NOTHING`,
        [`wallet-${newUserId}`, newUserId]
      );
    }

    // 2. Create authenticated session
    const { token, cookieHeader } = await createSession(userRecord.id);

    // 3. Fetch permissions
    const effectiveRoleId = userRecord.role_id || 'role-consumer';
    const permRes = await queryPostgres(
      `SELECT p.key FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = $1`,
      [effectiveRoleId]
    );
    const permissions = (permRes?.rows || []).map((p: any) => p.key);

    // 4. Fetch user's business profile if merchant
    const bizRes = await queryPostgres(
      'SELECT * FROM businesses WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userRecord.id]
    );

    // 5. Fetch staff profile if employee
    const staffRes = await queryPostgres(
      'SELECT * FROM staff_profiles WHERE user_id = $1 LIMIT 1',
      [userRecord.id]
    );

    // 6. Fetch wallet balance
    const walletRes = await queryPostgres(
      'SELECT balance, currency FROM wallets WHERE user_id = $1 LIMIT 1',
      [userRecord.id]
    );
    const walletBalance = parseFloat(walletRes?.rows[0]?.balance || '0.0');

    const dashboardType = userRecord.dashboard_type || (userRecord.role === 'super_admin' ? 'admin' : userRecord.role === 'merchant' ? 'merchant' : userRecord.role === 'sm' ? 'sm' : userRecord.role === 'ro' ? 'ro' : userRecord.role === 'zo' ? 'zo' : 'user');

    const fullUser = {
      ...userRecord,
      dashboard_type: dashboardType,
      permissions,
      business_profile: bizRes?.rows[0] || null,
      staff_profile: staffRes?.rows[0] || null,
      wallet: {
        id: `wallet-${userRecord.id}`,
        user_id: userRecord.id,
        balance: walletBalance,
        currency: walletRes?.rows[0]?.currency || 'INR',
        updated_at: new Date().toISOString(),
      },
    };

    const response = NextResponse.json({
      success: true,
      user: fullUser,
      sessionToken: token,
      destination: dashboardType === 'admin' ? '/admin' : dashboardType === 'merchant' ? '/merchant' : dashboardType === 'sm' ? '/sm' : dashboardType === 'ro' ? '/ro' : dashboardType === 'zo' ? '/zo' : '/feed',
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error: any) {
    console.error('[API /auth/verify-otp] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
