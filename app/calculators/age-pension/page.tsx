import type { Metadata } from "next";
import AgePensionCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Age Pension Calculator Australia 2026 | Centrelink Pension Calculator",
  description:
    "Free Australian Age Pension calculator. Estimate your Centrelink pension using 2025-26 income test and assets test thresholds. Shows fortnightly and annual rates for singles and couples.",
  keywords: [
    "age pension calculator australia",
    "centrelink pension calculator",
    "age pension calculator 2026",
    "pension income test calculator",
    "pension assets test calculator",
    "centrelink age pension rates",
    "age pension rates 2025-26",
    "australian pension calculator",
    "age pension eligibility calculator",
    "retirement pension calculator australia",
  ],
  openGraph: {
    title: "Age Pension Calculator Australia 2026 — Income & Assets Test",
    description:
      "Calculate your Centrelink Age Pension entitlement. Applies both income test and assets test using 2025-26 thresholds. Free, instant results.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How is the Age Pension calculated in Australia?",
    answer:
      "The Age Pension is calculated by applying two separate means tests: the Income Test and the Assets Test. Centrelink calculates your pension under both tests and pays you the lower amount. The Income Test reduces your pension by 50 cents for every dollar of fortnightly income over the threshold ($204 for singles, $360 for couples). The Assets Test reduces your pension by $3 per fortnight for every $1,000 in assets over the threshold. Your home is not counted as an asset if you live in it.",
  },
  {
    question: "What is the maximum Age Pension rate for 2025-26?",
    answer:
      "For the 2025-26 financial year, the maximum fortnightly Age Pension rate is $1,116.30 for a single person and $1,682.80 combined for a couple (both eligible). This includes the base pension rate and pension supplement. On top of this, eligible pensioners also receive the Energy Supplement of $14.10 per fortnight (single) or $21.20 (couple combined). Rates are indexed in March and September each year.",
  },
  {
    question: "What age do you need to be to get the Age Pension?",
    answer:
      "You must be at least 67 years old to qualify for the Age Pension in Australia. This applies to everyone born on or after 1 January 1957. You must also be an Australian resident, have lived in Australia for at least 10 years in total (with at least 5 continuous years), and meet the income and assets tests. You can apply up to 13 weeks before reaching pension age.",
  },
  {
    question: "How does superannuation affect the Age Pension?",
    answer:
      "Once you reach Age Pension age, your superannuation balance is counted as a financial asset under the Assets Test. It is also subject to deeming rules under the Income Test — Centrelink assumes your super earns a set rate of return (currently 0.25% p.a.) regardless of what it actually earns. This deemed income is added to your other assessable income. Drawing down your super reduces your asset balance, which may increase your pension entitlement over time.",
  },
  {
    question: "What assets are included in the Age Pension assets test?",
    answer:
      "Assessable assets include: bank accounts, superannuation (at pension age), shares and managed funds, investment properties, vehicles, caravans, boats, household contents, and any other assets of value. Your principal home is excluded if you live in it, though the surrounding land value may be assessed if it exceeds 2 hectares. Funeral bonds up to the allowable limit and some accommodation bonds are also exempt. Gifting rules apply — giving away more than $10,000 in a year or $30,000 over 5 years may still count as an asset.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Age Pension Calculator 2026",
  description:
    "Free Age Pension calculator applying 2025-26 income test and assets test thresholds. Calculates Centrelink pension entitlement for singles and couples.",
  url: "https://au-calculators.vercel.app/calculators/age-pension",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  author: {
    "@type": "Organization",
    name: "AU Calculators",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

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
      name: "Age Pension Calculator",
      item: "https://au-calculators.vercel.app/calculators/age-pension",
    },
  ],
};

export default function AgePensionPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Australian Age Pension Calculator 2026
          </h1>
          <p className="text-gray-600">
            Estimate your Centrelink Age Pension entitlement using the 2025–26 income test and
            assets test thresholds. Enter your details to see your fortnightly and annual pension
            amount, which test reduces your payment, and how much you could receive.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <AgePensionCalculator />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
          </div>

          {/* Sidebar ad: Desktop only */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
