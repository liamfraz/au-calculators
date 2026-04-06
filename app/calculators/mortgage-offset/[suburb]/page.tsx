import type { Metadata } from "next";
import MortgageOffsetCalculator from "../../../mortgage-offset-calculator/calculator";
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

  const title = `Mortgage Offset Calculator ${suburb.name}, ${suburb.state} 2026 | See Your Savings`;
  const description = `Calculate mortgage offset savings in ${suburb.name}. Median house price ${formatCurrency(suburb.medianPrice)}, typical loan ${formatCurrency(suburb.typicalLoan)}. See how much interest you save with an offset account on a ${suburb.name} home loan.`;

  return {
    title,
    description,
    keywords: [
      `mortgage offset calculator ${suburb.name.toLowerCase()}`,
      `offset account savings ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} home loan offset`,
      `mortgage offset ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
      `offset account ${suburb.name.toLowerCase()}`,
      `home loan savings ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} mortgage interest saved`,
    ],
    openGraph: {
      title: `Mortgage Offset Calculator ${suburb.name} 2026`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `https://au-calculators.vercel.app/calculators/mortgage-offset/${slug}`,
    },
  };
}

export default async function SuburbMortgageOffsetPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const annualInterestSaved = Math.round(
    suburb.typicalOffset * 0.065
  );
  const totalInterestSavedEstimate = Math.round(annualInterestSaved * 15);
  const nearbySuburbs = (SUBURBS_BY_CITY[suburb.city] || []).filter(
    (s) => s.slug !== slug
  );
  const otherCitySuburbs = SUBURBS.filter(
    (s) => s.slug !== slug && s.city !== suburb.city
  ).slice(0, 8);

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
        name: "Mortgage Offset Calculator",
        item: "https://au-calculators.vercel.app/calculators/mortgage-offset",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${suburb.name}, ${suburb.state}`,
        item: `https://au-calculators.vercel.app/calculators/mortgage-offset/${slug}`,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Mortgage Offset Calculator ${suburb.name} 2026`,
    description: `Free mortgage offset calculator for ${suburb.name}, ${suburb.state}. Calculate interest savings with an offset account on a ${suburb.name} home loan.`,
    url: `https://au-calculators.vercel.app/calculators/mortgage-offset/${slug}`,
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
        name: `How much can an offset account save on a ${suburb.name} mortgage?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `With a typical ${suburb.name} home loan of ${formatCurrency(suburb.typicalLoan)} and an offset balance of ${formatCurrency(suburb.typicalOffset)}, you can save approximately ${formatCurrency(annualInterestSaved)} per year in interest at 6.5%. Over the life of the loan, total savings can exceed ${formatCurrency(totalInterestSavedEstimate)}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the median house price in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The median house price in ${suburb.name}, ${suburb.state} is approximately ${formatCurrency(suburb.medianPrice)} as of 2026. With a typical 20% deposit, this means a home loan of around ${formatCurrency(suburb.typicalLoan)}.`,
        },
      },
      {
        "@type": "Question",
        name: `Is a mortgage offset account worth it in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes — at ${suburb.name} property prices, offset accounts are highly valuable. Even a modest offset balance of ${formatCurrency(Math.round(suburb.typicalOffset * 0.3))} saves approximately ${formatCurrency(Math.round(suburb.typicalOffset * 0.3 * 0.065))} per year in interest, which easily exceeds any annual package fees of $0-$395.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
            <Link
              href="/mortgage-offset-calculator"
              className="hover:text-blue-600 transition-colors"
            >
              Mortgage Offset Calculator
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mortgage Offset Calculator for {suburb.name}, {suburb.state}
          </h1>
          <p className="text-gray-600">
            Calculate how much interest you can save with a mortgage offset
            account on a {suburb.name} home loan. Pre-filled with local median
            values — adjust to match your situation.
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
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(suburb.medianPrice)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Typical Loan</p>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(suburb.typicalLoan)}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">
                  Est. Annual Saving
                </p>
                <p className="text-lg font-bold text-amber-900">
                  {formatCurrency(annualInterestSaved)}
                </p>
              </div>
            </div>

            <MortgageOffsetCalculator
              defaultLoanAmount={suburb.typicalLoan}
              defaultOffsetBalance={suburb.typicalOffset}
            />

            {/* Ad: Below results */}
            <AdUnit
              slot="below-results"
              format="horizontal"
              className="mt-8"
            />

            {/* Suburb-specific content */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mortgage Offset Savings in {suburb.name}, {suburb.state}
              </h2>
              <p className="text-gray-600 mb-4">{suburb.description}</p>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {suburb.name} Property &amp; Offset Snapshot
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Median house price:</strong>{" "}
                      {formatCurrency(suburb.medianPrice)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Typical loan (80% LVR):</strong>{" "}
                      {formatCurrency(suburb.typicalLoan)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Typical offset balance:</strong>{" "}
                      {formatCurrency(suburb.typicalOffset)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Est. annual interest saved:</strong>{" "}
                      {formatCurrency(annualInterestSaved)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Est. total interest saved (15 yrs):</strong>{" "}
                      {formatCurrency(totalInterestSavedEstimate)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Tax-free equivalent return:</strong> ~10.3% (at 37%
                      marginal rate)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {suburb.name} Offset Strategy Tip
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suburb.marketInsight}
                </p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Mortgage Offset FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much can an offset account save on a {suburb.name}{" "}
                    mortgage?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    With a typical {suburb.name} home loan of{" "}
                    {formatCurrency(suburb.typicalLoan)} and an offset balance of{" "}
                    {formatCurrency(suburb.typicalOffset)}, you can save
                    approximately {formatCurrency(annualInterestSaved)} per year
                    in interest at 6.5%. Over the life of the loan, total savings
                    can exceed {formatCurrency(totalInterestSavedEstimate)}. The
                    higher the loan amount, the more valuable every dollar in
                    your offset becomes.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the median house price in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The median house price in {suburb.name}, {suburb.state} is
                    approximately {formatCurrency(suburb.medianPrice)} as of
                    2026. With a typical 20% deposit of{" "}
                    {formatCurrency(suburb.medianPrice - suburb.typicalLoan)},
                    this means a home loan of around{" "}
                    {formatCurrency(suburb.typicalLoan)}. Use the calculator
                    above to see how an offset account reduces interest on this
                    loan size.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is a mortgage offset account worth it in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    At {suburb.name} property prices, offset accounts are
                    extremely valuable. Even a modest offset balance of{" "}
                    {formatCurrency(Math.round(suburb.typicalOffset * 0.3))}{" "}
                    saves approximately{" "}
                    {formatCurrency(
                      Math.round(suburb.typicalOffset * 0.3 * 0.065)
                    )}{" "}
                    per year in interest — well above any annual package fee of
                    $0-$395. The larger your {suburb.name} mortgage, the more
                    impactful the offset becomes.
                  </p>
                </div>
              </div>
            </section>

            {/* Internal links: nearby suburbs */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nearby {suburb.city} Offset Calculators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/mortgage-offset-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    General Mortgage Offset Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {nearbySuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/calculators/mortgage-offset/${other.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {other.name} Offset Calculator
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatCurrency(other.medianPrice)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Other suburb calculators */}
            {otherCitySuburbs.length > 0 && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  More Suburb Offset Calculators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherCitySuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/calculators/mortgage-offset/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        {other.name} Offset Calculator
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {other.state}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related calculators */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">
                Related Calculators
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/mortgage-offset-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Mortgage Offset Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
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
                  href="/stamp-duty-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Stamp Duty Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/negative-gearing-calculator"
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
