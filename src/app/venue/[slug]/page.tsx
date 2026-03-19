import { supabase } from "@/lib/supabase";
import { Company } from "@/types/database";
import VenueClient from "./VenueClient";

interface VenuePageProps {
  params: Promise<{ slug: string }>;
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params;

  // 1. Fetch live venue data from Supabase
  const { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !venue) {
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
}
