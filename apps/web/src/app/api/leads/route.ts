import { NextResponse } from 'next/server';
import { queryPostgres, getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

// GET Handler: Retrieve real leads for the logged-in merchant
export async function GET(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext?.user?.id) {
      return NextResponse.json({ success: true, leads: [] });
    }

    const userId = authContext.user.id;

    // Ensure leads table schema matches requirements
    await queryPostgres(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
        sm_user_id VARCHAR(64) REFERENCES users(id),
        user_id VARCHAR(64) REFERENCES users(id),
        business_name VARCHAR(256),
        owner_name VARCHAR(128),
        phone VARCHAR(32) NOT NULL,
        requirement TEXT,
        source VARCHAR(128) DEFAULT 'Merchant Profile',
        status VARCHAR(32) DEFAULT 'new',
        value VARCHAR(64) DEFAULT 'Inquiry',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Fetch business owned by user
    const bizRes = await queryPostgres(
      `SELECT id, name FROM businesses WHERE owner_id = $1 LIMIT 1`,
      [userId]
    );
    const merchantBiz = bizRes?.rows?.[0];

    let leadsRes: any = null;
    if (merchantBiz?.id) {
      leadsRes = await queryPostgres(
        `SELECT l.*, u.full_name as consumer_name, u.phone as consumer_phone, u.email as consumer_email, u.avatar_url as consumer_avatar
         FROM leads l
         LEFT JOIN users u ON l.user_id = u.id
         WHERE l.business_id = $1 OR l.sm_user_id = $2
         ORDER BY l.updated_at DESC LIMIT 100`,
        [merchantBiz.id, userId]
      );
    } else {
      leadsRes = await queryPostgres(
        `SELECT l.*, u.full_name as consumer_name, u.phone as consumer_phone, u.email as consumer_email, u.avatar_url as consumer_avatar
         FROM leads l
         LEFT JOIN users u ON l.user_id = u.id
         WHERE l.sm_user_id = $1
         ORDER BY l.updated_at DESC LIMIT 100`,
        [userId]
      );
    }

    const rawLeads = leadsRes?.rows || [];
    const formattedLeads = rawLeads.map((row: any) => ({
      id: row.id,
      name: row.consumer_name || row.owner_name || 'Interested Buyer',
      phone: row.consumer_phone || row.phone,
      email: row.consumer_email || '',
      avatar: row.consumer_avatar || '',
      requirement: row.requirement || 'Viewed & Interested in Business Profile',
      source: row.source || 'Digital Visiting Card (/card)',
      status: row.status || 'new',
      time: formatRelativeTime(row.updated_at || row.created_at),
      created_at: row.created_at,
      updated_at: row.updated_at,
      value: row.value || 'Inquiry',
      business_id: row.business_id,
      business_name: row.business_name,
    }));

    return NextResponse.json({
      success: true,
      leads: formattedLeads,
    });
  } catch (error: any) {
    console.error('[API /leads GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Handler: Create or Update a lead from Merchant Profile explicit CTAs (Call / WhatsApp)
export async function POST(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    const body = await req.json();

    const {
      businessId,
      businessSlug,
      requirement = 'Customer showed interest via Merchant Profile',
      source = 'Digital Visiting Card (/card)',
      phone: bodyPhone,
      name: bodyName,
    } = body;

    if (!businessId && !businessSlug) {
      return NextResponse.json({ error: 'businessId or businessSlug is required' }, { status: 400 });
    }

    // Fetch target business & owner
    let targetBiz: any = null;
    if (businessId) {
      const bizRes = await queryPostgres(`SELECT * FROM businesses WHERE id = $1 LIMIT 1`, [businessId]);
      targetBiz = bizRes?.rows?.[0];
    } else if (businessSlug) {
      const bizRes = await queryPostgres(`SELECT * FROM businesses WHERE slug = $1 LIMIT 1`, [businessSlug]);
      targetBiz = bizRes?.rows?.[0];
    }

    if (!targetBiz) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Authenticated user details or fallback details
    const consumerUser = authContext?.user;
    const consumerId = consumerUser?.id || null;
    const consumerName = consumerUser?.full_name || bodyName || 'Local Consumer';
    const consumerPhone = consumerUser?.phone || bodyPhone || '+919876543210';

    // Single Active Lead per Consumer + Business Architecture
    const existingLeadRes = await queryPostgres(
      `SELECT id, status FROM leads 
       WHERE business_id = $1 AND (user_id = $2 OR phone = $3)
       ORDER BY created_at DESC LIMIT 1`,
      [targetBiz.id, consumerId, consumerPhone]
    );

    let targetLeadId: string;
    let isNewLead = false;

    if (existingLeadRes?.rows?.[0]) {
      targetLeadId = existingLeadRes.rows[0].id;
      // Update existing lead requirement and timestamp
      await queryPostgres(
        `UPDATE leads 
         SET requirement = $1, source = $2, updated_at = NOW() 
         WHERE id = $3`,
        [requirement, source, targetLeadId]
      );
    } else {
      isNewLead = true;
      targetLeadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await queryPostgres(
        `INSERT INTO leads (
          id, business_id, user_id, business_name, owner_name, phone, requirement, source, status, value, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, 'new', 'Inquiry', NOW(), NOW()
        )`,
        [
          targetLeadId,
          targetBiz.id,
          consumerId,
          targetBiz.name,
          consumerName,
          consumerPhone,
          requirement,
          source,
        ]
      );
    }

    // Send notification to merchant owner (throttled to max 1 notification per hour per consumer to prevent notification spam)
    if (targetBiz.owner_id) {
      const recentNotifRes = await queryPostgres(
        `SELECT id FROM notifications 
         WHERE user_id = $1 AND body LIKE $2 AND created_at > NOW() - INTERVAL '1 hour'
         LIMIT 1`,
        [targetBiz.owner_id, `%${consumerName}%`]
      );

      if (!recentNotifRes?.rows?.[0]) {
        const notifId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        await queryPostgres(
          `INSERT INTO notifications (id, user_id, title, body, link, is_read, created_at)
           VALUES ($1, $2, $3, $4, $5, false, NOW())`,
          [
            notifId,
            targetBiz.owner_id,
            `⚡ New Lead: ${consumerName}`,
            `${consumerName} (${consumerPhone}) showed interest in ${targetBiz.name} via ${source}.`,
            '/merchant?tab=crm',
          ]
        );
      }
    }

    return NextResponse.json({
      success: true,
      leadId: targetLeadId,
      isNew: isNewLead,
      message: isNewLead ? 'Lead created successfully!' : 'Lead updated successfully!',
    });
  } catch (error: any) {
    console.error('[API /leads POST] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH Handler: Update lead status (e.g. 'new' -> 'contacted' -> 'converted')
export async function PATCH(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json({ error: 'leadId and status are required' }, { status: 400 });
    }

    await queryPostgres(
      `UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, leadId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /leads PATCH] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Just now';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
