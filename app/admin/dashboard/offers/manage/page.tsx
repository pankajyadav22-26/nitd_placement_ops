"use client";

import { useState } from "react";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function ManageOffers() {
  const [rollNo, setRollNo] = useState("");
  const [offersData, setOffersData] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOffers = async () => {
    setStatus("🔄 Fetching offers...");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/manageOffer/get/${rollNo}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOffersData(data.data);
      setStatus("Offers loaded");
    } catch (err: any) {
      setStatus(`${err.message}`);
      setOffersData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId: string) => {
    setStatus("🔄 Deleting...");
    const res = await fetch(
      `/api/admin/manageOffer/delete/${rollNo}/${offerId}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    if (res.ok) {
      setOffersData(data.data);
      setStatus("Offer deleted");
    } else {
      setStatus(`${data.error}`);
    }
  };

  const handleSave = async (offerId: string, updated: any) => {
    setStatus("🔄 Saving...");
    const res = await fetch(
      `/api/admin/manageOffer/edit/${rollNo}/${offerId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setOffersData(data.data);
      setStatus("Offer updated");
    } else {
      setStatus(`${data.error}`);
    }
  };

  return (
    <div className="rounded-xl h-auto bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] p-25 flex flex-col items-center justify-center font-poppins">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-[#ff9a76]">
          Manage Student Offers
        </h2>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="flex-1 border-2 border-[#4a90e2] rounded-full px-5 py-3 text-sm text-[#4a90e2] font-semibold bg-white shadow-md focus:outline-none"
          />
          <button
            onClick={fetchOffers}
            disabled={!rollNo}
            className="bg-[#ff9a76] hover:bg-[#ff8562] text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
          >
            Search
          </button>
        </div>

        {status && (
          <p className="text-center text-sm text-[#4a90e2] font-medium mb-4">
            {status}
          </p>
        )}

        {loading ? (
          <p className="text-center text-lg font-semibold text-[#4a90e2]">
            🔄 Loading offers...
          </p>
        ) : offersData?.offers?.length > 0 ? (
          <div className="space-y-4">
            {offersData.offers.map((offer: any) => (
              <EditableOfferCard
                key={offer._id}
                offer={offer}
                onDelete={() => handleDelete(offer._id)}
                onSave={(updated) => handleSave(offer._id, updated)}
              />
            ))}
          </div>
        ) : offersData ? (
          <p className="text-center text-sm text-gray-500">
            No offers found for this roll number.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function EditableOfferCard({
  offer,
  onDelete,
  onSave,
}: {
  offer: any;
  onDelete: () => void;
  onSave: (updated: any) => void;
}) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...offer });

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="bg-gradient-to-r from-[#e0f0ff] to-[#ffe9e2] border border-[#4a90e2] rounded-xl p-4 shadow-xl transition duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-[#4a90e2]">
          {offer.company_name}
        </h3>
        <p className="text-xs text-gray-500">
          {new Date(offer.offer_date).toLocaleDateString()}
        </p>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3 text-black">
        <input
          disabled={!edit}
          value={form.company_name}
          onChange={(e) => handleChange("company_name", e.target.value)}
          className="rounded px-4 py-2 text-sm border border-[#4a90e2] bg-white"
        />
        <select
          disabled={!edit}
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="rounded px-4 py-2 text-sm border border-[#4a90e2] bg-white"
        >
          <option value="intern">intern</option>
          <option value="intern+ppo">intern+ppo</option>
          <option value="intern+fte">intern+fte</option>
          <option value="fte">fte</option>
        </select>
        <input
          disabled={!edit}
          type="number"
          value={form.ctc}
          onChange={(e) => handleChange("ctc", +e.target.value)}
          className="rounded px-4 py-2 text-sm border border-[#4a90e2] bg-white"
          placeholder="CTC"
        />
        <input
          disabled={!edit}
          type="number"
          value={form.stipend}
          onChange={(e) => handleChange("stipend", +e.target.value)}
          className="rounded px-4 py-2 text-sm border border-[#4a90e2] bg-white"
          placeholder="Stipend"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            disabled={!edit}
            type="checkbox"
            checked={form.non_blocking}
            onChange={(e) => handleChange("non_blocking", e.target.checked)}
          />
          Non-blocking
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            disabled={!edit}
            type="checkbox"
            checked={form.is_ppo}
            onChange={(e) => handleChange("is_ppo", e.target.checked)}
          />
          PPO
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
          >
            <FaEdit /> Edit
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                onSave(form);
                setEdit(false);
              }}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={() => {
                setForm({ ...offer });
                setEdit(false);
              }}
              className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
            >
              <FaTimes /> Cancel
            </button>
          </>
        )}
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}
