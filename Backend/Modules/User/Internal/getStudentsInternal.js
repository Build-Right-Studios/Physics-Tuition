import { getStudentsQuery } from "../Query/getStudentsQuery.js";

export const getStudentsInternal = async (userData) => {
    try {
        const { grade } = userData;
        const students = await getStudentsQuery({ grade });
        return students;
    } catch (error) {
        console.error("Error in getStudentsInternal:", error);
        throw error;
    }
};