import { NextResponse } from "next/server";
import OfferModel from "@/models/offer";
import { connectToDatabase } from "@/lib/db";
import { recalculateOfferFlags } from "@/lib/recalculateFlags";

export async function PATCH(
  req: Request,
  { params }: { params: { roll_no: string; offer_id: string } }
) {
  await connectToDatabase();
  const { roll_no, offer_id } = params;
  const updateData = await req.json();

  try {
    const student = await OfferModel.findOne({ roll_no });
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const offer = student.offers.id(offer_id);
    if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

    // Update the offer fields
    Object.keys(updateData).forEach((key) => {
      if (key in offer) offer[key] = updateData[key];
    });

    // Recalculate flags
    const flags = recalculateOfferFlags(student.offers);
    student.set(flags);

    await student.save();

    return NextResponse.json({ message: "Offer updated", data: student });
  } catch (err) {
    console.error("Edit error:", err);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}