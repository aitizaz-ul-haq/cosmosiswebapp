import mongoose from "mongoose";

const DemoRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    company: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    subscriptionStatus: {
      type: String,
      enum: ["demo", "subscribed"],
      default: "demo",
    },
  },
  { timestamps: true }
);

export default mongoose.models.DemoRequest ||
  mongoose.model("DemoRequest", DemoRequestSchema);
