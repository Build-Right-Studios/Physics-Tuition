import { deleteQuestionService } from "../Service/deleteQuestionService.js";

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { qdrantId, source, subject } = req.query;

        if (!id)       throw { status: 400, message: "Question ID is missing." };
        if (!qdrantId) throw { status: 400, message: "Qdrant ID is missing." };
        if (!source)   throw { status: 400, message: "Source is missing." };
        if (!subject)  throw { status: 400, message: "Subject is missing." };

        await deleteQuestionService({ id, qdrantId, source, subject });

        return res.status(200).json({
            success: true,
            message: "Question deleted successfully.",
        });
    } catch (error) {
        console.error("Error in deleteQuestion:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to delete question.",
        });
    }
};