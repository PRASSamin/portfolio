"use client";
import { ProjectType } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import QuickActionsBar from "@/components/ui/quick-actions-bar";
import DeleteProject from "./components/DeleteProject";
import ProjectCardView from "./components/ProjectCardView";
import EditProject from "./components/EditProject";
import { cn } from "@/utils";
import AddProject from "./components/AddProject";
import Link from "next/link";

const AdminProjectView: React.FC<{ projects: ProjectType[] }> = ({
  projects,
}) => {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 relative">
      {projects.map((project) => (
        <ContextMenu key={project.id}>
          <ContextMenuTrigger isLeftClickTrigger>
            <ProjectCardView
              project={project}
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
                  href={"/projects/" + project.slug}
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
                <EditProject
                  project={project}
                  onUpdate={(updated) => updated && router.refresh()}
                />
              </ContextMenuItem>
              <ContextMenuItem asChild>
                <DeleteProject projects={projects} ids={new Set([project.id])}>
                  <button className="gap-2 group flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent hover:bg-muted cursor-pointer w-full">
                    <Trash2
                      size={18}
                      className="group-hover:text-red-500 transition-all duration-300"
                    />
                    Delete
                  </button>
                </DeleteProject>
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
        <h1 className="text-lg font-semibold text-white select-none">
          Projects
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <AddProject onAdded={() => router.refresh()}>
            <Button
              variant="outline"
              size="icon"
              className="bg-muted-foreground/20 hover:bg-muted-foreground/30 text-white aspect-square p-0 border-0"
            >
              <Plus size={20} />
            </Button>
          </AddProject>
          <DeleteProject
            projects={projects}
            ids={selected}
            setIds={setSelected}
          >
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
          </DeleteProject>
        </div>
      </QuickActionsBar>
    </div>
  );
};

export default AdminProjectView;
