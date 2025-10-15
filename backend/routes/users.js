import express from "express";
import { updateUserMetadata, fetchUserDataByID } from "../controllers/usersController.js";

const router = express.Router();

// POST /users/metadata
router.post("/metadata", updateUserMetadata);

router.get("/:clerk_id", fetchUserDataByID);

export default router;
