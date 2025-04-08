import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from "cloudinary";
import { CLOUDINARY_API_SECRET } from "@/constants/env";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const timestamp = searchParams.get('timestamp');
    const publicId = searchParams.get('publicId');
    const folder = searchParams.get('folder');
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            public_id: publicId,
            folder,
        },
        CLOUDINARY_API_SECRET!
    );
    return NextResponse.json({ signature });
}