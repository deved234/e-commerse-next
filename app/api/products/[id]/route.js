import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET single product
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const product = await Product.findById(id)
            .populate("category", "name slug")
            .populate("seller", "name avatar")
            .lean();

        if (!product || !product.isActive) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// UPDATE product
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // بس الـ seller بتاعه أو الـ admin يقدر يعدل
        const isOwner = product.seller.toString() === session.user.id;
        const isAdmin = session.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        return NextResponse.json({ product: updated });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE - soft delete
export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const isOwner = product.seller.toString() === session.user.id;
        const isAdmin = session.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Soft delete
        await Product.findByIdAndUpdate(id, { isActive: false });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}