import { getSubTopicsInternal } from "../Internal/getSubTopicsInternal.js";

export const getSubTopicsService = async (userData) => {
    try {
        const { chapterName } = userData;

        const existingSubTopics = await getSubTopicsInternal({ chapterName });
        if (existingSubTopics.length === 0) {
            throw { status: 404, message: "No subtopics found for this chapter." };
        }

        return existingSubTopics;
    } catch (error) {
        console.error("Error in getSubTopicsService:", error);
        throw error;
    }
};