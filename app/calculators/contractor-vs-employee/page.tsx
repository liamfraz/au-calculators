import type { Metadata } from "next";
import ContractorVsEmployeeCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "AU Contractor vs Employee Tax Calculator 2026 — True Cost Comparison",
  description:
    "Compare take-home pay as a contractor vs employee in Australia with our 2026 tax calculator. See PAYG vs estimated tax bill, super guarantee, leave entitlements, and which arrangement puts more money in your pocket. A contractor vs employee tax calculator Australia 2026 designed to help you make informed decisions.",
  keywords: [
    "contractor vs employee calculator",
    "contractor vs employee tax australia",
    "contractor vs employee tax calculator australia",
    "contractor vs employee 2026",
    "contractor take home pay",
    "employee vs contractor australia",
    "PAYG contractor tax",
    "ABN tax calculator australia",
    "contractor tax deductions australia",
    "contractor rate calculator",
    "contractor vs employee super",
    "contractor leave entitlements",
  ],
  openGraph: {
    title:
      "Contractor vs Employee Tax Calculator Australia 2026 | Compare Take-Home Pay",
    description:
      "Compare contractor vs employee take-home pay, super, and leave entitlements side-by-side.",
    type: "website",
  },
};

const faqs = [
  {
    question:
      "How does tax differ between contractor and employee in Australia?",
    answer:
      "Employees have income tax withheld by their employer (PAYG withholding) and receive the benefit of the tax-free threshold ($18,200). Contractors must pay their own tax bill through regular installments to the ATO (PAYG instalments) based on estimated income, or as a lump sum at tax time. Contractors cannot use the tax-free threshold and are taxed on their full business income. This means a contractor needs to earn significantly more gross income than an employee to take home the same amount after tax.",
  },
  {
    question: "What is the contractor tax rate in Australia?",
    answer:
      "There is no single 'contractor tax rate'. Instead, contractors are taxed as self-employed individuals at progressive tax rates that apply to their net business income (revenue minus deductions). The rates are the same as employees: 16% on $18,201–$45,000, 30% on $45,001–$135,000, 37% on $135,001–$190,000, and 45% on $190,001+. However, contractors must estimate and pay their own tax (PAYG instalments), and they pay an additional 2% Medicare levy on gross income (not just net tax). They also cannot claim the Low Income Tax Offset (LITO).",
  },
  {
    question: "Do contractors need to pay super in Australia?",
    answer:
      "No, contractors do not receive superannuation contributions from their clients. Employees receive a compulsory 11.5% superannuation guarantee from their employer (2025-26). Contractors must save and contribute to their own super if they wish to build a retirement fund. To make this comparison fair, a contractor's gross rate should be higher than an employee's salary to account for the missing super contribution.",
  },
  {
    question:
      "What leave entitlements do employees get that contractors don't?",
    answer:
      "Employees are entitled to 4 weeks annual leave (plus 2-3 weeks if on a 5-day week), 10 national public holidays, and varying amounts of personal/sick leave depending on the award or agreement. Contractors receive none of these—they must take unpaid time off and lose income when they don't work. They also do not accrue long service leave unless contractually agreed. To earn equivalent take-home pay, a contractor must factor in the value of leave entitlements they forgo.",
  },
  {
    question: "Is it better to be a contractor or employee in Australia?",
    answer:
      "This depends on your personal situation. Contractors can earn more per hour if they command higher rates and claim generous tax deductions, making it attractive for high earners. However, they forfeit job security, paid leave, superannuation, and must manage tax obligations. Employees enjoy stability, paid leave, super contributions, and employer-provided benefits. Use the calculator above to compare your specific scenario: if a contractor rate matches or exceeds the take-home pay of employment (after accounting for leave, super, and tax), contracting may be worth it—otherwise, employment is usually better value.",
  },
  {
    question: "What business deductions can contractors claim?",
    answer:
      "Contractors can deduct business expenses from their gross income to reduce their taxable income. Common deductions include: office equipment, software, utilities (home office portion), vehicle expenses (work-related), professional fees, insurance, training, subscriptions, and advertising. The key rule is the expense must be directly connected to earning business income and not private. Claiming deductions incorrectly is a red flag for the ATO, so keep receipts and maintain clear records. The calculator above allows you to account for estimated deductions.",
  },
  {
    question:
      "What contractor rate do I need to match an employee salary in Australia?",
    answer:
      "A contractor needs significantly more gross income than an employee's salary to take home the same amount. As a rough rule of thumb, a contractor's hourly or daily rate should be 30–50% higher than an employee to account for: (1) lost superannuation (11.5%), (2) lost paid leave (4–6 weeks), (3) higher tax burden (no LITO, tax paid upfront), and (4) personal business expenses. Use the calculator to input your employee salary and see the contractor rate needed to match your take-home pay.",
  },
  {
    question: "Do contractors pay Medicare levy in Australia?",
    answer:
      "Yes, contractors pay the 2% Medicare levy on their gross income (or adjusted taxable income). They also pay any applicable Medicare Levy Surcharge if they earn over the threshold ($93,000 single, $186,000 family) and do not have private hospital cover. Unlike employees who have the levy withheld, contractors must pay it as part of their tax bill. The levy is a significant ongoing cost for contractors.",
  },
  {
    question: "What is PAYG withholding for employees?",
    answer:
      "PAYG (Pay As You Go) withholding is the income tax automatically deducted from an employee's pay by their employer each pay period. The amount is calculated using the ATO tax tables and depends on your annual salary, tax file number declaration, and any leave loading. At tax time, you lodge a return and reconcile—if too much was withheld, you get a refund; if too little, you owe. PAYG ensures tax is paid gradually throughout the year. Contractors do the opposite: they estimate their tax and pay the ATO in instalments (PAYG instalments) or a lump sum at tax time.",
  },
  {
    question: "What are the risks of being a contractor vs employee?",
    answer:
      "Contractors face higher financial and compliance risks: (1) No job security or income guarantee if a client cancels work, (2) Must manually manage tax obligations and can face penalties if incorrect, (3) Forfeit paid leave, sick leave, and super, (4) May struggle to access credit (mortgage, loans) due to variable income, (5) Liable for ABN and tax compliance including GST if turnover exceeds $75,000, (6) Must pay for own equipment, insurance, and training, (7) Exposed to liability claims (insurance required). Employees face much lower compliance risk and have income protection.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Contractor vs Employee Tax Calculator Australia 2026",
  description:
    "Compare take-home pay as a contractor vs employee in Australia. Calculate PAYG tax, super guarantee, leave entitlements, and see which arrangement puts more money in your pocket.",
  url: "https://au-calculators.vercel.app/calculators/contractor-vs-employee",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  author: {
    "@type": "Organization",
    name: "AU Calculators",
  },
  featureList: [
    "Side-by-side contractor vs employee income comparison",
    "PAYG tax withholding vs contractor tax instalments",
    "Superannuation guarantee calculation (11.5%)",
    "Leave entitlements valuation (annual, sick, public holidays)",
    "Medicare levy and Medicare Levy Surcharge",
    "Business deduction impact on contractor net income",
    "Net take-home pay: annual, monthly, and fortnightly",
    "Contractor rate needed to match employee salary",
    "Day rate to annual salary conversion",
    "Payroll tax by state information",
    "Personal Services Income (PSI) 80/20 Rule guidance",
    "47% withholding for contractors without ABN",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "AU Calculators",
      item: "https://au-calculators.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contractor vs Employee Calculator",
      item: "https://au-calculators.vercel.app/calculators/contractor-vs-employee",
    },
  ],
};

export default function ContractorVsEmployeePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contractor vs Employee Tax Calculator Australia 2025&ndash;2026
          </h1>
          <p className="text-gray-600">
            Compare your take-home pay as a contractor versus an employee side
            by side. Factor in PAYG tax withholding, superannuation guarantee,
            leave entitlements, and business deductions to see which
            arrangement puts more money in your pocket—or what contractor rate
            you need to match an employee salary.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <ContractorVsEmployeeCalculator />

            <AdUnit
              slot="below-results"
              format="horizontal"
              className="mt-8"
            />
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
