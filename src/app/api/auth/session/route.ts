import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { isAuth } = await req.json();
    const res = NextResponse.json({ ok: true });
    if (isAuth) {
      res.cookies.set('auth', '1', { httpOnly: false, sameSite: 'lax', path: '/' });
    } else {
      res.cookies.set('auth', '', { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 0 });
    }
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


