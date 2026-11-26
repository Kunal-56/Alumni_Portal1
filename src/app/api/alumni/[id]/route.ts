import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser, isAuthorizedAdmin } from "@/lib/auth";
import { presentDirectoryContact } from "@/lib/contactPrivacy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAuthorizedAdmin(request);
    const currentUser = isAdmin ? null : await getAuthenticatedUser(request);
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
        v.id, v.name, v.email, v.phone, v.degree, v.graduation_year, v.department_id,
        v.department_name, v.department_short, v.company, v.role, v.industry,
        v.location, v.experience_years, v.linkedin_url, v.bio, v.avatar_url,
        v.verified, v.institute, v.skills, v.achievements, v.created_at,
        m.dob, m.gender, m.verification_method
      FROM v_member_directory v
      LEFT JOIN members m ON m.id = v.id
      WHERE v.id = $1 AND (
        $2::boolean OR v.verified = true OR
        (v.user_id = $3 AND m.dob IS NOT NULL AND m.gender IS NOT NULL AND m.bio IS NOT NULL AND m.department_id IS NOT NULL AND m.company IS NOT NULL AND m.role IS NOT NULL)
      )`,
      [memberId, isAdmin, currentUser?.id || null]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    const r = res.rows[0];
    const member = {
      ...presentDirectoryContact(r, isAdmin),
      year: r.graduation_year,
      dept: r.department_short || r.department_name,
      linkedin: r.linkedin_url,
      avatar: r.avatar_url,
      experience: r.experience_years ? String(r.experience_years) : "1",
    };

    return NextResponse.json({
      success: true,
      member,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error: any) {
    console.error("GET /api/alumni/[id] failed:", { code: error?.code });
    return NextResponse.json(
      { success: false, error: "Unable to process member request." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorizedAdmin(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrator privileges required to delete a member profile." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const memberId = parseInt(id, 10);

    if (isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const res = await query(
      "DELETE FROM members WHERE id = $1 RETURNING id, name",
      [memberId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Member ${res.rows[0].name} deleted successfully`,
    });
  } catch (error: any) {
    console.error("DELETE /api/alumni/[id] failed:", { code: error?.code });
    return NextResponse.json(
      { success: false, error: "Failed to delete member." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorizedAdmin(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrator privileges required to update member status." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const memberId = parseInt(id, 10);

    if (isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (body.verified !== undefined) {
      await query(
        "UPDATE members SET verified = $1, updated_at = now() WHERE id = $2",
        [Boolean(body.verified), memberId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
    });
  } catch (error: any) {
    console.error("PATCH /api/alumni/[id] failed:", { code: error?.code });
    return NextResponse.json(
      { success: false, error: "Failed to update member." },
      { status: 500 }
    );
  }
}
