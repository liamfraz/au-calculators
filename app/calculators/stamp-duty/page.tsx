import type { Metadata } from "next";
import StampDutyCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator Australia 2026 — All States",
  description:
    "Free Australian stamp duty calculator for all states and territories. Calculate transfer duty for NSW, VIC, QLD, SA, WA, TAS, NT, and ACT. Compare stamp duty across states, apply first home buyer concessions, and see 2025-2026 rates.",
  keywords: [
    "stamp duty calculator australia",
    "stamp duty calculator nsw",
    "stamp duty calculator vic",
    "stamp duty calculator qld",
    "transfer duty calculator",
    "stamp duty calculator australia 2026",
    "first home buyer stamp duty",
    "stamp duty comparison australia",
    "how much is stamp duty",
  ],
  openGraph: {
    title: "Stamp Duty Calculator Australia 2026 — All States & Territories",
    description:
      "Calculate stamp duty for any Australian state. Compare rates, apply first home buyer concessions, and see the total transfer duty payable.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much is stamp duty on a $500,000 property in Australia?",
    answer:
      "Stamp duty on a $500,000 property varies significantly by state. In NSW, you would pay approximately $16,912, while in Victoria it is around $21,970 for a primary residence or $25,070 for an investment property. Queensland charges approximately $8,750 for owner-occupiers using the home concession rate. First home buyers may pay significantly less or nothing at all depending on the state and property value.",
  },
  {
    question: "Which Australian state has the lowest stamp duty?",
    answer:
      "The ACT generally has the lowest stamp duty for owner-occupiers due to its ongoing transition from stamp duty to a land tax system. For a $500,000 property, ACT owner-occupiers pay around $7,724. Tasmania also has relatively low rates with a top marginal rate of 4.5% — the lowest of any state. Queensland offers competitive rates for primary residences through its home concession scheme.",
  },
  {
    question: "Do first home buyers pay stamp duty in Australia?",
    answer:
      "Most states offer stamp duty concessions for first home buyers. NSW exempts properties up to $800,000 with reduced duty up to $1 million. Victoria exempts up to $600,000 with concessions to $750,000. Queensland exempts up to $700,000 under the first home concession. South Australia offers full exemption for new homes with no price cap. The ACT exempts up to $1.02 million. Tasmania exempts up to $750,000. The Northern Territory does not offer stamp duty concessions but provides generous grants instead.",
  },
  {
    question: "What is the difference between stamp duty and transfer duty?",
    answer:
      "Stamp duty and transfer duty are the same tax — they both refer to the state government tax paid when purchasing property. Some states like NSW and Queensland officially call it 'transfer duty', while others still use 'stamp duty'. The ACT calls it 'conveyance duty'. Regardless of the name, it is calculated as a percentage of the property's purchase price or market value, whichever is higher.",
  },
  {
    question: "When do you pay stamp duty in Australia?",
    answer:
      "Stamp duty is typically due at or shortly after settlement. In NSW, it must be paid within 3 months of the contract date. In Victoria, it is due within 30 days of settlement. Queensland requires payment within 30 days of the transfer. The exact deadline varies by state, so check with your conveyancer or solicitor. Late payment may attract penalties and interest.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Stamp Duty Calculator 2026",
  description:
    "Free stamp duty calculator for all Australian states and territories. Compare transfer duty rates, apply first home buyer concessions, and calculate total duty payable.",
  url: "https://au-calculators.vercel.app/calculators/stamp-duty",
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

export default function StampDutyPage() {
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
            Australian Stamp Duty Calculator 2026
          </h1>
          <p className="text-gray-600">
            Calculate stamp duty (transfer duty) for all Australian states and territories.
            Compare rates across states, apply first home buyer concessions, and see the total
            duty payable using official 2025–2026 rates.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <StampDutyCalculator />

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

        {/* Related Calculators */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/calculators/mortgage-repayment"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Mortgage Repayment Calculator</p>
              <p className="text-gray-500 text-xs mt-1">Estimate your monthly repayments after stamp duty</p>
            </Link>
            <Link
              href="/calculators/first-home-buyer-concession"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">First Home Buyer Concession</p>
              <p className="text-gray-500 text-xs mt-1">Check your stamp duty discount or exemption</p>
            </Link>
            <Link
              href="/calculators/first-home-owner-grant"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">First Home Owner Grant</p>
              <p className="text-gray-500 text-xs mt-1">See if you qualify for a state FHOG payment</p>
            </Link>
            <Link
              href="/calculators/mortgage-offset"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Mortgage Offset Calculator</p>
              <p className="text-gray-500 text-xs mt-1">Calculate interest savings with an offset account</p>
            </Link>
            <Link
              href="/calculators/land-tax"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Land Tax Calculator</p>
              <p className="text-gray-500 text-xs mt-1">Calculate annual land tax obligations by state</p>
            </Link>
            <Link
              href="/calculators/rental-yield"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Rental Yield Calculator</p>
              <p className="text-gray-500 text-xs mt-1">Assess investment return on your property</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
