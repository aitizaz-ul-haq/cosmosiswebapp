// src/models/Log.js
import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    role: { type: String, required: false, default: "guest" },

    // 🔹 Denormalized identity fields (for easy display + filtering in the logs table)
    name: { type: String, default: null }, // fullName or username
    username: { type: String, default: null, index: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null, index: true },
    companyName: { type: String, default: null, index: true },

    // 🔹 The raw action key (e.g. "login_success", "button_click", "logout")
    action: { type: String, required: true },
    // 🔹 Human readable title of the action (e.g. the button label that was clicked)
    actionTitle: { type: String, default: null },

    metadata: { type: Object, default: {} },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Helpful indexes for timeline-based filtering
LogSchema.index({ createdAt: -1 });
LogSchema.index({ companyName: 1, createdAt: -1 });
LogSchema.index({ username: 1, createdAt: -1 });

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
