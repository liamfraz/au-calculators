import type { Metadata } from "next";
import NegativeGearingCalculator from "../calculators/negative-gearing/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Negative Gearing Calculator Australia 2024 | Investment Property Tax Calculator",
  description:
    "Free Australian negative gearing calculator. Estimate tax savings on negatively geared investment property. Calculate rental income, deductible expenses, net rental loss, and after-tax holding cost using 2024-25 ATO tax rates.",
  keywords: [
    "negative gearing calculator australia",
    "investment property tax calculator",
    "negative gearing tax benefit",
    "negative gearing calculator",
    "property tax deductions australia",
    "negatively geared property calculator",
    "rental property tax calculator",
    "investment property deductions",
    "negative gearing explained",
    "after tax cost investment property",
  ],
  openGraph: {
    title:
      "Negative Gearing Calculator Australia 2024 — Investment Property Tax Calculator",
    description:
      "Calculate the tax benefit of negative gearing. See how rental losses offset your taxable income and estimate your after-tax holding cost using current ATO rates.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is negative gearing in Australia?",
    answer:
      "Negative gearing occurs when the total costs of owning an investment property — including mortgage interest, council rates, insurance, maintenance, and management fees — exceed the rental income it generates. The net rental loss can be deducted from your other taxable income (such as your salary), reducing the tax you owe. Australia is one of the few countries that allows unlimited negative gearing deductions against all income types.",
  },
  {
    question: "How does negative gearing reduce my tax?",
    answer:
      "When your investment property runs at a loss, that loss is subtracted from your total taxable income. Because you pay tax at your marginal rate, the tax saving equals the rental loss multiplied by your marginal tax rate (plus Medicare levy). For example, a $15,000 rental loss at a 37% marginal rate saves $5,550 in income tax plus $300 in Medicare levy — a total saving of $5,850. The higher your income and marginal rate, the larger the tax benefit.",
  },
  {
    question: "What expenses can I deduct on an investment property?",
    answer:
      "Deductible expenses include: mortgage interest (not principal repayments), council rates, water rates, landlord insurance, property management fees (typically 7-10% of rent), repairs and maintenance, body corporate or strata fees, pest control, gardening, advertising for tenants, legal fees, land tax, and depreciation. Capital works deductions (Division 43) allow 2.5% per year on construction costs for buildings built after September 1987. Only expenses incurred while the property is rented or genuinely available for rent are deductible.",
  },
  {
    question: "What is the after-tax cost of holding a negatively geared property?",
    answer:
      "The after-tax holding cost is what the property actually costs you out of pocket each year after accounting for the tax benefit. It is calculated as: total expenses (including mortgage interest) minus rental income minus the tax saving from negative gearing. For example, if your property costs $40,000/year to hold, earns $30,000 in rent, and saves $3,700 in tax, your after-tax holding cost is $6,300/year or about $121/week.",
  },
  {
    question: "Is negative gearing worth it for property investors?",
    answer:
      "Negative gearing reduces your out-of-pocket costs but does not eliminate them — you are still spending more than you earn in rent. The strategy relies on long-term capital growth to deliver an overall profit when the property is sold. It benefits higher-income earners most because their marginal tax rate is higher, so the tax saving per dollar of loss is greater. Consider your cash flow, investment horizon, and expected capital growth before relying on negative gearing.",
  },
  {
    question: "What are the 2024-25 ATO tax rates used in this calculator?",
    answer:
      "The 2024-25 Australian resident individual tax rates are: $0-$18,200 — nil; $18,201-$45,000 — 16c per dollar over $18,200; $45,001-$135,000 — $4,288 plus 30c per dollar over $45,000; $135,001-$190,000 — $31,288 plus 37c per dollar over $135,000; $190,001+ — $51,638 plus 45c per dollar over $190,000. The 2% Medicare levy applies on top. Your marginal rate determines how much tax you save for each dollar of rental loss.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Negative Gearing Calculator 2024",
  description:
    "Free negative gearing calculator for Australian investment property. Calculate rental income, deductible expenses, net rental loss, tax benefit, and after-tax holding cost using 2024-25 ATO tax rates.",
  url: "https://au-calculators.vercel.app/negative-gearing-calculator",
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

export default function NegativeGearingCalculatorPage() {
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
            Negative Gearing Calculator Australia 2024
          </h1>
          <p className="text-gray-600">
            Calculate the tax benefit of negatively geared investment property.
            Enter your property details, rental income, and expenses to see your
            net rental loss, tax saving, and after-tax holding cost using
            official 2024-25 ATO tax rates.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <NegativeGearingCalculator />

            {/* Educational content */}
            <section className="mt-10 space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  How Negative Gearing Works in Australia
                </h2>
                <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Negative gearing is one of the most widely used tax
                    strategies for Australian property investors. When your
                    investment property expenses exceed your rental income, the
                    resulting loss can be offset against your other income —
                    including your salary, business income, or dividends.
                  </p>
                  <p>
                    <strong>How the tax benefit is calculated:</strong> Your net
                    rental loss is deducted from your taxable income before tax
                    is calculated. The actual dollar saving depends on your
                    marginal tax rate. Someone earning $120,000 (30% marginal
                    rate + 2% Medicare) saves 32 cents per dollar of rental loss,
                    while someone earning $200,000 (45% + 2%) saves 47 cents per
                    dollar.
                  </p>
                  <p>
                    <strong>What counts as an expense:</strong> Mortgage interest
                    is usually the largest deduction, followed by depreciation
                    (if the property qualifies), council rates, insurance,
                    property management fees, and maintenance. Principal
                    repayments on your loan are <em>not</em> deductible — only
                    the interest component.
                  </p>
                  <p>
                    <strong>The trade-off:</strong> While negative gearing
                    reduces your tax, you are still out of pocket — the tax
                    saving only covers part of the loss. The strategy assumes
                    capital growth will more than compensate when you eventually
                    sell. If the property does not grow in value, negative
                    gearing simply means you lost money with a partial tax
                    rebate.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Key Things to Know
                </h2>
                <ul className="text-gray-700 text-sm leading-relaxed space-y-2 list-disc list-inside">
                  <li>
                    Negative gearing is available to all Australian taxpayers —
                    there is no income cap or property limit.
                  </li>
                  <li>
                    The property must be genuinely available for rent to claim
                    deductions. Holiday homes used primarily by the owner may not
                    qualify.
                  </li>
                  <li>
                    When you sell a negatively geared property, any capital gain
                    is taxable. Individuals who held the property for 12+ months
                    receive a 50% CGT discount.
                  </li>
                  <li>
                    Depreciation (Division 40 plant &amp; equipment and Division
                    43 capital works) is a non-cash deduction that can
                    significantly increase your rental loss without additional
                    out-of-pocket cost.
                  </li>
                  <li>
                    If your rental income exceeds expenses, the property is
                    &quot;positively geared&quot; and the net income is added to
                    your taxable income instead.
                  </li>
                </ul>
              </div>
            </section>

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
