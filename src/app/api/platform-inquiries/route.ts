// src/app/api/platform-inquiries/route.ts
import { getDB } from "@/lib/db";

export const runtime = "edge";

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
  return new Response(null, { status: 200, headers });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      company_name: string;
      owner_name: string;
      contact_number?: string;
      email: string;
      location?: string;
      plan: string;
    };
    const { 
      company_name, 
      owner_name, 
      contact_number, 
      email, 
      location, 
      plan 
    } = body;

    // Basic validation
    if (!company_name || !owner_name || !email || !plan) {
      return Response.json(
        { error: "Missing required fields (Company, Owner, Email, Plan)" }, 
        { status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      );
    }

    let db;
    try {
      db = getDB();
    } catch (dbError: any) {
      console.error("❌ Database Binding Error:", dbError.message);
        return Response.json(
        { 
          error: "D1 Database Not Bound", 
          details: dbError.message,
          message: "Please ensure D1 Database binding 'DB' is configured. If testing locally, use 'npm run preview' instead of 'npm run dev'."
        }, 
        { 
          status: 503,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      );
    }

    await db.prepare(`
      INSERT INTO platform_inquiries (
        company_name, owner_name, contact_number, email, location, plan, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'new', datetime('now'), datetime('now'))
    `).bind(
      company_name, 
      owner_name, 
      contact_number || "", 
      email, 
      location || "", 
      plan
    ).run();

    console.log("✅ Platform inquiry stored:", { company_name, email, plan });

    return Response.json(
      { success: true, message: "Inquiry submitted successfully!" }, 
      { 
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err: any) {
    console.error("❌ Platform Inquiry Error:", err);
    return Response.json(
      { error: "Failed to submit inquiry. Please try again." }, 
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  }
}

export async function GET() {
  return Response.json(
    { message: "Platform Inquiries API is active" }, 
    { 
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    }
  );
}
