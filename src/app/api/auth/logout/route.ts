import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, hasSameOrigin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  response.headers.append("Set-Cookie", clearSessionCookie());
  return response;
}
