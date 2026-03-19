"use client";

import { useEffect, useState } from "react";
import { Company } from "@/types/database";
import AddCompanyModal from "@/components/AddCompanyModal";
import EmptyState from "@/components/EmptyState";
import { signOut } from "next-auth/react";

interface PlatformInquiry {
  id: number;
  company_name: string;
  owner_name: string;
  contact_number: string;
  email: string;
  location: string;
  plan: string;
  status: string;
  created_at: string;
}

export default function AdminDashboardContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [platformInquiries, setPlatformInquiries] = useState<PlatformInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState([
    { icon: "🏢", label: "Total Companies", value: "0", change: "...", color: "#7c3aed" },
    { icon: "📋", label: "Total Inquiries", value: "0", change: "...", color: "#0ea5e9" },
    { icon: "📅", label: "Reservations", value: "0", change: "...", color: "#10b981" },
    { icon: "💰", label: "Platform Revenue", value: "₱0", change: "Subscription billing TBD", color: "#f59e0b" },
  ]);

  const loadData = async () => {
    try {
      const [compRes, inqRes] = await Promise.all([
        fetch("/api/companies"),
        fetch("/api/platform-inquiries/all")
      ]);

      if (!compRes.ok || !inqRes.ok) throw new Error("Unauthorized or Fetch Error");
      
      const compData = await compRes.json() as Company[];
      const inqData = await inqRes.json() as PlatformInquiry[];
      
      setCompanies(compData);
      setPlatformInquiries(inqData);

      // Update stats summary
      const totalInquiries = compData.reduce((acc, curr) => acc + (curr.inquiries || 0), 0);
      const totalReservations = compData.reduce((acc, curr) => acc + (curr.reservations || 0), 0);
      
      setStats([
        { icon: "🏢", label: "Total Companies", value: compData.length.toString(), change: "Live from D1", color: "#7c3aed" },
        { icon: "📋", label: "Total Inquiries", value: totalInquiries.toString(), change: "All tenants", color: "#0ea5e9" },
        { icon: "📅", label: "Reservations", value: totalReservations.toString(), change: "All time", color: "#10b981" },
        { icon: "💰", label: "Platform Revenue", value: "₱0", change: "Subscription billing TBD", color: "#f59e0b" },
      ]);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSuccess = (name: string) => {
    setNotification(`Successfully added ${name}!`);
    loadData();
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <>
      {showAddModal && <AddCompanyModal onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />}
      
      <div className="app-shell">
        
        {/* Sidebar */}
        <aside className="sidebar animate-fade-in">
          <div className="sidebar__logo">GoDigital<span>WithMe</span></div>
          <nav className="sidebar__nav">
            <button 
              onClick={() => setActiveTab("overview")} 
              className={`sidebar__link ${activeTab === "overview" ? "active" : ""}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("companies")} 
              className={`sidebar__link ${activeTab === "companies" ? "active" : ""}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              Companies
              <span className="sidebar__badge">{companies.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab("leads")} 
              className={`sidebar__link ${activeTab === "leads" ? "active" : ""}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              Platform Leads
              <span className="sidebar__badge" style={{ background: "#10b981" }}>{platformInquiries.filter(i => i.status === 'new').length}</span>
            </button>
            
            <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="sidebar__link" 
                style={{ color: "#f87171" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="main-content animate-fade-in">
          {notification && (
            <div style={{
              position: "fixed", top: "2rem", right: "2rem", background: "#10b981",
              color: "#fff", padding: "1rem 2rem", borderRadius: "10px", zIndex: 1100,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)", animation: "fadeInUp 0.3s forwards"
            }}>
              ✅ {notification}
            </div>
          )}

          <div className="topbar">
            <div>
              <div className="topbar__title" style={{ fontSize: "1.7rem", marginBottom: "0.2rem" }}>
                {activeTab === "overview" && <>Master <span>Dashboard</span></>}
                {activeTab === "companies" && <>Venue <span>Partners</span></>}
                {activeTab === "leads" && <>Platform <span>Leads</span></>}
              </div>
              <div className="topbar__sub" style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                {activeTab === "overview" && "Platform-wide overview — all companies"}
                {activeTab === "companies" && "Manage onboarded companies and their subscriptions"}
                {activeTab === "leads" && "New venue inquiries from GoDigitalWithMe.com"}
              </div>
            </div>
            <button className="btn btn--primary" onClick={() => setShowAddModal(true)} style={{ width: "auto" }}>+ Add Company</button>
          </div>

          {activeTab === "overview" && (
            <>
              {/* Stats */}
              <div className="stats-grid">
                {stats.map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-card__icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
                    <div className="stat-card__value">{s.value}</div>
                    <div className="stat-card__label">{s.label}</div>
                    <div className="stat-card__change">{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Quick View Table */}
              <div className="section-header">
                <span className="section-title">Recent Companies</span>
                <button className="btn btn--ghost" onClick={() => setActiveTab("companies")}>View All →</button>
              </div>
              
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Inquiries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.slice(0, 5).map((c) => (
                      <tr key={c.id}>
                        <td data-label="Company" style={{ fontWeight: 600, color: "#fff" }}>{c.name}</td>
                        <td data-label="Plan"><span className="badge badge--active">{c.plan}</span></td>
                        <td data-label="Status"><span className={`badge badge--${c.status}`}>{c.status}</span></td>
                        <td data-label="Inquiries">{c.inquiries || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "companies" && (
            <div className="table-wrap animate-fade-in" style={{ marginTop: "1rem" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Company</th>
                    <th>Slug</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Inquiries</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c.id}>
                      <td data-label="#">{c.id}</td>
                      <td data-label="Company" style={{ fontWeight: 600, color: "#fff" }}>{c.name}</td>
                      <td data-label="Slug">{c.slug}</td>
                      <td data-label="Plan"><span className="badge badge--active">{c.plan}</span></td>
                      <td data-label="Status"><span className={`badge badge--${c.status}`}>{c.status}</span></td>
                      <td data-label="Inquiries">{c.inquiries || 0}</td>
                      <td data-label="Actions"><button className="btn btn--ghost">Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "leads" && (
            <div className="table-wrap animate-fade-in" style={{ marginTop: "1rem" }}>
              {platformInquiries.length === 0 ? (
                <EmptyState 
                  icon="✉️"
                  title="No Platform Leads"
                  description="New inquiries from your main website will appear here."
                />
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Owner</th>
                      <th>Email / Phone</th>
                      <th>Requested Plan</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformInquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td data-label="Company" style={{ fontWeight: 600, color: "#fff" }}>{inq.company_name}</td>
                        <td data-label="Owner">{inq.owner_name}</td>
                        <td data-label="Email / Phone">
                          <div style={{ fontSize: "0.85rem" }}>{inq.email}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{inq.contact_number}</div>
                        </td>
                        <td data-label="Plan"><span className="badge badge--active" style={{ background: "#7c3aed33", color: "#a78bfa" }}>{inq.plan}</span></td>
                        <td data-label="Location" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{inq.location}</td>
                        <td data-label="Status"><span className={`badge badge--${inq.status}`}>{inq.status}</span></td>
                        <td data-label="Date" style={{ fontSize: "0.8rem" }}>{new Date(inq.created_at).toLocaleDateString()}</td>
                        <td data-label="Actions">
                          <button className="btn btn--primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>Onboard</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE NAV (STICKY BOTTOM) */}
      <nav className="mobile-nav">
        <button 
          onClick={() => setActiveTab("overview")} 
          className={`mobile-nav__link ${activeTab === "overview" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Overview
        </button>
        <button 
          onClick={() => setActiveTab("companies")} 
          className={`mobile-nav__link ${activeTab === "companies" ? "active" : ""}`}
          style={{ position: "relative" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          Companies
        </button>
        <button 
          onClick={() => setActiveTab("leads")} 
          className={`mobile-nav__link ${activeTab === "leads" ? "active" : ""}`}
          style={{ position: "relative" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          Leads
        </button>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mobile-nav__link"
          style={{ color: "#f87171" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </nav>
    </>
  );
}
