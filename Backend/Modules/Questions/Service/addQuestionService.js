import { getChapterInternal, getSubTopicInternal, addQuestionInternal } from "../Internal/addQuestionInternal.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

export const addQuestionService = async (userData) => {
    try {
        const {
            grade, subject, chapter, subTopic,
            difficulty, specialNote, tags, appearances,
            statement, qdrantId, answer,
            diagramImage, optionImages,
        } = userData;

        const chapterDoc = await getChapterInternal({ chapterName: chapter });
        const subTopicDoc = await getSubTopicInternal({ topicName: subTopic });

        // Upload diagram to Cloudinary
        const diagramResult = diagramImage
            ? await uploadToCloudinary(diagramImage.path, "questions/diagram")
            : null;
        const diagramImageUrl = diagramResult?.secure_url || null;

        // Parse JSON fields
        const parsedTags = tags ? JSON.parse(tags) : [];
        const parsedAppearances = appearances ? JSON.parse(appearances) : [];
        const parsedAnswer = answer ? JSON.parse(answer) : null;

        // Upload option images to Cloudinary
        if (parsedAnswer?.type === "mcq" && optionImages?.length > 0) {
            for (const file of optionImages) {
                const label = file.fieldname.replace("optionImage_", "");
                const result = await uploadToCloudinary(file.path, "questions/options");
                const option = parsedAnswer.options.find(o => o.label === label);
                if (option) option.imageUrl = result.secure_url; // ← changed imageUrl to result.secure_url
            }
        }

        // Compute appearance meta
        const appearanceCount = parsedAppearances.length;
        const lastAppearedYear = appearanceCount > 0
            ? Math.max(...parsedAppearances.map(a => a.year))
            : null;

        const newQuestion = await addQuestionInternal({
            grade,
            subject,
            statement,
            qdrantId,
            chapter: { id: chapterDoc._id, name: chapter },
            subTopic: { id: subTopicDoc._id, name: subTopic },
            difficulty,
            specialNote: specialNote || "",
            tags: parsedTags,
            appearances: parsedAppearances,
            appearanceCount,
            lastAppearedYear,
            diagramImage: diagramImageUrl,
            answer: parsedAnswer,
        });

        return newQuestion;
    } catch (error) {
        console.error("Error in addQuestionService:", error);
        throw error;
    }
};