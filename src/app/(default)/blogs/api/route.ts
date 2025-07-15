import { db } from "@/utils/db";
import { BLOGSERIALIZER } from "@/utils/serializers";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const page = parseInt(url.searchParams.get("page") ?? "1");

  const limit = parseInt(url.searchParams.get("limit") ?? "20");

  const search = url.searchParams.get("search")?.toLowerCase() ?? "";

  const sortBy = url.searchParams.get("sortBy") ?? "created_at";
  const order = (url.searchParams.get("order") ?? "desc") as Prisma.SortOrder;

  const skip = (page - 1) * limit;

  // Construct the where clause for search
  const whereClause: Prisma.BlogWhereInput = {
    OR: [
      { tags: { has: search } },
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ],
  };

  // Fetch blogs and total count in parallel
  const [blogs, total] = await Promise.all([
    db.blog.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy:
        sortBy === "views"
          ? {
              views: { _count: order },
            }
          : [{ created_at: order }, { updated_at: order }],
      include: {
        _count: {
          select: {
            views: true,
          },
        },
      },
    }),
    db.blog.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({ blogs: BLOGSERIALIZER(blogs), totalPages });
}
