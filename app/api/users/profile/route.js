import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET profile
export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(session.user.id).select(
            "-password -emailVerificationToken -resetPasswordToken"
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// UPDATE profile
export async function PUT(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { name, phone, avatar, addresses } = await req.json();

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { name, phone, avatar, addresses },
            { new: true, runValidators: true }
        ).select("-password");

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}