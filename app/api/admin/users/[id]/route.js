import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        // لا تسمح بتغيير كلمة السر من هنا
        delete body.password;

        const user = await User.findByIdAndUpdate(id, body, { new: true }).select("-password");
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}