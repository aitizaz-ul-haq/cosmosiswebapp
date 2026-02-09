import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "supervisor", "rm", "client"],
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["pending", "demo", "subscribed", "nouser"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);


// const UserSchema = new mongoose.Schema(
//   {
//     username: { type: String, unique: true, required: true, trim: true, lowercase: true },
//     passwordHash: { type: String, required: true },
//     role: { type: String, enum: ["superadmin", "supervisor", "rm", "client"], required: true },
//     companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },

//     mustChangePassword: { type: Boolean, default: true },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     subscriptionStatus: {
//       type: String,
//       enum: ["pending", "demo", "subscribed", "nouser"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User || mongoose.model("User", UserSchema);
