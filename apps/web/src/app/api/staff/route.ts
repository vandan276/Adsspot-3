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
    const cleanPhone = (phone || '').trim().replace(/\s+/g, '');
    const cleanPassword = password || 'adsspot123';
    
    // 1. Check if user exists by email or phone
    const checkRes = await queryPostgres(
      `SELECT id, email, phone, role FROM users WHERE LOWER(email) = $1 OR (phone = $2 AND $2 != '') LIMIT 1`,
      [cleanEmail, cleanPhone || 'NONE']
    );

    let effectiveUserId: string;

    if (checkRes?.rows?.length && checkRes.rows.length > 0) {
      effectiveUserId = checkRes.rows[0].id;
      await queryPostgres(
        `UPDATE users 
         SET full_name = $1, email = $2, password_hash = $3, role = $4, phone = COALESCE(NULLIF($5, ''), phone), updated_at = NOW() 
         WHERE id = $6`,
        [name, cleanEmail, cleanPassword, role, cleanPhone, effectiveUserId]
      );
    } else {
      effectiveUserId = `usr-staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`;
      await queryPostgres(
        `INSERT INTO users (id, phone, email, password_hash, full_name, avatar_url, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          effectiveUserId,
          cleanPhone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          cleanEmail,
          cleanPassword,
          name,
          avatarUrl,
          role,
        ]
      );
    }

    // 2. Ensure initial wallet exists
    await queryPostgres(
      `INSERT INTO wallets (id, user_id, balance, currency, updated_at)
       VALUES ($1, $2, 0.0, 'INR', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [`wallet-${effectiveUserId}`, effectiveUserId]
    );

    // 3. Insert or update staff profile in PostgreSQL Aurora
    const existingProfile = await queryPostgres(
      `SELECT id FROM staff_profiles WHERE user_id = $1 LIMIT 1`,
      [effectiveUserId]
    );

    let effectiveStaffId: string;
    if (existingProfile?.rows?.length && existingProfile.rows.length > 0) {
      effectiveStaffId = existingProfile.rows[0].id;
      await queryPostgres(
        `UPDATE staff_profiles 
         SET role = $1, reports_to = $2, city_id = $3, region_id = $4, target_monthly = $5, status = 'active'
         WHERE id = $6`,
        [role, reports_to || null, city_id, region_id, target_monthly, effectiveStaffId]
      );
    } else {
      effectiveStaffId = `staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await queryPostgres(
        `INSERT INTO staff_profiles (id, user_id, role, reports_to, city_id, region_id, target_monthly, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW())`,
        [effectiveStaffId, effectiveUserId, role, reports_to || null, city_id, region_id, target_monthly]
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: effectiveUserId,
        email: cleanEmail,
        phone: cleanPhone,
        full_name: name,
        role,
      },
      staff_profile: {
        id: effectiveStaffId,
        user_id: effectiveUserId,
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
