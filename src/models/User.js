import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "rm", "client", "demoUser"],
      default: "demoUser",
    },
    subscriptionStatus: {
      type: String,
      enum: ["demo", "subscribed"],
      default: "demo",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
