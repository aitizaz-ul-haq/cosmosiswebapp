"use client";

import {
  SectionTitle,
  Note,
  Field,
  TextArea,
  ChoiceGroup,
  CheckRow,
  YesNo,
} from "../fields";

const CIVIL_STATUS = [
  "Single",
  "Married",
  "Separated",
  "Widowed",
  "Civil Partnership",
];

function HolderPersonalDetails({ prefix, title }) {
  return (
    <div className="onb-holder-col">
      <h4 className="onb-holder-title">{title}</h4>
      <Field label="Title" name={`${prefix}.title`} />
      <Field label="Forename(s)" name={`${prefix}.forenames`} />
      <Field label="Surname(s)" name={`${prefix}.surname`} />
      <TextArea label="Residential Address" name={`${prefix}.address`} rows={2} />
      <Field label="Postcode" name={`${prefix}.postcode`} />
      <Field label="Date of Birth" name={`${prefix}.dob`} type="date" />
      <Field label="Nationality" name={`${prefix}.nationality`} />
      <Field label="Country" name={`${prefix}.country`} />
      <Field label="Home Telephone" name={`${prefix}.homeTel`} type="tel" />
      <Field label="Mobile" name={`${prefix}.mobile`} type="tel" />
      <Field label="Email Address" name={`${prefix}.email`} type="email" />
      <Field
        label="National Insurance Number"
        name={`${prefix}.nino`}
      />
      <Field label="Where are you domiciled" name={`${prefix}.domicile`} />
      <ChoiceGroup
        label="Civil Status"
        name={`${prefix}.civilStatus`}
        options={CIVIL_STATUS}
      />
      <Field label="If married, name of spouse" name={`${prefix}.spouseName`} />
      <Field label="Spouse's tel no" name={`${prefix}.spouseTel`} type="tel" />
    </div>
  );
}

function NciRow({ prefix, index }) {
  return (
    <tr>
      <td className="onb-row-label">{index}</td>
      <td>
        <input type="text" name={`${prefix}.nationality${index}`} />
      </td>
      <td>
        <input type="text" name={`${prefix}.nci${index}`} />
      </td>
      <td className="center">
        <input type="checkbox" name={`${prefix}.primary${index}`} value="yes" />
      </td>
    </tr>
  );
}

function NonUsRow({ label, name }) {
  return (
    <tr>
      <td className="onb-row-label">{label}</td>
      <td className="center">
        <div className="onb-yesno" style={{ justifyContent: "center" }}>
          <label className="onb-choice">
            <input type="radio" name={`${name}.h1`} value="yes" /> <span>Yes</span>
          </label>
          <label className="onb-choice">
            <input type="radio" name={`${name}.h1`} value="no" /> <span>No</span>
          </label>
        </div>
      </td>
      <td className="center">
        <div className="onb-yesno" style={{ justifyContent: "center" }}>
          <label className="onb-choice">
            <input type="radio" name={`${name}.h2`} value="yes" /> <span>Yes</span>
          </label>
          <label className="onb-choice">
            <input type="radio" name={`${name}.h2`} value="no" /> <span>No</span>
          </label>
        </div>
      </td>
    </tr>
  );
}

function AdviserBlock({ prefix, title }) {
  return (
    <div className="onb-holder-col">
      <h4 className="onb-holder-title">{title}</h4>
      <Field label="Full Name" name={`${prefix}.fullName`} />
      <Field label="Company" name={`${prefix}.company`} />
      <TextArea label="Address" name={`${prefix}.address`} rows={2} />
      <Field label="Telephone" name={`${prefix}.telephone`} type="tel" />
      <Field label="Email Address" name={`${prefix}.email`} type="email" />
      <YesNo
        label="Discuss your account with Calyx?"
        name={`${prefix}.canDiscuss`}
      />
      <YesNo
        label="Receive information or reports relating to your account?"
        name={`${prefix}.canReceiveReports`}
      />
      <TextArea label="If Yes, please specify" name={`${prefix}.reportsNotes`} rows={2} />
    </div>
  );
}

export default function Phase1PersonalDetails() {
  return (
    <div>
      <SectionTitle>Account Holders</SectionTitle>
      <div className="onb-grid-2">
        <HolderPersonalDetails prefix="holder1" title="Account Holder 1" />
        <HolderPersonalDetails prefix="holder2" title="Account Holder 2" />
      </div>

      <SectionTitle>National Client Identifier (NCI)</SectionTitle>
      <Note>
        We need to record your national client identifier. If more than one
        nationality, please record the relevant national identifier for each
        nationality. If you are a UK national, please enter your passport number.
      </Note>

      <span className="onb-label">Account Holder 1 – Nationalities</span>
      <div className="onb-table-wrap">
        <table className="onb-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Nationality</th>
              <th>National Client Identifier (per NCI table)</th>
              <th className="center">Primary Nationality</th>
            </tr>
          </thead>
          <tbody>
            <NciRow prefix="holder1.nci" index={1} />
            <NciRow prefix="holder1.nci" index={2} />
          </tbody>
        </table>
      </div>

      <span className="onb-label">Account Holder 2 – Nationalities</span>
      <div className="onb-table-wrap">
        <table className="onb-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Nationality</th>
              <th>National Client Identifier (per NCI table)</th>
              <th className="center">Primary Nationality</th>
            </tr>
          </thead>
          <tbody>
            <NciRow prefix="holder2.nci" index={1} />
            <NciRow prefix="holder2.nci" index={2} />
          </tbody>
        </table>
      </div>

      <SectionTitle>Non-US Person Status Declaration</SectionTitle>
      <div className="onb-table-wrap">
        <table className="onb-table onb-matrix">
          <thead>
            <tr>
              <th>Question</th>
              <th className="center">Account Holder 1</th>
              <th className="center">Account Holder 2</th>
            </tr>
          </thead>
          <tbody>
            <NonUsRow
              label="Is the beneficial owner a US Person?"
              name="nonUs.isUsPerson"
            />
            <NonUsRow
              label="Was the beneficial owner born in the US?"
              name="nonUs.bornInUs"
            />
            <NonUsRow
              label="Is the beneficial owner a Green Card Holder (irrespective of expiry date)?"
              name="nonUs.greenCard"
            />
            <NonUsRow
              label="Irrespective of the Substantial Physical Presence Test, is the beneficial owner still resident in the US?"
              name="nonUs.usResident"
            />
          </tbody>
        </table>
      </div>
      <p className="onb-agreement">
        <strong>Change of Status as Non-US Person.</strong> You agree to promptly
        inform Calyx if your status as a Non-US Person in accordance with the
        above definitions were to change and you were to become a US Person.
      </p>

      <SectionTitle>Investment Services</SectionTitle>
      <Note>Please indicate the investment service you want for your account(s).</Note>
      <ChoiceGroup
        name="investmentService.type"
        stacked
        options={[
          {
            value: "discretionary",
            label:
              "Discretionary – We will manage your account(s) at our complete discretion and select investments we deem appropriate given your risk profile and any specific restrictions.",
          },
          {
            value: "execution_only",
            label:
              "Execution only – You make your own investment decisions and we execute those instructions.",
          },
        ]}
      />
      <ChoiceGroup
        label="Base currency of your account(s)"
        name="investmentService.baseCurrency"
        options={["GBP", "USD", "EURO", "Other"]}
      />
      <TextArea
        label="Additional sub-accounts (please provide relevant information)"
        name="investmentService.subAccounts"
        rows={2}
      />
      <YesNo
        label="Do you have any specific income requirements?"
        name="investmentService.hasIncome"
      />
      <Field
        label="If yes, what frequency would you like your withdrawal?"
        name="investmentService.withdrawalFrequency"
      />

      <SectionTitle>External Advisers</SectionTitle>
      <Note>
        If you have any external advisers (financial advisers, accountants, or
        solicitors) involved in your affairs, please provide their details below.
      </Note>
      <div className="onb-grid-2">
        <AdviserBlock prefix="adviser1" title="Adviser 1" />
        <AdviserBlock prefix="adviser2" title="Adviser 2" />
      </div>

      <SectionTitle>Daily News Wrap-Up</SectionTitle>
      <CheckRow
        label="Please tick if you wish to be added to our email distribution list to receive our Daily News Wrap-Up. You can unsubscribe at any time via the link at the bottom of the email."
        name="dailyNewsWrapUp"
      />
    </div>
  );
}
