import { NextRequest, NextResponse } from "next/server";
import { query, getDepartment } from "@/lib/db";

export const dynamic = "force-dynamic";

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const ENUM_TO_TYPE: Record<string, string> = {
  virtual_event: "Virtual Event",
  online_session: "Online Session",
  department_meetup: "Department Meetup",
  in_person_event: "In-Person Event",
  summit: "Summit",
  annual_event: "Annual Event",
  competition: "Competition",
  cultural_event: "Cultural Event",
  csr_event: "CSR Event",
  social_event: "Social Event",
  webinar: "Webinar",
  workshop: "Workshop",
  reunion: "Reunion",
  networking: "Networking",
  seminar: "Seminar",
  sports: "Sports",
  other: "Other",
};

const ENUM_TO_CATEGORY: Record<string, string> = {
  annual_event: "Annual Event",
  virtual: "Virtual",
  networking: "Networking",
  campus: "Campus",
  academic: "Academic",
  cultural: "Cultural",
  tech: "Tech",
  competition: "Competition",
  department: "Department",
  graduation: "Graduation",
  sports: "Sports",
  social: "Social",
};

function formatEventDate(dateVal: any): { day: string; month: string; year: string } {
  if (!dateVal) return { day: "15", month: "SEP", year: "2026" };
  if (typeof dateVal === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateVal)) {
    const parts = dateVal.split("T")[0].split("-");
    const y = parts[0];
    const mIdx = parseInt(parts[1], 10) - 1;
    const d = parts[2].padStart(2, "0");
    return { day: d, month: MONTH_NAMES[mIdx] || "SEP", year: y };
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return { day: "15", month: "SEP", year: "2026" };
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()] || "SEP";
  const year = String(d.getFullYear());
  return { day, month, year };
}

function formatSqlTime(timeStr?: string): string {
  if (!timeStr) return "10:00 AM";
  const parts = String(timeStr).split(":");
  if (parts.length < 2) return timeStr;
  let h = parseInt(parts[0], 10);
  const m = parts[1];
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

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
          error: `Department '${slug}' not found. Valid slugs include 'computer', 'civil', 'cddm', 'electrical', 'mechanical'.`,
        },
        { status: 404 }
      );
    }

    const deptId = department.id;

    // Run all queries in parallel for ultra-fast response
    const [
      countRes,
      companiesRes,
      skillsRes,
      spotlightRes,
      contactsRes,
      eventsRes,
      galleryRes
    ] = await Promise.all([
      // 1. Registered & verified counts
      query(
        `SELECT 
           count(*) AS total_registered,
           count(*) FILTER (WHERE verified = true) AS total_verified
         FROM members 
         WHERE department_id = $1`,
        [deptId]
      ),
      // 2. Top companies
      query(
        `SELECT company, count(*) AS count 
         FROM members 
         WHERE department_id = $1 AND company IS NOT NULL AND company <> ''
         GROUP BY company 
         ORDER BY count DESC 
         LIMIT 5`,
        [deptId]
      ),
      // 3. Top skills
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
      // 4. Spotlight members
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
      // 5. Contacts
      query(
        `SELECT id, role_title, name, department, email, phone 
         FROM department_contacts 
         WHERE is_active = true 
         ORDER BY sort_order ASC`
      ),
      // 6. ALL database events
      query(
        `SELECT 
           e.*,
           COALESCE(reg.registration_count, 0)::int AS registration_count
         FROM events e
         LEFT JOIN (
           SELECT event_id, count(*) AS registration_count
           FROM event_registrations
           GROUP BY event_id
         ) reg ON reg.event_id = e.id
         WHERE e.is_published = true
         ORDER BY e.event_date ASC, e.start_time ASC NULLS LAST`
      ),
      // 7. ALL database gallery items
      query(
        `SELECT *
         FROM gallery_items
         WHERE is_published = true
         ORDER BY sort_order ASC, id ASC`
      ),
    ]);

    const registeredCount = parseInt(countRes.rows[0]?.total_registered || "0", 10);
    const verifiedCount = parseInt(countRes.rows[0]?.total_verified || "0", 10);

    // Map all database events
    const mappedEvents = eventsRes.rows.map((r) => {
      const { day, month, year } = formatEventDate(r.event_date);
      return {
        id: String(r.id),
        numericId: r.id,
        title: r.title,
        slug: r.slug,
        day,
        month,
        year,
        dateFormatted: `${day} ${month} ${year}`,
        event_date: r.event_date,
        type: ENUM_TO_TYPE[r.event_type] || r.event_type,
        raw_type: r.event_type,
        mode: r.is_online ? "Online" : "Offline",
        time: formatSqlTime(r.start_time),
        start_time: r.start_time,
        end_time: r.end_time,
        location: r.location || (r.is_online ? "Online" : "Tolani Campus"),
        desc: r.description || "",
        description: r.description || "",
        tags: Array.isArray(r.tags) ? r.tags : [],
        img: r.image_url || "/campus-building.png",
        image_url: r.image_url || "/campus-building.png",
        is_online: r.is_online,
        is_published: r.is_published,
        max_attendees: r.max_attendees,
        registration_count: r.registration_count || 0,
        created_at: r.created_at,
      };
    });

    // Map all database gallery items
    const mappedGallery = galleryRes.rows.map((r) => ({
      id: String(r.id),
      numericId: r.id,
      label: r.label,
      category: ENUM_TO_CATEGORY[r.category] || r.category,
      raw_category: r.category,
      year: r.year ? String(r.year).trim() : "2026",
      desc: r.description || "",
      description: r.description || "",
      img: r.image_url || "/campus-building.png",
      image_url: r.image_url || "/campus-building.png",
      bg: r.bg_color || "#2a1a1f",
      bg_color: r.bg_color || "#2a1a1f",
      sort_order: r.sort_order || 0,
      is_published: r.is_published,
      created_at: r.created_at,
    }));

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
        events: mappedEvents,
        gallery: mappedGallery,
        upcoming_events: mappedEvents,
        gallery_items: mappedGallery,
      },
      events: mappedEvents,
      gallery: mappedGallery,
      total_events: mappedEvents.length,
      total_gallery: mappedGallery.length,
    });
  } catch (error: any) {
    console.error("GET /api/departments/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
