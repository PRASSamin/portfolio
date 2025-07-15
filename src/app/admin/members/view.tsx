"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils";
import { Editor } from "@monaco-editor/react";
import { Loader2, Search } from "lucide-react";
import { BetterImage } from "@prass/betterimage/components";
import { debounce } from "@/utils/debounce";

const LIMIT = 20;

const AdminMembersView = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLUListElement>(null);

  const fetchMembers = useCallback(
    async (pageToFetch: number, isSearch = false) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${window.location.pathname}/api`, {
          params: { limit: LIMIT, page: pageToFetch, search },
        });

        if (isSearch) {
          setMembers(data.users);
        } else {
          setMembers((prev) => [...prev, ...data.users]);
        }

        setHasMore(data.users.length === LIMIT);
        setPage((prev) => prev + 1);
      } catch (err) {
        console.error("Failed to fetch members", err);
      } finally {
        setIsLoading(false);
      }
    },
    [search, isLoading, hasMore]
  );

  useEffect(() => {
    fetchMembers(1, true);
  }, [search]);

  const handleScroll = debounce(() => {
    const container = containerRef.current;
    if (!container || isLoading || !hasMore) return;

    const scrollPosition = container.scrollTop + container.clientHeight;
    const threshold = container.scrollHeight - 100;

    if (scrollPosition >= threshold) {
      fetchMembers(page);
    }
  }, 300);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="space-y-6 scrollbar-show">
      <div className="flex items-center justify-between gap-2">
        <div className="relative">
          <Search
            size={20}
            className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-2"
          />
          <Input
            placeholder="Search member by name or email..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm pl-9 focus-visible:ring-2  transition-all duration-300"
          />
        </div>
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <ul
        ref={containerRef}
        className="space-y-3 overflow-y-auto pr-1 max-h-[calc(100vh-66px-64px-24px)] p-1 rounded-md scrollbar-show"
      >
        {members.map((member) => (
          <Dialog key={member.id}>
            <DialogTrigger asChild>
              <li className="flex items-start justify-between border-b border-muted py-2 cursor-pointer group hover:bg-muted/30 rounded-md transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12">
                    <BetterImage
                      src={member.avatar || ""}
                      alt={member.full_name || ""}
                      width={100}
                      height={100}
                      className="w-12 h-12 rounded-full"
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
    </div>
  );
};

export default AdminMembersView;
