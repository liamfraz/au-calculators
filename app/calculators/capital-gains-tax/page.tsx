import type { Metadata } from "next";
import CapitalGainsTaxCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator Australia 2026 — Shares & Crypto",
  description:
    "Free Australian capital gains tax calculator. Calculate CGT on property, shares, and crypto with the 50% discount for assets held over 12 months. Uses 2025-26 ATO tax brackets.",
  keywords: [
    "capital gains tax calculator australia",
    "cgt calculator au",
    "property capital gains tax calculator",
    "capital gains tax calculator",
    "cgt discount calculator",
    "capital gains tax on shares australia",
    "capital gains tax on property australia",
    "cgt calculator 2026",
    "50 percent cgt discount",
  ],
  openGraph: {
    title: "Capital Gains Tax Calculator Australia 2026 — CGT with 50% Discount",
    description:
      "Calculate capital gains tax on property, shares, and crypto. Auto-detects 50% CGT discount eligibility. Uses 2025-26 ATO tax brackets.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How is capital gains tax calculated in Australia?",
    answer:
      "Capital gains tax (CGT) in Australia is calculated by adding your net capital gain to your taxable income for the year. The net gain is the sale price minus the purchase price and any capital costs (such as agent fees, legal costs, and renovations). If you held the asset for more than 12 months, individual taxpayers can apply a 50% CGT discount, halving the taxable gain. The gain is then taxed at your marginal tax rate — not a flat rate. This means the tax you pay depends on your total income for that financial year.",
  },
  {
    question: "What is the 50% CGT discount and who qualifies?",
    answer:
      "The 50% CGT discount allows Australian individual taxpayers and trusts to reduce their capital gain by 50% if the asset was held for at least 12 months before being sold. For example, a $200,000 capital gain becomes a $100,000 taxable gain after the discount. Companies do not qualify for the 50% discount. Self-managed super funds (SMSFs) receive a reduced discount of one-third (33.33%). The discount applies to most CGT assets including property, shares, ETFs, managed funds, and cryptocurrency.",
  },
  {
    question: "Do I pay capital gains tax on my home in Australia?",
    answer:
      "Your main residence (the home you live in) is generally exempt from capital gains tax under the main residence exemption. To qualify, the property must have been your home for the entire ownership period, you must not have used it to produce income (e.g. renting out a room), and the land must be under 2 hectares. If you move out and rent it, the 6-year absence rule may allow you to maintain the exemption for up to 6 years. Partial exemptions apply if the property was your home for only part of the time you owned it.",
  },
  {
    question: "How is CGT calculated on shares and crypto in Australia?",
    answer:
      "CGT on shares, ETFs, and cryptocurrency is calculated the same way as property — sale price minus cost base (purchase price plus brokerage and other costs). If held for over 12 months, the 50% discount applies. Capital losses from shares or crypto can offset capital gains but cannot be used to reduce other income like salary. Losses can be carried forward to future years. The ATO requires you to report all crypto disposals, including trading one cryptocurrency for another.",
  },
  {
    question: "When do I need to pay capital gains tax?",
    answer:
      "CGT is payable in the financial year that you sell or dispose of the asset — not when you purchased it. You report capital gains in your tax return for that year. For example, if you sell a property in March 2026, the gain is included in your 2025-26 tax return and any tax is due by the lodgement deadline (31 October 2026, or later if lodging through a tax agent). The ATO may require PAYG instalments if your capital gains are significant and regular.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Capital Gains Tax Calculator 2026",
  description:
    "Free CGT calculator for Australian property, shares, and crypto. Auto-detects 50% discount eligibility and calculates tax using 2025-26 ATO brackets.",
  url: "https://au-calculators.vercel.app/calculators/capital-gains-tax",
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

export default function CapitalGainsTaxPage() {
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
            Australian Capital Gains Tax Calculator 2026
          </h1>
          <p className="text-gray-600">
            Calculate capital gains tax on property, shares, crypto, and other assets.
            Automatically applies the 50% CGT discount for assets held over 12 months.
            Uses official 2025–26 ATO tax brackets.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CapitalGainsTaxCalculator />

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
