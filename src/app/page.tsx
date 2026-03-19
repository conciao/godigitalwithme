"use client";
import { useState } from "react";
import PlatformInquiryForm from "@/components/PlatformInquiryForm";

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const handleSelectPlan = (e: React.MouseEvent<HTMLAnchorElement>, plan: string) => {
    e.preventDefault();
    setSelectedPlan(plan);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#ededed", fontFamily: "var(--font-geist-sans, system-ui)" }}>
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav-links { display: none !important; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.05); }
          30% { transform: scale(1); }
          45% { transform: scale(1.05); }
          60% { transform: scale(1); }
        }
        .heartbeat-btn {
          animation: heartbeat 2.5s infinite;
          transform-origin: center;
        }
      `}</style>
      {/* Nav */}
      <nav style={{ padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(124,58,237,0.1)", position: "sticky", top: 0, background: "rgba(10, 10, 15, 0.8)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
          Go<span style={{ color: "#a78bfa" }}>Digital</span>WithMe
        </div>
        <div className="desktop-nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Home</a>
          <a href="#inquiry" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Inquire Now</a>
          <a href="/login" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Sign In</a>
          <a href="/venue/grand-venue" target="_blank" className="heartbeat-btn" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", padding: "0.6rem 1.5rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", border: "1px solid rgba(124,58,237,0.3)", boxShadow: "0 0 15px rgba(124,58,237,0.4)" }}>
            Try Live Demo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "8rem 2rem 6rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% -20%, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "100px", padding: "0.5rem 1.25rem", fontSize: "0.85rem", color: "#a78bfa", fontWeight: 600, marginBottom: "2rem", boxShadow: "0 0 20px rgba(124,58,237,0.1)" }}>
            ✨ Elevate Your Venue Brand
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 900, lineHeight: 1, marginBottom: "1.5rem", letterSpacing: "-0.04em", background: "linear-gradient(to bottom, #fff 30%, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The Digital Foundation for<br />Your Dream Venue
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#9ca3af", lineHeight: 1.6, marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
            Stop managing via spreadsheets. Get a stunning website, automated inquiry tracking, and a professional dashboard.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#inquiry" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", padding: "1rem 2.5rem", borderRadius: "14px", fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", boxShadow: "0 10px 25px -5px rgba(124,58,237,0.4)" }}>
              Free Trial for 1-Month
            </a>
            <a href="/venue/grand-venue" target="_blank" style={{ background: "rgba(255,255,255,0.03)", color: "white", padding: "1rem 2.5rem", borderRadius: "14px", fontWeight: 600, fontSize: "1.1rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              See Live Demo
            </a>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", marginBottom: "1rem" }}>Built for Growth</h2>
          <p style={{ color: "#6b7280" }}>Everything you need to run a modern event venue.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
          {[
            { icon: "🎨", title: "Custom Dream Design", desc: "We don't just give you a template. We custom-build the design of your dream website to match your venue's unique aesthetic and elegance." },
            { icon: "⚡", title: "Smart Inquiry Management", desc: "Instantly capture leads from your public site and manage them through a streamlined pipeline: New, Approved, Booked, or Rejected." },
            { icon: "📈", title: "Monitoring & Tracking", desc: "Full transparency on your business. Track event dates, guest counts, and payments with monthly revenue statistics at a glance." },
          ].map(f => (
            <div key={f.title} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "3rem 2.5rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>{f.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "1rem", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" style={{ padding: "6rem 2rem", background: "rgba(124,58,237,0.02)", position: "relative" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", marginBottom: "1.25rem" }}>Pricing Packages</h2>
            <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Transparent pricing to help your business scale at any stage.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "stretch" }}>
            {/* Basic */}
            <div style={{ background: "#13131a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "3rem", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Starter</div>
              <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: "1.5rem" }}>Basic Package</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 3rem 0", flex: 1 }}>
                {["Static Website", "Maximum of 10 Photos Gallery", "Important Company Info", "Static Map Location"].map(item => (
                  <li key={item} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", color: "#9ca3af" }}>
                    <span style={{ color: "#a78bfa" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="#inquiry" onClick={(e) => handleSelectPlan(e, 'basic')} style={{ textAlign: "center", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", padding: "1rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>Get Basic</a>
            </div>

            {/* Standard */}
            <div style={{ background: "linear-gradient(145deg, #1a1a2e 0%, #13131a 100%)", border: "2px solid #7c3aed", borderRadius: "24px", padding: "3rem", display: "flex", flexDirection: "column", transform: "scale(1.05)", boxShadow: "0 20px 50px -12px rgba(124,58,237,0.3)", position: "relative" }}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "#7c3aed", color: "#fff", padding: "0.4rem 1.25rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 800 }}>MOST POPULAR</div>
              <div style={{ color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Growth</div>
              <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: "1.5rem" }}>Standard Package</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 3rem 0", flex: 1 }}>
                <li style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>All in Basic Package +</li>
                {["Interactive Map", "Email Inquiry (Google Form)"].map(item => (
                  <li key={item} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", color: "#9ca3af" }}>
                    <span style={{ color: "#a78bfa" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="#inquiry" onClick={(e) => handleSelectPlan(e, 'standard')} style={{ textAlign: "center", background: "#7c3aed", color: "#fff", padding: "1rem", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>Choose Standard</a>
            </div>

            {/* Premium */}
            <div style={{ background: "#13131a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "3rem", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Ultimate</div>
              <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: "1.5rem" }}>Premium Package</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 3rem 0", flex: 1 }}>
                <li style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>All in Standard Package +</li>
                {["Access to Dashboard Panel", "Overview Dashboard", "Full Inquiry Management", "Reservation Tracking", "Interactive Calendar"].map(item => (
                  <li key={item} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", color: "#9ca3af" }}>
                    <span style={{ color: "#a78bfa" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="#inquiry" onClick={(e) => handleSelectPlan(e, 'premium')} style={{ textAlign: "center", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", padding: "1rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>Get Premium</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: "6rem 2rem", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", margin: 0 }}>About</h2>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>Go<span style={{ color: "#a78bfa" }}>Digital</span>WithMe</div>
        </div>
        <p style={{ fontSize: "1.2rem", color: "#9ca3af", lineHeight: 1.8 }}>
          We are a dedicated team of digital architects specializing in venue transformation. Our mission is to bridge the gap between traditional venue management and the modern digital era. We don't just build websites; we build engines that power your company's growth, efficiency, and professional image.
        </p>
      </section>

      {/* Reviews */}
      <section style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", marginBottom: "1rem" }}>What Our Partners Say</h2>
          <div style={{ color: "#f59e0b", fontSize: "1.5rem" }}>⭐⭐⭐⭐⭐ 5.0 Rating</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {[
            { name: "Maria Clara", venue: "The Heritage Garden", text: "GoDigitalWithMe transformed how we handle inquiries. We went from messy notebooks to a beautiful dashboard. Our bookings increased by 40%!" },
            { name: "Robert Santos", venue: "Metropolis Hall", text: "The custom design they did for our website is stunning. It feels like a high-end luxury brand. The analytics helped us see where we earn the most." },
            { name: "Elena Cruz", venue: "Seaside Pavilion", text: "Best investment for our business. The calendar system is a lifesaver, and the inquiry form is so easy for our clients to use." },
          ].map(r => (
            <div key={r.name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
              <p style={{ fontStyle: "italic", color: "#d1d5db", marginBottom: "1.5rem", lineHeight: 1.6 }}>"{r.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem" }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff" }}>{r.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{r.venue}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" style={{ padding: "6rem 2rem", background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 100%)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: "1rem" }}>Start Your Journey</h2>
            <p style={{ color: "#9ca3af", fontSize: "1.1rem" }}>Fill out the form below and we will build your dream platform.</p>
          </div>
          <PlatformInquiryForm selectedPlan={selectedPlan} />
        </div>
      </section>

      <footer style={{ padding: "4rem 2rem", background: "#050507", textAlign: "center", borderTop: "1px solid rgba(124,58,237,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Go<span style={{ color: "#a78bfa" }}>Digital</span>WithMe</div>
        </div>
        <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "2rem" }}>Empowering event venues with world-class digital tools Since 2025.</p>
        <div style={{ color: "#374151", fontSize: "0.8rem" }}>
          © 2025 GoDigitalWithMe. Built with passion for excellence.
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        <a href="#" className="mobile-nav__link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>Home</span>
        </a>
        <a href="#inquiry" className="mobile-nav__link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Inquire</span>
        </a>
        <a href="/venue/grand-venue" target="_blank" className="mobile-nav__link heartbeat-btn" style={{ color: "#a78bfa" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Live Demo</span>
        </a>
        <a href="/login" className="mobile-nav__link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <span>Sign In</span>
        </a>
      </nav>
    </div>
  );
}
