import { authConfig } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInForm from "@/app/components/SignInForm";

export const metadata = {
  title: "SignIn",
}

export default async function CoordinatorSignInPage() {
  const session = await getServerSession(authConfig);

  if (session?.user?.role === "coordinator") {
    redirect("/coordinator/dashboard");
  } else if (session?.user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  return <SignInForm role="coordinator-login" />;
}