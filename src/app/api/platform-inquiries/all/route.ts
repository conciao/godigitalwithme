// src/app/api/platform-inquiries/all/route.ts
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: results, error } = await supabase
      .from("platform_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json(results);
  } catch (err) {
    console.error("Supabase Fetch Error (Platform Inquiries):", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
