import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '@/lib/i18n-config';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const hasLocale = i18n.locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (hasLocale) {
    return NextResponse.next();
  }

  const locale = i18n.defaultLocale;
  const redirectURL = request.nextUrl.clone();
  redirectURL.pathname = `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

  return NextResponse.redirect(redirectURL);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
