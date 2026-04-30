import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;

    // حماية Admin routes
    if (pathname.startsWith("/admin")) {
        if (!session || session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // حماية Seller routes
    if (pathname.startsWith("/seller")) {
        if (!session || !["seller", "admin"].includes(session.user.role)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // حماية Profile/Orders/Wishlist
    if (["/profile", "/orders", "/wishlist", "/checkout"].some(p => pathname.startsWith(p))) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/admin/:path*",
        "/seller/:path*",
        "/profile/:path*",
        "/orders/:path*",
        "/wishlist/:path*",
        "/checkout/:path*",
    ],
};