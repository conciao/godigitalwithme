// src/lib/db.ts
// STUB: This file was originally used for Cloudflare D1.
// Since we have migrated to Supabase, this is no longer used, butkept as a stub 
// to prevent import breakage while migrating existing API routes.
// ALL NEW CODE SHOULD USE src/lib/supabase.ts instead.

import { supabase } from "./supabase";

/**
 * DEPRECATED: Returns a stub of the D1 API backed by Supabase if needed,
 * or simply throws a warning to redirect developers to Supabase.
 */
export function getDB(): any {
  console.warn("⚠️ DEPRECATED: getDB() was called. Please migrate this route to Supabase (src/lib/supabase.ts).");
  
  // Return a proxy that warns on usage
  return new Proxy({}, {
    get() {
      throw new Error("❌ CLOUDFARE D1 IS DISABLED. Please use Supabase instead.");
    }
  });
}
