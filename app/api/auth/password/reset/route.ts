import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import AdminModel from "@/models/admin";
import CoordinatorModel from "@/models/coordinators";

export async function POST(req: Request) {
    const { token, newPassword, role } = await req.json();

    if (!token || !newPassword || !role) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(role);

    await connectToDatabase();

    let UserModel;
    switch (role) {
        case "admin-login":
            UserModel = AdminModel;
            break;
        case "coordinator-login":
            UserModel = CoordinatorModel;
            break;
        default:
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await UserModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
}