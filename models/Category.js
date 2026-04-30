import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: String,
        image: String,
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", categorySchema);