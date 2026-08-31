import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. No active session found.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: authContext.user,
      permissions: authContext.permissions,
      role: authContext.roleData,
      business: authContext.user.business_profile,
    });
  } catch (error: any) {
    console.error('[API /user/me GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
