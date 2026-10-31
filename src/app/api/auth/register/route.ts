import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone } = body;

    // 1. Validation
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanFullName = (fullName && typeof fullName === "string") ? fullName.trim() : "";
    const cleanPhone = (phone && typeof phone === "string") ? phone.trim() : null;

    // 2. Check if user already exists in the "users" table
    const existingUserRes = await query(
      "SELECT id, email FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [cleanEmail]
    );

    if (existingUserRes.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists. Please login instead.",
        },
        { status: 409 }
      );
    }

    // 3. Hash password using bcryptjs
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Insert into "users" table
    const insertUserQuery = `
      INSERT INTO users (
        email,
        phone,
        password_hash,
        role,
        is_active,
        email_verified,
        phone_verified,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, 'alumni'::user_role_enum, true, true, false, NOW(), NOW()
      )
      RETURNING id, email, phone, role, is_active, created_at;
    `;

    const userResult = await query(insertUserQuery, [
      cleanEmail,
      cleanPhone,
      passwordHash,
    ]);

    const newUser = userResult.rows[0];

    // 5. Link with or insert into "members" table so user name and profile are stored
    try {
      const existingMemberRes = await query(
        "SELECT id, name FROM members WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [cleanEmail]
      );

      if (existingMemberRes.rows.length > 0) {
        // Update user_id reference
        await query(
          `UPDATE members 
           SET user_id = $1, 
               name = COALESCE(NULLIF($2, ''), name),
               phone = COALESCE($3, phone),
               updated_at = NOW() 
           WHERE id = $4`,
          [newUser.id, cleanFullName, cleanPhone, existingMemberRes.rows[0].id]
        );
      } else if (cleanFullName) {
        // Create new member record
        await query(
          `INSERT INTO members (
            user_id,
            name,
            email,
            phone,
            degree,
            graduation_year,
            verified,
            created_at,
            updated_at
          ) VALUES (
            $1, $2, $3, $4, 'Diploma', '2025', true, NOW(), NOW()
          )`,
          [newUser.id, cleanFullName, cleanEmail, cleanPhone]
        );
      }
    } catch (memberErr) {
      // Non-fatal if member insert fails, user account in users table is already safely created
      console.warn("Notice: Member profile sync note:", memberErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! You can now log in.",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: cleanFullName || cleanEmail.split("@")[0],
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API /api/auth/register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "An unexpected error occurred during registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
