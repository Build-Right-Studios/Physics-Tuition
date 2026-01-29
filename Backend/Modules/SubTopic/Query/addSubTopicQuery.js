import SubTopic from "../../../MongoDb/SubTopic.js";
import Chapter from "../../../MongoDb/Chapter.js";

export const getSubTopicQuery = async (userData) => {
    try {
        const {chapterName, titleName} = userData;
        const existingSubTopic = await SubTopic.findOne({chapterName, titleName});

        return existingSubTopic;
    } catch (error) {
        console.error("Error in getSubTopicQuery:", error);
        throw new Error("Failed to get Sub Topic.")
    }
}

export const getChapterQuery = async (userData) => {
    try {
        const {chapterName} = userData;
        const existingChapter = await Chapter.findOne({chapterName});

        return existingChapter;
    } catch (error) {
        console.error("Error in getChapterQuery:", error);
        throw new Error("Failed to get Chapter.")
    }
}

export const addSubTopicQuery = async (userData) => {
    try {
        const { id, chapterId, chapterName, topicName, order } = userData;
        const newSubTopic = new SubTopic({_id: id, chapterId, chapterName, topicName, order });
        const savedSubTopic = await newSubTopic.save();

        return savedSubTopic.toObject();
    } catch (error) {
        console.error("Error in addSubTopicQuery:", error);
        throw new Error("Failed to add Sub Topic.")
    }
}