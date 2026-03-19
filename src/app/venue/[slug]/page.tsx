import { supabase } from "@/lib/supabase";
import { Company } from "@/types/database";
import VenueClient from "./VenueClient";

interface VenuePageProps {
  params: Promise<{ slug: string }>;
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params;

  try {
    // 1. Fetch live venue data from Supabase
    const { data: venue, error } = await supabase
      .from("venues")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      throw new Error(error.message);
    }

    if (!venue) {
      console.warn("⚠️ Venue not found for slug:", slug);
      return (
        <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#0f172a" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "3rem" }}>404</h1>
            <p style={{ color: "#64748b" }}>Venue not found.</p>
            <a href="/" style={{ color: "#14b8a6", marginTop: "1rem", display: "inline-block" }}>Return Home</a>
          </div>
        </div>
      );
    }

    // Delegate strictly to client component for rich features
    return <VenueClient venue={venue as Company} slug={slug} />;
  } catch (err: any) {
    console.error("🚨 Server Component Crash:", err.message);
    return (
      <div style={{ padding: "2rem", textAlign: "center", background: "#fff5f5", minHeight: "100vh" }}>
        <h2 style={{ color: "#c53030" }}>Database Connection Error</h2>
        <p style={{ color: "#742a2a" }}>Please check your Supabase credentials in the Vercel Dashboard.</p>
        <code style={{ display: "block", background: "#fef2f2", padding: "1rem", marginTop: "1rem", borderRadius: "8px" }}>
          {err.message}
        </code>
      </div>
    );
  }
}
