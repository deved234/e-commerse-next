import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Helper - get cart identifier
async function getCartQuery(session, req) {
    if (session) return { user: session.user.id };
    const sessionId = req.cookies.get("guest_session")?.value;
    return sessionId ? { sessionId } : null;
}

// GET cart
export async function GET(req) {
    try {
        await connectDB();
        const session = await auth();
        const query = await getCartQuery(session, req);

        if (!query) return NextResponse.json({ cart: { items: [] } });

        const cart = await Cart.findOne(query)
            .populate("items.product", "name images price stock isActive")
            .lean();

        return NextResponse.json({ cart: cart || { items: [] } });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST - إضافة item للـ cart
export async function POST(req) {
    try {
        await connectDB();
        const session = await auth();
        const { productId, quantity = 1 } = await req.json();

        // التحقق من الـ product
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.stock < quantity) {
            return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
        }

        const query = session ? { user: session.user.id } : null;
        if (!query) {
            return NextResponse.json({ error: "Please login to add to cart" }, { status: 401 });
        }

        let cart = await Cart.findOne(query);

        if (!cart) {
            cart = await Cart.create({
                ...query,
                items: [{ product: productId, quantity, price: product.price }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (i) => i.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity, price: product.price });
            }

            await cart.save();
        }

        await cart.populate("items.product", "name images price stock");

        return NextResponse.json({ cart });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PUT - تعديل الكمية
export async function PUT(req) {
    try {
        await connectDB();
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, quantity } = await req.json();

        const cart = await Cart.findOne({ user: session.user.id });
        if (!cart) {
            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        if (quantity < 1) {
            cart.items = cart.items.filter((i) => i.product.toString() !== productId);
        } else {
            const item = cart.items.find((i) => i.product.toString() === productId);
            if (item) item.quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.product", "name images price stock");

        return NextResponse.json({ cart });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE - إزالة item
export async function DELETE(req) {
    try {
        await connectDB();
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        const cart = await Cart.findOne({ user: session.user.id });
        if (!cart) {
            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
        await cart.save();

        return NextResponse.json({ message: "Item removed", cart });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}