import type { Metadata } from "next";
import PropertyCashFlowCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Investment Property Cash Flow Calculator Australia 2026",
  description:
    "Free Australian investment property cash flow calculator. Compare rental income against all expenses including mortgage, rates, insurance, and management fees. See your monthly and annual cash position.",
  keywords: [
    "investment property calculator australia",
    "property cash flow calculator",
    "rental property cash flow",
    "investment property expenses",
    "property investment calculator",
    "rental income vs expenses",
    "investment property returns australia",
    "property cash flow analysis",
  ],
  openGraph: {
    title: "Investment Property Cash Flow Calculator Australia 2026",
    description:
      "Calculate investment property cash flow — rental income vs all expenses. See monthly surplus or shortfall.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What expenses should I include in property cash flow?",
    answer:
      "A comprehensive cash flow analysis should include all regular property expenses: mortgage repayments (principal and interest or interest only), council rates, water rates, building and landlord insurance, strata or body corporate fees, property management fees (typically 5-10% of rent), maintenance and repairs, land tax (if applicable), and any other recurring costs such as pest control or gardening. Don't forget to account for vacancy periods — most investors budget for 2-4 weeks vacancy per year.",
  },
  {
    question: "What is positive cash flow property?",
    answer:
      "A positive cash flow property is one where the total rental income exceeds all expenses associated with owning and maintaining the property. This means the property effectively pays for itself and puts money in your pocket each week. Positive cash flow properties are more commonly found in regional areas or lower-priced markets where rental yields are higher relative to purchase prices. In capital cities, most properties are negatively geared, meaning expenses exceed income.",
  },
  {
    question: "What is a good cash flow for investment property?",
    answer:
      "Ideally, a positive cash flow is best — even a small weekly surplus means the property is self-sustaining. However, many Australian investors accept a small negative cash flow (sometimes called negative gearing) if the property is expected to deliver strong capital growth over time. A common rule of thumb is that a negative cash flow of up to $50-100 per week may be acceptable for a growth property, but this depends on your personal financial situation and investment strategy.",
  },
  {
    question: "How do I improve my property's cash flow?",
    answer:
      "There are several strategies to improve cash flow: increase rental income by renovating or adding features tenants value (air conditioning, dishwasher, fresh paint), review and reduce expenses by shopping around for better insurance rates, refinance your mortgage to a lower interest rate or switch to interest-only repayments temporarily, ensure you are claiming all available tax deductions, consider self-managing to save on property management fees, and review your rent regularly to keep it in line with market rates.",
  },
  {
    question: "Should I include depreciation in cash flow?",
    answer:
      "No — depreciation is a non-cash deduction and should not be included in a cash flow analysis. Depreciation reduces your taxable income (which improves your after-tax position), but it does not represent an actual cash outflow. This calculator shows your pre-tax cash flow, which reflects the real money coming in and going out. For a complete after-tax picture including depreciation benefits, you would need to factor in your marginal tax rate and a depreciation schedule from a qualified quantity surveyor.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Investment Property Cash Flow Calculator 2026",
  description:
    "Free investment property cash flow calculator for Australians. Compare rental income against all expenses including mortgage, rates, insurance, and management fees.",
  url: "https://au-calculators.vercel.app/calculators/property-cashflow",
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

export default function PropertyCashFlowPage() {
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
            Investment Property Cash Flow Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your investment property cash flow by comparing rental income against all
            expenses. See your weekly, monthly, and annual cash position to understand whether your
            property is positively or negatively geared.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <PropertyCashFlowCalculator />

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
