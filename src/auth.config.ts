import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
        console.error("❌ CRITICAL: AUTH_SECRET environment variable is missing!");
      }
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const role = auth?.user?.role;

      // Protected Admin Paths
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        return role === "super_admin";
      }

      // Protected Dashboard Paths
      if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) return false;
        return role === "tenant_admin" || role === "super_admin";
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
