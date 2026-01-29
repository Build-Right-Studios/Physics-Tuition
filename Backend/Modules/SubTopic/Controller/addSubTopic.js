import { addSubTopicService } from "../Service/addSubTopicService.js"

export const addSubTopicService = async (req, res) => {
    try {
        const { chapterName, topicName } = req.body;
        if (!chapterName) { throw { status: 400, message: "Chapter Name is missing." };}
        if (!topicName) { throw { status: 400, message: "Topic Name is missing." };}

        const data = await addSubTopicService({ chapterName, topicName });

        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.error("Error in addSubTopicService:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to add Sub Topic.",
        });
    }

}
