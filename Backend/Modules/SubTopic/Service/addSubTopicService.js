import Counter from "../../../MongoDb/Counter.js";
import { getSubTopicInternal, getChapterInternal, addSubTopicInternal } from "../Internal/addSubTopicInternal.js"
import { generateSubTopicId } from "../Utils/generateSubTopicId.js";

export const addSubTopicService = async (userData) => {
    try {
        const { chapterName, topicName } = userData;

        //Check Existing Sub Topic
        const existingSubTopic = await getSubTopicInternal({ chapterName, topicName });
        if (existingSubTopic) {
            throw { status: 500, message: "Sub Topic Already exists" };
        }

        //Add new Sub Topic
        const existingChapter = await getChapterInternal({ chapterName });
        const { id, order } = await generateSubTopicId({
            chapterId: existingChapter._id,
            CounterModel: Counter
        });
        const chapterId = existingChapter._id

        const newChapter = await addSubTopicInternal({ id, chapterId, chapterName, topicName, order });

        return newChapter;
    } catch (error) {
        console.error("Error in addChapterService:", error);
        throw new Error("Failed to add Chapter.")
    }
}