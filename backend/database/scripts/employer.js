import { query } from "../../database/db.js";

export async function getAllEmployers() {
  const result = await query(
    `SELECT 
        u.clerk_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.status,
        e.company_name,
        e.company_role,
        e.company_id
     FROM users u
     LEFT JOIN employers e
       ON u.clerk_id = e.clerk_id
     WHERE u.role = 'employer'
     ORDER BY u.first_name ASC`
  );

  return result.rows;
}

export async function getEmployerById(clerkId) {
  const result = await query(
    `SELECT 
        u.clerk_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.status,
        e.company_name,
        e.company_role,
        e.company_id
     FROM users u
     LEFT JOIN employers e
       ON u.clerk_id = e.clerk_id
     WHERE u.clerk_id = $1
       AND u.role = 'employer'`,
    [clerkId]
  );

  if (!result.rows.length) throw new Error("Employer not found");
  return result.rows[0];
}

export async function updateEmployerProfile({
  clerk_id,
  first_name,
  last_name,
  email,
  phone,
  company_name,
  company_role,
  company_id,
}) {
  // Update users table — ALL FIELDS UPDATEABLE
  await query(
    `UPDATE users
     SET 
       first_name = $1,
       last_name = $2,
       email = $3,
       phone = $4
     WHERE clerk_id = $5`,
    [first_name, last_name, email, phone, clerk_id]
  );

  // Check existing employer row
  const existing = await query(`SELECT * FROM employers WHERE clerk_id = $1`, [
    clerk_id,
  ]);

  // If employer exists → update
  if (existing.rows.length) {
    const updated = await query(
      `UPDATE employers
       SET 
         company_name = $1,
         company_role = $2,
         company_id = $3
       WHERE clerk_id = $4
       RETURNING *`,
      [company_name, company_role, company_id, clerk_id]
    );

    return updated.rows[0];
  }

  // If not exists → insert new
  const inserted = await query(
    `INSERT INTO employers (clerk_id, company_name, company_role, company_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [clerk_id, company_name, company_role, company_id]
  );

  return inserted.rows[0];
}
