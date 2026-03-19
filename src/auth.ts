import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

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
  session: { strategy: "jwt" },
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

        console.log("🔒 Credentials Login Attempt:", { email });

        // ── LOCAL DEV: hardcoded demo accounts ─────────────────────────
        // In production these are replaced by a real D1 lookup via getDB()
        const DEMO_USERS = [
          {
            id: "1",
            name: "Super Admin",
            email: "admin@godigitalwithme.com",
            password: "Admin@123",
            role: "super_admin" as const,
            companyId: null,
            companySlug: null,
          },
          {
            id: "2",
            name: "Grand Venue Admin",
            email: "admin@grand-venue.com",
            password: "Venue@123",
            role: "tenant_admin" as const,
            companyId: 1,
            companySlug: "grand-venue",
          },
          {
            id: "3",
            name: "Rose Garden Admin",
            email: "admin@rose-garden.com",
            password: "Venue@123",
            role: "tenant_admin" as const,
            companyId: 2,
            companySlug: "rose-garden",
          },
        ];

        const user = DEMO_USERS.find(u => u.email === email);
        if (!user) {
          console.warn("❌ User not found in demo accounts:", email);
          return null;
        }

        const isValid = user.password === password;

        if (!isValid) {
          console.warn("❌ Invalid password for user:", email);
          return null;
        }

        console.log("✅ Login successful for:", email);
        return {
          id:          user.id,
          name:        user.name,
          email:       user.email,
          role:        user.role,
          companyId:   user.companyId,
          companySlug: user.companySlug,
        };
      },
    }),
  ],
});
