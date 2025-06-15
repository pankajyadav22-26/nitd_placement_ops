import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Studentsbtech from "@/models/students_btech";

export async function GET(
  req: Request,
  { params }: { params: { roll_no: string } }
) {
  await connectToDatabase();

  try {
    const student = await Studentsbtech.findOne({ roll_no: params.roll_no }).lean();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while fetching student." },
      { status: 500 }
    );
  }
}