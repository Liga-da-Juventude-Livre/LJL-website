import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/modules/auth/constants";

// Optimistic gate: no session cookie means go to the login page. This is only a shortcut; the real check
// (cookie → database → active user) happens in modules/auth/dal.ts on every page and action.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/dashboard/login") return NextResponse.next();
  if (!request.cookies.has(SESSION_COOKIE)) {
    const login = new URL("/dashboard/login", request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
