import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth-config";
import StatsPage from "@/app/statistics/page"

export const metadata = {
  title: "Statistics",
};

export default async function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/");
  }
  return <StatsPage />
}
