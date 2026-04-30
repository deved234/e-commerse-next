import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        const reviews = await Review.find({ product: productId })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ reviews });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const { productId, rating, comment, images } = await req.json();

        // تحقق إنه اشتراه فعلاً
        const purchasedOrder = await Order.findOne({
            user: session.user.id,
            "items.product": productId,
            orderStatus: "delivered",
        });

        const review = await Review.create({
            user: session.user.id,
            product: productId,
            rating,
            comment,
            images,
            isVerifiedPurchase: !!purchasedOrder,
        });

        await review.populate("user", "name avatar");
        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "You already reviewed this product" },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}