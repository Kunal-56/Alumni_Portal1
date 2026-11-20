import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hasSameOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { normalizeEmail, validateEmail, validateFullName, validateGraduationYear, validateIntegerRange, validateIndianMobile, validateText } from "@/lib/inputValidation";

export async function POST(request: NextRequest) {
  try {
    if (!hasSameOrigin(request)) {
      return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
    }
    const rate = checkRateLimit(request, "event-registration", 10, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Too many registrations. Please try again later." }, { status: 429 });
    }
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "Request body must be a JSON object." }, { status: 400 });
    }
    const form = body as Record<string, unknown>;

    const {
      event_id: eventId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      graduation_year: graduationYear,
      department,
      company_designation: companyDesignation,
      guest_count: guestCount = 0,
      special_requirements: specialRequirements = "",
      agreed_to_terms: agreedToTerms,
    } = form;

    const eventIdError = validateIntegerRange(eventId, 1, 2147483647, "Event");
    if (eventIdError) return NextResponse.json({ success: false, error: "A valid event is required." }, { status: 400 });
    const firstNameError = validateFullName(firstName, 100);
    if (firstNameError) return NextResponse.json({ success: false, error: firstNameError.replace("Full name", "First name") }, { status: 400 });
    const lastNameError = validateFullName(lastName, 100);
    if (lastNameError) return NextResponse.json({ success: false, error: lastNameError.replace("Full name", "Last name") }, { status: 400 });
    const emailError = validateEmail(email);
    if (emailError) return NextResponse.json({ success: false, error: emailError }, { status: 400 });
    const phoneError = validateIndianMobile(phone);
    if (phoneError) return NextResponse.json({ success: false, error: phoneError }, { status: 400 });
    const yearError = validateGraduationYear(graduationYear);
    if (yearError) return NextResponse.json({ success: false, error: yearError }, { status: 400 });
    const departmentError = validateText(department, "Department", 150, true);
    if (departmentError) return NextResponse.json({ success: false, error: departmentError }, { status: 400 });
    const companyError = validateText(companyDesignation, "Company and designation", 300);
    if (companyError) return NextResponse.json({ success: false, error: companyError }, { status: 400 });
    const guestCountError = validateIntegerRange(guestCount, 0, 20, "Guest count");
    if (guestCountError) return NextResponse.json({ success: false, error: guestCountError }, { status: 400 });
    const requirementsError = validateText(specialRequirements, "Special requirements", 1000);
    if (requirementsError) return NextResponse.json({ success: false, error: requirementsError }, { status: 400 });
    if (agreedToTerms !== true) {
      return NextResponse.json({ success: false, error: "You must agree to the event terms." }, { status: 400 });
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
      Number(eventId),
      (firstName as string).trim(),
      (lastName as string).trim(),
      normalizeEmail(email as string),
      (phone as string).trim(),
      String(graduationYear),
      (department as string).trim(),
      typeof companyDesignation === "string" ? companyDesignation.trim() || null : null,
      Number(guestCount),
      typeof specialRequirements === "string" ? specialRequirements.trim() || null : null,
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
    console.error("POST /api/events/register error:", { code: error?.code });
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
      { success: false, error: "Failed to save registration." },
      { status: 500 }
    );
  }
}
