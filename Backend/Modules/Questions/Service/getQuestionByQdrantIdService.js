import { getQuestionByQdrantIdInternal } from "../Internal/getQuestionByQdrantIdInternal.js";

export const getQuestionByQdrantIdService = async (userData) => {
    try {
        const { qdrantId } = userData;
        const question = await getQuestionByQdrantIdInternal({ qdrantId });
        return question;
    } catch (error) {
        console.error("Error in getQuestionByQdrantIdService:", error);
        throw error;
    }
};