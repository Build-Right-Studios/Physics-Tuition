import express from "express";
import multer from "multer";
import { addQuestion } from "./Controller/addQuestion.js";
import { getQuestionByQdrantId } from "./Controller/getQuestionByQdrantId.js";
import { updateQuestion } from "./Controller/updateQuestionController.js";
import { getQuestions } from "./Controller/getQuestions.js";
import { deleteQuestion } from "./Controller/deleteQuestion.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const questionFields = [
    { name: "diagramImage",  maxCount: 1 },
    { name: "optionImage_A", maxCount: 1 },
    { name: "optionImage_B", maxCount: 1 },
    { name: "optionImage_C", maxCount: 1 },
    { name: "optionImage_D", maxCount: 1 },
];

router.post("/add",  upload.fields(questionFields), addQuestion);
router.get("/get", getQuestions);
router.get("/:id",   getQuestionByQdrantId);
router.patch("/:id", upload.fields(questionFields), updateQuestion);
router.delete("/:id",  deleteQuestion);


export default router;