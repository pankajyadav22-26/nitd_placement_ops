import { NextResponse } from "next/server";
import OfferModel from "@/models/offer";
import MtechStudentModel from "@/models/students_mtech";
import { connectToDatabase } from "@/lib/db";

interface SingleOffer {
  type: "intern" | "intern+ppo" | "intern+fte" | "fte";
  ctc?: number;
  stipend?: number;
}

export async function GET() {
  await connectToDatabase();

  const [students, offers] = await Promise.all([
    MtechStudentModel.find().lean(),
    OfferModel.find().lean(),
  ]);

  const studentMap = new Map<number, any>();
  students.forEach((s) => studentMap.set(s.roll_no, s));

  const allInternStipends: number[] = [];
  const branchMap: Record<string, number[]> = {};

  let eligibleCount = 0;
  let withInternCount = 0;

  offers.forEach((offerDoc) => {
    const roll = offerDoc.roll_no;

    const student = studentMap.get(roll);
    if (!student) return;

    const internOffers = offerDoc.offers.filter(
      (o: SingleOffer) => ["intern", "intern+ppo", "intern+fte"].includes(o.type) && o.stipend
    );

    if (student.cgpa >= 6 && !student.backlog) eligibleCount++;

    if (internOffers.length > 0) {
      withInternCount++;

      const bestStipend = Math.max(...internOffers.map((o : any) => o.stipend ?? 0));
      allInternStipends.push(bestStipend);

      const branch = student.branch || "Unknown";
      if (!branchMap[branch]) branchMap[branch] = [];
      branchMap[branch].push(bestStipend);
    }
  });

  const calcStats = (arr: number[]) => {
    if (arr.length === 0) return {
      total: 0,
      sum: 0,
      avg: 0,
      median: 0,
      min: 0,
      max: 0,
    };

    const sorted = [...arr].sort((a, b) => a - b);
    const total = arr.length;
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = sum / total;
    const median = sorted[Math.floor(total / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return { total, sum, avg, median, min, max };
  };

  const overallStats = calcStats(allInternStipends);

  const branchStats: Record<string, ReturnType<typeof calcStats>> = {};
  for (const branch in branchMap) {
    branchStats[branch] = calcStats(branchMap[branch]);
  }

  return NextResponse.json({
    totalStudents: students.length,
    eligibleStudents: eligibleCount,
    studentsWithIntern: withInternCount,
    overall: overallStats,
    branchWise: branchStats,
  });
}