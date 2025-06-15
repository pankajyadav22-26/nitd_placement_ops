import { connectToDatabase } from "@/lib/db";
import Studentsmtech from "@/models/students_mtech";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { roll_no: string } }) {
  await connectToDatabase();

  try {
    const student = await Studentsmtech.findOne({ roll_no: params.roll_no });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}