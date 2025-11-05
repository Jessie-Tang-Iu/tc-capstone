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

/** Mark a lesson as completed and update course progress */
export async function markLessonComplete(userId, lessonId) {
  // Mark this lesson as complete
  await query(
    `INSERT INTO user_lesson_progress (user_id, lesson_id, completed)
     VALUES ($1, $2, true)
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET completed = true`,
    [userId, lessonId]
  );

  // Find course ID for this lesson
  const lessonRes = await query(`SELECT course_id FROM lessons WHERE id = $1`, [lessonId]);
  const courseId = lessonRes.rows[0]?.course_id;
  if (!courseId) return;

  // Count total lessons and completed lessons
  const totalRes = await query(`SELECT COUNT(*) FROM lessons WHERE course_id = $1`, [courseId]);
  const totalLessons = parseInt(totalRes.rows[0].count, 10);

  const completedRes = await query(
    `SELECT COUNT(*) FROM user_lesson_progress
     WHERE user_id = $1 AND lesson_id IN (SELECT id FROM lessons WHERE course_id = $2) AND completed = true`,
    [userId, courseId]
  );
  const completedLessons = parseInt(completedRes.rows[0].count, 10);

  // Update course progress
  await query(
    `INSERT INTO user_course_progress (user_id, course_id, completed_lessons, total_lessons, completed)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, course_id)
     DO UPDATE SET completed_lessons = $3, total_lessons = $4, completed = $5`,
    [userId, courseId, completedLessons, totalLessons, completedLessons >= totalLessons]
  );

  return { courseId, completedLessons, totalLessons };
}

/** Update course-level progress manually (e.g. after quiz submission) */
export async function updateCourseProgress(userId, courseId) {
  const totalRes = await query(`SELECT COUNT(*) FROM lessons WHERE course_id = $1`, [courseId]);
  const totalLessons = parseInt(totalRes.rows[0].count, 10);

  const completedRes = await query(
    `SELECT COUNT(*) FROM user_lesson_progress
     WHERE user_id = $1 AND lesson_id IN (SELECT id FROM lessons WHERE course_id = $2) AND completed = true`,
    [userId, courseId]
  );
  const completedLessons = parseInt(completedRes.rows[0].count, 10);

  await query(
    `INSERT INTO user_course_progress (user_id, course_id, completed_lessons, total_lessons, completed)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, course_id)
     DO UPDATE SET completed_lessons = $3, total_lessons = $4, completed = $5`,
    [userId, courseId, completedLessons, totalLessons, completedLessons >= totalLessons]
  );

  return { courseId, completedLessons, totalLessons };
}

export async function createCourse(course) {
  const { title, description, level, lesson_count, duration, type } = course;

  const [result] = await pool.query(
    `INSERT INTO courses (title, description, level, duration, type)
     VALUES ($1, $2, $3, $4, $5)`,
    [title, description, level, duration, type]
  );

  const [newCourse] = await pool.query(`SELECT * FROM courses WHERE id = ?`, [result.insertId]);
  return newCourse[0];
}