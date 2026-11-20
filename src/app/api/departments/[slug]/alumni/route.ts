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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const isAdmin = await isAuthorizedAdmin(request);
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
    const requestedLimit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 50;
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const offset = (page - 1) * limit;

    let whereClause = isAdmin ? "WHERE department_id = $1" : "WHERE department_id = $1 AND verified = true";
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
        id, ${isAdmin ? "user_id," : ""} name, email, phone, degree, graduation_year, department_id,
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
      alumni: listRes.rows.map((r) => ({
        ...r,
        email: isAdmin ? r.email : null,
        phone: isAdmin ? r.phone : maskPhoneNumber(r.phone),
        dob: isAdmin ? r.dob : null,
        gender: isAdmin ? r.gender : null,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/departments/[slug]/alumni failed:", { code: error?.code });
    return NextResponse.json(
      { success: false, error: "Unable to fetch department alumni." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
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
    const { slug } = await context.params;
    const department = await getDepartment(slug);

    if (!department) {
      return NextResponse.json(
        { success: false, error: `Department '${slug}' not found` },
        { status: 404 }
      );
    }

    body = await request.json();

    const validationError = validateAlumniProfileInput(body);
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 });

    // Insert into PostgreSQL database
    const newMember = await createMember({
      name: body.name,
      email: normalizeEmail(body.email),
      phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
      dob: body.dob,
      gender: typeof body.gender === "string" ? body.gender.toLowerCase() : undefined,
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
      verified: isAdmin ? (body.verified !== undefined ? Boolean(body.verified) : true) : false,
      verification_method: isAdmin ? body.verification_method || "email" : "admin_approval",
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
    console.error("POST /api/departments/[slug]/alumni error:", { code: error?.code });
    // Handle unique constraint violation on email
    if (error.code === "23505" && isAdmin) {
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
        console.error("Auto-recovery update failed:", { code: (inner as { code?: string })?.code });
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
