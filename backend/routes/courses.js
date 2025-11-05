import express from "express";
import { 
    getAllCoursesController, 
    getCourseByIdController, 
    createCourseController, 
    markLessonCompleteController, 
    updateCourseProgressController,
    deleteCourseController,
    editCourseController,
} from "../controllers/coursesController.js";

const router = express.Router();

// GET all courses
router.get("/", getAllCoursesController);

// GET a single course with user progress
// Example: /api/course/1?userId=USER123
router.get("/:id", getCourseByIdController);

// POST new course
// Example body: { title, description, level, duration, type, contentBlocks: [...] }
router.post("/", createCourseController);

// PUT update course by ID
// Same as creating but just updates an existing course
router.put("/:id", editCourseController);

// DELETE a course by ID
router.delete("/:id", deleteCourseController);

// POST lesson completion
// Example body: { "userId": "USER123", "lessonId": 5 }
router.post("/progress", markLessonCompleteController);

// POST course progress update (optional, e.g. after finishing a quiz)
// Example body: { "userId": "USER123", "courseId": 1 }
router.post("/progress/course", updateCourseProgressController);

export default router;
