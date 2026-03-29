import type { Metadata } from "next";
import SalarySacrificeCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Salary Sacrifice Calculator Australia 2026 | Super Tax Savings Tool",
  description:
    "Free Australian salary sacrifice calculator — see how much tax you save by sacrificing salary into super. Compare take-home pay, concessional cap usage, and project your super balance at retirement with FY2025-26 rates.",
  keywords: [
    "salary sacrifice calculator",
    "salary sacrifice calculator australia",
    "how much super can I salary sacrifice",
    "is salary sacrifice worth it",
    "salary sacrifice into super",
    "salary sacrifice tax savings",
    "concessional contributions cap",
    "super salary sacrifice calculator",
    "salary sacrifice super calculator australia",
    "salary packaging super",
    "pre tax super contributions",
    "salary sacrifice vs after tax contribution",
  ],
  openGraph: {
    title:
      "Salary Sacrifice Calculator Australia 2026 | Super Tax Savings Tool",
    description:
      "Calculate your salary sacrifice tax savings, take-home pay impact, and super balance projection at retirement. FY2025-26 rates and $30,000 concessional cap.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/salary-sacrifice-calculator",
  },
};

const faqs = [
  {
    question: "What is salary sacrifice into super in Australia?",
    answer:
      "Salary sacrifice into super is an arrangement where you ask your employer to redirect a portion of your pre-tax salary directly into your superannuation fund. Instead of receiving that money as income (taxed at your marginal rate of up to 45% plus 2% Medicare levy), it goes into super where it is taxed at just 15% as a concessional contribution. For example, if you earn $100,000 and sacrifice $10,000, your taxable income drops to $90,000. You save tax at your marginal rate (32% including Medicare) but pay 15% contributions tax in super — a net saving of $1,700 per year. The trade-off is reduced take-home pay and your money is locked in super until you reach preservation age (currently 60).",
  },
  {
    question: "How much super can I salary sacrifice in 2025-26?",
    answer:
      "The concessional contributions cap for FY2025-26 is $30,000 per year. This cap includes your employer's Superannuation Guarantee (SG) contributions (11.5% of ordinary time earnings), any salary sacrifice contributions, and any personal deductible contributions you claim. For example, if your employer contributes $11,500 in SG on a $100,000 salary, you can salary sacrifice up to $18,500 before hitting the $30,000 cap. If you exceed the cap, the excess is added to your assessable income and taxed at your marginal rate, plus an interest charge. However, if your total super balance was under $500,000 on 30 June of the previous year, you may be able to use unused carry-forward cap amounts from up to five prior financial years.",
  },
  {
    question: "Is salary sacrifice worth it?",
    answer:
      "Salary sacrifice is generally worth it if your marginal tax rate (including Medicare levy) is higher than 15% — which means anyone earning over $18,200 benefits. The higher your income, the greater the tax saving per dollar sacrificed. At the 30% bracket (income $45,001–$135,000), you save 17 cents per dollar. At the 45% bracket ($190,001+), you save 32 cents per dollar. However, consider the trade-offs: reduced take-home pay, money locked until preservation age (60), and potential impact on borrowing capacity. Salary sacrifice is most powerful when you have decades until retirement (compound growth amplifies the difference), you are in a higher tax bracket, and you can comfortably absorb the reduction in take-home pay.",
  },
  {
    question: "What is the difference between salary sacrifice and personal deductible contributions?",
    answer:
      "Both are concessional contributions taxed at 15% in super, but they work differently. Salary sacrifice is arranged with your employer before you receive the income — your employer redirects part of your gross pay directly to your super fund. Personal deductible contributions are made from your bank account after you receive your pay, then you claim a tax deduction when you lodge your return (via a Notice of Intent to Claim form to your super fund). The tax outcome is similar, but salary sacrifice reduces your PAYG withholding throughout the year (immediate cash flow benefit), while personal deductible contributions give you a lump-sum tax refund at tax time. Both count toward the $30,000 concessional cap.",
  },
  {
    question: "Does salary sacrifice reduce my take-home pay by the full amount?",
    answer:
      "No — this is the key benefit. Because the sacrificed amount is no longer taxed at your marginal rate, the reduction in take-home pay is less than the amount going into super. For example, if you sacrifice $10,000 from a $100,000 salary, your taxable income drops from $100,000 to $90,000. At the 30% marginal rate plus 2% Medicare, you save $3,200 in income tax. So your take-home pay only drops by about $6,800 — not the full $10,000. The $10,000 goes into super and is taxed at 15% ($1,500), leaving $8,500 in your super account. Your net tax advantage is $3,200 minus $1,500 = $1,700 per year.",
  },
  {
    question: "What is the concessional contributions cap for 2025-26?",
    answer:
      "The concessional contributions cap for FY2025-26 is $30,000 per person per year. Concessional contributions include employer SG (11.5%), salary sacrifice, and personal deductible contributions. If your total super balance was below $500,000 on 30 June 2025, you can carry forward unused cap amounts from up to five prior years. For example, if you only used $20,000 of your cap in each of the last three years, you may have an additional $30,000 in carry-forward cap available — giving you a total cap of $60,000 for FY2025-26. Exceeding the cap means the excess is taxed at your marginal rate plus an interest charge (the Excess Concessional Contributions charge).",
  },
  {
    question: "How does salary sacrifice affect my employer super contributions?",
    answer:
      "Salary sacrifice does not reduce your employer's Superannuation Guarantee (SG) obligation — by law, employers must pay SG on your ordinary time earnings (OTE), which is your base salary before salary sacrifice. So if you earn $100,000 and sacrifice $10,000, your employer still pays 11.5% SG on the full $100,000 ($11,500). However, some employment agreements calculate SG on the reduced salary — always check your contract or enterprise agreement. The salary sacrifice amount plus employer SG both count as concessional contributions toward the $30,000 cap.",
  },
  {
    question: "What is Division 293 tax and does it affect salary sacrifice?",
    answer:
      "Division 293 is an additional 15% tax on concessional super contributions for individuals with combined income and concessional contributions exceeding $250,000. This effectively doubles the contributions tax to 30% for high earners. For example, if you earn $260,000 and have $30,000 in concessional contributions (total $290,000), Division 293 applies to $30,000 of contributions — costing an extra $4,500 in tax. Even with Division 293, salary sacrifice still saves tax if your marginal rate (45% + 2% Medicare = 47%) exceeds 30%. The saving is reduced from 32 cents to 17 cents per dollar. The ATO assesses Division 293 after you lodge your return.",
  },
  {
    question: "Can I salary sacrifice if I am self-employed?",
    answer:
      "Self-employed individuals cannot salary sacrifice because there is no employer to arrange the deduction with. However, you can achieve the same tax outcome by making personal super contributions and claiming them as a tax deduction (personal deductible contributions). You contribute from your business or personal account, then lodge a 'Notice of intent to claim a deduction' with your super fund before lodging your tax return or rolling over the funds. The contribution is taxed at 15% in super — the same as salary sacrifice. The $30,000 concessional cap still applies. This strategy is available regardless of your employment status since 1 July 2017.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Sacrifice Calculator Australia 2026",
  description:
    "Free Australian salary sacrifice calculator. Calculate tax savings from salary sacrificing into super, compare take-home pay, check concessional cap usage, and project super balance at retirement with FY2025-26 rates.",
  url: "https://au-calculators.vercel.app/salary-sacrifice-calculator",
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

export default function SalarySacrificeCalculatorPage() {
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
            Salary Sacrifice Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate how much tax you save by salary sacrificing into super.
            See the impact on your take-home pay, check you stay within the
            $30,000 concessional contributions cap, compare salary sacrifice
            vs after-tax contributions, and project your super balance at
            retirement with FY2025-26 tax rates.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <SalarySacrificeCalculator />

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
            Understanding Salary Sacrifice in Australia
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                What Is Salary Sacrifice Into Super?
              </h3>
              <p>
                Salary sacrifice is an arrangement where your employer redirects
                a portion of your pre-tax salary into your super fund. Instead
                of being taxed at your marginal rate (up to 45% + 2% Medicare
                levy), the contribution is taxed at just{" "}
                <strong>15% inside super</strong>. This tax gap is the core
                benefit — the higher your marginal rate, the more you save. Over{" "}
                <strong>3.5 million Australians</strong> make additional super
                contributions beyond the compulsory SG, with salary sacrifice
                being the most common method.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                The $30,000 Concessional Cap
              </h3>
              <p>
                For FY2025-26, total concessional contributions are capped at{" "}
                <strong>$30,000 per year</strong>. This includes employer SG
                (11.5%), salary sacrifice, and personal deductible
                contributions. Exceeding the cap means excess contributions are
                taxed at your marginal rate — wiping out the tax benefit. If
                your super balance was under $500,000 at 30 June 2025, you may
                carry forward unused cap from up to five prior years, allowing
                larger one-off contributions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Who Benefits Most?
              </h3>
              <p>
                Salary sacrifice delivers the greatest benefit to those in
                higher tax brackets. At the <strong>45% bracket</strong>{" "}
                ($190,001+), you save 32 cents per dollar sacrificed. At the{" "}
                <strong>30% bracket</strong> ($45,001–$135,000), you save 17
                cents. At the <strong>16% bracket</strong> ($18,201–$45,000),
                the saving is only 3 cents per dollar — still positive, but
                marginal. People earning under $18,200 (tax-free threshold)
                should not salary sacrifice as they would pay more tax (15%)
                than they currently owe (0%).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                The Trade-Off: Access and Liquidity
              </h3>
              <p>
                The main downside of salary sacrifice is that your money is
                locked in super until you reach <strong>preservation age</strong>{" "}
                (currently 60 for anyone born after 1 July 1964). You cannot
                access it for a house deposit, emergency fund, or other
                short-term needs (except under severe financial hardship or
                compassionate grounds). This makes salary sacrifice best suited
                for people who have adequate savings outside super and a
                long-term retirement focus. Always maintain an emergency fund
                before maximising salary sacrifice.
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
