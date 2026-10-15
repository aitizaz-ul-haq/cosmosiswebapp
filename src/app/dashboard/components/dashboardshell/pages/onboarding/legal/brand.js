// Company-specific wording for the Phase 0 legal documents.
// The source documents are written for Calyx (an appointed representative that
// trades under Nemesis Asset Management LLP). Nemesis is the regulated entity
// itself. Every other company is shown under its own name throughout, with no
// reference to Calyx or Nemesis Asset Management LLP.

const NEMESIS_ENTITY = "Nemesis Asset Management LLP";
const GROUP_EMAIL = "compliance@nemesisam.com";
const FCA = "Financial Conduct Authority";

// Public websites known for each company (from the companies collection).
const WEBSITES = {
  nemesis: "www.nemesisassetmanagement.com",
  calyx: "www.nemesisassetmanagement.com",
  "norman k.": "www.norman-k.com",
};

export function getBrand(companyName) {
  const name = (companyName || "").trim() || "the Firm";
  const isCalyx = /^calyx\b/i.test(name);
  const isParent = /^nemesis\b/i.test(name);

  const base = {
    name,
    isParent,
    website: WEBSITES[name.toLowerCase()] || WEBSITES.nemesis,
    infoEmail: isCalyx ? "info@calyxprivateoffice.com" : GROUP_EMAIL,
    privacyContact: isCalyx
      ? "Stacy Iervolino if you have any questions at stacy@calyxprivateoffice.com"
      : `our Compliance team if you have any questions at ${GROUP_EMAIL}`,
    complaintContact: isCalyx
      ? `our COO Stacy Iervolino at Stacy@calyxprivateoffice.com or you may also contact us at ${GROUP_EMAIL}`
      : `us at ${GROUP_EMAIL}`,
    conflictsEmail: isCalyx ? "stacy@calyxprivateoffice.com" : GROUP_EMAIL,
  };

  if (isCalyx) {
    return {
      ...base,
      legalEntity: NEMESIS_ENTITY,
      // Used as a sentence subject / inline in a sentence.
      entitySubject: `${NEMESIS_ENTITY}, trading as ${name},`,
      entityInline: `${NEMESIS_ENTITY} trading as ${name}`,
      regulator: `${name} Private Office LLP (registration number OC430514) is an Appointed Representative of ${NEMESIS_ENTITY} which is authorized and regulated by the ${FCA} with registration number 211205.`,
    };
  }

  if (isParent) {
    return {
      ...base,
      legalEntity: NEMESIS_ENTITY,
      entitySubject: NEMESIS_ENTITY,
      entityInline: NEMESIS_ENTITY,
      regulator: `${NEMESIS_ENTITY} is authorised and regulated by the ${FCA} with registration number 211205.`,
    };
  }

  // Any other company: its own name everywhere; no registration numbers are asserted.
  return {
    ...base,
    legalEntity: name,
    entitySubject: name,
    entityInline: name,
    regulator: `${name} is authorised and regulated by the ${FCA}.`,
  };
}
