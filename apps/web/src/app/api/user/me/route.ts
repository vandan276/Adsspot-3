import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Fetch user from Aurora DB
    const userRes = await queryPostgres(
      'SELECT id, phone, full_name, avatar_url, role, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    const userRecord = userRes?.rows[0];
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Fetch business owned by this user
    const bizRes = await queryPostgres(
      'SELECT * FROM businesses WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    const businessProfile = bizRes?.rows[0] || null;

    // 3. Fetch staff profile if any
    const staffRes = await queryPostgres(
      'SELECT * FROM staff_profiles WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    const staffProfile = staffRes?.rows[0] || null;

    // 4. Fetch wallet
    const walletRes = await queryPostgres(
      'SELECT balance, currency FROM wallets WHERE user_id = $1 LIMIT 1',
      [userId]
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
      business: businessProfile,
    });
  } catch (error: any) {
    console.error('[API /user/me] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
