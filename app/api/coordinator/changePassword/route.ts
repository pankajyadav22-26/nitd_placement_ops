import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CoordinatorsModel from "@/models/coordinators"; 
import { compare, hash } from "bcryptjs";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { email, oldPassword, newPassword } = await req.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await CoordinatorsModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await compare(oldPassword, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 403 });
    }

    const hashed = await hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password Change Error:", err);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}