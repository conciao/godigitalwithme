"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { 
      label: "Overview", 
      href: "/dashboard", 
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> 
    },
    { 
      label: "Inquiries", 
      href: "/dashboard/inquiries", 
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> 
    },
    { 
      label: "Reservations", 
      href: "/dashboard/reservations", 
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="5" width="16" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="4" y1="11" x2="20" y2="11"/></svg> 
    },
    { 
      label: "Calendar", 
      href: "/dashboard/calendar", 
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> 
    },
    { 
      label: "Settings", 
      href: "/dashboard/settings", 
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> 
    },
  ];

  // Robust link matching that handles both subdomain (/) and root (/dashboard) contexts
  const isLinkActive = (href: string) => {
    // Exact match
    if (pathname === href) return true;
    
    // Subdomain root match
    if (pathname === "/" && href === "/dashboard") return true;
    
    // Subdomain path matches (e.g. /inquiries vs /dashboard/inquiries)
    const subPath = href.replace("/dashboard", "");
    if (subPath && pathname === subPath) return true;
    
    return false;
  };

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar animate-fade-in">
          <div className="sidebar__logo">🌸 <span>Venue Panel</span></div>
          <nav className="sidebar__nav">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                className={`sidebar__link ${isLinkActive(item.href) ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="sidebar__link" 
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#f87171", display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="main-content animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href} 
            className={`mobile-nav__link ${isLinkActive(item.href) ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
