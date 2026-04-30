import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateSlug } from "@/utils/generateSlug";

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({ isActive: true })
            .populate("parent", "name slug")
            .sort({ order: 1 })
            .lean();

        return NextResponse.json({ categories });
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
        const { name, description, image, parent, order } = await req.json();

        const slug = generateSlug(name);

        const category = await Category.create({
            name,
            slug,
            description,
            image,
            parent: parent || null,
            order,
        });

        return NextResponse.json({ category }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}