import type { Metadata } from "next";
import MortgageCalculator from "../calculator";
import { SUBURBS, SLUG_TO_SUBURB, SUBURBS_BY_CITY } from "../suburbs";
import AdUnit from "../../../components/AdUnit";
import Link from "next/link";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateStaticParams() {
  return SUBURBS.map((s) => ({ suburb: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>;
}): Promise<Metadata> {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return {};

  const title = `${suburb.name} Mortgage Calculator 2026 | Home Loan Repayments ${suburb.state}`;
  const description = `Calculate mortgage repayments for ${suburb.name}, ${suburb.state}. Median house price ${formatCurrency(suburb.medianPrice)}, typical deposit ${formatCurrency(suburb.typicalDeposit)}. Free ${suburb.name} home loan calculator.`;

  return {
    title,
    description,
    keywords: [
      `${suburb.name.toLowerCase()} mortgage calculator`,
      `mortgage calculator ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} home loan calculator`,
      `home loan repayments ${suburb.name.toLowerCase()}`,
      `how much to borrow ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} property prices`,
      `mortgage repayments ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
    ],
    openGraph: {
      title: `${suburb.name} Mortgage Calculator 2026`,
      description,
      type: "website",
    },
  };
}

export default async function SuburbMortgagePage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const loanPercent = Math.round((suburb.avgLoanSize / suburb.medianPrice) * 100);
  const depositPercent = Math.round((suburb.typicalDeposit / suburb.medianPrice) * 100);
  const nearbySuburbs = (SUBURBS_BY_CITY[suburb.city] || []).filter((s) => s.slug !== slug);
  const otherCitySuburbs = SUBURBS.filter((s) => s.slug !== slug && s.city !== suburb.city).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${suburb.name} Mortgage Calculator 2026`,
    description: `Free mortgage repayment calculator pre-filled for ${suburb.name}, ${suburb.state}. Calculate home loan repayments based on the ${formatCurrency(suburb.medianPrice)} median property price.`,
    url: `https://au-calculators.vercel.app/calculators/mortgage-repayment/${slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    author: { "@type": "Organization", name: "AU Calculators" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much are mortgage repayments in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on the median property price of ${formatCurrency(suburb.medianPrice)} in ${suburb.name}, with a 20% deposit and a 6.5% interest rate over 30 years, monthly repayments would be approximately ${formatCurrency(Math.round((suburb.avgLoanSize * (0.065 / 12 * Math.pow(1 + 0.065 / 12, 360))) / (Math.pow(1 + 0.065 / 12, 360) - 1)))}. Use the calculator above to adjust the rate, term, and deposit to match your situation.`,
        },
      },
      {
        "@type": "Question",
        name: `What deposit do I need to buy in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A standard 20% deposit on the ${formatCurrency(suburb.medianPrice)} median price in ${suburb.name} would be ${formatCurrency(suburb.typicalDeposit)}. Some lenders accept deposits as low as 5% (${formatCurrency(Math.round(suburb.medianPrice * 0.05))}), but you may need to pay Lenders Mortgage Insurance (LMI) if your deposit is below 20%.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the median house price in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The approximate median property price in ${suburb.name}, ${suburb.state} is ${formatCurrency(suburb.medianPrice)} as of 2025–2026. ${suburb.marketInsight}`,
        },
      },
    ],
  };

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
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/calculators/mortgage-repayment" className="hover:text-blue-600 transition-colors">
              Mortgage Calculator
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {suburb.name} Mortgage Calculator
          </h1>
          <p className="text-gray-600">
            Calculate mortgage repayments for property in {suburb.name}, {suburb.state}. Pre-filled
            with the {formatCurrency(suburb.medianPrice)} median property price — adjust the loan
            amount, interest rate, and term to match your scenario.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Key stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Median Price</p>
                <p className="text-lg font-bold text-blue-900">{formatCurrency(suburb.medianPrice)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Typical Loan ({loanPercent}%)</p>
                <p className="text-lg font-bold text-green-900">{formatCurrency(suburb.avgLoanSize)}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">Deposit ({depositPercent}%)</p>
                <p className="text-lg font-bold text-amber-900">{formatCurrency(suburb.typicalDeposit)}</p>
              </div>
            </div>

            <MortgageCalculator defaultLoanAmount={suburb.avgLoanSize} />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />

            {/* Suburb-specific content */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Buying Property in {suburb.name}, {suburb.state}
              </h2>
              <p className="text-gray-600 mb-4">{suburb.description}</p>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {suburb.name} Market Snapshot
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Median property price:</strong> {formatCurrency(suburb.medianPrice)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Average loan size:</strong> {formatCurrency(suburb.avgLoanSize)} (based on a {depositPercent}% deposit)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Typical deposit needed:</strong> {formatCurrency(suburb.typicalDeposit)} ({depositPercent}% of median price)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Minimum 5% deposit:</strong> {formatCurrency(Math.round(suburb.medianPrice * 0.05))} (LMI may apply)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Market Insight</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{suburb.marketInsight}</p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Mortgage FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much are mortgage repayments in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Based on the median property price of {formatCurrency(suburb.medianPrice)} with
                    a {depositPercent}% deposit ({formatCurrency(suburb.typicalDeposit)}), borrowing {formatCurrency(suburb.avgLoanSize)} at
                    6.5% over 30 years, monthly repayments would be
                    approximately {formatCurrency(Math.round((suburb.avgLoanSize * (0.065 / 12 * Math.pow(1 + 0.065 / 12, 360))) / (Math.pow(1 + 0.065 / 12, 360) - 1)))}.
                    Use the calculator above to model different scenarios.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What deposit do I need to buy in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A standard 20% deposit on the {formatCurrency(suburb.medianPrice)} median price
                    would be {formatCurrency(suburb.typicalDeposit)}. Some lenders accept deposits as
                    low as 5% ({formatCurrency(Math.round(suburb.medianPrice * 0.05))}), but you&apos;ll
                    likely need to pay Lenders Mortgage Insurance (LMI) if your deposit is below 20%.
                    First home buyers may qualify for government grants and stamp duty concessions
                    in {suburb.state}.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the median house price in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The approximate median property price in {suburb.name}, {suburb.state} is {formatCurrency(suburb.medianPrice)} as
                    of 2025-2026. {suburb.marketInsight}
                  </p>
                </div>
              </div>
            </section>

            {/* Internal links: nearby suburbs in same city */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nearby {suburb.city} Mortgage Calculators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/mortgage-repayment"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    General Mortgage Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {nearbySuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/calculators/mortgage-repayment/${other.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {other.name} Mortgage Calculator
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{other.state}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Other city suburb calculators */}
            {otherCitySuburbs.length > 0 && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  More Suburb Calculators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherCitySuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/calculators/mortgage-repayment/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        {other.name} Mortgage Calculator
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{other.state}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related calculators */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/stamp-duty"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/property-cashflow"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Property Cashflow Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/rental-yield"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Rental Yield Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/negative-gearing"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
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
