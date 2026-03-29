import type { Metadata } from "next";
import LandTaxCalculator from "../calculators/land-tax/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title: "Land Tax Calculator Australia 2026 — All States & Territories",
  description:
    "Free Australian land tax calculator with 2025-26 rates for NSW, VIC, QLD, SA, WA, and TAS. Calculate land tax for investment, commercial, and primary residence properties. Compare thresholds, rates, and absentee surcharges across all states.",
  keywords: [
    "land tax calculator",
    "land tax calculator nsw",
    "land tax calculator victoria",
    "land tax rates australia 2026",
    "land tax calculator australia",
    "land tax threshold nsw 2025",
    "nsw land tax rates",
    "vic land tax calculator",
    "land tax calculator qld",
    "land tax calculator sa",
    "land tax calculator wa",
    "land tax calculator tas",
    "land tax investment property",
    "land tax trust surcharge",
    "absentee land tax surcharge",
    "land tax commercial property",
    "land tax rates 2025-26",
  ],
  openGraph: {
    title: "Land Tax Calculator Australia 2026 — All States & Territories",
    description:
      "Calculate land tax for any Australian state. Compare thresholds, rates, and surcharges for investment, commercial, and residential properties using official 2025-2026 figures.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/land-tax-calculator",
  },
};

const faqs = [
  {
    question: "How much is land tax on a $1 million property in NSW?",
    answer:
      "For an individual owner in NSW with a total land value of $1,000,000, no land tax is payable because the value is below the $1,075,000 tax-free threshold for 2025-2026. If the land value exceeds the threshold — for example $1,500,000 — land tax would be $6,900 ($100 plus 1.6% of the $425,000 above the threshold). Trusts pay from the first dollar at 1.6%, so a trust holding $1M in land would pay $16,000.",
  },
  {
    question: "What is the land tax threshold in Victoria for 2025-2026?",
    answer:
      "Victoria has a general land tax threshold of $50,000 for the 2025-2026 assessment year. This is one of the lowest thresholds in Australia. Above $50,000, progressive rates apply starting from a flat $500 (for land valued $50K-$100K) up to 2.55% for land valued above $3 million. Trusts pay an additional surcharge of 0.375% on top of the standard rates. Absentee owners face an extra 4% surcharge.",
  },
  {
    question: "Is land tax deductible on investment property?",
    answer:
      "Yes — land tax paid on investment property is tax-deductible against your rental income. You can claim the full amount of land tax as a rental property expense in the financial year it is paid. This applies to both residential and commercial investment properties. If the property is only used for income-producing purposes for part of the year, you may need to apportion the deduction accordingly.",
  },
  {
    question: "How is land tax calculated for multiple properties?",
    answer:
      "Land tax is calculated on the total combined value of all your taxable land in each state, not on each property individually. For example, if you own two investment properties in NSW with land values of $600,000 and $500,000, your total taxable land value is $1,100,000. This combined value determines which tax bracket applies and how much land tax you owe. Properties in different states are assessed separately by each state.",
  },
  {
    question: "What is the difference between land tax and council rates?",
    answer:
      "Land tax is a state government tax on the unimproved value of your land, applying mainly to investment and commercial properties. Council rates are a local government charge based on the property value (including improvements) that funds local services like waste collection, roads, and parks. Council rates apply to all properties including your home, while land tax exempts your principal place of residence.",
  },
  {
    question: "Do I pay land tax on my primary residence?",
    answer:
      "No — your principal place of residence is exempt from land tax in all Australian states and territories. This is one of the most significant land tax exemptions available. The exemption applies to the land your home is built on, provided you live there as your main residence. Holiday homes, investment properties, and vacant land do not qualify for this exemption.",
  },
  {
    question: "Which state has the lowest land tax?",
    answer:
      "Western Australia generally has the lowest land tax rates, with a 0.25% flat rate above the $300,000 threshold and no absentee surcharge. Tasmania also has competitive rates starting at 0.55% above a $100,000 threshold. NSW has the highest threshold at $1,075,000, meaning you can hold significant land value before any tax applies, but the rates above the threshold are higher. The cheapest state depends on your total land value.",
  },
  {
    question: "What is the absentee owner surcharge?",
    answer:
      "Several states charge an additional land tax surcharge for absentee (foreign or non-resident) landowners. NSW and Victoria both charge 4%, Queensland and South Australia charge 2%, while Western Australia and Tasmania do not apply a surcharge. The surcharge is calculated on the total land value and added to the standard land tax liability, significantly increasing the tax burden for foreign investors.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Land Tax Calculator Australia 2026",
  description:
    "Free Australian land tax calculator for all states and territories with 2025-26 rates. Calculate land tax for investment, commercial, and residential properties with individual, company, and trust owner types.",
  url: "https://au-calculators.vercel.app/land-tax-calculator",
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

export default function LandTaxCalculatorPage() {
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
            Land Tax Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate land tax for all Australian states and territories using
            official 2025–2026 thresholds and rates. Select your state, enter your
            land value, choose your property and owner type, and see an instant
            breakdown including taxable value, rate applied, total land tax,
            effective rate, and a side-by-side comparison across all states.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <LandTaxCalculator />

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

        {/* State-specific content for SEO */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Land Tax Rates by State 2025–2026
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                NSW Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                New South Wales has the highest land tax threshold at $1,075,000
                for individuals. Above this, tax is 1.6% plus $100, rising to 2.0%
                above $6.68M. Trusts receive no threshold — taxed from the first
                dollar at 1.6%. Absentee owners pay an additional 4% surcharge.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                VIC Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Victoria has a $50,000 threshold with progressive rates from $500
                flat (at $50K–$100K) up to 2.55% above $3M. Trusts pay an extra
                0.375% surcharge. Absentee owners face a 4% surcharge — the
                highest in Australia alongside NSW.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                QLD Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Queensland&apos;s threshold is $600,000 for individuals and $350,000
                for trusts. Rates start at 1% plus $500 and increase to 2.25%
                above $10M. Companies use the same brackets as individuals. A 2%
                absentee surcharge applies.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                SA Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                South Australia has a $450,000 threshold for individuals but just
                $25,000 for trusts. Rates range from 0.5% to 2.4%. Absentee
                owners pay an additional 2% surcharge on their total land value.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                WA Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Western Australia has a $300,000 threshold with a unique phase-in
                between $300K–$420K. Above $420K, land tax is 0.25% flat. WA does
                not charge an absentee surcharge, making it one of the most
                competitive states for foreign investors.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                TAS Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tasmania has a $100,000 threshold with rates of 0.55% plus $50
                for land between $100K–$350K, and 1.5% above $350K. No absentee
                surcharge applies. Trusts and companies pay the same rates as
                individuals.
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
