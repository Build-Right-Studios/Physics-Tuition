import { addQuestionService } from "../Service/addQuestionService.js";

export const addQuestion = async (req, res) => {
    try {
        const {
            grade, subject, chapter, subTopic,
            difficulty, specialNote, tags, appearances,
            statement, qdrantId, answer,
        } = req.body;

        if (!grade)      throw { status: 400, message: "Grade is missing." };
        if (!subject)    throw { status: 400, message: "Subject is missing." };
        if (!chapter)    throw { status: 400, message: "Chapter is missing." };
        if (!subTopic)   throw { status: 400, message: "SubTopic is missing." };
        if (!difficulty) throw { status: 400, message: "Difficulty is missing." };
        if (!statement)  throw { status: 400, message: "Statement is missing." };

        const diagramImage = req.files?.diagramImage?.[0] || null;
        const optionImages = [
            req.files?.optionImage_A?.[0],
            req.files?.optionImage_B?.[0],
            req.files?.optionImage_C?.[0],
            req.files?.optionImage_D?.[0],
        ].filter(Boolean);

        const data = await addQuestionService({
            grade, subject, chapter, subTopic,
            difficulty, specialNote, tags, appearances,
            statement, qdrantId, answer,
            diagramImage, optionImages,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error in addQuestion:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to add question.",
        });
    }
};