"use client";

import { useEffect, useState } from "react";
import { Inquiry } from "@/types/database";
import BookingModal from "@/components/BookingModal";
import EmptyState from "@/components/EmptyState";
import { supabase } from "@/lib/supabase";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      const res = await fetch("/api/inquiries");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      const data = await res.json() as Inquiry[];
      setInquiries(data || []);
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // ── REALTIME SUBSCRIPTION ──────────────────────────────────────────
    // Listen for NEW inquiries inserted into the table
    const channel = supabase
      .channel('realtime_inquiries')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'inquiries' }, 
        (payload) => {
          console.log('⚡ New Inquiry Received!', payload);
          // Prepend the new inquiry to the list
          setInquiries((current) => [payload.new as Inquiry, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  const filteredInquiries = inquiries.filter(iq => {
    if (filter === "all") return true;
    return iq.status === filter;
  });

  return (
    <>
      <div className="animate-fade-in">
        <div className="topbar">
          <div>
            <div className="topbar__title">Venue Inquiries</div>
            <div className="topbar__sub">Manage and respond to potential event leads</div>
          </div>
        </div>

        <div className="section-header" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", WebkitOverflowScrolling: "touch" }}>
            {["all", "new", "approved", "booked", "rejected"].map((s) => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`btn ${filter === s ? "btn--primary" : "btn--ghost"}`}
                style={{ 
                  padding: "0.4rem 0.9rem", 
                  fontSize: "0.85rem", 
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "4rem 1rem", textAlign: "center", color: "#6b7280" }}>Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <EmptyState 
            icon="✉️"
            title={filter === "all" ? "No Inquiries Yet" : `No ${filter} Inquiries`}
            description={filter === "all" ? "When visitors contact you from your venue website, they will appear here." : "Try changing the filter to see other inquiries."}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Facilities</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((iq) => (
                  <tr key={iq.id}>
                    <td data-label="Client" style={{ fontWeight: 600, color: "#fff" }}>
                      <div>
                        <div>{iq.client_name}</div>
                        <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.25rem" }}>{iq.event_type || "N/A"}</div>
                      </div>
                    </td>
                    <td data-label="Facilities">
                      <span style={{ fontSize: "0.8rem", color: "#d1d5db" }}>
                        {iq.facilities ? iq.facilities : <span style={{ color: "#6b7280" }}>None Specified</span>}
                      </span>
                    </td>
                    <td data-label="Event Date">{iq.event_date || "N/A"}</td>
                    <td data-label="Status"><span className={`badge badge--${iq.status}`} style={{ textTransform: "capitalize" }}>{iq.status}</span></td>
                    <td data-label="Actions">
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {iq.status === "new" && (
                          <>
                          <button 
                            className="btn btn--primary" 
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                            onClick={() => handleStatusUpdate(iq.id, "approved")}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn--ghost" 
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}
                            onClick={() => handleStatusUpdate(iq.id, "rejected")}
                          >
                            Decline
                          </button>
                          </>
                        )}
                        {iq.status === "approved" && (
                          <button 
                            className="btn btn--primary" 
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "#f59e0b" }}
                            onClick={() => setSelectedInquiry(iq)}
                          >
                            Finalize
                          </button>
                        )}
                        <button 
                          className="btn btn--ghost" 
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          onClick={() => setSelectedInquiry(iq)}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInquiry && (
        <BookingModal 
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onSuccess={() => loadData()}
        />
      )}
    </>
  );
}
