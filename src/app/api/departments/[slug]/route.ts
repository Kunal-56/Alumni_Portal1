import { NextRequest, NextResponse } from "next/server";
import { query, getDepartment } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // 1. Resolve department (e.g. "computer" or "civil" or ID "1" / "2")
    const department = await getDepartment(slug);
    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error: `Department '${slug}' not found. Valid slugs include 'computer', 'civil', etc.`,
        },
        { status: 404 }
      );
    }

    const deptId = department.id;
    const tagFilter = slug.toLowerCase().includes("civil") ? "Civil" : "Tech";

    // Run all 6 queries in parallel for ultra-fast response
    const [countRes, companiesRes, skillsRes, spotlightRes, contactsRes, eventsRes] = await Promise.all([
      query(
        `SELECT 
           count(*) AS total_registered,
           count(*) FILTER (WHERE verified = true) AS total_verified
         FROM members 
         WHERE department_id = $1`,
        [deptId]
      ),
      query(
        `SELECT company, count(*) AS count 
         FROM members 
         WHERE department_id = $1 AND company IS NOT NULL AND company <> ''
         GROUP BY company 
         ORDER BY count DESC 
         LIMIT 5`,
        [deptId]
      ),
      query(
        `SELECT s.name AS skill, count(*) AS count
         FROM member_skills ms
         JOIN skills s ON s.id = ms.skill_id
         JOIN members m ON m.id = ms.member_id
         WHERE m.department_id = $1
         GROUP BY s.name
         ORDER BY count DESC 
         LIMIT 8`,
        [deptId]
      ),
      query(
        `SELECT 
           id, name, degree, graduation_year, company, role, location, 
           bio, avatar_url, verified, skills, achievements
         FROM v_member_directory
         WHERE department_id = $1
         ORDER BY id DESC
         LIMIT 8`,
        [deptId]
      ),
      query(
        `SELECT id, role_title, name, department, email, phone 
         FROM department_contacts 
         WHERE is_active = true 
         ORDER BY sort_order ASC`
      ),
      query(
        `SELECT id, title, slug, event_type, description, event_date, start_time, location, is_online, tags, image_url
         FROM events
         WHERE is_published = true 
           AND ($1 = ANY(tags) OR 'Networking' = ANY(tags) OR 'Virtual' = ANY(tags))
         ORDER BY event_date ASC
         LIMIT 4`,
        [tagFilter]
      ),
    ]);

    const registeredCount = parseInt(countRes.rows[0]?.total_registered || "0", 10);
    const verifiedCount = parseInt(countRes.rows[0]?.total_verified || "0", 10);

    return NextResponse.json({
      success: true,
      department: {
        id: department.id,
        name: department.name,
        short_name: department.short_name,
        slug: department.slug,
        description: department.description,
        alumni_count: department.alumni_count,
        total_registered_alumni: registeredCount,
        total_verified_alumni: verifiedCount,
        top_companies: companiesRes.rows.map((r) => r.company),
        top_skills: skillsRes.rows.map((r) => r.skill),
        contacts: contactsRes.rows,
        spotlight: spotlightRes.rows,
        upcoming_events: eventsRes.rows,
      },
    });
  } catch (error: any) {
    console.error("GET /api/departments/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
