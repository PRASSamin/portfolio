import { db } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "20");
  const search = url.searchParams.get("search")?.toLowerCase() ?? "";

  const skip = (page - 1) * limit;

  const [users] = await Promise.all([
    db.user.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          { full_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { created_at: "desc" },
      include: { connected_accounts: true },
    }),
  ]);

  return NextResponse.json({ users });
}
