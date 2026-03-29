import type { Metadata } from "next";
import { SUBURBS, SLUG_TO_SUBURB, SUBURBS_BY_CITY } from "../data";
import AdUnit from "../../components/AdUnit";
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

  const title = `${suburb.name} Mortgage & Property Calculator 2026 | ${suburb.state} Investment Hub`;
  const description = `Free ${suburb.name} mortgage calculator, stamp duty, rental yield & investment property tools. Median price ${formatCurrency(suburb.medianPrice)}, rental yield ${suburb.rentalYield}%. All ${suburb.name} property calculators in one place.`;

  return {
    title,
    description,
    keywords: [
      `${suburb.name.toLowerCase()} mortgage calculator`,
      `${suburb.name.toLowerCase()} property investment`,
      `${suburb.name.toLowerCase()} stamp duty calculator`,
      `${suburb.name.toLowerCase()} rental yield`,
      `${suburb.name.toLowerCase()} home loan calculator`,
      `property calculator ${suburb.name.toLowerCase()}`,
      `${suburb.name.toLowerCase()} investment property`,
      `${suburb.name.toLowerCase()} house prices 2026`,
    ],
    openGraph: {
      title: `${suburb.name} Property Calculator Hub 2026`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `https://au-calculators.vercel.app/suburbs/${slug}`,
    },
  };
}

const STATE_FULL_NAMES: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA: "Western Australia",
  SA: "South Australia",
  TAS: "Tasmania",
  ACT: "Australian Capital Territory",
};

interface CalculatorLink {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function getCalculatorLinks(
  suburb: (typeof SUBURBS)[number]
): CalculatorLink[] {
  return [
    {
      title: "Mortgage Repayment Calculator",
      description: `Calculate monthly repayments on a ${formatCurrency(suburb.typicalLoan)} home loan in ${suburb.name}`,
      href: `/calculators/mortgage-repayment`,
      icon: "🏦",
    },
    {
      title: "Mortgage Offset Calculator",
      description: `See how an offset account saves interest on your ${suburb.name} mortgage`,
      href: `/calculators/mortgage-offset`,
      icon: "💰",
    },
    {
      title: "Stamp Duty Calculator",
      description: `Calculate ${STATE_FULL_NAMES[suburb.state] || suburb.state} stamp duty on a ${formatCurrency(suburb.medianPrice)} property`,
      href: `/stamp-duty-calculator`,
      icon: "📋",
    },
    {
      title: "Rental Yield Calculator",
      description: `${suburb.name} average yield is ${suburb.rentalYield}% — calculate for your property`,
      href: `/calculators/rental-yield`,
      icon: "📊",
    },
    {
      title: "Negative Gearing Calculator",
      description: `Model tax benefits of a negatively geared investment in ${suburb.name}`,
      href: `/negative-gearing-calculator`,
      icon: "📉",
    },
    {
      title: "Capital Gains Tax Calculator",
      description: `Estimate CGT when selling a ${suburb.name} investment property`,
      href: `/calculators/capital-gains-tax`,
      icon: "💵",
    },
    {
      title: "Investment Property Cashflow",
      description: `Forecast rental income vs expenses for a ${suburb.name} investment`,
      href: `/calculators/investment-property-cashflow`,
      icon: "🏘️",
    },
    {
      title: "Land Tax Calculator",
      description: `Calculate ${suburb.state} land tax obligations for ${suburb.name} property`,
      href: `/calculators/land-tax`,
      icon: "🗺️",
    },
    {
      title: "Depreciation Calculator",
      description: `Estimate tax depreciation on a ${suburb.name} investment property`,
      href: `/calculators/depreciation`,
      icon: "🔧",
    },
    {
      title: "First Home Buyer Calculator",
      description: `Check ${suburb.state} first home buyer grants and concessions for ${suburb.name}`,
      href: `/calculators/first-home-buyer`,
      icon: "🏡",
    },
  ];
}

export default async function SuburbPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const annualRent = suburb.averageRent * 52;
  const deposit = suburb.medianPrice - suburb.typicalLoan;
  const monthlyRepayment = Math.round(
    (suburb.typicalLoan *
      (0.065 / 12) *
      Math.pow(1 + 0.065 / 12, 360)) /
      (Math.pow(1 + 0.065 / 12, 360) - 1)
  );

  const nearbySuburbs = (SUBURBS_BY_CITY[suburb.city] || []).filter(
    (s) => s.slug !== slug
  );
  const otherSuburbs = SUBURBS.filter(
    (s) => s.slug !== slug && s.city !== suburb.city
  ).slice(0, 8);

  const calculatorLinks = getCalculatorLinks(suburb);

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
        name: "Suburbs",
        item: "https://au-calculators.vercel.app/suburbs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${suburb.name}, ${suburb.state}`,
        item: `https://au-calculators.vercel.app/suburbs/${slug}`,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${suburb.name} Property Calculator Hub 2026`,
    description: `Free property and mortgage calculators for ${suburb.name}, ${suburb.state}. Median house price ${formatCurrency(suburb.medianPrice)}.`,
    url: `https://au-calculators.vercel.app/suburbs/${slug}`,
    about: {
      "@type": "Place",
      name: suburb.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: suburb.name,
        addressRegion: suburb.state,
        postalCode: suburb.postcode,
        addressCountry: "AU",
      },
    },
    author: { "@type": "Organization", name: "AU Calculators" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the median house price in ${suburb.name} in 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The estimated median house price in ${suburb.name}, ${suburb.state} is ${formatCurrency(suburb.medianPrice)} as of 2026. With a 20% deposit of ${formatCurrency(deposit)}, a typical home loan would be ${formatCurrency(suburb.typicalLoan)}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the rental yield in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The average gross rental yield in ${suburb.name} is approximately ${suburb.rentalYield}%, based on a median price of ${formatCurrency(suburb.medianPrice)} and average weekly rent of ${formatCurrency(suburb.averageRent)}. Annual rental income is approximately ${formatCurrency(annualRent)}.`,
        },
      },
      {
        "@type": "Question",
        name: `How much are mortgage repayments on a ${suburb.name} home?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on a typical ${suburb.name} home loan of ${formatCurrency(suburb.typicalLoan)} at 6.5% over 30 years, estimated monthly repayments are ${formatCurrency(monthlyRepayment)}. Use our mortgage calculator to adjust the rate, loan term, and deposit to match your situation.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${suburb.name} a good area for property investment?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${suburb.name} offers a rental yield of ${suburb.rentalYield}% with a median price of ${formatCurrency(suburb.medianPrice)}. ${suburb.marketInsight.split(".")[0]}.`,
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-3">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">
              {suburb.name}, {suburb.state}
            </span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {suburb.name} Property &amp; Mortgage Calculators
          </h1>
          <p className="text-gray-600 text-lg">
            All the tools you need to buy, invest, or refinance in{" "}
            {suburb.name}, {STATE_FULL_NAMES[suburb.state] || suburb.state}.
            Pre-filled with local {suburb.name} market data.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Key market stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Median Price</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(suburb.medianPrice)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Avg Weekly Rent</p>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(suburb.averageRent)}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">Rental Yield</p>
                <p className="text-lg font-bold text-amber-900">
                  {suburb.rentalYield}%
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-600 mb-1">
                  Est. Monthly Repayment
                </p>
                <p className="text-lg font-bold text-purple-900">
                  {formatCurrency(monthlyRepayment)}
                </p>
              </div>
            </div>

            {/* About this suburb */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                About {suburb.name}, {suburb.state} {suburb.postcode}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {suburb.description}
              </p>
              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {suburb.name} Market Insight
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suburb.marketInsight}
                </p>
              </div>
            </section>

            {/* Property snapshot */}
            <section className="mb-8">
              <div className="border border-gray-200 rounded-xl p-6 bg-white">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {suburb.name} Property Snapshot
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
                      <strong>20% deposit required:</strong>{" "}
                      {formatCurrency(deposit)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Average weekly rent:</strong>{" "}
                      {formatCurrency(suburb.averageRent)}/wk
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
                      <strong>Gross rental yield:</strong> {suburb.rentalYield}%
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>State:</strong>{" "}
                      {STATE_FULL_NAMES[suburb.state] || suburb.state}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">
                      &#8226;
                    </span>
                    <span>
                      <strong>Postcode:</strong> {suburb.postcode}
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <AdUnit
              slot="below-results"
              format="horizontal"
              className="mb-8"
            />

            {/* Calculator links grid */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {suburb.name} Property Calculators
              </h2>
              <p className="text-gray-600 mb-6">
                Use these calculators with {suburb.name} market data to plan
                your purchase, estimate costs, and model investment returns.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {calculatorLinks.map((calc) => (
                  <Link
                    key={calc.href}
                    href={calc.href}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <span className="text-2xl shrink-0">{calc.icon}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-blue-600 group-hover:text-blue-700 text-sm">
                        {calc.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {calc.description}
                      </p>
                    </div>
                    <span className="text-gray-400 ml-auto shrink-0 self-center">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {suburb.name} Property FAQs
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the median house price in {suburb.name} in 2026?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The estimated median house price in {suburb.name},{" "}
                    {suburb.state} is {formatCurrency(suburb.medianPrice)} as of
                    2026. With a 20% deposit of {formatCurrency(deposit)}, you
                    would need a home loan of approximately{" "}
                    {formatCurrency(suburb.typicalLoan)}. Monthly repayments at
                    6.5% would be around {formatCurrency(monthlyRepayment)}.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the rental yield in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The average gross rental yield in {suburb.name} is
                    approximately {suburb.rentalYield}%, based on a median price
                    of {formatCurrency(suburb.medianPrice)} and average weekly
                    rent of {formatCurrency(suburb.averageRent)}. This
                    translates to annual rental income of approximately{" "}
                    {formatCurrency(annualRent)}. Use our{" "}
                    <Link
                      href="/calculators/rental-yield"
                      className="text-blue-600 underline hover:text-blue-700"
                    >
                      rental yield calculator
                    </Link>{" "}
                    for detailed analysis.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much are mortgage repayments on a {suburb.name} home?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Based on a typical {suburb.name} home loan of{" "}
                    {formatCurrency(suburb.typicalLoan)} at 6.5% over 30 years,
                    estimated monthly repayments are{" "}
                    {formatCurrency(monthlyRepayment)}. Use our{" "}
                    <Link
                      href="/calculators/mortgage-repayment"
                      className="text-blue-600 underline hover:text-blue-700"
                    >
                      mortgage repayment calculator
                    </Link>{" "}
                    to adjust the rate, term, and deposit.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is {suburb.name} a good area for property investment?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {suburb.name} offers a rental yield of {suburb.rentalYield}%
                    with a median price of{" "}
                    {formatCurrency(suburb.medianPrice)}.{" "}
                    {suburb.marketInsight.split(".").slice(0, 2).join(".")}.
                    Use our{" "}
                    <Link
                      href="/calculators/investment-property-cashflow"
                      className="text-blue-600 underline hover:text-blue-700"
                    >
                      investment property cashflow calculator
                    </Link>{" "}
                    to model the full picture.
                  </p>
                </div>
              </div>
            </section>

            {/* Nearby suburb links */}
            {nearbySuburbs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  More {suburb.city} Suburb Calculators
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nearbySuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/suburbs/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        {other.name} Calculators
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatCurrency(other.medianPrice)}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Other suburb links */}
            {otherSuburbs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  More Australian Suburb Calculators
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherSuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/suburbs/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        {other.name} Calculators
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {other.state}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related main calculators */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">
                Popular Calculators
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
                  href="/stamp-duty-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Stamp Duty Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/mortgage-offset"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    Mortgage Offset Calculator
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
