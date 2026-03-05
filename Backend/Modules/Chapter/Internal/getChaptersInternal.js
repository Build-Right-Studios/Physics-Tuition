import { getChaptersQuery } from "../Query/addChaptersQuery.js"

export const getChaptersInternal = async (userData) => {
    try {
        const {grade, subject} = userData;
        const existingChapters = await getChaptersQuery({grade, subject})
        return existingChapters;
    } catch (error) {
        console.error("Error in getChapterInternal:", error);
        throw error;
    }
}