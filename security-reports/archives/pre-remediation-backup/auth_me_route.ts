import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email query parameter is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const userRes = await query(
      `SELECT 
        u.id, 
        u.email, 
        u.phone,
        u.role, 
        u.is_active, 
        u.email_verified,
        u.last_login_at,
        u.created_at,
        m.name AS member_name,
        m.avatar_url,
        m.degree,
        m.graduation_year,
        m.company,
        m.role AS member_job_role
      FROM users u
      LEFT JOIN members m ON (m.user_id = u.id OR LOWER(m.email) = LOWER(u.email))
      WHERE LOWER(u.email) = LOWER($1)
      LIMIT 1;`,
      [cleanEmail]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const user = userRes.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.is_active,
        name: user.member_name || user.email.split("@")[0],
        avatarUrl: user.avatar_url,
        degree: user.degree,
        graduationYear: user.graduation_year,
        company: user.company,
        jobRole: user.member_job_role,
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at,
      },
    });
  } catch (error: any) {
    console.error("API /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch user profile." },
      { status: 500 }
    );
  }
}
