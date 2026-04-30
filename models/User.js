import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        avatar: {
            type: String,
            default: "",
        },
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
        isActive: { type: Boolean, default: true },  // للـ soft delete
        googleId: String,
        stripeCustomerId: String,
    },
    { timestamps: true }
);

// Hash password قبل الحفظ
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);