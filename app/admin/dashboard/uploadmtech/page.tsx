"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadMtechPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] ?? null;
    setFile(uploadedFile);
    setStatus(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("📂 Parsing and uploading...");

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const res = await fetch("/api/admin/students/mtech/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setStatus(
        `✅ Upload successful. Inserted: ${result.inserted}, Modified: ${result.modified}`
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus(`❌ Error: ${err.message || "Unexpected error"}`);
    }
  };

  return (
    <div className="p-10 rounded-xl shadow-2xl bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] text-white text-center transition-all duration-400 overflow-hidden font-poppins h-auto">
      <h2 className="text-[2.2rem] font-semibold drop-shadow-md">
        Upload M.Tech Student Data
      </h2>

      <div className="my-8">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="w-[60%] max-w-md cursor-pointer text-[#4a90e2] bg-white border-2 border-[#4a90e2] font-medium text-sm rounded-full px-6 py-3 shadow-md file:cursor-pointer file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-[#4a90e2] file:text-white hover:file:bg-[#ff9a76] transition"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-[#ff9a76] text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-[#ff8562] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Upload File
      </button>

      {status && <p className="mt-6 text-white font-bold text-lg">{status}</p>}

      <div className="mt-10 bg-white text-[#2e2e2e] rounded-xl p-6 shadow-lg text-left max-w-4xl mx-auto">
        <p className="text-lg font-semibold mb-2">📝 Expected Excel format:</p>
        <ul className="list-disc list-inside space-y-1 text-sm font-medium">
          <li>photo_url</li>
          <li>college_email</li>
          <li>personal_email</li>
          <li>full_name</li>
          <li>roll_no</li>
          <li>mtech_branch</li>
          <li>btech_branch</li>
          <li>btech_passing_year</li>
          <li>btech_institution</li>
          <li>dob</li>
          <li>gender</li>
          <li>cgpa</li>
          <li>btech_cgpa</li>
          <li>workExperience</li>
          <li>phone</li>
          <li>nationality</li>
          <li>address</li>
          <li>class10_passing_year</li>
          <li>class10_score</li>
          <li>class10_board</li>
          <li>class12_passing_year</li>
          <li>class12_score</li>
          <li>class12_board</li>
          <li>resume_link</li>
          <li>academic_gaps</li>
        </ul>
      </div>
    </div>
  );
}
