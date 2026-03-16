import Question from "../../../MongoDb/Question.js";

export const updateQuestionQuery = async (userData) => {
    try {
        const { id, updateData } = userData;
        const updated = await Question.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        return updated?.toObject();
    } catch (error) {
        console.error("Error in updateQuestionQuery:", error);
        throw new Error("Failed to update Question.");
    }
};