import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },   // 👈 revert to passwordHash
    role: { type: String, default: "demoUser" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    subscriptionStatus: { type: String, default: "demo" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
