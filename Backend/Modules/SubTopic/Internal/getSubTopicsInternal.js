import { getSubTopicsQuery } from "../Query/getSubTopicsQuery.js";

export const getSubTopicsInternal = async (userData) => {
    try {
        const { chapterName } = userData;
        const existingSubTopics = await getSubTopicsQuery({ chapterName });
        return existingSubTopics;
    } catch (error) {
        console.error("Error in getSubTopicsInternal:", error);
        throw error;
    }
};