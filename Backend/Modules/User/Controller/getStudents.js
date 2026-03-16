import { getStudentsService } from "../Service/getStudentsService.js";

export const getStudents = async (req, res) => {
    try {
        const { grade } = req.query;

        const data = await getStudentsService({ grade });

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error in getStudents:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to get students.",
        });
    }
};