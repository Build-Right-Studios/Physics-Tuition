import Chapter from "../../../MongoDb/Chapter.js";

export const getChapterQuery = async (userData) => {
    try {
        const {grade, subject, chapterNo, chapterName} = userData;
        const existingChapter = await Chapter.findOne({grade, subject, chapterNo, chapterName});

        return existingChapter;
    } catch (error) {
        console.error("Error in getChapterQuery:", error);
        throw new Error("Failed to get Chapters.")
    }
}

export const addChapterQuery = async (userData) => {
    try {
        const {id, grade, subject, chapterNo, chapterName, slug} = userData;
        const newChapter = new Chapter({_id: id, grade, subject, chapterNo, chapterName, slug});
        const savedChapter = await newChapter.save();

        return savedChapter.toObject();
    } catch (error) {
        console.error("Error in addChapterQuery:", error);
        throw new Error("Failed to add Chapter.")
    }
}