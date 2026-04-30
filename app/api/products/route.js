import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateSlug } from "@/utils/generateSlug";

// GET all products مع search + filter + pagination
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 12;
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sort = searchParams.get("sort") || "createdAt";
        const order = searchParams.get("order") || "desc";
        const featured = searchParams.get("featured");

        // Build query
        const query = { isActive: true };

        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (featured === "true") {
            query.isFeatured = true;
        }

        const skip = (page - 1) * limit;
        const sortObj = { [sort]: order === "asc" ? 1 : -1 };

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate("category", "name slug")
                .populate("seller", "name")
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET products error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST - إضافة منتج جديد (seller/admin)
export async function POST(req) {
    try {
        const session = await auth();
        if (!session || !["seller", "admin"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();

        const slug = generateSlug(body.name);

        const product = await Product.create({
            ...body,
            slug,
            seller: session.user.id,
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error("POST product error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}