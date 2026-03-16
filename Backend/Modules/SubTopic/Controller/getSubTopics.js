import { getSubTopicsService } from "../Service/getSubTopicsService.js";

export const getSubTopics = async (req, res) => {
    try {
        const { chapterName } = req.query;

        if (!chapterName) throw { status: 400, message: "Chapter name is required" };

        const subTopics = await getSubTopicsService({ chapterName });

        return res.status(200).json({
            success: true,
            data: subTopics
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to fetch subtopics."
        });
    }
};