import cron from "node-cron";
import { v2 as cloudinary } from "cloudinary";
import Assignment from "../MongoDb/Assignment.js";

export const startCleanupCron = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const oldAssignments = await Assignment.find({ createdAt: { $lt: sevenDaysAgo } });

            for (const assignment of oldAssignments) {
                await cloudinary.uploader.destroy(assignment.cloudinaryPublicId, {
                    resource_type: "raw",
                });
                await Assignment.findByIdAndDelete(assignment._id);
            }

            console.log(`Cron: deleted ${oldAssignments.length} old assignments`);
        } catch (error) {
            console.error("Cron error:", error);
        }
    });

    console.log("Cleanup cron job started.");
};