"use client";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      padding: "4rem 2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      background: "rgba(255,255,255,0.02)",
      borderRadius: "20px",
      border: "1px dashed rgba(255,255,255,0.1)",
      margin: "1rem 0"
    }}>
      <div style={{
        fontSize: "3rem",
        marginBottom: "1.5rem",
        filter: "drop-shadow(0 0 10px rgba(167, 139, 250, 0.3))"
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ color: "#6b7280", maxWidth: "300px", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "2rem" }}>
        {description}
      </p>
      {action && (
        <button 
          onClick={action.onClick}
          className="btn btn--primary"
          style={{ padding: "0.75rem 1.5rem" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
