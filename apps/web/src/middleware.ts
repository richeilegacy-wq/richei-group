import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSessionToken = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("session_token"));

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !hasSessionToken) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && hasSessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
