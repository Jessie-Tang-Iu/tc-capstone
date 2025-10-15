import { query } from "../db.js";

// ---------- USERS BASE INSERT/UPDATE ----------
async function insertUser(userData) {
    const normalizedUsername = userData.username?.toLowerCase(); // Sets username to lower case as a fallback incase this is used by another controller

    // UPDATE QUERY: after the change is made to use Clerk_ID as user ID, make sure the user table works first before changing
    const result = await query( // This attempts to insert the user, but if a clerk_id already exists we update the user instead for reusability with updating a profile
        `
        INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (clerk_id)
        DO UPDATE SET 
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          role = EXCLUDED.role
        RETURNING clerk_id;
        `,
        [userData.clerkId, normalizedUsername, userData.firstName, userData.lastName, userData.email, userData.phone, userData.role]
    );

    return result.rows[0].clerk_id;
}

// ---------- ROLE-SPECIFIC HANDLERS ----------

export async function handleEmployer(userData) {
  const userId = await insertUser(userData);

  // UPDATE QUERY: after the change is made to use Clerk_ID as user ID, make sure the user table works first before changing
  await query(
    `
    INSERT INTO employers (clerk_id, company_name, company_role, company_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (clerk_id)
    DO UPDATE SET 
      company_name = EXCLUDED.company_name,
      company_role = EXCLUDED.company_role,
      company_id = EXCLUDED.company_id;
    `,
    // Company ID can be null if not provided as we haven't started a way to link employers by company yet but plan to if time permits
    [userData.clerkId, userData.companyName, userData.companyRole, userData.companyId || null]
  );

  return { success: true, userId };
}

export async function handleAdvisor(userData) {
  const userId = await insertUser(userData);

  await query(
    `
    INSERT INTO advisors (clerk_id, advisor_name, advisor_role)
    VALUES ($1, $2, $3)
    ON CONFLICT (clerk_id)
    DO UPDATE SET 
      advisor_name = EXCLUDED.advisor_name,
      advisor_role = EXCLUDED.advisor_role;
    `,
    [userData.clerkId, userData.companyName, userData.companyRole]
  );

  return { success: true, userId };
}

export async function handleMember(userData) {
  const userId = await insertUser(userData);
  // Add member-specific inserts later as for now each account contains data the overlaps with every other role.
  return { success: true, userId };
}

// ---------- FETCH USER DATA BY CLERK ID ----------

export async function getUserdataByClerkID(clerkId) {
  const result = await query(
    `
    SELECT username, first_name, last_name
    FROM users
    WHERE clerk_id = $1;
    `,
    [clerkId]
  );

  return result.rows[0] || null;
}