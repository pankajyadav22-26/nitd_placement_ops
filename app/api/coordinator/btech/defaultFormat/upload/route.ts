import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { connectToDatabase } from "@/lib/db";
import OfferModel from "@/models/offer";
import BtechStudentModel from "@/models/students_btech";

// Convert file to buffer
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
        const minCGPA = parseFloat(formData.get("minCGPA") as string || "0");
        const allowBacklog = (formData.get("allowBacklog") || "false") === "true";

        if (!file || !type || (type === "fte" && isNaN(ctc))) {
            return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
        }

        const buffer = await fileToBuffer(file);
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: { "Roll Number": number; "Resume Link": string }[] = XLSX.utils.sheet_to_json(sheet);

        const rollNumbers = rows.map((r) => r["Roll Number"]);
        const students = await BtechStudentModel.find({ roll_no: { $in: rollNumbers } }).lean();
        const offers = await OfferModel.find({ roll_no: { $in: rollNumbers } }).lean();

        const eligible: any[] = [];

        for (const row of rows) {
            const roll_no = row["Roll Number"];
            const resume = row["Resume Link"];
            const student = students.find((s) => s.roll_no === roll_no);
            const offerData = offers.find((o) => o.roll_no === roll_no);

            if (!student) continue;

            // --- Basic Eligibility Filters ---
            const cgpaOk = student.cgpa >= minCGPA;
            const branchOk = branches.length === 0 || branches.includes(student.branch);
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

            if (isEligible) {
                const enrichedRow = {
                    "College Email": student.college_email,
                    "Personal Email": student.personal_email,
                    "Full Name": student.full_name,
                    "Roll Number": student.roll_no,
                    "Branch": student.branch,
                    "Date of Birth": student.dob,
                    "Gender": student.gender,
                    "CGPA": student.cgpa,
                    "Phone Number": student.phone,
                    "Class 10th Year": student.class10_passing_year,
                    "Class 10th Score": student.class10_score,
                    "Class 10th Board": student.class10_board,
                    "Class 12th Year": student.class12_passing_year,
                    "Class 12th Score": student.class12_score,
                    "Class 12th Board": student.class12_board,
                    "Resume Link": resume || student.resume_link,

                    ...Object.fromEntries(
                        Object.entries(row).filter(
                            ([key]) => key !== "Roll Number" && key !== "Resume Link"
                        )
                    ),
                };

                eligible.push(enrichedRow);
            }
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