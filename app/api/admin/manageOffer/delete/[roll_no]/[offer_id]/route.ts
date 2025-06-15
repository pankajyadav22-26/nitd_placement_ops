import { NextRequest, NextResponse } from "next/server";
import OfferModel from "@/models/offer";
import { connectToDatabase } from "@/lib/db";
import { recalculateOfferFlags } from "@/lib/recalculateFlags";

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  // Adjust this based on actual route path
  const roll_no = segments[segments.length - 2];
  const offer_id = segments[segments.length - 1];

  try {
    const student = await OfferModel.findOne({ roll_no });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const offer = student.offers.id(offer_id);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    offer.deleteOne();
    const updatedFlags = recalculateOfferFlags(student.offers);
    student.set(updatedFlags);

    await student.save();

    return NextResponse.json({ message: "Offer deleted", data: student });
  } catch (err) {
    console.error("Error deleting offer:", err);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}