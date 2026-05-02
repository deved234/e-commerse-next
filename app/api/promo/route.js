import connectDB from "@/lib/db";
import PromoCode from "@/models/PromoCode";
import { NextResponse } from "next/server";

// التحقق من الـ promo code
export async function POST(req) {
    try {
        await connectDB();
        const { code, orderAmount } = await req.json();

        const promo = await PromoCode.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });

        if (!promo) {
            return NextResponse.json(
                { error: "Invalid promo code" },
                { status: 404 }
            );
        }

        // تحقق من التاريخ
        if (promo.expiresAt && new Date() > promo.expiresAt) {
            return NextResponse.json(
                { error: "Promo code has expired" },
                { status: 400 }
            );
        }

        // تحقق من عدد الاستخدامات
        if (promo.maxUses && promo.usedCount >= promo.maxUses) {
            return NextResponse.json(
                { error: "Promo code has reached its usage limit" },
                { status: 400 }
            );
        }

        // تحقق من الحد الأدنى للطلب
        if (orderAmount < promo.minOrderAmount) {
            return NextResponse.json(
                {
                    error: `Minimum order amount is EGP ${promo.minOrderAmount}`,
                },
                { status: 400 }
            );
        }

        // احسب الخصم
        let discountAmount = 0;
        if (promo.discountType === "percentage") {
            discountAmount = (orderAmount * promo.discountValue) / 100;
        } else {
            discountAmount = promo.discountValue;
        }

        return NextResponse.json({
            valid: true,
            code: promo.code,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            discountAmount: Math.min(discountAmount, orderAmount),
        });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}