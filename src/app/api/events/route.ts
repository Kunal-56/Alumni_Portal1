import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const MONTH_MAP: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

const TYPE_TO_ENUM: Record<string, string> = {
  "Virtual Event": "virtual_event",
  "Online Session": "online_session",
  "Department Meetup": "department_meetup",
  "In-Person Event": "in_person_event",
  "Summit": "summit",
  "Annual Event": "annual_event",
  "Competition": "competition",
  "Cultural Event": "cultural_event",
  "CSR Event": "csr_event",
  "Social Event": "social_event",
  "Webinar": "webinar",
  "Workshop": "workshop",
  "Reunion": "reunion",
  "Networking": "networking",
  "Seminar": "seminar",
  "Sports": "sports",
};

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

function parseToSqlTime(timeStr?: string): string {
  if (!timeStr) return "10:00:00";
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return "10:00:00";
  let [_, hours, minutes, seconds, meridiem] = match;
  let h = parseInt(hours, 10);
  const m = minutes;
  const s = seconds || "00";
  if (meridiem) {
    const isPm = meridiem.toUpperCase() === "PM";
    if (isPm && h < 12) h += 12;
    if (!isPm && h === 12) h = 0;
  }
  return `${String(h).padStart(2, "0")}:${m}:${s}`;
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

function generateSlug(title: string, year: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
  return `${base || "event"}-${year}-${Date.now().toString().slice(-4)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const upcomingOnly = searchParams.get("upcoming") === "true";
    const search = searchParams.get("search")?.trim() || "";

    const conditions: string[] = ["e.is_published = true"];
    const params: any[] = [];
    let pIdx = 1;

    if (upcomingOnly) {
      conditions.push("e.event_date >= CURRENT_DATE");
    }

    if (type && type !== "All") {
      const enumVal = TYPE_TO_ENUM[type] || type.toLowerCase().replace(/[^a-z0-9]/g, "_");
      conditions.push(`e.event_type = $${pIdx}`);
      params.push(enumVal);
      pIdx++;
    }

    if (search) {
      conditions.push(
        `(e.title ILIKE $${pIdx} OR e.description ILIKE $${pIdx} OR e.location ILIKE $${pIdx})`
      );
      params.push(`%${search}%`);
      pIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT 
        e.*,
        COALESCE(reg.registration_count, 0)::int AS registration_count
      FROM events e
      LEFT JOIN (
        SELECT event_id, count(*) AS registration_count
        FROM event_registrations
        GROUP BY event_id
      ) reg ON reg.event_id = e.id
      ${whereClause}
      ORDER BY e.event_date ASC, e.start_time ASC NULLS LAST
    `;

    const res = await query(sql, params);

    const mappedEvents = res.rows.map((r) => {
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

    return NextResponse.json({
      success: true,
      total: mappedEvents.length,
      events: mappedEvents,
    });
  } catch (error: any) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch events from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Event Title / Name is required" },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const day = String(body.day || "15").padStart(2, "0");
    const month = String(body.month || "SEP").toUpperCase();
    const year = String(body.year || "2026");

    const monthNum = MONTH_MAP[month] || "09";
    const eventDate = `${year}-${monthNum}-${day}`;

    const rawType = body.type || body.event_type || "Virtual Event";
    const eventType = TYPE_TO_ENUM[rawType] || "virtual_event";

    const isOnline = body.mode === "Online" || body.is_online === true;
    const location = (body.location || (isOnline ? "Online" : "Tolani Campus")).trim();
    const startTime = parseToSqlTime(body.time || body.start_time || "10:00 AM");
    const desc = (body.desc || body.description || "").trim();
    const imageUrl = (body.img || body.image_url || "/campus-building.png").trim();

    let tags: string[] = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags.map((t: any) => String(t).trim()).filter(Boolean);
    } else if (typeof body.tagsInput === "string") {
      tags = body.tagsInput.split(",").map((t: string) => t.trim()).filter(Boolean);
    } else if (typeof body.tags === "string") {
      tags = body.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    if (tags.length === 0) tags = [isOnline ? "Virtual" : "Campus", "Alumni"];

    const slug = body.slug ? String(body.slug).trim() : generateSlug(title, year);

    const insertSql = `
      INSERT INTO events (
        title, slug, event_type, description, event_date,
        start_time, location, is_online, image_url, tags,
        is_published
      ) VALUES (
        $1, $2, $3::event_type_enum, $4, $5,
        $6, $7, $8, $9, $10,
        true
      )
      RETURNING *;
    `;

    const values = [
      title,
      slug,
      eventType,
      desc,
      eventDate,
      startTime,
      location,
      isOnline,
      imageUrl,
      tags,
    ];

    const res = await query(insertSql, values);
    const row = res.rows[0];

    const formattedDate = formatEventDate(row.event_date);
    const mapped = {
      id: String(row.id),
      numericId: row.id,
      title: row.title,
      slug: row.slug,
      day: formattedDate.day,
      month: formattedDate.month,
      year: formattedDate.year,
      type: ENUM_TO_TYPE[row.event_type] || row.event_type,
      mode: row.is_online ? "Online" : "Offline",
      time: formatSqlTime(row.start_time),
      location: row.location,
      desc: row.description || "",
      tags: row.tags || [],
      img: row.image_url || "/campus-building.png",
      is_online: row.is_online,
      is_published: row.is_published,
      created_at: row.created_at,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Event created and saved in PostgreSQL database successfully!",
        event: mapped,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create event in database" },
      { status: 500 }
    );
  }
}

