import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser, hasSameOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasSameOrigin(request)) {
      return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
    }
    const rate = checkRateLimit(request, "contact-reveal", 30, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many contact requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Sign in to view contact details." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const memberId = Number.parseInt(id, 10);
    if (!Number.isInteger(memberId)) {
      return NextResponse.json({ success: false, error: "Invalid member ID" }, { status: 400 });
    }

    const isAdmin = user.role === "admin";
    const res = await query(
      `SELECT email, phone
       FROM members
       WHERE id = $1 AND ($2::boolean OR verified = true)
       LIMIT 1`,
      [memberId, isAdmin]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        email: res.rows[0].email,
        phone: res.rows[0].phone,
        contactMasked: false,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    console.error("GET /api/alumni/[id]/contact failed:", { code: (error as { code?: string })?.code });
    return NextResponse.json({ success: false, error: "Unable to load contact details." }, { status: 500 });
  }
}
