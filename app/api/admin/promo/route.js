import connectDB from "@/lib/db";
import PromoCode from "@/models/PromoCode";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const promos = await PromoCode.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ promos });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const body = await req.json();
        const promo = await PromoCode.create(body);
        return NextResponse.json({ promo }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        await PromoCode.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}