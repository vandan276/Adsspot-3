import { NextResponse } from 'next/server';
import { queryPostgres, getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    const body = await req.json();
    const { businessId, lat, lng, address } = body;

    const effectiveUserId = authContext?.user?.id;
    const numLat = Number(lat);
    const numLng = Number(lng);

    if (isNaN(numLat) || isNaN(numLng)) {
      return NextResponse.json({ success: false, error: 'Invalid latitude/longitude coordinates' }, { status: 400 });
    }

    if (!businessId && !effectiveUserId) {
      return NextResponse.json({ success: false, error: 'Unauthorized or missing businessId' }, { status: 401 });
    }

    let updateQuery = `UPDATE businesses SET lat = $1, lng = $2, updated_at = NOW()`;
    let queryParams: any[] = [numLat, numLng];

    if (address) {
      updateQuery = `UPDATE businesses SET lat = $1, lng = $2, address = COALESCE($3, address), updated_at = NOW()`;
      queryParams = [numLat, numLng, address];
    }

    if (businessId) {
      updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING *`;
      queryParams.push(businessId);
    } else {
      updateQuery += ` WHERE owner_id = $${queryParams.length + 1} RETURNING *`;
      queryParams.push(effectiveUserId);
    }

    const res = await queryPostgres(updateQuery, queryParams);

    if (res?.rows?.[0]) {
      return NextResponse.json({
        success: true,
        business: res.rows[0],
        message: 'Business location pin updated successfully on map',
      });
    }

    return NextResponse.json({ success: true, message: 'Updated' });
  } catch (error: any) {
    console.error('Error updating business location pin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
