import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true }, // ✅ renamed
  role: { type: String, enum: ["superadmin", "supervisor", "rm", "client"], required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
