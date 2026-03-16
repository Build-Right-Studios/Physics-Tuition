import Assignment from "../../../MongoDb/Assignment.js";

export const saveAssignmentQuery = async (userData) => {
    try {
        const { cloudinaryPublicId, cloudinaryUrl, title, grade, subject, chapter } = userData;
        const assignment = new Assignment({
            cloudinaryPublicId,
            cloudinaryUrl,
            title, grade, subject, chapter,
        });
        const saved = await assignment.save();
        return saved.toObject();
    } catch (error) {
        console.error("Error in saveAssignmentQuery:", error);
        throw new Error("Failed to save assignment.");
    }
};