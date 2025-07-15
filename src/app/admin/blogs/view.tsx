"use client";
import { BlogType } from "@/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuickActionsBar from "@/components/ui/quick-actions-bar";
import BlogCardView from "./components/BlogCardView";
import EditBlog from "./components/EditBlog";
import AddBlog from "./components/AddBlog";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Trash2 } from "lucide-react";
import DeleteBlog from "./components/DeleteBlog";
import { cn } from "@/utils";
import Link from "next/link";

const AdminBlogView: React.FC<{ blogs: BlogType[] }> = ({ blogs }) => {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 relative">
      {blogs.map((blog) => (
        <ContextMenu key={blog.id}>
          <ContextMenuTrigger>
            <BlogCardView
              blog={blog}
              selected={selected}
              setSelected={setSelected}
            />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel inset>Actions</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup>
              <ContextMenuItem asChild>
                <Link
                  href={"/blogs/" + blog.slug}
                  className="gap-2 group  flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent hover:bg-muted cursor-pointer w-full"
                >
                  <Eye
                    size={18}
                    className="group-hover:text-yellow-400 transition-all duration-300"
                  />
                  View
                </Link>
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <EditBlog
                  blog={blog}
                  onUpdate={(updated) => updated && router.refresh()}
                />
              </ContextMenuItem>

              <ContextMenuItem asChild>
                <DeleteBlog blogs={blogs} ids={new Set([blog.id])}>
                  <button className="gap-2 group flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent hover:bg-muted cursor-pointer w-full">
                    <Trash2
                      size={18}
                      className="group-hover:text-red-500 transition-all duration-300"
                    />
                    Delete
                  </button>
                </DeleteBlog>
              </ContextMenuItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      ))}

      <QuickActionsBar
        verticalAlignment="bottom"
        horizontalAlignment="center"
        side="left"
        className="px-3.5 py-2 rounded-lg flex items-center gap-10"
        excludeWidth={{ md: 260, lg: 320, default: 80 }}
      >
        {/* Page Title */}
        <h1 className="text-lg font-semibold text-white select-none">Blogs</h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <AddBlog onAdded={() => router.refresh()}>
            <Button
              variant="outline"
              size="icon"
              className="bg-muted-foreground/20 hover:bg-muted-foreground/30 text-white aspect-square p-0 border-0"
            >
              <Plus size={20} />
            </Button>
          </AddBlog>
          <DeleteBlog blogs={blogs} ids={selected} setIds={setSelected}>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "text-white p-0 aspect-square border-0",
                selected.size > 0
                  ? "bg-red-500/70 hover:bg-red-500/90"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/30"
              )}
              disabled={selected.size === 0}
            >
              <Trash2 size={20} />
            </Button>
          </DeleteBlog>
        </div>
      </QuickActionsBar>
    </div>
  );
};

export default AdminBlogView;
