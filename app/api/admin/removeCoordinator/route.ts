import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CoordinatorModel from "@/models/coordinators";

export async function DELETE(req: Request) {
    await connectToDatabase();

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const result = await CoordinatorModel.deleteOne({ email });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Coordinator removed successfully" });
    } catch (err) {
        console.error("Error removing coordinator:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}