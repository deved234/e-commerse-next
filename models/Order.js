import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        guestEmail: String,   // للـ guest checkout
        items: [orderItemSchema],
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        paymentMethod: {
            type: String,
            enum: ["stripe", "paypal", "cash_on_delivery", "wallet"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        paymentId: String,   // Stripe payment intent ID
        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        statusHistory: [
            {
                status: String,
                timestamp: { type: Date, default: Date.now },
                note: String,
            },
        ],
        subtotal: { type: Number, required: true },
        shippingCost: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        promoCode: String,
        notes: String,
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);