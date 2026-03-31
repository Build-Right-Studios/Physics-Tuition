import { updateQuestionInternal } from "../Internal/updateQuestionInternal.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

export const updateQuestionService = async (userData) => {
    try {
        const {
            id, difficulty, tags, appearances,
            specialNote, statement, answer,
            diagramImage, optionImages,
        } = userData;

        // Upload new diagram if provided
        const diagramImageUrl = diagramImage
            ? (await uploadToCloudinary(diagramImage.path, "questions/diagram")).url
            : null;

        // Parse JSON fields
        const parsedTags = tags ? JSON.parse(tags) : [];
        const parsedAppearances = appearances ? JSON.parse(appearances) : [];
        const parsedAnswer = answer ? JSON.parse(answer) : null;

        // Upload new option images to Cloudinary
        if (parsedAnswer?.type === "mcq" && optionImages?.length > 0) {
            for (const file of optionImages) {
                const label = file.fieldname.replace("optionImage_", "");
                const imageUrl = (await uploadToCloudinary(file.path, "questions/options")).url
                const option = parsedAnswer.options.find(o => o.label === label);
                if (option) option.imageUrl = imageUrl;
            }
        }

        const appearanceCount = parsedAppearances.length;
        const lastAppearedYear = appearanceCount > 0
            ? Math.max(...parsedAppearances.map(a => a.year))
            : null;

        const updateData = {
            difficulty,
            specialNote: specialNote || "",
            tags: parsedTags,
            appearances: parsedAppearances,
            appearanceCount,
            lastAppearedYear,
            ...(statement && { statement }),
            ...(diagramImageUrl && { diagramImage: diagramImageUrl }),
            ...(parsedAnswer && { answer: parsedAnswer }),
        };

        const updated = await updateQuestionInternal({ id, updateData });
        return updated;
    } catch (error) {
        console.error("Error in updateQuestionService:", error);
        throw error;
    }
};