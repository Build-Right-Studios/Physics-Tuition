import { getChapterInternal, addChapterInternal } from "../Internal/addChapterInternal.js"
import { generateSlug } from "../../../utils/generateSlug.js";
import { generateChapterId } from "../Utils/generateChapterId.js";

export const addChapterService = async (userData) => {
    try {
        const { grade, subject, chapterNumber, chapterName } = userData;

        //Check Existing Chapter
        const existingChapter = await getChapterInternal({grade, subject, chapterNumber, chapterName});
        if(existingChapter) {
            throw { status: 409, message: "Chapter Already exists"};
        }

        //Add new Chapter
        const id = generateChapterId({grade, subject, chapterNumber});
        const slug = generateSlug(chapterName);

        const newChapter = await addChapterInternal({id, grade, subject, chapterNumber, chapterName, slug});

        return newChapter;
    } catch (error) {
        console.error("Error in addChapterService:", error);
        throw error;
    }
}