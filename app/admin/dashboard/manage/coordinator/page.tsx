"use client";

import { useState } from "react";

export default function AddCoordinator() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const [removeEmail, setRemoveEmail] = useState("");
  const [removeStatus, setRemoveStatus] = useState<string | null>(null);

  const handleSubmit = async () => {
    setStatus("🔄 Creating Coordinator...");

    try {
      const res = await fetch("/api/admin/createCoordinator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to create coordinator");

      setStatus("Coordinator created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("Error:", err);
      setStatus(`${err.message}`);
    }
  };

  const handleRemove = async () => {
    setRemoveStatus("🔄 Removing Coordinator...");

    try {
      const res = await fetch("/api/admin/removeCoordinator", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: removeEmail }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to remove coordinator");

      setRemoveStatus("Coordinator removed successfully!");
      setRemoveEmail("");
    } catch (err: any) {
      console.error("Error:", err);
      setRemoveStatus(`${err.message}`);
    }
  };

  return (
    <div className="rounded-xl h-auto bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] flex flex-col items-center font-poppins p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-[#2e2e2e] mb-10 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-[#ff9a76]">
          Add New Coordinator
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
          Create Coordinator
        </button>

        {status && (
          <p className="mt-4 text-center font-medium text-sm text-[#4a90e2]">
            {status}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-[#2e2e2e]">
        <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#ff9a76] to-[#4a90e2]">
          Remove Coordinator
        </h2>

        <input
          type="email"
          placeholder="Coordinator Email to Remove"
          value={removeEmail}
          onChange={(e) => setRemoveEmail(e.target.value)}
          className="w-full border-2 border-[#ff9a76] rounded-full px-5 py-3 text-sm text-[#ff9a76] font-semibold bg-white shadow-md focus:outline-none mb-4"
        />

        <button
          onClick={handleRemove}
          disabled={!removeEmail}
          className="w-full bg-[#ff4d4d] hover:bg-[#e64040] text-white font-semibold py-3 rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Remove Coordinator
        </button>

        {removeStatus && (
          <p className="mt-4 text-center font-medium text-sm text-[#e64040]">
            {removeStatus}
          </p>
        )}
      </div>
    </div>
  );
}
