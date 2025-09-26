import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // ✅ handles createdAt & updatedAt automatically
);

export default mongoose.models.Company ||
  mongoose.model("Company", CompanySchema);
