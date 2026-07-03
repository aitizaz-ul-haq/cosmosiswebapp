"use client";

import {
  SectionTitle,
  Note,
  Field,
  TextArea,
  ChoiceGroup,
  YesNo,
} from "../fields";

const ASSET_ROWS = [
  "Main Residence",
  "Other Properties",
  "Investments",
  "ISAs",
  "Onshore and Offshore Bonds",
  "Deposits",
  "Pensions",
  "Trusts",
];

const LIABILITY_ROWS = ["Main Residence", "Other Properties", "Loans", "Other"];

const INCOME_ROWS = [
  "Employment",
  "Pensions in payment",
  "Investments",
  "Income from trusts",
  "Income from rental properties",
  "Income from Onshore / Offshore bonds",
  "Other",
];

const EXPENDITURE_ROWS = [
  "Regular Outgoings",
  "Mortgages",
  "Loans",
  "School Fees",
  "Other",
];

const INVESTMENT_TYPES = [
  "Cash",
  "Debt and fixed interest",
  "Equities",
  "Managed Funds",
  "Derivatives and Structured Products",
  "Private Equity",
  "Commodities",
  "Alternative Investments",
];

const EMPLOYMENT_STATUS = ["Employed", "Self-Employed", "Retired", "Other"];

function slug(str) {
  return str.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
}

function MoneyTable({ prefix, rows }) {
  return (
    <div className="onb-table-wrap">
      <table className="onb-table">
        <thead>
          <tr>
            <th style={{ minWidth: "170px" }}>Item</th>
            <th>First Account Holder</th>
            <th>Second Account Holder</th>
            <th>Joint</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = `${prefix}.${slug(row)}`;
            return (
              <tr key={row}>
                <td className="onb-row-label">{row}</td>
                <td>
                  <input type="text" name={`${key}.h1`} placeholder="Amount + currency" />
                </td>
                <td>
                  <input type="text" name={`${key}.h2`} placeholder="Amount + currency" />
                </td>
                <td>
                  <input type="text" name={`${key}.joint`} placeholder="Amount + currency" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function KnowledgeMatrix({ prefix, title }) {
  const levels = [
    { value: "none", label: "None" },
    { value: "low", label: "Low (< 1 year)" },
    { value: "medium", label: "Medium (1–5 years)" },
    { value: "high", label: "High (> 5 years)" },
  ];
  return (
    <>
      <span className="onb-label">{title}</span>
      <div className="onb-table-wrap">
        <table className="onb-table onb-matrix">
          <thead>
            <tr>
              <th style={{ minWidth: "170px" }}>Type of Investment</th>
              {levels.map((l) => (
                <th key={l.value} className="center">
                  {l.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVESTMENT_TYPES.map((type) => {
              const name = `${prefix}.${slug(type)}`;
              return (
                <tr key={type}>
                  <td className="onb-row-label">{type}</td>
                  {levels.map((l) => (
                    <td key={l.value} className="center">
                      <input type="radio" name={name} value={l.value} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Phase3FinancialProfile() {
  return (
    <div>
      <Note>
        This section enables us to determine whether the service we provide is
        suitable for you. Please ensure all information is complete, accurate and
        up to date, and notify us promptly if your circumstances change.
      </Note>

      <SectionTitle>Purpose of the Portfolio</SectionTitle>
      <ChoiceGroup
        name="fp.purpose"
        type="checkbox"
        stacked
        options={[
          "To preserve capital",
          "To grow capital",
          "To grow capital to meet future commitments",
          "To generate income to meet current requirements",
        ]}
      />

      <SectionTitle>Employment Status</SectionTitle>
      <div className="onb-grid-2">
        <div className="onb-holder-col">
          <h4 className="onb-holder-title">First Account Holder</h4>
          <ChoiceGroup name="fp.employment.h1" stacked options={EMPLOYMENT_STATUS} />
        </div>
        <div className="onb-holder-col">
          <h4 className="onb-holder-title">Second Account Holder</h4>
          <ChoiceGroup name="fp.employment.h2" stacked options={EMPLOYMENT_STATUS} />
        </div>
      </div>

      <YesNo
        label="Are you licensed, authorised or otherwise regulated by any governmental regulatory authority, or employed by an entity which is licensed, authorised or regulated?"
        name="fp.regulated"
      />
      <TextArea label="Please provide details." name="fp.regulatedDetails" rows={2} />
      <Field
        label="If you work in the financial services sector, please specify the name of the entity you are employed by."
        name="fp.financialEntity"
      />
      <TextArea label="Please list any company directorships." name="fp.directorships" rows={2} />

      <SectionTitle>Assets</SectionTitle>
      <Note>Tell us about your assets. Please specify the currency of each entry.</Note>
      <MoneyTable prefix="fp.assets" rows={ASSET_ROWS} />

      <SectionTitle>Liabilities</SectionTitle>
      <MoneyTable prefix="fp.liabilities" rows={LIABILITY_ROWS} />
      <TextArea
        label="Please provide further detail on any mortgages here (i.e. redemption date, type, interest rate)."
        name="fp.mortgageDetails"
        rows={2}
      />

      <SectionTitle>Net Worth & Proposed Investment</SectionTitle>
      <Field label="What is your total net worth?" name="fp.netWorth" />
      <Field
        label="What value are you proposing to invest with Calyx?"
        name="fp.proposedValue"
      />
      <ChoiceGroup
        label="What percentage of your total net worth does this make up?"
        name="fp.proposedPercent"
        options={[
          { value: "<25", label: "Less than 25%" },
          { value: "25-50", label: "Between 25% and 50%" },
          { value: "50-75", label: "Between 50% and 75%" },
          { value: ">75", label: "More than 75%" },
        ]}
      />
      <TextArea
        label="If you wish to impose any investment restrictions to your account(s), please specify them below."
        name="fp.restrictions"
        rows={3}
      />

      <SectionTitle>Annual Income</SectionTitle>
      <Note>Tell us about your annual income. Please specify the currency of each entry.</Note>
      <MoneyTable prefix="fp.income" rows={INCOME_ROWS} />

      <SectionTitle>Annual Expenditure</SectionTitle>
      <MoneyTable prefix="fp.expenditure" rows={EXPENDITURE_ROWS} />

      <SectionTitle>Financial Dependents</SectionTitle>
      <YesNo label="Do you have any financial dependents?" name="fp.hasDependents" />
      <Field label="Name(s)" name="fp.dependentNames" />
      <TextArea label="Reason for dependency" name="fp.dependentReason" rows={2} />
      <Field
        label="Anticipated date of independence"
        name="fp.dependentIndependenceDate"
        type="date"
      />

      <SectionTitle>Knowledge & Experience</SectionTitle>
      <Note>
        Please indicate the extent of your knowledge and experience of the
        following types of investments.
      </Note>
      <KnowledgeMatrix prefix="fp.knowledge.h1" title="First Account Holder" />
      <KnowledgeMatrix prefix="fp.knowledge.h2" title="Second Account Holder" />
    </div>
  );
}
