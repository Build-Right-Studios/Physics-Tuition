import express from "express";
import { addSubTopic } from "./Controller/addSubTopic.js"
// import { getSubTopic } from "./Controller/getSubTopic.js"

const router = express.Router();

router.post("/add", addSubTopic);
// router.get("/get", getSubTopic);

export default router;