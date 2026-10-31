import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const dbTest = await query("SELECT current_database(), now() as server_time;");
    const departmentsRes = await query(
      `SELECT id, name, short_name, slug, alumni_count 
       FROM departments 
       WHERE id IN (1, 2) 
       ORDER BY id ASC;`
    );

    const membersCount = await query(
      `SELECT department_id, count(*) as count 
       FROM members 
       WHERE department_id IN (1, 2) 
       GROUP BY department_id;`
    );

    return NextResponse.json({
      status: "healthy",
      database: dbTest.rows[0]?.current_database,
      server_time: dbTest.rows[0]?.server_time,
      departments: departmentsRes.rows.map((d) => {
        const memCount = membersCount.rows.find((m) => m.department_id === d.id);
        return {
          id: d.id,
          name: d.name,
          slug: d.slug,
          alumni_count_in_dept_table: d.alumni_count,
          actual_members_in_db: parseInt(memCount?.count || "0", 10),
        };
      }),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
