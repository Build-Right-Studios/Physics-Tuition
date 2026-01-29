import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: String, // chapterId
  seq: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Counter", counterSchema);
