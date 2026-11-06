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

    if (departmentQuery && departmentQuery.toUpperCase() !== "ALL") {
      const dept = await getDepartment(departmentQuery);
      if (dept) {
        conditions.push(`v.department_id = $${pIdx}`);
        params.push(dept.id);
        pIdx++;
      }
    }

    if (search) {
      conditions.push(
        `(v.name ILIKE $${pIdx} OR v.company ILIKE $${pIdx} OR v.role ILIKE $${pIdx} OR v.location ILIKE $${pIdx} OR v.department_name ILIKE $${pIdx} OR v.email ILIKE $${pIdx} OR v.degree ILIKE $${pIdx})`
      );
      params.push(`%${search}%`);
      pIdx++;
    }

    if (year && year.toUpperCase() !== "ALL") {
      conditions.push(`v.graduation_year = $${pIdx}`);
      params.push(year);
      pIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const listParams = [...params, limit, offset];
    const listQuery = `
      SELECT 
        v.id, v.user_id, v.name, v.email, v.phone, v.degree, v.graduation_year, v.department_id,
        v.department_name, v.department_short, v.company, v.role, v.industry,
        v.location, v.experience_years, v.linkedin_url, v.bio, v.avatar_url,
        v.verified, v.institute, v.skills, v.achievements, v.created_at,
        m.dob, m.gender, m.verification_method
      FROM v_member_directory v
      LEFT JOIN members m ON m.id = v.id
      ${whereClause}
      ORDER BY v.id DESC
      LIMIT $${pIdx} OFFSET $${pIdx + 1}
    `;

    // Run count and paginated list queries in parallel
    const [countRes, listRes] = await Promise.all([
      query(`SELECT count(*) as total FROM v_member_directory v ${whereClause}`, params),
      query(listQuery, listParams)
    ]);
    const total = parseInt(countRes.rows[0]?.total || "0", 10);

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
  let body: any = {};
  try {
    body = await request.json();

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
      try {
        const email = (body.email || "").trim().toLowerCase();
        if (email) {
          const existingRes = await query("SELECT * FROM members WHERE email = $1", [email]);
          if (existingRes.rows.length > 0) {
            const memberId = existingRes.rows[0].id;
            const updatedRes = await query(
              `UPDATE members SET
                name = COALESCE($1, name),
                company = COALESCE($2, company),
                role = COALESCE($3, role),
                location = COALESCE($4, location),
                graduation_year = COALESCE($5, graduation_year),
                updated_at = now()
               WHERE id = $6
               RETURNING *`,
              [
                body.name?.trim() || null,
                body.company?.trim() || null,
                body.role?.trim() || null,
                body.location?.trim() || null,
                body.graduation_year ? String(body.graduation_year).slice(0, 4) : null,
                memberId,
              ]
            );
            return NextResponse.json({
              success: true,
              message: "Member profile updated successfully in database!",
              member: updatedRes.rows[0],
            });
          }
        }
      } catch (inner) {
        console.error("Auto-recovery update error:", inner);
      }
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
