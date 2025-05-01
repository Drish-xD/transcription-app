import { auth } from "@/server/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // If no session and trying to access protected routes
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If session exists and trying to access auth routes
  if (
    session &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
