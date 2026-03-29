import type { Metadata } from "next";
import NegativeGearingCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Negative Gearing Calculator Australia 2025 | Tax Benefit Estimator",
  description:
    "Free Australian negative gearing calculator. Estimate the tax benefit of negatively geared investment property. See how rental losses offset your taxable income using 2025-26 ATO tax rates.",
  keywords: [
    "negative gearing calculator",
    "negative gearing calculator australia",
    "negative gearing tax benefit",
    "investment property tax deductions",
    "negative gearing explained",
    "property tax benefit calculator",
    "rental property tax deductions australia",
    "negatively geared property",
  ],
  openGraph: {
    title: "Negative Gearing Calculator Australia 2025 — Tax Benefit Estimator",
    description:
      "Calculate the tax benefit of negatively geared property. See how rental losses reduce your taxable income using 2025-26 ATO tax rates.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is negative gearing?",
    answer:
      "Negative gearing occurs when the costs of owning an investment property (mortgage interest, council rates, insurance, maintenance, depreciation, etc.) exceed the rental income it generates. This creates a net rental loss that can be offset against your other taxable income, such as your salary, reducing the overall tax you pay. In Australia, negative gearing is available to all property investors with no cap on the deduction.",
  },
  {
    question: "How does negative gearing save tax?",
    answer:
      "The rental loss from a negatively geared property is deducted from your other income (such as your salary), which reduces your total taxable income. Because you are taxed at your marginal tax rate, the tax saving equals the rental loss multiplied by your marginal rate. For example, if your rental loss is $10,000 and your marginal rate is 37%, you save $3,700 in tax. The higher your marginal tax rate, the greater the tax benefit of negative gearing.",
  },
  {
    question: "What expenses can be claimed on a negatively geared property?",
    answer:
      "Deductible expenses include mortgage interest (not principal repayments), council rates, water rates, landlord insurance, property management fees, repairs and maintenance, body corporate or strata fees, pest control, cleaning, gardening, advertising for tenants, legal fees, land tax, and depreciation on the building and fixtures. Capital works deductions (Division 43) allow 2.5% of construction costs for buildings built after September 1987. Only expenses incurred while the property is rented or genuinely available for rent are deductible.",
  },
  {
    question: "Is negative gearing worth it?",
    answer:
      "Whether negative gearing is worthwhile depends on several factors: your marginal tax rate (higher brackets gain more benefit), expected capital growth of the property, your cash flow position, and how long you intend to hold the property. Negative gearing reduces your tax bill but does not eliminate the out-of-pocket cost entirely — you are still spending more on the property than it earns in rent. The strategy relies on capital growth over time to deliver a net profit when the property is eventually sold. It tends to benefit higher-income earners most due to their higher marginal tax rates.",
  },
  {
    question: "What are the 2025-26 ATO tax brackets for calculating negative gearing benefits?",
    answer:
      "The 2025-26 Australian resident individual tax rates are: $0 to $18,200 — nil; $18,201 to $45,000 — 16 cents per dollar over $18,200; $45,001 to $135,000 — $4,288 plus 30 cents per dollar over $45,000; $135,001 to $190,000 — $31,288 plus 37 cents per dollar over $135,000; $190,001 and above — $51,638 plus 45 cents per dollar over $190,000. The Medicare levy of 2% applies on top. Your marginal rate determines how much tax you save per dollar of rental loss.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Negative Gearing Calculator 2025",
  description:
    "Free negative gearing calculator for Australian investment property. Estimate how rental losses reduce your taxable income and calculate annual tax savings using 2025-26 ATO tax rates.",
  url: "https://au-calculators.vercel.app/calculators/negative-gearing",
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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://au-calculators.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Negative Gearing Calculator",
      item: "https://au-calculators.vercel.app/calculators/negative-gearing",
    },
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

export default function NegativeGearingPage() {
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
            Negative Gearing Calculator Australia 2025
          </h1>
          <p className="text-gray-600">
            Calculate the tax benefit of negatively geared investment property. See how rental
            losses offset your taxable income and estimate your annual tax saving using official
            2025-26 ATO tax rates.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <NegativeGearingCalculator />

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
