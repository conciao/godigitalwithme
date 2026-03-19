"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import { Reservation } from "@/types/database";
import CalendarGrid from "@/components/CalendarGrid";

export default function CalendarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/reservations");
      if (res.ok) {
        const data = await res.json() as Reservation[];
        setReservations(data || []);
      }
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
          <div className="topbar__title">Event Calendar</div>
          <div className="topbar__sub">Visualize your booking schedule and venue availability</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#6b7280" }}>Loading calendar...</div>
      ) : (
        <CalendarGrid reservations={reservations} />
      )}
    </div>
  );
}
