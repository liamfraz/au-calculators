import type { Metadata } from "next";
import CarLoanCalculator from "../calculator";
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

function calcMonthlyRepayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  return Math.round((principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1));
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

  const title = `Car Loan Calculator ${suburb.name} - Compare Rates ${suburb.state} 2026`;
  const description = `Calculate car loan repayments in ${suburb.name}, ${suburb.state}. Average car price ${formatCurrency(suburb.avgCarPrice)}. Compare secured vs unsecured rates, balloon payments, and local dealer finance options. Free ${suburb.name} car loan calculator.`;

  return {
    title,
    description,
    keywords: [
      `car loan calculator ${suburb.name.toLowerCase()}`,
      `car finance ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} car dealers`,
      `car loan rates ${suburb.name.toLowerCase()}`,
      `vehicle finance ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
      `car loan repayments ${suburb.name.toLowerCase()}`,
      `buy a car ${suburb.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Car Loan Calculator ${suburb.name} 2026`,
      description,
      type: "website",
    },
  };
}

export default async function SuburbCarLoanPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const monthlyRepayment = calcMonthlyRepayment(suburb.avgCarPrice, 0.07, 5);
  const totalInterest = monthlyRepayment * 60 - suburb.avgCarPrice;
  const nearbySuburbs = (SUBURBS_BY_CITY[suburb.city] || []).filter((s) => s.slug !== slug);
  const otherSuburbs = SUBURBS.filter((s) => s.slug !== slug && s.city !== suburb.city).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Car Loan Calculator ${suburb.name} 2026`,
    description: `Free car loan calculator for ${suburb.name}, ${suburb.state}. Calculate vehicle finance repayments, compare rates, and explore local dealer options.`,
    url: `https://au-calculators.vercel.app/calculators/car-loan/${slug}`,
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
        name: `How much are car loan repayments in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on the average car price of ${formatCurrency(suburb.avgCarPrice)} in ${suburb.name}, with a 7% interest rate over 5 years, monthly repayments would be approximately ${formatCurrency(monthlyRepayment)}. Total interest paid would be around ${formatCurrency(totalInterest)}.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I get car finance in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${suburb.name} car buyers can access finance from major banks (CBA, ANZ, Westpac, NAB), local credit unions, online lenders, and dealer finance at ${suburb.popularDealers.join(", ")}. Always compare at least 3 quotes and get pre-approval before visiting dealers.`,
        },
      },
      {
        "@type": "Question",
        name: `Should I get dealer finance or a bank car loan in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Banks and credit unions typically offer lower rates (5-8%) compared to dealer finance (7-12%) in ${suburb.name}. Get pre-approved from your bank first, then use that as leverage when negotiating with ${suburb.popularDealers[0]}. ${suburb.localInsight}`,
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
            <Link href="/calculators/car-loan" className="hover:text-blue-600 transition-colors">
              Car Loan Calculator
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Car Loan Calculator {suburb.name} - Compare Rates
          </h1>
          <p className="text-gray-600">
            Calculate car loan repayments for vehicles in {suburb.name}, {suburb.state}. Pre-filled
            with the {formatCurrency(suburb.avgCarPrice)} average car price — adjust the loan
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
                <p className="text-xs text-blue-600 mb-1">Avg Car Price</p>
                <p className="text-lg font-bold text-blue-900">{formatCurrency(suburb.avgCarPrice)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Monthly @ 7%</p>
                <p className="text-lg font-bold text-green-900">{formatCurrency(monthlyRepayment)}/mo</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">Total Interest</p>
                <p className="text-lg font-bold text-amber-900">{formatCurrency(totalInterest)}</p>
              </div>
            </div>

            <CarLoanCalculator />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />

            {/* Suburb-specific content */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Car Finance in {suburb.name}, {suburb.state}
              </h2>
              <p className="text-gray-600 mb-4">{suburb.description}</p>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {suburb.name} Car Loan Snapshot
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Average car price:</strong> {formatCurrency(suburb.avgCarPrice)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Monthly repayment (7%, 5yr):</strong> {formatCurrency(monthlyRepayment)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Total interest (5yr):</strong> {formatCurrency(totalInterest)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Popular dealers:</strong> {suburb.popularDealers.join(", ")}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Local Tip</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{suburb.localInsight}</p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Car Loan FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much are car loan repayments in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Based on the average car price of {formatCurrency(suburb.avgCarPrice)} in {suburb.name}, with
                    a 7% interest rate over 5 years, monthly repayments would be
                    approximately {formatCurrency(monthlyRepayment)}. You&apos;d pay around {formatCurrency(totalInterest)} in
                    total interest, making the total cost {formatCurrency(suburb.avgCarPrice + totalInterest)}.
                    Use the calculator above to adjust the rate and term to match your situation.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Where can I get car finance in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {suburb.name} car buyers can access finance from the big-4 banks (CBA, ANZ, Westpac, NAB),
                    local credit unions, online lenders like Plenti and SocietyOne, and dealer finance
                    at {suburb.popularDealers.join(", ")}. Always compare at least 3 quotes and get bank
                    pre-approval before visiting dealers to strengthen your negotiating position.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Should I get dealer finance or a bank car loan in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Banks and credit unions typically offer lower rates (5-8%) compared to dealer
                    finance (7-12%) in {suburb.name}. Get pre-approved from your bank first, then use
                    that as leverage when negotiating with local dealers. Always check the comparison
                    rate, not just the headline rate — it includes fees and gives a truer picture of the cost.
                  </p>
                </div>
              </div>
            </section>

            {/* Internal links: nearby suburbs */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nearby {suburb.city} Car Loan Calculators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/car-loan"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    General Car Loan Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {nearbySuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/calculators/car-loan/${other.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {other.name} Car Loan Calculator
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{other.state}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Other suburb calculators */}
            {otherSuburbs.length > 0 && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  More Suburb Calculators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherSuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/calculators/car-loan/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        {other.name} Car Loan Calculator
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
                  href="/calculators/car-loan"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Car Loan Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/mortgage-repayment"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Mortgage Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/compound-interest"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Compound Interest Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/stamp-duty"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
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
