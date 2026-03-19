// src/middleware.ts — Combined subdomain routing + NextAuth auth protection
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const RESERVED_SUBDOMAINS = ["www", "admin", "app"];

export default auth(function middleware(request) {
  const hostname = request.headers.get("host") || "";
  const url      = request.nextUrl.clone();
  const host     = hostname.split(":")[0];
  const auth     = request.auth; // In v5, auth is attached to req
  void auth;

  // ── BYPASS API ROUTES ────────────────────────────────────────────────
  if (url.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isLocalDev = host === "localhost" || host.endsWith(".localhost");
  let subdomain: string | null = null;

  if (isLocalDev) {
    const parts = host.split(".");
    if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
      subdomain = parts[0] === "localhost" ? null : parts[0];
    }
  } else {
    const rootDomain = process.env.ROOT_DOMAIN || "yourdomain.com";
    if (host.endsWith(`.${rootDomain}`)) {
      subdomain = host.replace(`.${rootDomain}`, "");
    }
  }

  // ── SUPER ADMIN DASHBOARD ────────────────────────────────────────────
  if (subdomain === "admin") {
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // ── TENANT DASHBOARD ─────────────────────────────────────────────────
  if (subdomain === "app") {
    if (!url.pathname.startsWith("/dashboard")) {
      url.pathname = `/dashboard${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // ── TENANT PUBLIC VENUE WEBSITE ──────────────────────────────────────
  if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    if (!url.pathname.startsWith(`/venue/${subdomain}`)) {
      url.pathname = `/venue/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
