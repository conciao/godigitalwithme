// src/app/api/venue/settings/route.ts

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();

  if (!session || !session.user.companyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: venue, error } = await supabase
      .from("venues")
      .select("*")
      .eq("id", session.user.companyId)
      .single();

    if (error) throw error;
    return Response.json(venue);
  } catch (err) {
    console.error("Supabase Fetch Settings Error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session || !session.user.companyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, tagline, description, about_us, contact_email, contact_phone, address, logo_url, hero_image_url } = body;

    const { error: updateError } = await supabase
      .from("venues")
      .update({
        name,
        tagline,
        description,
        about_us,
        contact_email,
        contact_phone,
        address,
        logo_url,
        hero_image_url,
        updated_at: new Date().toISOString()
      })
      .eq("id", session.user.companyId);

    if (updateError) throw updateError;

    return Response.json({ success: true, message: "Settings updated successfully" });
  } catch (err) {
    console.error("Supabase Update Settings Error:", err);
    return Response.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
