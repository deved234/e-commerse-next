import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email";

// GET orders بتاعت الـ user
export async function GET(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const query = session.user.role === "admin" ? {} : { user: session.user.id };

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate("items.product", "name images")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query),
        ]);

        return NextResponse.json({
            orders,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST - إنشاء order جديد
export async function POST(req) {
    try {
        await connectDB();
        const session = await auth();
        const body = await req.json();
        const { items, shippingAddress, paymentMethod, guestEmail, promoCode } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in order" }, { status: 400 });
        }

        // حساب الأسعار وتحقق من الـ stock
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || !product.isActive) {
                return NextResponse.json(
                    { error: `Product ${item.productId} not found` },
                    { status: 404 }
                );
            }
            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }

            subtotal += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                quantity: item.quantity,
            });
        }

        const shippingCost = subtotal > 500 ? 0 : 50; // مجاني فوق 500
        const total = subtotal + shippingCost;

        const order = await Order.create({
            user: session?.user?.id || null,
            guestEmail: !session ? guestEmail : null,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            total,
            promoCode,
            statusHistory: [{ status: "pending", note: "Order placed" }],
        });

        // تحديث الـ stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }

        // مسح الـ cart لو user مسجل
        if (session) {
            await Cart.findOneAndDelete({ user: session.user.id });
        }

        // إرسال إيميل تأكيد
        const emailTo = session?.user?.email || guestEmail;
        if (emailTo) {
            await sendOrderConfirmationEmail(emailTo, order);
        }

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}