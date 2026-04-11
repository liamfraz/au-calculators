import type { Metadata } from "next";
import HecsRepaymentCalculator from "../hecs-repayment-calculator/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "HECS HELP Repayment Calculator Australia 2026 — Pay Off Faster",
  description:
    "Free HECS HELP repayment calculator Australia 2026. Enter your income and debt balance to see your 2025-26 ATO repayment amount, months to pay off, and total indexation cost.",
  keywords: [
    "hecs repayment calculator australia 2026",
    "hecs help repayment calculator",
    "help debt calculator australia",
    "hecs calculator 2026",
    "hecs repayment rates 2025-26",
    "student loan calculator australia",
    "hecs debt repayment",
    "help loan repayment thresholds",
    "hecs indexation calculator",
    "how long to pay off hecs",
    "hecs repayment threshold 2026",
    "help debt repayment rates",
  ],
  openGraph: {
    title: "HECS HELP Repayment Calculator Australia 2026",
    description:
      "Calculate your HECS-HELP repayments with 2025-26 ATO thresholds. See annual and monthly repayments, years to pay off, and how indexation affects your total cost.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/hecs-help-repayment-calculator",
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
      "For the 2025-26 financial year, you must start making compulsory HECS-HELP repayments once your repayment income reaches $54,435. Below this amount, no compulsory repayment is required, though your debt will still be indexed annually. The minimum repayment rate at the threshold is 1% of your total repayment income. Rates increase progressively up to 10% for incomes over $159,664.",
  },
  {
    question: "How does HECS-HELP indexation work?",
    answer:
      "HELP debts are indexed on 1 June each year based on the Consumer Price Index (CPI). From 2023, the government capped HELP indexation at the lower of CPI or the Wage Price Index (WPI), following public concern about high indexation rates. Indexation maintains the real value of the debt — it is not interest. It is applied to the remaining balance before that year's repayment is deducted. Making a voluntary repayment before 1 June reduces the balance that gets indexed.",
  },
  {
    question: "What indexation rate should I use for 2025-26?",
    answer:
      "The calculator defaults to 4.7%, which reflects recent CPI estimates. The actual rate is set by the ATO each year based on the March-quarter CPI figure and is announced in May. For 2023-24 it was 4.7%; for 2024-25 it was 3.2% (capped at WPI). Check the ATO website each May for the confirmed current-year figure.",
  },
  {
    question: "Should I make voluntary HECS-HELP repayments?",
    answer:
      "Whether voluntary repayments make sense depends on your circumstances. Since HELP debt is indexed to CPI (not a market interest rate), it is typically the cheapest debt you will ever have. If you can earn a higher return investing your money elsewhere, voluntary repayments may not be the best use of your funds. However, if you want to reduce total repayment cost or improve your borrowing capacity for a home loan, voluntary repayments before 1 June each year can reduce your indexation cost.",
  },
  {
    question: "Does HECS-HELP debt affect my home loan borrowing capacity?",
    answer:
      "Yes. Lenders include your HECS-HELP repayment in their assessment of your expenses when calculating borrowing capacity. The compulsory repayment reduces your disposable income, which in turn reduces the maximum amount a bank will lend you. For example, at a $80,000 salary with a 4% HECS repayment rate, your annual HECS repayment of $3,200 could reduce your borrowing capacity by approximately $25,000–$40,000 depending on the lender.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HECS HELP Repayment Calculator Australia 2026",
  description:
    "Free HECS-HELP repayment calculator with 2025-26 ATO thresholds. Calculate monthly repayments, years to pay off, and total cost including indexation.",
  url: "https://au-calculators.vercel.app/hecs-help-repayment-calculator",
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

export default function HecsHelpRepaymentCalculatorPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            HECS HELP Repayment Calculator Australia 2026
          </h1>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-3 text-sm leading-relaxed">
            <p>
              HECS-HELP (Higher Education Contribution Scheme — Higher Education
              Loan Program) is the Australian Government&apos;s income-contingent
              student loan scheme. If you studied at a university, TAFE, or
              registered private college, you likely have a HELP debt on your
              ATO account. As of 2025, over 3 million Australians carry some
              form of HELP debt, with the average balance around $26,000.
            </p>
            <p>
              Unlike a personal loan or credit card, HECS-HELP carries no
              interest. Instead, your debt is{" "}
              <strong>indexed annually on 1 June</strong> to maintain its real
              value over time. From 2023, the government capped HELP indexation
              at the <strong>lower of CPI or the Wage Price Index (WPI)</strong>
              . This means your debt grows more slowly when wages rise faster
              than prices.
            </p>
            <p>
              Repayments are <strong>compulsory</strong> once your repayment
              income reaches the minimum threshold —{" "}
              <strong>$54,435 for 2025-26</strong>. The ATO calculates your
              repayment as a percentage of your <em>total</em> repayment income
              (not just the amount above the threshold), ranging from 1% at the
              minimum threshold up to 10% for incomes above $159,664. Your
              employer withholds the repayment through the PAYG system.
            </p>
            <p>
              Enter your gross annual income, current HECS-HELP balance, and
              expected indexation and salary growth rates. The calculator
              projects your repayment schedule year by year, showing exactly
              when your debt reaches zero and how much indexation adds to your
              total cost.
            </p>
          </div>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <HecsRepaymentCalculator />

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
