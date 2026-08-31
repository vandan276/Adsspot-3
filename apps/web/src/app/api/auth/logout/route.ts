import { NextResponse } from 'next/server';
import { extractSessionToken, destroySession, SESSION_COOKIE_NAME } from '@adsspot/api/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const token = extractSessionToken(req);
    if (token) {
      await destroySession(token);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    
    // Clear session cookie
    response.headers.set(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );

    return response;
  } catch (error: any) {
    console.error('[API /auth/logout] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
