import { query } from "../db.js";

// Get all courses
export async function getAllCourses() {
  const result = await query(`SELECT * FROM courses ORDER BY created_at DESC`);
  return result.rows;
}

// Get a specific course with lessons
export async function getCourseById(courseId) {
  const course = await query(`SELECT * FROM courses WHERE id = $1`, [courseId]);
  const lessons = await query(
    `SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index ASC`,
    [courseId]
  );

  return { ...course.rows[0], lessons: lessons.rows };
}

// Create a new course
export async function createCourse(title, description, category, difficulty) {
  const result = await query(
    `INSERT INTO courses (title, description, category, difficulty)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, category, difficulty]
  );
  return result.rows[0];
}

// Add a lesson to a course
export async function addLesson(courseId, title, content, videoUrl, orderIndex = 1) {
  const result = await query(
    `INSERT INTO lessons (course_id, title, content, video_url, order_index)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [courseId, title, content, videoUrl, orderIndex]
  );
  return result.rows[0];
}

// Track or update user course progress
export async function updateUserCourseProgress(userId, courseId, progressPercent, completed = false) {
  const result = await query(
    `INSERT INTO user_course_progress (user_id, course_id, progress_percent, completed)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, course_id)
     DO UPDATE SET progress_percent = $3, completed = $4, updated_at = NOW()
     RETURNING *`,
    [userId, courseId, progressPercent, completed]
  );
  return result.rows[0];
}

// Mark lesson as completed
export async function markLessonComplete(userId, lessonId) {
  const result = await query(
    `INSERT INTO user_lesson_progress (user_id, lesson_id, completed)
     VALUES ($1, $2, true)
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET completed = true, completed_at = NOW()
     RETURNING *`,
    [userId, lessonId]
  );
  return result.rows[0];
}
