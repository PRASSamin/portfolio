import cloudinary from "@/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { from, to, type, public_id } = await request.json();
  if (!type) {
    return NextResponse.json(
      { error: "Missing required parameter: 'type'." },
      { status: 400 }
    );
  }
  try {
    if (type === "folder") {
      if (!from || !to) {
        return NextResponse.json(
          { error: "Missing required parameters: 'from' and 'to'." },
          { status: 400 }
        );
      }
      await cloudinary.api.rename_folder(from, to);
    } else {
      if (!public_id || !to) {
        return NextResponse.json(
          { error: "Missing required parameters: 'public_id' and 'to'." },
          { status: 400 }
        );
      }
      await cloudinary.api.update(public_id, { display_name: to });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cloudinary API Error:", error);
    return NextResponse.json({ error: "Failed to rename." }, { status: 500 });
  }
}
