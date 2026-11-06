import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const CATEGORY_TO_ENUM: Record<string, string> = {
  "Reunion": "reunion",
  "Community": "community",
  "Success Story": "success_story",
  "Programs": "programs",
  "Achievement": "achievement",
  "Department News": "department_news",
  "Scholarship": "scholarship",
  "Platform Update": "platform_update",
  // Aliases
  "Campus": "community",
  "Innovation": "achievement",
  "Academic": "programs",
};

const ENUM_TO_CATEGORY: Record<string, string> = {
  reunion: "Reunion",
  community: "Community",
  success_story: "Success Story",
  programs: "Programs",
  achievement: "Achievement",
  department_news: "Department News",
  scholarship: "Scholarship",
  platform_update: "Platform Update",
};

function formatNewsDate(dateVal: any): string {
  if (!dateVal) return "Aug 05, 2026";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "Aug 05, 2026";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[d.getUTCMonth()];
  const day = String(d.getUTCDate()).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${m} ${day}, ${year}`;
}

function parseNewsDate(dateStr?: string): Date {
  if (!dateStr) return new Date();
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const isNum = /^\d+$/.test(id);

    let sql = "";
    let params: any[] = [];
    if (isNum) {
      sql = "SELECT * FROM news_articles WHERE id = $1";
      params = [parseInt(id, 10)];
    } else {
      sql = "SELECT * FROM news_articles WHERE slug = $1";
      params = [id];
    }

    const res = await query(sql, params);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: "News article not found" }, { status: 404 });
    }

    const r = res.rows[0];
    const item = {
      id: String(r.id),
      numericId: r.id,
      title: r.title,
      slug: r.slug,
      category: ENUM_TO_CATEGORY[r.category] || r.category,
      raw_category: r.category,
      author: r.author || "Alumni Relations Team",
      date: formatNewsDate(r.published_at),
      published_at: r.published_at,
      readTime: r.read_time || "3 min read",
      read_time: r.read_time || "3 min read",
      excerpt: r.excerpt || "",
      content: r.content || r.excerpt || "",
      img: r.image_url || "/campus-building.png",
      image_url: r.image_url || "/campus-building.png",
      featured: Boolean(r.is_featured),
      is_featured: Boolean(r.is_featured),
      is_published: Boolean(r.is_published),
      created_at: r.created_at,
      updated_at: r.updated_at,
    };

    return NextResponse.json({ success: true, item, news: item });
  } catch (error: any) {
    console.error("GET /api/news/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch news article" },
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
    const newsId = parseInt(id, 10);
    if (isNaN(newsId)) {
      return NextResponse.json({ success: false, error: "Invalid news ID" }, { status: 400 });
    }

    const body = await request.json();

    const title = body.title !== undefined ? body.title.trim() : null;
    const rawCat = body.category;
    const category = rawCat ? (CATEGORY_TO_ENUM[rawCat] || rawCat.toLowerCase().replace(/[^a-z0-9]/g, "_")) : null;
    const author = body.author !== undefined ? body.author.trim() : null;
    const readTime = body.readTime !== undefined ? body.readTime.trim() : (body.read_time !== undefined ? body.read_time.trim() : null);
    const excerpt = body.excerpt !== undefined ? body.excerpt.trim() : null;
    const content = body.content !== undefined ? body.content.trim() : null;
    const imageUrl = body.img !== undefined ? body.img.trim() : (body.image_url !== undefined ? body.image_url.trim() : null);
    const isFeatured = body.featured !== undefined ? Boolean(body.featured) : (body.is_featured !== undefined ? Boolean(body.is_featured) : null);
    const publishedAt = body.date || body.published_at ? parseNewsDate(body.date || body.published_at) : null;

    const updateSql = `
      UPDATE news_articles SET
        title = COALESCE($1, title),
        category = COALESCE($2::news_category_enum, category),
        author = COALESCE($3, author),
        read_time = COALESCE($4, read_time),
        excerpt = COALESCE($5, excerpt),
        content = COALESCE($6, content),
        image_url = COALESCE($7, image_url),
        is_featured = COALESCE($8, is_featured),
        published_at = COALESCE($9, published_at),
        updated_at = now()
      WHERE id = $10
      RETURNING *;
    `;

    const res = await query(updateSql, [
      title,
      category,
      author,
      readTime,
      excerpt,
      content,
      imageUrl,
      isFeatured,
      publishedAt,
      newsId,
    ]);

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "News article not found" }, { status: 404 });
    }

    const r = res.rows[0];
    const item = {
      id: String(r.id),
      numericId: r.id,
      title: r.title,
      slug: r.slug,
      category: ENUM_TO_CATEGORY[r.category] || r.category,
      raw_category: r.category,
      author: r.author,
      date: formatNewsDate(r.published_at),
      published_at: r.published_at,
      readTime: r.read_time,
      read_time: r.read_time,
      excerpt: r.excerpt || "",
      content: r.content || r.excerpt || "",
      img: r.image_url || "/campus-building.png",
      image_url: r.image_url || "/campus-building.png",
      featured: Boolean(r.is_featured),
      is_featured: Boolean(r.is_featured),
      is_published: Boolean(r.is_published),
      created_at: r.created_at,
      updated_at: r.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "News article updated in PostgreSQL database successfully",
      item,
      news: item,
    });
  } catch (error: any) {
    console.error("PUT /api/news/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update news article" },
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
    const newsId = parseInt(id, 10);
    if (isNaN(newsId)) {
      return NextResponse.json({ success: false, error: "Invalid news ID" }, { status: 400 });
    }

    const res = await query(
      "DELETE FROM news_articles WHERE id = $1 RETURNING id, title",
      [newsId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "News article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `News article "${res.rows[0].title}" permanently removed from database`,
    });
  } catch (error: any) {
    console.error("DELETE /api/news/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete news article" },
      { status: 500 }
    );
  }
}

