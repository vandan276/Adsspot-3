import { NextResponse } from 'next/server';
import { queryPostgres } from '@adsspot/api/server';

export async function GET() {
  try {
    const res = await queryPostgres(
      `SELECT 
        s.id, s.user_id, s.role, s.reports_to, s.city_id, s.region_id, s.target_monthly, s.status, s.created_at,
        u.email, u.phone, u.full_name, u.avatar_url
       FROM staff_profiles s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );

    const staffList = (res?.rows || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      role: row.role,
      reports_to: row.reports_to,
      city_id: row.city_id,
      region_id: row.region_id,
      target_monthly: parseFloat(row.target_monthly || 0),
      status: row.status,
      created_at: row.created_at,
      user: {
        id: row.user_id,
        email: row.email,
        phone: row.phone,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
        role: row.role,
      },
    }));

    return NextResponse.json({ success: true, staff: staffList });
  } catch (err: any) {
    console.error('[API Staff GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      role = 'sm',
      city_id = 'city-mum',
      region_id = 'reg-mum-south',
      reports_to,
      target_monthly = 250000,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanPassword = password || 'adsspot123';
    const userId = `usr-staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const staffId = `staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 1. Insert or update user in PostgreSQL Aurora
    await queryPostgres(
      `INSERT INTO users (id, phone, email, password_hash, full_name, avatar_url, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE 
       SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, updated_at = NOW()`,
      [
        userId,
        cleanPhone || `+910000000000`,
        cleanEmail,
        cleanPassword,
        name,
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        role,
      ]
    );

    // 2. Insert staff profile in PostgreSQL Aurora
    await queryPostgres(
      `INSERT INTO staff_profiles (id, user_id, role, reports_to, city_id, region_id, target_monthly, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       ON CONFLICT (id) DO NOTHING`,
      [
        staffId,
        userId,
        role,
        reports_to || null,
        city_id,
        region_id,
        target_monthly,
      ]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        phone: cleanPhone,
        full_name: name,
        role,
      },
      staff_profile: {
        id: staffId,
        user_id: userId,
        role,
        target_monthly,
        city_id,
        region_id,
        status: 'active',
      },
    });
  } catch (err: any) {
    console.error('[API Staff POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
