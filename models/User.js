import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    label: { type: String, default: "Home" },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "Egypt" },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: { type: String, trim: true },
        password: { type: String, select: false },
        avatar: { type: String, default: "" },
        role: {
            type: String,
            enum: ["customer", "seller", "admin"],
            default: "customer",
        },
        addresses: [addressSchema],
        isEmailVerified: { type: Boolean, default: false },
        emailVerificationToken: String,
        emailVerificationExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        isActive: { type: Boolean, default: true },
        googleId: String,
        stripeCustomerId: String,
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;