import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const phoneSuffix = cleanPhone.slice(-4) || '1234';

    // Check if user exists in AWS Aurora
    const checkUserRes = await queryPostgres(
      'SELECT id, phone, full_name, avatar_url, role, created_at, updated_at FROM users WHERE phone = $1',
      [cleanPhone]
    );

    let userRecord = checkUserRes?.rows[0];

    if (!userRecord) {
      // Create new user in AWS Aurora
      const newUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const defaultName = `User ${phoneSuffix}`;
      const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

      const insertRes = await queryPostgres(
        `INSERT INTO users (id, phone, full_name, avatar_url, role) 
         VALUES ($1, $2, $3, $4, 'consumer') 
         RETURNING id, phone, full_name, avatar_url, role, created_at, updated_at`,
        [newUserId, cleanPhone, defaultName, defaultAvatar]
      );
      userRecord = insertRes?.rows[0];

      // Initialize wallet for new user in Aurora
      await queryPostgres(
        `INSERT INTO wallets (id, user_id, balance, currency) VALUES ($1, $2, 0.00, 'INR') ON CONFLICT DO NOTHING`,
        [`wallet-${newUserId}`, newUserId]
      );
    }

    // Fetch user's business profile if merchant
    const bizRes = await queryPostgres(
      'SELECT * FROM businesses WHERE owner_id = $1 LIMIT 1',
      [userRecord.id]
    );
    const businessProfile = bizRes?.rows[0] || null;

    // Fetch staff profile if employee
    const staffRes = await queryPostgres(
      'SELECT * FROM staff_profiles WHERE user_id = $1 LIMIT 1',
      [userRecord.id]
    );
    const staffProfile = staffRes?.rows[0] || null;

    // Fetch wallet balance
    const walletRes = await queryPostgres(
      'SELECT balance, currency FROM wallets WHERE user_id = $1 LIMIT 1',
      [userRecord.id]
    );
    const walletData = walletRes?.rows[0] || { balance: 0.0, currency: 'INR' };

    const fullUser = {
      ...userRecord,
      business_profile: businessProfile,
      staff_profile: staffProfile,
      wallet: {
        id: `wallet-${userRecord.id}`,
        user_id: userRecord.id,
        balance: parseFloat(walletData.balance) || 0.0,
        currency: walletData.currency || 'INR',
        updated_at: new Date().toISOString(),
      },
    };

    return NextResponse.json({
      success: true,
      user: fullUser,
    });
  } catch (error: any) {
    console.error('[API /auth/verify-otp] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
