import { getStudentsInternal } from "../Internal/getStudentsInternal.js";

export const getStudentsService = async (userData) => {
    try {
        const { grade } = userData;
        const students = await getStudentsInternal({ grade });
        return students;
    } catch (error) {
        console.error("Error in getStudentsService:", error);
        throw error;
    }
};