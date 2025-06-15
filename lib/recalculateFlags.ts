export function recalculateOfferFlags(offers: any[]) {
  let has_intern_offer = false;
  let intern_blocked = false;
  let fte_offer_count = 0;
  let highest_fte_ctc = 0;

  for (const offer of offers) {
    const isIntern = offer.type.includes("intern");
    const isFte = offer.type.includes("fte");

    const isFteCounted = isFte && offer.ctc >= 7.5 && !offer.non_blocking;

    // Intern logic
    if (isIntern) {
      has_intern_offer = true;
      if (!offer.non_blocking) intern_blocked = true;
    }

    // FTE logic
    if (isFteCounted) {
      fte_offer_count += 1;
      if (offer.ctc > highest_fte_ctc) {
        highest_fte_ctc = offer.ctc;
      }
    }
  }

  return {
    has_intern_offer,
    intern_blocked,
    fte_offer_count,
    highest_fte_ctc,
  };
}