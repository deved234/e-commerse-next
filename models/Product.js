import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    name: String,       // مثلاً: "Color", "Size"
    value: String,      // مثلاً: "Red", "XL"
    stock: { type: Number, default: 0 },
    price: Number,      // سعر مختلف لو موجود
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        comparePrice: {
            type: Number,
            default: null,  // السعر الأصلي قبل الخصم
        },
        images: [String],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        variants: [variantSchema],
        tags: [String],
        ratings: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index للـ search
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ seller: 1 });

export default mongoose.models.Product || mongoose.model("Product", productSchema);