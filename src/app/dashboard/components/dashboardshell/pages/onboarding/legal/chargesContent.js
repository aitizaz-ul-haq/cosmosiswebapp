// Charges and Regulatory Information (Phase 0, part 1).
// Figures are reproduced exactly as they appear in the supplied PDF.

export function buildCharges(b) {
  const regulator = b.regulator;

  return [
    { k: "title", text: `${b.name.toUpperCase()} CHARGES AND REGULATORY INFORMATION` },
    {
      k: "p",
      text: `${b.name} Standard Charges and the effects on a hypothetical investment portfolio are set out below. Your actual charges will be as agreed, and recorded on the Engagement Letter.`,
    },
    { k: "rule" },

    { k: "sh", text: "Discretionary Management Fee" },
    {
      k: "p",
      text: "1% per annum, calculated on the monthly average of the assets under management (AUM) and charged quarterly in arrears, subject to VAT where applicable",
    },
    {
      k: "p",
      text: "We will notify you in writing any change of fees in the future. Your custodian bank will charge you separately for custody and execution services. We do not receive any fees or third-party payments in relation to these services.",
    },
    { k: "rule" },

    { k: "sh", text: "Lombard Lending" },
    { k: "p", text: "An administration fee of £2,500 will be charged (if applicable)." },
    { k: "rule" },

    { k: "sh", text: "Cost & Charges Summary" },
    {
      k: "p",
      text: "For illustration purposes, we aim to provide a forward-looking twelve-month period and the potential effects of such costs and charges on a hypothetical investment amount. We have based the summary below on £1,000,000 Balanced Portfolio.",
    },
    {
      k: "table",
      head: ["Amount", "Amount", "Percentage (%)"],
      align: ["left", "center", "center"],
      rows: [
        [
          `On-going charges paid to ${b.name} for management service provided`,
          { t: "£10,000", note: "(Subject to VAT where applicable)" },
          "1.00%",
        ],
        [
          "Cost related to ancillary services not included above (custody cost charged by the custodian, including transaction costs).",
          "£5,500",
          "0.25%",
        ],
        [
          "All on-going costs and charges relating to the underlying financial instruments (such as Funds, ETFs, etc.) which are deducted at source from the Net Asset Value of the financial instrument during the holding period.",
          "£6,500",
          "0.65%",
        ],
      ],
      total: ["Total Aggregated Cost", "£19,000", "1.90%"],
    },

    { k: "sh", text: "Cumulative effect of costs and charges on the return of the investment." },
    {
      k: "p",
      text: "Below illustrates the total charges deducted and the impact these could have on the investment return based on a hypothetical investment of £1,000,000. The costs and charges effect are illustrated over a one and five year term assuming a 6.00% net growth rate and a gross return of 7.90%.",
    },
    {
      k: "table",
      head: ["Investment Period", "Year 1", "Year 5"],
      align: ["left", "center", "center"],
      rows: [
        ["What you might get back if no charges at all", "£1,079,000", "£1,462,538"],
        ["What you might get back after charges", "£1,060,000", "£1,338,226"],
        ["Cumulative effect of costs and charges on return", "£19,000", "£124,313"],
      ],
    },
    {
      k: "p",
      text: "For more information, please see Annual Costs and Charges Disclosure which will be sent to you annually.",
    },
    { k: "rule" },

    { k: "sh", text: "Who regulates us?" },
    { k: "p", text: regulator },
    {
      k: "p",
      text: "You can check this on the FCA’s Register by visiting the FCA’s website www.fca.gov.uk/register or by contacting the FCA on 0800 111 6768.",
    },
    { k: "rule" },

    { k: "sh", text: "What to do if you have a complaint?" },
    { k: "p", text: "If you wish to register a complaint, please contact us:" },
    {
      k: "p",
      text: `In writing: Compliance Officer, ${b.legalEntity}, 53 Davies Street, London W1K 5JH.`,
    },
    { k: "p", text: "By email: compliance@nemesisam.com." },
    {
      k: "p",
      text: "If you cannot settle your complaint with us, you may be entitled to refer it to the Financial Ombudsman Service.",
    },
    { k: "rule" },

    { k: "sh", text: "Are we covered by the Financial Services Compensation Scheme (FSCS)?" },
    {
      k: "p",
      text: `${b.entityInline} is covered by the FSCS in the UK. You may be entitled to compensation from the scheme if we cannot meet our obligations. This depends on the type of business and the circumstances of the claim.`,
    },
    { k: "p", text: "Most types of investment are covered up to a maximum of £120,000." },
    { k: "p", text: "Further information about compensation scheme arrangements is available from the FSCS." },
  ];
}
