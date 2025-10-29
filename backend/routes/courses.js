import express from "express";
import { getAllCoursesController, getCourseByIdController, } from "../controllers/coursesController.js";

const router = express.Router();

// GET all courses
router.get("/", getAllCoursesController);

// GET single course with lessons
router.get("/:id", getCourseByIdController);

export default router;
