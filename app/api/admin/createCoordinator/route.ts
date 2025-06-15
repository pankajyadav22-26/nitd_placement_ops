import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CoordinatorModel from "@/models/coordinators";
import { hash } from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await CoordinatorModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await CoordinatorModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Placement Cell" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Coordinator Account Has Been Created",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Your coordinator account has been created successfully.</p>
        <p><strong>Login Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please change your password after logging in for the first time.</p>
        <br/>
        <p>Regards,<br/>Placement Cell</p>
      `,
    });

    return NextResponse.json(
      { message: "User registered and email sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register User" },
      { status: 500 }
    );
  }
}