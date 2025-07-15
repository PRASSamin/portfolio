import { db } from "@/utils/db";
import { PROJECTSERIALIZER } from "@/utils/serializers";
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

  // Fetch projects and total count in parallel
  const [projects, total] = await Promise.all([
    db.project.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          { category: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
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
    db.project.count({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    projects: PROJECTSERIALIZER(projects),
    totalPages,
  });
}
