import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password, phone } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password هنا مباشرة
        const hashedPassword = await bcrypt.hash(password, 12);

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: true,
        });

        try {
            await sendVerificationEmail(email, name, verificationToken);
        } catch (emailError) {
            console.log("Email not sent (skipped):", emailError.message);
        }

        return NextResponse.json(
            {
                message: "Account created successfully.",
                user: { id: user._id, name: user.name, email: user.email },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}