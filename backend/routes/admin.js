import express from "express";
import { getCourseProgressController } from "../controllers/adminController.js";

const router = express.Router();

router.get("/courseProgress/:courseId", getCourseProgressController);

export default router;
