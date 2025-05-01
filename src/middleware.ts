import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  if (!session && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if (session && AUTH_ROUTES.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|images|favicon.ico|icon|sitemap.xml|robots.txt|manifest).*)",
    },
  ],
};
