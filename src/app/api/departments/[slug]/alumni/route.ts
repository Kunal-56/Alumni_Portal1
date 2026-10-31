import { NextRequest, NextResponse } from "next/server";
import { query, getDepartment, createMember } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const department = await getDepartment(slug);

    if (!department) {
      return NextResponse.json(
        { success: false, error: `Department '${slug}' not found` },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const year = searchParams.get("year")?.trim() || searchParams.get("graduation_year")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const offset = (page - 1) * limit;

    let whereClause = "WHERE department_id = $1";
    const params: any[] = [department.id];
    let pIdx = 2;

    if (search) {
      whereClause += ` AND (name ILIKE $${pIdx} OR company ILIKE $${pIdx} OR role ILIKE $${pIdx} OR location ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      pIdx++;
    }

    if (year) {
      whereClause += ` AND graduation_year = $${pIdx}`;
      params.push(year);
      pIdx++;
    }

    // Total count for pagination
    const countQuery = `SELECT count(*) as total FROM v_member_directory ${whereClause}`;
    const countRes = await query(countQuery, params);
    const total = parseInt(countRes.rows[0]?.total || "0", 10);

    // Fetch members with skills and achievements
    const listQuery = `
      SELECT 
        id, name, email, phone, degree, graduation_year, department_id,
        department_name, department_short, company, role, industry,
        location, experience_years, linkedin_url, bio, avatar_url,
        verified, institute, skills, achievements, created_at
      FROM v_member_directory
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${pIdx} OFFSET $${pIdx + 1}
    `;
    params.push(limit, offset);

    const listRes = await query(listQuery, params);

    return NextResponse.json({
      success: true,
      department: {
        id: department.id,
        name: department.name,
        slug: department.slug,
        short_name: department.short_name,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      alumni: listRes.rows,
    });
  } catch (error: any) {
    console.error("GET /api/departments/[slug]/alumni error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const department = await getDepartment(slug);

    if (!department) {
      return NextResponse.json(
        { success: false, error: `Department '${slug}' not found` },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validation
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full Name is required" },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Insert into PostgreSQL database
    const newMember = await createMember({
      name: body.name,
      email: body.email,
      phone: body.phone,
      dob: body.dob,
      gender: body.gender,
      degree: body.degree || "B.Tech",
      graduation_year: String(body.graduation_year || body.year || "2025"),
      department_id: department.id,
      institute: body.institute || "Tolani F. G. Polytechnic",
      company: body.company,
      role: body.role || body.jobTitle,
      industry: body.industry,
      location: body.location,
      experience_years: body.experience_years ? Number(body.experience_years) : undefined,
      linkedin_url: body.linkedin_url || body.linkedin,
      bio: body.bio,
      avatar_url: body.avatar_url || body.avatar || "/avatars/m1.jpg",
      verified: body.verified !== undefined ? Boolean(body.verified) : true,
      verification_method: body.verification_method || "email",
      skills: Array.isArray(body.skills) ? body.skills : [],
      achievements: Array.isArray(body.achievements) ? body.achievements : [],
    });

    // Fetch the updated alumni count for the department (auto-incremented by trigger)
    const updatedDept = await query(
      "SELECT alumni_count FROM departments WHERE id = $1",
      [department.id]
    );

    return NextResponse.json(
      {
        success: true,
        message: `Alumnus '${newMember.name}' successfully added to ${department.name} in PostgreSQL database!`,
        member: newMember,
        department_alumni_count: updatedDept.rows[0]?.alumni_count,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/departments/[slug]/alumni error:", error);
    // Handle unique constraint violation on email
    if (error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "An alumni member with this email or phone already exists in the database.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to store data in database" },
      { status: 500 }
    );
  }
}
