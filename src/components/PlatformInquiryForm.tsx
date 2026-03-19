"use client";

import { useState, useEffect } from "react";

interface PlatformInquiryFormProps {
  selectedPlan?: string;
}

export default function PlatformInquiryForm({ selectedPlan }: PlatformInquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    owner_name: "",
    contact_number: "",
    email: "",
    location: "",
    plan: selectedPlan || "basic"
  });

  // Sync internal state if prop changes
  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use relative URL to avoid CORS and environment-specific URL issues
      const res = await fetch(`/api/platform-inquiries`, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        let errorMessage = "Failed to submit inquiry";
        try {
          const errorData = (await res.json()) as { error?: string };
          errorMessage = errorData.error || `Error: ${res.status}`;
        } catch (e) {
          errorMessage = `Server error (${res.status})`;
        }
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log("✅ Success:", result);
      
      setSuccess(true);
      setFormData({
        company_name: "",
        owner_name: "",
        contact_number: "",
        email: "",
        location: "",
        plan: "basic"
      });
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to fetch from server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "3rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "20px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#fff" }}>Inquiry Sent!</h3>
        <p style={{ color: "#9ca3af" }}>We'll reach out to you within 24 hours to help you get started with your dream website.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="btn btn--primary" 
          style={{ marginTop: "1.5rem" }}
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .form-grid-2 { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .form-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
      <form onSubmit={handleSubmit} className="animate-fade-in" style={{ display: "grid", gap: "1.5rem", background: "#13131a", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(124,58,237,0.2)", position: "relative" }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", color: "#fff" }}>Get Started Today</h3>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1rem" }}>Professional venue management starts here.</p>

        {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", padding: "0.8rem", borderRadius: "10px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          ⚠️ {error}
        </div>
      )}

      <div className="form-grid-2">
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem", textTransform: "uppercase" }}>Company Name</label>
          <input 
            required
            type="text" 
            placeholder="e.g. Blue Lagoon Palace"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem", textTransform: "uppercase" }}>Owner's Full Name</label>
          <input 
            required
            type="text" 
            placeholder="John Doe"
            value={formData.owner_name}
            onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
            style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
          />
        </div>
      </div>

      <div className="form-grid-2">
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem", textTransform: "uppercase" }}>Email Address</label>
          <input 
            required
            type="email" 
            placeholder="john@venue.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem", textTransform: "uppercase" }}>Contact Number</label>
          <input 
            required
            type="tel" 
            placeholder="+63 9xx xxx xxxx"
            value={formData.contact_number}
            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
            style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem", textTransform: "uppercase" }}>Business Location</label>
        <input 
          required
          type="text" 
          placeholder="Street, City, Zip Code"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem", textTransform: "uppercase" }}>Choose Plan</label>
        <select 
          value={formData.plan}
          onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
          style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#9ca3af" }}
        >
          <option value="basic">Basic Package</option>
          <option value="standard">Standard Package</option>
          <option value="premium">Premium Package</option>
        </select>
      </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn--primary"
          style={{ width: "100%", padding: "1rem", margin: "1rem 0 0", fontSize: "1rem" }}
        >
          {loading ? "Processing..." : "Submit Inquiry"}
        </button>
      </form>
    </>
  );
}
