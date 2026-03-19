"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import { Reservation } from "@/types/database";
import EmptyState from "@/components/EmptyState";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/reservations");
      if (!res.ok) throw new Error("Failed to fetch reservations");
      const data = await res.json() as Reservation[];
      setReservations(data || []);
    } catch (err) {
      console.error("Failed to load reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar__title">Confirmed Reservations</div>
          <div className="topbar__sub">Track and manage your upcoming events and payments</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#6b7280" }}>Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <EmptyState 
          icon="📅"
          title="No Bookings Confirmed"
          description="Approved inquiries can be converted into confirmed reservations from the Inquiries page."
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Event Type</th>
                <th>Event Date</th>
                <th>Guest Count</th>
                <th>Total Amount</th>
                <th>Deposit Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td data-label="Client" style={{ fontWeight: 600, color: "#fff" }}>{r.client_name}</td>
                  <td data-label="Event Type">{r.event_type}</td>
                  <td data-label="Event Date">{r.event_date}</td>
                  <td data-label="Guests">{r.guest_count || "N/A"}</td>
                  <td data-label="Total" style={{ color: "#fbbf24", fontWeight: 700 }}>₱{r.amount?.toLocaleString()}</td>
                  <td data-label="Deposit" style={{ color: "#10b981" }}>₱{r.deposit_paid?.toLocaleString()}</td>
                  <td data-label="Status"><span className={`badge badge--${r.status}`} style={{ textTransform: "capitalize" }}>{r.status}</span></td>
                  <td data-label="Actions">
                    <button className="btn btn--ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
