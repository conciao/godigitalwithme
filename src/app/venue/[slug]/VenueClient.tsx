"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface VenuePageProps {
  venue: any;
  slug: string;
}

const backgroundPattern = "linear-gradient(135deg, #f0fdfa 0%, #fffbeb 50%, #fdf4ff 100%)";

export default function VenueClient({ venue, slug }: VenuePageProps) {
  // ── FALLBACK DATA ──────────────────────────────────────────────
  const venueData = {
    venueAbout: `Welcome to ${venue?.name || "Our Grand Venue"}! With over 15 years of exceptional service in the hospitality and events industry, we take pride in offering premium spaces for your most cherished moments.`,
    heroSubtitle: "Your most beautiful chapter begins here.",
    heroImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
  };

  const venuePackages = (venue?.packages && Array.isArray(venue.packages) && venue.packages.length > 0) 
    ? venue.packages 
    : [
        { name: "Wedding Package", price: "₱150,000", guests: "Up to 200 Guests", includes: ["Full Venue Access", "Catering Included", "Photoshoot Area", "Bridal Suite"] },
        { name: "Birthday Package", price: "₱60,000", guests: "Up to 100 Guests", includes: ["Party Hall", "Basic Decorations", "Sound System"] },
        { name: "Corporate Event", price: "₱90,000", guests: "Up to 300 Guests", includes: ["Conference Hall", "Projector & Audio", "Lunch Buffet"] },
      ];

  const venueFacilities = (venue?.facilities && Array.isArray(venue.facilities) && venue.facilities.length > 0)
    ? venue.facilities
    : [
        { id: "pool", name: "Swimming Pool", icon: "🌊", price: "₱15,000 / Day", description: "Dive into luxury with our crystal-clear infinity pool.", photo: { url: "https://images.unsplash.com/photo-1543088925-5e608df9dff1?w=800&q=80", desc: "Main Infinity Pool View" }, dosAndDonts: ["Proper swimwear required", "No glass near the pool area"], timeIn: "8:00 AM", timeOut: "10:00 PM", size: "250 sq meters" },
        { id: "rooms", name: "Luxury Rooms", icon: "🛏️", price: "Starts at ₱5,000 / Night", description: "Experience premium comfort in our luxury suites.", photo: { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", desc: "Master Bedroom Suite" }, dosAndDonts: ["Maximum 4 guests per room"], timeIn: "2:00 PM", timeOut: "12:00 NN", size: "40 sq meters each" },
      ];

  // ── STATE ──────────────────────────────────────────────────────
  const [activeFacility, setActiveFacility] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ── OWNER EDIT MODE STATE ──────────────────────────────────────
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    tagline: venue?.tagline || venueData.heroSubtitle,
    description: venue?.description || venueData.venueAbout,
    hero_image: venue?.hero_image_url || venueData.heroImage
  });

  const isOwner = session?.user?.role === "super_admin" || 
                 (session?.user?.role === "tenant_admin" && session?.user?.companySlug === slug);

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
    }
    setIsSubmitting(false);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const resp = await fetch("/api/venue/settings", {
        method: "PATCH",
        body: JSON.stringify({
          tagline: editData.tagline,
          description: editData.description
        }),
        headers: { "Content-Type": "application/json" }
      });
      if (resp.ok) {
        setIsEditing(false);
        alert("🎉 Changes saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      alert("❌ Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)", background: "#ffffff", color: "#111827", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: backgroundPattern, pointerEvents: "none", zIndex: 0 }} />
      
      <style>{`
        .venue-nav { display: flex; gap: 2rem; align-items: center; justify-content: center; padding: 1rem; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; border-bottom: 2px dashed #f1f5f9; }
        .venue-nav a { color: #374151; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: color 0.2s; }
        .venue-nav a:hover { color: #6366f1; }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.05); } 30% { transform: scale(1); } 45% { transform: scale(1.05); } 60% { transform: scale(1); } }
        .heartbeat-btn { animation: heartbeat 2s infinite; display: inline-block; transform-origin: center; }
        .section-padding { padding: 6rem 2rem; }
        .hero-padding { padding: 9rem 2rem; }
        .section-title { font-size: 2.5rem; }
        .hero-title { font-size: clamp(2rem, 8vw, 4rem); }
        .custom-input { width: 100%; padding: 0.8rem 1rem; background: rgba(255,255,255,0.8); border: 2px solid #e2e8f0; border-radius: 12px; color: #111827; font-size: 0.95rem; outline: none; transition: border-color 0.2s; backdrop-filter: blur(5px); }
        .custom-label { font-size: 0.8rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .hover-card { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; border: 2px solid transparent; }
        .hover-card:hover { transform: translateY(-8px); border-color: #6366f1; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.15); }
        .checkbox-label { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.8); padding: 0.6rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; color: #334155; border: 1px solid #e2e8f0; cursor: pointer; }
        @media (max-width: 1024px) { .venue-nav { display: none; } .mobile-nav-venue { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e5e7eb; z-index: 1000; justify-content: space-around; padding: 0.6rem 0; shadow: 0 -5px 15px rgba(0,0,0,0.05); } }
      `}</style>

      <nav className="venue-nav">
        <a href="#home">Home</a>
        <a href="#facilities">Facilities</a>
        <a href="#packages">Packages</a>
        <a href="#about">About Us</a>
        <a href="#inquiry" className="heartbeat-btn" style={{ background: "linear-gradient(135deg, #ffffff, #ffeb3b)", color: "#854d0e", padding: "0.5rem 1.5rem", borderRadius: "50px", fontWeight: 800 }}>Inquire Now</a>
      </nav>

      {/* HERO */}
      <section id="home" className="hero-padding" style={{ background: `url('${editData.hero_image}') center/cover`, textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.65)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="hero-title" style={{ fontWeight: 900, color: "#fff", textShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            {venue?.name || "The Grand Venue"}
          </h1>
          
          {isEditing ? (
            <textarea 
              value={editData.tagline}
              onChange={(e) => setEditData({ ...editData, tagline: e.target.value })}
              style={{ width: "100%", maxWidth: "600px", background: "rgba(255,255,255,0.1)", border: "1px dashed #fff", color: "#fff", fontSize: "1.2rem", padding: "1rem", borderRadius: "12px", textAlign: "center", margin: "2rem auto" }}
            />
          ) : (
            <p style={{ fontSize: "1.5rem", color: "#fef3c7", marginBottom: "2.5rem", fontWeight: 600 }}>{editData.tagline}</p>
          )}
          
          <a href="#inquiry" style={{ background: "linear-gradient(135deg, #ffffff, #ffeb3b)", color: "#854d0e", padding: "1.2rem 3rem", borderRadius: "50px", fontWeight: 800, textDecoration: "none" }}>
            Book Your Date
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section-padding" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "2rem" }}>About Us</h2>
        {isEditing ? (
          <textarea 
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            style={{ width: "100%", background: "#f8fafc", border: "1px dashed #6366f1", color: "#475569", fontSize: "1.1rem", padding: "1.5rem", borderRadius: "20px", minHeight: "200px" }}
          />
        ) : (
          <p style={{ fontSize: "1.15rem", color: "#475569", lineHeight: 1.9 }}>{editData.description}</p>
        )}
      </section>

      {/* FACILITIES */}
      <section id="facilities" className="section-padding" style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <h2 style={{ fontSize: "2.5rem", textAlign: "center", fontWeight: 800, marginBottom: "3rem" }}>Facilities</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {venueFacilities.map((fac: any) => (
            <div key={fac?.id || fac?.name || Math.random()} className="hover-card" onClick={() => setActiveFacility(fac)} style={{ background: "#fff", padding: "2rem", borderRadius: "24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{fac?.icon}</div>
              <div style={{ fontWeight: 800, color: "#1e293b" }}>{fac?.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INQUIRY */}
      <section id="inquiry" className="section-padding" style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ background: "#fff", padding: "3rem", borderRadius: "32px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Send Inquiry</h2>
          <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <input type="hidden" name="company_slug" value={slug} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input name="client_name" required placeholder="Name" className="custom-input" />
              <input name="client_email" required type="email" placeholder="Email" className="custom-input" />
            </div>
            <input name="event_date" required type="date" className="custom-input" />
            <button type="submit" disabled={isSubmitting} style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)", color: "#fff", padding: "1rem", borderRadius: "12px", border: "none", fontWeight: 700 }}>
              {isSubmitting ? "Sending..." : "Submit Inquiry"}
            </button>
            {isSubmitted && <p style={{ color: "#10b981", textAlign: "center" }}>✅ Inquiry sent! We'll contact you soon.</p>}
          </form>
        </div>
      </section>

      {/* OWNER TOOLBAR */}
      {isOwner && (
        <div style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", background: "#0f172a", padding: "0.8rem 1.5rem", borderRadius: "50px", display: "flex", gap: "1rem", zIndex: 9999 }}>
          {isEditing ? (
            <>
              <button onClick={saveChanges} disabled={isSaving} style={{ background: "#10b981", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "20px" }}>{isSaving ? "Saving..." : "Save"}</button>
              <button onClick={() => setIsEditing(false)} style={{ color: "#fff", border: "none", background: "none" }}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "0.5rem 1.5rem", borderRadius: "20px" }}>Edit Site</button>
              <Link href="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ color: "#f87171", border: "none", background: "none" }}>Logout</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
