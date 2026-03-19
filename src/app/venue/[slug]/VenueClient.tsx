"use client";

import { useState, useEffect } from "react";

interface VenuePageProps {
  venue: any;
  slug: string;
}

const backgroundPattern = "linear-gradient(135deg, #f0fdfa 0%, #fffbeb 50%, #fdf4ff 100%)";

const facilitiesData = [
  {
    id: "pool",
    name: "Swimming Pool",
    icon: "🌊",
    price: "₱15,000 / Day",
    size: "250 sq meters",
    description: "Dive into luxury with our crystal-clear infinity pool, featuring a spacious lounging deck and vibrant underwater lighting. Perfect for pool parties and serene summer retreats.",
    dosAndDonts: ["Proper swimwear required", "No glass near the pool area", "Shower before entering"],
    timeIn: "8:00 AM", timeOut: "10:00 PM",
    photo: { url: "https://images.unsplash.com/photo-1543088925-5e608df9dff1?w=800&q=80", desc: "Main Infinity Pool View" }
  },
  {
    id: "rooms",
    name: "Luxury Rooms",
    icon: "🛏️",
    price: "Starts at ₱5,000 / Night",
    size: "40 sq meters each",
    description: "Experience premium comfort in our luxury suites. Ideal for the bridal party or V.I.P guests, equipped with modern amenities and spectacular views.",
    dosAndDonts: ["Maximum 4 guests per room", "No smoking inside", "Quiet hours after 10 PM"],
    timeIn: "2:00 PM", timeOut: "12:00 NN",
    photo: { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", desc: "Master Bedroom Suite" }
  },
  {
    id: "halls",
    name: "Venue Halls",
    icon: "🏛️",
    price: "₱45,000 / Event",
    size: "500 sq meters",
    description: "Our grand venue halls offer a magnificent canvas for your celebration. High ceilings, stunning chandeliers, and a flexible layout.",
    dosAndDonts: ["No pinning on walls", "Confetti strictly outdoor", "Coordinate floorplan early"],
    timeIn: "10:00 AM", timeOut: "11:00 PM",
    photo: { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", desc: "Elegant Hall Setup" }
  },
  {
    id: "dorms",
    name: "Guest Dorms",
    icon: "🏕️",
    price: "₱8,000 / Night",
    size: "80 sq meters (12 pax)",
    description: "Accommodate large groups comfortably. Our guest dormitories are designed for bonding, equipped with sturdy bunk beds and air-conditioning.",
    dosAndDonts: ["Respect shared spaces", "No eating on beds", "Turn off AC when leaving"],
    timeIn: "2:00 PM", timeOut: "12:00 NN",
    photo: { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80", desc: "Modern Bunk Beds" }
  },
  {
    id: "photo",
    name: "Photoshoot Place",
    icon: "📸",
    price: "₱5,000 / 4 Hours",
    size: "1 Hectare Garden",
    description: "Capture lifelong memories in our picture-perfect gardens and scenic balconies. An ideal background crafted specifically for professional photography.",
    dosAndDonts: ["Do not step on specific rare flower beds", "Drones allowed with permit", "Leave no trace setups"],
    timeIn: "Flexible", timeOut: "Flexible",
    photo: { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", desc: "Romantic Garden Walkway" }
  },
  {
    id: "catering",
    name: "Catering Service",
    icon: "🍽️",
    price: "Starts at ₱850 / Head",
    size: "Flexible Serving Capacity",
    description: "Savor gourmet meals crafted by top chefs. Our exquisite catering completes your grand celebration, featuring everything from local delicacies to international cuisines.",
    dosAndDonts: ["Finalize menu 2 weeks prior", "Inform us of dietary allergies", "No outside caterers permitted without fee"],
    timeIn: "Per Event", timeOut: "Per Event",
    photo: { url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80", desc: "Gourmet Dessert Table" }
  }
];

export default function VenueClient({ venue, slug }: VenuePageProps) {
  const [activeFacility, setActiveFacility] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Submission failed", err);
    }
    setIsSubmitting(false);
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

  return (
    <div style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)", background: "#ffffff", color: "#111827", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Joyful Background Decor Elements using Absolute positioning + Subtle Pattern */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: backgroundPattern, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "15%", left: "5%", fontSize: "3rem", opacity: 0.1, pointerEvents: "none", transform: "rotate(-15deg)" }}>🌸</div>
      <div style={{ position: "absolute", top: "45%", right: "8%", fontSize: "4rem", opacity: 0.1, pointerEvents: "none", transform: "rotate(20deg)" }}>🎈</div>
      <div style={{ position: "absolute", top: "75%", left: "10%", fontSize: "3rem", opacity: 0.1, pointerEvents: "none", transform: "rotate(10deg)" }}>🎱</div>
      <div style={{ position: "absolute", top: "85%", right: "5%", fontSize: "3rem", opacity: 0.1, pointerEvents: "none", transform: "rotate(-20deg)" }}>✨</div>

      <style>{`
        .venue-nav {
          display: flex; gap: 2rem; align-items: center; justify-content: center;
          padding: 1rem; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 100; border-bottom: 2px dashed #f1f5f9;
        }
        .venue-nav a { color: #374151; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: color 0.2s; }
        .venue-nav a:hover { color: #6366f1; }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.05); }
          30% { transform: scale(1); }
          45% { transform: scale(1.05); }
          60% { transform: scale(1); }
        }
        .heartbeat-btn { animation: heartbeat 2s infinite; display: inline-block; transform-origin: center; }
        
        .mobile-nav-venue { display: none; margin: 0; padding: 0; }
        .venue-form-grid { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
        .venue-form-grid-3 { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr 1fr; }
        
        .facilities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }

        .section-padding { padding: 6rem 2rem; }
        .hero-padding { padding: 9rem 2rem; }
        .section-title { font-size: 2.5rem; }
        .hero-title { font-size: clamp(2rem, 8vw, 4rem); }

        .custom-input { width: 100%; padding: 0.8rem 1rem; background: rgba(255,255,255,0.8); border: 2px solid #e2e8f0; border-radius: 12px; color: #111827; font-size: 0.95rem; outline: none; transition: border-color 0.2s; backdrop-filter: blur(5px); }
        .custom-input:focus { border-color: #6366f1; background: #ffffff; }
        .custom-label { font-size: 0.8rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }

        .hover-card { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; border: 2px solid transparent; }
        .hover-card:hover { transform: translateY(-8px); border-color: #6366f1; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.15); }

        .checkbox-container { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.5rem; }
        .checkbox-label { display: flex; alignItems: center; gap: 0.5rem; background: rgba(255,255,255,0.8); padding: 0.6rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; color: #334155; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s; }
        .checkbox-label:hover { border-color: #6366f1; background: #f5f3ff; }

        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .section-padding { padding: 4rem 1.5rem; }
          .hero-padding { padding: 6rem 1.5rem; }
          .section-title { font-size: 2rem !important; }
          .venue-nav { display: none; }
          .facilities-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
          .mobile-nav-venue {
            display: flex; position: fixed; bottom: 0; left: 0; right: 0;
            background: rgba(255,255,255,0.98); backdrop-filter: blur(15px);
            border-top: 1px solid #e5e7eb; z-index: 99999;
            justify-content: space-around; padding-bottom: env(safe-area-inset-bottom);
            box-shadow: 0 -5px 20px rgba(0,0,0,0.08);
          }
          .mobile-nav-venue a {
            display: flex; flex-direction: column; align-items: center;
            font-size: 0.65rem; color: #6b7280; text-decoration: none; padding: 0.6rem 0; flex: 1; font-weight: 600;
          }
          .mobile-nav-venue a span { margin-top: 0.3rem; }
          .mobile-nav-venue a.highlight { color: #6366f1; }
          .venue-form-grid, .venue-form-grid-3 { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 480px) {
          .facilities-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* TOP NAV */}
      <nav className="venue-nav">
        <a href="#home">Home</a>
        <a href="#facilities">Facilities</a>
        <a href="#packages">Packages</a>
        <a href="#about">About Us</a>
        <a href="#map">Map</a>
        <a href="#inquiry" className="heartbeat-btn" style={{ background: "linear-gradient(135deg, #ffffff, #ffeb3b)", color: "#854d0e", padding: "0.5rem 1.5rem", borderRadius: "50px", boxShadow: "0 4px 15px rgba(251, 191, 36, 0.3)", fontWeight: 800 }}>Inquire Now</a>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="hero-padding" style={{ background: `url('${venue.hero_image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80'}') center/cover`, textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.65)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="hero-title" style={{ 
            fontWeight: 900, 
            lineHeight: 1.1, 
            marginBottom: "1.25rem", 
            background: "linear-gradient(to bottom, #ffffff, #ffd700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 10px 30px rgba(0,0,0,0.3)" 
          }}>
            {venue.name}
          </h1>
          <p style={{ fontSize: "1.5rem", color: "#fef3c7", marginBottom: "2.5rem", fontWeight: 600, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            {venue.tagline || "Your Ultimate Dream Experience"}
          </p>
          <a href="#inquiry" className="heartbeat-btn" style={{ background: "linear-gradient(135deg, #ffffff, #ffeb3b)", color: "#854d0e", padding: "1.2rem 3rem", borderRadius: "50px", fontWeight: 800, fontSize: "1.2rem", textDecoration: "none", boxShadow: "0 10px 25px rgba(251, 191, 36, 0.5)" }}>
            Book Your Date
          </a>
        </div>
      </section>

      {/* FACILITIES SECTION */}
      <section id="facilities" className="section-padding" style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", color: "#6366f1", marginBottom: "0.75rem", fontWeight: 700 }}>Discover</div>
          <h2 className="section-title" style={{ fontWeight: 800, color: "#0f172a", position: "relative", display: "inline-block" }}>
            Our Facilities
            <span style={{ position: "absolute", top: "-10px", right: "-30px", fontSize: "1.5rem", transform: "rotate(15deg)" }}>✨</span>
          </h2>
        </div>
        <div className="facilities-grid" style={{ textAlign: "center" }}>
          {venueFacilities?.map((fac: any) => (
            <div key={fac?.id || fac?.name || Math.random()} className="hover-card" onClick={() => { setActiveFacility(fac); }} style={{ background: "#ffffff", padding: "2.5rem 1.5rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{fac?.icon || "🏢"}</div>
              <div style={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}>{fac?.name || "Facility"}</div>
              <div style={{ color: "#6366f1", fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: 600 }}>Click to view details ➡️</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL FOR FACILITIES */}
      {activeFacility && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.8)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", backdropFilter: "blur(5px)" }} onClick={() => setActiveFacility(null)}>
          <div style={{ background: "#ffffff", borderRadius: "24px", overflow: "hidden", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveFacility(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.5)", color: "white", border: "none", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", zIndex: 10 }}>✖</button>
            
            {/* Display single photo */}
            <div style={{ height: "250px", position: "relative", background: "#f1f5f9" }}>
              <img src={activeFacility.photo?.url || "https://images.unsplash.com/photo-1543088925-5e608df9dff1?w=800&q=80"} alt={activeFacility.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {activeFacility.photo?.desc && (
                <div style={{ position: "absolute", bottom: "1rem", left: "1rem", background: "rgba(0,0,0,0.6)", color: "white", padding: "0.4rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}>
                  {activeFacility.photo.desc}
                </div>
              )}
            </div>

            <div style={{ padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{activeFacility?.icon} {activeFacility?.name}</h3>
                  <div style={{ color: "#64748b", fontWeight: 500, fontSize: "0.9rem", marginTop: "0.3rem" }}>📍 Size/Capacity: {activeFacility?.size || "Not specified"}</div>
                </div>
                <div style={{ background: "#ccfbf1", color: "#0f766e", padding: "0.5rem 1rem", borderRadius: "50px", fontWeight: 800, fontSize: "0.95rem" }}>
                  {activeFacility?.price || "Contact for Price"}
                </div>
              </div>

              <p style={{ color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>{activeFacility.description}</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", background: "#f8fafc", padding: "1.2rem", borderRadius: "16px", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.9rem" }}>⏰ Schedule</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}><strong>In:</strong> {activeFacility.timeIn}</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}><strong>Out:</strong> {activeFacility.timeOut}</div>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.8rem", fontSize: "0.95rem" }}>📋 Do's & Don'ts</div>
                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(activeFacility?.dosAndDonts || []).map((rule: string) => (
                    <li key={rule} style={{ fontSize: "0.85rem", color: "#475569", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ color: "#6366f1" }}>✅</span> {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PACKAGES SECTION */}
      <section id="packages" className="section-padding" style={{ background: "transparent", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", color: "#6366f1", marginBottom: "0.75rem", fontWeight: 700 }}>Offerings</div>
            <h2 className="section-title" style={{ fontWeight: 800, color: "#0f172a" }}>Event Packages</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {venuePackages.map((pkg: any, i: number) => (
              <div key={pkg.name} style={{ background: "#ffffff", border: i === 1 ? "2px solid #6366f1" : "2px dashed #e2e8f0", borderRadius: "24px", padding: "3rem 2.5rem", position: "relative", boxShadow: i === 1 ? "0 20px 40px -10px rgba(99, 102, 241, 0.1)" : "0 10px 30px -10px rgba(0,0,0,0)", transform: i === 1 ? "scale(1.02)" : "none" }}>
                {i === 1 && <div style={{ position: "absolute", top: "0", left: "50%", transform: "translate(-50%, -50%)", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "0.75rem", fontWeight: 800, padding: "0.5rem 1rem", borderRadius: "50px", letterSpacing: "1px", display: "flex", gap: "0.3rem", alignItems: "center", whiteSpace: "nowrap" }}>⭐ MOST CHOSEN</div>}
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>{pkg.name}</div>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: i === 1 ? "#0f172a" : "#475569", marginBottom: "0.5rem" }}>{pkg?.price}</div>
                <div style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "2rem", fontWeight: 500 }}>{pkg?.guests}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {(pkg?.includes || []).map((item: string) => (
                    <li key={item} style={{ fontSize: "0.95rem", color: "#334155", display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 600 }}>
                      <span style={{ color: "#6366f1", background: "#eef2ff", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem", fontWeight: "bold" }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="#inquiry" style={{ display: "block", textAlign: "center", background: i === 1 ? "linear-gradient(135deg, #ffffff, #ffeb3b)" : "#f1f5f9", color: i === 1 ? "#854d0e" : "#0f172a", padding: "1rem", borderRadius: "14px", fontWeight: 800, textDecoration: "none", transition: "background 0.2s" }}>
                  Select Package
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="section-padding" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", color: "#6366f1", marginBottom: "0.75rem", fontWeight: 700 }}>Our Story</div>
        <h2 className="section-title" style={{ fontWeight: 800, color: "#0f172a", marginBottom: "2rem" }}>About Us</h2>
        <p style={{ fontSize: "1.15rem", color: "#475569", lineHeight: 1.9, fontWeight: 500 }}>
          {venue.about_us || `Welcome to ${venue.name}! With over 15 years of exceptional service in the hospitality and events industry, we take pride in offering premium spaces for your most cherished moments.`}
        </p>

        {/* REVIEWS */}
        <div style={{ marginTop: "4rem", background: "#ffffff", padding: "2.5rem", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0", display: "inline-block" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <div style={{ fontSize: "2.5rem" }}>🏆</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 800 }}>Exceptional Service Experiences</div>
              <div style={{ color: "#f59e0b", fontSize: "1.2rem", fontWeight: 700, marginTop: "0.3rem" }}>
                ⭐⭐⭐⭐⭐ <span style={{ color: "#0f172a" }}>4.9/5 Rating</span>
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500, marginTop: "0.2rem" }}>(Based on 250+ verified delighted guests)</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section id="map" className="section-padding" style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(10px)", borderTop: "2px dashed #f1f5f9", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="section-title" style={{ fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>Find Us Here📍</h2>
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Conveniently located in the heart of the city.</p>
          </div>
          <div style={{ borderRadius: "24px", overflow: "hidden", height: "450px", background: "#e2e8f0", border: "1px solid #cbd5e1" }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.664875608674!2d121.050864!3d14.599512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c82b992fde0d%3A0x6b4fbfeab81585!2sOrtigas%20Center%2C%20Pasig%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map">
            </iframe>
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section id="inquiry" className="section-padding" style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", color: "#6366f1", marginBottom: "0.75rem", fontWeight: 700 }}>Get in Touch</div>
          <h2 className="section-title" style={{ fontWeight: 800, color: "#0f172a", position: "relative", display: "inline-block" }}>
            📝 Send an Inquiry
          </h2>
          <p style={{ color: "#64748b", marginTop: "1rem", fontSize: "1.1rem" }}>Fill out the form below and our dedicated team will get back to you within 24 hours.</p>
        </div>

        {isSubmitted ? (
          <div style={{ position: "relative", background: "#ffffff", border: "2px solid #14b8a6", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center", boxShadow: "0 20px 40px rgba(20, 184, 166, 0.15)", overflow: "hidden" }}>
            {/* CSS Confetti Overlay */}
            {[...Array(30)].map((_, i) => (
              <div key={i} className="confetti" style={{ 
                left: `${Math.random() * 100}%`, 
                animationDuration: `${Math.random() * 3 + 2}s`, 
                animationDelay: `${Math.random() * 2}s`, 
                background: ["#14b8a6", "#f59e0b", "#ec4899"][Math.floor(Math.random() * 3)]
              }} />
            ))}
            
            <div style={{ animation: "float-up 0.6s ease-out forwards" }}>
              <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎉</div>
              <h3 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>Thank You!</h3>
              <p style={{ fontSize: "1.1rem", color: "#475569", maxWidth: "400px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
                Your joyful inquiry has been successfully sent. Our team will reach out to you shortly to start planning your perfect day!
              </p>
              
              {/* DEMO DASHBOARD LINK */}
              <div style={{ marginBottom: "1.5rem" }}>
                <a href="/dashboard/inquiries" className="heartbeat-btn" style={{ 
                  display: "inline-block", background: "linear-gradient(135deg, #ffffff, #ffeb3b)", 
                  color: "#854d0e", padding: "1.2rem 2.5rem", borderRadius: "16px", fontWeight: 800, 
                  textDecoration: "none", boxShadow: "0 10px 25px rgba(251, 191, 36, 0.4)", fontSize: "1.1rem" 
                }}>
                  📊 Check Dashboard (Live Demo)
                </a>
              </div>

              <button onClick={() => setIsSubmitted(false)} style={{ background: "#f1f5f9", color: "#0f172a", padding: "1rem 2rem", borderRadius: "14px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                Send Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "2px solid #ffffff", borderRadius: "24px", padding: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}>
            <input type="hidden" name="company_slug" value={slug} />
          
          <div className="venue-form-grid">
            <div>
              <label className="custom-label">Full Name *</label>
              <input name="client_name" required type="text" placeholder="Your full name" className="custom-input" />
            </div>
            <div>
              <label className="custom-label">Email Address *</label>
              <input name="client_email" required type="email" placeholder="your@email.com" className="custom-input" />
            </div>
          </div>
          
          <div className="venue-form-grid">
            <div>
              <label className="custom-label">Phone Number</label>
              <input name="client_phone" type="tel" placeholder="+63 9XX XXX XXXX" className="custom-input" />
            </div>
            <div>
              <label className="custom-label">Event Type</label>
              <select name="event_type" className="custom-input" style={{ appearance: "none" }}>
                <option value="">Select event type</option>
                <option value="Wedding">Wedding</option>
                <option value="Debut">Debut / 18th Birthday</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="venue-form-grid-3">
            <div>
              <label className="custom-label">Event Date *</label>
              <input name="event_date" required type="date" className="custom-input" />
            </div>
            <div>
              <label className="custom-label">Event Time</label>
              <input name="event_time" type="time" className="custom-input" />
            </div>
            <div>
              <label className="custom-label">No. of Guests</label>
              <input name="guest_count" type="number" min="1" max="1000" placeholder="e.g. 150" className="custom-input" />
            </div>
          </div>

          <div>
            <label className="custom-label">Select Facilities Needed (Multiple options)</label>
            <div className="checkbox-container">
              {(venueFacilities || []).map((fac: any) => (
                <label key={fac?.id || fac?.name || Math.random()} className="checkbox-label">
                  <input type="checkbox" name="facilities[]" value={fac?.name} style={{ width: "16px", height: "16px", accentColor: "#6366f1" }} /> 
                  {fac?.icon} {fac?.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="custom-label">Message / Special Requests</label>
            <textarea name="message" rows={4} placeholder="Tell us about your theme, requests, or questions..." className="custom-input" style={{ resize: "vertical", fontFamily: "inherit" }} />
          </div>

          <button type="submit" disabled={isSubmitting} style={{ background: "linear-gradient(135deg, #ffffff, #ffeb3b)", color: "#854d0e", padding: "1.1rem 2rem", borderRadius: "14px", fontWeight: 800, fontSize: "1.1rem", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: "1rem", boxShadow: "0 4px 15px rgba(251, 191, 36, 0.3)", opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? "Sending..." : "📨 Submit Joyful Inquiry"}
          </button>
        </form>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: "1rem" }}>{venue.name}</div>
          <div style={{ color: "#94a3b8", fontSize: "0.95rem", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
            <span>📍 {venue.address || "123 Event Street, Metropolis"}</span>
            <span>📞 {venue.contact_phone || "+63 900 123 4567"}</span>
            <span>✉️ {venue.contact_email || "hello@venue.com"}</span>
          </div>
          <div style={{ color: "#475569", fontSize: "0.85rem", borderTop: "1px solid #1e293b", paddingTop: "2rem" }}>
            Powered by <span style={{ color: "#6366f1", fontWeight: "bold" }}>GoDigitalWithMe</span>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav-venue">
        <a href="#home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>Home</span>
        </a>
        <a href="#facilities">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>Facilities</span>
        </a>
        <a href="#packages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="4" y="4" width="16" height="4"></rect><line x1="4" y1="12" x2="20" y2="12"></line><line x1="12" y1="12" x2="12" y2="20"></line></svg>
          <span>Packages</span>
        </a>
        <a href="#map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>Map</span>
        </a>
        <a href="#inquiry" className="highlight heartbeat-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Inquire</span>
        </a>
      </nav>
    </div>
  );
}
