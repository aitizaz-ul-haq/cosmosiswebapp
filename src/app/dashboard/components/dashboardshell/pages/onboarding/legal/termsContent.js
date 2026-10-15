// Terms of Business and Policies (Phase 0, part 2).
// Wording, clause numbering and ordering follow the supplied PDF exactly,
// including its repeated definitions and numbering quirks.

const h = (text) => ({ k: "h", text });
const sh = (text) => ({ k: "sh", text });
const c = (n, text, lvl = 1) => ({ k: "c", n, text, lvl });
const p = (text, lvl = 0) => ({ k: "p", text, lvl });
const ul = (items) => ({ k: "ul", items });
const sched = (label, text) => ({ k: "sched", label, text });
const annex = (label, text) => ({ k: "sched", label, text });

const CONFLICT_HEAD = ["Issue", "Potential Conflict", "Management Arrangements"];

export function buildTerms(b) {
  const n = b.name;

  return [
    { k: "title", text: "TERMS OF BUSINESS AND POLICIES" },
    { k: "subtitle", text: "In relation to Investment Management Services" },

    // ---------------------------------------------------------------- Contents
    sh("Contents"),
    {
      k: "contents",
      items: [
        ["1", "INTRODUCTION"],
        ["2", "MEANING OF TERMS USED"],
        ["3", "APPOINTMENT"],
        ["4", "WHO WE ARE"],
        ["5", "CLIENT CLASSIFICATION"],
        ["6", "OUR INVESTMENT SERVICES"],
        ["7", "APPLYING FOR OUR SERVICES"],
        ["8", "JOINT APPLICATION"],
        ["9", "COMMUNICATING WITH US"],
        ["10", "CUSTODY SERVICES"],
        ["11", "OUR RIGHTS OVER THE MONEY AND INVESTMENTS IN YOUR PORTFOLIO"],
        ["12", "OVERSEAS INVESTMENTS"],
        ["13", "INVESTING ON BEHALF OF YOUR PORTFOLIO"],
        ["14", "EFFECTING TRANSACTIONS"],
        ["15", "DEALING ARRANGEMENTS"],
        ["16", "AGGREGATION OF TRANSACTIONS"],
        ["17", "EXERCISING VOTING RIGHTS"],
        ["18", "VALUATIONS AND PERIODIC STATEMENTS"],
        ["19", "FEES AND CHARGES"],
        ["20", "DELEGATES AND AGENTS"],
        ["21", "REPRESENTATIONS AND WARRANTIES"],
        ["22", "LIABILITY"],
        ["23", "TERMINATION"],
        ["24", "CHANGES TO THESE TERMS"],
        ["25", "DATA PROTECTION AND CONFIDENTIALITY"],
        ["26", "ANTI-CORRUPTION, PROHIBITED ACTS AND ANTI-TAX EVASION"],
        ["27", "REGULATORY INFORMATION"],
        ["28", "INDUCEMENTS"],
        ["29", "GOVERNING LAW AND JURISDICTION"],
      ],
    },
    p("SCHEDULES"),
    {
      k: "contents",
      items: [
        ["31", "Main differences in FCA Protections owed to Retail Clients and Professional clients"],
        ["32", "Risk Warnings"],
        ["33", "Conflicts of Interest Policy"],
      ],
    },

    // -------------------------------------------------------------------- 1
    h("1. Introduction"),
    c(
      "1.1",
      "These Terms, Schedules and Annexes set out the basis on which we will provide our investment management services (which are set out in paragraph 6) to you and constitute the legal basis of our relationship together with the Engagement Letter and Account Opening Form that you will have submitted to us."
    ),
    c(
      "1.2",
      "You should read these Terms and the other documents mentioned above carefully and retain them for further reference. If there is anything that you do not understand or do not agree with, please contact us so we can discuss them with you."
    ),

    // -------------------------------------------------------------------- 2
    h("2. Meaning of terms used"),
    c("2.1", "In these Terms the following words and expressions have the meanings set out below:"),
    p(
      "“Adviser” means any investment professional, which is authorised and regulated by the FCA to provide investment advice and which you have retained to advise you, and who has your permission to provide us with information about you in order to allow us to provide our Services to you;",
      1
    ),
    p(
      "“Account opening form” means the form and other documents that you or your Advisers have completed in order to receive our Services;",
      1
    ),
    p(
      "“Conflicts of Interest Policy” means our policy which deals with the identification and management of conflicts of interest in accordance with the FCA requirements and for which a summary is provided in Schedule 3;",
      1
    ),
    p(
      "“Custodian” means a third party which is appointed by you to safeguard and administer the investments in your Portfolio as explained in paragraph 10, and to provide execution as explained in paragraph 14;",
      1
    ),
    p(
      "“Dealing arrangements” means arrangements which we may enter into from time to time in accordance with the Rules of the FCA for the receipt of goods or services that relate to the execution of trades or the provision of research, under which we execute client orders in investments;",
      1
    ),
    p(
      "“Engagement Letter” means the letter which you will receive from us which summarizes the terms of our engagement;",
      1
    ),
    p("“FCA” means the Financial Conduct Authority;", 1),
    p(
      "“Investment Guidelines” means the investment guidelines and restrictions set out in your Account Opening Form;",
      1
    ),
    p(
      "“Investment Objectives” means the investment objectives which you are aiming to achieve with your Portfolio and that you have listed as part of the Investment Guidelines;",
      1
    ),
    p(
      "“Investment Restrictions” means the investments that you do not to include in your Portfolio or want to include to a limited extent as detailed in the Investment Guidelines;",
      1
    ),
    p(
      "“Non-Readily Realisable Investments” are defined in accordance with the Rules of the FCA. They include investments which are neither government nor public securities, nor are officially listed or traded on an exchange in an EEA State, nor are regularly traded under the rules of certain exchanges;",
      1
    ),
    p(
      "“Outsourcing” means an arrangement of any form between us and a service provider by which the service provider performs a process, service or activity which would otherwise be undertaken by us;",
      1
    ),
    p(
      "“Penny Share” means an investment in respect of which the selling price is at least 10% below the buying price, but it excludes government and public securities, FTSE-100 shares, stocks and shares of companies with a market capital, at that time, of at least £100 million, and Non-Readily Realisable Investments;",
      1
    ),
    p(
      "“Person” includes one or more individuals, bodies corporate, firms, associations whether incorporated or unincorporated, trustees, personal representatives, and any other entity recognised by law;",
      1
    ),
    p(
      "A Person is “connected with” us if that is the case for the purposes of the Rules of the FCA. This includes without limitation any company which is a holding company or subsidiary company of ours, or which is a subsidiary company of a holding company of ours; it also includes our employees and those of a connected Person;",
      1
    ),
    p(
      "“Non-Readily Realisable Investments” are defined in accordance with the Rules of the FCA. They include investments which are neither government nor public securities, nor are officially listed or traded on an exchange in an EEA State, nor are regularly traded under the rules of certain exchanges;",
      1
    ),
    p(
      "“Outsourcing” means an arrangement of any form between us and a service provider by which the service provider performs a process, service or activity which would otherwise be undertaken by us;",
      1
    ),
    p(
      "“Penny Share” means an investment in respect of which the selling price is at least 10% below the buying price, but it excludes government and public securities, FTSE-100 shares, stocks and shares of companies with a market capital, at that time, of at least £100 million, and Non-Readily Realisable Investments;",
      1
    ),
    p(
      "“Person” includes one or more individuals, bodies corporate, firms, associations whether incorporated or unincorporated, trustees, personal representatives, and any other entity recognised by law;",
      1
    ),
    p(
      "A Person is “connected with” us if that is the case for the purposes of the Rules of the FCA. This includes without limitation any company which is a holding company or subsidiary company of ours, or which is a subsidiary company of a holding company of ours; it also includes our employees and those of a connected Person;",
      1
    ),
    p(
      "“Portfolio” means the money and assets which you entrust to us from time to time as initially specified in the Engagement Letter;",
      1
    ),
    p(
      "“Regulated Market” means a multilateral system operated or managed by a “market operator” which brings together or facilitates the bringing together of multiple buying and selling interests in financial instruments in accordance with fixed rules that the market operator establishes;",
      1
    ),
    p(
      "“Risk Tolerance” means the financial risks that you are willing to take with your Portfolio in order to achieve your Investment Objectives, as specified in the Investment Guidelines;",
      1
    ),
    p("“Rules of the FCA” means the rules and guidance published by the FCA;", 1),
    p("“Services” means the investment management services (which are detailed at paragraph 6);", 1),
    p("“Terms” means these terms of business.", 1),
    p(
      "“Trading Venue” means a regulated market, an MTF or an OTF, as those terms are defined in the Rules of the FCA.",
      1
    ),
    c("2.2", "Interpretation"),
    c(
      "2.2.1",
      "Paragraph headings and titles are for convenience only and do not affect the interpretation of these Terms.",
      2
    ),
    c(
      "2.2.2",
      "Use of the singular includes the plural and vice versa and use of any gender includes any other gender.",
      2
    ),
    c(
      "2.2.3",
      "“Subsidiary company” and “holding company” have the meanings given to them in the Companies Act 2006.",
      2
    ),
    c(
      "2.2.4",
      "Any reference to the rules or requirements of the FCA or to any legislation shall refer to these rules, requirements and legislation as amended and in force from time to time and to any legislation which re-enacts, consolidates or supersedes (with or without modification) any such legislation.",
      2
    ),

    // -------------------------------------------------------------------- 3
    h("3. Appointment"),
    c(
      "3.1",
      "You appoint us as discretionary investment manager of the Portfolio to provide services in accordance with these Terms with effect from the date notified to you in your letter of confirmation."
    ),
    c(
      "3.2",
      "By signing the Engagement letter, you confirm that you, or the entity on whose behalf you are signing, accept these Terms and will be bound by this Agreement. This Agreement will come into effect the later either of the date that we receive a satisfactorily completed and signed Engagement letter from you or that we take control of any relevant assets. For the purposes of fulfilling our obligations under this Agreement, we shall treat you as our client only, and we shall not owe any obligations to any underlying client on whose behalf you act."
    ),

    // -------------------------------------------------------------------- 4
    h("4. Who We Are"),
    c(
      "4.1",
      `${b.entitySubject} is a privately owned asset management company based in London. Founded in 2002, we conduct financial and asset management activities including fund management and discretionary portfolio management. We focus on providing long-term investment performance with a high level of service and full transparency.`
    ),
    c(
      "4.2",
      "We are authorised and regulated by the Financial Conduct Authority whose address is 12 Endeavour Square, London E20 1JN. You can refer to the FCA’s website (www.fca.org.uk) for confirmation of our address and regulatory status. Our FCA registered number is 211205. We are authorised to provide discretionary management services, among other services."
    ),

    // -------------------------------------------------------------------- 5
    h("5. Client Classification"),
    c(
      "5.1",
      "We will treat you as a “Retail Client” (as defined in the Rules of the FCA). Retail Clients benefit from the highest degree of protection under the Rules of the FCA. You may request in writing to be treated as a “Professional Client” (as defined in the Rules of the FCA) rather than a Retail Client. You understand that where we agree to you being treated as a Professional Client, you will lose some of the protections and investor compensation rights afforded to a Retail Client under the Rules of the FCA. We set out the main differences in FCA Protections owed to Retail Clients and Professional Clients in Schedule 1."
    ),
    c(
      "5.2",
      "We will assess the suitability of the Services we provide to you as required to enable us to act in your best interests."
    ),
    c(
      "5.3",
      "In line with Conduct of Business requirements, we are deemed to provide “restricted advice” to our clients. This means that we will manage, advise and make a recommendation after we have assessed your needs and we only select from limited types of products from a limited number of companies."
    ),

    // -------------------------------------------------------------------- 6
    h("6. Our Investment Services"),
    c(
      "6.1",
      `Which service will we provide you with? ${n} provides discretionary portfolio management services to retail and professional clients.`
    ),
    p(
      "Our Services do not include the provision of any investment advice, execution, financial planning or tax advice. If you require financial planning, tax advice or comprehensive investment advice, you should consult a specialist. Please note that we will not be responsible for the tax consequences of any investment decision we make for your Portfolio. You remain responsible for the management of your tax affairs.",
      1
    ),
    c("6.2", "Discretionary Services"),
    c(
      "6.2.1",
      "Our Services consist of managing the money and assets which you entrust to us from time to time (your “Portfolio”) on a discretionary basis. This means that you authorise us to select the investments of your Portfolio as we think best (taking into account your Investment Objectives, Investment Restrictions and Risk Tolerance as further explained in paragraph 6.1.2) and have full authority to instruct your Custodian to buy or sell or hold or otherwise transact in investments for your Portfolio without having to seek your approval. Unless specified otherwise in your Account Opening Form, you specifically authorise us to invest in overseas investments and to carry out all currency conversions as required in relation to the sale and purchase of Designated Investments (as defined in the FCA Rules), including, subject to clause 13.2, securities, bonds, warrants, collective investment schemes, derivatives and structured products (e.g. contracts for differences, options, hedge funds, private equity, property and real estate products, Venture Capital Trusts and Enterprise Initiative Schemes).",
      2
    ),
    c(
      "6.2.2",
      "We will base our investment decisions on the information that you or your Adviser provide to us during the account opening process (please see paragraph 7 below) and subsequently. This includes any investment decisions regarding corporate actions, which you give us authority to make on your behalf. We will ensure that any investment decision we take for your Portfolio is suitable for you because:",
      2
    ),
    p("a) it meets your Investment Objectives;", 3),
    p("b) it complies with your Investment Restrictions;", 3),
    p("c) you are able financially to bear any risks of loss associated with this particular investment;", 3),
    c(
      "6.2.3",
      "the impact of that investment decision on the overall risk of loss to your Portfolio is acceptable in light of your Risk Tolerance which itself must be consistent with your Investment Objectives; and",
      2
    ),
    c(
      "6.2.4",
      "it relates to an investment in respect of which you have the necessary experience and knowledge to understand the risks involved in either that specific investment or when it is mixed with the other assets in your Portfolio.",
      2
    ),
    c(
      "6.2.5",
      "For the purpose of ensuring that our investment decisions are suitable to you the information we hold about you must be up to date and accurate. You or your Adviser must therefore notify us if there are any changes to the information provided to us or to your circumstances. Any failure to notify us of a change may lead to your Portfolio being managed in a way that is not suitable for your needs and we cannot accept any responsibility for this.",
      2
    ),
    c(
      "6.2.6",
      "We will agree with you a meaningful benchmark, based on your investment objectives and the types of investments included in your Portfolio, to enable you to assess our performance when managing your Portfolio.",
      2
    ),
    c(
      "6.2.7",
      "We will exercise reasonable diligence, skill and care to manage your Portfolio in a way that is suitable for you as explained in paragraph 6.1.2 in light of the circumstances which are, or (using our professional skill) should reasonably be, known to us at the time. However the value of investments, and the income arising from them, can go down as well as up, and it is impossible to predict the future performance of your Portfolio. We cannot commit that we will achieve your Investment Objectives nor that your Portfolio will perform in line with or better than the benchmark chosen to evaluate our performance, as explained in paragraph 6.1.6 above.",
      2
    ),
    c(
      "6.2.8",
      "We will not have failed to comply with our obligations under these Terms if we fail to comply with your Investment Restrictions or your Risk Tolerance simply as a result of movements in the investment markets, the reduction in and/or lack of availability of assets which were envisaged for your Portfolio, any inflow to your Portfolio, any outflow from your Portfolio or in any one month period following any change to your Investment Objectives, Investment Restrictions and/or Risk Tolerance. If a breach of your Investment Restrictions and/or Risk Tolerance happens because of these circumstances, then we will use our reasonable endeavours to correct it as soon as reasonably practicable.",
      2
    ),
    c("6.3", "Execution Only Services"),
    c(
      "6.3.1",
      `For those clients who already hold a discretionary account with ${n}, we may offer an execution only service. This will be segregated in a separate account and we will charge separately for this service as detailed in your engagement letter. You retain all power of decision and trading authority and orders will only be placed or executed on your express written or verbal instructions.`,
      2
    ),
    c(
      "6.3.2",
      "For execution-only services, you will, inevitably, be taking responsibility for the decision yourself. We will not provide any advice on investments. Our execution-only service is not for everybody. Clients who choose to invest in this manner should regularly review their investments, or seek professional advice, to ensure that their investments meet their investment objectives. This can be particularly important for those investing towards a defined time horizon. You may instruct us to execute transactions and you agree and acknowledge that we may proceed with these transactions on an execution-only basis, though you should note that we may also, at our discretion, refuse to undertake any transaction if we assess that these transactions are not appropriate to you.",
      2
    ),

    // -------------------------------------------------------------------- 7
    h("7. Applying for our Services"),
    c(
      "7.1",
      "To provide our Services, we need to receive a completed and signed Account Opening Form and Engagement Letter. Your Adviser (if you have one) can assist you in completing these documents."
    ),
    c("7.2", "The Account opening Form requires you to provide information about:"),
    c("7.2.1", "yourself (including your marital, professional, nationality, residency and tax status);", 2),
    c("7.2.2", "your knowledge in investment matters and experience with specific investments;", 2),
    c(
      "7.2.3",
      "your Investment Objectives (in other words what you are hoping to achieve with your Portfolio);",
      2
    ),
    c("7.2.4", "your financial situation and Source of Wealth;", 2),
    c(
      "7.2.5",
      "your Risk Tolerance (in other words the level of risk, including loss to capital, that you are prepared to accept). Your Risk Tolerance must be consistent with your Investment Objectives;",
      2
    ),
    c(
      "7.2.6",
      "your Investments Restrictions (in other words which investments you do not want to hold in your Portfolio or only to a limited extent); and",
      2
    ),
    c("7.2.7", "any other special requirements that you may have.", 2),
    c(
      "7.3",
      "We will provide you with our Services on the basis that by submitting a signed Account Opening Form and Engagement Letter to us you confirm, that:"
    ),
    c(
      "7.3.1",
      "you have full power and authority to appoint us to manage your Portfolio and to comply with your obligations under these Terms;",
      2
    ),
    c(
      "7.3.2",
      "except to the extent that we explicitly agree with you otherwise (such consent we may withhold at our sole discretion), the money and assets in your Portfolio are yours, they are not currently used to secure the payment of a debt or to guarantee that you will fulfil your obligations towards a third party and therefore are not at risk of being taken away from you and you agree that they will stay this way;",
      2
    ),
    c(
      "7.3.3",
      "you agree that we will provide our Services on the basis of the terms and conditions described in these Terms;",
      2
    ),
    c(
      "7.3.4",
      "in relation to investments made pursuant to this Agreement, you will only deal through us and (pursuant to our instructions) the Custodian; and",
      2
    ),
    c("7.3.5", "you have taken all necessary independent professional tax and legal advice on any relevant matters.", 2),
    c(
      "7.4",
      "You confirm that the information you have supplied either directly to us or via your Adviser for the purposes of receiving our Services is complete and accurate to the best of your knowledge. You agree to keep us informed of any changes to this information and to provide us promptly with any further information that we may reasonably request from time to time in order to fulfil our regulatory and/or contractual obligations relating to our Services to you."
    ),
    c(
      "7.5",
      "You acknowledge that a failure to provide us with complete and accurate information promptly may adversely affect our ability to provide you with our Services."
    ),
    c(
      "7.6",
      "Once we have reviewed your signed Account Opening Form, we will confirm in writing in the Engagement Letter the provision of our Services to you under these Terms."
    ),

    // -------------------------------------------------------------------- 8
    h("8. Joint Application"),
    c(
      "8.1",
      "If more than one person or entity is applying to receive our Services each applicant agrees to comply with his obligations as described in these Terms and to be jointly and severally responsible and liable for their performance. This means that each applicant is responsible for himself and for the other applicant(s) and that we may take action against any one or more of the applicants for any breach of the obligations which apply to the applicants under these Terms."
    ),
    c(
      "8.2",
      "We may assume that any communication from one of the applicants will be made on behalf of all the applicants to which the Portfolio relates. Any action we take on such communication will be binding on all the applicants. This means that each applicant has as much authority over the Portfolio as they would were they the sole applicant – this includes the ability to withdraw some or all of the money and assets in the Portfolio. If you wish us to act ONLY if we have received communication from all the applicants, please confirm this in writing. In any event, we reserve the right to request written authority from all the applicants."
    ),
    c(
      "8.3",
      `${b.entitySubject} is a privately owned asset management company based in London. Founded in 2002, we conduct financial and asset management activities including fund management and discretionary portfolio management. We focus on providing long-term investment performance with a high level of service and full transparency.`
    ),
    c(
      "8.4",
      "If one of the applicants is deceased, the surviving applicant(s) must notify us as soon as practicable upon becoming aware of the death. We will have the right but not the obligation to continue managing the Portfolio solely for the benefit of the surviving applicant(s)."
    ),
    c("8.4.1", "written notice of the death or legal incapacity of all of the applicants; or", 2),
    c(
      "8.4.2",
      "written notice of termination from any one of you, in accordance with paragraphs 8.2 and 23.1.",
      2
    ),
    p("These Terms will then be terminated in respect of all the applicants.", 2),
    c(
      "8.5",
      "We are authorised and regulated by the Financial Conduct Authority whose address is 12 Endeavour Square, London E20 1JN. You can refer to the FCA’s website (www.fca.org.uk) for confirmation of our address and regulatory status. Our FCA registered number is 211205. We are authorised to provide discretionary management services, among other services."
    ),

    // -------------------------------------------------------------------- 9
    h("9. Communicating With Us"),
    c(
      "9.1",
      `You can write to us at our office, at 53 Davies Street, London, W1K 5JH or by email to ${b.infoEmail}. You can also telephone us at 0203 167 6000 for general enquiries. If you wish to make a compliant, we can be contacted using our details set out at paragraph 28.3.`
    ),
    c(
      "9.2",
      "Our trading hours are Monday to Friday, from 8:30am to 5:30pm, excluding all UK bank and public holidays. Any communication received by us outside of our trading hours will be deemed received when we next reopen for business."
    ),
    c("9.3", "Communications between us will be in English."),
    c(
      "9.4",
      "We may refuse without liability on our part to accept or to act on any instruction if its authenticity is in doubt or if acting on it would be in breach of any law, market practice or rule of any relevant regulatory body. We are not obliged to give any reason for such a refusal but will notify you as soon as possible if an instruction is rejected."
    ),
    c(
      "9.5",
      "All written communications from us will be signed by us and sent to your last known address as shown in our records. Please remember to let us know should you change your address."
    ),
    c(
      "9.6",
      "All communications sent by post will be deemed to have been received two working days after being properly addressed, stamped and posted."
    ),
    c(
      "9.7",
      "You agree that we may record all telephone calls without your specific consent. The recordings shall remain our sole property and you agree that they will be conclusive in the case of any dispute that you may have with us."
    ),
    c(
      "9.8",
      "You agree that we may telephone you to discuss investments and offer investment services to you which we think may be suitable for you."
    ),
    c(
      "9.9",
      "Your attention is drawn to the fact that telephone conversations may be recorded. We will record all telephone or electronic communications with you which result in or may result in transactions and shall make these recordings available on request to you for a period of five years and, where requested by the FCA, for a period of up to seven years after the date of the relevant recording."
    ),

    // ------------------------------------------------------------------- 10
    h("10. Custody Services"),
    c(
      "10.1",
      "We will not provide custody services to you. This means that we will not hold or receive any money or any of your assets. All assets forming part of the Portfolio will be held by a Custodian and you will need to sign a separate custody agreement in this regard."
    ),
    c("10.2", "You agree to:"),
    c("10.2.1", "appoint a Custodian to provide custodial and safekeeping services in relation to the Portfolio;", 2),
    c(
      "10.2.2",
      "ensure that each Custodian enters into arrangements with regard to the provision of custody services for the whole or relevant part of the Portfolio which are sufficient for us to perform our obligations under this Agreement;",
      2
    ),
    c(
      "10.2.3",
      "ensure that each Custodian has been authorised by you in writing to comply with any of our instructions given in accordance with these Terms. We will not be responsible for supervising the Custodian. Whenever possible, you shall give us a reasonable period of prior notice of any change of Custodian;",
      2
    ),
    c(
      "10.2.4",
      "instruct the Custodian to pay the amount of any fees, costs or expenses payable under these Terms from the Portfolio in accordance with the payment instructions notified by us to the Custodian in accordance to the fees schedule mentioned in the Engagement Letter;",
      2
    ),
    c(
      "10.2.3",
      "instruct the Custodian to provide us with copies of periodic statements and access to electronic systems; and",
      2
    ),
    c(
      "10.2.4",
      "open one or more bank accounts denominated in sterling or foreign currencies with the Custodian(s), and to notify the details of such bank accounts to us in writing.",
      2
    ),
    c(
      "10.3",
      "We may request that uninvested cash in the Portfolio (or any portion of such cash) be placed on deposit with a bank in the UK or elsewhere in the name of the Custodian."
    ),
    c("10.4", "We will not be responsible for any acts or omissions by the Custodian."),

    // ------------------------------------------------------------------- 11
    h("11. Our rights over the money and investments in your Portfolio"),
    c(
      "11.1",
      "Where an amount is due from you to us for the provision of the services under these Terms, we may, when we consider that it is necessary to protect our own interest, use the money you have in your Portfolio to pay the outstanding amount as per paragraph 10.2.4 and if this is not sufficient, we may also sell some or all of the investments in your Portfolio and apply the proceeds to pay the outstanding amount."
    ),

    // ------------------------------------------------------------------- 12
    h("12. Overseas Investments"),
    c(
      "12.1",
      "Overseas investments which are in your Portfolio may be subject to different settlement, legal and regulatory requirements than those which apply within the United Kingdom. As a result of registering your overseas investments in the name of an overseas Custodian they may not be segregated from investments belonging to that Custodian and therefore your protection may be less than for United Kingdom investments if a default occurs on the part of the overseas Custodian. In certain overseas jurisdictions your investments held by an overseas Custodian may not be protected in an insolvency event."
    ),

    // ------------------------------------------------------------------- 13
    h("13. Investing on behalf of your portfolio"),
    c(
      "13.1",
      "We will normally invest your Portfolio in a mixture of shares, bonds and funds. A description of the risks associated with making investments in those types of instruments, along with a description of the risks associated with investing generally, are set out in Schedule 2."
    ),
    c(
      "13.2",
      "We will not enter into any transactions in non-standard investments, as detailed in the Account Opening Form, unless you have initialled the respective Non Standard Investment in Section 4 of theAccount Opening Form in acknowledgment that you understand the specific risks involved."
    ),
    c(
      "13.3",
      "We will not make any investment decision which will or may result in your Portfolio having a short position in any investment. In other words, we will never sell on behalf of your Portfolio an investment that is not part of your Portfolio or sell more of that investment than is held in your Portfolio."
    ),
    c(
      "13.4",
      "You authorise us to invest your Portfolio in securities the price of which may have been influenced by measures taken to stabilise them, provided we comply with our obligations in paragraph 6."
    ),

    // ------------------------------------------------------------------- 14
    h("14. Effecting Transactions"),
    c(
      "14.1",
      "At present, we do not provide execution services ourselves, but rather execute all orders via the Custodian. As such, you agree to provide us with the authority to instruct the Custodian to buy, sell or hold investments on your behalf. We are not responsible for the acts, omissions or default of the Custodian or any counterparty used to buy and/or sell investments for your Portfolio."
    ),
    c(
      "14.2",
      `Which execution venues do we use? ${b.entityInline} uses global custodian banks to execute orders on our behalf. Currently 95% of trades are executed by the banks on regulated market exchanges.`
    ),
    c(
      "14.3",
      "You must, as part of your agreement with the Custodian that the Custodian will act as the executing broker, ensure that you have read and consented to the Custodian’s best execution policy for the purposes of buying and/or investments in the Portfolio."
    ),
    c(
      "14.4",
      "You consent to us, through the Custodian, effecting transactions for your Portfolio outside of a Trading Venue, and we will only execute outside a Trading Venue where we reasonably believe that this is in your best interests."
    ),
    c(
      "14.5",
      "By submitting your Account Opening Form to us you expressly instruct us not to make public any order to buy or sell shares admitted to trading on a Trading Venue at a specified price limit or better and for a specified size which we placed for your Portfolio and which were not immediately executed (and to use reasonable endeavours to procure that any relevant third party involved in the execution of such order does not make it public) unless we consider, in our absolute discretion, that it is appropriate for such details to be made public"
    ),

    // ------------------------------------------------------------------- 15
    h("15. Dealing Arrangements"),
    c(
      "15.1",
      "We do not enter into any dealing arrangements whereby goods and services or research are received in relation to the execution of trades for your Portfolio."
    ),
    c(
      "15.2",
      "Any research will be paid for by us, and will not be paid out of the assets of the Portfolio. We may, however, in the future ask for to pay for research through a research payment account funded by a research charge, and you agree to act reasonably in responding to any such request."
    ),

    // ------------------------------------------------------------------- 16
    h("16. Aggregation of Transactions"),
    c(
      "16.1",
      "We may combine transactions which we carry out for you with those of one or more other clients, or with our own transactions, or that of a Person connected with us, if we reasonably believe that we will obtain a more favourable price than if your transaction had been executed separately or if it is unlikely that the aggregation of transactions will work overall to your disadvantage. We will allocate such transactions on a fair and reasonable basis in accordance with requirements of the FCA. However, the effect of aggregation may from time to time work to your disadvantage in relation to a specific transaction."
    ),

    // ------------------------------------------------------------------- 17
    h("17. Exercising Voting Rights"),
    c(
      "17.1",
      "As a discretionary client you give us general authority to exercise or abstain from exercising any votes attaching to the investments in your Portfolio, in any manner which we believe to be in your interest and in accordance with our obligations under paragraph 6."
    ),
    c(
      "17.2",
      "We have no obligation to exercise or abstain from exercising any votes attaching to the investments in your Portfolio which were made as a result of an Execution-only transaction."
    ),

    // ------------------------------------------------------------------- 18
    h("18. Valuation and Periodic Statements"),
    c(
      "18.1",
      "A valuation by the Custodian, showing the initial value of your Portfolio, will be sent to you as soon as reasonably practicable after you have funded your Portfolio and constitutes part of these Terms. We will send you an updated valuation by the Custodian every quarter."
    ),
    c(
      "18.2",
      "The portfolio will be valued by the Custodian using prices from independent pricing services and such other sources as we may determine, including but not limited to quotations from independent market makers or dealers in the investment concerned. You should be aware that these valuations may not reflect the values that can actually be realised and we cannot guarantee the accuracy of those sources.Where prices of investments are not readily available or where other factors prevent the pricing of investments in this way, we may value investments at such value as we consider fairly reflects the current value of such investment."
    ),
    c(
      "18.3",
      "We will provide you with written periodic statements setting out the value and composition of your Portfolio at least every three months. We may agree between ourselves to provide you with statements on a more frequent basis. We will inform you if the overall value of the Portfolio, as evaluated at the beginning of each reporting period, depreciates by 10 % and thereafter at multiples of 10%, no later than the end of the business day in which the threshold is exceeded or, in a case where the threshold is exceeded on a non-business day, the close of the next business day."
    ),
    c(
      "18.4",
      "Unless you have told us that you do not wish to receive a contract note for each transaction that we effect for your Portfolio, contract notes will be provided to you by the Custodian in writing promptly following the execution of each transaction. They will be provided no later than the first business day following the day on which each transaction is executed or, if we are waiting for confirmation from a third party, no later than the first business day after we receive it. If you wish anyone other than yourself to receive this information please notify us in writing to this effect."
    ),

    // ------------------------------------------------------------------- 19
    h("19. Fees and Charges"),
    c(
      "19.1",
      "We are entitled to receive a fee from you for our Services and to be reimbursed for our reasonable costs and expenses incurred in managing your Portfolio as further explained in paragraph 19.3."
    ),
    c(
      "19.2",
      "Our fees and the charges that will debited from your Portfolio are detailed in the Engagement Letter and paragraph 19.3. They can be changed as explained in paragraph 24.2.6. Our fees are exclusive of VAT. We will charge VAT when applicable."
    ),
    c(
      "19.3",
      "Transactions which we carry out in respect of your Portfolio may be subject to broker commissions,transaction fees, transfer fees, registration fees and stamp taxes or any other applicable transfer or transaction taxes. These fees and taxes may be included in the costs of buying and selling investments in respect of your Portfolio and as such deducted from your Portfolio. You should also be aware of the possibility that other taxes or costs may exist that are not paid through or imposed by us; for example, a tax on the income you may earn from your Portfolio. Your tax treatment depends on your individual circumstances and may be subject to change in the future."
    ),
    c(
      "19.4",
      "We may, in accordance with the rules of the FCA, receive from a third party commissions or other benefits. We will ensure that any commission or benefit received does not prevent us from acting in your best interests. As explained in the Ex-Ante Cost and Charges Disclosures, we will notify you on a quarterly basis of any commission or benefit that we received and retained in relation with your Portfolio."
    ),
    c(
      "19.5",
      "Fees and charges deducted by us from your Portfolio will be notified to you on an aggregated, and on request, itemised basis. Invoices will be sent quarterly unless you ask us not to send them to you. Details of fees and charges will also be included in your quarterly valuation statements."
    ),
    c(
      "19.6",
      "By returning a signed copy of the Engagement Letter to us you authorise us to debit the fees and the charges relating to the provision of the services under this Agreement, upon presentation of an invoice to your Custodian."
    ),

    // ------------------------------------------------------------------- 20
    h("20. Delegates And Agents"),
    c(
      "20.1",
      "We may delegate or Outsource any of our operational functions or investment services under these Terms (whether critical, important or non-critical) to third parties. We may provide information about you and your Portfolio to any person to whom such activities have been delegated or outsourced.However our liability to you for all matters so delegated or Outsourced shall not be affected, we will be responsible for the costs of such delegation or Outsourcing and we will at all times comply with the requirements of the FCA."
    ),
    c(
      "20.2",
      "We may employ agents on such terms as we consider appropriate and in compliance with the requirements of the FCA. We will act in good faith and with due diligence and reasonable care in the selection, use and monitoring of agents."
    ),

    // ------------------------------------------------------------------- 21
    h("21. Representations and Warranties"),
    c(
      "21.1",
      "By signing these Terms, we commit that at the date of commencement of these Terms and on an ongoing basis during the term of these Terms:"
    ),
    c("21.1.1", "we are duly incorporated and validly exist under the laws of England and Wales;", 2),
    c(
      "21.1.2",
      "we have legal capacity and authority to enter into these Terms and these Terms are legal,valid and binding obligations on us which are enforceable against us and do not constitute a breach of any obligation by which we are bound whether by contract, operation of law or otherwise;",
      2
    ),
    c(
      "21.1.3",
      "we have obtained and will obtain all regulatory consents and approvals which are necessary for us in relation to these Terms and will maintain all such necessary regulatory consents and approvals as are necessary for the duration of these Terms;",
      2
    ),
    c(
      "21.1.4",
      "there is not pending or, to our knowledge, threatened against us any action, suit or proceeding at law or in equity or before any court, tribunal, governmental body, agency or official or any arbitrator that is likely to affect the legality, validity or enforceability against us of these Terms or any transaction under them;",
      2
    ),
    c(
      "21.1.5",
      "in carrying out our duties under these Terms, we will act in good faith, exercise all the due skill, care and diligence that would be expected of a professional investment manager, and operate in accordance with best market practice; and",
      2
    ),
    c(
      "21.1.6",
      "we will notify you as soon as practicable if there is any material change in any information we have previously provided to you, which is relevant to the conduct of our duties under these Terms, including any changes to our Conflicts of Interest Policy.",
      2
    ),

    // ------------------------------------------------------------------- 22
    h("22. Liability"),
    c(
      "22.1",
      "We accept responsibility for loss that you suffer as a direct result of a breach of these Terms or of the negligence, wilful default or fraud by us or any Persons connected to us (or any agent delegate or outsource appointed under paragraph 20). We will otherwise not be liable for any loss to you."
    ),
    c(
      "22.2",
      "You accept responsibility for any losses, costs and/or expenses which we incur are a direct result of:"
    ),
    c("22.2.1", "any untrue, misleading, or inaccurate information given by you, or by your Adviser; and", 2),
    c("22.2.2", "a breach of these Terms by you.", 2),
    c(
      "22.3",
      "If you are entering in to these Terms as a trustee, your liability under these Terms is limited, in the absence of fraud, to the assets of the trust from time to time."
    ),
    c(
      "22.4",
      "Neither we nor you will be liable for any failure or delay in performing any obligations under these Terms, and any such failure or delay will not constitute a breach of these Terms, if such failure or delay is due to any cause outside the reasonable control of the affected party. Such cause could include but is not limited to the following events: any act of God, fire, act of Government or supranational bodies or authorities without a reasonable period of prior notice, war, civil commotion, insurrection, act of terrorism or threat of it, embargo, failure of any telecommunication, computer dealing or settlement system, prevention from or hindrance in obtaining any energy or other supplies, labour disputes (affecting companies other than us) of whatever nature, late or mistaken delivery or payment by any bank or counterparty. If such an event occurs, the affected party shall be entitled to a reasonable extension of time for performing its obligations. If we are the affected party we will take such steps as are reasonable and practicable in the circumstances with a view to minimising the effect of the event on you and we will pass on to you (up to the amount of the losses you suffered) any compensation that we may obtain under any action that we take against a third party following such an event."
    ),
    c("22.5", "Nothing in these Terms excludes or restricts any liability we may have to you:"),
    c("22.5.1", "for death or personal injury resulting from negligence;", 2),
    c("22.5.2", "for fraud or fraudulent misrepresentation;", 2),
    c(
      "22.5.3",
      "under the Financial Services and Markets Act 2000 or any regulations made under that Act or under the Rules of the FCA; and",
      2
    ),
    c(
      "22.5.4",
      "for any matter for which we are not permitted by law to exclude or limit, or to attempt to exclude or limit, our liability",
      2
    ),

    // ------------------------------------------------------------------- 23
    h("23. Termination"),
    c(
      "23.1",
      "You and we may terminate our relationship at any time by writing to other relevant party. Our address for these purposes is as set out at paragraph 9.1."
    ),
    c(
      "23.2",
      "We may also terminate our relationship with you and our provision of the Services immediately by writing in accordance with paragraph 9 if:"
    ),
    c(
      "23.2.1",
      "you commit a material breach of your obligations under these Terms and you fail to make good such breach within seven days of receipt of a written request to do so;",
      2
    ),
    c("23.2.2", "you become unable to pay your debts as they fall due or become insolvent or bankrupt; or", 2),
    c("23.2.3", "we cease to be authorised by the FCA.", 2),
    c(
      "23.3",
      "No penalty or other additional payment will be payable on termination of our relationship. However you will be required to pay:"
    ),
    c("23.3.1", "our fees to the date on which we terminate the provision of our Services;", 2),
    c(
      "23.3.2",
      "any costs, charges or expenses that have accrued to the date which we terminate the provision of our Services;",
      2
    ),
    c("23.3.3", "any additional expenses necessarily incurred by us in terminating the provision of our Services; and", 2),
    c(
      "23.3.4",
      "you will have to bear any losses necessarily realised in settling or concluding outstanding transactions effected for your Portfolio.",
      2
    ),
    c("23.4", "Termination will not affect or prejudice:"),
    c(
      "23.4.1",
      "the completion of transactions already initiated for your Portfolio. Such transactions will be completed by us as soon as practicable;",
      2
    ),
    c("23.4.2", "any rights or obligations which may have arisen before the date of termination;", 2),
    c(
      "23.4.3",
      "the provisions of these Terms which are expressed to continue after termination, including without limitation paragraphs 9, 10, 19, 21, 22 and 25.",
      2
    ),
    c(
      "22.5",
      "On termination, we may, without prior notice to you, direct the Custodian to retain and/or realise any of your investments as may be required to settle transactions already initiated, and to pay any outstanding liabilities you have. If there is a dispute as to the payment of our fees or those of a Custodian, you may require the disputed amount to be held in an escrow account pending resolution of the dispute."
    ),

    // ------------------------------------------------------------------- 24
    h("24. Changes to these Terms"),
    c(
      "24.1",
      "We may vary these Terms by giving you at least 30 days’ written notice and describing the relevant changes or sending you a replacement copy of these Terms. The variation shall take effect on the date specified in the notice."
    ),
    c("24.2", "Examples of situations in which we may vary these Terms include:"),
    c(
      "24.2.1",
      "amendments in order to comply with the rules of the FCA or any other legal, tax or regulatory requirements;",
      2
    ),
    c("24.2.2", "to fix any errors, inaccuracies or ambiguities we may discover in these Terms in the future;", 2),
    c("24.2.3", "to make these Terms clearer or more favorable to you;", 2),
    c(
      "24.2.4",
      "to take account of any re-organization we may conduct within the group of companies of which we are a member, or to transfer our rights and obligations under these Terms to another company in our group or which acquires us or any part of our business;",
      2
    ),
    c(
      "24.2.3",
      "to provide for the introduction of new or improved systems, methods of operation,services or facilities; or",
      2
    ),
    c(
      "24.2.4",
      "to reflect an increase in our costs of providing the Services to you or to reflect the costs of third parties which we are allowed to pass through to you under these Terms such as banks and Custodians.",
      2
    ),
    c(
      "24.3",
      "Any amendment of these Terms which is made to reflect a change of applicable law or regulation may take effect immediately or otherwise as specified by us."
    ),
    c(
      "24.4",
      "Please remember that you have the right to end these Terms with us if you do not like a change we propose to make (or have made under paragraph 24.3), by following the procedure in paragraph 23.1. No additional charges or penalties will be payable by you if you terminate in these circumstances, although paragraph 23.3 will continue to apply in the ordinary way."
    ),
    c(
      "24.5",
      "No change will affect any outstanding transaction or any other legal rights or obligations which may have arisen before the date of the change."
    ),

    // ------------------------------------------------------------------- 25
    h("25. Data Protection and Confidentiality"),
    c(
      "25.1",
      `Please refer to our Fair Processing Notice which is available on request and can also be found on our website (${b.website}) to understand what personal data we process about you when providing the Services, how and why we process it (including our legal basis for doing so) and your rights. Please contact ${b.privacyContact}.`
    ),

    // ------------------------------------------------------------------- 26
    h("26. Anti-Corruption, Prohibited Acts and Anti-Tax Evasion"),
    c(
      "26.1",
      "You and we will not, and will take reasonable steps to ensure that any of our agents and delegates will not engage in any activity, practice or conduct which would:"
    ),
    c("26.1.1", "constitute an offence under; or", 2),
    c(
      "26.1.2",
      "cause the other Party to be in breach of, or commit an offence under, any anti-bribery laws, anti-corruption laws, anti-tax evasion laws or sanctions.",
      2
    ),

    // ------------------------------------------------------------------- 27
    h("27. Regulatory Information"),
    sh("Material Interests"),
    c(
      "27.1",
      "Your attention is drawn to the fact that we provide our Services to any person who successfully submits an Account Opening Form. This means that when we provide our Services to you and effect transaction for your Portfolio, we, or a Person connected with us or another of our clients may have, directly or indirectly a material interest or a relationship of any description with another party, which involves or may involve a potential conflict with our duty to you. However, we have established in accordance with the rules of the FCA a Conflict of Interests Policy which allows us to identify and manage potential conflicts of interest to ensure that they will not constitute or give rise to a material risk to your interests being prejudiced when we provide you with our Services. A summary of our Conflict of Interest Policy can be found in Schedule 3 and further details are available on request."
    ),
    c(
      "27.2",
      "We have put in place proper systems and controls to ensure that we comply with all applicable legal and regulatory requirements relating to conflicts and inducements. Provided that we properly follow these systems and controls, neither we nor any Person connected to us shall:"
    ),
    c(
      "27.2.1",
      "be liable to account to you for any amounts made or received from or by reason of any transaction or connected transactions in which there is a potential conflict of interest;",
      2
    ),
    c(
      "27.2.2",
      "be required to disclose the identity of any other client or counterparty involved in such transactions; or",
      2
    ),
    c("27.2.3", "be required to reduce any fees payable by you to us.", 2),

    // ------------------------------------------------------------------- 28
    h("28. Inducements"),
    c(
      "28.1",
      "We will deal with inducements in accordance with the FCA Rules, and shall disclose potential inducements in accordance with the Rules of the FCA and our Compliance Manual."
    ),
    c(
      "28.2",
      "As part of providing the Service to you, we may receive acceptable minor non-monetary benefits. A minor non-monetary benefits is one which:"
    ),
    c(
      "28.2.1",
      "be liable to account to you for any amounts made or received from or by reason of any transaction or connected transactions in which there is a potential conflict of interest;",
      2
    ),
    c(
      "28.2.2",
      "be required to disclose the identity of any other client or counterparty involved in such transactions; or",
      2
    ),
    c("28.2.3", "be required to reduce any fees payable by you to us.", 2),
    c("28.2.4", "consists of:", 2),
    c(
      "28.2.4.1",
      "information or documentation relating to a financial instrument or an investment service, that is generic in nature or personalised to reflect the circumstances of an individual client;",
      3
    ),
    c(
      "28.2.4.2",
      "written material from a third party that is commissioned and paid for by a corporate issuer or potential issuer to promote a new issuance by the company, or where the third party firm is contractually engaged and paid by the issuer to produce such material on an ongoing basis, provided that the relationship is clearly disclosed in the material and that the material is made available at the same time to any firms wishing to receive it, or to the general public;",
      3
    ),
    c(
      "28.2.4.3",
      "participation in conferences, seminars and other training events on the benefits and features of a specific financial instrument or an investment service;",
      3
    ),
    c(
      "28.2.4.4",
      "hospitality of a reasonable de minimis value, such as food and drink during a business meeting or a conference, seminar or other training events mentioned under Clause 28.2.4.4;",
      3
    ),
    c(
      "28.2.4.5",
      "research relating to an issue of shares, debentures, warrants or certificates representing certain securities by an issuer, which is:",
      3
    ),
    p(
      "(a) produced prior to the issue being completed; and by a person that is providing underwriting or placing services to the issuer on that issue; and",
      4
    ),
    p("(b) made available to prospective investors in the issue; or", 4),
    c(
      "28.2.4.6",
      "research that is received so that we may evaluate the research provider’s research service, provided that:",
      3
    ),
    p("(a) it is received during a trial period that lasts no longer than three months;", 4),
    p(
      "(b) no monetary or non-monetary consideration is due (whether during the trial period, before or after) to the research provider for providing the research during the trial period;",
      4
    ),
    p(
      "(c) the trial period is not commenced with the research provider within 12 months from the termination of an arrangement for the provision of research (including any previous trial period) with the research provider;and",
      4
    ),
    p(
      "(d) we make and retains a record of the dates of any trial period accepted under this rule, as well as a record of how the conditions in a. to c. were satisfied for each such trial period.",
      4
    ),

    sh("Complaints"),
    c(
      "28.3",
      `If you have any complaint, you are requested in the first instance to contact your Relationship Manager. Alternatively you can contact ${b.complaintContact}.`
    ),
    c(
      "28.4",
      "Your complaint will be handled in accordance with our internal complaints handling procedure and the rules of the FCA. A copy of our complaints handling procedure is available on request. We treat every complaint very seriously and aim to resolve each complaint fairly and promptly. If you are dissatisfied with our response or if we fail to reply to you within eight weeks of receiving your complaint you may contact the Financial Ombudsman Service, which is an independent service set up by law at Exchange Tower, London E14 9SR. Telephone: 0800 023 4567 or 0300 123 9 123 and their website - http://www.financial-ombudsman.org.uk/."
    ),

    sh("Compensation"),
    c(
      "28.5",
      "We are covered by the Financial Services Compensation Scheme. The Financial Services Compensation Scheme covers all the Services which we provide under these Terms. You may be entitled to compensation from it, up to a maximum of £85,000, if we cannot meet our obligations towards you because of our financial circumstances. Further information can be obtained from us at our head office (the contact details of which are at paragraph 9.1) or the Financial Services Compensation Scheme, 10th Floor, Beaufort House, 15 St Botolph Street, London EC3A 7QU."
    ),

    sh("Legal Information"),
    c(
      "28.6",
      "In performing any service for you we may act either as principal, or as agent as between you and any other client or Person connected or not connected with us."
    ),

    sh("Waiver"),
    c("28.7", "Should we or you fail to:"),
    c("28.7.1", "take action in respect of a breach of these Terms;", 2),
    c("28.7.2", "insist on the strict performance of them; or", 2),
    c("28.7.3", "seek any right or remedy provided by these Terms,", 2),
    p("this will not mean that you or we have agreed to waive or give up that right, power or remedy.", 2),

    sh("Invalidity of a provision"),
    c(
      "28.8",
      "If a court decides that any provision of these Terms or any part of any provision is not valid, lawful or enforceable, such provision or part thereof (as the case may be) shall be ineffective only to the extent of such invalidity, unlawfulness or unenforceability, without rendering invalid, unlawful or unenforceable or otherwise prejudicing or affecting the remainder of such provision or any other provision of these Terms."
    ),

    sh("Transfer of rights and benefits under these Terms"),
    c(
      "28.9",
      "You may not transfer your rights and your obligations under these Terms to anyone else without our written consent."
    ),
    c(
      "28.10",
      "We may transfer our rights and obligations under these Terms to another Person in the United Kingdom which at the time of such transfer is authorised and regulated by the FCA. We will inform you of our intention to effect such transfer at least 30 days before it takes place. If you are unhappy about the proposed transfer of our rights and obligations to a third party, then you can terminate your relationship with us as provided under paragraph 23.1 without any penalty as specified in paragraph 23.3."
    ),

    sh("Rights of third parties"),
    c(
      "28.11",
      "A Person who is not party to these Terms has no rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any of these Terms, but this does not affect any right or remedy of any such Person which exists or is available otherwise than in consequence of that Act."
    ),

    // ------------------------------------------------------------------- 29
    h("29. Governing law and Jurisdiction"),
    c(
      "29.1",
      "These Terms and any and all claims, disputes or proceedings of any kind arising out of or in connection with these Terms shall be governed by and construed in accordance with English law."
    ),
    c(
      "29.2",
      "Both you and we submit to the non-exclusive jurisdiction of the courts of England and Wales or the courts of Scotland if you live in Scotland or the courts of Northern Ireland if you live in Northern Ireland."
    ),

    // ================================================================ Schedule 1
    sched("Schedule 1", "Main differences in FCA Protections owed to Retail Clients and Professional Clients"),
    p(
      "Professional Clients are entitled to fewer protections under the UK and EU regulatory regimes than is otherwise the case for Retail Clients. We set out below a summary of the main protections that you will lose under this Agreement if you request and we agree to treat you as a Professional Client:"
    ),
    c(
      "1.",
      "Communicating with clients, including financial promotions: As a Professional Client the simplicity and frequency in which a firm communicates with you may be different to the way in which they would communicate with a Retail Client. We will ensure however that our communications remain fair, clear and not misleading."
    ),
    c(
      "2.",
      "Information about the firm, its services and remuneration: The type of information that Retail Clients receive about the firms they deal with, the services provided to them and products and how the firm is remunerated differs to what the firm is obliged to provide to Professional Clients. In particular:"
    ),
    c(
      "a.",
      "we are still obliged to provide information on these areas to Professional Clients but the granularity, medium and timing of this may be less specific than if you were treated as a Retail Client;",
      2
    ),
    c(
      "b.",
      "there are particular restrictions on the remuneration structure for staff providing services to Retail Clients which may not be applicable in respect of staff providing services to Professional Clients;",
      2
    ),
    c(
      "c.",
      "the information which a firm provides in relation to costs and charges for its services and/or products may not be as comprehensive for Professional Clients as it would be for Retail Clients; and",
      2
    ),
    c(
      "d.",
      "when handling orders on behalf of Retail Clients, there is an obligation to inform them about any material difficulties in carrying out the orders; this obligation may not apply in respect of Professional Clients.",
      2
    ),
    c(
      "3.",
      "Suitability: In the course of providing discretionary management services, when assessing suitability for Professional Clients, we are entitled to assume, in relation to the products, transactions and services for which you are classified as a Professional Client, that you have the necessary level of experience and knowledge to understand the risks involved in the management of your investments. Firms cannot make such an assumption when dealing with Retail Clients and must assess this information separately, and would be required to provide Retail Clients with a suitability report."
    ),
    c(
      "4.",
      "Dealing: We may consider a range of factors for Professional Clients in order to achieve best execution (price is an important factor but the relative importance of other different factors, such as speed, costs and fees may vary). In contrast, when undertaking transactions for Retail Clients, the total consideration, representing the price of the financial instrument and the costs relating to execution, must be the overriding factor in determining best execution."
    ),
    c(
      "5.",
      "Client reporting: Investment firms that hold a Retail Client account that includes positions in leveraged financial instruments or contingent liability transactions shall inform the Retail Client, where the initial value of each instrument depreciates by 10% and thereafter at multiples of 10%. These reports do not have to be produced for Professional Clients."
    ),
    c(
      "6.",
      "Financial Ombudsman Service: The services of the Financial Ombudsman Service may not be available to you as a Professional Client."
    ),
    c(
      "7.",
      "Investor compensation: Eligibility for compensation from the Financial Services Compensation Scheme is not contingent on your categorisation but on how your organisation is constituted. Hence, depending on how you are constituted you may not have access to the Financial Services Compensation Scheme."
    ),
    c(
      "8.",
      "Exclusion of liability: Our ability to exclude or restrict any duty of liability owed to you is narrower under the Rules of the FCA in the case of Retail Clients than in respect of Professional Clients."
    ),
    c(
      "9.",
      "Trading obligation: In respect of shares admitted to trading on a regulated market or traded on a trading venue, a firm may, in relation to the investments of Retail Clients, only arrange for such trades to be carried out on a regulated market, a multilateral trading facility, a systematic internaliser or a third-country trading venue. This is a restriction which may not apply in respect of trading carried out for Professional Clients."
    ),
    c(
      "10.",
      "Transfer of financial collateral arrangements: As a Professional Client, a firm may conclude title transfer financial collateral arrangements with you for the purpose of securing or covering your present or future, actual or contingent or prospective obligations, which would not be possible for Retail Clients."
    ),

    // ================================================================ Schedule 2
    sched("Schedule 2", "Risk Warnings"),
    p(
      "Risk affects how likely an investment is to fluctuate in value over time. Investment in a discretionary investment management portfolio should be viewed as a medium to long term investment, that is, an investment held typically for over five years. While historically over the longer term shares have outperformed the returns expected from cash and bonds, past performance is no guarantee of future performance, and there is no guarantee that this will be the case and investors should be aware of the risk factors described below. These risk factors do not purport to be a summary of all the risks associated with the investments that will make up the Portfolio and if you require further information you should contact your investment manager."
    ),

    c("1.", "General Risks"),
    sh("Fluctuating value"),
    p(
      "Any investment is subject to market fluctuations and other risks inherent in investing in financial instruments. There can be no assurance that any appreciation in value of investments will occur. The value of investments and the income derived from them may fall as well as rise and investors may not recoup the original amount invested. There is no assurance that the investment objectives of the portfolio will be achieved. Investors requiring income are reminded that income from investments may fluctuate in value and in monetary terms."
    ),
    sh("Limited performance history"),
    p(
      "The portfolio has limited performance history. The past performance of other portfolios managed or advised by the investment manager, as well as the performance of the portfolio, is not indicative of how such portfolio will perform in the future. There can be no guarantee that the performance of any portfolio will be comparable to what it has achieved in the past or that any portfolio will achieve its investment objective. Investing in this portfolio means that an investor’s capital is at risk of loss and you may not get back your original investment."
    ),
    sh("Market Risk"),
    p(
      "Prices of many securities change daily, and can fall based on a wide variety of factors. Examples of these factors include: political and economic news; government policy; changes in technology and business practices; changes in demographics, cultures and populations; natural or human-caused disasters; weather and climate patterns; scientific or investigative discoveries; costs and availability of energy, commodities and natural resources. The effects of market risk can be immediate or gradual, short-term or long-term, narrow or broad."
    ),
    sh("Operational risk"),
    p(
      "The success of the portfolio is dependent on the investment manager developing and implementing appropriate systems and procedures to control operational risk. These systems and procedures may not account for every actual or potential disruption of the investment manager’s operations. Disruptions in the investment manager’s operations may cause the portfolio to suffer, among other things, financial loss, the disruption of its business, liability to third parties, regulatory intervention or reputational damage."
    ),
    sh("Fluctuating value"),
    p(
      "The success of the Portfolio is dependent to a significant degree upon our expertise as your investment manager to manage the portfolio effectively and to achieve the investment objectives. If the investment manager incurs substantial losses the revenues of the investment manager may decline substantially. Such losses may impair the investment manager’s ability to provide you with the same level of service as it has in the past and continue operations. The loss of the service of the investment manager could have a significantly adverse effect on the returns of the portfolio."
    ),
    p(
      "In addition, the success of the portfolio is dependent on the talents and efforts of highly skilled individuals employed by the investment manager and the investment manager’s ability to identify and willingness to provide acceptable compensation to attract, retain and motivate talented professionals and other employees. There can be no guarantee that the investment manager’s investment professionals will continue to be associated with the investment manager throughout the life of the investment, the departure of key individuals within the team managing the Portfolio could have an adverse effect on the Portfolio’s performance."
    ),
    sh("Concentration of Investments"),
    p(
      "Although it is our policy to diversify the investments in the Portfolio, the Portfolio may at certain times incorporate relatively few investments. You could be subject to significant losses if you hold a large position in a particular investment that declines in value or is otherwise adversely affected, including through a default of the issuer."
    ),
    sh("Liquidity and non-readily realisable securities"),
    p(
      "Some investments may be illiquid, meaning they do not have a readily available market on which they can be bought and sold. Consequently it may be difficult for us to obtain reliable information about these investments and the risks associated with them. It may be difficult for us to sell these investments at a reasonable price and within preferred timeframes. In extreme circumstances, it may be difficult to sell such investments at any price. Examples of investments that are usually regarded as liquid or readily realisable are government or public securities and any other security admitted to listing on a regulated market in an European Economic Area (“EEA”) State."
    ),
    sh("Geopolitical Risk"),
    p(
      "Geopolitical risk may arise as a result of political changes or instability in a country. Any change in the laws, regulations, and government policies, political or economic climate of that country may result in increased volatility, liquidity, price and foreign exchange risk associated with investments in the country or region where the geopolitical situation arises. The impact of geopolitical risk is considered to be long-term, as the risk rises over time, given the greater potential for events and changes over time. The effect of any future political change is difficult to predict."
    ),
    sh("Stabilisation"),
    p(
      "We may, from time to time, carry out transactions in securities on your behalf where the price may have been influenced by measures taken to stabilise it."
    ),
    p(
      "Stabilisation enables the market price of a security to be maintained artificially during the period when a new issue of securities is sold to the public. Stabilisation may affect not only the price of the new issue but also the price of other securities relating to it. This process is used in order to help counter the fact that, when a new issue comes onto the market for the first time, the price can sometimes drop for a time before buyers are found."
    ),
    p(
      "The stabilisation rules: (a) limit the period when a stabilising manager may stabilise a new issue; (b) fix the price at which he may stabilise (in the case of shares and warrants but not bonds); and (c) require him to disclose that he may be stabilising but not that he is actually doing so."
    ),
    p(
      "The fact that a new issue or a related security is being stabilised should not be taken as any indication of the level of interest from investors, nor of the price at which they are prepared to buy the securities."
    ),
    sh("Suspensions of Trading"),
    p(
      "The fact that a new issue or a related security is being stabilised should not be taken as any indication of the level of interest from investors, nor of the price at which they are prepared to buy the Under certain trading conditions it may be difficult or impossible to liquidate a position. This may occur, for example, at times of rapid price movement if the price rises or falls in one trading session to such an extent that under the rules of the relevant exchange trading is suspended or restricted. Placing a stop-loss order will not necessarily limit your losses to the intended amounts, because market conditions may make it impossible to execute such an order at the stipulated price.."
    ),
    sh("Breaches in information technology security"),
    p(
      "The investment manager maintains information technology systems, consisting of infrastructure, applications and communications networks to support its business activities. These systems could be subject to security breaches such as “cyber-crime” resulting in theft, a disruption in the investment manager’s ability to close out positions and the disclosure or corruption of sensitive and confidential information. Security breaches may also result in misappropriation of assets and could create significant financial and/or legal exposure for the portfolio. The investment manager seeks to mitigate attacks on its own systems but will not be able to control directly the risks to third-party systems to which they may connect. Any breach in security of the investment manager’s systems could have a material adverse effect on the investment manager and may cause a portfolio to suffer, among other things, financial loss, the disruption of business, liability to third parties, regulatory intervention or reputational damage."
    ),
    sh("Terrorism and catastrophe"),
    p(
      "The portfolio is subject to the risk of loss arising from exposure that it may incur, directly or indirectly, due to the occurrence of various events, including, but not limited to, hurricanes, earthquakes and other natural disasters, terrorism and other catastrophic events. The risk of these losses could be substantial and could adversely affect the return of the portfolio."
    ),
    sh("Custodian Risk"),
    p(
      "Where the Custodian or other service provider has custody of any of the portfolio’s assets, the insolvency of such service provider may result in a delay in or a shortfall of the recovery of such assets."
    ),
    sh("Market Counterparties"),
    p(
      "You may rank as an unsecured creditor of market counterparties in relation to transactions executed through them, cash on deposit with them, and assets that they borrow, lend, pledge or hypothecate. In the event of the insolvency of any market counterparty, you might not be able to recover equivalent assets in part or in full."
    ),
    sh("Foreign Markets"),
    p(
      "Foreign markets will involve different risks from the markets in your home jurisdiction. In some cases the risks will be greater. The potential for profit or loss from transactions on foreign markets or in foreign denominated contracts will be affected by fluctuations in foreign exchange rates."
    ),
    sh("Smaller companies"),
    p(
      "The investment manager may invest in smaller companies which may be less liquid than the securities of larger companies, as a result of inadequate trading volume or restrictions on trading. Securities in smaller companies may possess greater potential for capital appreciation, but also involve risks, such as limited product lines, markets and financial or managerial resources and trading in securities may be subject to more abrupt price movements than trading in securities of larger companies."
    ),
    sh("Emerging and Less Developed Market Risk"),
    p(
      "Countries with emerging and less developed markets include, but are not limited to: (1) countries that have an emerging stock market in a developing economy as defined by the International Finance Corporation, (2) countries that have low or middle income economies according to the World Bank, and (3) countries listed in the World Bank publications as developing countries."
    ),
    p(
      "(a) Political and Economic Risks: Economic and/or political instability could lead to legal, fiscal and regulatory changes or the reversal of existing reforms. This in turn could lead to the possibility of expropriation of assets, confiscatory taxation, political or social instability or diplomatic developments which could affect investment in those countries. These are also varying levels of government supervision and regulation of exchanges, financial institutions and issuers in these countries."
    ),
    p(
      "(b) Accounting Risk: Entities in some countries may not be subject to accounting, auditing and financial reporting standards and requirements comparable to those to which certain investors may be accustomed."
    ),
    p(
      "(c) Currency fluctuations: Significant changes in the currencies of countries in which investments are made may occur following investment in these currencies. These changes may impact the total return of the portfolio to a significant degree. In respect of currencies of certain emerging countries, it may not be possible to undertake currency hedging techniques"
    ),
    p(
      "(d) Market, Settlement and Custody Risks: Settlement and custody systems in emerging markets are not as well developed as those in developed markets. Standards may not be as high and supervisory and regulatory authorities not as sophisticated. As a result there may be risks that the settlement may be delayed and that cash or securities could be disadvantaged. Certain financial markets, while general growing in volume, have for the most part, substantially less volume than more developed markets and securities of many companies in those less developed markets are less liquid and their prices more volatile than securities of comparable companies in more sizable markets. There may also be less publicly available information about certain financial instruments in less developed countries than some investors would find customary"
    ),
    p(
      "(e) Investment and Remittance Restrictions: In some cases, emerging markets may restrict the access of foreign investors to securities. As a result, certain equity securities may not always be available to the investment manager because the maximum number of or investment by foreign shareholders has been reached. In addition, the outward remittance by foreign investors of their share of net profits, capital and dividends may be restricted or require government approval. The investment manager will only invest in markets in which it believes those restrictions to be acceptable. However, there can be no guarantee that additional restrictions will not be imposed."
    ),
    sh("Regulatory risk"),
    p(
      "The regulatory environment is evolving and changes therein may adversely affect the ability of the investment manager to pursue its investment objectives."
    ),
    sh("Currency Exposure"),
    p(
      "Certain of the Portfolio assets may be invested in securities and other investments which are denominated in currencies other than Sterling. Accordingly, the value of such assets may be affected favourably or unfavourably by fluctuations in currency rates between such currency and Sterling. We may seek to institute certain currency hedging transactions to mitigate such adverse currency movements. However, even if it does so, there can be no assurance that such currency hedging will be successful."
    ),
    sh("Foreign Markets"),
    p(
      "Foreign markets will involve different risks from the markets in your home jurisdiction. In some cases the risks will be greater. The potential for profit or loss from transactions on foreign markets or in foreign denominated contracts will be affected by fluctuations in foreign exchange rates."
    ),
    sh("Portfolio Turnover"),
    p(
      "The portfolio’s investment strategy may involve frequent trading, which may result in higher investment costs and charges that will be borne by your investment."
    ),
    sh("Inflation Risk"),
    p(
      "Inflation may affect the real value of an investor’s savings and investments which may reduce the buying power of the money that they saved and their investments."
    ),
    sh("Tax Considerations"),
    p(
      "Because certain countries may have tax practices that are unclear or may be subject to changes in interpretation of laws (including changes effective retrospectively), the portfolio (and the underlying assets) could become subject to additional taxation which is not anticipated either at the date of this agreement or when investments are made, valued or disposed of."
    ),
    p(
      "The tax treatment of an investment for individual clients is relevant only to the specific circumstances of each client. There can be no guarantee that the nature, basis or incidence of taxation may not change during the lifetime of an investment. This may cause you potential current or future tax liabilities."
    ),
    p(
      "If your circumstances are changing, or if you are uncertain about any aspect of how an investment might relate to your its tax position, you should seek professional tax advice."
    ),
    p(
      "There can be no assurance that tax may not be withheld as a result of any change in applicable law, treaties, rules or regulations or their interpretation. The Custodian may not be able to recover such withheld tax, so any change could have an adverse effect on the value of the Portfolio. Tax laws are subject to change, and you could incur tax liabilities as a result of such changes."
    ),

    c("2.", "Investment Specific Risks"),
    sh("Equity Risk"),
    p(
      "Investing in equity securities may offer a higher rate of return than those in short-term and long-term debt securities. However, the risks associated with investments in equity securities may also be higher, because the investment performance of equity securities depends on factors which are more difficult to predict than debt securities. A fundamental risk associated with any equity portfolio is the risk that the value of the investments and income it holds might decrease in value and that investors may not get back the full amount of their investment. Equity security values may fluctuate in response to, for example, the activities of an individual company, in response to general market and/or economic conditions."
    ),
    sh("Fixed Income Securities"),
    p(
      "Fixed income securities are subject to the risk of an issuer’s ability to meet principal and interest payments on the obligation (credit risk), and may also be subject to price volatility due to such factors as interest rate sensitivity, market perception of the creditworthiness of the issuer and general market liquidity (market risk). The fixed income securities in which the portfolio invests are interest rate sensitive. An increase in interest rates will generally reduce the value of fixed income securities, which a decline in interest rates will generally increase the value of fixed income securities. The performance of the investment will therefore depend in part on the ability of the investment manager to anticipate and respond to such fluctuations on market interest rates, and to utilise appropriate strategies to maximise returns, while attempting to minimise the associated risks to investment capital."
    ),
    sh("Underlying funds"),
    p(
      "The investment manager may invest part or all of the assets in collective investment schemes (funds) or other pooled vehicles managed by a third party which could incur additional costs. Should an underlying fund fail for any reason, the value of the portfolio may reduce accordingly."
    ),
    sh("Funds"),
    p(
      "Collective investment products (known as funds) include Unit Trusts, Investment Trusts and Open-Ended Investment Companies (“OEICs”, also known as “ICVCs” - Investment Companies with Variable Capital). Investment Trusts are listed companies, with shares traded on the London Stock Exchange; Unit Trusts and OEICs are traded through the scheme’s operator or manager."
    ),
    p(
      "Funds allow individual investors to pool their money with those of other investors. This enables them to participate in a wider range of investments than would be feasible for an individual investor through direct investment."
    ),
    p(
      "The value of the units or shares in a collective investment product will vary depending on the value of the underlying investments of the fund. Consequently the risks relating to collective investment products will depend on the risks involved in the underlying investments made by the scheme in question. The more specialist the investment, the more volatile the price of the investment. Furthermore, the value of any income (in the form of dividends or interest) and the original investment itself may fall as well as rise. There is no guarantee that the investor will receive all or any of his original investment."
    ),
    p(
      "The liquidity of funds varies enormously. An investor may not be able to realise his investment when he chooses because the underlying assets may not be readily saleable. Some funds may be illiquid because opportunities to withdraw from the fund during the investment period are rare. Some funds may also impose penalties on investors who redeem their investment before a specific date."
    ),
    sh("Exchange Traded Funds"),
    p(
      "The investment manager may invest in Exchange Traded Funds (ETFs). An ETF trades like a common stock and represents a fixed portfolio of securities designed to track a particular market index. The risk of owning an ETF generally reflect the risks of owning the underlying securities that they are designed to track, although lack of liquidity in an ETF could result in it being more volatile and ETFs have management fees that increase their costs. ETFs are also subject to other risks, including: (a) the risk that their prices may not correlate perfectly with changes in the underlying index; and (b) the risk of possible trading halts due to market conditions or other reasons that, in the view of the exchange on which an ETF trades, would make trading in an ETF inadvisable. An exchange-traded sector may also be adversely affected by the performance of that specific sector or group of industries on which it is based."
    ),
    sh("Hedge Funds"),
    p(
      "Prices of many securities change daily, and can fall based on a wide variety of factors. Examples of these factors include: political and economic news; government policy; changes in technology and business practices; changes in demographics, cultures and populations; natural or human-caused disasters; weather and climate patterns; scientific or investigative discoveries; costs and availability of energy, commodities and natural resources. The success of the portfolio is dependent on the investment manager developing and implementing appropriate systems and procedures to control operational risk. These systems and procedures may not account for every actual or potential disruption of the investment manager’s operations. Disruptions in the investment manager’s operations may cause the portfolio to suffer, among other things, financial loss, the disruption of its business, liability to third parties, regulatory intervention or reputational damage."
    ),

    c("3.", "NON STANDARD INVESTMENTS"),
    p(
      "We will not enter into any transactions in non-standard investments, by which we mean unlisted property / real estate, limited partnership, Venture Capital trusts (“VCT”), Enterprises Investment Schemes (“EISs”), structured products, unregulated and unrecognized collective investment schemes, unlisted private equity and limited partnerships, and unlisted hedge funds, derivatives or warrants unless you have initialled the respective Non Standard Investment in Section 4 of the Account Opening Form in acknowledgment that you understand the specific risks involved."
    ),
    p(
      "We have deemed that the below non-standard investments are appropriate for informed retail clients. The identified target market is subject to change, as per our product governance policy and procedure."
    ),
    p(
      "Please note that where the information below refers to a particular tax treatment, this treatment may depend on the relevant individual circumstances relating to the investment and may be subject to change in the future."
    ),
    sh("Unlisted property / real estate, limited partnership"),
    p(
      "Property related products mostly invest in direct or indirect property as well as other property related structures, typically property funds, certificates, indices or derivatives. Some property investments may be subject to lengthy lock up periods, and may be set up to be highly illiquid. As such, you may not be able to realise your investment immediately, or if you do sell the price may reflect a forced seller discount. Depending on how they are set up, e.g. as a collective investment scheme, using derivatives, they will also have the risks relevant to the type of set up used, including as set out below."
    ),
    sh("VCT"),
    p(
      "VCTs, a type of investment trust, are professionally managed collective investment schemes listed on the London Stock Exchange, whose main business activity is investing in fledgling venture capital backed unquoted companies. These unquoted companies will ordinarily be at an earlier stage of development than larger quoted companies and will therefore carry a greater risk of failing."
    ),
    p(
      "VCTs can, and some do, borrow money to make investments. This can increase the volatility of the price of the shares of the VCT itself and can increase the risk of the investment in the VCT. The effect of the borrowing is that where there is a rise in the price of the underlying securities, the value of the net assets attributable to each VCT security rises by a greater percentage, and when the value of the underlying portfolio falls, the net assets attributable to each VCT security falls by a greater percentage. VCTs often pursue a policy of “cross- investing” in other investment trusts, which in turn may also be borrowing money to leverage themselves. So, where an investment trust employs a higher degree of direct or indirect leverage, its securities are likely to be subject to significant fluctuations in value, and, as a result, holdings in such VCT may be subject to sudden falls in value."
    ),
    p(
      "VCTs must be approved by HMRC for the purpose of the scheme. Once invested an investor may be entitled to various income tax and Capital Gains Tax (“CGT”) reliefs, and VCTs are exempt from corporation tax on any gains arising on the disposal of their investments. However, in order to take advantage of the tax relief associated with VCTs, you should be aware that you must hold your investments therein for at least 5 years from the date of purchase."
    ),
    sh("EISs"),
    p(
      "EISs are tax efficient schemes approved by HMRC to encourage investment into small unquoted companies carrying on a qualifying trade in the United Kingdom. Investment in companies that are not listed on a stock exchange often carries a high risk and the tax relief is intended to offer some compensation for that risk.As such, EIS investments are inherently high risk in nature. The specific risks vary depending on the particular EIS (e.g. an EIS based on investment in a single company is, of its nature, riskier than a more widely diversified EIS). Because the underlying holdings are not listed, the manager of an EIS cannot sell them, and unlike a VCT, the EIS itself is not traded on any market. Investors accordingly must wait until the manager realizes the cash value of the underlying holding(s) before they can redeem the value of their investment. You also face risk in relation to Capital Gains Tax (“CGT”). If a capital gain is deferred by means of investment in an EIS, the same gain is re-crystallised when the EIS is sold. If the CGT rate falls, investors benefit, but if it rises then they will lose out. You should also be aware of the equity risk, and the smaller companies risks, as detailed above, before investing into an EIS."
    ),
    sh("Structured products"),
    p(
      "Structured products are synthetic investments specially created to meet specific needs that ordinarily cannot be met from the standardised financial investments available in the markets. Structured products can be used: as an alternative to a direct investment; as part of an asset allocation process to reduce the risk exposure of a portfolio; or to take advantage of a current market trend."
    ),
    p(
      "A structured product is ordinarily a pre-packaged investment strategy, which is based on derivatives (i.e. options and, to a lesser extent, swaps). They may feature protection of the principal if held to maturity. You should always check whether a structured product is principal protected or not."
    ),
    p(
      "The range of structured products available may include those where the return is linked to an index or indices, a basket of securities or other specified factors which relate to one or more of the following: equity or debt securities, interest rates, currency exchange rates or commodities. Investments linked to the performance of an index do not include an allowance for any return or reinvestment of dividend income from the underlying constituents of the index."
    ),
    p(
      "As mentioned above, some of the products include an element of principal protection, at a level which is stated at the time of the initial investment, so that on maturity of the investment you are assured of the return, at a minimum, of the stated proportion of your initial capital invested (subject always to the credit of the issuer of the product). In respect of some products which include an element of principal protection, the return of the stated proportion of your initial capital invested may depend on a pre-agreed level of performance being achieved or the product being held to maturity. If the performance is not attained or the product is not held to maturity the element of principal protection will not apply. If you decide to redeem or sell the investment before its stated maturity, you may not gain the maximum benefit of the investment and may receive a poor return or less than the initial capital invested. Early redemption penalties may be applicable in some circumstances."
    ),
    p(
      "These investments may also involve a degree of gearing, so that a relatively small movement in the relevant index/ indices, basket or other specified factor(s) results in a disproportionately large movement, unfavourable or favourable, in the amount paid out to you on maturity of the investment."
    ),
    p(
      "Some structured products may have a limited secondary market; it may therefore be difficult to deal in such investments or to obtain reliable information about their value."
    ),
    sh(
      "Unregulated and unrecognized collective investment schemes, unlisted private equity and limited partnerships, and unlisted hedge funds"
    ),
    p(
      "Hedge funds and other private investment fund investments (“Alternative Investments”) may involve complex tax and legal considerations and can be subject to considerable risks. They are often structured in the form of collective investment schemes but may not be subject to the same regulatory requirements or oversight as regulated collective investment schemes, which are subject to certain rules, disclosures and liquidity requirements. Sponsors or managers of Alternative Investments may also not be registered with any government agency or regulatory authority."
    ),
    p(
      "Alternative Investments often engage in leverage and other speculative investment practices, which involve a high degree of risk. Such practices will often increase the volatility of the performance of the Alternative Investment and increase the risk of investment loss, including the loss of the entire amount that is invested. Interests in Alternative Investments are often highly illiquid as there is no public market for such interests and are often only transferable with consent. The illiquid nature of such investments can mean interests can be difficult to value and can render transfer (particularly within a required timeframe) difficult."
    ),
    p(
      "Investors in Alternative Investments may also have limited rights with respect to their investment interest,including limited voting rights and participation in the management of the Alternative Investment."
    ),
    p(
      "Alternative Investments will often invest in other products or vehicles that may be highly illiquid and difficult to value. Alternative Investments may not be required to provide you with regular periodic pricing or valuation information. This may limit your ability to redeem or transfer your investment or delay receipt of redemption proceeds."
    ),
    p(
      "Alternative Investments may impose significant fees and charges, including management fees that are based upon a percentage of the realized and unrealized gains or management fees that are set at a fixed percentage of assets under management regardless of performance returns."
    ),
    sh("Derivatives and warrants"),
    sh("Derivatives"),
    p(
      "Structured products are synthetic investments specially created to meet specific needs that ordinarily cannot be met from the standardised financial investments available in the markets. Structured products can be used: as an alternative to a direct investment; as part of an asset allocation process to reduce the risk exposure of a portfolio; or to take advantage of a current market trend."
    ),
    sh("Futures"),
    p(
      "Futures involve the obligation to make, or to take delivery of the underlying physical asset of the contract at a future date, or in some cases to settle the position with cash. The ‘gearing’ or ‘leverage’ often obtainable in futures trading means that a small deposit or down payment can lead to large losses as well as gains and a relatively small movement can lead to a proportionately much larger movement in the value of your investment, and this can work against you as well as for you. Futures transactions have a contingent liability, and you should be aware of the implications of this, in particular the margining requirements. Futures are different to options as options give the holders the right to buy or sell an underlying asset at expiration while the holder of a futures contract is obligated to fulfil the terms of his contract"
    ),
    sh("Options"),
    p(
      "An option is the right either to buy or to sell a specified amount or value of a particular underlying interest at a fixed exercise price by exercising the option before its specified expiration date. An option that gives the right to buy is called a “call” option, an option which gives the right to sell is called a “put” option."
    ),
    p(
      "There are two types of options – physical delivery options and cash settled options. Physical delivery gives the owner the right to receive physical delivery (if it is a call) or to make physical delivery (if it is a put) of the underlying interest when the option is exercised. A cash settled option gives its owner the right to receive a cash payment based on the difference between the determined value of the underlying interest at the time the option is exercised and the fixed exercise price of the option. You may be required to pay monies as well as receive monies under a cash settled option."
    ),
    p(
      "Each options market selects the underlying interest in which options are traded on that market. For example, you can have options on equities, stock indices, government debt, securities and foreign currencies."
    ),
    p(
      "Buying options involves less risk than selling options because, if the price of the underlying asset moves against you, you can simply allow the option to lapse. The maximum loss is limited to the premium, plus any commission or other transaction charges. However, if you buy a call option on a future contract and you later exercise the option, you will acquire the future. This will expose you to the risks described under ‘futures’ and ‘contingent liability investment transactions’."
    ),
    p(
      "If you write an option, the risk involved is considerably greater than buying options. You may be liable for margin to maintain your position and a loss may be sustained well in excess of the premium received. By writing an option, you accept a legal obligation to purchase or sell the underlying asset if the option is exercised against you, however far the market price has moved away from the exercise price. If you do not already own the underlying asset which you have contracted to sell the risk can be unlimited. Only experienced persons should contemplate writing uncovered options, and then only after securing full details of the applicable conditions and potential risk exposure."
    ),
    p(
      "Certain London Stock Exchange firms under special exchange rules write a particular type of option called a ‘traditional option’. These may involve greater risk than other options. Two way prices are not usually quoted and there is no exchange market on which to close out an open position or to effect an equal and opposite transaction to reverse an open position. It may be difficult to assess its value or for the seller of such an option to manage his exposure to risk."
    ),
    p(
      "Certain options markets operate a margined basis, under which buyers do not pay the full premium on their option at the time they purchase it. In this situation, you may subsequently be called upon to pay margin on the option up to the level of your premium. If you fail to do so as required, your position may be closed or liquidated in the same way as a futures position."
    ),
    p(
      "Options are very time sensitive investments. An options contract is for a short period - generally a few months. The buyer of an option could lose his or her entire investment even with a correct prediction about the direction and magnitude of a particular price change if the price change does not occur in the relevant time period"
    ),
    sh("Contracts for Differences (CFDS)"),
    p(
      "A CFD is a derivative contract that gives the holder exposure to the underlying equity or index, but without paying the full price of the total value of the position. Contracts for difference are traded on margin, and the profit/loss is determined by the difference between the buy and the sell price. CFDs may be suitable for short- term trading but become expensive for holding long-term positions."
    ),
    p(
      "When trading on margin, a sudden drop in the price of an instrument (i.e., the underlying equity) could cause you to receive a margin call. In that case, you would be required to deposit additional collateral into your account. If you do not respond in a timely manner, the existing collateral in your account could be sold, or your positions liquidated, in order to cover the call, and you would be responsible for any losses to your account."
    ),
    p(
      "CFDs are a leveraged product, meaning you can gain exposure to the markets by depositing just a percentage of the full value of the trade. This means that while you could make a potential profit if the market moves in your favour, you could just as easily lose more than your deposit if the trade moves against you. CFDs do not provide ownership or any rights to the underlying instrument and does not entitle you to the delivery of the underlying instrument at any stage."
    ),
    p(
      "Volatility in the market may create conditions where orders are difficult to execute, since the price might be many pips away due to the extreme market movement or gapping. Execution is subject to available liquidity at any and all price levels. This means that if a stop-loss order cannot be executed at your chosen price in the market, or cannot be executed in the desired volume at the chosen price, the order will be filled at the best available price at that time."
    ),
    p(
      "You should not deal in CFDs unless you understand their nature and the extent of your exposure to risk. You should also be satisfied that the product is suitable for you in the light of your circumstances and financial position. Although CFDs can be utilised for the management of investment risk, it may not be suitable for some investors."
    ),
    sh("Forward"),
    p(
      "A forward contract is a customized contract between two parties to buy or sell an asset at a specified price on a future date. Unlike standard futures contracts, a forward contract can be customized to any commodity, amount and delivery date. A forward contract settlement can occur on a cash or delivery basis."
    ),
    p(
      "Forward contracts do not trade on a centralized exchange and are therefore regarded as over-the-counter (OTC) instruments. While their OTC nature makes it easier to customize terms, the lack of a centralized clearinghouse also gives rise to a higher degree of default risk. Forwards are subject to the risk that the other party to a contract will fail to honour the terms of the contract (counterparty risk). To add, trading out of a forward contract is very difficult because it can only be done with the consent of the other party."
    ),
    p(
      "Forwards are appropriate for informed retail and professional clients. The identified target market is subject to change, as per the firm’s product governance policy and procedure."
    ),
    sh("Other risks relating to derivatives"),
    p(
      "Contingent liability investment transactions: These are derivative transactions under the terms of which the client will or may be liable to make further payments when the transactions to be completed or on closing out a position"
    ),
    p(
      "Margin for contingent liability investment transactions: If you undertake transactions in futures, contracts for differences or options you may sustain a loss of the margin you deposit to establish or maintain a position. If the market moves against you, you may be called upon to pay additional margin at short notice to maintain a position. If the request for additional margin is not met, your position may be liquidated at a loss, and you will be responsible for the resulting deficit."
    ),
    p(
      "Margin for purchasing securities: If you purchase securities using “margin” (i.e. money you are borrowing to purchase securities), you are subject to a greater risk than you would be if you purchased fully paid for securities. If the value of the assets in your account(s) falls then may be required to deposit additional securities or monies to secure the loan, which has been made to you to purchase securities. If you fail to meet the additional requests for payment, then we may realise your assets to pay down or pay off your loan (without prior notice and potentially at a loss or lower price than in other circumstances). You are liable for any debits as a result of such enforced sales"
    ),
    sh("Warrants"),
    p(
      "A warrant ordinarily gives the holder of the warrant the right to subscribe for shares, debentures, loan stock or government securities at a specific price within a certain time frame and is exercisable against the original issuer of the underlying securities. The prices of warrants can be volatile as a relatively small movement in the price of the underlying security may result in a disproportionately large movement, unfavourable or favourable, in the price of the warrant. It is essential when considering purchasing warrants to understand that the right to subscribe which a warrant confers is invariably limited in time with the consequence that if you fail to exercise this right within the predetermined timescale then the investment becomes worthless."
    ),
    p(
      "You should not buy a warrant unless you are prepared to sustain a total loss of the money you have invested plus any commission or other transaction charges."
    ),
    p(
      "Each warrant is a contract between the warrant holder issuer and the holder. You are therefore also exposed to the risk that the issuer will not perform its obligations under the warrant. The price of a warrant may reflect the value attributed to the life of the warrant."
    ),
    sh("Covered Warrants"),
    p(
      "A covered warrant is a type of warrant that allows the holder to buy or sell a specific quantity of shares, currency or other financial instruments from an issuer, usually a bank or similar financial institution at a specific price and time. The main differences between normal warrants and covered warrants are:"
    ),
    p(
      "(a) Covered warrants can have a wide variety of underlying assets. Normal warrants only have the issuing company’s stock as their underlying asset.",
      1
    ),
    p(
      "(b) Covered warrants are only issued by financial institutions. Normal warrants are only issued by the company that issued the underlying stock.",
      1
    ),
    p(
      "(c) Covered warrants can have a variety of exercise prices depending on the conditions set forth in each issue. Normal warrants ordinarily have only one exercise price.",
      1
    ),
    p(
      "(d) Covered warrants allow the warrant holder to buy or sell the underlying assets. Normal warrants allow the warrant hold only to buy the underlying assets.",
      1
    ),
    p(
      "The firm has deemed that Covered Warrants are appropriate for informed retail and professional clients. The identified target market is subject to change, as per the firm’s product governance policy and procedure"
    ),

    // ================================================================ Schedule 3
    sched("Schedule 3", "Conflicts of Interest Policy"),
    sh("Identification of Conflicts"),
    p(
      "The Management Body of the Firm, in conjunction with Legal and Compliance and business unit heads, take responsibility for implementing systems and controls designed to prevent conflicts of interest in the business of the Firm. These are outlined in the Conflicts Inventory (as appended below in Annex A), which are updated as and when a new conflict is identified and reviewed overall on a periodic basis."
    ),
    sh("Conflict Prevention"),
    p(
      "Where a potential conflict is identified, the Firm will seek to organise its business activities in a manner that prevents the crystallisation of the conflict. This will include the appropriate segregation of functions and business lines such that a level of independence may be achieved. To the extent appropriate to the size and scale of the business, this may involve, inter alia:"
    ),
    ul([
      "Information barriers to prevent or control the exchange of information between employees engaged in activities involving a risk of conflict of interest where the exchange of that information may harm the interests of one or more clients.",
      "Functional independence",
      "Separate supervision of relevant employees whose main functions involve carrying out activities or providing services for clients whose interests may conflict, or otherwise represent interests that may conflict.",
      "A review of remuneration arrangements in the Firm where these might give rise to conflicts of interest in relation to the activities or services provided by the relevant employees.",
      "Reassignment of employees to prevent or control the simultaneous or sequential involvement of relevant employees in separate services or activities where such involvement may impair the proper management of conflicts of interest.",
      "Policies and procedures covering Inducements, PA dealing and external interests.",
    ]),
    p(
      "However, it is accepted that, despite the implementation of all appropriate controls to prevent the occurrence, the complete avoidance of all conflicts may not be feasible in a commercial environment."
    ),
    sh("Conflict Management"),
    p(
      "Where conflicts are unavoidable, the Firm will take appropriate measures to mitigate and manage such conflicts in a manner that seeks to ensure that the Firm and its Personnel are not advantaged and that no client is adversely effected. The clients’ best interests remain paramount."
    ),
    sh("Conflicts Disclosure"),
    p(
      "Where the Firm is not reasonably confident that it is able to manage a particular conflict to adequately protect the interest of a client, the fact of /or sources of conflicts of interest will be clearly disclosed to the client before the Firm undertakes any business. In particular, the disclosure will detail:"
    ),
    ul([
      "A specific description of the conflicts of interest;",
      "An explanation of the risks to the Client that arise;",
      "That the organisational and administrative arrangements established by the Firm to prevent or manage that conflict are not sufficient to ensure, with reasonable confidence, that the risks of damage to the interests of the Client will be prevented; and",
      "Sufficient detail to enable that Client to take an informed decision with respect to the service in the context of which the conflict of interest arises.",
    ]),
    p(
      "This disclosure will only be made as a matter of last resort. Further, the fact of the disclosure is not considered to be a mitigant. All the controls detailed in this policy will continue to be applied, in respect of that conflict."
    ),
    p(
      "The disclosure will be made via the periodic reports. For example if an individual or connected party of the firm was a Director in a company that is in the client portfolio, then this will need to be disclosed. An outline disclosure is available in Annex B."
    ),
    sh("Conflict Monitoring"),
    p(
      "The Firm has implemented a number of procedures and controls to detect conflict situations as they arise and the Management Body shall ensure that the Conflicts Inventory is updated accordingly. Once conflicts have been identified, further procedures and controls monitor the effectiveness of the management arrangements of such conflicts."
    ),
    p(
      "In addition, the Firm’s Compliance Monitoring Programme incorporates a certain number of specific tests which are aimed at reviewing the Firm’s performance in the management of conflicts that it has identified."
    ),
    sh("Conflicts Reporting and Management Information"),
    p(
      "The Management Body shall review on a periodic basis the Conflicts Inventory, register of Appointments and the results of any Conflicts monitoring where exceptions have been raised. Where deficiencies are reported, the Management Body will ensure that appropriate steps are taken to address the identified deficiencies. The Compliance Function and relevant business head will be empowered to oversee the resolution and remediation of the conflict."
    ),
    p("The Conflicts of Interest Policy shall also be reviewed and ratified on at least an annual basis."),
    sh("Personnel external interests"),
    p(
      "Each person to whom this policy applies must declare all external interests, including members of the Management Body. The Firm will require confirmation of external interests prior to any proposed new appointment or at least annually. Such interests include, inter alia:"
    ),
    ul([
      "Directorships (paid or unpaid)",
      "Partnership interests",
      "Proprietary interests",
      "Consultancy arrangements",
      "Charitable trusteeships",
    ]),
    p(
      "It is the Firm’s policy to review the number and nature of directorships held by all members of staff. This is to ensure that any such outside interests do not conflict with the activities of the Firm and the interests of its clients (with regards to the services provided by the Firm)."
    ),
    p(
      "External interest declarations will be recorded by the Compliance Officer on the appointments and outside business interests form for each employee (Appendix C) and register (Appendix D)."
    ),
    p(
      "Personnel must ensure that they notify, and where applicable, obtain permission from the Compliance Officer prior to entering into an arrangement or agreement that could potentially conflict with the Firm’s duties to its clients (Appendix E)."
    ),
    sh("Education and Awareness"),
    p(
      "All Personnel must comply with the operating controls and procedures established in their business unit and by the Firm overall. If Personnel are unsure whether a conflict exists, or require guidance on the mitigating controls, they shall consult with the Compliance Officer in the first instance. The ‘Conflicts Disclosure Form (Internal)’ shall be used to detail the potential conflict, as set out in Annex E."
    ),
    p(
      "All Personnel receive a copy of the Firm’s Compliance Manual which contains the Firm’s conflicts arrangements. In addition, all Personnel are required to give an undertaking of adherence to the Firm’s Compliance Procedures, including Personal Account Dealing and receipt of Gifts and Inducements."
    ),
    p("The Conflicts of Interest Policy shall also be reviewed and ratified on at least an annual basis."),

    // ================================================================ Annex A
    annex("Annex A", "Trading and Investment Conflicts"),
    p(
      "The Firm’s trading and investment arrangements could result in a client’s interests conflicting with those of other clients or with those of the Firm."
    ),
    {
      k: "table",
      kind: "conflicts",
      head: CONFLICT_HEAD,
      rows: [
        [
          "Allocation of transactions",
          "Investment opportunities between Clients or between the Firm, Personnel and Clients may be allocated more preferably to one party, disadvantaging one or more Clients.",
          `Discretionary Mandates: All orders are transmitted to the custodian banks for execution. It is the banks obligation to execute the trades in the market. ${n} will request periodically for the custodian banks to provide their up to date order execution policy. ${n} will take samples of transactions to ensure that they are meeting their order execution obligations.`,
        ],
        [
          "Favouring counterparties",
          "In the execution of transactions, the Firm may favour certain counterparties over others where such counterparties offer the Firm or its Personnel other products, services, allocations, or other gifts, entertainment or benefits (whether in a professional or personal capacity).",
          `Discretionary Mandates: ${n} have no control over the selection of counterparties of custodian banks.`,
        ],
        [
          "Conflicting positions trading strategies",
          "Having a conflicting position in securities or adopting conflicting trading strategies for different Clients such that dealing for one Client may potentially be detrimental to the other.",
          "Discretionary Mandates: In general the implementation of an investment strategy with the same risk profile will be similar amongst multiple client portfolios.\nNevertheless we do not have the trading volume to adversely affect the price of a particular security in the market.",
        ],
        [
          "Client Order Handling",
          "Orders are not handled fairly and not executed in a timely manner.",
          "All orders are handled in a timely manner",
        ],
        [
          "Management and Performance fees",
          "A failure to properly disclose the amount and basis of the calculation of the fees and commission charged on a particular fund/mandates which could give rise to a conflict of interest between the interests of the Firm, its Clients and those of its Investors.",
          "All fees are clearly disclosed in the client agreement and Letter of Engagement. The fee charges are reviewed on a periodic basis to ensure that they adhere to the relevant disclosures.",
        ],
        [
          "Remuneration structures",
          "The remuneration structures / practices incentivise short term performance targets, contrary to the investment horizons of the client portfolio or otherwise to the detriment of the client",
          "The firm remuneration policy does not provide for short term gains. The remuneration structure is based on the overall profitability of the firm and the overall performance of the employee over the year.",
        ],
      ],
    },

    sh("Pricing and Valuation Conflicts"),
    p(
      "As the Firm is remunerated by reference to the total funds under management as well as to the performance of its Fund(s)/ discretionary mandates (which in turn is determined by the value of the assets), the Firm’s pricing and valuation arrangements could result in conflicts of interest which may impact the fair valuation of financial instruments."
    ),
    {
      k: "table",
      kind: "conflicts",
      head: CONFLICT_HEAD,
      rows: [
        [
          "Fair valuation of financial instruments",
          "Seeking to overstate or otherwise have influence over the fair valuation of securities and other financial instruments and in particular those which may not have a quoted market price or which may otherwise be difficult to value accurately.",
          "In general the majority of our positions are listed securities. Therefore the prices are easily available. The NAV of most of our fund positions are generally available on Bloomberg.The client will receive independent valuations from the Custodian.",
        ],
        [
          "Pricing, valuation and trading errors",
          "Not taking sufficient action to rectify pricing and other valuation errors or anomalies where to do so would have a negative impact on the price and value of those securities.",
          "There is a trading error log. Valuations are provided independently by the Custodian. Clients would be compensated if an error were to occur.",
        ],
        [
          "Valuation Policy",
          "Not implementing a Valuation Policy or deviating from the policy which may impact the fair valuation of the financial instruments.",
          "Independent valuations are provided by the Custodian. Valuations can also be provided for discretionary mandates using our portfolio management system, which receives data directly from Bloomberg.",
        ],
      ],
    },

    sh("Information Distribution and Disclosure Conflicts"),
    p(
      "The Firm’s information distribution and disclosure arrangements could result in a client’s interests conflicting with those of other clients or with those of the Firm if the Firm discloses different levels of information to its Client(s) or Investors."
    ),
    {
      k: "table",
      kind: "conflicts",
      head: CONFLICT_HEAD,
      rows: [
        [
          "Fair valuation of financial instruments",
          "Certain Investors may request preferential treatment or provision of information compared to other Investors in the same Fund(s) which may give rise to a conflict of interest between the interests of Investors to whom preferential rights have been granted and the interests of Investors to whom preferential rights have not been granted.",
          "Discretionary mandates: The size of the relationship will determine the overall level of fees charged. The fees are disclosed to the client prior to signing the agreement.",
        ],
        [
          "Pricing, valuation and trading errors",
          "Inappropriate handling of sensitive or confidential information (whether inside information or not) or using such information to trade inappropriately to the detriment of other Clients.",
          "The firm has a data protection policy which it adheres to and is reviewed at least on an annual basis.",
        ],
        [
          "Valuation Policy",
          "Where the Firm implements Chinese walls or physical barriers to information distribution, there may be inadequate monitoring of such barriers or governance of those individuals above the Chinese wall/on either side of the barrier to prevent distribution of information.",
          "There will be a monitoring regime where Chinese walls/Physical walls are implemented.",
        ],
      ],
    },

    sh("Personnel Conflicts"),
    p(
      "Although the Firm aims to employ experienced and professional Personnel, the actions of a member of the Firm’s Personnel could result in a conflict by influencing or creating an influence over the activities of the Firm."
    ),
    {
      k: "table",
      kind: "conflicts",
      head: CONFLICT_HEAD,
      rows: [
        [
          "Personal account trading",
          "Personnel may trade on personal account in an inappropriate manner, including to the detriment of Clients.",
          "The PA dealing policy for qualifying investments require disclosure and pre-approval. All PA deals are reviewed and approved by senior management. Monthly statements are obtained from all employees for PA dealing.",
        ],
        [
          "Inducements and entertainment",
          "Personnel may be influenced in making investment or trading decisions or outsourcing selections when entertainment or other forms of inducement are provided.",
          "This requires both compliance and management approval for both gifts received and sent and entertainment provided by either.",
        ],
        [
          "Remuneration of employees",
          "Remuneration structures may be created that incentivise a member of Personnel to conduct their role within the Firm in a manner that conflicts with the Firm’s regulatory obligations and/or its Clients.",
          "There is a salary and a discretionary bonus pool determined by the profitability of the firm, annual performance of employee and the discretion of management.",
        ],
        [
          "Influence over other employees",
          "Responsibilities are not apportioned effectively or Personnel are inadequately supervised to avoid collusion or undue influence over others.",
          "There are strict policies and procedures within the firm. Additional training is given as and when required.",
        ],
        [
          "Influence of outside business interests or activities",
          "Personnel who have outside commitments (e.g. directorships, business interests) may be influenced to act in a manner that conflicts with the interests of the Firm or its Clients.",
          "Our policy requires disclosure and approval of all OBIs",
        ],
      ],
    },

    sh("Relationship Conflicts"),
    p(
      "The Firm’s distribution, investor and execution relationships could result in a client’s/ investor’s/fund’s interests conflicting with those of other client’s/investor’s/fund’s or with those of the Firm. External relationships (e.g. with third parties for the distribution of the Funds and other investment products and/or for execution services) should be identified/ managed and if necessary, separated."
    ),
    {
      k: "table",
      kind: "conflicts",
      head: CONFLICT_HEAD,
      rows: [
        [
          "Personal account trading",
          "Personnel may trade on personal account in an inappropriate manner, including to the detriment of Clients.",
          "The PA dealing policy for qualifying investments require disclosure and pre-approval. All PA deals are reviewed and approved by senior management. Monthly statements are obtained from all employees for PA dealing.",
        ],
        [
          "Inducements and entertainment",
          "Personnel may be influenced in making investment or trading decisions or outsourcing selections when entertainment or other forms of inducement are provided.",
          "This requires both compliance and management approval for both gifts received and sent and entertainment provided by either.",
        ],
      ],
    },

    // ================================================================ Annex B
    annex("Annex B", "Conflicts of Interest Policy Disclosure Statement (Client)"),
    sh(`${n} Conflicts of Interest Disclosure`),
    sh("Identifying and managing conflicts of Interest summary"),
    p(
      `In accordance with its obligations to you, ${n} seeks to ensure that its clients are properly notified where there is or could be conflicts of interest.`
    ),
    sh("How are conflicts managed?"),
    p(
      `${n} has prepared a Conflicts of Interest Policy, which identifies the types of conflicts it faces and the controls it operates in order to mitigate those conflicts. The policy is reviewed regularly to ensure the record of conflicts is up to date and relevant and the appropriate mitigating controls are in place. The review is reported to the Management Body of the Firm.`
    ),
    p(
      `${n} has implemented procedures and controls and segregations of duties appropriate for its business profile. Staff are segregated operationally, such that they report to functional managers and each have distinct password protected IT access.`
    ),
    p(
      `${n} also has specific policies and procedures on when and how employees are permitted to undertake personal account transactions, restrictions on the offering and receipt of gifts to or from clients and other businesses counterparties. We also monitor staff external interests and appointments to ensure they do not conflict with their duties to the Firm and its clients.`
    ),
    p(
      `Finally, we also monitor the way in which staff are remunerated in order to ensure that remuneration structures do not conflict between staff and ${n}’s clients’ best interests.`
    ),
    sh("What conflicts of interest has arisen?"),
    p(
      "The nature of the financial services market is such that conflicts of interest can sometimes develop. It is the case that, organisational controls at the Firm (summarised above) are not in this specific matter sufficient to ensure, with reasonable confidence, that the related risks are mitigated."
    ),
    p(
      `Generally, a conflict of interest arises where the interests of the financial services company and its associates are different from its client or clients. For example, where ${n} discharges its duty to one client it might create a conflict with another client. In the case where there is a limited new issue, the firm may favour one client over another (maybe due to size or longevity of the relationship`
    ),
    sh("Next steps"),
    p(
      `The Firm will continue to monitor and review the matter closely, applying its systems and controls to ensure this conflict of interest and any attendant risks are mitigated to the fullest possible extent. If you should require any further information please contact ${n} on 0203 167 6003 or ${b.conflictsEmail}.`
    ),
  ];
}
