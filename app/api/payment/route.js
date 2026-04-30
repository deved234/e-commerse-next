import stripe from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// إنشاء Payment Intent
export async function POST(req) {
    try {
        const session = await auth();
        const { amount, currency = "egp", orderId, metadata = {} } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe بيشتغل بـ cents
            currency,
            metadata: {
                orderId,
                userId: session?.user?.id || "guest",
                ...metadata,
            },
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error("Payment intent error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}