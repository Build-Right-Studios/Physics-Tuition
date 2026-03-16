import { getQuestionByQdrantIdQuery } from "../Query/getQuestionByQdrantIdQuery.js";

export const getQuestionByQdrantIdInternal = async (userData) => {
    try {
        const { qdrantId } = userData;
        const question = await getQuestionByQdrantIdQuery({ qdrantId });
        return question;
    } catch (error) {
        console.error("Error in getQuestionByQdrantIdInternal:", error);
        throw error;
    }
};