import mongoose from "mongoose";

const appearanceSchema = new mongoose.Schema({
    exam:          { type: String, required: true },
    year:          { type: Number, required: true },
    valuesChanged: { type: Boolean, default: false },
}, { _id: false });

const optionSchema = new mongoose.Schema({
    label:    { type: String },
    text:     { type: String, default: "" },
    imageUrl: { type: String, default: null },
}, { _id: false });

const answerSchema = new mongoose.Schema({
    type:     { type: String, enum: ["mcq", "numerical"], default: "mcq" },
    options:  [optionSchema],
    correct:  { type: String, default: "" },
    solution: { type: String, default: "" },
}, { _id: false });

const questionSchema = new mongoose.Schema({
    statement:    { type: String, default: "" },
    diagramImage: { type: String, default: null },
    qdrantId:     { type: String, default: null },

    grade:   { type: String, required: true },
    subject: { type: String, required: true },

    chapter: {
        id:   { type: String, ref: "Chapter" },
        name: { type: String, required: true },
    },

    subTopic: {
        id:   { type: String, ref: "SubTopic" },
        name: { type: String, required: true },
    },

    difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    specialNote: { type: String, default: "" },
    tags:        [{ type: String }],
    embeddings:  [{ type: Number }],
    answer:      { type: answerSchema, default: null },

    appearances:      [appearanceSchema],
    appearanceCount:  { type: Number, default: 0 },
    lastAppearedYear: { type: Number, default: null },
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);