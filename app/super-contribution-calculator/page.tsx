import type { Metadata } from "next";
import SuperContributionCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Super Contribution Calculator Australia 2026 | Optimise Your Retirement",
  description:
    "Free superannuation contribution calculator — calculate optimal super contributions, salary sacrifice tax savings, concessional cap ($30K), carry-forward amounts, and compare contribution scenarios. FY2025-26 rates.",
  keywords: [
    "superannuation contribution calculator australia",
    "salary sacrifice calculator",
    "super contribution cap 2026",
    "concessional contributions cap",
    "carry forward super contributions",
    "super salary sacrifice tax savings",
    "voluntary super contributions calculator",
    "super contribution calculator",
    "how much super should I contribute",
    "super contribution cap carry forward",
    "concessional contributions calculator 2026",
    "salary sacrifice into super calculator",
  ],
  openGraph: {
    title:
      "Super Contribution Calculator Australia 2026 | Optimise Your Retirement",
    description:
      "Calculate optimal super contributions, tax savings from salary sacrifice, and compare contribution scenarios. $30K concessional cap with carry-forward support.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/super-contribution-calculator",
  },
};

const faqs = [
  {
    question: "What is the superannuation contribution cap for 2025-26?",
    answer:
      "The concessional (before-tax) contributions cap is $30,000 per year for 2025-26. This includes employer Super Guarantee (SG) contributions at 11.5%, salary sacrifice amounts, and any personal deductible contributions. If you exceed the cap, the excess is added to your assessable income and taxed at your marginal rate, plus an interest charge calculated on the excess from the start of the financial year.",
  },
  {
    question: "What are carry-forward super contributions?",
    answer:
      "If your total super balance was below $500,000 on 30 June of the previous financial year, you can carry forward unused concessional cap amounts from up to 5 prior financial years. For example, if you only used $20,000 of your $30,000 cap last year, you could contribute up to $40,000 this year ($30,000 current cap + $10,000 unused). This is especially useful for people returning to work, receiving a bonus, or wanting to make catch-up contributions.",
  },
  {
    question:
      "How much tax do I save by making voluntary super contributions?",
    answer:
      "Voluntary concessional contributions (salary sacrifice or personal deductible contributions) are taxed at 15% inside super, compared to your marginal tax rate which could be 30%, 37%, or 45% plus the 2% Medicare levy. For someone earning $100,000, each dollar of salary sacrifice saves approximately 17 cents in tax (32% marginal rate minus 15% super tax). High-income earners (over $250,000 including super) pay an additional 15% Division 293 tax, reducing the benefit.",
  },
  {
    question:
      "What is the difference between concessional and non-concessional contributions?",
    answer:
      "Concessional contributions are made from pre-tax income — employer SG, salary sacrifice, and personal deductible contributions. They are taxed at 15% when they enter super, capped at $30,000/year. Non-concessional contributions come from after-tax income — no additional tax applies since you have already paid income tax. The non-concessional cap is $120,000/year, or up to $360,000 using the bring-forward rule if under age 75.",
  },
  {
    question: "Should I salary sacrifice into super or invest outside super?",
    answer:
      "Salary sacrifice into super offers an immediate tax saving (15% vs your marginal rate) and tax-free investment growth for those over 60. However, you cannot access super until preservation age (60 for most people). Investing outside super gives you flexibility and access to your money at any time, but investment returns are taxed annually at your marginal rate. Generally, salary sacrifice is more tax-effective for long-term retirement savings, while outside-super investing suits shorter-term goals or emergency funds.",
  },
  {
    question: "What is Division 293 tax on super contributions?",
    answer:
      "Division 293 is an additional 15% tax on concessional super contributions for individuals with income plus super contributions exceeding $250,000. This effectively doubles the super contributions tax from 15% to 30% on the amount above the threshold. For example, if your income is $240,000 and your concessional contributions are $30,000, you pay 15% Division 293 tax on $20,000 (the amount that pushes your total above $250,000). The ATO issues a separate assessment for Division 293 tax.",
  },
  {
    question: "How does the Super Guarantee rate change over time?",
    answer:
      "The Super Guarantee (SG) rate is 11.5% for FY2025-26 and increases to 12% from FY2026-27, where it is legislated to remain. This means your employer must contribute at least 11.5% (or 12% from July 2026) of your ordinary time earnings into your nominated super fund. Some employers contribute more than the minimum — check your employment agreement. The SG is paid on top of your salary, not deducted from it.",
  },
  {
    question: "Can I make a lump sum contribution to super?",
    answer:
      "Yes, you can make lump sum contributions to super at any time, subject to the contribution caps. For concessional contributions, you can claim a personal tax deduction by submitting a Notice of Intent to your super fund before lodging your tax return or rolling over the funds. For non-concessional contributions, you simply deposit the funds — no tax deduction applies, but the money grows tax-effectively inside super. Ensure any lump sum does not push you over the relevant cap.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Super Contribution Calculator Australia 2026",
  description:
    "Free Australian superannuation contribution calculator. Calculate optimal super contributions, salary sacrifice tax savings, concessional cap ($30K), and carry-forward unused amounts. Compare contribution scenarios with FY2025-26 rates.",
  url: "https://au-calculators.vercel.app/super-contribution-calculator",
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

export default function SuperContributionCalculatorPage() {
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
            Super Contribution Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your optimal superannuation contributions for FY2025-26.
            Compare scenarios from employer SG only to maximising your $30,000
            concessional cap. See projected retirement balances, annual tax
            savings from salary sacrifice, and carry-forward unused cap amounts.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <SuperContributionCalculator />

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
            Super Contributions in Australia: Key Facts for 2025-26
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Concessional Contributions
              </h3>
              <p>
                Before-tax contributions (employer SG, salary sacrifice,
                personal deductible) are capped at{" "}
                <strong>$30,000 per year</strong>. They are taxed at{" "}
                <strong>15% inside super</strong> — a significant saving
                compared to marginal rates of 30-47%. The carry-forward rule
                lets you use up to 5 years of unused cap if your balance is
                under $500,000.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Non-Concessional Contributions
              </h3>
              <p>
                After-tax contributions are capped at{" "}
                <strong>$120,000 per year</strong>. If under 75, you can use the
                bring-forward rule to contribute up to <strong>$360,000</strong>{" "}
                in a single year. These are not taxed again when entering super
                since income tax has already been paid. Exceeding the cap
                triggers excess non-concessional contributions tax.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Super Guarantee 2025-26
              </h3>
              <p>
                Employers must contribute <strong>11.5%</strong> of ordinary
                time earnings into your super fund for FY2025-26. This increases
                to <strong>12%</strong> from 1 July 2026. The SG is paid on top
                of your salary. If your employer calculates SG on your
                post-sacrifice salary, check your agreement — they should use
                pre-sacrifice earnings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Maximising Your Retirement
              </h3>
              <p>
                Even small voluntary contributions make a large difference over
                decades thanks to compound returns. Contributing an extra{" "}
                <strong>$200/month</strong> from age 30 to 67 at 7% return adds
                approximately <strong>$400,000+</strong> to your retirement
                balance. Use the concessional cap first for the tax benefit,
                then consider non-concessional contributions if you have
                additional savings.
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
