import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      event_id,
      first_name,
      last_name,
      email,
      phone,
      graduation_year,
      department,
      company_designation,
      guest_count = 0,
      special_requirements = "",
    } = body;

    if (!event_id || !first_name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "event_id, first_name, email, and phone are required fields",
        },
        { status: 400 }
      );
    }

    const regQuery = `
      INSERT INTO event_registrations (
        event_id, first_name, last_name, email, phone,
        graduation_year, department, company_designation,
        guest_count, special_requirements, agreed_to_terms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
      RETURNING *;
    `;

    const regValues = [
      Number(event_id),
      String(first_name).trim(),
      String(last_name || "").trim(),
      String(email).trim().toLowerCase(),
      String(phone).trim(),
      String(graduation_year || "2025").slice(0, 4),
      String(department || "Computer Engineering").trim(),
      company_designation?.trim() || null,
      Number(guest_count) || 0,
      special_requirements?.trim() || null,
    ];

    const result = await query(regQuery, regValues);

    return NextResponse.json(
      {
        success: true,
        message: "Event registration saved to PostgreSQL database successfully!",
        registration: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/events/register error:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "You have already registered for this event with this email.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save registration" },
      { status: 500 }
    );
  }
}
