import { authConfig } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/app/components/Coordinator/ChangePasswordForm";

export default async function CoordinatorProfilePage() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "coordinator") {
    redirect("/");
  }

  const { name, email, role } = session.user;

  return (
    <div className="p-15 mx-auto rounded-2xl shadow-2xl bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] text-white transition-all duration-500 space-y-10">
      <h2 className="text-4xl font-bold font-poppins text-white drop-shadow-md text-center">
        Admin Profile
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <ProfileField label="Name" value={name || "N/A"} />
        <ProfileField label="Email" value={email ?? ""} />
        <ProfileField label="Role" value={role} />
      </div>

      <ChangePasswordForm email={email ?? ""} />
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-lg font-semibold text-white">{label}:</label>
      <p className="bg-white text-[#2e2e2e] font-semibold py-3 px-4 rounded-lg shadow-md">
        {value}
      </p>
    </div>
  );
}