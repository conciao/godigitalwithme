export async function GET() {
  return Response.json({ 
    status: "ok", 
    message: "If you see this, Vercel is running the NEW code!",
    time: new Date().toISOString(),
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
    auth_secret: process.env.AUTH_SECRET ? "SET" : "MISSING"
  });
}
