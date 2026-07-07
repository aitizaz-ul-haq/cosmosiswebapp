"use client";

import {
  SectionTitle,
  Note,
  Field,
  TextArea,
  ChoiceGroup,
  CheckRow,
  YesNo,
  CountrySelect,
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
      <Field
        label="Title"
        name={`${prefix}.title`}
        icon="badge"
        placeholder="e.g. Mr, Mrs, Ms, Dr"
        help="Your personal title or salutation (Mr, Mrs, Ms, Miss, Dr, etc.)."
      />
      <Field
        label="Forename(s)"
        name={`${prefix}.forenames`}
        icon="user"
        placeholder="e.g. John Michael"
        help="Your first name(s) exactly as they appear on your passport or ID."
      />
      <Field
        label="Surname(s)"
        name={`${prefix}.surname`}
        icon="user"
        placeholder="e.g. Smith"
        help="Your family name / last name as shown on official documents."
      />
      <TextArea
        label="Residential Address"
        name={`${prefix}.address`}
        rows={2}
        icon="home"
        placeholder="House number, street, town/city"
        help="Your current full home address. Do not use a PO box."
      />
      <Field
        label="Postcode"
        name={`${prefix}.postcode`}
        icon="pin"
        placeholder="e.g. SW1A 1AA"
        help="The postal / ZIP code for your residential address."
      />
      <Field
        label="Date of Birth"
        name={`${prefix}.dob`}
        type="date"
        icon="calendar"
        help="Your date of birth as shown on your passport or ID."
      />
      <CountrySelect
        label="Nationality"
        name={`${prefix}.nationality`}
        icon="globe"
        placeholder="Search your nationality…"
        help="Select the country of your nationality. Start typing to search."
      />
      <CountrySelect
        label="Country"
        name={`${prefix}.country`}
        icon="globe"
        placeholder="Search your country of residence…"
        help="Select the country where you currently reside."
      />
      <Field
        label="Home Telephone"
        name={`${prefix}.homeTel`}
        type="tel"
        icon="phone"
        placeholder="e.g. +44 20 7946 0958"
        help="Your landline number. Only digits and a leading + are allowed."
      />
      <Field
        label="Mobile"
        name={`${prefix}.mobile`}
        type="tel"
        icon="phone"
        placeholder="e.g. +44 7700 900123"
        help="Your mobile number. Only digits and a leading + are allowed."
      />
      <Field
        label="Email Address"
        name={`${prefix}.email`}
        type="email"
        icon="mail"
        placeholder="e.g. name@example.com"
        help="A valid email address we can use to contact you."
      />
      <Field
        label="National Insurance Number"
        name={`${prefix}.nino`}
        icon="id"
        placeholder="e.g. QQ 12 34 56 C"
        help="Your National Insurance / tax reference number."
      />
      <Field
        label="Where are you domiciled"
        name={`${prefix}.domicile`}
        icon="home"
        placeholder="e.g. United Kingdom"
        help="The country you regard as your permanent home for tax purposes."
      />
      <ChoiceGroup
        label="Civil Status"
        name={`${prefix}.civilStatus`}
        options={CIVIL_STATUS}
        size="lg"
        icon="heart"
        help="Your current marital or civil partnership status."
      />
      <Field
        label="If married, name of spouse"
        name={`${prefix}.spouseName`}
        icon="user"
        placeholder="e.g. Jane Smith"
        help="Full name of your spouse or civil partner, if applicable."
      />
      <Field
        label="Spouse's tel no"
        name={`${prefix}.spouseTel`}
        type="tel"
        icon="phone"
        placeholder="e.g. +44 7700 900456"
        help="Contact number for your spouse. Only digits and a leading + are allowed."
      />
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
            <input type="checkbox" name={`${name}.h1`} value="yes" /> <span>Yes</span>
          </label>
          <label className="onb-choice">
            <input type="checkbox" name={`${name}.h1`} value="no" /> <span>No</span>
          </label>
        </div>
      </td>
      <td className="center">
        <div className="onb-yesno" style={{ justifyContent: "center" }}>
          <label className="onb-choice">
            <input type="checkbox" name={`${name}.h2`} value="yes" /> <span>Yes</span>
          </label>
          <label className="onb-choice">
            <input type="checkbox" name={`${name}.h2`} value="no" /> <span>No</span>
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
      <Field
        label="Full Name"
        name={`${prefix}.fullName`}
        icon="user"
        placeholder="e.g. Jane Doe"
        help="Full name of your external adviser."
      />
      <Field
        label="Company"
        name={`${prefix}.company`}
        icon="building"
        placeholder="e.g. Doe Financial Advisers Ltd"
        help="The firm or company your adviser works for."
      />
      <TextArea
        label="Address"
        name={`${prefix}.address`}
        rows={2}
        icon="home"
        placeholder="Company address"
        help="The business address of your adviser."
      />
      <Field
        label="Telephone"
        name={`${prefix}.telephone`}
        type="tel"
        icon="phone"
        placeholder="e.g. +44 20 7946 0000"
        help="Adviser's contact number. Only digits and a leading + are allowed."
      />
      <Field
        label="Email Address"
        name={`${prefix}.email`}
        type="email"
        icon="mail"
        placeholder="e.g. adviser@example.com"
        help="A valid email address for your adviser."
      />
      <YesNo
        label="Discuss your account with Calyx?"
        name={`${prefix}.canDiscuss`}
      />
      <YesNo
        label="Receive information or reports relating to your account?"
        name={`${prefix}.canReceiveReports`}
      />
      <TextArea
        label="If Yes, please specify"
        name={`${prefix}.reportsNotes`}
        rows={2}
        placeholder="Describe what information or reports may be shared"
      />
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
      <p className="onb-agreement">
        Each named applicant will be authorised to access information relating to
        all other applicants under this agreement, including portfolio
        valuations, transaction history, and Calyx and Custodian reporting,
        unless any applicant notifies Calyx in writing that they do not wish such
        access to be granted.
      </p>

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
        rows={5}
        half
        placeholder="List any additional sub-accounts and relevant details"
      />
      <YesNo
        label="Do you have any specific income requirements?"
        name="investmentService.hasIncome"
      />
      <TextArea
        label="If yes, what frequency would you like your withdrawal?"
        name="investmentService.withdrawalFrequency"
        rows={5}
        half
        placeholder="e.g. Monthly, Quarterly, Annually and the amount"
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
        big
      />
    </div>
  );
}
