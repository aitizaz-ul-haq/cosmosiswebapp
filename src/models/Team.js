import mongoose from "mongoose";
import { normalizeTeamName } from "@/lib/teamValidation";

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    nameKey: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    leaderUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    memberUserIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: {
        validator(members) {
          if (!Array.isArray(members) || members.length === 0) return false;
          const ids = members.map(String);
          return new Set(ids).size === ids.length && !ids.includes(String(this.leaderUserId));
        },
        message: "Choose at least one distinct team member, excluding the team leader.",
      },
    },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

TeamSchema.pre("validate", function (next) {
  if (typeof this.name === "string") this.nameKey = normalizeTeamName(this.name);
  next();
});

TeamSchema.index({ companyId: 1, nameKey: 1 }, { unique: true });
TeamSchema.index({ companyId: 1, createdAt: -1 });

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
