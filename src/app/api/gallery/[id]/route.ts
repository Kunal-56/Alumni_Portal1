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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const galleryId = parseInt(id, 10);
    if (isNaN(galleryId)) {
      return NextResponse.json({ success: false, error: "Invalid gallery ID" }, { status: 400 });
    }

    const res = await query("SELECT * FROM gallery_items WHERE id = $1", [galleryId]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }

    const r = res.rows[0];
    const item = {
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
    };

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("GET /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery item" },
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
    const galleryId = parseInt(id, 10);
    if (isNaN(galleryId)) {
      return NextResponse.json({ success: false, error: "Invalid gallery ID" }, { status: 400 });
    }

    const body = await request.json();

    const label = body.label !== undefined ? body.label.trim() : null;
    const rawCat = body.category;
    const category = rawCat ? (CATEGORY_TO_ENUM[rawCat] || rawCat.toLowerCase().replace(/[^a-z0-9]/g, "_")) : null;
    const year = body.year !== undefined ? String(body.year).trim().slice(0, 4) : null;
    const desc = body.desc !== undefined ? body.desc.trim() : (body.description !== undefined ? body.description.trim() : null);
    const imageUrl = body.img !== undefined ? body.img.trim() : (body.image_url !== undefined ? body.image_url.trim() : null);
    const bg = body.bg !== undefined ? body.bg : body.bg_color;

    const updateSql = `
      UPDATE gallery_items SET
        label = COALESCE($1, label),
        category = COALESCE($2::gallery_category_enum, category),
        year = COALESCE($3, year),
        description = COALESCE($4, description),
        image_url = COALESCE($5, image_url),
        bg_color = COALESCE($6, bg_color),
        updated_at = now()
      WHERE id = $7
      RETURNING *;
    `;

    const res = await query(updateSql, [label, category, year, desc, imageUrl, bg, galleryId]);
    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }

    const r = res.rows[0];
    const item = {
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
      updated_at: r.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "Gallery item updated in database successfully",
      item,
    });
  } catch (error: any) {
    console.error("PUT /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update gallery item" },
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
    const galleryId = parseInt(id, 10);
    if (isNaN(galleryId)) {
      return NextResponse.json({ success: false, error: "Invalid gallery ID" }, { status: 400 });
    }

    const res = await query("DELETE FROM gallery_items WHERE id = $1 RETURNING id, label", [galleryId]);
    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Gallery item "${res.rows[0].label}" removed from database successfully`,
    });
  } catch (error: any) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}

