import express from "express";
import authRoutes from "./Modules/Auth/auth.routes.js"
import userRoutes from "./Modules/User/user.routes.js"
import chapterRoutes from "./Modules/Chapter/chapter.routes.js"
import subTopicRoutes from "./Modules/SubTopic/subtopic.routes.js"
import questionsRoutes from "./Modules/Questions/questions.routes.js"
import assignmentRoutes from "./Modules/Assignment/assignment.routes.js"

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes)
router.use("/api/chapter", chapterRoutes);
router.use("/api/subtopic", subTopicRoutes);
router.use("/api/questions", questionsRoutes);
router.use("/api/assignments", assignmentRoutes);

export default router;