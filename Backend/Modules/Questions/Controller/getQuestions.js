import { getQuestionsService } from "../Service/getQuestionsService.js";

export const getQuestions = async (req, res) => {
    try {
        const { source, grade, chapter, subtopic, difficulty, page = 1, limit = 20 } = req.query;

        const data = await getQuestionsService({
            source, grade, chapter, subtopic, difficulty,
            page: parseInt(page),
            limit: parseInt(limit),
        });

        return res.status(200).json({ success: true, ...data });
    } catch (error) {
        console.error("Error in getQuestions:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to fetch questions.",
        });
    }
};