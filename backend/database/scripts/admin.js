import { query } from "../db.js";

export async function getCourseProgress(courseId) {
  const result = await query(
    `
    SELECT 
      u.clerk_id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      ucp.completed_lessons,
      ucp.total_lessons,
      ucp.completed
    FROM user_course_progress ucp
    JOIN users u ON ucp.user_id = u.clerk_id
    WHERE ucp.course_id = $1
    ORDER BY u.last_name ASC, u.first_name ASC
    `,
    [courseId]
  );

  return result.rows;
}
