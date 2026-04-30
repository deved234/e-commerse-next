import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        images: [String],
        isVerifiedPurchase: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// كل يوزر يعمل review واحد بس للـ product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// بعد الحفظ، بنحدث الـ ratings في الـ Product
reviewSchema.post("save", async function () {
    const Product = mongoose.model("Product");
    const stats = await mongoose.model("Review").aggregate([
        { $match: { product: this.product } },
        { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            "ratings.average": Math.round(stats[0].avg * 10) / 10,
            "ratings.count": stats[0].count,
        });
    }
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);