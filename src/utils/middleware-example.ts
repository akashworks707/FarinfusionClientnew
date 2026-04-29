import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];
const CUSTOMER_ROUTES = [/^\/customer/];
const STAFF_ROUTES = [/^\/staff/];
const ADMIN_ROUTES = [/^\/staff\/dashboard\/admin/];
const GENERAL_STAFF_ROUTES = [/^\/staff\/dashboard$/];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value;

  const role = req.cookies.get("role")?.value;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (CUSTOMER_ROUTES.some((route) => route.test(pathname))) {
    if (role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (STAFF_ROUTES.some((route) => route.test(pathname))) {
    if (!["MODERATOR", "MANAGER", "ADMIN", "TELLICELSS"].includes(role || "")) {
      return NextResponse.redirect(new URL("/staff/dashboard", req.url));
    }
  }

  if (role === "GENERAL_STAFF") {
    if (!GENERAL_STAFF_ROUTES.some((r) => r.test(pathname))) {
      return NextResponse.redirect(new URL("/staff/dashboard", req.url));
    }
  }

  if (ADMIN_ROUTES.some((route) => route.test(pathname))) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/staff/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/staff/:path*"],
};
