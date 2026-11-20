import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { createSessionCookie, hasSameOrigin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { normalizeEmail, validateEmail } from "@/lib/inputValidation";

export async function POST(request: NextRequest) {
  try {
    if (!hasSameOrigin(request)) {
      return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
    }
    const rate = checkRateLimit(request, "login", 10, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { email, password } = body || {};

    // 1. Validation
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    const cleanEmail = normalizeEmail(email);
    const accountRate = checkRateLimit(request, "login-account", 20, 15 * 60 * 1000, cleanEmail);
    if (!accountRate.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(accountRate.retryAfterSeconds) } }
      );
    }

    // 2. Fetch user from PostgreSQL "users" table
    const findUserQuery = `
      SELECT 
        u.id, 
        u.email, 
        u.password_hash, 
        u.role, 
        u.is_active, 
        u.email_verified,
        m.name AS member_name
      FROM users u
      LEFT JOIN members m ON (m.user_id = u.id OR LOWER(m.email) = LOWER(u.email))
      WHERE LOWER(u.email) = LOWER($1)
      ORDER BY u.created_at DESC
      LIMIT 1;
    `;

    const result = await query(findUserQuery, [cleanEmail]);

    // If user does not exist in users table
    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password. Please try again.",
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password. Please try again.",
        },
        { status: 403 }
      );
    }

    // 3. Verify password hash using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password. Please try again.",
        },
        { status: 401 }
      );
    }

    const sessionCookie = createSessionCookie(user.id);
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: "Authentication is not configured on this server." },
        { status: 503 }
      );
    }

    // 4. Update last_login_at in "users" table
    try {
      await query(
        "UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1",
        [user.id]
      );
    } catch (updateErr) {
      console.warn("Notice: Failed to update last_login_at:", updateErr);
    }

    const displayName = user.member_name || user.email.split("@")[0];

    const response = NextResponse.json(
      {
        success: true,
        message: `Welcome back, ${displayName}!`,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: displayName,
        },
      },
      { status: 200 }
    );
    response.headers.append("Set-Cookie", sessionCookie);
    return response;
  } catch (error: any) {
    console.error("API /api/auth/login failed:", { code: error?.code });
    return NextResponse.json(
      {
        success: false,
        message: "Unable to sign in right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}
