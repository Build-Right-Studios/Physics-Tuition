import { addChapterService } from "../Service/addChapterService.js"

export const addChapter = async (req, res) => {
    try {
        const { grade, subject, chapterNumber, chapterName } = req.body;
        if (!grade) { throw { status: 400, message: "Grade is missing." };}
        if (!subject) { throw { status: 400, message: "Subject is missing." };}
        if (!chapterNumber) { throw { status: 400, message: "Chapter Number is missing." };}
        if (!chapterName) { throw { status: 400, message: "Chapter Name is missing." };}

        const data = await addChapterService({ grade, subject, chapterNumber, chapterName });

        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.error("Error in addChapter:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to add Chapter.",
        });
    }
}
