import { getAllCourses, getCourseById, createCourse, markLessonComplete, updateCourseProgress } from "../database/scripts/courses.js";

export async function getAllCoursesController(req, res) {
  try {
    const data = await getAllCourses();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCourseByIdController(req, res) {
  try {
    console.log("Backend received ID:", req.params.id);
    const data = await getCourseById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: err.message });
  }
}

export const createCourseController = async (req, res) => {
  try {
    const newCourse = await createCourse(req.body);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** Mark a lesson as completed and update course progress */
export async function markLessonCompleteController(req, res) {
  console.log("Progress endpoint hit:", req.body);
  try {
    const { userId, lessonId } = req.body;
    if (!userId || !lessonId)
      return res.status(400).json({ error: "Missing userId or lessonId" });

    const progress = await markLessonComplete(userId, lessonId);
    res.status(200).json({ message: "Lesson marked complete", progress });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: err.message });
  }
}

/** Update course progress manually (optional for quiz completion) */
export async function updateCourseProgressController(req, res) {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId)
      return res.status(400).json({ error: "Missing userId or courseId" });

    const progress = await updateCourseProgress(userId, courseId);
    res.status(200).json({ message: "Course progress updated", progress });
  } catch (err) {
    console.error("Error updating course progress:", err);
    res.status(500).json({ error: err.message });
  }
}
