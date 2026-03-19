import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #1e1b4b 50%, #0a0a0f 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-geist-sans, system-ui)",
      padding: "1rem",
    }}>
      {/* Background orb */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(19,19,26,0.9)",
        border: "1px solid rgba(124,58,237,0.25)",
        borderRadius: "24px",
        padding: "3rem",
        width: "100%",
        maxWidth: "420px",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏛️</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
            Go<span style={{ color: "#a78bfa" }}>Digital</span>WithMe
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.4rem" }}>
            Sign in to your dashboard
          </p>
        </div>

        {/* Modular LoginForm (Client Component) */}
        <LoginForm />

        {/* Demo credentials hint — only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "rgba(124,58,237,0.08)",
            borderRadius: "10px",
            border: "1px solid rgba(124,58,237,0.15)",
          }}>
            <div style={{ fontSize: "0.75rem", color: "#a78bfa", fontWeight: 600, marginBottom: "0.5rem" }}>🔑 Dev Credentials</div>
            <div style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.7 }}>
              <strong style={{ color: "#d1d5db" }}>Super Admin:</strong> admin@godigitalwithme.com<br />
              <strong style={{ color: "#d1d5db" }}>Venue Admin:</strong> admin@grand-venue.com
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
