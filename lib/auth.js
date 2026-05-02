import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await connectDB();
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.avatar,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            // لو بيسجل بـ Google
            if (account?.provider === "google") {
                await connectDB();
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    // اعمل user جديد
                    await User.create({
                        name: user.name,
                        email: user.email,
                        avatar: user.image,
                        googleId: user.id,
                        isEmailVerified: true,
                        role: "customer",
                    });
                } else if (!existingUser.googleId) {
                    // ربط الـ account الموجود بـ Google
                    await User.findByIdAndUpdate(existingUser._id, {
                        googleId: user.id,
                        avatar: user.image,
                    });
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                await connectDB();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: { strategy: "jwt" },
});