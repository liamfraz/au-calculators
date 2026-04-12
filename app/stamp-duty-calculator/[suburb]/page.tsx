import type { Metadata } from "next";
import StampDutyCalculator from "../../calculators/stamp-duty/calculator";
import { StateCode, STATE_NAMES } from "../../calculators/stamp-duty/constants";
import { SUBURBS, SLUG_TO_SUBURB, SUBURBS_BY_STATE } from "../suburbs/data";
import AdUnit from "../../components/AdUnit";
import Link from "next/link";

const SLUG_TO_STATE: Record<string, StateCode> = {
  nsw: "NSW", vic: "VIC", qld: "QLD", wa: "WA",
  sa: "SA", tas: "TAS", act: "ACT", nt: "NT",
};

const STATE_FHB_INFO: Record<StateCode, { threshold: string; note: string; rateRange: string }> = {
  NSW: { threshold: "$800,000", note: "Exempt up to $800K, reduced duty to $1M (new & existing homes)", rateRange: "1.25%–5.5%" },
  VIC: { threshold: "$600,000", note: "Exempt up to $600K, reduced duty $600K–$750K", rateRange: "1.4%–6.5%" },
  QLD: { threshold: "$700,000", note: "Exempt up to $700K for established; unlimited for new homes & vacant land (from May 2025)", rateRange: "1%–5.75%" },
  SA: { threshold: "No price cap", note: "Full exemption for new homes only — no price cap", rateRange: "1%–5.5%" },
  WA: { threshold: "$500,000", note: "Exempt up to $500K, reduced duty $500K–$700K", rateRange: "1.9%–5.15%" },
  TAS: { threshold: "$750,000", note: "Exempt up to $750K (until June 2026) — new & existing homes", rateRange: "1.75%–4.5%" },
  ACT: { threshold: "$1,020,000", note: "Exempt up to $1.02M — income test applies (household income under $160K)", rateRange: "0.28%–4.54%" },
  NT: { threshold: "N/A — grants only", note: "No stamp duty concession; up to $18,601 Territory Home Owner Discount + $50K HomeGrown grant for new homes", rateRange: "Formula–5.95%" },
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
  const stateSlugs = Object.keys(SLUG_TO_STATE).map((s) => ({ suburb: s }));
  const suburbSlugs = SUBURBS.map((s) => ({ suburb: s.slug }));
  return [...stateSlugs, ...suburbSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>;
}): Promise<Metadata> {
  const { suburb: slug } = await params;

  const stateCode = SLUG_TO_STATE[slug];
  if (stateCode) {
    const stateName = STATE_NAMES[stateCode];
    return {
      title: `${stateCode} Stamp Duty Calculator 2026 | ${stateName} Transfer Duty`,
      description: `Free ${stateName} stamp duty calculator. Calculate ${stateCode} transfer duty, first home buyer concessions, and total purchase costs using official 2025–2026 ${stateCode} rates.`,
      keywords: [
        `stamp duty calculator ${slug}`,
        `${slug} stamp duty 2026`,
        `${stateName.toLowerCase()} stamp duty calculator`,
        `${slug} transfer duty calculator`,
        `stamp duty ${slug} first home buyer`,
        `how much is stamp duty in ${stateCode}`,
        `${stateName.toLowerCase()} stamp duty rates 2026`,
      ],
      openGraph: {
        title: `${stateCode} Stamp Duty Calculator 2026 — ${stateName}`,
        description: `Calculate ${stateName} stamp duty with 2025–2026 official rates. See first home buyer concessions and total purchase costs.`,
        type: "website",
      },
      alternates: {
        canonical: `https://au-calculators.vercel.app/stamp-duty-calculator/${slug}`,
      },
    };
  }

  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return {};

  const fullState = STATE_NAMES[suburb.state];
  const title = `Stamp Duty Calculator ${suburb.name} ${suburb.state} 2026 | ${fullState} Transfer Duty`;
  const description = `Calculate stamp duty on a ${formatCurrency(suburb.medianPrice)} property in ${suburb.name}, ${suburb.state}. Free ${fullState} transfer duty calculator with first home buyer concessions and 2025-2026 rates.`;

  return {
    title,
    description,
    keywords: [
      `stamp duty ${suburb.name.toLowerCase()}`,
      `stamp duty calculator ${suburb.name.toLowerCase()}`,
      `stamp duty ${suburb.name.toLowerCase()} ${suburb.state.toLowerCase()}`,
      `how much is stamp duty in ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} stamp duty 2026`,
      `transfer duty ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} property transfer costs`,
      `first home buyer stamp duty ${suburb.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Stamp Duty Calculator ${suburb.name} 2026`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `https://au-calculators.vercel.app/stamp-duty-calculator/${slug}`,
    },
  };
}

export default async function SuburbStampDutyPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;

  // --- State page rendering ---
  const stateCode = SLUG_TO_STATE[slug];
  if (stateCode) {
    const stateName = STATE_NAMES[stateCode];
    const info = STATE_FHB_INFO[stateCode];
    const otherStates = Object.entries(SLUG_TO_STATE).filter(([s]) => s !== slug);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${stateCode} Stamp Duty Calculator 2026`,
      description: `Free ${stateName} stamp duty calculator with official 2025–2026 ${stateCode} transfer duty rates, first home buyer concessions, and total purchase cost breakdown.`,
      url: `https://au-calculators.vercel.app/stamp-duty-calculator/${slug}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
      author: { "@type": "Organization", name: "AU Calculators" },
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <nav className="text-sm text-gray-500 mb-3">
              <Link href="/stamp-duty-calculator" className="hover:text-blue-600 transition-colors">
                Stamp Duty Calculator
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">{stateName}</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {stateCode} Stamp Duty Calculator 2026
            </h1>
            <p className="text-gray-600">
              Calculate stamp duty (transfer duty) for {stateName} using official 2025–2026 rates.
              Select your buyer type and property type for accurate results including first home buyer concessions.
            </p>
          </div>

          <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <StampDutyCalculator initialState={stateCode} />

              <AdUnit slot="below-results" format="horizontal" className="mt-8" />

              <div className="border border-green-200 rounded-xl p-6 bg-green-50 mt-8">
                <h2 className="font-semibold text-gray-900 mb-2">
                  {stateCode} First Home Buyer Stamp Duty Concessions
                </h2>
                <p className="text-sm text-gray-700 mb-2">{info.note}</p>
                <p className="text-sm text-gray-600">
                  Exemption threshold: <strong>{info.threshold}</strong>. Toggle &quot;First Home Buyer&quot; in the calculator above to see your exact concession.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mt-6">
                <h2 className="font-semibold text-gray-900 mb-3">{stateName} Stamp Duty — Key Facts</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span><strong>Rate range:</strong> {info.rateRange} (progressive brackets)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span><strong>First home buyer exemption threshold:</strong> {info.threshold}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span><strong>Rates apply from:</strong> 1 July 2025 (2025–2026 financial year)</span>
                  </li>
                </ul>
                <Link
                  href={`/calculators/stamp-duty/${slug}`}
                  className="inline-block mt-4 text-sm text-blue-600 hover:underline"
                >
                  View full {stateCode} stamp duty brackets &amp; rates &rarr;
                </Link>
              </div>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Stamp Duty Calculators by State</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href="/stamp-duty-calculator"
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">All States — Stamp Duty Calculator</span>
                    <span className="text-gray-400 ml-auto">&rarr;</span>
                  </Link>
                  {otherStates.map(([otherSlug, otherCode]) => (
                    <Link
                      key={otherSlug}
                      href={`/stamp-duty-calculator/${otherSlug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">{otherCode} Stamp Duty Calculator</span>
                      <span className="text-gray-400 ml-auto">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

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

  // --- Suburb page rendering ---
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const fullState = STATE_NAMES[suburb.state];

  // Nearby suburbs: same state first, then from nearbySuburbs list
  const sameStateSuburbs = (SUBURBS_BY_STATE[suburb.state] || []).filter(
    (s) => s.slug !== slug
  );
  const nearbyFromOtherStates = suburb.nearbySuburbs
    .map((s) => SLUG_TO_SUBURB[s])
    .filter((s) => s && s.state !== suburb.state);
  const linkedSuburbs = [...sameStateSuburbs, ...nearbyFromOtherStates].slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Stamp Duty Calculator ${suburb.name}, ${suburb.state} 2026`,
    description: `Free stamp duty calculator for ${suburb.name}, ${fullState}. Pre-filled with the ${formatCurrency(suburb.medianPrice)} median property price. Calculate transfer duty, first home buyer concessions, and total purchase costs.`,
    url: `https://au-calculators.vercel.app/stamp-duty-calculator/${slug}`,
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
          text: `Stamp duty in ${suburb.name}, ${suburb.state} depends on the property price, type, and whether you're a first home buyer. Based on the median property price of ${formatCurrency(suburb.medianPrice)}, ${fullState} stamp duty rates apply. Use the calculator above to get an exact figure for your purchase price.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the median house price in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The approximate median property price in ${suburb.name}, ${suburb.state} is ${formatCurrency(suburb.medianPrice)} as of 2025-2026. ${suburb.marketInsight}`,
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
              href="/stamp-duty-calculator"
              className="hover:text-blue-600 transition-colors"
            >
              Stamp Duty Calculator
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Stamp Duty Calculator {suburb.name} {suburb.state} 2026
          </h1>
          <p className="text-gray-600">
            Calculate stamp duty on property in {suburb.name},{" "}
            {fullState}. Pre-filled with the{" "}
            {formatCurrency(suburb.medianPrice)} median property price — adjust
            the value, property type, and buyer status to match your scenario.
          </p>
        </div>

        {/* Ad: Above calculator */}
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
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-600 mb-1">State</p>
                <p className="text-lg font-bold text-purple-900">
                  {suburb.state}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">Postcode</p>
                <p className="text-lg font-bold text-amber-900">
                  {suburb.postcode}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">FHB Concessions</p>
                <p className="text-lg font-bold text-green-900">Available</p>
              </div>
            </div>

            <StampDutyCalculator
              initialState={suburb.state}
              defaultPropertyValue={suburb.medianPrice}
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
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Median property price:</strong>{" "}
                      {formatCurrency(suburb.medianPrice)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Postcode:</strong> {suburb.postcode}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>State:</strong> {fullState} ({suburb.state})
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Stamp duty rates:</strong> {suburb.state} rates
                      apply — use the calculator above for exact figures
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
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
                    {formatCurrency(suburb.medianPrice)}, you can use the
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
                    {suburb.state} is {formatCurrency(suburb.medianPrice)} as of
                    2025-2026. {suburb.marketInsight}
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
                More Stamp Duty Calculators by Suburb
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/stamp-duty-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    General Stamp Duty Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {linkedSuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/stamp-duty-calculator/${other.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      Stamp Duty {other.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {other.state}
                    </span>
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
