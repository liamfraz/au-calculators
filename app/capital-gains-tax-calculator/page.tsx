import type { Metadata } from "next";
import CapitalGainsTaxCalculator from "../calculators/capital-gains-tax/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Capital Gains Tax Calculator Australia 2026 - CGT Calculator",
  description:
    "Free Australian capital gains tax calculator. Calculate CGT on property, shares, and crypto. Auto-detects 50% CGT discount for assets held over 12 months. Uses 2025-26 ATO tax brackets.",
  keywords: [
    "capital gains tax calculator australia",
    "cgt calculator australia",
    "capital gains tax calculator",
    "cgt calculator",
    "capital gains tax on property australia",
    "capital gains tax on shares australia",
    "cgt discount calculator",
    "capital gains tax calculator 2026",
    "50 percent cgt discount",
    "how to calculate capital gains tax australia",
    "cgt on investment property",
    "capital gains tax crypto australia",
  ],
  openGraph: {
    title: "Capital Gains Tax Calculator Australia 2026 - CGT Calculator",
    description:
      "Calculate capital gains tax on property, shares, and crypto. Auto-detects 50% CGT discount eligibility. Uses 2025-26 ATO tax brackets.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How is CGT calculated in Australia?",
    answer:
      "Capital gains tax (CGT) in Australia is calculated by subtracting your cost base (purchase price plus capital costs such as stamp duty, legal fees, and improvements) from the sale price to determine your capital gain. If you held the asset for more than 12 months, individual taxpayers can apply a 50% CGT discount, halving the taxable gain. The discounted gain is then added to your other taxable income for the year and taxed at your marginal tax rate. For example, if you bought a property for $500,000, spent $30,000 on improvements, and sold it for $750,000 after 2 years, your capital gain is $220,000. After the 50% discount, $110,000 is added to your taxable income.",
  },
  {
    question: "What is the 50% CGT discount?",
    answer:
      "The 50% CGT discount allows Australian individual taxpayers and trusts to reduce their capital gain by half if the asset was held for at least 12 months before being sold. This means only 50% of the gain is added to your taxable income. For example, a $200,000 capital gain becomes a $100,000 taxable gain after the discount. Companies do not qualify for the 50% discount. Self-managed super funds (SMSFs) receive a reduced discount of one-third (33.33%). The discount applies to most CGT assets including investment property, shares, ETFs, managed funds, and cryptocurrency.",
  },
  {
    question: "Do I pay CGT on my primary residence?",
    answer:
      "Your main residence (primary home) is generally exempt from capital gains tax under the main residence exemption. To qualify, the property must have been your home for the entire ownership period, you must not have used it to produce income (such as renting it out), and the land must be under 2 hectares. If you move out and rent your home, the 6-year absence rule may allow you to maintain the full exemption for up to 6 years, provided you do not claim another property as your main residence during that time. Partial exemptions apply if the property was your home for only part of the ownership period.",
  },
  {
    question: "What costs can I include in my CGT cost base?",
    answer:
      "Your CGT cost base includes the purchase price plus incidental costs of acquisition (stamp duty, legal fees, valuation fees), costs of ownership that are not tax-deductible (such as interest on a loan for a vacant block), capital improvement costs (renovations, extensions, structural improvements), and incidental costs of disposal (agent commissions, legal fees, advertising costs). Day-to-day maintenance and repairs are not part of the cost base. Keeping accurate records of all these costs is essential as they reduce your taxable capital gain.",
  },
  {
    question: "How are capital losses treated for tax purposes?",
    answer:
      "Capital losses can be used to offset capital gains in the same financial year. If your losses exceed your gains, the net capital loss can be carried forward indefinitely to offset future capital gains. Capital losses cannot be deducted against other income such as salary or wages. You must apply losses against gains before applying the 50% CGT discount. There is no time limit on carrying forward capital losses, but they must be reported in your tax return for the year they occur.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Capital Gains Tax Calculator Australia 2026",
  description:
    "Free Australian CGT calculator. Calculate capital gains tax on property, shares, and crypto with 50% discount auto-detection. Uses 2025-26 ATO tax brackets.",
  url: "https://au-calculators.vercel.app/capital-gains-tax-calculator",
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

export default function CapitalGainsTaxCalculatorPage() {
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
            Capital Gains Tax Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your Australian capital gains tax on property, shares,
            crypto, and other assets. Automatically applies the 50% CGT
            discount for assets held over 12 months and estimates tax using
            official 2025-26 ATO tax brackets.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CapitalGainsTaxCalculator />

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
