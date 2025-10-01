import { query } from "../db.js";

// ---------- USERS BASE INSERT/UPDATE ----------
async function insertUser(userData) {
    const normalizedUsername = userData.username?.toLowerCase(); // Sets username to lower case as a fallback incase this is used by another controller

    const result = await query(
        `
        INSERT INTO users (username, first_name, last_name, email, phone, role, clerk_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (clerk_id)
        DO UPDATE SET username = EXCLUDED.username,
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    role = EXCLUDED.role
        RETURNING id;
        `,
        [normalizedUsername, userData.firstName, userData.lastName, userData.email, userData.phone, userData.role, userData.clerkId]
    );

    return result.rows[0].id;
}

// ---------- ROLE-SPECIFIC HANDLERS ----------

export async function handleEmployer(userData) {
  const userId = await insertUser(userData);

  await query(
    `
    INSERT INTO employers (user_id, company_name, company_role, company_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET company_name = EXCLUDED.company_name,
                  company_role = EXCLUDED.company_role,
                  company_id = EXCLUDED.company_id;
    `,
    [userId, userData.companyName, userData.companyRole, userData.companyId || null]
  );

  return { success: true, userId };
}

export async function handleAdvisor(userData) {
  const userId = await insertUser(userData);

  await query(
    `
    INSERT INTO advisors (user_id, advisor_name, advisor_role)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET advisor_name = EXCLUDED.advisor_name,
                  advisor_role = EXCLUDED.advisor_role;
    `,
    [userId, userData.companyName, userData.companyRole]
  );

  return { success: true, userId };
}

export async function handleMember(userData) {
  const userId = await insertUser(userData);
  // Add member-specific inserts later if needed
  return { success: true, userId };
}
