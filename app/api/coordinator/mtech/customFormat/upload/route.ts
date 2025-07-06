import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { connectToDatabase } from "@/lib/db";
import OfferModel from "@/models/offer";
import MtechStudentModel from "@/models/students_mtech";

// Convert uploaded file to buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function GET() {
  return NextResponse.json({ status: "OK", method: "GET working" });
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const ctc = parseFloat(formData.get("ctc") as string);
    const branches = JSON.parse(formData.get("branches") as string || "[]") as string[];
    const genders = JSON.parse(formData.get("genders") as string || "[]") as string[];
    const rawCGPA = formData.get("minCGPA");
    const minCGPA = typeof rawCGPA === "string" && rawCGPA.trim() !== ""
      ? Number(rawCGPA)
      : 0;
    const allowBacklog = (formData.get("allowBacklog") || "false") === "true";
    const fieldMappings = JSON.parse(formData.get("fieldMappings") as string || "{}") as Record<string, string>; // e.g. { "Latest CGPA": "cgpa" }

    if (!file || !type || (type === "fte" && isNaN(ctc))) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const buffer = await fileToBuffer(file);
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
    if (!raw.length) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    const headers = raw[0];
    const dataRows = raw.slice(1);
    const rows = dataRows.map((row) =>
      headers.reduce((acc, header, idx) => {
        acc[header] = row[idx];
        return acc;
      }, {} as Record<string, any>)
    );

    const headerKeys = Object.keys(rows[0]);
    const rollNumbers = rows
      .map(r => {
        const raw = r["Roll Number"];
        if (raw === undefined || raw === null) return NaN;
        const asNumber = typeof raw === "string" ? Number(raw.trim()) : raw;
        return Number(asNumber);
      })
      .filter(n => !isNaN(n));
    const students = await MtechStudentModel.find({ roll_no: { $in: rollNumbers } }).lean();
    const offers = await OfferModel.find({ roll_no: { $in: rollNumbers } }).lean();

    const eligible: Record<string, any>[] = [];

    for (const row of rows) {
      const roll_no = row["Roll Number"];
      const resume = row["Resume Link"];
      const student = students.find(s => s.roll_no === roll_no);
      const offerData = offers.find(o => o.roll_no === roll_no);

      if (!student) continue;

      // --- Eligibility Filters ---
      const cgpaOk = student.cgpa >= minCGPA;
      const branchOk = branches.length === 0 || branches.includes(student.mtech_branch);
      const genderOk = genders.length === 0 || genders.includes(student.gender);
      const backlogOk = allowBacklog || student.isAnyBacklog === "No";

      if (!cgpaOk || !branchOk || !genderOk || !backlogOk) continue;

      let isEligible = false;
      if (type === "intern") {
        isEligible = !(offerData?.intern_blocked ?? false);
      } else if (type === "fte") {
        const count = offerData?.fte_offer_count || 0;
        const maxCtc = offerData?.highest_fte_ctc || 0;
        if (ctc < 7.5) {
          isEligible = true;
        } else if (count < 2) {
          if (count === 0 || ctc >= 1.5 * maxCtc) {
            isEligible = true;
          }
        }
      }

      if (!isEligible) continue;

      const outputRow: Record<string, any> = {};
      for (const col of headerKeys) {
        if (col === "Roll Number") {
          outputRow[col] = roll_no;
        } else if (col === "Resume Link") {
          outputRow[col] = resume || student.resume_link;
        } else if (fieldMappings[col]) {
          const dbField = fieldMappings[col];
          outputRow[col] = student[dbField] ?? "";
        } else {
          outputRow[col] = row[col];
        }
      }

      eligible.push(outputRow);
    }

    const outSheet = XLSX.utils.json_to_sheet(eligible);
    const outWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(outWorkbook, outSheet, "Eligible Students");
    const outputBuffer = XLSX.write(outWorkbook, { bookType: "xlsx", type: "buffer" });

    return new Response(outputBuffer, {
      headers: {
        "Content-Disposition": "attachment; filename=eligible_students.xlsx",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}