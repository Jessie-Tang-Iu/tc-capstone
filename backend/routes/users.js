import express from "express";
import { createUserMetadata, fetchUserDataByID } from "../controllers/usersController.js";

const router = express.Router();

// POST /users/metadata
router.post("/metadata", createUserMetadata);

router.get("/:clerk_id", fetchUserDataByID);

export default router;
