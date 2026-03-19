"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="off"
          placeholder="admin@yourvenue.com"
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            background: "#0a0a0f",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa", marginBottom: "0.5rem" }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="off"
          placeholder="••••••••"
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            background: "#0a0a0f",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {errorMessage && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          fontSize: "0.83rem",
          color: "#f87171",
        }}>
          ⚠️ {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: "100%",
          padding: "0.85rem",
          background: isPending ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: isPending ? "not-allowed" : "pointer",
          marginTop: "0.5rem",
          transition: "opacity 0.2s",
        }}
      >
        {isPending ? "Signing In..." : "Sign In →"}
      </button>
    </form>
  );
}
