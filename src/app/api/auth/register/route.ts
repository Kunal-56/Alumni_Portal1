import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getClient } from "@/lib/db";
import { hasSameOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { normalizeEmail, validateAlumniName, validateEmail, validateIndianMobile } from "@/lib/inputValidation";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  }
  const rate = checkRateLimit(request, "register", 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many registration attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  let client;
  try {
    const body = await request.json();
    const { fullName, email, password, phone } = body || {};
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }
    const cleanEmail = normalizeEmail(email);
    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ success: false, message: emailError }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 10 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 10 characters and no more than 72 UTF-8 bytes." },
        { status: 400 }
      );
    }
    const nameError = validateAlumniName(fullName);
    if (nameError) {
      return NextResponse.json({ success: false, message: nameError }, { status: 400 });
    }
    const cleanName = (fullName as string).trim();
    if (phone !== undefined && phone !== null && phone !== "") {
      const phoneError = validateIndianMobile(phone);
      if (phoneError) return NextResponse.json({ success: false, message: phoneError }, { status: 400 });
    }
    if (phone !== undefined && phone !== null && typeof phone !== "string") {
      return NextResponse.json({ success: false, message: "Phone number must be text." }, { status: 400 });
    }
    const cleanPhone = typeof phone === "string" && phone.trim() ? phone.trim() : null;
    const passwordHash = await bcrypt.hash(password, 12);

    client = await getClient();
    await client.query("BEGIN");
    const existingUser = await client.query(
      "SELECT 1 FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [cleanEmail]
    );
    if (existingUser.rows.length) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, message: "Unable to create an account with those details. Please sign in or contact the alumni office." },
        { status: 409 }
      );
    }

    // Alumni may already have a directory profile before creating login credentials.
    // Lock it during registration so two requests cannot claim the same profile.
    const existingMember = await client.query(
      "SELECT id, user_id FROM members WHERE LOWER(email) = $1 LIMIT 1 FOR UPDATE",
      [cleanEmail]
    );
    if (existingMember.rows[0]?.user_id) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, message: "Unable to create an account with those details. Please sign in or contact the alumni office." },
        { status: 409 }
      );
    }

    const inserted = await client.query(
      `INSERT INTO users (email, phone, password_hash, role, is_active, email_verified, phone_verified, created_at, updated_at)
       VALUES ($1, $2, $3, 'alumni'::user_role_enum, true, false, false, NOW(), NOW())
       RETURNING id, email, role`,
      [cleanEmail, cleanPhone, passwordHash]
    );
    const user = inserted.rows[0];

    if (existingMember.rows[0]) {
      await client.query(
        "UPDATE members SET user_id = $1, phone = COALESCE(phone, $2), updated_at = NOW() WHERE id = $3",
        [user.id, cleanPhone, existingMember.rows[0].id]
      );
    } else if (cleanName) {
      await client.query(
        `INSERT INTO members (user_id, name, email, phone, degree, graduation_year, verified, verification_method, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'Diploma', '2025', false, 'admin_approval', NOW(), NOW())`,
        [user.id, cleanName, cleanEmail, cleanPhone]
      );
    }
    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Your profile is pending alumni office verification.",
        user: { id: user.id, email: user.email, role: user.role, name: cleanName || cleanEmail.split("@")[0] },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch { /* transaction may already be closed */ }
    }
    console.error("API /api/auth/register error:", { code: error?.code });
    if (error?.code === "23505") {
      return NextResponse.json(
        { success: false, message: "Unable to create an account with those details. Please sign in or contact the alumni office." },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, message: "Unable to register right now. Please try again later." }, { status: 500 });
  } finally {
    client?.release();
  }
}
