export const runtime = "edge";

import { auth } from "@/auth";
import { getDB } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session || !session.user.companyId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDB();
    const result = await db.prepare("SELECT * FROM companies WHERE id = ?")
      .bind(session.user.companyId)
      .first();

    return Response.json(result);
  } catch (err) {
    console.error("D1 Fetch Settings Error:", err);
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
    const { name, description, contact_email, contact_phone, address, logo_url } = body;

    const db = getDB();
    await db.prepare(`
      UPDATE companies 
      SET 
        name = ?, 
        description = ?, 
        contact_email = ?, 
        contact_phone = ?, 
        address = ?, 
        logo_url = ?, 
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      name, 
      description, 
      contact_email, 
      contact_phone, 
      address, 
      logo_url, 
      session.user.companyId
    ).run();

    return Response.json({ success: true, message: "Settings updated successfully" });
  } catch (err) {
    console.error("D1 Update Settings Error:", err);
    return Response.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
