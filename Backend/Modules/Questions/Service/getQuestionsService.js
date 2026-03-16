import { getQuestionsInternal } from "../Internal/getQuestionsInternal.js";

const SOURCE_TO_TAG = {
    "jee_mains":      "JEE Main",
    "jee_advanced":   "JEE Advanced",
    "neet":           "NEET",
    "cbse_board":     "CBSE Board",
    "ncert":          "NCERT",
    "ncert_exemplar": "NCERT Exemplar",
};

export const getQuestionsService = async (userData) => {
    try {
        const { source, grade, chapter, subtopic, difficulty, page, limit } = userData;

        // Build filter
        const filter = {};
        if (source)     filter.tags       = { $in: [SOURCE_TO_TAG[source]] };
        if (grade)      filter.grade      = grade;
        if (chapter)    filter["chapter.name"]  = chapter;
        if (subtopic)   filter["subTopic.name"] = subtopic;
        if (difficulty) filter.difficulty = difficulty;

        const questions = await getQuestionsInternal({ filter, page, limit });
        return questions;
    } catch (error) {
        console.error("Error in getQuestionsService:", error);
        throw error;
    }
};