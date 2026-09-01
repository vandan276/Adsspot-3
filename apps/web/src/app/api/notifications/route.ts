import { NextResponse } from 'next/server';
import { queryPostgres, getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

// GET Handler: Fetch notifications for the logged-in user
export async function GET(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext?.user?.id) {
      return NextResponse.json({ success: true, notifications: [], unreadCount: 0 });
    }

    const userId = authContext.user.id;

    // Ensure notifications table exists
    await queryPostgres(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(256) NOT NULL,
        body TEXT NOT NULL,
        link VARCHAR(256),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const res = await queryPostgres(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    const notifications = res?.rows || [];
    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('[API /notifications GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Handler: Create a notification for a targeted user (e.g. merchant)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, body: notifBody, link } = body;

    if (!userId || !title) {
      return NextResponse.json({ error: 'userId and title are required' }, { status: 400 });
    }

    await queryPostgres(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(256) NOT NULL,
        body TEXT NOT NULL,
        link VARCHAR(256),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const notifId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const res = await queryPostgres(
      `INSERT INTO notifications (id, user_id, title, body, link, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, false, NOW())
       RETURNING *`,
      [notifId, userId, title, notifBody || title, link || '/merchant?tab=crm']
    );

    return NextResponse.json({
      success: true,
      notification: res?.rows?.[0],
    });
  } catch (error: any) {
    console.error('[API /notifications POST] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH Handler: Mark notifications as read
export async function PATCH(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId, markAll = false } = body;

    if (markAll) {
      await queryPostgres(
        `UPDATE notifications SET is_read = true WHERE user_id = $1`,
        [authContext.user.id]
      );
    } else if (notificationId) {
      await queryPostgres(
        `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
        [notificationId, authContext.user.id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /notifications PATCH] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
