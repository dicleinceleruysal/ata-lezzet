import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  getAdminPassword,
  getExpectedAdminToken,
} from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const actualPassword = getAdminPassword();

    if (!password || typeof password !== 'string' || password.trim() !== actualPassword) {
      return NextResponse.json(
        { success: false, error: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.' },
        { status: 401 }
      );
    }

    const token = await getExpectedAdminToken();

    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı.',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 gün boyunca oturum açık kalır
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu.' },
      { status: 500 }
    );
  }
}
