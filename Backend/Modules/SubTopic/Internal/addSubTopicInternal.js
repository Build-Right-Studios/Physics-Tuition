import { getSubTopicQuery, getChapterQuery, addSubTopicQuery } from "../Query/addSubTopicQuery.js"

export const getSubTopicInternal = async (userData) => {
    try {
        const {chapterName, topicName} = userData;
        const existingSubTopic = await getSubTopicQuery({chapterName, topicName});
        return existingSubTopic;
    } catch (error) {
        console.error("Error in getSubTopicInternal:", error);
        throw error;
    }
}

export const getChapterInternal = async (userData) => {
    try {
        const {chapterName} = userData;
        const existingChapter = await getChapterQuery({chapterName})
        return existingChapter;
    } catch (error) {
        console.error("Error in getChapterInternal:", error);
        throw error;
    }
}

export const addSubTopicInternal = async (userData) => {
    try {
        const { id, chapterId, chapterName, topicName, order } = userData;
        const newSubTopic = await addSubTopicQuery({ id, chapterId, chapterName, topicName, order })
        return newSubTopic;
    } catch (error) {
        console.error("Error in addSubTopicInternal:", error);
        throw error;
    }
}
