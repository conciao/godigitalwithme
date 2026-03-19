"use client";

import { useEffect, useState } from "react";
import { Company } from "@/types/database";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<Company>>({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    logo_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadSettings = async () => {
    setLoadError("");
    setLoading(true);
    try {
      const res = await fetch("/api/venue/settings");
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setSettings(data as Partial<Company>);
    } catch (err: any) {
      console.error("Settings Load Error:", err);
      setLoadError("Failed to load your venue settings. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/venue/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage("✅ Settings updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update settings.");
      }
    } catch (err) {
      setMessage("❌ Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#6b7280" }}>Loading settings...</div>;

  if (loadError) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
      <p style={{ color: "#f87171", marginBottom: "1.5rem" }}>{loadError}</p>
      <button onClick={loadSettings} className="btn btn--primary">Retry</button>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar__title">Venue Settings</div>
          <div className="topbar__sub">Manage your venue profile, contact details, and branding</div>
        </div>
        {message && (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid #10b981", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.9rem" }}>
            {message}
          </div>
        )}
      </div>

      <div className="stat-card" style={{ padding: "2rem", maxWidth: "800px" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Venue Name</label>
              <input 
                type="text" 
                value={settings.name || ""} 
                onChange={e => setSettings({...settings, name: e.target.value})}
                className="modal__input"
                required
              />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Logo URL</label>
              <input 
                type="text" 
                value={settings.logo_url || ""} 
                onChange={e => setSettings({...settings, logo_url: e.target.value})}
                className="modal__input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Venue Description</label>
            <textarea 
              value={settings.description || ""} 
              onChange={e => setSettings({...settings, description: e.target.value})}
              className="modal__input"
              rows={4}
              style={{ resize: "none", padding: "0.75rem" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Contact Email</label>
              <input 
                type="email" 
                value={settings.contact_email || ""} 
                onChange={e => setSettings({...settings, contact_email: e.target.value})}
                className="modal__input"
              />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Contact Phone</label>
              <input 
                type="text" 
                value={settings.contact_phone || ""} 
                onChange={e => setSettings({...settings, contact_phone: e.target.value})}
                className="modal__input"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Physical Address</label>
            <input 
              type="text" 
              value={settings.address || ""} 
              onChange={e => setSettings({...settings, address: e.target.value})}
              className="modal__input"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button 
              type="submit" 
              className="btn btn--primary" 
              disabled={saving}
              style={{ padding: "0.75rem 2rem" }}
            >
              {saving ? "Saving Changes..." : "Save Venue Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
