import { fetchReport } from "@/utils/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const report = await fetchReport({
      metrics: [{ name: "activeUsers" }],
      dimensions: [],
    });

    const totalUsers = report.rows?.[0]?.metricValues?.[0]?.value || "0";

    return NextResponse.json({ totalUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch total users" },
      { status: 500 }
    );
  }
}
