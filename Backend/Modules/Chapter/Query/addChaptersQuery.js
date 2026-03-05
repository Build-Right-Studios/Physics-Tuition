import Chapter from "../../../MongoDb/Chapter.js";

export const getChaptersQuery = async (userData) => {
    try {
        const { grade, subject } = userData;
        const chapters = await Chapter.find(
            { grade, subject },          
            { chapterName: 1, _id: 0 }
        )
        .sort({ chapterNo: 1 })
        .lean();
        const chapterList = chapters.map(c => c.chapterName);
        console.log(chapterList)
        return chapterList;
    } catch (error) {
        console.error("Error in getChaptersQuery:", error);
        throw new Error("Failed to fetch Chapters.");
    }
};
