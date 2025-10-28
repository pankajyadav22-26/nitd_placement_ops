"use client";

import { useState } from "react";

export default function AddOfferForm() {
  const initialForm = {
    roll_nos: "",
    company_name: "",
    type: "intern",
    ctc: "",
    stipend: "",
    non_blocking: false,
    is_ppo: false,
  };

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus("🔄 Adding offers...");

    try {
      const rollNumbers = form.roll_nos
        .split(/[\n,]+/)
        .map((r) => r.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        roll_nos: rollNumbers,
        company_name: form.company_name,
        type: form.type,
        ctc: Number(form.ctc) || 0,
        stipend: Number(form.stipend) || 0,
        non_blocking: form.non_blocking,
        is_ppo: form.is_ppo,
      };

      const res = await fetch("/api/admin/manageOffer2027/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setStatus(`Offers added to ${data.successCount} students`);
      setForm(initialForm);
    } catch (err: any) {
      setStatus(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl h-auto bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] flex items-center justify-center p-15 font-poppins">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-black">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-[#ff9a76]">
          Add Offers to Multiple Students
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Roll Numbers (comma or newline separated)
            </label>
            <textarea
              rows={4}
              value={form.roll_nos}
              onChange={(e) => handleChange("roll_nos", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2] resize-none"
              placeholder="Enter Roll Numbers"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-sm text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                placeholder="e.g. Google"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm text-gray-700">
                Offer Type
              </label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
              >
                <option value="intern">Intern</option>
                <option value="intern+ppo">Intern + PPO</option>
                <option value="intern+fte">Intern + FTE</option>
                <option value="fte">FTE</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm text-gray-700">
                CTC (in LPA)
              </label>
              <input
                type="number"
                value={form.ctc}
                onChange={(e) => handleChange("ctc", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                placeholder="e.g. 12"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm text-gray-700">
                Stipend (per month)
              </label>
              <input
                type="number"
                value={form.stipend}
                onChange={(e) => handleChange("stipend", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                placeholder="e.g. 50000"
              />
            </div>
          </div>


          <div className="flex items-center gap-53">
            <label className="flex items-center text-sm gap-2">
              <input
                type="checkbox"
                checked={form.non_blocking}
                onChange={(e) => handleChange("non_blocking", e.target.checked)}
                className="accent-[#4a90e2]"
              />
              Non-blocking
            </label>
            <label className="flex items-center text-sm gap-2">
              <input
                type="checkbox"
                checked={form.is_ppo}
                onChange={(e) => handleChange("is_ppo", e.target.checked)}
                className="accent-[#4a90e2]"
              />
              PPO
            </label>
          </div>

          <div className="text-center mt-4">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-[#4a90e2] hover:bg-[#3a7ed9] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Offers"}
            </button>
          </div>

          {status && (
            <p className="mt-4 text-center text-sm font-medium text-[#4a90e2]">
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}