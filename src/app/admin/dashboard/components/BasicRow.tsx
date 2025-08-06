"use client";
import { ArrowUpRight, Eye } from "lucide-react";
import { Link } from "@/components/Link";

const BasicRowView = ({ totalViews }: { totalViews: number }) => {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Members Card */}
      <div className="bg-muted/50 border rounded-lg p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-zinc-200">
            Total Contents View
          </h3>
          <Eye className="h-5 w-5 text-zinc-400 group-hover:text-white transition-all duration-200" />
        </div>
        <div className="text-4xl font-bold text-white">{totalViews}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Pulled from live database
        </p>
      </div>

      {/* Vercel Analytics Redirect Card */}
      <Link
        href="https://vercel.com/your-username/your-project/analytics" // TODO: Replace with actual URL
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <div className="bg-linear-to-br from-black to-zinc-900 border border-zinc-800/75 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Open Analytics</h3>
            <ArrowUpRight className="h-5 w-5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
          </div>
          <p className="text-zinc-400 text-sm">
            View traffic, performance, and real-time metrics directly on Vercel.
          </p>
          <span className="text-sm mt-4 inline-block text-blue-500 font-medium group-hover:underline">
            Go to Vercel →
          </span>
        </div>
      </Link>
    </div>
  );
};

export default BasicRowView;
