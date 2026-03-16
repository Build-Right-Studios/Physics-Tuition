import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Unnamed User"
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true // allows multiple students without email
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true // only students usually
    },

    parentPhone: {
      type: String,
      trim: true
    },

    passwordHash: {
      type: String,
      required: function () {
        return this.role === "admin";
      }
    },

    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
      required: true
    },

    grade: {
      type: String,
      enum: ["11", "12"],
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default mongoose.model("User", userSchema);