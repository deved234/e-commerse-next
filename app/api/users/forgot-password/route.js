import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        const user = await User.findOne({ email });

        // مش بنقول للمستخدم إن الإيميل مش موجود (security)
        if (!user) {
            return NextResponse.json({
                message: "If this email exists, a reset link has been sent.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
        await user.save();

        await sendPasswordResetEmail(email, user.name, token);

        return NextResponse.json({
            message: "If this email exists, a reset link has been sent.",
        });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}