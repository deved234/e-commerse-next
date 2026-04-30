import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file");
        const folder = formData.get("folder") || "general";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: `shopzone/${folder}`,
                        transformation: [
                            { width: 1200, height: 1200, crop: "limit" },
                            { quality: "auto", fetch_format: "auto" },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}