"use client";

import { useState } from "react";

export default function AddAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async () => {
    setStatus("🔄 Creating admin...");

    try {
      const res = await fetch("/api/admin/createAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      setStatus("✅ Admin created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("Error:", err);
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="h-auto rounded-xl bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] flex items-center justify-center p-15 font-poppins">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-[#2e2e2e]">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-[#ff9a76]">
          Add New Admin
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-[#4a90e2] rounded-full px-5 py-3 text-sm text-[#4a90e2] font-semibold bg-white shadow-md focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-[#4a90e2] rounded-full px-5 py-3 text-sm text-[#4a90e2] font-semibold bg-white shadow-md focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-[#4a90e2] rounded-full px-5 py-3 text-sm text-[#4a90e2] font-semibold bg-white shadow-md focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name || !email || !password}
          className="mt-6 w-full bg-[#ff9a76] hover:bg-[#ff8562] text-white font-semibold py-3 rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Admin
        </button>

        {status && (
          <p className="mt-4 text-center font-medium text-sm text-[#4a90e2]">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
