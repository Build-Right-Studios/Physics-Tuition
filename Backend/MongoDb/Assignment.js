import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    cloudinaryPublicId: { type: String, required: true },
    cloudinaryUrl:      { type: String, required: true },
    title:              { type: String, default: "" },
    grade:              { type: String, default: "" },
    subject:            { type: String, default: "" },
    chapter:            { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);