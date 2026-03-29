import type { Metadata } from "next";
import Link from "next/link";
import MortgageCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";
import { SUBURBS_BY_CITY, CITY_ORDER } from "./suburbs";

export const metadata: Metadata = {
  title: "Mortgage Calculator Australia 2026 | Home Loan Repayment Calculator",
  description:
    "Free Australian mortgage calculator. Calculate home loan repayments for principal & interest or interest-only loans. Compare Big 4 bank rates, view amortization schedules, and see total interest paid. Updated March 2026.",
  keywords: [
    "mortgage calculator australia",
    "home loan repayment calculator",
    "mortgage repayment calculator",
    "australian mortgage calculator",
    "home loan calculator australia",
    "mortgage calculator au",
    "interest only mortgage calculator",
    "mortgage repayment calculator australia 2026",
    "how much are repayments on a mortgage",
    "principal and interest calculator",
    "home loan comparison calculator",
    "big 4 bank mortgage rates",
  ],
  openGraph: {
    title: "Mortgage Calculator Australia 2026 | Home Loan Repayment Calculator",
    description:
      "Calculate your home loan repayments, compare Big 4 bank rates, and see total interest for P&I or interest-only loans. Free mortgage calculator for Australians.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much are repayments on a $500,000 mortgage in Australia?",
    answer:
      "At 6.2% interest over 30 years with monthly principal and interest repayments, a $500,000 mortgage costs approximately $3,065 per month. Over 30 years you'll pay around $603,000 in total interest, making the total cost roughly $1,103,000. If you choose interest-only repayments at the same rate, you'd pay $2,583 per month but the full $500,000 remains owing at the end of the term.",
  },
  {
    question: "What is the difference between principal & interest and interest-only repayments?",
    answer:
      "With principal and interest (P&I) repayments, each payment covers both the interest charged and a portion of the loan principal, gradually paying off the loan over the term. With interest-only repayments, you only pay the interest charged — the loan balance doesn't decrease. Interest-only periods are typically 1-5 years and result in lower repayments during that period, but you'll pay more interest overall and need to repay the full principal later. Interest-only loans are common for investment properties where tax deductions on interest are a consideration.",
  },
  {
    question: "What is the difference between weekly, fortnightly, and monthly repayments?",
    answer:
      "Switching to more frequent repayments can save you thousands in interest. With fortnightly repayments, you effectively make 26 half-payments per year (equivalent to 13 monthly payments instead of 12), which reduces your loan term and total interest. Weekly repayments work similarly with 52 payments per year. For a $500,000 loan at 6.2% over 30 years, fortnightly repayments can save you over $35,000 in interest and pay off your mortgage about 4 years earlier.",
  },
  {
    question: "What are the current Big 4 bank mortgage rates in Australia?",
    answer:
      "As of March 2026, the Big 4 Australian banks (Commonwealth Bank, Westpac, ANZ, NAB) offer variable rates for owner-occupier P&I loans ranging from approximately 6.39% to 6.49%. Fixed rates for 1-year terms range from 5.84% to 5.99%. Always compare the comparison rate (which includes fees) rather than just the headline rate. Use the 'View Big 4 bank rates' button in our calculator to see the latest rates and apply them directly to your calculation.",
  },
  {
    question: "How is mortgage interest calculated in Australia?",
    answer:
      "In Australia, most home loans calculate interest daily on the outstanding balance and charge it monthly. The interest rate is divided by 365 (or the number of periods per year for the repayment formula) and applied to your remaining balance. Each repayment covers the accrued interest first, with the remainder reducing your principal. Early in the loan, most of your repayment goes to interest; over time, more goes to principal.",
  },
  {
    question: "Should I choose a fixed or variable rate mortgage?",
    answer:
      "Fixed rates provide certainty — your repayments stay the same for the fixed period (usually 1-5 years), which helps with budgeting. Variable rates can go up or down with market conditions, and typically offer more flexibility (extra repayments, redraw, offset accounts). Many Australians choose a split loan — part fixed, part variable — to get the benefits of both. Consider your risk tolerance and financial goals when deciding.",
  },
  {
    question: "What is a comparison rate and why does it matter?",
    answer:
      "A comparison rate is a single percentage that includes both the interest rate and most fees and charges associated with a loan, calculated on a standardised $150,000 loan over 25 years. It's designed to help you compare the true cost of different home loans. A loan with a low interest rate but high fees may have a higher comparison rate than a loan with a slightly higher interest rate but lower fees. Always check the comparison rate when shopping for a mortgage.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mortgage Calculator Australia",
  description:
    "Free Australian mortgage calculator. Calculate home loan repayments for principal & interest or interest-only loans. Compare Big 4 bank rates and view amortization schedules.",
  url: "https://au-calculators.vercel.app/calculators/mortgage-repayment",
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

export default function MortgageRepaymentPage() {
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
            Mortgage Calculator Australia
          </h1>
          <p className="text-gray-600">
            Calculate your home loan repayments for principal &amp; interest or interest-only loans.
            Compare Big 4 bank rates, view amortization schedules, and see total interest paid over the
            life of your loan. Compare two scenarios side by side to find the best deal.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <MortgageCalculator />

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

        {/* Suburb calculators grouped by city */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mortgage Calculator by Suburb
          </h2>
          <p className="text-gray-600 mb-6">
            Get suburb-specific mortgage estimates with pre-filled median property prices for 50 top Australian suburbs across Sydney, Melbourne, Brisbane, Perth, and Adelaide.
          </p>
          {CITY_ORDER.map((city) => (
            <div key={city} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{city}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {(SUBURBS_BY_CITY[city] || []).map((suburb) => (
                  <Link
                    key={suburb.slug}
                    href={`/calculators/mortgage-repayment/${suburb.slug}`}
                    className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">{suburb.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{suburb.state}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

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
