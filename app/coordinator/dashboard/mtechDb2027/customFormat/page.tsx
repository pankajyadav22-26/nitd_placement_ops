"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import Select from "react-select";

const dbFields = [
  { label: "Full Name", value: "full_name" },
  { label: "College Email", value: "college_email" },
  { label: "Personal Email", value: "personal_email" },
  { label: "Gender", value: "gender" },
  { label: "M.Tech Branch", value: "mtech_branch" },
  { label: "B.Tech Branch", value: "btech_branch" },
  { label: "B.Tech Passing Year", value: "btech_passing_year" },
  { label: "B.Tech Institution", value: "btech_institution" },
  { label: "M.Tech CGPA", value: "cgpa" },
  { label: "B.Tech CGPA", value: "btech_cgpa" },
  { label: "Date of Birth", value: "dob" },
  { label: "Phone Number", value: "phone" },
  { label: "Any Work Experience", value: "workExperience" },
  { label: "Nationality", value: "nationality" },
  { label: "Address", value: "address" },
  { label: "10th Passing Year", value: "class10_passing_year" },
  { label: "10th Score", value: "class10_score" },
  { label: "10th Board", value: "class10_board" },
  { label: "12th Passing Year", value: "class12_passing_year" },
  { label: "12th Score", value: "class12_score" },
  { label: "12th Board", value: "class12_board" },
  { label: "Any Backlog", value: "isAnyBacklog" },
  { label: "Academic Gaps", value: "academic_gaps" },
];

const BRANCH_OPTIONS = [
  { value: "ALL", label: "All Branches" },
  { value: "CSE", label: "CSE" },
  { value: "CSE(Analytics)", label: "CSE(A)" },
  { value: "ECE", label: "ECE" },
  { value: "ECE (VLSI)", label: "VLSI" },
  { value: "EE(PED)", label: "PED" },
  { value: "EE(PES)", label: "PES" },
  { value: "CAD/CAM", label: "CAD/CAM" },
  { value: "Civil and Infrastructure Engineering", label: "CIE" },
  { value: "Mathematics and Computing", label: "MAC" },
];

const GENDER_OPTIONS = [
  { value: "ALL", label: "All Genders" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMap, setFieldMap] = useState<Record<string, string>>({});
  const [type, setType] = useState<"intern" | "fte">("intern");
  const [ctc, setCtc] = useState<number | "">("");
  const [minCGPA, setMinCGPA] = useState<number | "">("");
  const [branchesInput, setBranchesInput] = useState<
    { value: string; label: string }[]
  >([]);
  const [gendersInput, setGendersInput] = useState<
    { value: string; label: string }[]
  >([]);
  const [allowBacklog, setAllowBacklog] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const buffer = await uploadedFile.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
    const firstRow = data[0] as string[];

    const initialMap: Record<string, string> = {};
    if (firstRow.length > 0) initialMap[firstRow[0]] = "roll_no";

    setHeaders(firstRow);
    setFieldMap(initialMap);
  };

  const handleMapChange = (column: string, value: string) => {
    setFieldMap((prev) => ({ ...prev, [column]: value }));
  };

  const handleSubmit = async () => {
    if (!file) return setStatus("❌ Please upload a file");

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
    formData.append("minCGPA", minCGPA.toString());
    formData.append("branches", JSON.stringify(selectedBranches));
    formData.append("genders", JSON.stringify(selectedGenders));
    formData.append("allowBacklog", allowBacklog.toString());
    formData.append("fieldMappings", JSON.stringify(fieldMap));

    setLoading(true);
    setStatus("🔄 Processing...");

    try {
      const res = await fetch("/api/coordinator/mtech2027/customFormat/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "eligible_students.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus("✅ Download started");
    } catch (e: any) {
      setStatus(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl h-auto flex items-center justify-center bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] p-25 text-black">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-purple-600">
            Upload & Filter Students <br /> (M.Tech)
          </h2>
          <p className="text-sm text-gray-600">Step {step} of 3</p>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={() => file && setStep(2)}
              disabled={!file}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded"
            >
              Next: Set Eligibility
            </button>
          </div>
        )}

        {/* Step 2: Eligibility */}
        {step === 2 && (
          <div className="space-y-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "intern" | "fte")}
              className="w-full border p-2 rounded"
            >
              <option value="intern">Intern</option>
              <option value="fte">FTE</option>
            </select>

            {type === "fte" && (
              <input
                type="number"
                placeholder="CTC (LPA)"
                value={ctc}
                onChange={(e) => setCtc(Number(e.target.value))}
                className="w-full border p-2 rounded"
              />
            )}

            <input
              type="number"
              placeholder="Minimum CGPA"
              value={minCGPA}
              onChange={(e) => setMinCGPA(Number(e.target.value))}
              className="w-full border p-2 rounded"
            />

            <div>
              <label className="font-semibold block mb-1">
                Allowed Branches
              </label>
              <Select
                isMulti
                options={BRANCH_OPTIONS}
                value={branchesInput}
                onChange={(selected) => {
                  const values = selected as { label: string; value: string }[];
                  const isAllSelected = values.some((v) => v.value === "ALL");
                  const wasAllSelected = branchesInput.some(
                    (v) => v.value === "ALL"
                  );

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
              <label className="font-semibold block mb-1">
                Allowed Genders
              </label>
              <Select
                isMulti
                options={GENDER_OPTIONS}
                value={gendersInput}
                onChange={(selected) => {
                  const values = selected as { label: string; value: string }[];
                  const isAllSelected = values.some((v) => v.value === "ALL");
                  const wasAllSelected = gendersInput.some(
                    (v) => v.value === "ALL"
                  );

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

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="text-gray-600 underline"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Next: Map Fields
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Map Fields */}
        {step === 3 && (
          <div className="space-y-4">
            {headers.map((header, i) => (
              <div
                key={i}
                className="flex justify-between items-center space-x-4"
              >
                <span className="w-1/2 text-sm">{header}</span>
                <select
                  className="w-1/2 border p-2 rounded"
                  value={fieldMap[header] || ""}
                  onChange={(e) => handleMapChange(header, e.target.value)}
                  disabled={i === 0}
                >
                  {i === 0 ? (
                    <option value="roll_no">Roll Number</option>
                  ) : (
                    <>
                      <option value="">-- Keep Original --</option>
                      {dbFields.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="text-gray-600 underline"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {loading ? "Processing..." : "Submit & Download"}
              </button>
            </div>
          </div>
        )}

        {status && (
          <div className="text-center text-sm font-medium text-indigo-600">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
