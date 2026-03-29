import type { Metadata } from "next";
import DepreciationCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Property Depreciation Calculator Australia 2026 | Tax Deduction Estimator",
  description:
    "Free Australian property depreciation estimator. Estimate building allowance (Division 43) and plant & equipment (Division 40) depreciation for investment properties. Maximise your tax deductions.",
  keywords: [
    "property depreciation calculator australia",
    "depreciation schedule calculator",
    "division 43 building allowance",
    "division 40 plant equipment",
    "investment property depreciation",
    "property tax deductions australia",
    "depreciation schedule cost",
    "building depreciation rate australia",
  ],
  openGraph: {
    title: "Property Depreciation Calculator Australia 2026 — Tax Deduction Estimator",
    description:
      "Estimate building and fixtures depreciation for Australian investment properties. See Division 43 and Division 40 deductions.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is property depreciation?",
    answer:
      "Property depreciation is a tax deduction for the wear and tear on the building structure and fixtures/fittings in an investment property. It allows property investors to claim a non-cash deduction that reduces their taxable income, even though they haven't spent any additional money. There are two main categories: Division 43 (building allowance) for the structure itself, and Division 40 (plant and equipment) for removable items like carpets, blinds, and appliances.",
  },
  {
    question: "What is the difference between Division 43 and Division 40?",
    answer:
      "Division 43 covers the building structure and fixed improvements (walls, roof, doors, foundations) at a flat rate of 2.5% per year over 40 years. Division 40 covers plant and equipment — removable items like carpets, blinds, hot water systems, ovens, cooktops, and air conditioning units — which depreciate at varying rates depending on their effective life. For example, carpet depreciates over 10 years while a hot water system depreciates over 8 years.",
  },
  {
    question: "Can I claim depreciation on an older property?",
    answer:
      "Division 43 building allowance can only be claimed for buildings constructed after 15 September 1987. If your property was built before this date, you cannot claim the building structure depreciation. However, Division 40 plant and equipment items can still be claimed regardless of building age, but only for items you purchased or were in place at the time of your purchase. Since May 2017, second-hand plant and equipment in residential properties can only be claimed by the first owner.",
  },
  {
    question: "Do I need a depreciation schedule?",
    answer:
      "Yes — to claim depreciation deductions, you must have a depreciation schedule prepared by a qualified quantity surveyor who is a member of the Australian Institute of Quantity Surveyors (AIQS). The cost of a depreciation schedule is typically $300–$800 and is itself tax deductible. The schedule will detail every claimable item in your property and calculate the deductions over the asset's effective life.",
  },
  {
    question: "How much can I save with depreciation?",
    answer:
      "Typical depreciation deductions for a new property range from $8,000 to $15,000 in the first year, while older properties may yield $3,000 to $8,000. The actual tax saving depends on your marginal tax rate — for example, a $10,000 depreciation deduction saves $3,700 in tax if you're on the 37% marginal rate. Over 5 years, cumulative deductions for a new property can easily exceed $40,000.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Property Depreciation Calculator 2026",
  description:
    "Free property depreciation estimator for Australian investment properties. Estimate Division 43 building allowance and Division 40 plant and equipment deductions.",
  url: "https://au-calculators.vercel.app/calculators/depreciation",
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

export default function DepreciationPage() {
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
            Property Depreciation Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Estimate building allowance (Division 43) and plant &amp; equipment (Division 40)
            depreciation for your Australian investment property. See annual deductions and a
            10-year depreciation schedule.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <DepreciationCalculator />

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
