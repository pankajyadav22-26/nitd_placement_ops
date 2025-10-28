import { NextRequest, NextResponse } from "next/server";
import OfferModel from "@/models/offerBatch2027";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const roll_no = segments[segments.length - 1];

  try {
    const student = await OfferModel.findOne({ roll_no });
    if (!student) {
      return NextResponse.json({ error: "There are no offers of this student" }, { status: 404 });
    }

    return NextResponse.json({ data: student });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}