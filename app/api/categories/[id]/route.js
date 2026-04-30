import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateSlug } from "@/utils/generateSlug";

export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        if (body.name) body.slug = generateSlug(body.name);
        const category = await Category.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json({ category });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const { id } = await params;
        await Category.findByIdAndUpdate(id, { isActive: false });
        return NextResponse.json({ message: "Category deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}