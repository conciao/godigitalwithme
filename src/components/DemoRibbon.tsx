"use client";

import { usePathname } from "next/navigation";

export default function DemoRibbon() {
  const pathname = usePathname();
  
  // Only show the demo ribbon on the demo website and dashboard.
  // Hide it on the main platform landing page, login, or admin panels.
  if (!pathname.startsWith("/venue") && !pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div style={{
      background: "linear-gradient(to right, #fbbf24, #f59e0b)",
      color: "#451a03",
      textAlign: "center",
      padding: "0.5rem 1rem",
      fontSize: "0.85rem",
      fontWeight: "700",
      position: "sticky",
      top: 0,
      zIndex: 10000000,
      width: "100%",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem"
    }}>
      <span>🚧</span>
      <span>This is a <strong>Demo Website</strong> — Subscribe to launch your real site.</span>
      <a href="/pricing" style={{ 
        marginLeft: "0.5rem", 
        color: "#451a03", 
        textDecoration: "underline",
        fontSize: "0.75rem"
      }}>View Plans</a>
    </div>
  );
}
