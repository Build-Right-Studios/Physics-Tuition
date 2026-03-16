import Question from "../../../MongoDb/Question.js";
import Chapter from "../../../MongoDb/Chapter.js";
import SubTopic from "../../../MongoDb/SubTopic.js";

export const getChapterQuery = async (userData) => {
    try {
        const { chapterName } = userData;
        return await Chapter.findOne({ chapterName });
    } catch (error) {
        console.error("Error in getChapterQuery:", error);
        throw new Error("Failed to get Chapter.");
    }
};

export const getSubTopicQuery = async (userData) => {
    try {
        const { topicName } = userData;
        return await SubTopic.findOne({ topicName });
    } catch (error) {
        console.error("Error in getSubTopicQuery:", error);
        throw new Error("Failed to get SubTopic.");
    }
};

export const addQuestionQuery = async (userData) => {
    try {
        const newQuestion = new Question(userData);
        const saved = await newQuestion.save();
        return saved.toObject();
    } catch (error) {
        console.error("Error in addQuestionQuery:", error);
        throw new Error("Failed to add Question.");
    }
};