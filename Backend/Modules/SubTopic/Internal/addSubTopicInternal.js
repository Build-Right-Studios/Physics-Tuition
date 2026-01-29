import { getSubTopicQuery, getChapterQuery, addSubTopicQuery } from "../Query/addSubTopicQuery.js"

export const getSubTopicInternal = async (userData) => {
    try {
        const {chapterName, titleName} = userData;
        const existingSubTopic = await getSubTopicQuery({chapterName, titleName});
        return existingSubTopic;
    } catch (error) {
        console.error("Error in getSubTopicInternal:", error);
        throw new Error("Failed to get Sub Topics.")
    }
}

export const getChapterInternal = async (userData) => {
    try {
        const {chapterName} = userData;
        const existingChapter = await getChapterQuery({chapterName})
        return existingChapter;
    } catch (error) {
        console.error("Error in getChapterInternal:", error);
        throw new Error("Failed to get Chapter.")
    }
}

export const addSubTopicInternal = async (userData) => {
    try {
        const { id, chapterId, chapterName, topicName, order } = userData;
        const newSubTopic = await addSubTopicQuery({ id, chapterId, chapterName, topicName, order })
        return newSubTopic;
    } catch (error) {
        console.error("Error in addSubTopicInternal:", error);
        throw new Error("Failed to add Sub Topic.")
    }
}
