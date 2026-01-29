import { getChapterInternal, addChapterInternal } from "../Internal/addChapterInternal.js"
import { generateSlug } from "../../../utils/generateSlug.js";
import { generateChapterId } from "../Utils/generateChapterId.js";

export const addChapterService = async (userData) => {
    try {
        const { grade, subject, chapterNo, chapterName } = userData;

        //Check Existing Chapter
        const existingChapter = await getChapterInternal({grade, subject, chapterNo, chapterName});
        if(existingChapter) {
            throw { status: 500, message: "Chapter Already exists"};
        }

        //Add new Chapter
        const id = generateChapterId({grade, subject, chapterNo});
        const slug = generateSlug(chapterName);

        const newChapter = await addChapterInternal({id, grade, subject, chapterNo, chapterName, slug});

        return newChapter;
    } catch (error) {
        console.error("Error in addChapterService:", error);
        throw new Error("Failed to add Chapter.")
    }
}