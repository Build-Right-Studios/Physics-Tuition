import Question from "../../../MongoDb/Question.js";

export const getQuestionsQuery = async (userData) => {
    try {
        const { filter, page, limit } = userData;
        const skip = (page - 1) * limit;
        return await Question
            .find(filter)
            .select("statement difficulty tags chapter subTopic appearances answer qdrantId grade subject createdAt diagramImage")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    } catch (error) {
        console.error("Error in getQuestionsQuery:", error);
        throw new Error("Failed to fetch questions.");
    }
};

export const getQuestionsCountQuery = async (userData) => {
    try {
        const { filter } = userData;
        return await Question.countDocuments(filter);
    } catch (error) {
        console.error("Error in getQuestionsCountQuery:", error);
        throw new Error("Failed to count questions.");
    }
};