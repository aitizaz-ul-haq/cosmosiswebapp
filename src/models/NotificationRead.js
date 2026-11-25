import mongoose from "mongoose";

const NotificationReadSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, immutable: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile", required: true, immutable: true },
  eventType: { type: String, enum: ["created", "submitted", "approved"], required: true, immutable: true },
  eventDate: { type: Date, required: true, immutable: true },
  key: { type: String, required: true, maxlength: 64, immutable: true },
  readAt: { type: Date, required: true, default: Date.now, immutable: true },
}, { versionKey: false });

NotificationReadSchema.index({ companyId: 1, userId: 1, key: 1 }, { unique: true });
NotificationReadSchema.index({ companyId: 1, userId: 1, readAt: -1 });

export default mongoose.models.NotificationRead || mongoose.model("NotificationRead", NotificationReadSchema);
