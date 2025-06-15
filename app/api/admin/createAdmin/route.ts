import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import AdminModel from "@/models/admin";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const { name, email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }
        const existingUser = await AdminModel.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            )
        }

        const hashedPassword = await hash(password, 10);

        await AdminModel.create({
            name,
            email,
            password: hashedPassword,
        })
        return NextResponse.json(

            { message: "User Registered successfully" },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { error: "Failed to register User" },
            { status: 500 }
        )
    }
}