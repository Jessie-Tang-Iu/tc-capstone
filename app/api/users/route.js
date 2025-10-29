import { NextResponse } from "next/server";
import { query } from "@/backend/database/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let sql = "";
    let params = [];

    switch (role) {
      case "advisor":
        sql = `
          SELECT u.clerk_id, u.first_name, u.last_name, u.email, u.username, u.status, 
                 a.company_name, a.company_role, ap.education, ap.experience
          FROM users u
          JOIN advisors a ON u.clerk_id = a.clerk_id
          LEFT JOIN advisory_profile ap ON u.clerk_id = ap.advisor_id
          WHERE u.role = 'advisor'
          ORDER BY u.first_name ASC
        `;
        break;

      case "employer":
        sql = `
          SELECT u.clerk_id, u.first_name, u.last_name, u.email, u.username, u.status,
                 e.company_name, e.company_role
          FROM users u
          JOIN employers e ON u.clerk_id = e.clerk_id
          WHERE u.role = 'employer'
          ORDER BY u.first_name ASC
        `;
        break;

      case "admin":
        sql = `
          SELECT clerk_id, first_name, last_name, email, username, status
          FROM users
          WHERE role = 'admin'
          ORDER BY first_name ASC
        `;
        break;

      case "member":
        sql = `
          SELECT clerk_id, first_name, last_name, email, username, status
          FROM users
          WHERE role = 'member'
          ORDER BY first_name ASC
        `;
        break;

      default:
        sql = "SELECT * FROM users ORDER BY first_name ASC";
    }

    const result = await query(sql, params);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
