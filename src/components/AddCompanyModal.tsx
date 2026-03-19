"use client";

import { useState } from "react";

interface AddCompanyModalProps {
  onClose: () => void;
  onSuccess: (name: string) => void;
}

export default function AddCompanyModal({ onClose, onSuccess }: AddCompanyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    contact_email: "",
    plan: "basic",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json() as { error: string };
        throw new Error(errData.error || "Failed to create company");
      }

      onSuccess(formData.name);
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
          Add New Venue
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Onboard a new company to the GoDigitalWithMe platform.
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
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>Company Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. The Grand Venue"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>Subdomain Slug</label>
            <input 
              required
              type="text" 
              placeholder="e.g. grand-venue (no spaces)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>Login Email</label>
            <input 
              required
              type="email" 
              placeholder="admin@venue.com"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>Subscription Plan</label>
            <select 
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0f", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", color: "#9ca3af" }}
            >
              <option value="basic">Basic (Free Trial)</option>
              <option value="pro">Pro (Monthly Subscription)</option>
              <option value="enterprise">Enterprise (Custom)</option>
            </select>
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
                flex: 1, padding: "0.85rem", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", 
                border: "none", borderRadius: "10px", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Creating..." : "Create Venue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
