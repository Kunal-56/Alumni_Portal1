import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

// Prevent multiple pools in Next.js hot-reloading dev environment
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const poolConfig = {
  host: process.env.PGHOST || "127.0.0.1",
  port: parseInt(process.env.PGPORT || "5432", 10),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "Alumni_Portal",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

export const pool: Pool = global._pgPool || new Pool(poolConfig);

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

// Database helper functions
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL) {
      console.log("Executed query", { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error("Database query error:", { text, error });
    throw error;
  }
}

export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

/**
 * Resolves department ID or slug to department record
 */
export async function getDepartment(identifier: string | number) {
  if (typeof identifier === "number" || /^\d+$/.test(String(identifier))) {
    const res = await query(
      "SELECT * FROM departments WHERE id = $1 AND is_active = true",
      [parseInt(String(identifier), 10)]
    );
    return res.rows[0] || null;
  }

  const raw = String(identifier).trim();
  if (!raw) return null;

  // 1. Exact match by slug, short_name or full name
  let res = await query(
    `SELECT * FROM departments 
     WHERE (LOWER(slug) = LOWER($1) OR LOWER(short_name) = LOWER($1) OR LOWER(name) = LOWER($1))
       AND is_active = true
     ORDER BY id ASC LIMIT 1`,
    [raw]
  );
  if (res.rows[0]) return res.rows[0];

  // 2. Partial match (e.g. "Journalism", "Civil", "Management", "Business", "Computer")
  res = await query(
    `SELECT * FROM departments 
     WHERE (LOWER(name) ILIKE LOWER($1) OR LOWER(slug) ILIKE LOWER($1) OR LOWER(short_name) ILIKE LOWER($1))
       AND is_active = true
     ORDER BY id ASC LIMIT 1`,
    [`%${raw}%`]
  );
  return res.rows[0] || null;
}

/**
 * Interface for new alumni registration input
 */
export interface CreateAlumniInput {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  degree?: string;
  graduation_year: string;
  department_id: number;
  institute?: string;
  company?: string;
  role?: string;
  industry?: string;
  location?: string;
  experience_years?: number;
  linkedin_url?: string;
  bio?: string;
  avatar_url?: string;
  verified?: boolean;
  verification_method?: "email" | "mobile" | "enrollment_number" | "admin_approval" | "linkedin";
  skills?: string[];
  achievements?: string[];
}

/**
 * Inserts a member and their skills/achievements inside a transaction
 * Triggers in Postgres will automatically increment departments.alumni_count!
 */
export async function createMember(input: CreateAlumniInput) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // Clean and validate inputs
    const cleanBio = input.bio ? input.bio.slice(0, 500) : null;
    const cleanYear = String(input.graduation_year || "2025").slice(0, 4);
    const degree = input.degree || "B.Tech";
    const institute = input.institute || "Tolani F. G. Polytechnic";
    const verified = input.verified !== undefined ? input.verified : true;
    const verificationMethod = input.verification_method || "email";
    const dob = input.dob && input.dob.trim() !== "" ? input.dob.trim() : null;
    const gender = input.gender && ["male", "female", "other", "prefer_not_to_say"].includes(input.gender) ? input.gender : null;
    const expYears = input.experience_years !== undefined && !isNaN(Number(input.experience_years)) ? Number(input.experience_years) : null;

    // Insert into members table
    const memberInsertQuery = `
      INSERT INTO members (
        name, email, phone, dob, gender, degree, graduation_year,
        department_id, institute, company, role, industry, location,
        experience_years, linkedin_url, bio, avatar_url, verified, verification_method
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19
      )
      RETURNING *;
    `;

    const memberValues = [
      input.name.trim(),
      input.email.trim().toLowerCase(),
      input.phone?.trim() || null,
      dob,
      gender,
      degree,
      cleanYear,
      input.department_id,
      institute,
      input.company?.trim() || null,
      input.role?.trim() || null,
      input.industry?.trim() || null,
      input.location?.trim() || null,
      expYears,
      input.linkedin_url?.trim() || null,
      cleanBio,
      input.avatar_url || "/avatars/m1.jpg",
      verified,
      verificationMethod,
    ];

    const memberResult = await client.query(memberInsertQuery, memberValues);
    const newMember = memberResult.rows[0];

    // Handle Skills
    const skillList: string[] = [];
    if (Array.isArray(input.skills) && input.skills.length > 0) {
      for (const rawSkill of input.skills) {
        const skillName = rawSkill.trim();
        if (!skillName) continue;

        // Upsert skill in skills master
        const skillRes = await client.query(
          `INSERT INTO skills (name) VALUES ($1)
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id;`,
          [skillName]
        );
        const skillId = skillRes.rows[0].id;

        // Link in member_skills
        await client.query(
          `INSERT INTO member_skills (member_id, skill_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING;`,
          [newMember.id, skillId]
        );
        skillList.push(skillName);
      }
    }

    // Handle Achievements
    const achievementList: string[] = [];
    if (Array.isArray(input.achievements) && input.achievements.length > 0) {
      for (const rawAch of input.achievements) {
        const title = typeof rawAch === "string" ? rawAch.trim() : "";
        if (!title) continue;

        await client.query(
          `INSERT INTO member_achievements (member_id, title, year)
           VALUES ($1, $2, $3);`,
          [newMember.id, title, cleanYear]
        );
        achievementList.push(title);
      }
    }

    // Audit Log entry
    await client.query(
      `INSERT INTO audit_log (action, entity_type, entity_id, metadata)
       VALUES ($1, $2, $3, $4);`,
      [
        "CREATE_ALUMNI",
        "members",
        String(newMember.id),
        JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          department_id: newMember.department_id,
        }),
      ]
    );

    await client.query("COMMIT");

    return {
      ...newMember,
      skills: skillList,
      achievements: achievementList,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
