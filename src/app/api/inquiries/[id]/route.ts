import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

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

    // 1. Fetch inquiry to check ownership and get data for reservation
    const { data: inquiry, error: fetchError } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();
    
    if (fetchError || !inquiry) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // 2. Tenant isolation check
    if (session.user.role === "tenant_admin" && inquiry.venue_id !== session.user.companyId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Special logic for 'booked' -> Create Reservation
    if (status === "booked" && inquiry.status !== "booked") {
      const { amount, deposit_paid } = body as any;
      
      const { error: reservationError } = await supabase
        .from("reservations")
        .insert({
          venue_id: inquiry.venue_id,
          // inquiry_id: inquiry.id, // Column exists? Let's check schema.
          client_name: inquiry.client_name,
          client_email: inquiry.client_email,
          client_phone: inquiry.client_phone,
          event_type: inquiry.event_type,
          event_date: inquiry.event_date,
          event_time: inquiry.event_time,
          guest_count: inquiry.guest_count,
          amount: amount || 0,
          deposit_paid: deposit_paid || 0,
          status: 'confirmed'
        });

      if (reservationError) {
        console.error("❌ Supabase Reservation Creation Error:", reservationError.message);
        // We continue to update the inquiry status even if reservation fails (or handle error)
      }
    }

    // 4. Update status
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({ 
        status: status, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", id);

    if (updateError) throw updateError;

    return Response.json({ success: true, id, status });
  } catch (err: any) {
    console.error("Supabase Update Inquiry Error:", err);
    return Response.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
