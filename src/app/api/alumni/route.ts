import { NextRequest, NextResponse } from "next/server";
import { query, getDepartment, createMember } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentQuery = searchParams.get("department") || searchParams.get("dept");
    const search = searchParams.get("search")?.trim() || "";
    const year = searchParams.get("year")?.trim() || searchParams.get("graduation_year")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];
    let pIdx = 1;

    if (departmentQuery) {
      const dept = await getDepartment(departmentQuery);
      if (dept) {
        conditions.push(`department_id = $${pIdx}`);
        params.push(dept.id);
        pIdx++;
      }
    }

    if (search) {
      conditions.push(
        `(name ILIKE $${pIdx} OR company ILIKE $${pIdx} OR role ILIKE $${pIdx} OR location ILIKE $${pIdx} OR department_name ILIKE $${pIdx})`
      );
      params.push(`%${search}%`);
      pIdx++;
    }

    if (year) {
      conditions.push(`graduation_year = $${pIdx}`);
      params.push(year);
      pIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count
    const countRes = await query(`SELECT count(*) as total FROM v_member_directory ${whereClause}`, params);
    const total = parseInt(countRes.rows[0]?.total || "0", 10);

    // List
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

    const mappedAlumni = listRes.rows.map((r) => ({
      ...r,
      year: r.graduation_year,
      dept: r.department_short || r.department_name,
      linkedin: r.linkedin_url,
      avatar: r.avatar_url,
      experience: r.experience_years ? String(r.experience_years) : "1",
    }));

    return NextResponse.json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      alumni: mappedAlumni,
    });
  } catch (error: any) {
    console.error("GET /api/alumni error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    // Determine department_id
    let deptId = body.department_id ? Number(body.department_id) : 1;
    const deptSearch = body.department || body.dept || body.department_name;
    if (deptSearch) {
      const foundDept = await getDepartment(deptSearch);
      if (foundDept) {
        deptId = foundDept.id;
      }
    }

    const newMember = await createMember({
      name: body.name,
      email: body.email,
      phone: body.phone,
      dob: body.dob,
      gender: body.gender,
      degree: body.degree || "B.Tech",
      graduation_year: String(body.graduation_year || body.year || "2025"),
      department_id: deptId,
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

    const updatedDept = await query(
      "SELECT id, name, slug, alumni_count FROM departments WHERE id = $1",
      [deptId]
    );

    return NextResponse.json(
      {
        success: true,
        message: `Member '${newMember.name}' successfully stored in PostgreSQL database under ${updatedDept.rows[0]?.name}!`,
        member: newMember,
        department: updatedDept.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/alumni error:", error);
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
