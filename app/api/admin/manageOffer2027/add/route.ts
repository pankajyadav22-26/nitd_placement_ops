import { NextResponse } from "next/server";
import OfferModel from "@/models/offerBatch2027";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const {
      roll_nos = [],
      company_name,
      type,
      ctc,
      stipend,
      non_blocking = false,
      is_ppo = false,
    } = await req.json();

    const offer = {
      company_name,
      type,
      ctc,
      stipend,
      is_ppo,
      non_blocking,
      offer_date: new Date(),
    };

    let successCount = 0;

    for (const roll_no of roll_nos) {
      const studentOffer = await OfferModel.findOne({ roll_no });

      const isIntern = type.includes("intern");
      const isFte = type.includes("fte");
      const isFteCounted = isFte && ctc >= 7.5 && !non_blocking;
      const internShouldBlock = isIntern && !non_blocking;

      if (!studentOffer) {
        await OfferModel.create({
          roll_no,
          offers: [offer],
          has_intern_offer: isIntern,
          intern_blocked: internShouldBlock,
          fte_offer_count: isFteCounted ? 1 : 0,
          highest_fte_ctc: isFteCounted ? ctc : 0,
        });
      } else {
        const update: any = { $push: { offers: offer } };

        if (isIntern) {
          update.$set = {
            ...(update.$set || {}),
            has_intern_offer: true,
            intern_blocked: studentOffer.intern_blocked || internShouldBlock,
          };
        }

        if (isFteCounted) {
          update.$inc = {
            ...(update.$inc || {}),
            fte_offer_count: 1,
          };
          if (ctc > (studentOffer.highest_fte_ctc || 0)) {
            update.$set = {
              ...(update.$set || {}),
              highest_fte_ctc: ctc,
            };
          }
        }

        await OfferModel.findOneAndUpdate({ roll_no }, update);
      }

      successCount += 1;
    }

    return NextResponse.json({ message: "Offers added", successCount });
  } catch (err) {
    console.error("Bulk Offer Error:", err);
    return NextResponse.json({ error: "Failed to add offers" }, { status: 500 });
  }
}