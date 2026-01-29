import express from "express";
import { addChapter } from "./Controller/addChapter.js"

const router = express.Router();

router.post("/add", addChapter);

export default router;