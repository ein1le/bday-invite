import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./lib/session";

const PROTECTED_ROUTES = ["/rsvp", "/attending", "/not-attending"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isLogin = pathname.startsWith("/login");

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasValidSession = token
    ? !!(await verifySessionToken(token))
    : false;

  if (isProtected && !hasValidSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && hasValidSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/rsvp";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/rsvp/:path*", "/attending/:path*", "/not-attending/:path*"],
};

