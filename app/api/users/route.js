import { NextResponse } from "next/server";
import { query } from "@/backend/database/db.js";
import { auth, clerkClient } from '@clerk/nextjs/server'
// import { getAuth } from "@clerk/express";
import { createUserMetadata } from "@/backend/controllers/usersController";

const client = await clerkClient()

// const userList = await client.users.getUserList()
// console.log("API user: ", userList)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status"); // <--- added

    let sql = "";
    const params = [];

    const statusFilter = status ? ` AND u.status = '${status}' ` : ""; // optional filter

    switch (role) {
      case "advisor":
        sql = `
          SELECT u.clerk_id, u.first_name, u.last_name, u.email, u.username, u.status,
                 a.company_name, a.company_role, ap.education, ap.experience
          FROM users u
          JOIN advisors a ON u.clerk_id = a.clerk_id
          LEFT JOIN advisory_profile ap ON u.clerk_id = ap.advisor_id
          WHERE u.role = 'advisor'
          ${statusFilter}
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
          ${statusFilter}
          ORDER BY u.first_name ASC
        `;
        break;

      default:
        sql = `
          SELECT clerk_id, first_name, last_name, email, username, status, role
          FROM users
          ${status ? `WHERE status = '${status}'` : ""}
          ORDER BY first_name ASC
        `;
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

export async function POST(req) {
  try {
    const body = await req.json();
    if (body.role == 'member') {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
      }
    }

    const newUser = await createUserMetadata(body)
    // console.log("New user api: ", newUser)
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("API POST /users error: ", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
