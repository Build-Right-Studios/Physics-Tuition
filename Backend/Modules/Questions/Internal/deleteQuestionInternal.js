import { deleteQuestionQuery } from "../Query/deleteQuestionQuery.js";

export const deleteQuestionInternal = async (userData) => {
    try {
        const { id } = userData;
        await deleteQuestionQuery({ id });
    } catch (error) {
        console.error("Error in deleteQuestionInternal:", error);
        throw error;
    }
};