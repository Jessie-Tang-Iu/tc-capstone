import { getAllCourses, getCourseById, } from "../database/scripts/courses.js";

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
    const data = await getCourseById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}