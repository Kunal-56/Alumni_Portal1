import { NextRequest, NextResponse } from "next/server";
import { query, getDepartment, createMember } from "@/lib/db";
import { hasSameOrigin, isAuthorizedAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { normalizeEmail, validateAlumniProfileInput } from "@/lib/inputValidation";

function maskPhoneNumber(phone?: string | null): string | null {
  if (!phone) return null;
  const cleaned = phone.trim();
  if (cleaned.length < 6) return "****";
  const start = cleaned.slice(0, 6);
  const end = cleaned.slice(-2);
  return `${start}*** **${end}`;
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAuthorizedAdmin(request);
    const { searchParams } = new URL(request.url);
    const departmentQuery = searchParams.get("department") || searchParams.get("dept");
    const search = searchParams.get("search")?.trim() || "";
    const year = searchParams.get("year")?.trim() || searchParams.get("graduation_year")?.trim() || "";
    const requestedLimit = Number.parseInt(searchParams.get("limit") || "100", 10);
    const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 500) : 100;
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const offset = (page - 1) * limit;

    const conditions: string[] = isAdmin ? [] : ["v.verified = true"];
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
        `(v.name ILIKE $${pIdx} OR v.company ILIKE $${pIdx} OR v.role ILIKE $${pIdx} OR v.location ILIKE $${pIdx} OR v.department_name ILIKE $${pIdx} OR ${isAdmin ? `v.email ILIKE $${pIdx} OR ` : ""}v.degree ILIKE $${pIdx})`
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
        v.id, ${isAdmin ? "v.user_id," : ""} v.name, v.email, v.phone, v.degree, v.graduation_year, v.department_id,
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
      email: isAdmin ? r.email : null,
      phone: isAdmin ? r.phone : maskPhoneNumber(r.phone),
      dob: isAdmin ? r.dob : null,
      gender: isAdmin ? r.gender : null,
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
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error: any) {
    console.error("GET /api/alumni failed:", { code: error?.code });
    return NextResponse.json(
      { success: false, error: "Unable to fetch alumni." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: any = {};
  let isAdmin = false;
  try {
    if (!hasSameOrigin(request)) {
      return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
    }
    isAdmin = await isAuthorizedAdmin(request);
    if (!isAdmin) {
      const rate = checkRateLimit(request, "alumni-submit", 5, 60 * 60 * 1000);
      if (!rate.allowed) {
        return NextResponse.json({ success: false, error: "Too many submissions. Please try again later." }, { status: 429 });
      }
    }
    body = await request.json();

    const validationError = validateAlumniProfileInput(body);
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 });

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
      email: normalizeEmail(body.email),
      phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
      dob: body.dob,
      gender: typeof body.gender === "string" ? body.gender.toLowerCase() : undefined,
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
      verified: isAdmin ? (body.verified !== undefined ? Boolean(body.verified) : true) : false,
      verification_method: isAdmin ? body.verification_method || "email" : "admin_approval",
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
    console.error("POST /api/alumni error:", { code: error?.code });
    if (error.code === "23505") {
      if (isAdmin) {
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
          console.error("Admin duplicate-member update failed:", { code: (inner as { code?: string })?.code });
        }
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
      { success: false, error: "Failed to store alumni information." },
      { status: 500 }
    );
  }
}
