import express from "express";
import { addStudent } from "./Controller/addStudent.js"

const router = express.Router();

router.post("/add-student", addStudent);

export default router;