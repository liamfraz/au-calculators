import type { Metadata } from "next";
import SuperCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Superannuation Calculator Australia 2024 — Super Balance Projector",
  description:
    "Free super calculator Australia — project your superannuation balance at retirement with employer SG contributions, salary sacrifice, investment returns, and 4% rule retirement income. Updated for 2025-26 SG rate of 11.5%.",
  keywords: [
    "super calculator",
    "super calculator australia",
    "superannuation calculator",
    "superannuation calculator australia",
    "retirement calculator au",
    "super projection tool",
    "australian super calculator",
    "superannuation calculator 2026",
    "salary sacrifice calculator",
    "employer super contribution calculator",
    "4% rule calculator",
    "retirement income calculator australia",
  ],
  openGraph: {
    title: "Superannuation Calculator Australia 2024 — Super Balance Projector",
    description:
      "Free super calculator — project your retirement balance with salary sacrifice comparison, SG rate increases, 4% rule income, and year-by-year breakdown.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is the Super Guarantee (SG) rate in 2026?",
    answer:
      "The Super Guarantee rate is 11.5% for the 2025-26 financial year and increases to 12% from the 2026-27 financial year onwards. This is the minimum percentage of your ordinary time earnings that your employer must contribute to your super fund. This calculator automatically applies the scheduled SG rate increases to your projection.",
  },
  {
    question: "How does salary sacrifice into super work?",
    answer:
      "Salary sacrifice lets you redirect a portion of your pre-tax salary into your super fund. These contributions are taxed at 15% inside super, rather than your marginal tax rate (which could be 32.5%, 37%, or 45%). For many Australians, this means a significant tax saving. However, there are annual caps — the concessional (before-tax) contributions cap is $30,000 per year for 2024-25, which includes both employer and salary sacrifice contributions.",
  },
  {
    question: "What is a good super balance for my age?",
    answer:
      "According to the Association of Superannuation Funds of Australia (ASFA), median super balances in 2024 are approximately: Age 30-34: $45,000, Age 35-39: $75,000, Age 40-44: $105,000, Age 45-49: $135,000, Age 50-54: $175,000, Age 55-59: $225,000, Age 60-64: $275,000. These are medians — the comfortable retirement standard suggests you need around $595,000 (single) or $690,000 (couple) at retirement.",
  },
  {
    question: "What return rate should I expect from super?",
    answer:
      "Over the long term (20+ years), Australian super funds have returned an average of about 7-8% per year before fees and taxes. However, returns vary significantly depending on your investment option. High-growth options may average 8-9% but with higher volatility, while conservative options might return 4-5% with lower risk. The default 7% assumption in this calculator is a reasonable long-term estimate for a balanced or growth option.",
  },
  {
    question:
      "What are insurance fees in super and should I keep them?",
    answer:
      "Most super funds automatically include life insurance, total and permanent disability (TPD), and income protection cover, paid from your super balance. Typical costs range from $3-10 per week depending on your age, gender, and coverage level. While this insurance can be valuable, it reduces your retirement balance over time. Review your coverage to ensure you're not paying for duplicate policies or more cover than you need.",
  },
  {
    question: "What is the 4% rule for retirement income?",
    answer:
      "The 4% rule is a widely used retirement planning guideline suggesting you can withdraw 4% of your super balance in the first year of retirement, then adjust that amount for inflation each subsequent year, with a high probability of your money lasting 30+ years. For example, a $1 million super balance would provide approximately $40,000 per year or $3,333 per month in retirement income. While originally based on US market data, it provides a useful starting point for Australian retirees, though your actual sustainable withdrawal rate may differ based on investment strategy, Age Pension eligibility, and market conditions.",
  },
  {
    question: "What is the preservation age to access my super?",
    answer:
      "Preservation age is the earliest age you can access your superannuation, even if you've retired. For anyone born after 1 July 1964 (the vast majority of working Australians today), the preservation age is 60. Once you reach preservation age and meet a condition of release (such as retiring, reaching age 65, or starting a transition to retirement pension), you can access your super. Before preservation age, your super is locked away except in cases of severe financial hardship, terminal illness, or permanent incapacity.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Superannuation Calculator",
  description:
    "Free super calculator Australia. Project your superannuation balance at retirement with employer contributions, salary sacrifice, investment returns, and 4% rule retirement income.",
  url: "https://au-calculators.vercel.app/calculators/super",
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

export default function SuperCalculatorPage() {
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
            Australian Superannuation Calculator
          </h1>
          <p className="text-gray-600">
            Project your super balance at retirement based on your current
            contributions, investment returns, and scheduled SG rate increases.
            Compare the impact of salary sacrifice on your retirement savings.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <SuperCalculator />

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

        {/* Educational Content */}
        <section className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Australian Superannuation: Key Facts for 2025–26
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Super Guarantee (SG) Rate
              </h3>
              <p>
                The SG rate is <strong>11.5%</strong> for the 2025–26 financial
                year, increasing to <strong>12%</strong> from 1 July 2026. This
                is the minimum percentage of your ordinary time earnings your
                employer must pay into your super fund. This calculator
                automatically applies the scheduled rate increase to future
                years.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Concessional Contribution Cap
              </h3>
              <p>
                The annual cap for before-tax (concessional) contributions is{" "}
                <strong>$30,000</strong> per year. This includes employer SG
                payments, salary sacrifice, and personal deductible
                contributions. Contributions above this cap are taxed at your
                marginal rate plus an excess concessional contributions charge.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Non-Concessional Contribution Cap
              </h3>
              <p>
                After-tax (non-concessional) contributions are capped at{" "}
                <strong>$120,000</strong> per year, with a bring-forward
                provision allowing up to $360,000 over three years if you&apos;re
                under 75. These contributions are not taxed when entering super
                since tax has already been paid on the income.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Preservation Age &amp; Access Rules
              </h3>
              <p>
                For most working Australians (born after 1 July 1964), the
                preservation age is <strong>60</strong>. You can access your
                super when you retire after reaching this age, or at any time
                once you turn 65 regardless of work status. A transition to
                retirement (TTR) pension can provide income from age 60 while
                still working.
              </p>
            </div>
          </div>
        </section>

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
      </div>
    </>
  );
}
