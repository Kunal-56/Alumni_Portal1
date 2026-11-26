import { NextRequest, NextResponse } from "next/server";
import { query, getDepartment, createMember, getClient } from "@/lib/db";
import { getAuthenticatedUser, hasSameOrigin, isAuthorizedAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { normalizeEmail, validateAlumniProfileInput } from "@/lib/inputValidation";
import { presentDirectoryContact } from "@/lib/contactPrivacy";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAuthorizedAdmin(request);
    const currentUser = isAdmin ? null : await getAuthenticatedUser(request);
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

    // A member can see their own completed profile while it awaits admin review.
    if (!isAdmin && currentUser) {
      conditions[0] = `(v.verified = true OR (v.user_id = $${pIdx} AND m.dob IS NOT NULL AND m.gender IS NOT NULL AND m.bio IS NOT NULL AND m.department_id IS NOT NULL AND m.company IS NOT NULL AND m.role IS NOT NULL))`;
      params.push(currentUser.id);
      pIdx++;
    }

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
      query(`SELECT count(*) as total FROM v_member_directory v LEFT JOIN members m ON m.id = v.id ${whereClause}`, params),
      query(listQuery, listParams)
    ]);
    const total = parseInt(countRes.rows[0]?.total || "0", 10);

    const mappedAlumni = listRes.rows.map((r) => ({
      ...presentDirectoryContact(r, isAdmin),
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

  // Determine department_id early (accessible in catch block)
  let deptId = 1;
  const tempBody = await request.json().catch(() => ({}));
  body = tempBody;
  if (tempBody.department_id) deptId = Number(tempBody.department_id);
  const deptSearch = tempBody.department || tempBody.dept || tempBody.department_name;
  if (deptSearch) {
    const foundDept = await getDepartment(deptSearch);
    if (foundDept) deptId = foundDept.id;
  }

  try {
    if (!hasSameOrigin(request)) {
      return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
    }
    isAdmin = await isAuthorizedAdmin(request);
    const currentUser = isAdmin ? null : await getAuthenticatedUser(request);
    if (!isAdmin && !currentUser) {
      return NextResponse.json({ success: false, error: "Please sign in before registering your alumni profile." }, { status: 401 });
    }
    if (!isAdmin) {
      const rate = checkRateLimit(request, "alumni-submit", 5, 60 * 60 * 1000);
      if (!rate.allowed) {
        return NextResponse.json({ success: false, error: "Too many submissions. Please try again later." }, { status: 429 });
      }
    }
    // body already parsed above for deptId
    const validationError = validateAlumniProfileInput(body);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    const memberEmail = isAdmin ? normalizeEmail(body.email) : currentUser!.email;
    if (!isAdmin && body.email && normalizeEmail(body.email) !== currentUser!.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Your profile email must match your signed-in account." }, { status: 403 });
    }

    let newMember;
    if (currentUser) {
      const client = await getClient();
      try {
        await client.query("BEGIN");
        const owned = await client.query("SELECT id FROM members WHERE user_id = $1 FOR UPDATE", [currentUser.id]);
        if (owned.rows[0]) {
          const update = await client.query(
            `UPDATE members SET
              name = $1, email = $2, phone = $3, dob = $4, gender = $5, degree = $6,
              graduation_year = $7, department_id = $8, institute = $9, company = $10,
              role = $11, industry = $12, location = $13, experience_years = $14,
              linkedin_url = $15, bio = $16, avatar_url = $17, verified = false,
              verification_method = $18, updated_at = NOW()
             WHERE user_id = $19 RETURNING *`,
            [body.name.trim(), memberEmail, body.phone?.trim() || null, body.dob || null,
              body.gender?.toLowerCase() || null, body.degree || "B.Tech",
              String(body.graduation_year || body.year || "2025"), deptId,
              body.institute || "Tolani F. G. Polytechnic", body.company || null,
              body.role || body.jobTitle || null, body.industry || null, body.location || null,
              body.experience_years ? Number(body.experience_years) : 0,
              body.linkedin_url || body.linkedin || null, body.bio || null,
              body.avatar_url || body.avatar || "/avatars/m1.jpg", body.verification_method || "admin_approval",
              currentUser.id]
          );
          const memberId = update.rows[0].id;
          await client.query("DELETE FROM member_skills WHERE member_id = $1", [memberId]);
          for (const rawSkill of (Array.isArray(body.skills) ? body.skills : [])) {
            const skill = typeof rawSkill === "string" ? rawSkill.trim() : "";
            if (!skill) continue;
            const result = await client.query(
              "INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
              [skill]
            );
            await client.query("INSERT INTO member_skills (member_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [memberId, result.rows[0].id]);
          }
          await client.query("DELETE FROM member_achievements WHERE member_id = $1", [memberId]);
          for (const rawAchievement of (Array.isArray(body.achievements) ? body.achievements : [])) {
            const title = typeof rawAchievement === "string" ? rawAchievement.trim() : "";
            if (title) await client.query("INSERT INTO member_achievements (member_id, title, year) VALUES ($1, $2, $3)", [memberId, title, String(body.graduation_year || body.year || "2025")]);
          }
          newMember = { ...update.rows[0], skills: body.skills || [], achievements: body.achievements || [] };
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    newMember ||= await createMember({
      user_id: currentUser?.id,
      name: body.name,
      email: memberEmail,
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
                email = COALESCE($2, email),
                phone = COALESCE($3, phone),
                dob = COALESCE($4, dob),
                gender = COALESCE($5, gender),
                degree = COALESCE($6, degree),
                graduation_year = COALESCE($7, graduation_year),
                department_id = COALESCE($8, department_id),
                institute = COALESCE($9, institute),
                company = COALESCE($10, company),
                role = COALESCE($11, role),
                industry = COALESCE($12, industry),
                location = COALESCE($13, location),
                experience_years = COALESCE($14, experience_years),
                linkedin_url = COALESCE($15, linkedin_url),
                bio = COALESCE($16, bio),
                avatar_url = COALESCE($17, avatar_url),
                verified = COALESCE($18, verified),
                verification_method = COALESCE($19, verification_method),
                skills = COALESCE($20, skills),
                achievements = COALESCE($21, achievements),
                updated_at = now()
               WHERE id = $22
               RETURNING *`,
              [
                body.name?.trim() || null,
                normalizeEmail(body.email) || null,
                typeof body.phone === "string" ? body.phone.trim() : null,
                body.dob || null,
                typeof body.gender === "string" ? body.gender.toLowerCase() : null,
                body.degree || "B.Tech",
                String(body.graduation_year || body.year || "2025"),
                body.department_id || deptId,
                body.institute || "Tolani F. G. Polytechnic",
                body.company || null,
                body.role || body.jobTitle || null,
                body.industry || null,
                body.location || null,
                body.experience_years ? Number(body.experience_years) : null,
                body.linkedin_url || body.linkedin || null,
                body.bio || null,
                body.avatar_url || body.avatar || "/avatars/m1.jpg",
                isAdmin ? (body.verified !== undefined ? Boolean(body.verified) : true) : false,
                isAdmin ? body.verification_method || "email" : "admin_approval",
                Array.isArray(body.skills) ? body.skills : [],
                Array.isArray(body.achievements) ? body.achievements : [],
                memberId,
              ]
            );

            // Also update skills and achievements
            if (Array.isArray(body.skills) && body.skills.length > 0) {
              await query("DELETE FROM member_skills WHERE member_id = $1", [memberId]);
              for (const rawSkill of body.skills) {
                const skillName = rawSkill?.trim();
                if (!skillName) continue;
                const skillRes = await query(
                  `INSERT INTO skills (name) VALUES ($1)
                   ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                   RETURNING id;`,
                  [skillName]
                );
                await query(
                  `INSERT INTO member_skills (member_id, skill_id) VALUES ($1, $2)`,
                  [memberId, skillRes.rows[0].id]
                );
              }
            }
            if (Array.isArray(body.achievements) && body.achievements.length > 0) {
              await query("DELETE FROM member_achievements WHERE member_id = $1", [memberId]);
              for (const rawAch of body.achievements) {
                const title = typeof rawAch === "string" ? rawAch.trim() : "";
                if (!title) continue;
                await query(
                  `INSERT INTO member_achievements (member_id, title, year) VALUES ($1, $2, $3)`,
                  [memberId, title, String(body.graduation_year || body.year || "2025")]
                );
              }
            }

            // Audit log
            await query(
              `INSERT INTO audit_log (action, entity_type, entity_id, metadata)
               VALUES ($1, $2, $3, $4)`,
              [
                "UPDATE_ALUMNI",
                "members",
                String(memberId),
                JSON.stringify({ name: body.name, email: body.email, department_id: deptId }),
              ]
            );

            const updatedMember = updatedRes.rows[0];
            const updatedDept = await query(
              "SELECT id, name, slug, alumni_count FROM departments WHERE id = $1",
              [deptId]
            );

            return NextResponse.json(
              {
                success: true,
                message: "Member profile updated successfully!",
                member: updatedMember,
                department: updatedDept.rows[0],
              },
              { status: 200 }
            );
          }
        }
      } catch (inner) {
        console.error("Duplicate-member update failed:", { code: (inner as { code?: string })?.code });
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
      { success: false, error: "Failed to store alumni information.", debugError: error?.message, debugCode: error?.code, debugStack: error?.stack },
      { status: 500 }
    );
  }
}
