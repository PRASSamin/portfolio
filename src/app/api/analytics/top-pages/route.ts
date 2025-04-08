import { fetchReport } from "@/utils/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const report = await fetchReport({
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      limit: 5,
    });

    const pages =
      report.rows?.map((row) => ({
        path: row.dimensionValues?.[0]?.value,
        views: row.metricValues?.[0]?.value,
      })) || [];

    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top pages" },
      { status: 500 }
    );
  }
}
