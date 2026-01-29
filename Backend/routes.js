import express from "express";
import authRoutes from "./Modules/Auth/auth.routes.js"
import chapterRoutes from "./Modules/Chapter/chapter.routes.js"
import subTopicRoutes from "./Modules/SubTopic/subtopic.routes.js"

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/chapter", chapterRoutes);
router.use("/api/subtopic", subTopicRoutes);

export default router;