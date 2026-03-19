"use client";

import { useState } from "react";
import { Inquiry } from "@/types/database";

interface BookingModalProps {
  inquiry: Inquiry;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ inquiry, onClose, onSuccess }: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: 15000,
    deposit_paid: 5000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "booked",
          amount: formData.amount,
          deposit_paid: formData.deposit_paid,
        }),
      });

      if (!res.ok) {
        const errData = await res.json() as { error: string };
        throw new Error(errData.error || "Failed to confirm booking");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
          Confirm Booking
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Finalize the reservation for <strong>{inquiry.client_name}</strong>.
        </p>

        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "0.75rem", borderRadius: "8px", color: "#f87171", fontSize: "0.85rem",
            marginBottom: "1.5rem"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>EVENT DETAILS</div>
            <div style={{ color: "#fff", fontWeight: 600 }}>{inquiry.event_type || "No Event Type"} — {inquiry.event_date || "No Date"}</div>
            <div style={{ fontSize: "0.8rem", color: "#a78bfa", marginBottom: "0.5rem" }}>{inquiry.guest_count || 0} guests expected</div>
            <div style={{ fontSize: "0.8rem", color: "#d1d5db", marginBottom: "0.5rem" }}>
              <span style={{ color: "#6b7280" }}>Facilities: </span>
              {inquiry.facilities || "None"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#e5e7eb", background: "rgba(255,255,255,0.05)", padding: "0.5rem", borderRadius: "8px" }}>
              <span style={{ color: "#6b7280", display: "block", marginBottom: "0.2rem" }}>Notes / Message: </span>
              {inquiry.message || "No message provided."}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>Total Package Amount (₱)</label>
            <input 
              required
              type="number" 
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>Initial Deposit Paid (₱)</label>
            <input 
              required
              type="number" 
              min="0"
              max={formData.amount}
              value={formData.deposit_paid}
              onChange={(e) => setFormData({ ...formData, deposit_paid: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
            />
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
              Remaining Balance: ₱{(formData.amount - formData.deposit_paid).toLocaleString()}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ flex: 1, padding: "0.85rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                flex: 1, padding: "0.85rem", background: "linear-gradient(135deg, #10b981, #059669)", 
                border: "none", borderRadius: "10px", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
