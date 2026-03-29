import type { Metadata } from "next";
import RentalYieldFullCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Rental Yield Calculator Australia 2026 | Net Yield, Cash Flow & Cash-on-Cash Return",
  description:
    "Free Australian rental yield calculator. Calculate gross yield, net yield, annual cash flow, monthly cash flow, cash-on-cash return, and break-even rent. Includes mortgage costs, vacancy, and capital city yield comparison.",
  keywords: [
    "rental yield calculator australia",
    "property investment calculator",
    "net rental yield",
    "gross rental yield calculator",
    "cash on cash return calculator",
    "investment property cash flow",
    "rental return calculator australia",
    "property yield calculator",
    "break even rent calculator",
    "rental yield by city australia",
  ],
  openGraph: {
    title:
      "Rental Yield Calculator Australia 2026 — Net Yield, Cash Flow & Returns",
    description:
      "Calculate gross & net rental yield, annual cash flow, cash-on-cash return, and break-even rent for Australian investment properties.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is a good rental yield in Australia?",
    answer:
      "In Australia, a gross rental yield of 4-5% is considered average for metropolitan areas. Yields above 5% are generally good, while yields above 7% are excellent but may come with higher risk or be found in regional areas. Sydney and Melbourne typically have lower yields (2-4%) due to high property prices, while Darwin and Perth often offer higher yields (5-6%+). The best yield depends on your investment strategy — some investors prefer lower yields in high-growth areas for capital gains.",
  },
  {
    question: "What is the difference between gross and net rental yield?",
    answer:
      "Gross rental yield only considers rental income relative to the purchase price — the formula is (Annual Rent / Purchase Price) x 100. Net rental yield deducts all annual property expenses (council rates, insurance, maintenance, management fees, strata, vacancy costs) from rental income before calculating. For example, a property with 5% gross yield might only deliver 3-3.5% net yield after expenses. Net yield gives a more accurate picture of your actual return.",
  },
  {
    question: "What is cash-on-cash return?",
    answer:
      "Cash-on-cash return measures the annual cash flow relative to the total cash you invested — including your deposit and buying costs (stamp duty, legal fees, etc.). The formula is (Annual Cash Flow / Total Cash Invested) x 100. This is different from rental yield because it accounts for mortgage costs and leverage. A property might have a 4% net yield but a -2% cash-on-cash return if the mortgage payments exceed the net rental income.",
  },
  {
    question: "How do you calculate break-even rent?",
    answer:
      "Break-even rent is the minimum weekly rent needed for your annual cash flow to equal zero — meaning your rental income exactly covers all expenses plus mortgage repayments. It is calculated by adding up all fixed expenses (council rates, insurance, strata, maintenance) plus annual mortgage costs, then dividing by the effective number of rent-earning weeks after vacancy and management fees. If your actual rent is above the break-even rent, the property is positively geared.",
  },
  {
    question: "What expenses should I include when calculating net rental yield?",
    answer:
      "Key expenses include: council rates ($1,500-$3,000/year), landlord insurance ($1,000-$2,000/year), maintenance (typically 1% of property value), property management fees (7-10% of rent), strata or body corporate fees ($1,000-$8,000+ for units), and vacancy costs (typically 2-4 weeks per year). You may also want to factor in water rates, land tax, and pest control. These expenses typically reduce gross yield by 1.5-3 percentage points.",
  },
  {
    question:
      "Which Australian capital cities have the highest rental yields in 2026?",
    answer:
      "Among capital cities, Darwin consistently offers the highest gross rental yields, often exceeding 5-6% for houses and 6%+ for units. Perth and Brisbane also offer above-average yields. Sydney and Melbourne typically have the lowest yields (2-4%) but have historically delivered stronger long-term capital growth. Regional areas can offer 7-10%+ gross yields but may carry higher vacancy risk and slower capital growth.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Rental Yield Calculator 2026",
  description:
    "Free rental yield calculator for Australian investment properties. Calculate gross yield, net yield, cash flow, cash-on-cash return, and break-even rent.",
  url: "https://au-calculators.vercel.app/rental-yield-calculator",
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

export default function RentalYieldCalculatorPage() {
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
            Rental Yield Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate gross and net rental yield, annual and monthly cash flow,
            cash-on-cash return, and break-even rent for Australian investment
            properties. Includes mortgage costs, vacancy, and a capital city
            yield comparison.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <RentalYieldFullCalculator />

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
