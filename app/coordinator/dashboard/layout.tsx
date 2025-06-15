import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth-config";
import CoordinatorSidebar from "@/app/components/Coordinator/Sidebar";

export default async function CoordinatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "coordinator") {
    redirect("/coordinator/signin");
  }

  return (
    <div className="h-screen flex">
      <aside className="w-64 bg-gray-900 text-white overflow-y-auto">
        <CoordinatorSidebar />
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}