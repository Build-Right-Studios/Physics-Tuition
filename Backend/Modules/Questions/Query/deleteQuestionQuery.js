import Question from "../../../MongoDb/Question.js";

export const deleteQuestionQuery = async (userData) => {
    try {
        const { id } = userData;
        await Question.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error in deleteQuestionQuery:", error);
        throw new Error("Failed to delete Question.");
    }
};