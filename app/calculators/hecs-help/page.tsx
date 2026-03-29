import type { Metadata } from "next";
import HecsHelpCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "HECS Repayment Calculator 2026 | Free HELP Debt Calculator Australia",
  description:
    "Free HECS repayment calculator Australia. Calculate your HELP debt repayments based on 2025-26 ATO thresholds. See annual repayment, fortnightly deduction, years to repay, and indexation impact on your student loan.",
  keywords: [
    "hecs repayment calculator",
    "help debt calculator australia",
    "hecs calculator",
    "hecs repayment rates",
    "hecs help repayment calculator",
    "student loan calculator australia",
    "hecs debt repayment",
    "help loan repayment thresholds",
    "hecs indexation calculator",
    "how long to pay off hecs",
  ],
  openGraph: {
    title: "HECS Repayment Calculator 2026 | HELP Debt Calculator Australia",
    description:
      "Calculate your HECS-HELP repayments with 2025-26 ATO thresholds. See your annual repayment, fortnightly deduction, years to repay, and how indexation affects your student loan balance.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How is my HECS-HELP repayment calculated?",
    answer:
      "Your HECS-HELP compulsory repayment is based on your repayment income, which includes your taxable income, any net investment losses, reportable fringe benefits, and reportable super contributions. The ATO applies a percentage rate to your total repayment income (not just the amount above the threshold). For 2025-26, rates range from 1% to 10% depending on your income bracket. The repayment is collected through the PAYG withholding system — your employer deducts it from your pay.",
  },
  {
    question: "What is the HECS-HELP repayment threshold for 2025-26?",
    answer:
      "For the 2025-26 financial year, you must start making compulsory HECS-HELP repayments once your repayment income reaches $54,435. Below this amount, no compulsory repayment is required, though your debt will still be indexed annually. The minimum repayment rate at the threshold is 1% of your total repayment income ($544). Rates increase progressively up to 10% for incomes over $151,201.",
  },
  {
    question: "How does HECS-HELP indexation work?",
    answer:
      "HELP debts are indexed on 1 June each year based on the Consumer Price Index (CPI). From 2023, the government capped HELP indexation at the lower of CPI or the Wage Price Index (WPI), following public concern about high indexation rates. The 2024 indexation rate was 4.7%. Indexation is not interest — it maintains the real value of the debt. It is applied to the remaining balance before that year's repayment is deducted. If you make a voluntary repayment before 1 June, you reduce the balance that gets indexed.",
  },
  {
    question: "Should I make voluntary HECS-HELP repayments?",
    answer:
      "Whether voluntary repayments make sense depends on your circumstances. Since HELP debt is indexed to CPI (not a market interest rate), it is typically the cheapest debt you will ever have. If you can earn a higher return investing your money elsewhere (e.g., in super, shares, or paying off a mortgage which charges real interest), voluntary repayments may not be the best use of your funds. However, if you want to reduce the total amount you repay or improve your borrowing capacity for a home loan, voluntary repayments before 1 June each year can reduce your indexation cost.",
  },
  {
    question:
      "Does HECS-HELP debt affect my home loan borrowing capacity?",
    answer:
      "Yes. Lenders include your HECS-HELP repayment in their assessment of your expenses when calculating borrowing capacity. The compulsory repayment reduces your disposable income, which in turn reduces the maximum amount a bank will lend you. For example, at a $75,000 salary with a 3.5% HECS repayment rate, your annual HECS repayment of $2,625 could reduce your borrowing capacity by approximately $20,000-$35,000 depending on the lender. Paying down your HELP debt can improve your borrowing position.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HECS-HELP Repayment Calculator Australia",
  description:
    "Free HECS-HELP repayment calculator. Calculate your student loan repayments based on 2025-26 ATO thresholds, see fortnightly deductions, years to repay, and indexation impact.",
  url: "https://au-calculators.vercel.app/calculators/hecs-help",
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

export default function HecsHelpPage() {
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HECS-HELP Repayment Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your HECS-HELP student loan repayments using the 2025-26
            ATO repayment thresholds. See your annual repayment, fortnightly
            payslip deduction, how many years until your debt is cleared, and the
            true cost of indexation over time.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <HecsHelpCalculator />

            {/* Ad: Below results */}
            <AdUnit
              slot="below-results"
              format="horizontal"
              className="mt-8"
            />
          </div>

          {/* Sidebar ad: Desktop only */}
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
