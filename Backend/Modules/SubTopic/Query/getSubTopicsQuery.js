import SubTopic from "../../../MongoDb/SubTopic.js";

export const getSubTopicsQuery = async (userData) => {
    try {
        const { chapterName } = userData;
        const subTopics = await SubTopic.find(
            { chapterName },
            { topicName: 1, _id: 0 }
        )
        .sort({ topicName: 1 })
        .lean();

        const subTopicList = subTopics.map(s => s.topicName);
        console.log(subTopicList);
        return subTopicList;
    } catch (error) {
        console.error("Error in getSubTopicsQuery:", error);
        throw new Error("Failed to fetch SubTopics.");
    }
};