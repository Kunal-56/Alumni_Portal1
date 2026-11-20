import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    await query("SELECT 1");

    return NextResponse.json({
      status: "healthy",
      database: "connected",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed.",
      },
      { status: 500 }
    );
  }
}
