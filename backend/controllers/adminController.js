import * as admin from "../controllers/adminController.js";

export async function getCourseProgressController(req, res) {
  const { courseId } = req.params;

  try {
    const result = await admin.getCourseProgress(courseId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching course progress:", err);
    res.status(500).json({ error: err.message });
  }
}
