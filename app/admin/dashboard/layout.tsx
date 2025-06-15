import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth-config";
import AdminSidebar from "@/app/components/Admin/Sidebar";

export const metadata = {
  title: "Admin",
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    redirect("/admin/signin");
  }

  return (
    <div className="h-screen flex">
      <aside className="w-64 bg-gray-900 text-white">
        <AdminSidebar />
      </aside>
      <main className="min-h-screen flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
    </div>
  );
}
