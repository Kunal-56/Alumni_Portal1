import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validation
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // ── Direct Admin Authentication for Tolani Portal ──
    if (
      (cleanEmail === "admin@tolani.edu" ||
        cleanEmail === "admin@alumni.tolani.edu" ||
        cleanEmail === "admin") &&
      (password === "admin@123" || password === "TolaniAdmin@2026")
    ) {
      return NextResponse.json(
        {
          success: true,
          message: "Welcome back, Administrator!",
          user: {
            id: 999999,
            email: "admin@tolani.edu",
            role: "admin",
            name: "Tolani Super Admin",
          },
        },
        { status: 200 }
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
          message: "No account found with this email. Please register first.",
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
          message: "Your account is disabled. Please contact the administrator.",
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

    return NextResponse.json(
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
  } catch (error: any) {
    console.error("API /api/auth/login error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "An unexpected error occurred during login. Please try again.",
      },
      { status: 500 }
    );
  }
}
