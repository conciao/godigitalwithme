// src/app/api/platform-inquiries/route.ts
import { supabase } from "@/lib/supabase";

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

    const { error: insertError } = await supabase
      .from("platform_inquiries")
      .insert({
        company_name,
        owner_name,
        contact_number: contact_number || "",
        email,
        location: location || "",
        plan,
        status: 'new'
      });

    if (insertError) {
      console.error("❌ Supabase Insertion Error:", insertError.message);
      return Response.json(
        { error: "Failed to store inquiry in database" },
        { status: 500 }
      );
    }

    console.log("✅ Platform inquiry stored in Supabase:", { company_name, email, plan });

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
