import express from "express";
import { addStudent } from "./Controller/addStudent.js"
import { getStudents } from "./Controller/getStudents.js";

const router = express.Router();

router.post("/add-student", addStudent);
router.get("/students", getStudents);

export default router;