import { db } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    const where: any = {};
    if (id) where.id = id;
    if (username) where.username = username;
    if (email) where.email = email;
    if (role) where.role = role;

    const users = await db.user.findMany({
      where: where,
      omit: {
        public_metadata: true,
      },
    });

    if (!users.length) {
      return NextResponse.json(
        { message: "No users found", users: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.headers.get("x-user-id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "User ID is required. Please include it in the request header x-user-id",
        },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/auth/user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.headers.get("x-user-id");
    if (!id) {
      return NextResponse.json(
        {
          error:
            "User ID is required. Please include it in the request header x-user-id",
        },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/auth/user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
