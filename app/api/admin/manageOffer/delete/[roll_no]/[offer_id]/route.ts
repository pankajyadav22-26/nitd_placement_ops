import { NextResponse } from "next/server";
import OfferModel from "@/models/offer";
import { connectToDatabase } from "@/lib/db";
import { recalculateOfferFlags } from "@/lib/recalculateFlags";

export async function DELETE(
  _req: Request,
  { params }: { params: { roll_no: string; offer_id: string } }
) {
  await connectToDatabase();

  const { roll_no, offer_id } = params;

  try {
    const student = await OfferModel.findOne({ roll_no });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const offer = student.offers.id(offer_id);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    offer.deleteOne(); // equivalent to `offer.remove()` but more consistent with Mongoose 6+

    // Recalculate flags based on the updated offers array
    const updatedFlags = recalculateOfferFlags(student.offers);
    student.set(updatedFlags);

    await student.save();

    return NextResponse.json({ message: "Offer deleted", data: student });
  } catch (err) {
    console.error("Error deleting offer:", err);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}