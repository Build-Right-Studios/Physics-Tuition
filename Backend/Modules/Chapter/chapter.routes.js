import express from "express";
import { addChapter } from "./Controller/addChapter.js";
import { getChapters } from "./Controller/getChapters.js";

const router = express.Router();

router.post("/add", addChapter);
router.get("/get", getChapters);

export default router;