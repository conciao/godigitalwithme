import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let query = supabase
      .from("reservations")
      .select("*");

    if (session.user.role === "tenant_admin") {
      query = query.eq("venue_id", session.user.companyId);
    }

    const { data: results, error } = await query.order("event_date", { ascending: true });

    if (error) throw error;

    return Response.json(results);
  } catch (err) {
    console.error("Supabase Fetch Reservations Error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
