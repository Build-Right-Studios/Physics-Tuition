import { generateAssignmentService } from "../Service/generateAssignmentService.js";

export const generateAssignment = async (req, res) => {
    try {
        console.log("📥 FULL REQUEST BODY:");
        console.dir(req.body, { depth: null });
        const { questions, grade, subject, chapter, difficulty, title } = req.body;

        if (!questions?.length) throw { status: 400, message: "No questions provided." };
        if (!grade)             throw { status: 400, message: "Grade is missing." };
        if (!subject)           throw { status: 400, message: "Subject is missing." };
        if (!chapter)           throw { status: 400, message: "Chapter is missing." };

        console.log("📥 QUESTIONS ARRAY:");
        console.dir(questions, { depth: null });

        const data = await generateAssignmentService({
            questions, grade, subject, chapter, difficulty, title,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error in generateAssignment:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to generate assignment.",
        });
    }
};