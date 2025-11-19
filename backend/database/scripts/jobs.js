import { query } from "../../database/db.js";

// Get all job posts (admin-friendly)
export async function getAllJobPosts() {
  const { rows } = await query(`
    SELECT  jb.id AS id, 
            e.company_name AS company,
            title, 
            company_info, 
            location, 
            status, 
            salary_per_hour, 
            posted_at, 
            ji.name AS industry, 
            je.name AS experience, 
            jt.name AS type, 
            jw.name AS workplace, 
            link, 
            description, 
            responsibilities, 
            requirements, 
            details, 
            benefits,
            questions
     FROM job jb  JOIN job_experience je  ON jb.experience_id = je.id
                  JOIN job_industry ji    ON jb.industry_id = ji.id
                  JOIN job_type jt        ON jb.type_id = jt.id
                  JOIN job_workplace jw   ON jb.workplace_id = jw.id
                  JOIN employers e        ON jb.employer_id = e.clerk_id
     ORDER BY posted_at ASC`);
  return rows;
}

export async function getJobPostById(id) {
  const { rows } = await query(
    `
      SELECT jb.id AS id,
          e.company_name AS company,
          title,
          company_info,
          location,
          status,
          salary_per_hour,
          posted_at,
          ji.id AS industry_id,
          ji.name AS industry,
          je.id AS experience_id,
          je.name AS experience,
          jt.id AS type_id,
          jt.name AS type,
          jw.id AS workplace_id,
          jw.name AS workplace,
          link,
          description,
          responsibilities,
          requirements,
          details,
          benefits
    FROM job jb
    JOIN job_experience je ON jb.experience_id = je.id
    JOIN job_industry ji ON jb.industry_id = ji.id
    JOIN job_type jt ON jb.type_id = jt.id
    JOIN job_workplace jw ON jb.workplace_id = jw.id
    JOIN employers e ON jb.employer_id = e.clerk_id
    WHERE jb.id = $1
  `,
    [id]
  );
  return rows[0];
}

export async function getJobPostByEmployerId(id) {
  const { rows } = await query(
    `
    SELECT jb.id AS id, title, e.company_name AS company, company_info, location, status, salary_per_hour, posted_at, ji.name AS industry, je.name AS experience, jt.name AS type, jw.name AS workplace, link, description, responsibilities, requirements, details, benefits
     FROM job jb  JOIN job_experience je  ON jb.experience_id = je.id
                  JOIN job_industry ji    ON jb.industry_id = ji.id
                  JOIN job_type jt        ON jb.type_id = jt.id
                  JOIN job_workplace jw   ON jb.workplace_id = jw.id
                  JOIN employers e        ON jb.employer_id = e.clerk_id
     WHERE jb.employer_id = $1
     ORDER BY posted_at ASC`,
    [id]
  );
  return rows;
}

export async function getAllJobExperience() {
  const { rows } = await query(`SELECT * FROM job_experience ORDER BY id ASC`);
  return rows;
}

export async function getAllJobIndustries() {
  const { rows } = await query(`SELECT * FROM job_industry ORDER BY id ASC`);
  return rows;
}

export async function getAllJobTypes() {
  const { rows } = await query(`SELECT * FROM job_type ORDER BY id ASC`);
  return rows;
}

export async function getAllJobWorkplaces() {
  const { rows } = await query(`SELECT * FROM job_workplace ORDER BY id ASC`);
  return rows;
}

//employer DashBoard
export async function getAllJobPostsPublic() {
  const { rows } = await query(`
    SELECT 
      jb.id,
      jb.title,
      jb.company_info,
      jb.location,
      jb.salary_per_hour,
      jb.posted_at,
        jb.status,   
      ji.name AS industry,
      jt.name AS type,
      jw.name AS workplace,
      je.name AS experience,
      jb.link,
      jb.description,
      jb.responsibilities,
      jb.requirements,
      jb.details,
      jb.benefits
    FROM job jb
      JOIN job_industry ji ON jb.industry_id = ji.id
      JOIN job_type jt ON jb.type_id = jt.id
      JOIN job_workplace jw ON jb.workplace_id = jw.id
      JOIN job_experience je ON jb.experience_id = je.id
    ORDER BY jb.posted_at DESC;
  `);
  return rows;
}

// Create new job post (admin version)
export async function createJobPost(post) {
  const sql = `
    INSERT INTO job 
      (title, employer_id, company_info, location, posted_at, industry_id, workplace_id, type_id, experience_id,
       salary_per_hour, link, description, responsibilities, requirements, details, benefits)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *;
  `;

  const values = [
    post.title,
    post.employerId || "testEmployer1", // fallback for testing
    post.aboutCompany || post.company_info || "",
    post.location,
    post.postedAt,
    post.industryId,
    post.workplaceId,
    post.typeId,
    post.experienceId,
    post.salaryPerHour,
    post.link,
    post.description,
    post.responsibilities,
    post.requirements,
    post.details,
    post.benefits,
  ];

  const { rows } = await query(sql, values);
  return rows[0];
}
// Update an existing job post
export async function updateJobPost(id, data) {
  if (!id) throw new Error("Missing job ID");

  const { rows } = await query(
    `UPDATE job
     SET title = $1,
         employer_id = $2,
         company_info = $3,
         location = $4,
         industry_id = $5,
         workplace_id = $6,
         type_id = $7,
         experience_id = $8,
         salary_per_hour = $9,
         link = $10,
         description = $11,
         responsibilities = $12,
         requirements = $13,
         details = $14,
         benefits = $15
     WHERE id = $16
     RETURNING *;`,
    [
      data.title,
      data.employerId || "testEmployer1", // fallback for test
      data.aboutCompany || data.company_info || "",
      data.location,
      data.industryId,
      data.workplaceId,
      data.typeId,
      data.experienceId,
      data.salaryPerHour,
      data.link,
      data.description,
      data.responsibilities,
      data.requirements,
      data.details,
      data.benefits,
      id,
    ]
  );

  if (!rows.length) throw new Error("Job not found");
  return rows[0];
}
