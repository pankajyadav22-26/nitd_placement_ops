"use client";

import { useState } from "react";
import Image from "next/image";

interface Student {
  photo_url: string;
  full_name: string;
  roll_no: number;
  mtech_branch: string;
  btech_branch: string;
  btech_passing_year: number;
  btech_institution: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  cgpa: number;
  btech_cgpa: number;
  workExperience: "Yes" | "No";
  phone: string;
  nationality: string;
  address: string;
  class10_passing_year: number;
  class10_score: string;
  class10_board: string;
  class12_passing_year: number;
  class12_score: string;
  class12_board: string;
  college_email: string;
  personal_email: string;
  resume_link: string;
  academic_gaps: string;
  isAnyBacklog: "Yes" | "No";
}

export default function SearchMtechStudent() {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getDriveImageUrl = (url: string): string => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match
      ? `https://drive.google.com/uc?export=view&id=${match[1]}`
      : "";
  };

  const handleSearch = async () => {
    setStudent(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/students/mtech/profile/${rollNo}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Student not found");
      }

      const data: Student = await res.json();
      setStudent(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-auto p-15 bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] flex items-center justify-center font-poppins rounded-xl">
      <div className="bg-white text-[#2e2e2e] rounded-2xl shadow-2xl w-full max-w-5xl p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-[#ff9a76] mb-8 drop-shadow-sm">
          Search M.Tech Student by Roll No
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full max-w-md border-2 border-[#4a90e2] rounded-full px-6 py-3 text-sm text-[#4a90e2] font-semibold bg-white shadow-md focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-[#ff9a76] hover:bg-[#ff8562] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 font-semibold text-sm px-6 py-3 rounded-xl shadow mb-4 text-center max-w-lg mx-auto">
            {error}
          </div>
        )}

        {student && (
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {student.photo_url && (
                <Image
                  src={getDriveImageUrl(student.photo_url)}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                />
              )}
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-[#4a90e2]">
                  {student.full_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {student.roll_no} | {student.mtech_branch}
                </p>
                <p className="text-sm text-gray-600">CGPA: {student.cgpa}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <p>
                <strong>College Email:</strong> {student.college_email}
              </p>
              <p>
                <strong>Personal Email:</strong> {student.personal_email}
              </p>
              <p>
                <strong>Phone:</strong> {student.phone}
              </p>
              <p>
                <strong>DOB:</strong> {student.dob}
              </p>
              <p>
                <strong>Gender:</strong> {student.gender}
              </p>
              <p>
                <strong>Nationality:</strong> {student.nationality}
              </p>
              <p>
                <strong>Address:</strong> {student.address}
              </p>

              <p>
                <strong>Class 10:</strong> {student.class10_score} (
                {student.class10_board}, {student.class10_passing_year})
              </p>
              <p>
                <strong>Class 12:</strong> {student.class12_score} (
                {student.class12_board}, {student.class12_passing_year})
              </p>

              <p>
                <strong>B.Tech Branch:</strong> {student.btech_branch}
              </p>
              <p>
                <strong>B.Tech CGPA:</strong> {student.btech_cgpa}
              </p>
              <p>
                <strong>B.Tech Year:</strong> {student.btech_passing_year}
              </p>
              <p>
                <strong>B.Tech Institute:</strong> {student.btech_institution}
              </p>

              <p>
                <strong>Work Experience:</strong> {student.workExperience}
              </p>
              <p>
                <strong>Academic Gaps:</strong> {student.academic_gaps}
              </p>
              <p>
                <strong>Any Backlog:</strong> {student.isAnyBacklog}
              </p>

              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={student.resume_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4a90e2] underline font-medium hover:text-[#ff9a76] transition"
                >
                  View Resume
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
