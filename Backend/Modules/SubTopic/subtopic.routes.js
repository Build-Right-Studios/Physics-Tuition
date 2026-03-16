import express from "express";
import { addSubTopic } from "./Controller/addSubTopic.js"
import { getSubTopics } from "./Controller/getSubTopics.js"

const router = express.Router();

router.post("/add", addSubTopic);
router.get("/get", getSubTopics);

export default router;