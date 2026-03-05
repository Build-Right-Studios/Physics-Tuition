import Counter from "../../../MongoDb/Counter.js";
import { getSubTopicInternal, getChapterInternal, addSubTopicInternal } from "../Internal/addSubTopicInternal.js"
import { generateSubTopicId } from "../Utils/generateSubTopicId.js";

export const addSubTopicService = async (userData) => {
    try {
        const { chapterName, topicName } = userData;

        //Check Existing Sub Topic
        const existingSubTopic = await getSubTopicInternal({ chapterName, topicName });
        if (existingSubTopic) {
            throw { status: 404, message: "Sub Topic Already exists" };
        }

        //Add new Sub Topic
        const existingChapter = await getChapterInternal({ chapterName });
        if (!existingChapter) {
            throw { status: 404, message: "Chapter does not exist" };
        }
        const { id, order } = await generateSubTopicId({
            chapterId: existingChapter._id,
            CounterModel: Counter
        });
        const chapterId = existingChapter._id

        const newSubTopic = await addSubTopicInternal({ id, chapterId, chapterName, topicName, order });

        return newSubTopic;
    } catch (error) {
        console.error("Error in addSubTopicService:", error);
        throw error;
    }
}