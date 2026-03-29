import type { Metadata } from "next";
import EnergyBillCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Electricity Bill Calculator Australia 2026 | Compare Rates by State & Provider",
  description:
    "Free Australian electricity bill calculator. Compare AGL, Origin & EnergyAustralia rates. Estimate quarterly costs by state, compare flat vs time-of-use tariffs, and calculate solar savings. Updated 2026 rates.",
  keywords: [
    "electricity bill calculator australia",
    "energy cost calculator nsw",
    "compare electricity prices australia",
    "electricity bill estimator",
    "electricity rates by state australia",
    "compare energy providers australia",
    "time of use electricity rates",
    "solar savings calculator australia",
    "quarterly electricity bill calculator",
    "AGL electricity rates",
    "Origin Energy rates",
    "EnergyAustralia rates",
    "controlled load tariff calculator",
    "electricity cost per kwh australia",
  ],
  openGraph: {
    title: "Electricity Bill Calculator Australia 2026 | Compare Rates & Providers",
    description:
      "Estimate your quarterly electricity bill by state. Compare AGL, Origin & EnergyAustralia rates, flat vs time-of-use tariffs, and calculate solar panel savings.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much is the average electricity bill in Australia in 2026?",
    answer:
      "The average Australian household electricity bill in 2026 ranges from $350-$550 per quarter depending on your state. South Australia has the highest average rates at ~42c/kWh, while Queensland and the ACT sit around 28-30c/kWh. A typical 3-person household using 18 kWh/day in NSW pays roughly $480 per quarter. Your actual bill depends on your tariff type (flat, time-of-use, or controlled load), household size, and whether you have solar panels.",
  },
  {
    question: "What is the difference between flat rate, time-of-use, and controlled load tariffs?",
    answer:
      "A flat rate tariff charges the same price per kWh regardless of when you use electricity (e.g., 35c/kWh in NSW). Time-of-use (TOU) tariffs charge different rates depending on the time of day: peak rates (40-55c/kWh, typically 2-8pm weekdays), shoulder rates (25-35c/kWh), and off-peak rates (15-22c/kWh, overnight and weekends). Controlled load tariffs (18-25c/kWh) apply to specific appliances like hot water systems that run on a separate meter during off-peak hours. TOU plans benefit households that can shift usage to off-peak times; flat rates suit those with consistent daytime usage.",
  },
  {
    question: "How do AGL, Origin, and EnergyAustralia electricity rates compare?",
    answer:
      "In 2026, the three major retailers offer similar but not identical rates. AGL typically charges 33-38c/kWh with daily supply charges of $1.00-$1.20/day. Origin Energy ranges from 30-36c/kWh with supply charges of $0.95-$1.15/day. EnergyAustralia sits around 32-37c/kWh with supply charges of $0.98-$1.18/day. Rates vary significantly by state and plan type. All three offer conditional discounts (pay-on-time, direct debit) that can reduce bills by 5-15%. Always compare the total annual cost, not just the per-kWh rate, as supply charges make a big difference.",
  },
  {
    question: "How much can solar panels save on my electricity bill?",
    answer:
      "A typical 6.6kW solar system in Australia generates about 25-30 kWh per day on average. With 30-40% self-consumption, you avoid buying 8-12 kWh from the grid daily (saving $3-5/day at current rates), plus earn feed-in tariff credits of 4-8c/kWh on exported energy. Annual savings typically range from $1,000-$2,000 depending on your state, usage patterns, and feed-in tariff rate. A 6.6kW system costs $4,000-$8,000 after STCs (solar rebate), giving a payback period of 3-5 years.",
  },
  {
    question: "How is my electricity bill calculated?",
    answer:
      "Your electricity bill has two main components: a daily supply charge (fixed fee for grid connection, typically 90c-$1.20/day or $82-$109/quarter) and a usage charge (per kWh consumed). The usage charge makes up 60-75% of most bills. For example, in NSW at 35c/kWh, using 18 kWh/day costs $5.73/day in usage alone. Your total quarterly bill = (daily supply charge x 91 days) + (daily usage x 91 days x rate per kWh). GST is included in advertised rates. Solar credits and any pay-on-time discounts are subtracted from the total.",
  },
  {
    question: "Which Australian state has the cheapest electricity?",
    answer:
      "As of 2026, Queensland and the ACT generally have the lowest residential electricity rates at around 28-30c/kWh, followed by the Northern Territory at ~27c/kWh and Tasmania at ~29c/kWh. However, total bill costs also depend on daily supply charges and usage patterns. South Australia has the highest rates at ~42c/kWh, while NSW (~35c/kWh) and Victoria (~31c/kWh) sit in the middle. The Default Market Offer (DMO) in regulated states caps the maximum a retailer can charge, providing some price protection.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Electricity Bill Calculator 2026",
  description:
    "Free electricity bill calculator for Australians. Compare rates by state and provider, estimate quarterly costs with flat, time-of-use or controlled load tariffs, and calculate solar savings.",
  url: "https://au-calculators.vercel.app/calculators/energy-bill",
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

export default function EnergyBillPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Australian Electricity Bill Calculator 2026
          </h1>
          <p className="text-gray-600">
            Estimate your quarterly electricity bill by state. Compare flat, time-of-use,
            and controlled load tariffs. See how AGL, Origin, and EnergyAustralia rates
            stack up, and calculate how much solar panels can save you.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <EnergyBillCalculator />

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
