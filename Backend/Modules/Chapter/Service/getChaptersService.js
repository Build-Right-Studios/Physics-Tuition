import { getChaptersInternal } from "../Internal/getChaptersInternal.js";

export const getChaptersService = async (userData) => {
    try {
        const { grade, subject } = userData;

        //Check Existing Chapter
        const existingChapters = await getChaptersInternal({grade, subject});
        if(existingChapters.length === 0) {
            throw { status: 404, message: "Failed to fetch chapters."};
        }

        return existingChapters;
    } catch (error) {
        console.error("Error in getChaptersService:", error);
        throw error;
    }
}