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

// get all admins
export async function getAllAdminsController() {
  return await admin.getAllAdmins();
}

// get single admin
export async function getAdminByIdController(userId) {
  if (!userId) throw new Error("userId required");
  return await admin.getAdminById(userId);
}

// update profile
export async function updateAdminProfileController(body) {
  if (!body.userId) throw new Error("userId required");

  return await admin.updateAdminProfile({
    userId: body.userId,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    office_location: body.office_location,
    department: body.department,
  });
}
