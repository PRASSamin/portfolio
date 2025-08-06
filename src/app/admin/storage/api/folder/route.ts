import cloudinary from "@/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  if (!path) {
    return NextResponse.json(
      { error: "Missing required parameter: 'path'." },
      { status: 400 }
    );
  }
  try {
    await cloudinary.api.create_folder(path);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cloudinary API Error:", error);
    return NextResponse.json(
      { error: "Failed to create Cloudinary folder." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json(
      { error: "Missing required parameter: 'path'." },
      { status: 400 }
    );
  }

  try {
    await cloudinary.api.delete_folder(path);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cloudinary API Error:", error);
    return NextResponse.json(
      { error: error?.error?.message || "Failed to delete the folder." },
      { status: error?.error?.http_code || 500 }
    );
  }
}
