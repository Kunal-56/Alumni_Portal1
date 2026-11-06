import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const CATEGORY_TO_ENUM: Record<string, string> = {
  "Annual Event": "annual_event",
  "Virtual": "virtual",
  "Networking": "networking",
  "Campus": "campus",
  "Academic": "academic",
  "Cultural": "cultural",
  "Tech": "tech",
  "Competition": "competition",
  "Department": "department",
  "Graduation": "graduation",
  "Sports": "sports",
  "Social": "social",
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim() || "";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : null;

    const conditions: string[] = ["is_published = true"];
    const params: any[] = [];
    let pIdx = 1;

    if (category && category !== "All") {
      const enumVal = CATEGORY_TO_ENUM[category] || category.toLowerCase().replace(/[^a-z0-9]/g, "_");
      conditions.push(`category = $${pIdx}`);
      params.push(enumVal);
      pIdx++;
    }

    if (search) {
      conditions.push(`(label ILIKE $${pIdx} OR description ILIKE $${pIdx})`);
      params.push(`%${search}%`);
      pIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limitClause = limit ? `LIMIT ${limit}` : "";

    const sql = `
      SELECT *
      FROM gallery_items
      ${whereClause}
      ORDER BY sort_order ASC, id DESC
      ${limitClause}
    `;

    const res = await query(sql, params);

    const mapped = res.rows.map((r) => ({
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
      total: mapped.length,
      items: mapped,
    });
  } catch (error: any) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.label || !body.label.trim()) {
      return NextResponse.json(
        { success: false, error: "Photo label / event name is required" },
        { status: 400 }
      );
    }

    const label = body.label.trim();
    const rawCat = body.category || "Annual Event";
    const category = CATEGORY_TO_ENUM[rawCat] || "annual_event";
    const year = String(body.year || "2026").trim().slice(0, 4);
    const desc = (body.desc || body.description || "").trim();
    const imageUrl = (body.img || body.image_url || "/campus-building.png").trim();
    const bg = body.bg || body.bg_color || "#2a1a1f";
    const sortOrder = typeof body.sort_order === "number" ? body.sort_order : 0;

    const insertSql = `
      INSERT INTO gallery_items (
        label, category, year, description, image_url, bg_color, sort_order, is_published
      ) VALUES (
        $1, $2::gallery_category_enum, $3, $4, $5, $6, $7, true
      )
      RETURNING *;
    `;

    const values = [label, category, year, desc, imageUrl, bg, sortOrder];
    const res = await query(insertSql, values);
    const row = res.rows[0];

    const mapped = {
      id: String(row.id),
      numericId: row.id,
      label: row.label,
      category: ENUM_TO_CATEGORY[row.category] || row.category,
      raw_category: row.category,
      year: row.year ? String(row.year).trim() : "2026",
      desc: row.description || "",
      description: row.description || "",
      img: row.image_url || "/campus-building.png",
      image_url: row.image_url || "/campus-building.png",
      bg: row.bg_color || "#2a1a1f",
      bg_color: row.bg_color || "#2a1a1f",
      sort_order: row.sort_order || 0,
      is_published: row.is_published,
      created_at: row.created_at,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Gallery item created and saved in PostgreSQL database successfully!",
        item: mapped,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create gallery item in database" },
      { status: 500 }
    );
  }
}

