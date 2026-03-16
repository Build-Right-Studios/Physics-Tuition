import Question from "../../../MongoDb/Question.js";

export const getQuestionByQdrantIdQuery = async (userData) => {
    try {
        const { qdrantId } = userData;
        const question = await Question.findOne({ qdrantId });
        return question;
    } catch (error) {
        console.error("Error in getQuestionByQdrantIdQuery:", error);
        throw new Error("Failed to get Question.");
    }
};