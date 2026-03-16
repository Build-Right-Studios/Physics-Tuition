import { updateQuestionQuery } from "../Query/updateQuestionQuery.js";

export const updateQuestionInternal = async (userData) => {
    try {
        const { id, updateData } = userData;
        const updated = await updateQuestionQuery({ id, updateData });
        return updated;
    } catch (error) {
        console.error("Error in updateQuestionInternal:", error);
        throw error;
    }
};