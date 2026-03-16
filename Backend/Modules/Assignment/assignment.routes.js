import express from "express";
import { generateAssignment } from "./Controller/generateAssignmentController.js";

const router = express.Router();

router.post("/generate", generateAssignment);

export default router;