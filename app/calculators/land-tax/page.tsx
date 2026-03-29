import type { Metadata } from "next";
import LandTaxCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Land Tax Calculator Australia 2026 | All States & Territories",
  description:
    "Free Australian land tax calculator for all states and territories. Calculate land tax for NSW, VIC, QLD, SA, WA, TAS using 2025-2026 thresholds and rates. Supports investment, commercial, and primary residence properties with individual, company, and trust owner types.",
  keywords: [
    "land tax calculator nsw",
    "land tax calculator victoria",
    "land tax rates australia 2026",
    "land tax calculator qld",
    "land tax calculator australia",
    "land tax threshold nsw",
    "land tax rates victoria",
    "land tax calculator sa",
    "land tax calculator wa",
    "land tax calculator tas",
    "land tax threshold 2025",
    "nsw land tax rates 2026",
    "vic land tax calculator",
    "land tax trust surcharge",
    "land tax investment property",
    "land tax commercial property",
    "absentee land tax surcharge",
  ],
  openGraph: {
    title: "Land Tax Calculator Australia 2026 — All States & Territories",
    description:
      "Calculate land tax for any Australian state. Compare thresholds and rates for investment, commercial, and residential properties using official 2025-2026 figures.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/land-tax-calculator",
  },
};

const faqs = [
  {
    question: "What is land tax in Australia?",
    answer:
      "Land tax is an annual state government tax levied on the unimproved value of land you own, excluding your principal place of residence. It applies to investment properties, commercial land, and vacant land. Each state sets its own thresholds and rates, meaning the amount you pay varies depending on where your land is located and how much it is worth.",
  },
  {
    question: "Is my home exempt from land tax?",
    answer:
      "Yes — your principal place of residence (your main home) is exempt from land tax in all Australian states and territories. The exemption applies to the land on which your home is built, provided you occupy it as your primary residence. Investment properties, holiday homes, and vacant land do not qualify for this exemption.",
  },
  {
    question: "What is the land tax threshold in NSW for 2025-2026?",
    answer:
      "The NSW land tax threshold for 2025-2026 is $1,075,000 for individual owners. Land valued below this threshold is not subject to land tax. Above the threshold, land tax is calculated at 1.6% plus $100, with a premium rate of 2.0% applying to land values above $6,680,000. Trusts do not receive the tax-free threshold in NSW and are taxed from the first dollar at 1.6%.",
  },
  {
    question: "How does land tax differ for trusts and companies?",
    answer:
      "In most states, trusts face lower thresholds and sometimes higher rates than individuals. In NSW, trusts receive no tax-free threshold and pay land tax from the first dollar. In Queensland, the trust threshold is $350,000 compared to $600,000 for individuals. Companies generally pay the same rates as individuals in most states. Victoria applies a trust surcharge of 0.375% on top of the standard rates.",
  },
  {
    question: "How is land value assessed?",
    answer:
      "Land value is assessed by the Valuer General in each state, based on the unimproved value of the land. This means the value of the land itself, excluding any buildings, structures, or other improvements on it. Valuations are typically updated annually or every few years depending on the state, and you can usually object to a valuation if you believe it is incorrect.",
  },
  {
    question: "When is land tax payable?",
    answer:
      "Land tax is assessed annually, usually based on the total unimproved value of your taxable land as at 31 December of the prior year (or 30 June in some states). Assessment notices are issued early in the calendar year, with payment due dates varying by state — typically between February and June. Late payment may attract penalties and interest charges.",
  },
  {
    question: "Do all states charge land tax?",
    answer:
      "All Australian states charge land tax except the Northern Territory, which has no general land tax. The ACT has largely transitioned from stamp duty to a rates-based system, where land tax for investment properties is incorporated into general rates as a fixed charge plus a percentage of the average unimproved value. The six states that charge traditional land tax — NSW, VIC, QLD, SA, WA, and TAS — each have their own thresholds, rates, and exemptions.",
  },
  {
    question: "What is the absentee owner land tax surcharge?",
    answer:
      "Several states charge an additional land tax surcharge for absentee (foreign) landowners. NSW and Victoria both charge a 4% absentee surcharge, Queensland and South Australia charge 2%, while Western Australia and Tasmania do not apply an absentee surcharge. This surcharge is calculated on the total land value and added to the standard land tax liability.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Land Tax Calculator 2026",
  description:
    "Free land tax calculator for all Australian states and territories. Calculate land tax for investment, commercial, and residential properties with individual, company, and trust owner types. Compare thresholds, rates, and surcharges using official 2025-2026 figures.",
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

export default function LandTaxPage() {
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
            Australian Land Tax Calculator 2026
          </h1>
          <p className="text-gray-600">
            Calculate land tax for all Australian states using official 2025–2026
            thresholds and rates. Select your state, property type, and owner type
            to see a full breakdown including taxable value, rate applied, total
            land tax, and effective rate. Compare land tax across all states and
            check absentee surcharges.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <LandTaxCalculator />

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
                New South Wales land tax has a tax-free threshold of $1,075,000
                for individual owners. Above this, land tax is 1.6% plus $100,
                with a premium rate of 2.0% applying above $6,680,000. Trusts
                receive no tax-free threshold and are taxed from the first dollar.
                Absentee owners pay an additional 4% surcharge.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                VIC Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Victorian land tax has a general threshold of $50,000. Progressive
                rates range from a flat $500 (for land valued $50K–$100K) up to
                2.55% for land above $3 million. Trusts pay an additional surcharge
                of 0.375% above the threshold. Absentee owners pay an extra 4%.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                QLD Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Queensland land tax threshold is $600,000 for individuals and
                $350,000 for trusts. Rates start at 1% plus $500 up to $1M, then
                increase progressively to 2.25% above $10 million. Absentee
                owners pay a 2% surcharge. Companies use the same brackets as
                individuals.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                SA Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                South Australian land tax has a $450,000 threshold for individuals
                and $25,000 for trusts. Rates are 0.5% up to $854K, then 1% up to
                $1.11M, and 2.4% above that. Absentee owners pay an additional 2%
                surcharge on their total land value.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                WA Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Western Australia has a $300,000 threshold with a unique phase-in
                calculation between $300K and $420K. Above $420K, land tax is a
                flat 0.25% of the value above the threshold. WA does not apply an
                absentee owner surcharge. Trusts and companies use the same rates
                as individuals.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                TAS Land Tax Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tasmania has a $100,000 tax-free threshold. Rates are 0.55% plus
                $50 for land between $100K–$350K, and 1.5% above $350K. Tasmania
                does not apply an absentee surcharge. Trusts and companies pay the
                same rates as individuals.
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
