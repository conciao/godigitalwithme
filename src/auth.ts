import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

// Extend session type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "super_admin" | "tenant_admin";
      companyId: number | null;
      companySlug: string | null;
    };
  }
  interface User {
    role: "super_admin" | "tenant_admin";
    companyId: number | null;
    companySlug: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { 
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // R-05 FIX: 8 hours — re-auth required after inactivity
  },
  trustHost: true,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role       = user.role;
        token.companyId  = user.companyId;
        token.companySlug = user.companySlug;
        token.sub        = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id          = token.sub as string;
        session.user.role        = token.role as "super_admin" | "tenant_admin";
        session.user.companyId   = token.companyId as number | null;
        session.user.companySlug = token.companySlug as string | null;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn("⚠️ Login attempt with missing credentials");
          return null;
        }

        const email    = credentials.email as string;
        const password = credentials.password as string;

        console.log("🔒 Supabase Auth Attempt:", { email });

        // Query Supabase for the user (maybeSingle won't throw on not-found)
        const { data: user, error } = await supabase
          .from("admins")
          .select("*, venues(id, slug)")
          .eq("email", email)
          .maybeSingle();

        if (error || !user) {
          console.warn("❌ User not found in database:", email);
          return null;
        }

        // S-01 FIX: Secure bcrypt password comparison.
        // Supports both bcrypt hashes (production) and plain text (migration fallback).
        let isValid = false;
        const isHashed = user.password_hash?.startsWith("$2");
        if (isHashed) {
          isValid = await bcrypt.compare(password, user.password_hash);
        } else {
          // Legacy plain-text fallback (only during migration)
          isValid = user.password_hash === password;
          if (isValid) {
            console.warn("⚠️ SECURITY: User", email, "is using unhashed password. Please update to bcrypt.");
          }
        }

        if (!isValid) {
          console.warn("❌ Invalid password for user:", email);
          return null;
        }

        console.log("✅ Login successful for:", email);
        
        // Link the venue (company) data
        const venue = Array.isArray(user.venues) ? user.venues[0] : user.venues;

        return {
          id:          user.id.toString(),
          name:        user.name,
          email:       user.email,
          role:        user.role as "super_admin" | "tenant_admin",
          companyId:   venue?.id || null,
          companySlug: venue?.slug || null,
        };
      },
    }),
  ],
});
