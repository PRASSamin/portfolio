import cloudinary from "@/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { getCloudinaryStorage } from "@/utils/get-cloudinary-storage";

export async function GET(request: NextRequest) {
  try {
    const structure = await getCloudinaryStorage("pras/portfolio");
    return NextResponse.json({ structure });
  } catch (error) {
    console.error("Cloudinary API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Cloudinary structure." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const public_id = request.nextUrl.searchParams.get("public_id");
  if (!public_id) {
    return NextResponse.json(
      { error: "Missing required parameter: 'public_id'." },
      { status: 400 }
    );
  }
  try {
    const data = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true, deleted: data });
  } catch (error) {
    console.error("Cloudinary API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete Cloudinary file." },
      { status: 500 }
    );
  }
}
