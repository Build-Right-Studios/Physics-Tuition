import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
    {
        _id: {
            type: String, // ch_12_phy_01
            required: true
        },

        grade: {
            type: Number,
            required: true,
            index: true
        },

        subject: {
            type: String,
            required: true,
            index: true
        },

        chapterNumber: {
            type: Number,
            required: true
        },

        chapterName: {
            type: String,
            required: true
        },

        slug: {
            type: String,
            required: true,
            unique: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate chapters
chapterSchema.index(
    { grade: 1, subject: 1, chapterNumber: 1 },
    { unique: true }
);

export default mongoose.model("Chapter", chapterSchema);
