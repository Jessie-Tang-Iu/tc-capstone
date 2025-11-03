import { query } from "../db.js";

// Get all courses
export async function getAllCourses() {
  const result = await query(`SELECT * FROM courses ORDER BY created_at DESC`);
  return result.rows;
}

export async function getCourseById(courseId, userId) {
  courseId = parseInt(courseId, 10);
  console.log("Fetching course with ID:", courseId, "for user:", userId);

  // Fetch course
  const courseRes = await query(`SELECT * FROM courses WHERE id = $1`, [courseId]);
  if (courseRes.rows.length === 0) return null;
  const course = courseRes.rows[0];

  // Fetch lessons
  const lessonsRes = await query(
    `SELECT * FROM lessons WHERE course_id = $1 ORDER BY position ASC`,
    [courseId]
  );
  const lessons = lessonsRes.rows;

  // Fetch user lesson progress
  const progressRes = await query(
    `SELECT lesson_id, completed
     FROM user_lesson_progress
     WHERE user_id = $1
       AND lesson_id IN (SELECT id FROM lessons WHERE course_id = $2)`,
    [userId, courseId]
  );

  const progressMap = Object.fromEntries(
    progressRes.rows.map((p) => [p.lesson_id, p.completed])
  );

  // Attach completion status and quiz data
  for (let lesson of lessons) {
    lesson.completed = !!progressMap[lesson.id];

    if (lesson.type === "quiz") {
      const questionsRes = await query(
        `SELECT question, answers, correct_answer
         FROM quiz_questions
         WHERE lesson_id = $1
         ORDER BY id ASC`,
        [lesson.id]
      );

      lesson.questions = questionsRes.rows.map((q) => ({
        question: q.question,
        answers: q.answers,
        correctAnswer: q.correct_answer,
      }));
    }
  }

  // Fetch user course progress summary
  const courseProgressRes = await query(
    `SELECT completed_lessons, total_lessons, completed
     FROM user_course_progress
     WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );

  course.user_progress = courseProgressRes.rows[0] || {
    completed_lessons: 0,
    total_lessons: lessons.length,
    completed: false,
  };

  return { ...course, lessons };
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
