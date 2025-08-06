"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "@/hooks/useRouter";

type Data = {
  slug: string;
  url: string;
  title: string;
  views: number;
};

export const AnalyticsChart = ({
  data,
  color,
  title,
  description,
}: {
  data: Data[];
  color: string;
  title: string;
  description: string;
}) => {
  const displayData = data.map((d, i) => ({
    ...d,
    index: i + 1,
    shortTitle: d.title.length > 20 ? d.title.slice(0, 20) + "…" : d.title,
  }));
  const router = useRouter();
  const [vw, setVw] = React.useState(0);
  const [activeMode, setActiveMode] = React.useState<
    "graph" | "table" | string
  >("graph");

  React.useEffect(() => {
    const set = () => setVw(window.innerWidth);
    window.addEventListener("resize", set);
    return () => {
      window.removeEventListener("resize", set);
    };
  }, []);

  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.views, 0),
    [data]
  );

  return (
    <Card className="py-0 bg-muted/50">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex even:border-l sm:border-t-0 sm:border-l flex-col-reverse">
          <div className="flex">
            {["graph", "table"].map((key) => {
              return (
                <button
                  key={key}
                  data-active={activeMode === key}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-8 py-3 text-left even:border-l cursor-pointer"
                  onClick={() => setActiveMode(key)}
                >
                  <span className="text-muted-foreground text-xs capitalize">
                    {key}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="leading-none font-bold text-3xl py-4 text-center px-2">
            {total.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 py-6 sm:px-6">
        {activeMode === "graph" ? (
          <ChartContainer
            config={{
              views: {
                label: "Views",
                color: color,
              },
            }}
            className="aspect-auto h-[300px] w-full"
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
                tickFormatter={(value) => {
                  if (vw < 640 && displayData.length < 5) return value;
                  if (vw < 768 && displayData.length < 6) return value;
                  if (vw < 1024 && displayData.length < 7) return value;
                  if (vw < 1280 && displayData.length < 8) return value;
                  if (vw < 1536 && displayData.length < 9) return value;
                  return value.slice(0, 10) + "…";
                }}
              />
              <YAxis
                allowDecimals={false}
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
              <Bar dataKey={"views"} fill={color} radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-800 table table-fixed w-full">
              <TableRow>
                <TableHead className="w-[100px]">Title</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="h-[257px] block  overflow-auto w-full scrollbar-auto">
              {data.map(({ title, views, url }) => {
                return (
                  <TableRow
                    onClick={() => router.push(url)}
                    className="table table-fixed w-full cursor-pointer"
                    key={title}
                  >
                    <TableCell className="text-zinc-300">{title}</TableCell>
                    <TableCell className="text-right">{views || 0}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
