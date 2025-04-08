import { NextResponse, NextRequest } from "next/server";
import { db } from "@/utils/db";
import { BlogType } from "@/types";
import { slugify } from "@/utils/slugify";

// DELETE /api/handle/blog?id=1&id=2
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("id");

    if (!ids || ids.length === 0) {
      console.warn("[Blog:DELETE] No 'id' query parameters provided.");
      return NextResponse.json(
        { error: "At least one Blog ID is required." },
        { status: 400 }
      );
    }

    const blogIds = ids
      .map((id) => {
        const parsed = Number(id);
        return isNaN(parsed) ? null : parsed;
      })
      .filter((id): id is number => id !== null);

    if (blogIds.length === 0) {
      console.warn("[Blog:DELETE] All provided IDs were invalid.");
      return NextResponse.json(
        { error: "No valid Blog IDs provided." },
        { status: 400 }
      );
    }

    const deletedBlogs = await db.blog.deleteMany({
      where: {
        id: {
          in: blogIds,
        },
      },
    });

    console.info(
      `[Blog:DELETE] Successfully deleted ${
        deletedBlogs.count
      } blog(s). IDs: [${blogIds.join(", ")}]`
    );

    return NextResponse.json(
      {
        message: `Successfully deleted ${deletedBlogs.count} blog(s).`,
        count: deletedBlogs.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Blog:DELETE] Error deleting blog(s):", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

// PUT /api/handle/blog (Header: x-blog-id)
export async function PUT(request: NextRequest) {
  try {
    const body: BlogType = await request.json();
    const { title, description, tags, thumbnail, content } = body;

    const id = request.headers.get("x-blog-id");
    if (!id) {
      console.warn("[Blog:PUT] Missing 'x-blog-id' header.");
      return NextResponse.json(
        {
          error: "Blog ID is required in the request header 'x-blog-id'.",
        },
        { status: 400 }
      );
    }

    const requiredKeys = ["title", "thumbnail"] as (keyof BlogType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);
    if (missingKey) {
      console.warn(`[Blog:PUT] Missing required field: ${missingKey}`);
      return NextResponse.json(
        { error: `${missingKey} is required.` },
        { status: 400 }
      );
    }

    const updatedBlog: Partial<BlogType> = {
      title,
      description,
      thumbnail,
      tags: tags || [],
      content: content || "",
    };

    const updatedBlogData = await db.blog.update({
      where: { id: Number(id) },
      data: updatedBlog,
    });

    console.info(`[Blog:PUT] Successfully updated blog ID: ${id}`);

    return NextResponse.json(
      { message: "Blog updated successfully.", blog: updatedBlogData },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Blog:PUT] Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// POST /api/handle/blog
export async function POST(request: NextRequest) {
  try {
    const body: BlogType = await request.json();
    const { title, description, thumbnail, tags, content } = body;

    const requiredKeys = ["title", "thumbnail"] as (keyof BlogType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);
    if (missingKey) {
      console.warn(`[Blog:POST] Missing required field: ${missingKey}`);
      return NextResponse.json(
        { error: `${missingKey} is required.` },
        { status: 400 }
      );
    }

    const blogData = await db.blog.create({
      data: {
        title,
        slug: slugify(title),
        description: description || "",
        thumbnail,
        tags: tags || [],
        content: content || "",
      },
    });

    console.info(`[Blog:POST] Created blog "${title}" (ID: ${blogData.id})`);

    return NextResponse.json(
      { message: "Blog created successfully.", blog: blogData },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Blog:POST] Error creating blog:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
