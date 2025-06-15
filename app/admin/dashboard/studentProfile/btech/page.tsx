"use client";

import { useState } from "react";
import Image from "next/image";

interface Student {
  photo_url?: string;
  full_name?: string;
  roll_no?: string;
  branch?: string;
  cgpa?: number;
  college_email?: string;
  personal_email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  class10_passing_year?: string;
  class10_score?: number;
  class10_board?: string;
  class12_passing_year?: string;
  class12_score?: number;
  class12_board?: string;
  resume_link?: string;
}

export default function SearchBtechStudent() {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getDriveImageUrl(driveUrl: string): string {
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : "";
  }

  const handleSearch = async () => {
    setStudent(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/students/btech/profile/${rollNo}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Student not found");
      }

      const data = await res.json();
      setStudent(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-auto p-15 bg-gradient-to-br from-[#4a90e2] to-[#ff9a76] flex justify-center font-poppins rounded-xl">
      <div className="bg-white text-[#2e2e2e] rounded-2xl shadow-xl w-full max-w-4xl p-8 sm:p-12 space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-[#4a90e2] to-[#ff9a76] text-transparent bg-clip-text drop-shadow-sm">
          Search B.Tech Student by Roll No
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full sm:max-w-sm border-2 border-[#4a90e2] rounded-full px-6 py-3 text-sm text-[#4a90e2] font-semibold bg-white shadow focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-[#ff9a76] hover:bg-[#ff8562] text-white font-semibold px-8 py-3 rounded-full shadow transition-all duration-300"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 font-medium text-sm px-6 py-3 rounded-xl shadow text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {student && (
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-inner space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {student.photo_url && (
                <div className="w-32 h-32 relative rounded-full overflow-hidden border-2 border-[#4a90e2] shadow-md">
                  <Image
                    src={getDriveImageUrl(student.photo_url)}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-2xl font-bold text-[#4a90e2]">{student.full_name}</h3>
                <p className="text-sm text-gray-600">
                  {student.roll_no} | {student.branch}
                </p>
                <p className="text-sm text-gray-600">CGPA: {student.cgpa}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <p><strong>Email (College):</strong> {student.college_email}</p>
              <p><strong>Email (Personal):</strong> {student.personal_email}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
              <p><strong>Date of Birth:</strong> {student.dob}</p>
              <p><strong>Gender:</strong> {student.gender}</p>
              <p><strong>Nationality:</strong> {student.nationality}</p>
              <p><strong>Address:</strong> {student.address}</p>
              <p>
                <strong>Class 10:</strong> {student.class10_score} (
                {student.class10_board}, {student.class10_passing_year})
              </p>
              <p>
                <strong>Class 12:</strong> {student.class12_score} (
                {student.class12_board}, {student.class12_passing_year})
              </p>
              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={student.resume_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4a90e2] underline hover:text-[#ff9a76] transition"
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