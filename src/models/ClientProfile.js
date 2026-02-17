import mongoose from "mongoose";

/** ------------------------------
 * Reusable embedded schemas
 * ------------------------------ */

const MoneySchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },
    currency: { type: String, trim: true, default: "GBP" },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true, default: "" },
    line2: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    stateOrProvince: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const NationalClientIdentifierSchema = new mongoose.Schema(
  {
    nationality: { type: String, trim: true, default: "" },
    identifier: { type: String, trim: true, default: "" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const NonUSDeclarationSchema = new mongoose.Schema(
  {
    isUSPerson: { type: Boolean, default: false },
    bornInUS: { type: Boolean, default: false },
    isGreenCardHolder: { type: Boolean, default: false },
    stillResidentInUS: { type: Boolean, default: false },
  },
  { _id: false }
);

const PersonSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    forenames: { type: String, trim: true, default: "" },
    surname: { type: String, trim: true, default: "" },

    dateOfBirth: { type: Date, default: null },

    residentialAddress: { type: AddressSchema, default: () => ({}) },

    nationality: { type: String, trim: true, default: "" },
    domiciledIn: { type: String, trim: true, default: "" },

    homeTelephone: { type: String, trim: true, default: "" },
    mobile: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },

    nationalInsuranceNumber: { type: String, trim: true, default: "" },

    civilStatus: {
      type: String,
      enum: ["single", "married", "separated", "widowed", "civil_partnership", ""],
      default: "",
    },
    spouseName: { type: String, trim: true, default: "" },
    spouseTel: { type: String, trim: true, default: "" },

    nationalClientIdentifiers: { type: [NationalClientIdentifierSchema], default: [] },

    nonUSDeclaration: { type: NonUSDeclarationSchema, default: () => ({}) },
  },
  { _id: false }
);

const AdviserSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    telephone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },

    canDiscussWithCalyx: { type: Boolean, default: false },
    canReceiveReports: { type: Boolean, default: false },
    receiveReportsNotes: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const UploadSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/** ------------------------------
 * MAIN ClientProfile schema
 * ------------------------------ */

const ClientProfileSchema = new mongoose.Schema(
  {
    /**
     * ✅ Link to existing User (must be role="client")
     */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /**
     * ✅ Company binding (tenant isolation)
     */
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    companyName: { type: String, trim: true, required: true },

    /**
     * ✅ Ownership + Responsibility
     * - createdByUserId: who created the client record (RM or Supervisor)
     * - assignedToUserId: which RM owns the client
     * - createdByNameSnapshot: stored name/username at creation time (display only)
     */
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdByNameSnapshot: { type: String, trim: true, default: "" },

    /**
     * ✅ Onboarding workflow
     */
    onboarding: {
      status: {
        type: String,
        enum: ["not_started", "in_progress", "submitted", "approved", "rejected"],
        default: "not_started",
        index: true,
      },
      currentStep: { type: Number, default: 1 },
      completedSteps: { type: [Number], default: [] },
      submittedAt: { type: Date, default: null },
      approvedAt: { type: Date, default: null },
      rejectedAt: { type: Date, default: null },
      rejectionReason: { type: String, trim: true, default: "" },
    },

    /**
     * ✅ Account holders (single/joint)
     */
    accountHolders: {
      isJoint: { type: Boolean, default: false },
      holder1: { type: PersonSchema, default: () => ({}) },
      holder2: { type: PersonSchema, default: () => ({}) },
    },

    /**
     * ✅ Investment services
     */
    investmentServices: {
      baseCurrency: { type: String, trim: true, default: "" },
      serviceType: { type: String, enum: ["discretionary", "execution_only", ""], default: "" },
      hasIncomeRequirement: { type: Boolean, default: false },
      withdrawalFrequency: { type: String, trim: true, default: "" },
      additionalSubAccountsNotes: { type: String, trim: true, default: "" },
    },

    /**
     * ✅ External advisers
     */
    externalAdvisers: {
      advisers: { type: [AdviserSchema], default: [] },
      dailyNewsWrapUp: { type: Boolean, default: false },
    },

    /**
     * ✅ Source of wealth
     */
    sourceOfWealth: {
      employment: { holder1: MoneySchema, holder2: MoneySchema, joint: MoneySchema },
      inheritanceGift: { holder1: MoneySchema, holder2: MoneySchema, joint: MoneySchema },
      saleOfBusiness: { holder1: MoneySchema, holder2: MoneySchema, joint: MoneySchema },
      saleOfProperty: { holder1: MoneySchema, holder2: MoneySchema, joint: MoneySchema },
      other: {
        holder1: MoneySchema,
        holder2: MoneySchema,
        joint: MoneySchema,
        notes: { type: String, trim: true, default: "" },
      },
    },

    /**
     * ✅ Financial profile (expand later as you build steps)
     */
    financialProfile: {
      purposeOfPortfolio: { type: String, trim: true, default: "" },

      employmentStatus: {
        holder1: { type: String, trim: true, default: "" },
        holder2: { type: String, trim: true, default: "" },
      },

      regulatedOrLicensed: {
        holder1: { type: Boolean, default: false },
        holder2: { type: Boolean, default: false },
        details: { type: String, trim: true, default: "" },
      },

      netWorth: MoneySchema,

      proposedInvestment: {
        value: MoneySchema,
        percentOfNetWorthBand: { type: String, enum: ["<25", "25-50", "50-75", ">75", ""], default: "" },
      },

      investmentRestrictions: { type: String, trim: true, default: "" },
    },

    /**
     * ✅ Risk profile
     */
    riskProfile: {
      questionnaire: {
        q1ExperienceYears: { type: String, trim: true, default: "" },
        q2TimeHorizon: { type: String, trim: true, default: "" },
        q3ReturnRange: { type: String, trim: true, default: "" },
        q4IfFalls20: { type: String, trim: true, default: "" },
        q5ImpactIfDown: { type: String, trim: true, default: "" },
        q6LiquidityPreference: { type: String, trim: true, default: "" },
      },

      calculatedScore: { type: Number, default: 0 },
      calculatedProfile: { type: String, enum: ["conservative", "balanced", "steady_growth", "equity", ""], default: "" },

      proceedWithRecommended: { type: Boolean, default: true },

      overrideProfile: {
        wantsOverride: { type: Boolean, default: false },
        chosenProfile: { type: String, trim: true, default: "" },
        reason: { type: String, trim: true, default: "" },
      },
    },

    /**
     * ✅ Documents / uploads
     */
    documents: {
      passportUploaded: { type: Boolean, default: false },
      utilityBillUploaded: { type: Boolean, default: false },
      otherDocsNotes: { type: String, trim: true, default: "" },
      uploads: { type: [UploadSchema], default: [] },
    },

    /**
     * ✅ PDF tracking
     */
    pdf: {
      lastGeneratedAt: { type: Date, default: null },
      lastGeneratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      pdfUrl: { type: String, trim: true, default: "" },
    },

    notes: { type: String, trim: true, default: "" },

    /**
     * ✅ Audit updates (optional but useful)
     */
    updatedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    updatedByNameSnapshot: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

/** ------------------------------
 * Indexes for dashboards
 * ------------------------------ */
ClientProfileSchema.index({ companyId: 1, assignedToUserId: 1 });
ClientProfileSchema.index({ companyId: 1, "onboarding.status": 1 });
ClientProfileSchema.index({ companyId: 1, createdByUserId: 1 });

export default mongoose.models.ClientProfile ||
  mongoose.model("ClientProfile", ClientProfileSchema);
