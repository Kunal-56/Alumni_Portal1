import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const requestedEmail = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();
    const isSelf = !requestedEmail || requestedEmail === session.email.toLowerCase();
    if (!isSelf && session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }

    const targetEmail = requestedEmail || session.email;
    const userRes = await query(
      `SELECT u.id, u.email, u.phone, u.role, u.is_active, u.email_verified,
        u.last_login_at, u.created_at, m.name AS member_name, m.avatar_url,
        m.degree, m.graduation_year, m.company, m.role AS member_job_role
       FROM users u
       LEFT JOIN members m ON m.user_id = u.id
       WHERE LOWER(u.email) = LOWER($1)
       LIMIT 1`,
      [targetEmail]
    );

    if (!userRes.rows[0]) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const user = userRes.rows[0];
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.is_active,
          emailVerified: user.email_verified,
          name: user.member_name || user.email.split("@")[0],
          avatarUrl: user.avatar_url,
          degree: user.degree,
          graduationYear: user.graduation_year,
          company: user.company,
          jobRole: user.member_job_role,
          lastLoginAt: user.last_login_at,
          createdAt: user.created_at,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("API /api/auth/me failed:", { code: (error as { code?: string })?.code });
    return NextResponse.json({ success: false, message: "Failed to fetch user profile." }, { status: 500 });
  }
}
