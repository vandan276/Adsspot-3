import { NextRequest, NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';
import { SEED_USERS } from '@adsspot/api';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, phone, role = 'consumer' } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim().replace(/\s+/g, '');

    if (!cleanEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (action === 'signup') {
      if (!name) {
        return NextResponse.json({ error: 'Full name is required for signup' }, { status: 400 });
      }

      // Check if user already exists
      const existing = await queryPostgres(
        `SELECT id FROM users WHERE LOWER(email) = $1 OR (phone = $2 AND $2 != '')`,
        [cleanEmail, cleanPhone || 'NONE']
      );

      if (existing?.rows?.length && existing.rows.length > 0) {
        // Return existing user
        const existingUser = existing.rows[0];
        const fullUserRes = await queryPostgres(
          `SELECT id, phone, email, full_name, avatar_url, role, created_at, updated_at FROM users WHERE id = $1`,
          [existingUser.id]
        );
        return NextResponse.json({
          success: true,
          user: fullUserRes?.rows[0],
          message: 'Account already exists. Logged in successfully.',
        });
      }

      const newUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`;

      const insertRes = await queryPostgres(
        `INSERT INTO users (id, email, password_hash, full_name, phone, avatar_url, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING id, email, full_name, phone, avatar_url, role, created_at, updated_at`,
        [
          newUserId,
          cleanEmail,
          password || 'adsspot123',
          name,
          cleanPhone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          avatarUrl,
          role,
        ]
      );

      // Create initial wallet
      await queryPostgres(
        `INSERT INTO wallets (id, user_id, balance, currency, updated_at)
         VALUES ($1, $2, $3, 'INR', NOW())
         ON CONFLICT (id) DO NOTHING`,
        [`wallet-${newUserId}`, newUserId, 0.0]
      );

      const createdUser = insertRes?.rows[0];

      return NextResponse.json({
        success: true,
        user: {
          ...createdUser,
          staff_profile: null,
          business_profile: null,
        },
      });
    }

    // Default: LOGIN
    // 1. Check PostgreSQL users table
    const dbUserRes = await queryPostgres(
      `SELECT id, email, full_name, phone, avatar_url, role, created_at, updated_at 
       FROM users 
       WHERE LOWER(email) = $1 OR LOWER(email) = $2`,
      [cleanEmail, `${cleanEmail}@adsspot.in`]
    );

    if (dbUserRes?.rows?.length && dbUserRes.rows.length > 0) {
      const user = dbUserRes.rows[0];

      // Update phone if provided during sign-in
      if (cleanPhone && cleanPhone.length >= 10 && (!user.phone || user.phone.length < 10)) {
        await queryPostgres(
          `UPDATE users SET phone = $1, updated_at = NOW() WHERE id = $2`,
          [cleanPhone, user.id]
        );
        user.phone = cleanPhone;
      }

      // Fetch attached business profile if merchant
      const bizRes = await queryPostgres(
        `SELECT * FROM businesses WHERE owner_id = $1 LIMIT 1`,
        [user.id]
      );

      // Fetch attached staff profile if staff
      const staffRes = await queryPostgres(
        `SELECT * FROM staff_profiles WHERE user_id = $1 LIMIT 1`,
        [user.id]
      );

      return NextResponse.json({
        success: true,
        user: {
          ...user,
          business_profile: bizRes?.rows[0] || null,
          staff_profile: staffRes?.rows[0] || null,
        },
      });
    }

    // 2. Check SEED users matching email or role prefix
    const matchedSeed = SEED_USERS.find(
      (u) =>
        u.email?.toLowerCase() === cleanEmail ||
        u.email?.toLowerCase() === `${cleanEmail}@adsspot.in` ||
        cleanEmail.startsWith(u.role)
    );

    if (matchedSeed) {
      return NextResponse.json({
        success: true,
        user: matchedSeed,
      });
    }

    // If not found, create new account gracefully with email
    const fallbackId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const defaultName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const fallbackPhone = cleanPhone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const fallbackInsert = await queryPostgres(
      `INSERT INTO users (id, email, password_hash, full_name, phone, avatar_url, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'consumer', NOW(), NOW())
       RETURNING id, email, full_name, phone, avatar_url, role, created_at, updated_at`,
      [
        fallbackId,
        cleanEmail,
        password || 'adsspot123',
        defaultName,
        fallbackPhone,
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      ]
    );

    return NextResponse.json({
      success: true,
      user: fallbackInsert?.rows[0] || {
        id: fallbackId,
        email: cleanEmail,
        full_name: defaultName,
        phone: fallbackPhone,
        role: 'consumer',
      },
    });
  } catch (error: any) {
    console.error('[API /auth/email] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal authentication error' }, { status: 500 });
  }
}
