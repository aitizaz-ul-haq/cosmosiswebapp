import mongoose from "mongoose";

const DemoRequestSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    role: {
      type: String,
      enum: ["supervisor", "rm", "client", "other"],
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true } // ✅ no need for manual createdAt
);

export default mongoose.models.DemoRequest ||
  mongoose.model("DemoRequest", DemoRequestSchema);
