"use client";

import { SectionTitle, Note, CheckRow, TextArea } from "../fields";

export default function Phase6DocumentationChecklist() {
  return (
    <div>
      <SectionTitle>Documentation Checklist</SectionTitle>
      <Note>
        To fulfil our regulatory requirements please provide us with the following
        documents. All documentation and certification must be in English. All
        references to &ldquo;certified&rdquo; require each copy document to be
        certified as an accurate and true copy of the original by an independent
        certifier (e.g. a banker, notary public, solicitor, regulated accountant,
        regulated bank or financial institution, government department, embassy or
        consulate). Self-certification is not permitted. Certified copies must be
        clear, signed, dated, with the certifier&rsquo;s printed name and full
        contact details.
      </Note>

      <div className="onb-choice-group stacked">
        <CheckRow
          label="Passport copies for each account holder"
          name="docs.passport"
        />
        <CheckRow
          label="One utility bill showing residential address for each account holder, not older than 3 months"
          name="docs.utilityBill"
        />
      </div>

      <div className="onb-notes-field">
        <TextArea
          label="Notes (any additional documentation)"
          name="docs.notes"
          rows={6}
        />
      </div>
    </div>
  );
}
