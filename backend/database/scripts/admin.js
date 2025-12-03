import { query } from "../../database/db.js";

export async function getAllAdmins() {
  const result = await query(`
    SELECT *
    FROM users u
    LEFT JOIN admin ap ON u.clerk_id = ap.admin_id
    WHERE role = 'admin'
    ORDER BY first_name ASC
  `);
  return result.rows;
}

export async function getAdminById(id) {
  const result = await query(
    `
    SELECT *
    FROM users u
    LEFT JOIN admin ap ON u.clerk_id = ap.admin_id
    WHERE u.clerk_id = $1 AND role = 'admin'
  `,
    [id]
  );

  if (!result.rows.length) throw new Error("Not found");
  return result.rows[0];
}

export async function updateAdminProfile(body) {
  const {
    userId,
    first_name,
    last_name,
    email,
    phone,
    office_location,
    department,
  } = body;

  await query(
    `
    UPDATE users
    SET first_name = $1,
        last_name = $2,
        email = $3,
        phone = $4
    WHERE clerk_id = $5
  `,
    [first_name, last_name, email, phone, userId]
  );

  const exists = await query(
    `
    SELECT * FROM admin WHERE admin_id = $1
  `,
    [userId]
  );

  if (exists.rows.length) {
    const result = await query(
      `
      UPDATE admin
      SET office_location = $1,
          department = $2
      WHERE admin_id = $3
      RETURNING *;
    `,
      [office_location, department, userId]
    );

    return result.rows[0];
  }

  const result = await query(
    `
    INSERT INTO admin (admin_id, office_location, department)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
    [userId, office_location, department]
  );

  return result.rows[0];
}
