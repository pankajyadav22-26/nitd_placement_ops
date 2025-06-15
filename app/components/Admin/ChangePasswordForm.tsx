"use client";

import { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ChangePasswordForm({ email }: { email: string }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#2e2e2e] p-8 rounded-xl shadow-2xl max-w-lg mx-auto space-y-4">
      <h3 className="text-xl font-bold mb-2 text-[#4a90e2] text-center">Change Password</h3>

      <div className="space-y-3">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/50 rounded-md px-4 py-2 outline-none transition"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/50 rounded-md px-4 py-2 outline-none transition"
        />
      </div>

      <button
        onClick={handleChangePassword}
        disabled={loading}
        className="mt-2 bg-[#ff9a76] hover:bg-[#ff7f5a] transition text-white font-semibold px-4 py-2 rounded-md w-full flex items-center justify-center"
      >
        {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
        {loading ? "Updating..." : "Update Password"}
      </button>

      {message && (
        <div
          className={`mt-4 text-sm text-center font-medium flex items-center justify-center gap-2 ${
            message.toLowerCase().includes("success")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message.toLowerCase().includes("success") ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {message}
        </div>
      )}
    </div>
  );
}