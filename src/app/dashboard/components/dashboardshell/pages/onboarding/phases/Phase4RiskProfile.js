"use client";

import { SectionTitle, Note, ChoiceGroup, YesNo } from "../fields";

const NON_STANDARD_PRODUCTS = [
  {
    key: "structured",
    name: "Structured Products",
    desc: "Customised investments linked to market indices or asset classes (e.g., equities, commodities, currencies). Some offer capital protection, but others may expose you to full market risk. Liquidity can vary.",
  },
  {
    key: "private_equity",
    name: "Private Equity & Limited Partnerships",
    desc: "Investments in private companies via specialist funds. These may use leverage, have long lock-up periods, and involve complex legal and tax considerations.",
  },
  {
    key: "derivatives",
    name: "Derivatives & Warrants",
    desc: "Financial instruments whose value is based on an underlying asset (e.g., equities, currencies). Used for hedging or speculation. Some may carry the risk of losing more than your initial investment.",
  },
  {
    key: "eis",
    name: "Enterprise Investment Schemes (EISs)",
    desc: "Direct investments in small, unlisted UK companies with potential tax advantages. These are high-risk and may be illiquid. Tax advice is recommended before investing.",
  },
  {
    key: "vct",
    name: "Venture Capital Trusts (VCTs)",
    desc: "Professionally managed funds that invest in small, unlisted UK companies. VCTs offer tax benefits but may involve longer lock-up periods and higher risk.",
  },
  {
    key: "ucis",
    name: "Unregulated or Unrecognised Collective Investment Schemes",
    desc: "These funds are not authorised or recognised by the FCA and are not promoted to the general public. They may carry higher risks and limited investor protections.",
  },
  {
    key: "unlisted_property",
    name: "Unlisted Property / Real Estate & Limited Partnerships",
    desc: "Investments may include direct property holdings or property-related funds. These can be illiquid and may involve complex structures or derivatives.",
  },
  {
    key: "hedge_funds",
    name: "Unlisted Hedge Funds",
    desc: "These funds may use leverage and complex strategies. They can be volatile and are often subject to long lock-up periods and limited transparency.",
  },
];

export default function Phase4RiskProfile() {
  return (
    <div>
      <SectionTitle>Risk Questionnaire</SectionTitle>
      <Note>
        In case of joint accounts, please provide answers considering the
        individual circumstances of all account holders.
      </Note>

      <ChoiceGroup
        label="1. How many years of investment experience do you have?"
        name="risk.q1"
        stacked
        options={["Less than 3 years", "3 – 5 years", "6 – 10 years", "More than 10 years"]}
      />
      <ChoiceGroup
        label="2. What is your investment time horizon?"
        name="risk.q2"
        stacked
        options={["Less than 3 years", "3 – 5 years", "6 – 10 years", "More than 10 years"]}
      />
      <ChoiceGroup
        label="3. Which range of annual returns would you find most acceptable for your portfolio?"
        name="risk.q3"
        stacked
        options={["0% to +5%", "–5% to +8%", "–10% to +15%", "-25% to +30%"]}
      />
      <ChoiceGroup
        label="4. If the value of your portfolio was to fall by 20% in a 12-month period, how would you react?"
        name="risk.q4"
        stacked
        options={[
          "I would want to liquidate my investments and hold the proceeds in cash.",
          "I would consider reducing the risk profile of the portfolio.",
          "I would sit tight, expecting the portfolio to recover over time.",
          "I would see this as a long-term buying opportunity.",
        ]}
      />
      <ChoiceGroup
        label="5. If the portfolio was to fall in value by the end of your time horizon, would this have a material impact on your standard of living or ability to meet commitments?"
        name="risk.q5"
        stacked
        options={[
          "Significant impact – I rely on the portfolio entirely for income and/or capital.",
          "Moderate impact – Income and/or capital from the portfolio support my current position and a fluctuation would have an impact.",
          "Low impact – Income and/or capital from the portfolio is supplementary and other sources exist to meet regular commitments.",
          "No impact – I have surplus capital and income, and can tolerate significant fluctuations in the portfolio value.",
        ]}
      />
      <ChoiceGroup
        label="6. What is your view on how readily the investment portfolio can be converted to cash?"
        name="risk.q6"
        stacked
        options={[
          "I would expect the entire portfolio to be convertible to cash on a daily basis.",
          "I would be comfortable with 15%–20% of the portfolio being less accessible.",
          "I would be comfortable with 30%–40% of the portfolio being less accessible.",
          "I am a long-term investor and have other assets to meet current and future commitments; liquidity is not a concern for me.",
        ]}
      />

      <SectionTitle>Investment Strategy</SectionTitle>
      <Note>
        Based on your answers to the Risk Questionnaire an appropriate investment
        strategy has been suggested. Risk profiles: Conservative (6–10), Balanced
        (11–15), Steady Growth (16–20), Equity (21–24).
      </Note>
      <YesNo
        label="Do you wish to proceed with the recommended strategy?"
        name="risk.proceedRecommended"
      />
      <ChoiceGroup
        label="If you would prefer Calyx to classify your risk profile differently, please select your preferred profile:"
        name="risk.overrideProfile"
        options={["Conservative", "Balanced", "Steady Growth", "Equity"]}
      />

      <SectionTitle>Non-Standard Investments</SectionTitle>
      <Note>
        Each authorised signatory must indicate whether they are open to using
        non-standard investments, and confirm that Calyx may discuss these
        products with you and that you have read the corresponding risk warnings.
      </Note>
      <div className="onb-grid-2">
        <YesNo
          label="Account Holder 1 – I am open to using non-standard investments."
          name="risk.nonStandardOpen.h1"
        />
        <YesNo
          label="Account Holder 2 – I am open to using non-standard investments."
          name="risk.nonStandardOpen.h2"
        />
      </div>

      <div className="onb-table-wrap">
        <table className="onb-table onb-matrix">
          <thead>
            <tr>
              <th style={{ minWidth: "200px" }}>Product</th>
              <th className="center">Account Holder 1</th>
              <th className="center">Account Holder 2</th>
            </tr>
          </thead>
          <tbody>
            {NON_STANDARD_PRODUCTS.map((p) => (
              <tr key={p.key}>
                <td className="onb-row-label" style={{ whiteSpace: "normal" }}>
                  <strong>{p.name}</strong>
                  <div style={{ fontWeight: 400, fontSize: "0.78rem", color: "#7a8090", marginTop: "0.25rem" }}>
                    {p.desc}
                  </div>
                </td>
                <td className="center">
                  <input type="checkbox" name={`risk.product.${p.key}.h1`} value="yes" />
                </td>
                <td className="center">
                  <input type="checkbox" name={`risk.product.${p.key}.h2`} value="yes" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
