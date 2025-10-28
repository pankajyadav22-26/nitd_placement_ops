import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { connectToDatabase } from "@/lib/db";
import OfferModel from "@/models/offerBatch2027";
import MtechStudentModel from "@/models/students_mtech2027";

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
        const minCGPA = parseFloat(formData.get("minCGPA") as string || "0");
        const allowBacklog = (formData.get("allowBacklog") || "false") === "true";

        if (!file || !type || (type === "fte" && isNaN(ctc))) {
            return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
        }

        // Read the uploaded Excel file
        const buffer = await fileToBuffer(file);
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        // Get all roll numbers
        const rollNumbers = rows.map((r) => r["Roll Number"]);
        const students = await MtechStudentModel.find({ roll_no: { $in: rollNumbers } }).lean();
        const offers = await OfferModel.find({ roll_no: { $in: rollNumbers } }).lean();

        const eligible: any[] = [];

        for (const row of rows) {
            const roll_no = row["Roll Number"];
            const resume = row["Resume Link"];
            const student = students.find((s) => s.roll_no === roll_no);
            const offerData = offers.find((o) => o.roll_no === roll_no);

            if (!student) continue;

            // Eligibility filters
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

            if (isEligible) {
                // Merge uploaded row fields with default student fields
                const enrichedRow = {
                    // Add default fields first
                    "College Email": student.college_email,
                    "Personal Email": student.personal_email,
                    "Full Name": student.full_name,
                    "Roll Number": student.roll_no,
                    "M.Tech Branch": student.mtech_branch,
                    "B.Tech Branch": student.btech_branch,
                    "B.Tech Passing Year": student.btech_passing_year,
                    "B.Tech Institution Name": student.btech_institution,
                    "Date of Birth": student.dob,
                    "Gender": student.gender,
                    "Mtech CGPA": student.cgpa,
                    "Btech CGPA": student.btech_cgpa,
                    "Any Work Experience after Graduation?": student.workExperience,
                    "Phone Number": student.phone,
                    "Class 10th Year": student.class10_passing_year,
                    "Class 10th Score": student.class10_score,
                    "Class 10th Board": student.class10_board,
                    "Class 12th Year": student.class12_passing_year,
                    "Class 12th Score": student.class12_score,
                    "Class 12th Board": student.class12_board,
                    "Resume Link": resume || student.resume_link,

                    // Then add uploaded fields (excluding Roll Number and Resume Link to avoid dupes)
                    ...Object.fromEntries(
                        Object.entries(row).filter(
                            ([key]) => key !== "Roll Number" && key !== "Resume Link"
                        )
                    ),
                };

                eligible.push(enrichedRow);
            }
        }

        // Export as Excel
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