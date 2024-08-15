import { NextResponse, type NextRequest } from 'next/server';

const locales = ['en', 'tr'];

function getLocale(request: any) {
  return "en";
}

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('next-auth.session-token')?.value 
                      || request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  const { pathname, origin } = request.nextUrl;
  
  if (currentUser) {
    if (!pathname.startsWith('/mainpage') && !locales.some(locale => pathname.startsWith(`/${locale}/mainpage`))) {
      return NextResponse.redirect(`${origin}/mainpage`);
    }
  } else {
    if (
      !pathname.startsWith('/login') &&
      !pathname.startsWith('/register') &&
      !locales.some(locale => pathname.startsWith(`/${locale}/login`)) &&
      !locales.some(locale => pathname.startsWith(`/${locale}/register`))
    ) {
      return NextResponse.redirect(`${origin}/login`);
    }
  }

  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}`));
  
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};