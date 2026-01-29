import mongoose from "mongoose";

const subTopicSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // st_ch_12_phy_01_06
      required: true
    },

    chapterId: {
      type: String, // ch_12_phy_01
      required: true,
      index: true
    }, 

    chapterName: {
      type: String, // Electric Charges and Fields
      required: true
    },

    topicName: {
      type: String, // Coulomb's Law
      required: true,
      index: true
    },

    order: {
      type: Number, // position inside chapter
      required: true
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

export default mongoose.model("SubTopic", subTopicSchema);
