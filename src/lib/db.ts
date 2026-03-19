// src/lib/db.ts
// Helper to access the Cloudflare D1 database from Route Handlers and Server Components

import { getRequestContext } from "@cloudflare/next-on-pages";

/**
 * Returns the D1 database instance bound to the "DB" binding in wrangler.toml.
 * This only works in a Cloudflare Pages / Workers environment (production or wrangler dev).
 */
export function getDB(): D1Database {
  try {
    const ctx = getRequestContext();
    const env = ctx?.env as any;
    const db = env?.DB as D1Database;
    
    if (!db) {
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ D1 Binding 'DB' not found. Ensure you are using 'wrangler pages dev'.");
      }
      throw new Error("D1 Database 'DB' is not bound. Please check your Cloudflare Pages settings / wrangler.toml");
    }
    
    return db;
  } catch (err) {
    console.error("❌ Critical: getDB() failed:", err);
    throw err;
  }
}
