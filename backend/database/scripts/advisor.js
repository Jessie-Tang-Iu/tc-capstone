import { query } from "../../database/db.js";

// Get all advisors ordered by name
export async function getAllAdvisors() {
  const result  = await query(`SELECT * FROM public.users WHERE role = 'advisor' ORDER BY first_name ASC`);
  return result.rows;
}

// Get advisor by advisorId
export async function getAdvisorById(id) {
  const result = await query(`SELECT * FROM public.users WHERE clerk_id = $1 AND role = 'advisor'`, 
    [id]
);
  if (!result.rows.length) throw new Error("Not found");
  return result.rows[0];
}