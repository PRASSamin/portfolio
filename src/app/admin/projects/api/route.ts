import { NextResponse, NextRequest } from "next/server";
import { db } from "@/utils/db";
import { RawProjectType } from "@/types";
import { slugify } from "@/utils/slugify";

// ====== DELETE EXISTING PROJECT(S) ======
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("id");

    if (!ids || ids.length === 0) {
      console.warn("[Project:DELETE] No project ID(s) provided in query.");
      return NextResponse.json(
        { error: "At least one project ID is required." },
        { status: 400 }
      );
    }

    const projectIds = ids
      .map((id) => {
        const parsed = Number(id);
        return isNaN(parsed) ? null : parsed;
      })
      .filter((id): id is number => id !== null);

    if (projectIds.length === 0) {
      console.warn("[Project:DELETE] All provided project IDs are invalid.");
      return NextResponse.json(
        { error: "No valid project IDs provided." },
        { status: 400 }
      );
    }

    const deletedProjects = await db.project.deleteMany({
      where: { id: { in: projectIds } },
    });

    console.info(
      `[Project:DELETE] Successfully deleted ${
        deletedProjects.count
      } project(s): ${projectIds.join(", ")}`
    );

    return NextResponse.json(
      {
        message: `Successfully deleted ${deletedProjects.count} project(s).`,
        count: deletedProjects.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Project:DELETE] Error deleting project(s):", error);
    return NextResponse.json(
      { error: "Internal server error. Could not delete project(s)." },
      { status: 500 }
    );
  }
}

// ====== UPDATE EXISTING PROJECT ======
export async function PUT(request: NextRequest) {
  try {
    const body: RawProjectType = await request.json();
    const {
      title,
      description,
      image,
      github,
      live,
      category,
      tools,
      content,
    } = body;

    const projectId = request.headers.get("x-project-id");

    if (!projectId) {
      console.warn("[Project:PUT] Missing 'x-project-id' in request headers.");
      return NextResponse.json(
        {
          error:
            "Project ID is required. Please provide it in the 'x-project-id' header.",
        },
        { status: 400 }
      );
    }

    const requiredKeys = [
      "title",
      "image",
      "category",
    ] as (keyof RawProjectType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);

    if (missingKey) {
      console.warn(`[Project:PUT] Missing required field: ${missingKey}`);
      return NextResponse.json(
        { error: `${missingKey} is required.` },
        { status: 400 }
      );
    }

    const updatedProject = await db.project.update({
      where: { id: Number(projectId) },
      data: {
        title,
        description,
        image,
        github: github || "",
        live: live || "",
        category,
        tools: tools || [],
        content: content || "",
      },
    });

    console.info(`[Project:PUT] Project ID ${projectId} updated successfully.`);

    return NextResponse.json(
      { message: "Project updated successfully.", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Project:PUT] Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error. Could not update project." },
      { status: 500 }
    );
  }
}

// ====== CREATE NEW PROJECT ======
export async function POST(request: NextRequest) {
  try {
    const body: RawProjectType = await request.json();
    const {
      title,
      description,
      image,
      github,
      live,
      category,
      tools,
      content,
    } = body;

    const requiredKeys = [
      "title",
      "image",
      "category",
    ] as (keyof RawProjectType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);

    if (missingKey) {
      console.warn(`[Project:POST] Missing required field: ${missingKey}`);
      return NextResponse.json(
        { error: `${missingKey} is required.` },
        { status: 400 }
      );
    }

    const projectData = await db.project.create({
      data: {
        title,
        slug: slugify(title),
        description: description || "",
        image,
        github: github || "",
        live: live || "",
        category,
        tools: tools || [],
        content: content || "",
      },
    });

    console.info(
      `[Project:POST] Project created successfully: ${projectData.title} (ID: ${projectData.id})`
    );

    return NextResponse.json(
      { message: "Project created successfully.", project: projectData },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Project:POST] Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error. Could not create project." },
      { status: 500 }
    );
  }
}
