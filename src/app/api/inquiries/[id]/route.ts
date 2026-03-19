import { auth } from "@/auth";
import { getDB } from "@/lib/db";

export const runtime = "edge";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body   = await request.json() as { status: string };
    const { status } = body;

    const validStatuses = ["new", "contacted", "approved", "rejected", "booked"];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const db = getDB();

    // 1. Fetch inquiry to check ownership and get data for reservation
    const inquiry = await db.prepare("SELECT * FROM inquiries WHERE id = ?")
      .bind(id).first<any>();
    
    if (!inquiry) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // 2. Tenant isolation check
    if (session.user.role === "tenant_admin" && inquiry.company_id !== session.user.companyId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Special logic for 'booked' -> Create Reservation
    if (status === "booked" && inquiry.status !== "booked") {
      const { amount, deposit_paid } = body as any;
      
      await db.prepare(`
        INSERT INTO reservations (
          company_id, inquiry_id, client_name, client_email, client_phone, 
          event_type, event_date, event_time, guest_count, amount, 
          deposit_paid, balance, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', datetime('now'), datetime('now'))
      `).bind(
        inquiry.company_id, inquiry.id, inquiry.client_name, inquiry.client_email, 
        inquiry.client_phone, inquiry.event_type, inquiry.event_date, inquiry.event_time, 
        inquiry.guest_count, amount || 0, deposit_paid || 0, (amount || 0) - (deposit_paid || 0)
      ).run();
    }

    // 4. Update status
    await db.prepare("UPDATE inquiries SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(status, id).run();

    return Response.json({ success: true, id, status });
  } catch (err) {
    console.error("D1 Update Inquiry Error:", err);
    return Response.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
