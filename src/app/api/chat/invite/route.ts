import { NextRequest, NextResponse } from "next/server";
import { InviteTokenGenerator } from "./handlers";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const { status, success, id, message } = await InviteTokenGenerator(token);
  if (status === 200) {
    return NextResponse.json({ success, id }, { status });
  } else {
    return NextResponse.json({ success, message }, { status });
  }
}
