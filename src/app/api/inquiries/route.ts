import { auth } from "@/auth";
import { getDB } from "@/lib/db";
import { Inquiry } from "@/types/database";

export const runtime = "edge";

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDB();
    let query = "SELECT * FROM inquiries";
    const params: any[] = [];

    if (session.user.role === "tenant_admin") {
      query += " WHERE company_id = ?";
      params.push(session.user.companyId);
    }

    query += " ORDER BY created_at DESC";
    const { results } = await db.prepare(query).bind(...params).all<Inquiry>();
    return Response.json(results);
  } catch (err) {
    console.error("D1 Fetch Inquiries Error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let company_slug: string | null = null;
    let client_name: string | null = null;
    let client_email: string | null = null;
    let client_phone: string | null = null;
    let event_type: string | null = null;
    let event_date: string | null = null;
    let event_time: string | null = null;
    let guest_count: number | null = null;
    let facilities: string | null = null;
    let message: string | null = null;

    const contentType = request.headers.get("content-type") || "";

    // Handle both JSON and FormData submissions
    if (contentType.includes("application/json")) {
      const data = await request.json() as Record<string, any>;
      company_slug = data.company_slug || data.compannySlug || null;
      client_name = data.client_name || data.clientName || data.name || null;
      client_email = data.client_email || data.clientEmail || data.email || null;
      client_phone = data.client_phone || data.clientPhone || data.phone || null;
      event_type = data.event_type || data.eventType || null;
      event_date = data.event_date || data.eventDate || null;
      event_time = data.event_time || data.eventTime || null;
      facilities = Array.isArray(data.facilities) ? data.facilities.join(", ") : (data.facilities || null);
      guest_count = data.guest_count || data.guestCount ? Number(data.guest_count || data.guestCount) : null;
      message = data.message || null;
    } else {
      const formData = await request.formData();
      company_slug = formData.get("company_slug")?.toString() || null;
      client_name = formData.get("client_name")?.toString() || null;
      client_email = formData.get("client_email")?.toString() || null;
      client_phone = formData.get("client_phone")?.toString() || null;
      event_type = formData.get("event_type")?.toString() || null;
      event_date = formData.get("event_date")?.toString() || null;
      event_time = formData.get("event_time")?.toString() || null;
      const facilitiesArr = formData.getAll("facilities[]");
      facilities = facilitiesArr.length > 0 ? facilitiesArr.join(", ") : null;
      guest_count = formData.get("guest_count") ? Number(formData.get("guest_count")) : null;
      message = formData.get("message")?.toString() || null;
    }

    // Validate required fields
    if (!company_slug || !client_name || !client_email || !event_date) {
      console.error("❌ Missing required fields:", { company_slug, client_name, client_email, event_date });
      return new Response(JSON.stringify({ 
        error: "Missing required fields: company_slug, client_name, client_email, event_date" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = getDB();
    console.log("🔍 Looking for company with slug:", company_slug);
    
    const company = await db.prepare("SELECT id FROM companies WHERE slug = ?")
      .bind(company_slug).first<{ id: number }>();
      
    if (!company) {
      console.error("❌ Unknown venue slug:", company_slug);
      return new Response(JSON.stringify({ error: `Unknown venue: ${company_slug}` }), { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      await db.prepare(
        `INSERT INTO inquiries
         (company_id, client_name, client_email, client_phone, event_type, event_date, event_time, guest_count, facilities, message, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'), datetime('now'))`
      ).bind(company.id, client_name, client_email, client_phone, event_type, event_date, event_time, guest_count, facilities, message).run();

      console.log("✅ New inquiry stored in D1 for company ID:", company.id);
      
      // Return JSON response or redirect based on content-type
      if (contentType.includes("application/json")) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Inquiry submitted successfully!",
          redirect: `/venue/${company_slug}?submitted=1`
        }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        const origin = new URL(request.url).origin;
        return Response.redirect(`${origin}/venue/${company_slug}?submitted=1`, 303);
      }
    } catch (dbErr) {
      console.error("❌ Database insertion error:", dbErr);
      return new Response(JSON.stringify({ error: "Failed to store inquiry in database" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (err) {
    console.error("Critical Inquiry Submission Error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
