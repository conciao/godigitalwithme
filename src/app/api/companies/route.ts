// src/app/api/companies/route.ts
// GET  /api/companies  — list all companies (super admin)
// POST /api/companies  — create a new company (super admin)

export const runtime = "edge";

import { auth } from "@/auth";
import { getDB } from "@/lib/db";
import { Company } from "@/types/database";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDB();
    
    // Fetch companies with inquiry and reservation counts
    // We use a subquery or join for counts; here we use subqueries for simplicity in D1
    const { results } = await db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM inquiries i WHERE i.company_id = c.id) as inquiries,
        (SELECT COUNT(*) FROM reservations r WHERE r.company_id = c.id) as reservations
      FROM companies c
      ORDER BY c.created_at DESC
    `).all<Company>();

    return Response.json(results);
  } catch (err) {
    console.error("D1 Fetch Error:", err);
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

    const db = getDB();

    // 1. Check if slug exists
    const existing = await db.prepare("SELECT id FROM companies WHERE slug = ?").bind(slug).first();
    if (existing) {
      return Response.json({ error: "A venue with this subdomain already exists." }, { status: 400 });
    }

    // 2. Insert company
    await db.prepare(`
      INSERT INTO companies (name, slug, plan, contact_email, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
    `).bind(name, slug, plan, contact_email).run();

    return Response.json({ success: true, message: `Company "${name}" created.` }, { status: 201 });
  } catch (err) {
    console.error("D1 Insert Error:", err);
    return Response.json({ error: "Failed to create company" }, { status: 500 });
  }
}
