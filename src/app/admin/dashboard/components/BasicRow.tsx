"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types";
import { formatDate } from "@/utils";
import { Editor } from "@monaco-editor/react";
import { BetterImage } from "@prass/betterimage/components";
import { ArrowUpRight, Loader2, Users } from "lucide-react";
import Link from "next/link";

const BasicRowView = ({
  totalMembers,
  recentMembers,
}: {
  totalMembers: number;
  recentMembers: Omit<User, "connected_account">[];
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Members Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
            Total Members
          </h3>
          <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="text-4xl font-bold text-zinc-900 dark:text-white">
          {totalMembers}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Pulled from live database
        </p>
      </div>

      {/* Vercel Analytics Redirect Card */}
      <Link
        href="https://vercel.com/your-username/your-project/analytics"
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <div className="bg-gradient-to-br from-black to-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 h-full flex flex-col justify-between">
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

      {/* Recent Members Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-6 shadow-sm sm:col-span-2 lg:col-span-2 flex flex-col h-56">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
            Recently Registered Members
          </h3>
          <Link
            href="/admin/members"
            className="text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline"
          >
            View All
          </Link>
        </div>
        {recentMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground h-full w-full flex items-center justify-center">
            No recent members found.
          </p>
        ) : (
          <ul className="space-y-3 overflow-y-auto max-h-60 pr-1">
            {recentMembers.map((member) => (
              <Dialog key={member.id}>
                <DialogTrigger asChild>
                  <li className="flex items-start justify-between border-b border-muted py-2 cursor-pointer group hover:bg-muted/30 rounded-md transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10">
                        <BetterImage
                          src={member.avatar || ""}
                          alt={member.full_name || ""}
                          width={100}
                          height={100}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white group-hover:underline">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(member.created_at, "")}
                    </span>
                  </li>
                </DialogTrigger>
                <DialogContent className="h-[90vh] max-w-[90vw] p-0 overflow-hidden border shadow-xl ring-4 ring-muted/50 rounded-xl">
                  <div className="flex flex-col h-full">
                    <div className="px-6 py-4 flex flex-col items-center justify-center">
                      <DialogTitle className="text-lg font-semibold">
                        {member.full_name}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <div className="p-4 pt-1 w-full h-full">
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        theme="vs-dark"
                        loading={<Loader2 className="animate-spin" />}
                        value={JSON.stringify(member, null, 2)}
                        options={{
                          readOnly: true,
                          fontSize: 14,
                          tabSize: 2,
                          wordWrap: "on",
                          minimap: { enabled: false },
                          scrollbar: {
                            verticalScrollbarSize: 6,
                            horizontalScrollbarSize: 6,
                          },
                        }}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BasicRowView;
