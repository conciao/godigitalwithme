"use client";
export const runtime = 'edge';

import { useEffect, useState } from "react";
import { Inquiry, Reservation } from "@/types/database";
import DashboardChart from "@/components/DashboardChart";

export default function OverviewPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { icon: "📋", label: "New Inquiries", value: "0", color: "#7c3aed" },
    { icon: "📅", label: "Confirmed Bookings", value: "0", color: "#0ea5e9" },
    { icon: "✅", label: "Completed Events", value: "0", color: "#10b981" },
    { icon: "💰", label: "Total Revenue", value: "₱0", color: "#f59e0b" },
  ]);

  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    try {
      setHasError(false);
      const [inqRes, resRes] = await Promise.all([
        fetch("/api/inquiries"),
        fetch("/api/reservations")
      ]);

      if (!inqRes.ok || !resRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const inqData = await inqRes.json() as Inquiry[];
      const resData = await resRes.json() as Reservation[];

      if (!Array.isArray(inqData) || !Array.isArray(resData)) {
        throw new Error("Invalid data format received");
      }

      setInquiries(inqData);
      setReservations(resData);

      const newCount = inqData.filter(i => i?.status === "new").length;
      const confirmedCount = resData.filter(r => r?.status === "confirmed").length;
      const completedCount = resData.filter(r => r?.status === "completed").length;
      const totalRevenue = resData.reduce((acc, curr) => acc + (curr?.amount || 0), 0);

      setStats([
        { icon: "📋", label: "New Inquiries", value: newCount.toString(), color: "#7c3aed" },
        { icon: "📅", label: "Confirmed Bookings", value: confirmedCount.toString(), color: "#0ea5e9" },
        { icon: "✅", label: "Completed Events", value: completedCount.toString(), color: "#10b981" },
        { icon: "💰", label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, color: "#f59e0b" },
      ]);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Prepare chart data (mocking some historical data if real data is single-day)
  // In a real app we'd group by month/day in SQL
  const inquiryChartData = [
    { label: "Mon", value: 3 },
    { label: "Tue", value: 5 },
    { label: "Wed", value: 2 },
    { label: "Thu", value: 8 },
    { label: "Fri", value: 6 },
    { label: "Sat", value: 10 },
    { label: "Sun", value: 4 },
  ];

  const revenueChartData = [
    { label: "Jan", value: 45000 },
    { label: "Feb", value: 52000 },
    { label: "Mar", value: 48000 },
    { label: "Apr", value: 61000 },
    { label: "May", value: 55000 },
    { label: "Jun", value: 72000 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar__title" style={{ fontSize: "1.7rem", marginBottom: "0.2rem" }}>Dashboard Over<span>view</span></div>
          <div className="topbar__sub" style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Welcome back! Here's what's happening with your venue today.</div>
        </div>
      </div>

      {/* Stats Cards */}
      {hasError ? (
        <div className="stat-card" style={{ padding: "3rem", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.05)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
          <h3 style={{ color: "#f87171", marginBottom: "0.5rem" }}>Failed to load dashboard data</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            There was a problem connecting to the server. Please check your connection and try again.
          </p>
          <button onClick={() => loadData()} className="btn btn--primary">Retry Loading</button>
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: "2rem" }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-card__icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
                <div className="stat-card__value">{s.value}</div>
                <div className="stat-card__label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Analytics Row */}
          <div className="analytics-grid" style={{ marginBottom: "2rem" }}>
            <DashboardChart 
              title="Weekly Inquiry Volume" 
              data={inquiryChartData} 
              color="#7c3aed"
            />
            <DashboardChart 
              title="Monthly Revenue Tracking (₱)" 
              data={revenueChartData} 
              color="#10b981"
            />
          </div>
        </>
      )}

      {/* Recent Activity Quick View */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div className="stat-card" style={{ padding: "1.5rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Recent Reservations</h4>
          {reservations.slice(0, 5).map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{r.client_name}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{r.event_type} • {r.event_date}</div>
              </div>
              <div style={{ color: "#fbbf24", fontWeight: 800, fontSize: "1.1rem" }}>₱{r.amount?.toLocaleString()}</div>
            </div>
          ))}
          {reservations.length === 0 && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No active reservations</div>}
        </div>

        <div className="stat-card" style={{ padding: "1.5rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>New Inquiries</h4>
          {inquiries.filter(i => i.status === "new").slice(0, 5).map(iq => (
            <div key={iq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{iq.client_name}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{iq.event_date} • {iq.guest_count} guests</div>
              </div>
              <span className="badge badge--new" style={{ padding: "0.4rem 0.6rem", fontSize: "0.6rem", borderRadius: "20px" }}>NEW</span>
            </div>
          ))}
          {inquiries.filter(i => i.status === "new").length === 0 && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No new inquiries</div>}
        </div>
      </div>
    </div>
  );
}
