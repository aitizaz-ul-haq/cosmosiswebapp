import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    // Identity
    name: { type: String, required: true, trim: true },
    legalName: { type: String, trim: true },

    // Tenant key (short code / slug)
    tenantKey: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "tenantKey must be like 'fgk' or 'alpha-capital'"],
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },

    // Contact (optional)
    primaryContact: {
      fullName: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },

    // Address (optional)
    address: {
      line1: { type: String, trim: true },
      line2: { type: String, trim: true },
      city: { type: String, trim: true },
      stateOrProvince: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    // Registration (optional)
    registrationNumber: { type: String, trim: true },
    taxId: { type: String, trim: true },
    website: { type: String, trim: true },

    // Branding (optional)
    logoUrl: { type: String, trim: true },

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// If you still want company name unique globally, keep this.
// If you want duplicates allowed later, remove this index.
CompanySchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
