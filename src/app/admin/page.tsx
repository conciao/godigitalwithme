export const runtime = 'edge';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboardContent from "@/components/AdminDashboardContent";

export default async function AdminDashboard() {
  const session = await auth();

  // Strict server-side role check
  if (!session || session.user.role !== "super_admin") {
    redirect("/login?error=Unauthorized&callbackUrl=/admin");
  }

  return <AdminDashboardContent />;
}
