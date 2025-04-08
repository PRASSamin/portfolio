import { fetchReport } from "@/utils/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const report = await fetchReport({
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      limit: 5,
    });

    const countries =
      report.rows?.map((row) => ({
        country: row.dimensionValues?.[0]?.value,
        users: row.metricValues?.[0]?.value,
      })) || [];

    return NextResponse.json({ countries });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top countries" },
      { status: 500 }
    );
  }
}
