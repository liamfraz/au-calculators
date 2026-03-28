import type { Metadata } from "next";
import StampDutyCalculator from "../../calculator";
import { StateCode, STATE_NAMES } from "../../constants";
import { SUBURBS, SLUG_TO_SUBURB } from "../../suburbs";
import AdUnit from "../../../../components/AdUnit";
import Link from "next/link";

const SLUG_TO_CODE: Record<string, StateCode> = {
  nsw: "NSW", vic: "VIC", qld: "QLD", wa: "WA",
  sa: "SA", tas: "TAS", act: "ACT", nt: "NT",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateStaticParams() {
  return SUBURBS.map((s) => ({
    state: s.state.toLowerCase(),
    suburb: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; suburb: string }>;
}): Promise<Metadata> {
  const { suburb: slug, state: stateSlug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  const stateCode = SLUG_TO_CODE[stateSlug];
  if (!suburb || !stateCode || suburb.state !== stateCode) return {};

  const fullState = STATE_NAMES[suburb.state];
  const title = `Stamp Duty Calculator ${suburb.name}, ${suburb.state} 2026 | ${fullState} Transfer Duty`;
  const description = `Calculate stamp duty on a ${formatCurrency(suburb.medianPrice)} property in ${suburb.name}, ${suburb.state}. Free ${fullState} transfer duty calculator with first home buyer concessions and 2025–2026 rates.`;

  return {
    title,
    description,
    keywords: [
      `stamp duty calculator ${suburb.name.toLowerCase()}`,
      `stamp duty ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
      `how much is stamp duty in ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} stamp duty 2026`,
      `transfer duty ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} property transfer costs`,
      `stamp duty on ${formatCurrency(suburb.medianPrice)} property ${suburb.state.toLowerCase()}`,
      `first home buyer stamp duty ${suburb.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Stamp Duty Calculator ${suburb.name} 2026`,
      description,
      type: "website",
    },
  };
}

export default async function SuburbStampDutyPage({
  params,
}: {
  params: Promise<{ state: string; suburb: string }>;
}) {
  const { suburb: slug, state: stateSlug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  const stateCode = SLUG_TO_CODE[stateSlug];
  if (!suburb || !stateCode || suburb.state !== stateCode) return null;

  const fullState = STATE_NAMES[suburb.state];
  const medianPrice = suburb.medianPrice;

  // Get nearby suburbs for internal linking
  const nearbySuburbs = suburb.nearbySuburbs
    .map((s) => SLUG_TO_SUBURB[s])
    .filter(Boolean);

  // Get other suburbs in the same state (excluding current)
  const sameStateSuburbs = SUBURBS.filter(
    (s) => s.state === suburb.state && s.slug !== slug
  );

  // Combine: same-state suburbs first, then nearby from other states
  const linkedSuburbs = [
    ...sameStateSuburbs,
    ...nearbySuburbs.filter((s) => s.state !== suburb.state),
  ].slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Stamp Duty Calculator ${suburb.name}, ${suburb.state} 2026`,
    description: `Free stamp duty calculator for ${suburb.name}, ${fullState}. Pre-filled with the ${formatCurrency(medianPrice)} median property price. Calculate transfer duty, first home buyer concessions, and total purchase costs.`,
    url: `https://au-calculators.vercel.app/calculators/stamp-duty/${stateSlug}/${slug}`,
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
        name: `How much is stamp duty in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Stamp duty in ${suburb.name}, ${suburb.state} depends on the property price, type, and whether you're a first home buyer. Based on the median property price of ${formatCurrency(medianPrice)}, ${fullState} stamp duty rates apply. Use the calculator above to get an exact figure for your purchase price.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the median house price in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The approximate median property price in ${suburb.name}, ${suburb.state} is ${formatCurrency(medianPrice)} as of 2025–2026. ${suburb.marketInsight}`,
        },
      },
      {
        "@type": "Question",
        name: `Do first home buyers pay stamp duty in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `First home buyer stamp duty concessions in ${suburb.name} are determined by ${fullState} (${suburb.state}) state government policy. Depending on the property price, first home buyers may be eligible for reduced or zero stamp duty. Use the calculator above and toggle "First Home Buyer" to see your specific concession.`,
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
            <Link
              href="/calculators/stamp-duty"
              className="hover:text-blue-600 transition-colors"
            >
              Stamp Duty Calculator
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/calculators/stamp-duty/${stateSlug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {suburb.state}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Stamp Duty Calculator {suburb.name}, {suburb.state}
          </h1>
          <p className="text-gray-600">
            Calculate stamp duty on property in {suburb.name},{" "}
            {fullState}. Pre-filled with the{" "}
            {formatCurrency(medianPrice)} median property price — adjust
            the value, property type, and buyer status to match your
            scenario.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Median Price</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(medianPrice)}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-600 mb-1">State</p>
                <p className="text-lg font-bold text-purple-900">
                  {suburb.state}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                <p className="text-xs text-green-600 mb-1">
                  FHB Concessions
                </p>
                <p className="text-lg font-bold text-green-900">Available</p>
              </div>
            </div>

            <StampDutyCalculator
              initialState={suburb.state}
              defaultPropertyValue={medianPrice}
            />

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
                  {suburb.name} Property Snapshot
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Median property price:</strong>{" "}
                      {formatCurrency(medianPrice)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>State:</strong> {fullState} ({suburb.state})
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Stamp duty rates:</strong> {suburb.state} rates
                      apply — use the calculator above for exact figures
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>First home buyer concessions:</strong> Available
                      under {suburb.state} government scheme
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Market Insight
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suburb.marketInsight}
                </p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Stamp Duty FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much is stamp duty in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Stamp duty in {suburb.name} is calculated using{" "}
                    {fullState} ({suburb.state}) transfer duty rates. Based on
                    the median property price of{" "}
                    {formatCurrency(medianPrice)}, you can use the
                    calculator above to get an exact stamp duty figure. The
                    amount varies depending on the property type (primary
                    residence, investment, or vacant land) and whether
                    you&apos;re a first home buyer.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the median house price in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The approximate median property price in {suburb.name},{" "}
                    {suburb.state} is {formatCurrency(medianPrice)} as of
                    2025–2026. {suburb.marketInsight}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do first home buyers pay stamp duty in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    First home buyer stamp duty concessions in {suburb.name} are
                    determined by the {fullState} government. Depending on the
                    property price and type, first home buyers may be eligible
                    for reduced or zero stamp duty. Toggle the &quot;First Home
                    Buyer&quot; option in the calculator above to see your
                    specific concession for any property value.
                  </p>
                </div>
              </div>
            </section>

            {/* Internal links to other suburb calculators */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Stamp Duty Calculators by Suburb
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/stamp-duty"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    General Stamp Duty Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href={`/calculators/stamp-duty/${stateSlug}`}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    {suburb.state} Stamp Duty Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {linkedSuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/calculators/stamp-duty/${other.state.toLowerCase()}/${other.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {other.name} Stamp Duty Calculator
                    </span>
                    <span className="text-gray-400 ml-auto">&rarr;</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Related calculators */}
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
                <Link
                  href="/calculators/land-tax"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Land Tax Calculator
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
