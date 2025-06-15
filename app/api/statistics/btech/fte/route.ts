import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import OfferModel from "@/models/offer";
import BtechStudentModel from "@/models/students_btech";

export async function GET() {
    try {
        await connectToDatabase();

        const allStudents = await BtechStudentModel.find({}).lean();
        const totalStudents = allStudents.length;

        const eligibleStudents = allStudents.filter(
            (s) => !s.has_backlog && s.cgpa >= 6
        );
        const eligibleRolls = eligibleStudents.map((s) => s.roll_no);

        const offers = await OfferModel.find({
            roll_no: { $in: eligibleRolls },
        }).lean();

        const fteStats: {
            count: number;
            sum: number;
            average: number;
            median: number;
            min: number;
            max: number;
        } = {
            count: 0,
            sum: 0,
            average: 0,
            median: 0,
            min: Infinity,
            max: -Infinity,
        };

        const fteCTCs: number[] = [];

        const rollToStudentMap = Object.fromEntries(
            eligibleStudents.map((s) => [s.roll_no, s])
        );

        const branchWiseStats: Record<
            string,
            {
                count: number;
                sum: number;
                average: number;
                median: number;
                min: number;
                max: number;
                _offers?: number[];
            }
        > = {};

        offers.forEach((offer) => {
            const fteOffers = offer.offers.filter((o: any) =>
                ["fte", "intern+fte", "intern+ppo"].includes(o.type) && o.ctc
            );

            if (fteOffers.length > 0) {
                const bestCTC = Math.max(...fteOffers.map((o: any) => o.ctc || 0));
                fteCTCs.push(bestCTC);

                const student = rollToStudentMap[offer.roll_no];
                const branch = student?.branch || "Unknown";

                if (!branchWiseStats[branch]) {
                    branchWiseStats[branch] = {
                        count: 0,
                        sum: 0,
                        average: 0,
                        median: 0,
                        min: Infinity,
                        max: -Infinity,
                        _offers: [],
                    };
                }

                branchWiseStats[branch]._offers!.push(bestCTC);
            }
        });

        // Overall stats
        if (fteCTCs.length > 0) {
            fteStats.count = fteCTCs.length;
            fteStats.sum = fteCTCs.reduce((a, b) => a + b, 0);
            fteStats.average = Number((fteStats.sum / fteStats.count).toFixed(2));
            fteStats.min = Math.min(...fteCTCs);
            fteStats.max = Math.max(...fteCTCs);

            const sorted = [...fteCTCs].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            fteStats.median =
                sorted.length % 2 === 0
                    ? (sorted[mid - 1] + sorted[mid]) / 2
                    : sorted[mid];
        }

        // Branch-wise stats
        for (const [branch, data] of Object.entries(branchWiseStats)) {
            const offers = data._offers || [];
            data.count = offers.length;
            data.sum = offers.reduce((a, b) => a + b, 0);
            data.average = Number((data.sum / data.count).toFixed(2));
            data.min = Math.min(...offers);
            data.max = Math.max(...offers);
            const sorted = [...offers].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            data.median =
                sorted.length % 2 === 0
                    ? (sorted[mid - 1] + sorted[mid]) / 2
                    : sorted[mid];

            delete data._offers;
        }

        return NextResponse.json({
            totalStudents,
            eligibleStudents: eligibleRolls.length,
            fteStats,
            branchWiseStats,
        });
    } catch (error) {
        console.error("Error fetching BTech FTE stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}