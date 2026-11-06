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
  // Aliases / Fallbacks
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

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 100);
  return `${base || "news"}-${Date.now().toString().slice(-6)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
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

    if (featured === "true") {
      conditions.push("is_featured = true");
    } else if (featured === "false") {
      conditions.push("is_featured = false");
    }

    if (search) {
      conditions.push(`(title ILIKE $${pIdx} OR excerpt ILIKE $${pIdx} OR author ILIKE $${pIdx} OR content ILIKE $${pIdx})`);
      params.push(`%${search}%`);
      pIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limitClause = limit ? `LIMIT ${limit}` : "";

    const sql = `
      SELECT *
      FROM news_articles
      ${whereClause}
      ORDER BY published_at DESC, id DESC
      ${limitClause}
    `;

    const res = await query(sql, params);

    const mapped = res.rows.map((r) => ({
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
    }));

    return NextResponse.json({
      success: true,
      total: mapped.length,
      items: mapped,
      news: mapped,
    });
  } catch (error: any) {
    console.error("GET /api/news error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch news articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Article headline / title is required" },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const rawCat = body.category || "Reunion";
    const category = CATEGORY_TO_ENUM[rawCat] || "reunion";
    const author = (body.author || "Alumni Relations Team").trim();
    const readTime = (body.readTime || body.read_time || "3 min read").trim();
    const excerpt = (body.excerpt || "").trim();
    const content = (body.content || body.excerpt || "").trim();
    const imageUrl = (body.img || body.image_url || "/campus-building.png").trim();
    const isFeatured = body.featured === true || body.is_featured === true;
    const publishedAt = parseNewsDate(body.date || body.published_at);
    const slug = body.slug ? String(body.slug).trim() : generateSlug(title);

    const insertSql = `
      INSERT INTO news_articles (
        title, slug, category, author, read_time, excerpt, content, image_url, is_featured, is_published, published_at
      ) VALUES (
        $1, $2, $3::news_category_enum, $4, $5, $6, $7, $8, $9, true, $10
      )
      RETURNING *;
    `;

    const values = [
      title,
      slug,
      category,
      author,
      readTime,
      excerpt,
      content,
      imageUrl,
      isFeatured,
      publishedAt,
    ];

    const res = await query(insertSql, values);
    const row = res.rows[0];

    const mapped = {
      id: String(row.id),
      numericId: row.id,
      title: row.title,
      slug: row.slug,
      category: ENUM_TO_CATEGORY[row.category] || row.category,
      raw_category: row.category,
      author: row.author,
      date: formatNewsDate(row.published_at),
      published_at: row.published_at,
      readTime: row.read_time,
      read_time: row.read_time,
      excerpt: row.excerpt || "",
      content: row.content || row.excerpt || "",
      img: row.image_url || "/campus-building.png",
      image_url: row.image_url || "/campus-building.png",
      featured: Boolean(row.is_featured),
      is_featured: Boolean(row.is_featured),
      is_published: Boolean(row.is_published),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "News article published successfully to PostgreSQL database",
      item: mapped,
      news: mapped,
    });
  } catch (error: any) {
    console.error("POST /api/news error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to publish news article" },
      { status: 500 }
    );
  }
}

