import { generatePDFInternal, saveAssignmentInternal } from "../Internal/generateAssignmentInternal.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

export const generateAssignmentService = async (userData) => {
    try {
        const { questions, grade, subject, chapter, difficulty, title } = userData;

        // Step 1 — Generate PDF
        const pdfPath = await generatePDFInternal({
            questions, grade, subject, chapter, difficulty, title,
        });

        // Step 2 — Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(pdfPath, "assignments", "raw");

        // Step 3 — Save to DB
        const assignment = await saveAssignmentInternal({
            cloudinaryPublicId: cloudinaryResult.public_id,
            cloudinaryUrl:      cloudinaryResult.url,
            title:              title || `${chapter} Assignment`,
            grade, subject, chapter,
        });

        return {
            pdfUrl:       cloudinaryResult.url,
            assignmentId: assignment._id,
        };
    } catch (error) {
        console.error("Error in generateAssignmentService:", error);
        throw error;
    }
};