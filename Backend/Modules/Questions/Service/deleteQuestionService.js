import { deleteQuestionInternal } from "../Internal/deleteQuestionInternal.js";

export const deleteQuestionService = async (userData) => {
    try {
        const { id } = userData;
        await deleteQuestionInternal({ id });
    } catch (error) {
        console.error("Error in deleteQuestionService:", error);
        throw error;
    }
};