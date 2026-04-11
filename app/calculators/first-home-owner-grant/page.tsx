import type { Metadata } from "next";
import FHOGCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "First Home Owner Grant Calculator Australia 2025 | FHOG Eligibility",
  description:
    "Check your eligibility for the First Home Owner Grant (FHOG) in every Australian state. See your grant amount, stamp duty concession, and total estimated benefit. Updated for 2024-25 state rules.",
  keywords: [
    "first home owner grant calculator",
    "FHOG calculator australia",
    "first home owner grant eligibility",
    "first home owner grant 2025",
    "FHOG NSW QLD VIC SA WA TAS NT",
    "first home grant australia",
    "stamp duty concession first home buyer",
    "first home owner grant amount by state",
    "new home grant australia",
    "FHOG eligibility checker",
  ],
  openGraph: {
    title: "First Home Owner Grant Calculator Australia 2025",
    description:
      "Check FHOG eligibility by state. See grant amount, stamp duty concession, and total estimated saving for first home buyers in Australia.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/calculators/first-home-owner-grant",
  },
};

const faqs = [
  {
    question: "How much is the First Home Owner Grant in each state?",
    answer:
      "FHOG amounts vary significantly by state. Queensland and Tasmania offer $30,000. South Australia offers $15,000. NSW, Victoria, WA, and NT offer $10,000. The ACT replaced FHOG with the Home Buyer Concession Scheme — a full stamp duty exemption. Most states restrict the grant to new builds only, with NT being the exception allowing established homes as well.",
  },
  {
    question: "Do I need to buy a new home to get the First Home Owner Grant?",
    answer:
      "In most states, yes. NSW, VIC, QLD, SA, WA, and TAS all restrict the FHOG to new homes or substantially renovated homes. The Northern Territory is the main exception, allowing the grant for both new and established homes. Always check with your state revenue office as 'new home' definitions can vary — some states include owner-builder homes or homes purchased off the plan.",
  },
  {
    question: "What are the property price caps for the FHOG?",
    answer:
      "Price caps by state (2024-25): NSW $750,000, VIC $750,000, QLD $750,000, SA $650,000, WA $750,000, TAS $750,000, NT $600,000. Properties above these thresholds are not eligible for the FHOG regardless of other eligibility criteria. These caps apply to the total purchase price including GST.",
  },
  {
    question: "Can I combine the FHOG with other first home buyer schemes?",
    answer:
      "Yes — in most states you can combine the FHOG with the stamp duty exemption/concession, the Federal Government's First Home Guarantee (5% deposit without LMI), and the First Home Super Saver Scheme. The total combined benefit can be $50,000 or more depending on your state, property value, and which schemes you qualify for.",
  },
  {
    question: "When is the FHOG paid?",
    answer:
      "For newly built homes purchased from a builder, the FHOG is usually paid at settlement or when construction begins (for construction loans). For owner-builder homes, it is paid when the certificate of occupancy is issued. Applications must be lodged through your lending institution or state revenue office within 12 months of settlement.",
  },
  {
    question: "Do I need to live in the property to get the FHOG?",
    answer:
      "Yes. You must move into the property as your principal place of residence within 12 months of settlement (or completion of construction) and live there for a continuous period of at least 6 months. Buying to rent out or as an investment property disqualifies you from the FHOG.",
  },
  {
    question: "Is the FHOG available to Australian permanent residents?",
    answer:
      "Generally yes — the FHOG is available to Australian citizens and permanent residents. At least one applicant must be an Australian citizen or permanent resident in most states. Temporary visa holders are not eligible. Some states require all applicants to meet citizenship/residency requirements.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "First Home Owner Grant Calculator Australia 2025",
  description:
    "Check FHOG eligibility and estimated benefit by state. Calculate grant amount, stamp duty concession, and total saving for Australian first home buyers.",
  url: "https://au-calculators.vercel.app/calculators/first-home-owner-grant",
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

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Check Your First Home Owner Grant Eligibility",
  description: "Steps to determine if you qualify for the FHOG and how much you could receive.",
  step: [
    {
      "@type": "HowToStep",
      name: "Select your state or territory",
      text: "Choose the Australian state or territory where you are buying the property. Grant amounts and eligibility rules vary by state.",
    },
    {
      "@type": "HowToStep",
      name: "Enter the property value",
      text: "Enter the full purchase price or estimated value of the property. Price caps apply — properties above the cap are not eligible.",
    },
    {
      "@type": "HowToStep",
      name: "Specify new build or established",
      text: "Indicate whether the property is a new build/off the plan or an established home. Most states only offer the FHOG for new builds.",
    },
    {
      "@type": "HowToStep",
      name: "Confirm first home buyer status",
      text: "Confirm you have never owned or co-owned residential property in Australia. This is a core eligibility requirement for all states.",
    },
    {
      "@type": "HowToStep",
      name: "Review your eligibility and estimated benefit",
      text: "The calculator shows your FHOG eligibility, grant amount, stamp duty concession estimate, and total estimated benefit.",
    },
  ],
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
      name: "First Home Owner Grant Calculator",
      item: "https://au-calculators.vercel.app/calculators/first-home-owner-grant",
    },
  ],
};

const STATE_GRANTS = [
  { state: "QLD", amount: "$30,000", type: "New builds only", cap: "$750,000" },
  { state: "TAS", amount: "$30,000", type: "New builds only", cap: "$750,000" },
  { state: "SA", amount: "$15,000", type: "New builds only", cap: "$650,000" },
  { state: "NSW", amount: "$10,000", type: "New builds only", cap: "$750,000" },
  { state: "VIC", amount: "$10,000", type: "New builds only (regional)", cap: "$750,000" },
  { state: "WA", amount: "$10,000", type: "New builds only", cap: "$750,000" },
  { state: "NT", amount: "$10,000", type: "New & established", cap: "$600,000" },
  { state: "ACT", amount: "$0", type: "Home Buyer Concession Scheme", cap: "~$1,000,000" },
];

export default function FirstHomeOwnerGrantPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            First Home Owner Grant Calculator Australia 2025
          </h1>
          <p className="text-gray-600">
            Check your eligibility for the First Home Owner Grant (FHOG) in your state. See the
            grant amount, stamp duty concession, and total estimated benefit — all in one place.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <FHOGCalculator />

            {/* State-by-State Table */}
            <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  FHOG Amounts by State — 2024-25
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">State</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Grant</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Eligibility</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Price Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STATE_GRANTS.map((row, i) => (
                      <tr key={row.state} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.state}</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-700">{row.amount}</td>
                        <td className="px-4 py-3 text-gray-600">{row.type}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{row.cap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>

        {/* Info Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding the First Home Owner Grant
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What is the FHOG?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The First Home Owner Grant is a one-off payment from your state or territory
                government to help eligible first home buyers purchase or build a new home. It was
                introduced in 2000 to offset the impact of GST on home ownership. Each state
                administers its own scheme with different amounts, eligibility rules, and price caps.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Core Eligibility Rules</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To qualify, you must: (1) be an Australian citizen or permanent resident, (2) never
                have owned or co-owned residential property in Australia, (3) not have previously
                received the FHOG, (4) intend to live in the property as your principal place of
                residence for at least 6 months, and (5) purchase or build a qualifying home within
                your state&apos;s price cap.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Stamp Duty Concessions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Most states also offer stamp duty (transfer duty) exemptions or concessions for first
                home buyers separately from the FHOG. NSW exempts properties under $800,000 entirely.
                Victoria exempts under $600,000. WA exempts under $430,000. The ACT replaces FHOG
                with a full stamp duty exemption. These can save tens of thousands more on top of the
                grant.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How to Apply</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Applications are lodged through your lending institution (they submit on your behalf
                at settlement) or directly with your state revenue office. You must apply within 12
                months of settlement or construction completion. Required documents typically include
                proof of identity, the signed contract of sale, and evidence you&apos;ve moved in
                within the required timeframe.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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
