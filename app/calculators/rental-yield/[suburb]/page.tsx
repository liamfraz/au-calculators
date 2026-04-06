import type { Metadata } from "next";
import RentalYieldCalculator from "../calculator";
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

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
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

  const title = `Rental Yield Calculator ${suburb.name}, ${suburb.state} 2026`;
  const description = `Calculate rental yield in ${suburb.name}, ${suburb.state}. Median price ${formatCurrency(suburb.medianPrice)}, average rent $${suburb.averageWeeklyRent}/week, gross yield ${formatPercent(suburb.grossYield)}. Free investment property calculator for ${suburb.name}.`;

  return {
    title,
    description,
    keywords: [
      `rental yield ${suburb.name.toLowerCase()} 2026`,
      `rental yield calculator ${suburb.name.toLowerCase()}`,
      `investment property ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} rental yield`,
      `${suburb.name.toLowerCase()} rental return`,
      `${suburb.name.toLowerCase()} investment property yield`,
      `rental yield ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
    ],
    openGraph: {
      title: `Rental Yield Calculator ${suburb.name} ${suburb.state} 2026`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `https://au-calculators.vercel.app/calculators/rental-yield/${slug}`,
    },
  };
}

export default async function SuburbRentalYieldPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const annualRent = suburb.averageWeeklyRent * 52;
  const netYieldEstimate = suburb.grossYield - 1.5;
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
        name: "Rental Yield Calculator",
        item: "https://au-calculators.vercel.app/calculators/rental-yield",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${suburb.name}, ${suburb.state}`,
        item: `https://au-calculators.vercel.app/calculators/rental-yield/${slug}`,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Rental Yield Calculator ${suburb.name} 2026`,
    description: `Free rental yield calculator for ${suburb.name}, ${suburb.state}. Calculate gross and net rental yield with local median values pre-filled.`,
    url: `https://au-calculators.vercel.app/calculators/rental-yield/${slug}`,
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
        name: `What is the rental yield in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The average gross rental yield in ${suburb.name}, ${suburb.state} is approximately ${formatPercent(suburb.grossYield)} based on a median property price of ${formatCurrency(suburb.medianPrice)} and average weekly rent of $${suburb.averageWeeklyRent}. Net yield after expenses is typically around ${formatPercent(netYieldEstimate)}.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${suburb.name} a good suburb for investment property?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${suburb.name} offers a gross rental yield of ${formatPercent(suburb.grossYield)}, which is ${suburb.grossYield >= 4 ? "above" : "around"} the national average. ${suburb.investmentInsight}`,
        },
      },
      {
        "@type": "Question",
        name: `What is the median property price in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The median property price in ${suburb.name}, ${suburb.state} is approximately ${formatCurrency(suburb.medianPrice)} as of 2026. With an average weekly rent of $${suburb.averageWeeklyRent}, this translates to annual rental income of ${formatCurrency(annualRent)}.`,
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
              href="/calculators/rental-yield"
              className="hover:text-blue-600 transition-colors"
            >
              Rental Yield Calculator
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rental Yield Calculator for {suburb.name}, {suburb.state}
          </h1>
          <p className="text-gray-600">
            Calculate rental yield for investment properties in {suburb.name}.
            Pre-filled with local median values — adjust to match your property.
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
                <p className="text-xs text-green-600 mb-1">Avg Weekly Rent</p>
                <p className="text-lg font-bold text-green-900">
                  ${suburb.averageWeeklyRent}/wk
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">Gross Yield</p>
                <p className="text-lg font-bold text-amber-900">
                  {formatPercent(suburb.grossYield)}
                </p>
              </div>
            </div>

            <RentalYieldCalculator
              defaultPurchasePrice={suburb.medianPrice}
              defaultWeeklyRent={suburb.averageWeeklyRent}
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
                Rental Yield in {suburb.name}, {suburb.state}
              </h2>
              <p className="text-gray-600 mb-4">{suburb.description}</p>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {suburb.name} Investment Snapshot
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Median property price:</strong>{" "}
                      {formatCurrency(suburb.medianPrice)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Average weekly rent:</strong> $
                      {suburb.averageWeeklyRent}/week
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Annual rental income:</strong>{" "}
                      {formatCurrency(annualRent)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Gross rental yield:</strong>{" "}
                      {formatPercent(suburb.grossYield)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Est. net yield (after expenses):</strong>{" "}
                      {formatPercent(netYieldEstimate)}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {suburb.name} Investment Insight
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suburb.investmentInsight}
                </p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Rental Yield FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the rental yield in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The average gross rental yield in {suburb.name},{" "}
                    {suburb.state} is approximately{" "}
                    {formatPercent(suburb.grossYield)} based on a median
                    property price of {formatCurrency(suburb.medianPrice)} and
                    average weekly rent of ${suburb.averageWeeklyRent}. After
                    deducting typical expenses (council rates, insurance,
                    maintenance, management fees), the net yield is estimated at{" "}
                    {formatPercent(netYieldEstimate)}.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is {suburb.name} a good suburb for investment property?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {suburb.name} offers a gross rental yield of{" "}
                    {formatPercent(suburb.grossYield)}, which is{" "}
                    {suburb.grossYield >= 4.5
                      ? "well above"
                      : suburb.grossYield >= 4
                        ? "above"
                        : "around"}{" "}
                    the national metropolitan average of 3.5-4%.{" "}
                    {suburb.investmentInsight}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the median property price in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The median property price in {suburb.name}, {suburb.state}{" "}
                    is approximately {formatCurrency(suburb.medianPrice)} as of
                    2026. With an average weekly rent of $
                    {suburb.averageWeeklyRent}, this translates to annual rental
                    income of {formatCurrency(annualRent)}. Use the calculator
                    above to see how different rent levels and expenses affect
                    your yield.
                  </p>
                </div>
              </div>
            </section>

            {/* Internal links: nearby suburbs */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nearby {suburb.city} Rental Yield Calculators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/rental-yield"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    General Rental Yield Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {nearbySuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/calculators/rental-yield/${other.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {other.name} Rental Yield
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatPercent(other.grossYield)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Other suburb calculators */}
            {otherCitySuburbs.length > 0 && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  More Suburb Rental Yield Calculators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherCitySuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/calculators/rental-yield/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        {other.name} Rental Yield
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
                  href="/calculators/rental-yield"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Rental Yield Calculator
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
                  href="/stamp-duty-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Stamp Duty Calculator
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
