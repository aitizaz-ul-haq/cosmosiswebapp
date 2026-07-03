"use client";

import { SectionTitle, Note, Field } from "../fields";

function SignatureBlock({ prefix, title }) {
  return (
    <div className="onb-sig-block">
      <h4 className="onb-holder-title">{title}</h4>
      <Field label="Signature(s)" name={`${prefix}.signature`} />
      <Field label="Name(s)" name={`${prefix}.name`} />
      <Field label="Date" name={`${prefix}.date`} type="date" />
    </div>
  );
}

export default function Phase5Signature() {
  return (
    <div>
      <SectionTitle>Signatures</SectionTitle>
      <p className="onb-agreement">
        Our agreement with you comprises this document, the Terms of Business,
        Engagement Letter and any other ancillary documents. You have been
        classified by us as a retail customer for all transactions, unless we have
        agreed in writing that you are a professional investor for specific
        investments. You agree that Calyx will rely on the information given in
        this form, and you appoint Calyx to manage your account(s) in accordance
        with the instructions you have given. You agree to notify Calyx of any
        significant changes to your circumstances which may affect the management
        of your account(s).
      </p>
      <Note>
        I/We confirm that I am/we are the beneficial owners of the assets in the
        account(s).
      </Note>

      <SignatureBlock prefix="signature.holder1" title="Account Holder 1" />
      <SignatureBlock prefix="signature.holder2" title="Account Holder 2" />
    </div>
  );
}
