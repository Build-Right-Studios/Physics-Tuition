import { getQuestionByQdrantIdService } from "../Service/getQuestionByQdrantIdService.js";

export const getQuestionByQdrantId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw { status: 400, message: "Question ID is missing." };

        const data = await getQuestionByQdrantIdService({ qdrantId: id });
        if (!data) throw { status: 404, message: "Question not found." };

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error in getQuestionByQdrantId:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to get question.",
        });
    }
};