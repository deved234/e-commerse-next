import stripe from "@/lib/stripe";
import Order from "@/models/Order";
import connectDB from "@/lib/db";
import { sendOrderStatusEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    await connectDB();

    switch (event.type) {
        case "payment_intent.succeeded": {
            const intent = event.data.object;
            const order = await Order.findByIdAndUpdate(
                intent.metadata.orderId,
                {
                    paymentStatus: "paid",
                    orderStatus: "confirmed",
                    paymentId: intent.id,
                    $push: { statusHistory: { status: "confirmed", note: "Payment received" } },
                },
                { new: true }
            );

            if (order) {
                const user = await import("@/models/User").then((m) =>
                    m.default.findById(order.user)
                );
                if (user) await sendOrderStatusEmail(user.email, order);
            }
            break;
        }

        case "payment_intent.payment_failed": {
            const intent = event.data.object;
            await Order.findByIdAndUpdate(intent.metadata.orderId, {
                paymentStatus: "failed",
                $push: { statusHistory: { status: "pending", note: "Payment failed" } },
            });
            break;
        }
    }

    return NextResponse.json({ received: true });
}