import connectDB from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const wishlist = await Wishlist.findOne({ user: session.user.id })
            .populate("products", "name images price ratings comparePrice")
            .lean();

        return NextResponse.json({ wishlist: wishlist || { products: [] } });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const { productId } = await req.json();

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: session.user.id },
            { $addToSet: { products: productId } },
            { upsert: true, new: true }
        ).populate("products", "name images price ratings");

        return NextResponse.json({ wishlist });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: session.user.id },
            { $pull: { products: productId } },
            { new: true }
        ).populate("products", "name images price ratings");

        return NextResponse.json({ wishlist });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}