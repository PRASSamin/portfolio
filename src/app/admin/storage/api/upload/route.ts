import { CLOUDINARY_API_SECRET } from "@/constants/env";
import cloudinary from "@/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { paramsToSign } = body;

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      CLOUDINARY_API_SECRET
    );
    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary API Error:", error);
    return NextResponse.json(
      { error: "Failed to sign request." },
      { status: 500 }
    );
  }
}
