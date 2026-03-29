import type { Metadata } from "next";
import CompoundInterestCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Compound Interest Calculator Australia 2026 | Savings Calculator",
  description:
    "Free Australian compound interest calculator. Calculate savings growth with regular contributions, compare AU bank rates (CommBank, Westpac, NAB, ANZ), and view year-by-year breakdowns.",
  keywords: [
    "compound interest calculator australia",
    "savings calculator au",
    "compound interest calculator",
    "savings interest calculator australia",
    "bank interest calculator",
    "investment growth calculator",
    "compound savings calculator",
    "australian savings calculator",
  ],
  openGraph: {
    title: "Compound Interest Calculator Australia 2026 — Savings Growth",
    description:
      "Calculate compound interest on savings with Australian bank rate presets. Compare growth with and without monthly contributions.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How does compound interest work?",
    answer:
      "Compound interest is when you earn interest on both your initial deposit and on the interest that has already been added. For example, if you deposit $10,000 at 5% p.a. compounded monthly, after the first month you earn interest on $10,000. The next month, you earn interest on $10,000 plus the previous month's interest. This snowball effect means your money grows faster over time compared to simple interest, where you only earn interest on the original amount.",
  },
  {
    question: "What savings rates do Australian banks offer in 2026?",
    answer:
      "As of early 2026, major Australian banks offer savings rates between 4.75% and 5.50% p.a. on bonus saver accounts. CommBank GoalSaver offers around 4.75%, Westpac Life and NAB iSaver around 5.00%, ANZ Plus Save around 4.90%, and ING Savings Maximiser around 5.50%. These rates typically require meeting conditions like depositing a minimum amount each month and making no withdrawals. Always check the latest rates directly with your bank as they change frequently.",
  },
  {
    question: "How much difference do monthly contributions make?",
    answer:
      "Monthly contributions can dramatically increase your final balance due to compound interest. For example, a $10,000 deposit at 5% p.a. for 10 years grows to about $16,470 on its own. But adding just $500 per month in contributions grows that to over $94,000 — the contributions plus the compound interest earned on them add nearly $78,000. The earlier and more consistently you contribute, the greater the compounding effect.",
  },
  {
    question: "What is the difference between compounding monthly vs annually?",
    answer:
      "Compounding frequency affects how often interest is calculated and added to your balance. Monthly compounding (12 times per year) gives you slightly more than annual compounding (once per year) because each month's interest starts earning interest sooner. For example, $10,000 at 5% compounded monthly yields $16,470 after 10 years, while compounded annually it yields $16,289 — a difference of about $181. Most Australian savings accounts compound interest monthly or daily.",
  },
  {
    question: "Is compound interest taxed in Australia?",
    answer:
      "Yes, interest earned on savings accounts in Australia is considered taxable income. Your bank reports interest earned to the ATO, and you must declare it in your tax return. The interest is taxed at your marginal tax rate. For the 2025-26 financial year, the first $18,200 of total income (including interest) is tax-free. You can provide your TFN to your bank to avoid having tax withheld at the highest rate. Consider using a high-interest savings account within a low-tax structure if you're earning significant interest.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Compound Interest Calculator 2026",
  description:
    "Free compound interest calculator for Australian savings. Compare bank rates, add monthly contributions, and view year-by-year growth breakdowns.",
  url: "https://au-calculators.vercel.app/calculators/compound-interest",
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

export default function CompoundInterestPage() {
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
            Australian Compound Interest Calculator 2026
          </h1>
          <p className="text-gray-600">
            Calculate how your savings grow with compound interest. Enter your
            initial deposit, monthly contributions, and interest rate — or use an
            Australian bank rate preset — to see year-by-year growth.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CompoundInterestCalculator />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
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
              <div key={faq.question} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
