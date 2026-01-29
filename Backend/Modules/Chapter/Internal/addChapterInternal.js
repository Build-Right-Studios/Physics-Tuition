import { getChapterQuery, addChapterQuery } from "../Query/addChapterQuery.js"

export const getChapterInternal = async (userData) => {
    try {
        const {grade, subject, chapterNo, chapterName} = userData;
        const existingChapter = await getChapterQuery({grade, subject, chapterNo, chapterName})
        return existingChapter;
    } catch (error) {
        console.error("Error in getChapterInternal:", error);
        throw new Error("Failed to get Chapters.")
    }
}

export const addChapterInternal = async (userData) => {
    try {
        const {id, grade, subject, chapterNo, chapterName, slug} = userData;
        const newChapter = await addChapterQuery({id, grade, subject, chapterNo, chapterName, slug})
        return newChapter;
    } catch (error) {
        console.error("Error in addChapterInternal:", error);
        throw new Error("Failed to add Chapter.")
    }
}