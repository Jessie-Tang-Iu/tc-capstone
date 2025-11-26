import e from "express";
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
        correct_answer: q.correct_answer,
      }));
    }
  }

  let firstIncompleteIndex = lessons.findIndex((l) => !l.completed);
  if (firstIncompleteIndex === -1) firstIncompleteIndex = lessons.length;

  lessons.forEach((lesson, index) => {
    const isNextLesson = index === firstIncompleteIndex;
    const isCompleted = lesson.completed;
    lesson.locked = !isCompleted && !isNextLesson;
  });

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

export async function getCourseAdmin(courseId) {
  courseId = parseInt(courseId, 10);

  const courseRes = await query(
    `SELECT * FROM courses WHERE id = $1`,
    [courseId]
  );

  if (courseRes.rows.length === 0) return null;

  const course = courseRes.rows[0];

  const lessonsRes = await query(
    `SELECT * FROM lessons WHERE course_id = $1 ORDER BY position ASC`,
    [courseId]
  );

  const lessons = [];

  for (const l of lessonsRes.rows) {
    if (l.type === "lesson") {
      lessons.push({
        id: l.id,
        type: "lesson",
        title: l.title,
        content: l.content,
        video_url: l.video_url,
        position: l.position,
      });
    }

    if (l.type === "quiz") {
      // Fetch quiz questions for this quiz
      const questionsRes = await query(
        `SELECT id, question, answers, correct_answer 
         FROM quiz_questions 
         WHERE lesson_id = $1
         ORDER BY id ASC`,
        [l.id]
      );

      lessons.push({
        id: l.id,
        type: "quiz",
        title: l.title,
        description: l.content,
        questions: questionsRes.rows.map((q) => ({
          id: q.id,
          question: q.question,
          answers: q.answers,
          correctAnswer: q.correct_answer,
        })),
        position: l.position,
      });
    }
  }

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

export async function createCourse(coursePayload) {
  const { course, lessons } = coursePayload;
  const { title, description, level, duration, type } = course;
  
  console.log(course);

  console.log("Creating course with lessons:", lessons);

  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  const lessonCount = lessons.length;

  const insertRes = await query(
    `INSERT INTO courses (title, description, level, duration, type, lesson_count)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, level, duration, type, lessonCount]
  );

  const newCourse = insertRes.rows[0];

  // Now loop through lessons and add them
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    if (lesson.type === "lesson") {
      await query(
        `INSERT INTO lessons (course_id, title, content, video_url, type, position)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newCourse.id, lesson.title, lesson.content || "", lesson.video_url || "", "lesson", lesson.position]
      );
    } else if (lesson.type === "quiz") {
      const lessonRes = await query(
        `INSERT INTO lessons (course_id, title, content, type, position)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [newCourse.id, lesson.title, lesson.description || "", "quiz", lesson.position]
      );
      const lessonId = lessonRes.rows[0].id;

      for (const q of lesson.questions) {
        await query(
          `INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
           VALUES ($1, $2, $3, $4)`,
          [lessonId, q.question, q.answers, q.correct_answer]
        );
      }
    }
  }

  return newCourse;
}

export async function editCourse(courseId, coursePayload) {
  const { course, lessons } = coursePayload;
  const { title, description, level, duration, type } = course;

  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  const lessonCount = lessons.length;

  // Update course details
  const updateRes = await query(
    `UPDATE courses
     SET title = $1,
         description = $2,
         level = $3,
         duration = $4,
         type = $5,
         lesson_count = $6
     WHERE id = $7
     RETURNING *`,
    [title, description, level, duration, type, lessonCount, courseId]
  );

  const updatedCourse = updateRes.rows[0];
  if (!updatedCourse) throw new Error("Course not found");

  // Remove old lessons and related quiz questions
  await query(`DELETE FROM quiz_questions WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id = $1)`, [courseId]);
  await query(`DELETE FROM lessons WHERE course_id = $1`, [courseId]);

  // Re-insert lessons and quizzes by looping through the new lessons
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];

    // Inserts a lesson normally.
    if (lesson.type === "lesson") {
      await query(
        `INSERT INTO lessons (course_id, title, content, video_url, type, position)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [courseId, lesson.title, lesson.content || "", lesson.video_url || "", "lesson", lesson.position]
      );
    }

    // When inserting quizzes, we still need to create a lesson but also questions linked to the lesson
    if (lesson.type === "quiz") {
      const quizRes = await query(
        `INSERT INTO lessons (course_id, title, content, type, position)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [courseId, lesson.title, lesson.description || "", "quiz", lesson.position]
      );

      const quizLessonId = quizRes.rows[0].id;

      for (const q of lesson.questions) {
        await query(
          `INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
           VALUES ($1, $2, $3, $4)`,
          [quizLessonId, q.question, q.answers, q.correct_answer]
        );
      }
    }
  }

  return updatedCourse;
}


export async function deleteCourseById(courseId) {
  if (!courseId) throw new Error("Course ID is required");

  await query(
    `DELETE FROM courses WHERE id = $1`,
    [courseId]
  );

  console.log(`Course ${courseId} and all related data deleted.`);
}