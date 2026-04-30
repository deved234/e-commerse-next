import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const order = await Order.findById(id)
            .populate("items.product", "name images")
            .lean();

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // بس صاحب الـ order أو الـ admin
        const isOwner = order.user?.toString() === session.user.id;
        const isAdmin = session.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// تحديث status الـ order (admin فقط)
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const { orderStatus, note } = await req.json();

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        order.orderStatus = orderStatus;
        order.statusHistory.push({ status: orderStatus, note });
        await order.save();

        return NextResponse.json({ order });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}