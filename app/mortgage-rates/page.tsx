import type { Metadata } from "next";
import Link from "next/link";
import AdUnit from "../components/AdUnit";
import { SUBURBS_BY_CITY, CITY_ORDER } from "./suburbs";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const metadata: Metadata = {
  title: "Mortgage Rates Australia 2026 | Compare Home Loan Rates by Suburb",
  description:
    "Compare mortgage rates and home loan repayments for 50 Australian suburbs. See estimated monthly repayments, stamp duty costs, and rate comparisons for Sydney, Melbourne, Brisbane, and Perth. Updated March 2026.",
  keywords: [
    "mortgage rates australia",
    "home loan rates",
    "compare mortgage rates",
    "home loan comparison australia",
    "mortgage rates sydney",
    "mortgage rates melbourne",
    "mortgage rates brisbane",
    "mortgage rates perth",
    "best home loan rates australia 2026",
    "mortgage rate comparison",
    "current mortgage rates australia",
  ],
  openGraph: {
    title: "Mortgage Rates Australia 2026 | Compare Home Loan Rates by Suburb",
    description:
      "Compare mortgage rates and home loan repayments for 50 Australian suburbs across Sydney, Melbourne, Brisbane, and Perth.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What are the current mortgage rates in Australia in 2026?",
    answer:
      "As of March 2026, the Big 4 Australian banks offer variable rates for owner-occupier P&I loans between 6.39% and 6.49%. Fixed rates for 1-year terms range from 5.84% to 5.99%. Rates vary by lender, loan size, LVR, and whether the property is owner-occupied or investment.",
  },
  {
    question: "How do mortgage rates differ between suburbs?",
    answer:
      "Mortgage interest rates are generally the same regardless of suburb — they're set by lenders based on your loan-to-value ratio, loan type, and borrower profile. However, the total cost of buying varies significantly by suburb due to median property prices, stamp duty (which varies by state), and typical deposit requirements. Our suburb comparison pages show these total cost differences.",
  },
  {
    question: "What factors affect my mortgage rate in Australia?",
    answer:
      "Key factors include: your loan-to-value ratio (LVR) — lower deposits mean higher rates; whether the property is owner-occupied or investment; principal & interest vs interest-only repayments; fixed vs variable rate; the loan amount; and your credit history. Loans with LVR above 80% typically attract higher rates plus Lenders Mortgage Insurance (LMI).",
  },
  {
    question: "Should I choose a fixed or variable rate mortgage?",
    answer:
      "Fixed rates provide payment certainty for 1-5 years, which helps with budgeting. Variable rates are typically more flexible — allowing extra repayments, offset accounts, and redraw facilities. Many Australians split their loan (part fixed, part variable) to balance certainty with flexibility. In a rising rate environment, fixing can save money; in a falling market, variable rates adjust downward.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mortgage Rates Australia — Suburb Comparison",
  description:
    "Compare mortgage rates and home loan repayments for 50 Australian suburbs. See estimated monthly repayments, stamp duty costs, and rate comparisons.",
  url: "https://au-calculators.vercel.app/mortgage-rates",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  author: { "@type": "Organization", name: "AU Calculators" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function MortgageRatesPage() {
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
            Mortgage Rates Australia 2026
          </h1>
          <p className="text-gray-600">
            Compare mortgage rates and estimated repayments for 50 top
            Australian suburbs. Each suburb page shows estimated monthly
            repayments at current rates, stamp duty costs, and a lender rate
            comparison — all based on local median property prices.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Rate overview card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Current Indicative Rates (March 2026)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-blue-600 mb-1">Big 4 Variable</p>
                  <p className="text-2xl font-bold text-blue-900">6.39–6.49%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-600 mb-1">1yr Fixed</p>
                  <p className="text-2xl font-bold text-blue-900">5.84–5.99%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-600 mb-1">2yr Fixed</p>
                  <p className="text-2xl font-bold text-blue-900">5.99–6.14%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-600 mb-1">3yr Fixed</p>
                  <p className="text-2xl font-bold text-blue-900">6.09–6.24%</p>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-3">
                Owner-occupier, P&amp;I, $250k+ loan. Always confirm with your
                lender.
              </p>
            </div>

            {/* Suburb listings grouped by city */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Compare Mortgage Rates by Suburb
              </h2>
              <p className="text-gray-600 mb-6">
                Select a suburb to see estimated repayments at current rates,
                stamp duty costs, and a lender comparison — all pre-filled with
                the local median property price.
              </p>
              {CITY_ORDER.map((city) => (
                <div key={city} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {city}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(SUBURBS_BY_CITY[city] || []).map((suburb) => (
                      <Link
                        key={suburb.slug}
                        href={`/mortgage-rates/${suburb.slug}`}
                        className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                      >
                        <div>
                          <span className="text-blue-600 font-medium">
                            {suburb.name}
                          </span>
                          <span className="block text-xs text-gray-500">
                            Median {formatCurrency(suburb.medianPrice)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">
                          {suburb.state}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <AdUnit slot="below-results" format="horizontal" className="mt-8" />

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

            {/* Related Calculators */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">
                Related Calculators
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/mortgage-repayment"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Mortgage Repayment Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/stamp-duty"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Stamp Duty Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/property-cashflow"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Property Cashflow Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/rental-yield"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Rental Yield Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar ad: Desktop only */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
