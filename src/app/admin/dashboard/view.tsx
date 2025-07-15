"use client";

import { useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import BasicRowView from "./components/BasicRow";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type BlogViewData = {
  id: number;
  title: string;
  views: number;
};

const BlogAnalytics = ({ data }: { data: BlogViewData[] }) => {
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");

  // Optional: short title for X-axis
  const displayData = data.map((d, i) => ({
    ...d,
    index: i + 1,
    shortTitle: d.title.length > 20 ? d.title.slice(0, 20) + "…" : d.title,
  }));

  const chartConfig = {
    views: { color: "#6366f1" },
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">📈 Blog Views Analytics</h2>
        <div className="space-x-2">
          <Button
            variant={viewMode === "graph" ? "default" : "outline"}
            onClick={() => setViewMode("graph")}
          >
            Graph View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
        </div>
      </div>

      {viewMode === "graph" ? (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={displayData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent className="w-[150px]" nameKey="title" />
              }
            />
            <Bar dataKey={"views"} fill={`#6366f1`} />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="overflow-auto max-h-[500px] border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Views</th>
              </tr>
            </thead>
            <tbody>
              {data.map((blog) => (
                <tr
                  key={blog.id}
                  className="hover:bg-muted/50 border-b last:border-none"
                >
                  <td className="p-2">{blog.title}</td>
                  <td className="p-2">{blog.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminDashboardView = ({
  totalMembers,
  recentMembers,
  blogViews,
}: {
  totalMembers: number;
  recentMembers: any[];
  blogViews: BlogViewData[];
}) => {
  return (
    <div className="space-y-10">
      <BasicRowView recentMembers={recentMembers} totalMembers={totalMembers} />

      <BlogAnalytics data={blogViews} />
    </div>
  );
};

export default AdminDashboardView;
