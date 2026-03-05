import { getChapterQuery, addChapterQuery } from "../Query/addChapterQuery.js"

export const getChapterInternal = async (userData) => {
    try {
        const {grade, subject, chapterNumber, chapterName} = userData;
        const existingChapter = await getChapterQuery({grade, subject, chapterNumber, chapterName})
        return existingChapter;
    } catch (error) {
        console.error("Error in getChapterInternal:", error);
        throw error;
    }
}

export const addChapterInternal = async (userData) => {
    try {
        const {id, grade, subject, chapterNumber, chapterName, slug} = userData;
        const newChapter = await addChapterQuery({id, grade, subject, chapterNumber, chapterName, slug})
        return newChapter;
    } catch (error) {
        console.error("Error in addChapterInternal:", error);
        throw error;
    }
}