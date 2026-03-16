import { updateQuestionService } from "../Service/updateQuestionService.js";

export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw { status: 400, message: "Question ID is missing." };

        const {
            difficulty, tags, appearances,
            specialNote, statement, answer,
        } = req.body;

        const diagramImage = req.files?.diagramImage?.[0] || null;
        const optionImages = [
            req.files?.optionImage_A?.[0],
            req.files?.optionImage_B?.[0],
            req.files?.optionImage_C?.[0],
            req.files?.optionImage_D?.[0],
        ].filter(Boolean);

        const data = await updateQuestionService({
            id,
            difficulty,
            tags,
            appearances,
            specialNote,
            statement,
            answer,
            diagramImage,
            optionImages,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error in updateQuestion:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to update question.",
        });
    }
};