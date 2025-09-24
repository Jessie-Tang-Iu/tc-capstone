import { query } from "../../database/db.js";

export async function getAllJobPosts() {
  const { rows } = await query(`
    SELECT  jb.id AS id, 
            title, company, 
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
     FROM job jb  JOIN job_experience je ON jb.experience_id = je.id
                  JOIN job_industry ji ON jb.industry_id = ji.id
                  JOIN job_type jt ON jb.type_id = jt.id
                  JOIN job_workplace jw ON jb.workplace_id = jw.id
     ORDER BY posted_at ASC`);
  return rows;
}

export async function getJobPostByEmployerId(id) {
  const { rows } = await query(`
    SELECT jb.id AS id, title, company, company_info, location, status, salary_per_hour, posted_at, ji.name AS industry, je.name AS experience, jt.name AS type, jw.name AS workplace, link, description, responsibilities, requirements, details, benefits
     FROM job jb  JOIN job_experience je ON jb.experience_id = je.id
                  JOIN job_industry ji ON jb.industry_id = ji.id
                  JOIN job_type jt ON jb.type_id = jt.id
                  JOIN job_workplace jw ON jb.workplace_id = jw.id
     WHERE jb.employer_id = $1
     ORDER BY posted_at ASC`, [id]);
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

export async function createJobPost(post) {
  const query = `
    INSERT INTO job 
      (title, company, location, posted_at, industry_id, workplace_id, type_id, experience_id, salary_per_hour, link, description, responsibilities, requirements, details, benefits) 
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *;
  `;

  const values = [
    post.title,
    post.company,
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

  const { rows } = await query(query, values);
  return rows[0];
}