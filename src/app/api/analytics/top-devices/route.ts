import { fetchReport } from "@/utils/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const report = await fetchReport({
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
    });

    const devices =
      report.rows?.map((row) => ({
        device: row.dimensionValues?.[0]?.value,
        users: row.metricValues?.[0]?.value,
      })) || [];

    return NextResponse.json({ devices });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch top devices" },
      { status: 500 }
    );
  }
}
