import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password, phone } = await req.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required" },
                { status: 400 }
            );
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Email verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const user = await User.create({
            name,
            email,
            password,
            phone,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
        });

        // إرسال إيميل التحقق
        await sendVerificationEmail(email, name, verificationToken);

        return NextResponse.json(
            {
                message: "Account created successfully. Please verify your email.",
                user: { id: user._id, name: user.name, email: user.email },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}