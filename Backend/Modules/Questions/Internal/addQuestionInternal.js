import { addQuestionQuery, getChapterQuery, getSubTopicQuery } from "../Query/addQuestionQuery.js";

export const getChapterInternal = async (userData) => {
    try {
        const { chapterName } = userData;
        const chapter = await getChapterQuery({ chapterName });
        return chapter;
    } catch (error) {
        console.error("Error in getChapterInternal:", error);
        throw error;
    }
};

export const getSubTopicInternal = async (userData) => {
    try {
        const { topicName } = userData;
        const subTopic = await getSubTopicQuery({ topicName });
        return subTopic;
    } catch (error) {
        console.error("Error in getSubTopicInternal:", error);
        throw error;
    }
};

export const addQuestionInternal = async (userData) => {
    try {
        const newQuestion = await addQuestionQuery(userData);
        return newQuestion;
    } catch (error) {
        console.error("Error in addQuestionInternal:", error);
        throw error;
    }
};