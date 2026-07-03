"use client";

import { SectionTitle, Note } from "../fields";

const ROWS = [
  { key: "employment", label: "Employment" },
  { key: "inheritanceGift", label: "Inheritance / Gift" },
  { key: "saleOfBusiness", label: "Sale of Business" },
  { key: "saleOfProperty", label: "Sale of Property" },
  {
    key: "other",
    label: "Other (Distribution from Trust, Life Insurance, Divorce, Lottery win)",
  },
];

export default function Phase2SourceOfWealth() {
  return (
    <div>
      <SectionTitle>Source of Wealth</SectionTitle>
      <Note>
        Please provide information for each individual, and for wealth that has
        been generated jointly. Please specify the currency of each entry.
      </Note>
      <div className="onb-table-wrap">
        <table className="onb-table">
          <thead>
            <tr>
              <th style={{ minWidth: "180px" }}>Source</th>
              <th>First Account Holder</th>
              <th>Second Account Holder</th>
              <th>Joint</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key}>
                <td className="onb-row-label">{row.label}</td>
                <td>
                  <input type="text" name={`sow.${row.key}.h1`} placeholder="Amount + currency" />
                </td>
                <td>
                  <input type="text" name={`sow.${row.key}.h2`} placeholder="Amount + currency" />
                </td>
                <td>
                  <input type="text" name={`sow.${row.key}.joint`} placeholder="Amount + currency" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
