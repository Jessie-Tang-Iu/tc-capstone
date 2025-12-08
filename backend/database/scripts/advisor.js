import { query } from "../../database/db.js";

// Get all advisors ordered by name
export async function getAllAdvisors() {
  const result  = await query(`SELECT * FROM public.users u
                                LEFT OUTER JOIN advisors a
                                ON u.clerk_id = a.clerk_id
                                LEFT OUTER JOIN advisory_profile ap
                                ON u.clerk_id = ap.advisor_id
                                WHERE role = 'advisor' 
                                ORDER BY first_name ASC`);
  return result.rows;
}

// Get advisor by advisorId
export async function getAdvisorById(id) {
  const result = await query(`SELECT * FROM public.users u
                              JOIN advisors a
                              ON u.clerk_id = a.clerk_id
                              LEFT OUTER JOIN advisory_profile ap
                              ON u.clerk_id = ap.advisor_id
                              WHERE u.clerk_id = $1 AND role = 'advisor'`, 
    [id]
);
  if (!result.rows.length) throw new Error("Not found");
  return result.rows[0];
}

export async function updateAdvisorProfile(advisorProfile) {
    const { advisorId, education, experience, skill1, skill2, skill3 } = advisorProfile;

    const existingProfile = await query(
        `SELECT * FROM advisory_profile WHERE advisor_id = $1`,
        [advisorId]
    );
    if (existingProfile.rows.length) {
        const result = await query(
            `UPDATE advisory_profile 
            SET education = $1, experience = $2, skill_1 = $4, skill_2 = $5, skill_3 = $6
            WHERE advisor_id = $3
            RETURNING *;`,
            [education, experience, advisorId, skill1, skill2, skill3]
        );    
        return result.rows[0];
    } else {
        const result = await query(
          `INSERT INTO advisory_profile (advisor_id, education, experience, skill_1, skill_2, skill_3)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;`,
          [advisorId, education, experience, skill1, skill2, skill3]
        );
        return result.rows[0];
    }
}
    