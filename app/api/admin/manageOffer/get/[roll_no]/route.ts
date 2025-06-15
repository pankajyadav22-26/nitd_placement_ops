import { NextResponse } from "next/server";
import OfferModel from "@/models/offer";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { roll_no: string } }
) {
  await connectToDatabase();

  const { roll_no } = params;

  try {
    const student = await OfferModel.findOne({ roll_no });
    if (!student) {
      return NextResponse.json({ error: "There are no offers of this Student" }, { status: 404 });
    }

    return NextResponse.json({ data: student });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}