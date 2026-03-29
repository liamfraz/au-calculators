import type { Metadata } from "next";
import Link from "next/link";
import ElectricityBillCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Electricity Bill Calculator Australia 2026 | Average Power Bill Estimator",
  description:
    "Free Australian electricity bill calculator. Estimate your quarterly, daily, and annual power costs by state and household size. Compare electricity rates across NSW, VIC, QLD, SA, WA, and TAS from AGL, Origin Energy, and EnergyAustralia.",
  keywords: [
    "electricity bill calculator australia",
    "average electricity bill australia",
    "power bill estimator",
    "electricity cost calculator",
    "energy bill calculator australia",
    "quarterly electricity bill calculator",
    "electricity rates by state australia",
    "how much is electricity per kwh australia",
    "average electricity bill per quarter australia",
    "AGL electricity rates",
    "Origin Energy rates",
    "EnergyAustralia rates",
    "electricity bill calculator nsw",
    "electricity bill calculator vic",
    "electricity bill calculator qld",
  ],
  openGraph: {
    title:
      "Electricity Bill Calculator Australia 2026 | Average Power Bill Estimator",
    description:
      "Estimate your quarterly, daily, and annual electricity bill by state and household size. Compare rates from AGL, Origin Energy, and EnergyAustralia.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/electricity-bill-calculator",
  },
};

const faqs = [
  {
    question: "How much is the average electricity bill in Australia?",
    answer:
      "The average Australian household electricity bill is $350\u2013$550 per quarter depending on state and household size. South Australia has the highest rates at approximately 42c/kWh, while Queensland and the ACT are around 28\u201330c/kWh. A typical 3-person household in NSW using 18 kWh/day pays roughly $480 per quarter. Nationally, the average annual electricity bill is approximately $1,600\u2013$2,200.",
  },
  {
    question: "How is my electricity bill calculated?",
    answer:
      "Your electricity bill has two components: a daily supply charge (fixed fee for grid connection, typically 90c\u2013$1.20/day) and a usage charge (per kWh consumed). Total quarterly bill = (supply charge \u00D7 91 days) + (daily kWh \u00D7 91 days \u00D7 rate per kWh). GST is included in advertised rates. Retailers like AGL, Origin Energy, and EnergyAustralia publish their rates on their websites and on Energy Made Easy.",
  },
  {
    question: "Which Australian state has the cheapest electricity?",
    answer:
      "As of 2025\u201326, the Northern Territory (~27c/kWh) and ACT (~28c/kWh) generally have the lowest residential electricity rates, followed by Tasmania (~29c/kWh) and Queensland (~30c/kWh). South Australia is the most expensive at approximately 42c/kWh. However, supply charges also vary \u2014 check the full comparison table above for total estimated quarterly bills by state.",
  },
  {
    question:
      "How much electricity does the average Australian household use per day?",
    answer:
      "The average Australian household uses approximately 16\u201320 kWh per day, varying by state and household size. A 1-person household typically uses 10\u201312 kWh/day, while a family of 5\u20136 may use 25\u201330 kWh/day. Northern Territory and Western Australia have higher averages (20\u201322 kWh/day) due to air-conditioning, while Victoria averages around 16 kWh/day.",
  },
  {
    question: "How can I reduce my electricity bill in Australia?",
    answer:
      "The most effective ways to reduce your electricity bill are: (1) Compare plans on Energy Made Easy \u2014 switching from AGL, Origin Energy, or EnergyAustralia to a better offer can save $200\u2013$500/year. (2) Install solar panels \u2014 a 6.6 kW system typically saves $1,000\u2013$2,000/year. (3) Switch to a heat pump hot water system. (4) Set air-con to 24\u00B0C in summer, 20\u00B0C in winter. (5) Run appliances during off-peak hours if on a time-of-use tariff.",
  },
  {
    question:
      "What is the difference between supply charge and usage charge on my electricity bill?",
    answer:
      "The supply charge (also called service charge or daily charge) is a fixed daily fee for being connected to the electricity grid, typically 90c\u2013$1.20 per day regardless of how much electricity you use. The usage charge is the per-kilowatt-hour (kWh) rate you pay for electricity consumed, ranging from 27c to 42c/kWh depending on your state and retailer. Supply charges make up roughly 15\u201320% of a typical bill.",
  },
  {
    question:
      "How do AGL, Origin Energy, and EnergyAustralia electricity rates compare?",
    answer:
      "The big three retailers \u2014 AGL, Origin Energy, and EnergyAustralia \u2014 generally offer similar rates within each state, typically within 1\u20132c/kWh of each other on their default market offers. However, promotional and online-only plans can vary significantly. Use the Australian Energy Regulator\u2019s Energy Made Easy comparison tool (or Victorian Energy Compare in VIC) to find the cheapest plan for your usage pattern.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Electricity Bill Calculator Australia 2026",
  description:
    "Estimate your quarterly, daily, and annual electricity bill by Australian state and household size. Compare rates from AGL, Origin Energy, and EnergyAustralia.",
  url: "https://au-calculators.vercel.app/electricity-bill-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  author: { "@type": "Organization", name: "AU Calculators" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function ElectricityBillCalculatorPage() {
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
            Electricity Bill Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Estimate your quarterly, daily, and annual electricity costs by
            state and household size. Select your state, choose how to estimate
            your usage (household size, kWh input, or appliance checklist), and
            see an instant breakdown. Compare average electricity rates across
            all Australian states from retailers including AGL, Origin Energy,
            and EnergyAustralia.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <ElectricityBillCalculator />

            {/* Ad: Below results */}
            <AdUnit
              slot="below-results"
              format="horizontal"
              className="mt-8"
            />
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
              <div
                key={faq.question}
                className="border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <div className="mt-8 text-sm text-gray-500">
          See also:{" "}
          <Link
            href="/calculators/energy-bill"
            className="text-blue-600 hover:underline"
          >
            Advanced Energy Bill Calculator
          </Link>{" "}
          ·{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            All Calculators
          </Link>
        </div>
      </div>
    </>
  );
}
