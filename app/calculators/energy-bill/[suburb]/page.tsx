import type { Metadata } from "next";
import EnergyBillCalculator from "../calculator";
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

  const title = `Electricity Bill Calculator ${suburb.name} - Compare Rates ${suburb.state} 2026`;
  const description = `Calculate your electricity bill in ${suburb.name}, ${suburb.state}. Average quarterly bill ${formatCurrency(suburb.avgQuarterlyBill)} at ${suburb.avgRateCentsKwh}c/kWh. Compare ${suburb.localRetailers.slice(0, 3).join(", ")} rates. Free ${suburb.name} energy calculator.`;

  return {
    title,
    description,
    keywords: [
      `electricity bill calculator ${suburb.name.toLowerCase()}`,
      `energy rates ${suburb.name.toLowerCase()}`,
      `electricity cost ${suburb.name.toLowerCase()}`,
      `compare energy plans ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} electricity prices ${suburb.state.toLowerCase()}`,
      `power bill ${suburb.name.toLowerCase()}`,
      `cheapest electricity ${suburb.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Electricity Bill Calculator ${suburb.name} 2026`,
      description,
      type: "website",
    },
  };
}

export default async function SuburbEnergyBillPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const annualCost = suburb.avgQuarterlyBill * 4;
  const dailyCost = Math.round((suburb.avgDailyUsageKwh * suburb.avgRateCentsKwh) / 100 * 100) / 100;
  const nearbySuburbs = (SUBURBS_BY_CITY[suburb.city] || []).filter((s) => s.slug !== slug);
  const otherSuburbs = SUBURBS.filter((s) => s.slug !== slug && s.city !== suburb.city).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Electricity Bill Calculator ${suburb.name} 2026`,
    description: `Free electricity bill calculator for ${suburb.name}, ${suburb.state}. Estimate quarterly costs, compare energy retailers, and find savings.`,
    url: `https://au-calculators.vercel.app/calculators/energy-bill/${slug}`,
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
        name: `How much is the average electricity bill in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The average quarterly electricity bill in ${suburb.name}, ${suburb.state} is approximately ${formatCurrency(suburb.avgQuarterlyBill)}, based on average usage of ${suburb.avgDailyUsageKwh} kWh/day at ${suburb.avgRateCentsKwh}c/kWh. Annual electricity costs average around ${formatCurrency(annualCost)}.`,
        },
      },
      {
        "@type": "Question",
        name: `Which electricity providers are available in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${suburb.name} residents can choose from several energy retailers including ${suburb.localRetailers.join(", ")}. Compare plans on the government's Energy Made Easy website to find the best deal for your usage pattern.`,
        },
      },
      {
        "@type": "Question",
        name: `How can I reduce my electricity bill in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${suburb.name} households can reduce electricity bills by comparing retailer plans (potential savings of $200-$400/year), switching to LED lighting, using timers on hot water systems, and considering solar panels. ${suburb.localInsight}`,
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
            <Link href="/calculators/energy-bill" className="hover:text-blue-600 transition-colors">
              Electricity Bill Calculator
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Electricity Bill Calculator {suburb.name} - Compare Rates
          </h1>
          <p className="text-gray-600">
            Estimate your electricity bill in {suburb.name}, {suburb.state}. Pre-filled
            with local average usage of {suburb.avgDailyUsageKwh} kWh/day at {suburb.avgRateCentsKwh}c/kWh —
            adjust to match your household.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Key stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Avg Quarterly Bill</p>
                <p className="text-lg font-bold text-blue-900">{formatCurrency(suburb.avgQuarterlyBill)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Daily Usage</p>
                <p className="text-lg font-bold text-green-900">{suburb.avgDailyUsageKwh} kWh</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">Avg Rate</p>
                <p className="text-lg font-bold text-amber-900">{suburb.avgRateCentsKwh}c/kWh</p>
              </div>
            </div>

            <EnergyBillCalculator />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />

            {/* Suburb-specific content */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Electricity Costs in {suburb.name}, {suburb.state}
              </h2>
              <p className="text-gray-600 mb-4">{suburb.description}</p>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {suburb.name} Electricity Snapshot
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Average quarterly bill:</strong> {formatCurrency(suburb.avgQuarterlyBill)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Average daily usage:</strong> {suburb.avgDailyUsageKwh} kWh/day
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Average rate:</strong> {suburb.avgRateCentsKwh}c/kWh
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Daily electricity cost:</strong> ~${dailyCost.toFixed(2)}/day
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Estimated annual cost:</strong> {formatCurrency(annualCost)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Local retailers:</strong> {suburb.localRetailers.join(", ")}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Local Energy Tip</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{suburb.localInsight}</p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Electricity Bill FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much is the average electricity bill in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The average quarterly electricity bill in {suburb.name} is
                    approximately {formatCurrency(suburb.avgQuarterlyBill)}, based on typical household
                    usage of {suburb.avgDailyUsageKwh} kWh per day at the {suburb.state} average
                    rate of {suburb.avgRateCentsKwh}c/kWh. That works out to
                    around ${dailyCost.toFixed(2)} per day or {formatCurrency(annualCost)} per year.
                    Use the calculator above to estimate your bill based on your actual usage.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Which electricity providers are available in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {suburb.name} residents can choose from several energy retailers
                    including {suburb.localRetailers.join(", ")}. Rates and plans vary significantly
                    between providers — comparing at least 3 offers can save $200-$400 per year.
                    Use the government&apos;s Energy Made Easy website or your state&apos;s energy
                    comparison tool to find the cheapest plan for your address.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How can I reduce my electricity bill in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The biggest savings come from comparing energy plans (potential $200-$400/year),
                    switching to LED lighting, using a controlled load tariff for hot water,
                    and considering solar panels. In {suburb.name} specifically: {suburb.localInsight.toLowerCase()}
                  </p>
                </div>
              </div>
            </section>

            {/* Internal links: nearby suburbs */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nearby {suburb.city} Electricity Calculators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/energy-bill"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    General Electricity Bill Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {nearbySuburbs.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/calculators/energy-bill/${other.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {other.name} Electricity Calculator
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
                      href={`/calculators/energy-bill/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        {other.name} Electricity Calculator
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
                  href="/calculators/energy-bill"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Electricity Bill Calculator</span>
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
