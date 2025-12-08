import * as admin from "../database/scripts/admin.js";

export async function getCourseProgressController(req, res) {
    const { courseId } = req.params;

    console.log("Fetching progress for course ID:", courseId);
    try {
        const result = await admin.getCourseProgress(courseId);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching course progress:", err);
        res.status(500).json({ error: err.message });
    }
}
