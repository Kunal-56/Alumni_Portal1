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
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return { day: "15", month: "SEP", year: "2026" };
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getUTCMonth()] || "SEP";
  const year = String(d.getUTCFullYear());
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const isNum = /^\d+$/.test(id);

    const sql = isNum
      ? "SELECT * FROM events WHERE id = $1"
      : "SELECT * FROM events WHERE slug = $1";
    const val = isNum ? parseInt(id, 10) : id;

    const res = await query(sql, [val]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    const r = res.rows[0];
    const { day, month, year } = formatEventDate(r.event_date);
    const event = {
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
      location: r.location,
      desc: r.description || "",
      description: r.description || "",
      tags: Array.isArray(r.tags) ? r.tags : [],
      img: r.image_url || "/campus-building.png",
      image_url: r.image_url || "/campus-building.png",
      is_online: r.is_online,
      is_published: r.is_published,
      created_at: r.created_at,
    };

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ success: false, error: "Invalid event ID" }, { status: 400 });
    }

    const body = await request.json();

    const title = body.title ? body.title.trim() : null;
    const day = String(body.day || "15").padStart(2, "0");
    const month = String(body.month || "SEP").toUpperCase();
    const year = String(body.year || "2026");
    const monthNum = MONTH_MAP[month] || "09";
    const eventDate = `${year}-${monthNum}-${day}`;

    const rawType = body.type || body.event_type;
    const eventType = rawType ? (TYPE_TO_ENUM[rawType] || "virtual_event") : null;

    const isOnline = body.mode !== undefined ? (body.mode === "Online" || body.is_online === true) : null;
    const location = body.location !== undefined ? body.location.trim() : null;
    const startTime = body.time ? parseToSqlTime(body.time) : null;
    const desc = body.desc !== undefined ? body.desc.trim() : (body.description !== undefined ? body.description.trim() : null);
    const imageUrl = body.img !== undefined ? body.img.trim() : (body.image_url !== undefined ? body.image_url.trim() : null);

    let tags: string[] | null = null;
    if (Array.isArray(body.tags)) {
      tags = body.tags.map((t: any) => String(t).trim()).filter(Boolean);
    } else if (typeof body.tagsInput === "string") {
      tags = body.tagsInput.split(",").map((t: string) => t.trim()).filter(Boolean);
    }

    const updateSql = `
      UPDATE events SET
        title = COALESCE($1, title),
        event_type = COALESCE($2::event_type_enum, event_type),
        description = COALESCE($3, description),
        event_date = COALESCE($4::date, event_date),
        start_time = COALESCE($5::time, start_time),
        location = COALESCE($6, location),
        is_online = COALESCE($7, is_online),
        image_url = COALESCE($8, image_url),
        tags = COALESCE($9, tags),
        updated_at = now()
      WHERE id = $10
      RETURNING *;
    `;

    const res = await query(updateSql, [
      title,
      eventType,
      desc,
      eventDate,
      startTime,
      location,
      isOnline,
      imageUrl,
      tags,
      eventId,
    ]);

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

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
      updated_at: row.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "Event updated in database successfully",
      event: mapped,
    });
  } catch (error: any) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ success: false, error: "Invalid event ID" }, { status: 400 });
    }

    const res = await query("DELETE FROM events WHERE id = $1 RETURNING id, title", [eventId]);
    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Event "${res.rows[0].title}" removed from database successfully`,
    });
  } catch (error: any) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete event" },
      { status: 500 }
    );
  }
}

