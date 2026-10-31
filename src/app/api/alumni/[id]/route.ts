import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const memberId = parseInt(id, 10);

    if (isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const res = await query(
      `SELECT 
        id, name, email, phone, degree, graduation_year, department_id,
        department_name, department_short, company, role, industry,
        location, experience_years, linkedin_url, bio, avatar_url,
        verified, institute, skills, achievements, created_at
      FROM v_member_directory
      WHERE id = $1`,
      [memberId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    const r = res.rows[0];
    const member = {
      ...r,
      year: r.graduation_year,
      dept: r.department_short || r.department_name,
      linkedin: r.linkedin_url,
      avatar: r.avatar_url,
      experience: r.experience_years ? String(r.experience_years) : "1",
    };

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error: any) {
    console.error("GET /api/alumni/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
