import Chapter from "../../../MongoDb/Chapter.js";

export const getChapterQuery = async (userData) => {
    try {
        const {grade, subject, chapterNumber, chapterName} = userData;
        const existingChapter = await Chapter.findOne({grade, subject, chapterNumber, chapterName});
        return existingChapter;
    } catch (error) {
        console.error("Error in getChapterQuery:", error);
        throw new Error("Failed to get Chapters.")
    }
}

export const addChapterQuery = async (userData) => {
    try {
        const {id, grade, subject, chapterNumber, chapterName, slug} = userData;
        const newChapter = new Chapter({_id: id, grade, subject, chapterNumber, chapterName, slug});
        const savedChapter = await newChapter.save();
        return savedChapter.toObject();
    } catch (error) {
        console.error("Error in addChapterQuery:", error);
        throw new Error("Failed to add Chapter.")
    }
}