import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET
    });

    if (pathname.startsWith("/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if (pathname.startsWith("/seller")) {
        if (!token || !["seller", "admin"].includes(token.role)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if (["/profile", "/orders", "/wishlist", "/checkout"].some(p => pathname.startsWith(p))) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

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