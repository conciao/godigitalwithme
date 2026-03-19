// src/app/api/platform-inquiries/all/route.ts
import { auth } from "@/auth";
import { getDB } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDB();
    const { results } = await db.prepare(`
      SELECT * FROM platform_inquiries 
      ORDER BY created_at DESC
    `).all();

    return Response.json(results);
  } catch (err) {
    console.error("D1 Fetch Error (Platform Inquiries):", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
