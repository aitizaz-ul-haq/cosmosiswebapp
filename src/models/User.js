import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["superadmin", "supervisor", "rm", "client"],
      required: true,
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
    },
    companyName: { type: String, trim: true, default: null },

    // contact
    fullName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },

    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

// ✅ enforce companyId only for non-superadmin
UserSchema.pre("validate", function (next) {
  if (this.role === "superadmin") {
    this.companyId = null;
    this.companyName = null;
    return next();
  }
  if (!this.companyId) {
    return next(new Error("companyId is required for non-superadmin users"));
  }
  next();
});

UserSchema.index({ companyId: 1, role: 1, companyName: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
