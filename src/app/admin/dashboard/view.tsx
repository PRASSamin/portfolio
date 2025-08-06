"use client";
import * as React from "react";
import BasicRowView from "./components/BasicRow";
import { AnalyticsChart } from "./components/AnalyticsChart";

type Data = {
  slug: string;
  url: string;
  title: string;
  views: number;
};

const AdminDashboardView = ({
  totalViews,
  blogViews,
  projectViews
}: {
  totalViews: number;
  blogViews: Data[];
  projectViews: Data[];
}) => {
  return (
    <div className="space-y-5">
      <BasicRowView totalViews={totalViews} />

      <AnalyticsChart
        data={blogViews}
        color="hsl(var(--chart-2))"
        title="Blog Analytics"
        description="Showing total views of all blogs"
      />
      <AnalyticsChart
        data={projectViews}
        color="hsl(var(--chart-5))"
        title="Project Analytics"
        description="Showing total views of all projects"
      />
    </div>
  );
};

export default AdminDashboardView;
