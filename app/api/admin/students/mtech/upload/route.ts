import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Studentsmtech from "@/models/students_mtech";

export async function POST(req: Request) {
    await connectToDatabase();
    try {
        const students = await req.json();
        if (!Array.isArray(students)) {
            return NextResponse.json({ error: "Invalid input format. Expected an array of students." }, { status: 400 });
        }

        const bulkOps = students.map((student) => ({
            updateOne: {
                filter: { roll_no: student.roll_no },
                update: { $set: student },
                upsert: true,
            },
        }));

        const result = await Studentsmtech.bulkWrite(bulkOps);

        return NextResponse.json({
            message: "Upload completed",
            inserted: result.upsertedCount ?? 0,
            modified: result.modifiedCount ?? 0,
        });
    } catch (error) {
        console.error("Error uploading students:", error);
        return NextResponse.json({ error: "Server error while uploading students." }, { status: 500 });
    }
}