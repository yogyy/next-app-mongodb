import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/verify";

  const token = req.cookies.get("session")?.value;
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  return await updateSession(req);
}

export const config = {
  matcher: ["/", "/profile", "/login", "/signup", "/verify"],
};
