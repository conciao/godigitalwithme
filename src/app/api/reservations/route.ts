import { auth } from "@/auth";
import { getDB } from "@/lib/db";
import { Reservation } from "@/types/database";

export const runtime = "edge";

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDB();
    let query = "SELECT * FROM reservations";
    const params: any[] = [];

    if (session.user.role === "tenant_admin") {
      query += " WHERE company_id = ?";
      params.push(session.user.companyId);
    }

    query += " ORDER BY event_date ASC";
    const { results } = await db.prepare(query).bind(...params).all<Reservation>();

    return Response.json(results);
  } catch (err) {
    console.error("D1 Fetch Reservations Error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
