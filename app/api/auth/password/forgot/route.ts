import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendMail";
import AdminModel from "@/models/admin";
import CoordinatorModel from "@/models/coordinators";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
    const { email, role } = await req.json();

    if (!email || !role) {
        return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    await connectToDatabase();

    let UserModel;
    if (role === "admin-login") {
        UserModel = AdminModel;
    } else if (role === "coordinator-login") {
        UserModel = CoordinatorModel;
    } else {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create token + expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/password/reset?token=${token}&role=${role}`;

    await sendEmail({
        to: email,
        subject: "Password Reset",
        text: `You requested a password reset. 
        Click here to reset your password: ${resetUrl}`,
    });

    return NextResponse.json({ message: "Password reset link sent" });
}