import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const method = req.method;

  // Log request (excluding logs page, logs api, and static file patterns to avoid loops and clutter)
  if (
    !pathname.startsWith("/api/admin/logs") &&
    !pathname.startsWith("/admin/logs") &&
    !pathname.includes(".")
  ) {
    console.log(`${method} ${pathname}`);
  }

  // Protect /admin routes (but not /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect customer account routes
  if (pathname.startsWith("/account")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Require login before checkout
  if (pathname.startsWith("/checkout")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
