import { getQuestionsQuery, getQuestionsCountQuery } from "../Query/getQuestionsQuery.js";

export const getQuestionsInternal = async (userData) => {
    try {
        const { filter, page, limit } = userData;
        const questions = await getQuestionsQuery({ filter, page, limit });
        const total     = await getQuestionsCountQuery({ filter });
        return { data: questions, total, page, limit };
    } catch (error) {
        console.error("Error in getQuestionsInternal:", error);
        throw error;
    }
};