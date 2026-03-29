import type { Metadata } from "next";
import StampDutyCalculator from "../calculators/stamp-duty/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator Australia 2026 - All States & Territories",
  description:
    "Free Australian stamp duty calculator with 2025-26 rates for NSW, VIC, QLD, SA, WA, TAS, NT, and ACT. Calculate transfer duty, first home buyer concessions, foreign buyer surcharges, and compare stamp duty across all states.",
  keywords: [
    "stamp duty calculator",
    "stamp duty calculator nsw",
    "stamp duty calculator vic",
    "stamp duty calculator qld",
    "stamp duty calculator australia",
    "stamp duty calculator sa",
    "stamp duty calculator wa",
    "stamp duty calculator tas",
    "stamp duty calculator act",
    "transfer duty calculator",
    "how much is stamp duty",
    "stamp duty first home buyer",
    "stamp duty calculator australia 2026",
    "property transfer duty",
    "stamp duty rates 2025-26",
  ],
  openGraph: {
    title: "Stamp Duty Calculator Australia 2026 - All States & Territories",
    description:
      "Calculate stamp duty for any Australian state or territory. Compare rates, apply first home buyer concessions, and see 2025-26 transfer duty rates.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/stamp-duty-calculator",
  },
};

const faqs = [
  {
    question: "How much is stamp duty on a $500,000 property in Australia?",
    answer:
      "Stamp duty on a $500,000 property varies significantly by state. In NSW you would pay approximately $16,912, in Victoria around $21,970 for a primary residence, and in Queensland approximately $8,750 using the home concession rate. The ACT has the lowest rate for owner-occupiers at around $7,724 due to its transition from stamp duty to land tax. First home buyers may pay significantly less or nothing depending on the state and property value.",
  },
  {
    question: "How is stamp duty calculated in NSW?",
    answer:
      "NSW stamp duty (officially called transfer duty) is calculated on a sliding scale with marginal rates. For 2025-26, rates start at 1.25% for the first $17,000, increasing through several brackets up to 7% for property values above $3,721,000. For a typical $800,000 home in Sydney, stamp duty is approximately $31,335. First home buyers purchasing up to $800,000 pay no stamp duty, with a sliding concession up to $1,000,000.",
  },
  {
    question: "How is stamp duty calculated in Victoria?",
    answer:
      "Victorian stamp duty uses tiered marginal rates starting at 1.4% for properties up to $25,000, rising to 6% for properties between $130,000 and $960,000. Properties over $960,000 attract a flat 5.5% rate, and above $2 million the marginal rate is 6.5%. Victoria also offers reduced rates for owner-occupiers on properties under $550,000. First home buyers are exempt up to $600,000 with a sliding concession to $750,000.",
  },
  {
    question: "How is stamp duty calculated in Queensland?",
    answer:
      "Queensland transfer duty starts at 1.5% for values between $5,000 and $75,000, rising through brackets to 5.75% for property values above $1,000,000. The first $5,000 of property value is exempt. Queensland offers a generous home concession rate for owner-occupiers, with rates starting at 1% for properties up to $350,000. First home buyers purchasing under $700,000 pay no transfer duty at all.",
  },
  {
    question: "Which Australian state has the lowest stamp duty?",
    answer:
      "The ACT generally has the lowest stamp duty for owner-occupiers due to its ongoing 20-year transition from stamp duty to a land tax system. For a $500,000 property, ACT owner-occupiers pay around $7,724. Tasmania also has relatively low rates with a top marginal rate of 4.5%. Queensland offers competitive rates for primary residences through its home concession scheme, making it one of the most affordable states for owner-occupier purchases.",
  },
  {
    question: "Do first home buyers pay stamp duty in Australia?",
    answer:
      "Most states offer stamp duty concessions or exemptions for first home buyers. NSW exempts properties up to $800,000 with reduced duty to $1 million. Victoria exempts up to $600,000 with concessions to $750,000. Queensland exempts up to $700,000. South Australia offers full exemption for new homes with no price cap. WA exempts up to $500,000 with concessions to $700,000. Tasmania exempts up to $750,000. The ACT exempts up to $1.02 million. The NT provides grants rather than duty concessions.",
  },
  {
    question: "What is the foreign buyer stamp duty surcharge?",
    answer:
      "Most Australian states charge an additional stamp duty surcharge for foreign buyers purchasing residential property. As of 2025-26, NSW charges 9% (increased from 8% in January 2025), Victoria charges 8%, Queensland charges 8% (AFAD), South Australia charges 7%, Western Australia charges 7%, and Tasmania charges 8%. The NT and ACT do not charge a stamp duty surcharge for foreign buyers, though the ACT applies an annual land tax surcharge instead.",
  },
  {
    question: "When do you pay stamp duty in Australia?",
    answer:
      "Stamp duty is typically due at or shortly after settlement. In NSW, it must be paid within 3 months of the contract date. In Victoria, it is due within 30 days of settlement. Queensland requires payment within 30 days of the transfer. South Australia requires payment within 60 days. The exact deadline varies by state, so check with your conveyancer or solicitor. Late payment may attract penalties and interest.",
  },
  {
    question: "Can you add stamp duty to your mortgage?",
    answer:
      "Some lenders allow you to capitalise stamp duty into your home loan, effectively borrowing more to cover the duty cost. However, this increases your total loan amount and means you pay interest on the stamp duty for the life of the loan. For a $20,000 stamp duty added to a 30-year loan at 6%, you would pay approximately $23,200 in additional interest. It is generally better to save for stamp duty separately if possible.",
  },
  {
    question: "What is the difference between stamp duty and transfer duty?",
    answer:
      "Stamp duty and transfer duty are the same tax — they both refer to the state government tax paid when purchasing property. Some states like NSW and Queensland officially call it 'transfer duty', while others still use 'stamp duty'. The ACT calls it 'conveyance duty'. Regardless of the name, it is calculated as a percentage of the property's purchase price or market value, whichever is higher.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Stamp Duty Calculator Australia 2026",
  description:
    "Free Australian stamp duty calculator for all states and territories with 2025-26 rates. Calculate transfer duty, first home buyer concessions, and foreign buyer surcharges.",
  url: "https://au-calculators.vercel.app/stamp-duty-calculator",
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

export default function StampDutyCalculatorPage() {
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
            Stamp Duty Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate stamp duty (transfer duty) for all Australian states and
            territories using official 2025–2026 rates. Select your state, enter
            your property value, and see an instant breakdown including first
            home buyer concessions, foreign buyer surcharges, and a side-by-side
            comparison across all states.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <StampDutyCalculator />

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
            Stamp Duty Rates by State 2025–2026
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                NSW Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                New South Wales transfer duty ranges from 1.25% to 7% on a
                sliding scale. First home buyers are exempt on properties up to
                $800,000 with concessions to $1,000,000. Foreign buyers pay an
                additional 9% surcharge (increased January 2025).
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                VIC Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Victorian stamp duty uses marginal rates from 1.4% to 6.5%.
                Owner-occupiers get reduced rates on properties under $550,000.
                First home buyers are exempt up to $600,000 with concessions to
                $750,000. Foreign buyers pay an 8% surcharge.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                QLD Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Queensland transfer duty ranges from 1.5% to 5.75% with the
                first $5,000 exempt. Owner-occupiers benefit from the home
                concession rate starting at just 1%. First home buyers pay no
                duty on properties up to $700,000.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                SA Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                South Australian stamp duty ranges from 1% to 5.5% across
                multiple brackets. First home buyers receive a full exemption
                when purchasing a new home with no price cap. Foreign buyers pay
                a 7% surcharge on residential property.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                WA Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Western Australian transfer duty ranges from 1.9% to 5.15%.
                First home buyers are exempt on properties up to $500,000 with
                concessions sliding to $700,000. Foreign buyers pay a 7%
                surcharge on residential property.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                TAS Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tasmania has the lowest top marginal rate at 4.5%, with a
                minimum duty of $50. First home buyers are exempt on properties
                up to $750,000 until June 2026. Foreign buyers pay an 8%
                surcharge.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                NT Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Northern Territory stamp duty uses a unique formula-based
                calculation for properties up to $525,000, then flat rates of
                4.95% to 5.95% above. The NT does not offer stamp duty
                concessions but provides a $50,000 HomeGrown Territory grant for
                first home buyers.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                ACT Stamp Duty Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The ACT has the lowest stamp duty in Australia for
                owner-occupiers as it transitions to a land tax system. Rates
                range from 0.28% to 4.54%. First home buyers are exempt up to
                $1,020,000. No foreign buyer stamp duty surcharge applies.
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
