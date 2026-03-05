import { getChaptersService } from "../Service/getChaptersService.js"

export const getChapters = async (req, res) => {
    try {
        const { grade, subject } = req.query;

        if (!grade) throw { status: 400, message: "Grade is required" };
        if (!subject) throw { status: 400, message: "Subject is required" };

        const chapters = await getChaptersService({ grade, subject });

        return res.status(200).json({
            success: true,
            data: chapters
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to fetch chapters."
        });
    }
};
