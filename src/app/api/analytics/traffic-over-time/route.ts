import { fetchReport } from "@/utils/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const period = url.searchParams.get("period");
  let dimensionName = "date";

  switch (period) {
    case "monthly":
      dimensionName = "month";
      break;
    case "quarterly":
      dimensionName = "quarter";
      break;
    case "yearly":
      dimensionName = "year";
      break;
    default:
      dimensionName = "date";
  }

  try {
    const report = await fetchReport({
      dimensions: [{ name: dimensionName }],
      metrics: [{ name: "activeUsers" }],
      startDate: "365daysAgo",
      endDate: "today",
    });

    const traffic =
      report.rows?.map((row) => ({
        period: row.dimensionValues?.[0]?.value,
        users: row.metricValues?.[0]?.value,
      })) || [];

    return NextResponse.json({ traffic });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch traffic data" },
      { status: 500 }
    );
  }
}
