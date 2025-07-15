import { ExperienceType } from "@/types";
import { db } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/handle/experience
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const idParam = url.searchParams.get("id");

  if (!idParam) {
    console.warn(
      "[Experience:DELETE] Request missing required query parameter: 'id'."
    );
    return NextResponse.json(
      { error: "Missing required parameter: 'id'." },
      { status: 400 }
    );
  }

  const id = Number(idParam);
  if (isNaN(id)) {
    console.warn(
      `[Experience:DELETE] Invalid 'id' value received: "${idParam}". Must be a number.`
    );
    return NextResponse.json(
      { error: "Invalid 'id' value. It must be a number." },
      { status: 400 }
    );
  }

  try {
    const deletedExp = await db.experience.delete({
      where: { id },
    });

    console.info(
      `[Experience:DELETE] Experience successfully deleted: Role: ${deletedExp.role}, Company: ${deletedExp.company}, ID: ${deletedExp.id}`
    );

    return NextResponse.json(
      {
        message: `Experience at ${deletedExp.company} has been deleted.`,
        deleted: deletedExp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `[Experience:DELETE] Error while attempting to delete experience (ID: ${id}):`,
      error
    );
    return NextResponse.json(
      {
        error:
          "An error occurred while trying to delete the experience. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// PUT /api/handle/experience (Header: x-exp-id)
export async function PUT(request: NextRequest) {
  try {
    const body: ExperienceType = await request.json();
    const { company, role, description, start, end } = body;

    const id = request.headers.get("x-exp-id");
    if (!id) {
      console.warn(
        "[Experience:PUT] Request is missing the required header: 'x-exp-id'."
      );
      return NextResponse.json(
        {
          error:
            "Missing required header: 'x-exp-id'. Please include the experience ID.",
        },
        { status: 400 }
      );
    }

    const requiredKeys = [
      "company",
      "role",
      "start",
    ] as (keyof ExperienceType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);
    if (missingKey) {
      console.warn(
        `[Experience:PUT] Missing required field in request body: '${missingKey}'.`
      );
      return NextResponse.json(
        { error: `Missing required field: '${missingKey}'.` },
        { status: 400 }
      );
    }

    const updatedExpData = await db.experience.update({
      where: { id: Number(id) },
      data: {
        company,
        role,
        start,
        end,
        description: description || "",
      },
    });

    console.info(
      `[Experience:PUT] Experience updated successfully — Company: ${company}, Role: ${role}, ID: ${id}`
    );

    return NextResponse.json(
      {
        message: `Experience at ${company} has been updated successfully.`,
        experience: updatedExpData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Experience:PUT] Failed to update experience entry:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while updating the experience. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// POST /api/handle/experience
export async function POST(request: NextRequest) {
  try {
    const body: ExperienceType = await request.json();
    const { company, role, start, end, description } = body;

    const requiredKeys = [
      "company",
      "role",
      "start",
    ] as (keyof ExperienceType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);
    if (missingKey) {
      console.warn(
        `[Experience:POST] Missing required field in request body: '${missingKey}'.`
      );
      return NextResponse.json(
        { error: `The field '${missingKey}' is required.` },
        { status: 400 }
      );
    }

    const experienceData = await db.experience.create({
      data: {
        company,
        role,
        start,
        end,
        description: description || "",
      },
    });

    console.info(
      `[Experience:POST] Successfully created experience entry — Role: ${experienceData.role}, Company: ${experienceData.company}, ID: ${experienceData.id}`
    );

    return NextResponse.json(
      {
        message: `Experience for ${experienceData.role} at ${experienceData.company} has been created successfully.`,
        experience: experienceData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "[Experience:POST] An unexpected error occurred while creating experience:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
