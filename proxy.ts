import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextProxy } from "next/server";

export const proxy: NextProxy = (req) => {
  const token = req.cookies.get("token")?.value || "";

  const { pathname } = req.nextUrl;
  
  if (token && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Jika tidak ada token, redirect ke /login
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login","/","/dashboard/:path*"], // proteksi semua route dashboard/*
};
