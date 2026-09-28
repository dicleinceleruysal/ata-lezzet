import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/adminAuth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Sadece /admin yollarını denetle
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyAdminToken(token);

    // Eğer zaten giriş sayfasındaysa
    if (pathname === '/admin/login') {
      if (isValid) {
        // Zaten giriş yapmışsa doğrudan ana admin paneline yönlendir
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // Giriş yapmamışsa login sayfasına yönlendir
    if (!isValid) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
