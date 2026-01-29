import express from "express";
import { addSubTopic } from "./Controller/addSubTopic.js"

const router = express.Router();

router.post("/add", addSubTopic);

export default router;