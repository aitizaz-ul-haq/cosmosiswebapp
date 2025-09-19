// src/models/Log.js
import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    metadata: { type: Object, default: {} },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
