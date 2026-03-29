import type { Metadata } from "next";
import MortgageCalculator from "../calculators/mortgage-repayment/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Mortgage Repayment Calculator Australia 2026 | Home Loan Calculator AU",
  description:
    "Free Australian mortgage repayment calculator. Calculate weekly, fortnightly, or monthly home loan repayments, total interest, and view a full amortization schedule. Compare Big 4 bank rates with 2025-26 figures.",
  keywords: [
    "mortgage repayment calculator australia",
    "home loan calculator au",
    "mortgage repayment calculator",
    "home loan repayment calculator australia",
    "how much are my mortgage repayments",
    "mortgage calculator australia 2026",
    "weekly mortgage repayments calculator",
    "fortnightly mortgage repayments",
    "amortization schedule australia",
    "home loan interest calculator",
    "australian mortgage repayment calculator",
    "mortgage repayment calculator au",
  ],
  openGraph: {
    title:
      "Mortgage Repayment Calculator Australia 2026 | Home Loan Calculator AU",
    description:
      "Calculate your Australian home loan repayments — weekly, fortnightly, or monthly. See total interest, amortization schedule, and compare Big 4 bank rates.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/mortgage-repayment-calculator",
  },
};

const faqs = [
  {
    question:
      "How much are mortgage repayments on a $600,000 home loan in Australia?",
    answer:
      "At 6.2% interest over 30 years with monthly principal and interest repayments, a $600,000 home loan costs approximately $3,678 per month, $1,699 fortnightly, or $849 weekly. Over the full 30-year term you will pay around $724,000 in total interest, making the total cost roughly $1,324,000. Choosing fortnightly repayments instead of monthly can save you over $40,000 in interest and pay off your loan about 4 years earlier.",
  },
  {
    question:
      "What is the difference between weekly, fortnightly, and monthly mortgage repayments?",
    answer:
      "Monthly repayments are the most common — you make 12 payments per year. Fortnightly repayments mean 26 half-payments per year, which is equivalent to 13 monthly payments instead of 12. This extra payment each year reduces your principal faster and saves significant interest over the loan term. Weekly repayments work similarly with 52 payments per year. For most borrowers, fortnightly repayments offer the best balance of savings and convenience.",
  },
  {
    question: "How is mortgage interest calculated in Australia?",
    answer:
      "Australian home loans typically calculate interest daily on the outstanding balance and charge it monthly. The annual interest rate is divided by 365 to get a daily rate, which is applied to your remaining balance each day. Each repayment covers the accrued interest first, with the remainder reducing your principal. Early in the loan, most of your repayment goes toward interest; over time, more goes toward principal reduction.",
  },
  {
    question: "What are the current home loan rates in Australia in 2026?",
    answer:
      "As of March 2026, the Big 4 Australian banks offer variable rates for owner-occupier principal and interest loans between approximately 6.39% and 6.49%. One-year fixed rates range from 5.84% to 5.99%. Online lenders and smaller banks may offer rates 0.5% to 1.0% lower. Always compare the comparison rate — which includes fees — rather than just the headline rate.",
  },
  {
    question:
      "How much deposit do I need for a home loan in Australia?",
    answer:
      "Most Australian lenders require a minimum 5% deposit, though 20% is recommended to avoid Lenders Mortgage Insurance (LMI). LMI can add $5,000 to $30,000+ to your upfront costs depending on the loan amount and deposit size. First home buyers may access government schemes like the Home Guarantee Scheme which allows purchases with as little as 5% deposit without paying LMI.",
  },
  {
    question: "What is an amortization schedule?",
    answer:
      "An amortization schedule is a table showing each repayment over the life of your loan, broken down into principal and interest components. It shows how your balance decreases over time. In the early years, most of each repayment goes toward interest. As the principal decreases, a larger portion of each repayment goes toward paying down the loan. Our calculator provides a yearly summary showing total payments, principal paid, interest paid, and remaining balance for each year.",
  },
  {
    question:
      "Should I make extra repayments on my mortgage?",
    answer:
      "Extra repayments can dramatically reduce your total interest and loan term. Even an extra $100 per month on a $500,000 loan at 6.2% can save over $50,000 in interest and cut about 3 years off your loan term. Most variable rate loans allow unlimited extra repayments, while fixed rate loans may cap additional payments at $10,000 to $20,000 per year. Check with your lender about extra repayment limits and any associated fees.",
  },
  {
    question:
      "What is the difference between a fixed and variable rate mortgage in Australia?",
    answer:
      "A variable rate moves up or down with market conditions and the RBA cash rate, giving you flexibility for extra repayments, redraw, and offset accounts. A fixed rate locks in your repayment amount for 1-5 years, providing certainty but less flexibility. Many Australian borrowers choose a split loan — part fixed, part variable — to balance rate certainty with repayment flexibility. Fixed rates may charge break costs if you refinance or sell during the fixed period.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mortgage Repayment Calculator Australia 2026",
  description:
    "Free Australian mortgage repayment calculator. Calculate weekly, fortnightly, or monthly home loan repayments, total interest, and view a full amortization schedule.",
  url: "https://au-calculators.vercel.app/mortgage-repayment-calculator",
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

export default function MortgageRepaymentCalculatorPage() {
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
            Mortgage Repayment Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your Australian home loan repayments — weekly, fortnightly,
            or monthly. Enter your loan amount, interest rate, and term to see
            your repayment amount, total interest paid, and a full amortization
            schedule. Compare Big 4 bank rates and two scenarios side by side.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <MortgageCalculator />

            {/* CTA: Compare rates / broker */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Compare AU Mortgage Rates
              </h2>
              <p className="text-sm text-blue-800 mb-4">
                The best home loan rate depends on your deposit size, loan
                amount, and whether you want fixed or variable. Australian
                mortgage brokers compare hundreds of lenders at no cost to you
                — they are paid by the lender, not the borrower.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-sm"
                >
                  Compare Home Loan Rates
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  Talk to a Mortgage Broker
                </a>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                Links coming soon. We are partnering with Australian comparison
                services and licensed mortgage brokers.
              </p>
            </div>

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

        {/* Key info section for SEO */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Mortgage Repayments in Australia
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Repayment Frequency Matters
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Switching from monthly to fortnightly repayments is one of the
                simplest ways to save on your home loan. By making 26
                fortnightly payments instead of 12 monthly ones, you effectively
                make one extra monthly payment per year. On a $500,000 loan at
                6.2% over 30 years, this can save over $35,000 in interest and
                cut your loan term by about 4 years.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Principal vs Interest
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                In the early years of your mortgage, the majority of each
                repayment goes toward interest rather than reducing your loan
                balance. For a $500,000 loan at 6.2%, your first year of
                repayments totals about $36,780 but only $5,980 goes toward
                principal — the remaining $30,800 is pure interest. This ratio
                gradually shifts as your balance decreases.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                AU Big 4 Bank Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Commonwealth Bank, Westpac, ANZ, and NAB set the benchmark for
                Australian mortgage rates. As of March 2026, their standard
                variable rates range from 6.39% to 6.49% for owner-occupier
                principal and interest loans. Online lenders often undercut the
                Big 4 by 0.5% to 1.0%, but may offer fewer features like branch
                access and offset accounts.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Offset Accounts & Redraw
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                An offset account is a transaction account linked to your home
                loan. The balance in the offset reduces the loan amount that
                interest is calculated on. For example, if you owe $500,000 and
                have $50,000 in your offset, you only pay interest on $450,000.
                Redraw facilities let you access extra repayments you have made.
                Both are powerful tools for reducing interest on Australian home
                loans.
              </p>
            </div>
          </div>
        </section>

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
