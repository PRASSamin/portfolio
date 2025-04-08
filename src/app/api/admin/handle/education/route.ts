import { EducationType } from "@/types";
import { db } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const idParam = url.searchParams.get("id");

  if (!idParam) {
    console.warn("[Education:DELETE] Missing 'id' query parameter.");
    return NextResponse.json(
      { error: "Education ID is required." },
      { status: 400 }
    );
  }

  const id = Number(idParam);
  if (isNaN(id)) {
    console.warn(`[Education:DELETE] Invalid 'id' value: "${idParam}"`);
    return NextResponse.json(
      { error: "Invalid education ID." },
      { status: 400 }
    );
  }

  try {
    const deletedEducation = await db.education.delete({
      where: { id },
    });

    console.info(
      `[Education:DELETE] Successfully removed education record: ${deletedEducation.degree} (ID: ${id})`
    );

    return NextResponse.json(
      {
        message: `Successfully deleted education entry for ${deletedEducation.degree}.`,
        deleted: deletedEducation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `[Education:DELETE] Failed to delete education with ID ${id}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to delete education entry. Please try again later." },
      { status: 500 }
    );
  }
}

// PUT /api/handle/education (Header: x-education-id)
export async function PUT(request: NextRequest) {
  try {
    const body: EducationType = await request.json();
    const { school, degree, start, field, end, description } = body;

    const id = request.headers.get("x-education-id");
    if (!id) {
      console.warn(
        "[Education:PUT] Missing required header: 'x-education-id'."
      );
      return NextResponse.json(
        {
          error:
            "Education ID is required in the request header 'x-education-id'.",
        },
        { status: 400 }
      );
    }

    const requiredKeys = [
      "school",
      "degree",
      "start",
      "field",
    ] as (keyof EducationType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);
    if (missingKey) {
      console.warn(
        `[Education:PUT] Missing required field: '${missingKey}' in request body.`
      );
      return NextResponse.json(
        { error: `${missingKey} is required.` },
        { status: 400 }
      );
    }

    const updatedEdu = {
      school,
      degree,
      start,
      end,
      field,
      description,
    };

    const updatedEducationData = await db.education.update({
      where: { id: Number(id) },
      data: updatedEdu,
    });

    console.info(
      `[Education:PUT] Education record (ID: ${id}) updated successfully`
    );

    return NextResponse.json(
      {
        message: `Education entry updated successfully for ${degree}.`,
        Education: updatedEducationData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "[Education:PUT] Unexpected error occurred during update:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
// POST /api/handle/education
export async function POST(request: NextRequest) {
  try {
    const body: EducationType = await request.json();
    const { school, degree, start, field, end, description } = body;

    const requiredKeys = [
      "school",
      "degree",
      "start",
      "field",
    ] as (keyof EducationType)[];
    const missingKey = requiredKeys.find((key) => !body[key]);
    if (missingKey) {
      console.warn(
        `[Education:POST] Missing required field '${missingKey}' in request body.`
      );
      return NextResponse.json(
        { error: `${missingKey} is required.` },
        { status: 400 }
      );
    }

    const educationData = await db.education.create({
      data: {
        school,
        degree,
        start,
        end,
        field,
        description,
      },
    });

    console.info(
      `[Education:POST] Education record created successfully — Degree: ${educationData.degree}, School: ${educationData.school}, ID: ${educationData.id}`
    );

    return NextResponse.json(
      {
        message: `Education entry for ${educationData.degree} at ${educationData.school} added successfully.`,
        education: educationData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "[Education:POST] Failed to create education entry:",
      error
    );
    return NextResponse.json(
      { error: "Failed to create education entry. Please try again later." },
      { status: 500 }
    );
  }
}