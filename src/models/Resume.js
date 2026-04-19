import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Untitled Resume",
    },
    resumeData: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
