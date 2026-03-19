// src/app/api/companies/route.ts
// GET  /api/companies  — list all companies (super admin)
// POST /api/companies  — create a new company (super admin)

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In Supabase, we can use a select with count if we have relationships set up.
    // For simplicity, we'll fetch venues and then optionally counts if needed.
    // But a better way in Supabase is using RPC or complex queries.
    // Let's do a simple fetch for now to get the UI working.
    
    const { data: venues, error } = await supabase
      .from("venues")
      .select(`
        *,
        inquiries:inquiries(count),
        reservations:reservations(count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Flatten counts for UI compatibility
    const formatted = venues.map(v => ({
      ...v,
      inquiries: v.inquiries?.[0]?.count || 0,
      reservations: v.reservations?.[0]?.count || 0
    }));

    return Response.json(formatted);
  } catch (err) {
    console.error("Supabase Fetch Error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as { name: string; slug: string; plan: string; contact_email: string };
    const { name, slug, plan, contact_email } = body;

    if (!name || !slug || !plan) {
      return Response.json({ error: "Missing required fields: name, slug, plan" }, { status: 400 });
    }

    // 1. Check if slug exists
    const { data: existing } = await supabase
      .from("venues")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return Response.json({ error: "A venue with this subdomain already exists." }, { status: 400 });
    }

    // 2. Insert venue
    const { error: insertError } = await supabase
      .from("venues")
      .insert({
        name,
        slug,
        plan,
        contact_email,
        status: 'active'
      });

    if (insertError) throw insertError;

    return Response.json({ success: true, message: `Company "${name}" created.` }, { status: 201 });
  } catch (err) {
    console.error("Supabase Insert Error:", err);
    return Response.json({ error: "Failed to create company" }, { status: 500 });
  }
}
