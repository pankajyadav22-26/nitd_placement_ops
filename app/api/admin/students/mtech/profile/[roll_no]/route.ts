import { connectToDatabase } from "@/lib/db";
import Studentsmtech from "@/models/students_mtech";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const roll_no = segments[segments.length - 1];

  try {
    const student = await Studentsmtech.findOne({ roll_no });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}