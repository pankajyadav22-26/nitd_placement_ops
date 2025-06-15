"use client";

import { useState } from "react";
import Select from "react-select";

export default function UploadEligibleBtech() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"intern" | "fte">("intern");
  const [ctc, setCtc] = useState<number | "">("");
  const [branchesInput, setBranchesInput] = useState<{ label: string; value: string }[]>([]);
  const [gendersInput, setGendersInput] = useState<{ label: string; value: string }[]>([]);
  const [minCGPA, setMinCGPA] = useState<number | "">("");
  const [allowBacklog, setAllowBacklog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const BRANCH_OPTIONS = [
    { value: "ALL", label: "All Branches" },
    { value: "CSE", label: "CSE" },
    { value: "ECE", label: "ECE" },
    { value: "EE", label: "EE" },
    { value: "ME", label: "ME" },
    { value: "CE", label: "CE" },
  ];

  const GENDER_OPTIONS = [
    { value: "ALL", label: "All Genders" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const resetForm = () => {
    setFile(null);
    setType("intern");
    setCtc("");
    setBranchesInput([]);
    setGendersInput([]);
    setMinCGPA("");
    setAllowBacklog(true);
  };

  const handleSubmit = async () => {
    if (!file) {
      setStatus("Please upload a file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setStatus("File is too large (max 2MB)");
      return;
    }

    if (type === "fte" && (ctc === "" || ctc <= 0)) {
      setStatus("Please enter a valid CTC");
      return;
    }

    if (minCGPA === "" || minCGPA < 0) {
      setStatus("Please enter a valid minimum CGPA");
      return;
    }

    const selectedBranches = branchesInput.some((b) => b.value === "ALL")
      ? BRANCH_OPTIONS.filter((b) => b.value !== "ALL").map((b) => b.value)
      : branchesInput.map((b) => b.value);

    const selectedGenders = gendersInput.some((g) => g.value === "ALL")
      ? GENDER_OPTIONS.filter((g) => g.value !== "ALL").map((g) => g.value)
      : gendersInput.map((g) => g.value);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("ctc", (ctc || 0).toString());
    formData.append("branches", JSON.stringify(selectedBranches));
    formData.append("minCGPA", minCGPA.toString());
    formData.append("genders", JSON.stringify(selectedGenders));
    formData.append("allowBacklog", allowBacklog.toString());

    setLoading(true);
    setStatus("🔄 Processing...");

    try {
      const res = await fetch("/api/coordinator/btech/defaultFormat/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to process");
        } catch {
          const errorText = await res.text();
          throw new Error(errorText || "Unknown server error");
        }
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "eligible_students.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus("File downloaded successfully");
      resetForm();
    } catch (err: any) {
      setStatus(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] flex items-center justify-center rounded-xl p-15">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-black font-sans">
        <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
          Upload Interested Students (B.Tech)
        </h2>

        <div className="space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as "intern" | "fte")}
            className="block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="intern">Intern</option>
            <option value="fte">FTE</option>
          </select>

          {type === "fte" && (
            <input
              type="number"
              placeholder="CTC (LPA)"
              value={ctc}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 || e.target.value === "")
                  setCtc(e.target.value === "" ? "" : val);
              }}
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          )}

          <input
            type="number"
            placeholder="Minimum CGPA"
            value={minCGPA}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 0 || e.target.value === "")
                setMinCGPA(e.target.value === "" ? "" : val);
            }}
            className="block w-full border border-gray-300 rounded-md p-2"
          />

          <div>
            <label className="block mb-1 font-medium">Allowed Branches</label>
            <Select
              isMulti
              options={BRANCH_OPTIONS}
              value={branchesInput}
              onChange={(selected) => {
                const values = selected as { label: string; value: string }[];
                const isAllSelected = values.some((v) => v.value === "ALL");
                const wasAllSelected = branchesInput.some((v) => v.value === "ALL");

                if (isAllSelected && !wasAllSelected) {
                  setBranchesInput([{ label: "All Branches", value: "ALL" }]);
                } else if (!isAllSelected && wasAllSelected) {
                  setBranchesInput([]);
                } else {
                  setBranchesInput(values.filter((v) => v.value !== "ALL"));
                }
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Allowed Genders</label>
            <Select
              isMulti
              options={GENDER_OPTIONS}
              value={gendersInput}
              onChange={(selected) => {
                const values = selected as { label: string; value: string }[];
                const isAllSelected = values.some((v) => v.value === "ALL");
                const wasAllSelected = gendersInput.some((v) => v.value === "ALL");

                if (isAllSelected && !wasAllSelected) {
                  setGendersInput([{ label: "All Genders", value: "ALL" }]);
                } else if (!isAllSelected && wasAllSelected) {
                  setGendersInput([]);
                } else {
                  setGendersInput(values.filter((v) => v.value !== "ALL"));
                }
              }}
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allowBacklog}
              onChange={(e) => setAllowBacklog(e.target.checked)}
            />
            <span>Allow students with backlogs</span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md shadow"
          >
            {loading ? "Processing..." : "Submit and Get Eligible List"}
          </button>
        </div>

        {status && (
          <p className="text-center mt-4 text-sm font-medium text-indigo-600">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}