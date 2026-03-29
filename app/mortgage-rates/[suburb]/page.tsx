import type { Metadata } from "next";
import Link from "next/link";
import AdUnit from "../../components/AdUnit";
import { SUBURBS, SLUG_TO_SUBURB, SUBURBS_BY_CITY } from "../suburbs";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calcRepayment(loan: number, rate: number, years: number): number {
  const r = rate / 100 / 12;
  const n = years * 12;
  if (r === 0) return loan / n;
  return (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

function estimateStampDuty(price: number, state: string): number {
  switch (state) {
    case "NSW": {
      if (price <= 16_000) return price * 0.0125;
      if (price <= 35_000) return 200 + (price - 16_000) * 0.015;
      if (price <= 93_000) return 485 + (price - 35_000) * 0.0175;
      if (price <= 351_000) return 1_500 + (price - 93_000) * 0.035;
      if (price <= 1_168_000) return 10_530 + (price - 351_000) * 0.045;
      return 47_295 + (price - 1_168_000) * 0.055;
    }
    case "VIC": {
      if (price <= 25_000) return price * 0.014;
      if (price <= 130_000) return 350 + (price - 25_000) * 0.024;
      if (price <= 960_000) return 2_870 + (price - 130_000) * 0.06;
      return 2_870 + (960_000 - 130_000) * 0.06 + (price - 960_000) * 0.055;
    }
    case "QLD": {
      if (price <= 5_000) return 0;
      if (price <= 75_000) return (price - 5_000) * 0.015;
      if (price <= 540_000) return 1_050 + (price - 75_000) * 0.035;
      if (price <= 1_000_000) return 17_325 + (price - 540_000) * 0.045;
      return 38_025 + (price - 1_000_000) * 0.0575;
    }
    case "WA": {
      if (price <= 120_000) return price * 0.019;
      if (price <= 150_000) return 2_280 + (price - 120_000) * 0.0285;
      if (price <= 360_000) return 3_135 + (price - 150_000) * 0.038;
      if (price <= 725_000) return 11_115 + (price - 360_000) * 0.0475;
      return 28_453 + (price - 725_000) * 0.0515;
    }
    default:
      return price * 0.04;
  }
}

interface LenderRate {
  lender: string;
  variable: number;
  fixed1yr: number;
  fixed2yr: number;
  fixed3yr: number;
  comparison: number;
}

const LENDER_RATES: LenderRate[] = [
  { lender: "Commonwealth Bank", variable: 6.49, fixed1yr: 5.99, fixed2yr: 6.09, fixed3yr: 6.19, comparison: 6.58 },
  { lender: "Westpac", variable: 6.44, fixed1yr: 5.89, fixed2yr: 6.04, fixed3yr: 6.14, comparison: 6.53 },
  { lender: "ANZ", variable: 6.39, fixed1yr: 5.94, fixed2yr: 6.14, fixed3yr: 6.24, comparison: 6.50 },
  { lender: "NAB", variable: 6.44, fixed1yr: 5.84, fixed2yr: 5.99, fixed3yr: 6.09, comparison: 6.54 },
];

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

  const title = `Mortgage Rates ${suburb.name} ${suburb.state} 2026 | Home Loan Rates & Comparison`;
  const description = `Compare mortgage rates for ${suburb.name}, ${suburb.state}. Median price ${formatCurrency(suburb.medianPrice)}, estimated repayments from ${formatCurrency(Math.round(calcRepayment(suburb.avgLoanSize, 5.84, 30)))}/mo. Stamp duty ~${formatCurrency(Math.round(estimateStampDuty(suburb.medianPrice, suburb.state)))}. Free comparison.`;

  return {
    title,
    description,
    keywords: [
      `mortgage rates ${suburb.name.toLowerCase()}`,
      `home loan ${suburb.name.toLowerCase()}`,
      `home loan rates ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
      `mortgage rates ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
      `${suburb.name.toLowerCase()} home loan comparison`,
      `best mortgage rate ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} property prices`,
      `stamp duty ${suburb.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Mortgage Rates ${suburb.name} 2026 | Compare Home Loan Rates`,
      description,
      type: "website",
    },
  };
}

export default async function SuburbMortgageRatesPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const depositPercent = Math.round((suburb.typicalDeposit / suburb.medianPrice) * 100);
  const stampDuty = Math.round(estimateStampDuty(suburb.medianPrice, suburb.state));
  const totalUpfront = suburb.typicalDeposit + stampDuty;

  const nearbySuburbs = (SUBURBS_BY_CITY[suburb.city] || []).filter((s) => s.slug !== slug);
  const otherCitySuburbs = SUBURBS.filter((s) => s.slug !== slug && s.city !== suburb.city).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Mortgage Rates ${suburb.name} 2026`,
    description: `Compare mortgage rates and estimated repayments for ${suburb.name}, ${suburb.state}. Median price ${formatCurrency(suburb.medianPrice)}.`,
    url: `https://au-calculators.vercel.app/mortgage-rates/${slug}`,
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
        name: `What are current mortgage rates for buying in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `As of March 2026, Big 4 bank variable rates for owner-occupier P&I loans range from 6.39% to 6.49%. For a property at the ${formatCurrency(suburb.medianPrice)} median in ${suburb.name}, borrowing ${formatCurrency(suburb.avgLoanSize)} (80% LVR), monthly repayments would range from ${formatCurrency(Math.round(calcRepayment(suburb.avgLoanSize, 6.39, 30)))} to ${formatCurrency(Math.round(calcRepayment(suburb.avgLoanSize, 6.49, 30)))} over 30 years.`,
        },
      },
      {
        "@type": "Question",
        name: `How much stamp duty will I pay in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on the ${formatCurrency(suburb.medianPrice)} median price in ${suburb.name}, ${suburb.state}, estimated stamp duty is approximately ${formatCurrency(stampDuty)}. First home buyers may qualify for stamp duty concessions or exemptions depending on the property price and state.`,
        },
      },
      {
        "@type": "Question",
        name: `What deposit do I need to buy in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A 20% deposit on the ${formatCurrency(suburb.medianPrice)} median price would be ${formatCurrency(suburb.typicalDeposit)}. Including stamp duty of ~${formatCurrency(stampDuty)}, total upfront costs would be approximately ${formatCurrency(totalUpfront)}. Deposits below 20% may require Lenders Mortgage Insurance (LMI).`,
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
            <Link href="/mortgage-rates" className="hover:text-blue-600 transition-colors">
              Mortgage Rates
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mortgage Rates {suburb.name} {suburb.state} 2026
          </h1>
          <p className="text-gray-600">
            Compare home loan rates and estimated repayments for {suburb.name},{" "}
            {suburb.state}. Based on the {formatCurrency(suburb.medianPrice)}{" "}
            median property price with estimated stamp duty and upfront costs.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Median Price</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(suburb.medianPrice)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">
                  Loan ({100 - depositPercent}% LVR)
                </p>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(suburb.avgLoanSize)}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">
                  Stamp Duty ({suburb.state})
                </p>
                <p className="text-lg font-bold text-amber-900">
                  {formatCurrency(stampDuty)}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-600 mb-1">Total Upfront</p>
                <p className="text-lg font-bold text-purple-900">
                  {formatCurrency(totalUpfront)}
                </p>
              </div>
            </div>

            {/* Repayment estimates at different rates */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Estimated Monthly Repayments — {suburb.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Based on borrowing {formatCurrency(suburb.avgLoanSize)} (
                {100 - depositPercent}% of median price) over 30 years, principal
                &amp; interest.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[5.5, 6.0, 6.5, 7.0].map((rate) => (
                  <div
                    key={rate}
                    className="bg-white border border-gray-200 rounded-xl p-4 text-center"
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      {rate.toFixed(1)}% rate
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(
                        Math.round(calcRepayment(suburb.avgLoanSize, rate, 30))
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">/month</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Lender rate comparison table */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Big 4 Bank Rate Comparison — {suburb.name}
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                          Lender
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          Variable
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          1yr Fixed
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          Monthly (Variable)
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          Monthly (1yr Fixed)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {LENDER_RATES.map((bank) => (
                        <tr
                          key={bank.lender}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {bank.lender}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {bank.variable.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-right">
                            {bank.fixed1yr.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-blue-700">
                            {formatCurrency(
                              Math.round(
                                calcRepayment(
                                  suburb.avgLoanSize,
                                  bank.variable,
                                  30
                                )
                              )
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-green-700">
                            {formatCurrency(
                              Math.round(
                                calcRepayment(
                                  suburb.avgLoanSize,
                                  bank.fixed1yr,
                                  30
                                )
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Rates are indicative only — owner-occupier P&amp;I, $250k+
                    loan. Always confirm with your lender. Last updated March
                    2026.
                  </p>
                </div>
              </div>
            </section>

            {/* Stamp duty breakdown */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Stamp Duty &amp; Upfront Costs — {suburb.name}, {suburb.state}
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property price (median)</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(suburb.medianPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Deposit ({depositPercent}%)
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(suburb.typicalDeposit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Estimated stamp duty ({suburb.state})
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(stampDuty)}
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-800">Total upfront cash needed</span>
                    <span className="text-blue-800">
                      {formatCurrency(totalUpfront)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan amount</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(suburb.avgLoanSize)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Stamp duty is estimated based on standard {suburb.state} rates
                  for established properties. First home buyers may qualify for
                  concessions. Additional costs (legal fees, inspections, LMI)
                  not included.
                </p>
              </div>
            </section>

            <AdUnit slot="below-results" format="horizontal" className="mt-8 mb-8" />

            {/* Suburb description & market insight */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Buying Property in {suburb.name}, {suburb.state}
              </h2>
              <p className="text-gray-600 mb-4">{suburb.description}</p>
              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Market Insight
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suburb.marketInsight}
                </p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Mortgage FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What are current mortgage rates for buying in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    As of March 2026, Big 4 bank variable rates range from 6.39%
                    to 6.49% for owner-occupier P&amp;I loans. For a property at
                    the {formatCurrency(suburb.medianPrice)} median in{" "}
                    {suburb.name}, borrowing{" "}
                    {formatCurrency(suburb.avgLoanSize)} (80% LVR), monthly
                    repayments would range from{" "}
                    {formatCurrency(
                      Math.round(calcRepayment(suburb.avgLoanSize, 6.39, 30))
                    )}{" "}
                    to{" "}
                    {formatCurrency(
                      Math.round(calcRepayment(suburb.avgLoanSize, 6.49, 30))
                    )}{" "}
                    over 30 years.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much stamp duty will I pay in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Based on the {formatCurrency(suburb.medianPrice)} median
                    price, estimated stamp duty in {suburb.state} is
                    approximately {formatCurrency(stampDuty)}. Combined with a{" "}
                    {depositPercent}% deposit of{" "}
                    {formatCurrency(suburb.typicalDeposit)}, total upfront costs
                    would be around {formatCurrency(totalUpfront)}. First home
                    buyers may qualify for stamp duty concessions in{" "}
                    {suburb.state}.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What deposit do I need to buy in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A standard 20% deposit on the{" "}
                    {formatCurrency(suburb.medianPrice)} median would be{" "}
                    {formatCurrency(suburb.typicalDeposit)}. Some lenders accept
                    5% deposits (
                    {formatCurrency(Math.round(suburb.medianPrice * 0.05))}),
                    but you&apos;ll need to pay Lenders Mortgage Insurance (LMI)
                    if your deposit is below 20%. LMI can add{" "}
                    {formatCurrency(Math.round(suburb.avgLoanSize * 0.02))}–
                    {formatCurrency(Math.round(suburb.avgLoanSize * 0.04))} to
                    your costs.
                  </p>
                </div>
              </div>
            </section>

            {/* Nearby suburb links */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Mortgage Rates in Nearby {suburb.city} Suburbs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/mortgage-rates"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    All Suburbs — Mortgage Rates
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {nearbySuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/mortgage-rates/${other.slug}`}
                    className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <div>
                      <span className="text-blue-600 font-medium">
                        {other.name} Rates
                      </span>
                      <span className="block text-xs text-gray-500">
                        Median {formatCurrency(other.medianPrice)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{other.state}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Other city suburbs */}
            {otherCitySuburbs.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  More Suburb Mortgage Rates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherCitySuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/mortgage-rates/${other.slug}`}
                      className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <div>
                        <span className="text-blue-600 font-medium">
                          {other.name} Rates
                        </span>
                        <span className="block text-xs text-gray-500">
                          Median {formatCurrency(other.medianPrice)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{other.state}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related calculators */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">
                Related Calculators
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href={`/calculators/mortgage-repayment/${slug}`}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    {suburb.name} Mortgage Calculator
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
                  href="/calculators/negative-gearing"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Negative Gearing Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar ad */}
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
