import { authConfig } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin",
}

export default async function AdminDashboardHome() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    redirect("/admin/signin");
  }

  return (
    <main className="rounded-xl h-auto bg-slate-50 dark:bg-slate-900 p-15 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Welcome, {session.user.name || "Coordinator"}!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          This is your dashboard. Use the sidebar to navigate between sections and manage student data, student profiles, add Coordinators, Offers.
        </p>
      </div>
    </main>
  );
}