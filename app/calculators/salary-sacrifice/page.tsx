import type { Metadata } from "next";
import SalarySacrificeCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Salary Sacrifice Calculator Australia 2026 | Tax Savings & Super Impact",
  description:
    "Free salary sacrifice calculator Australia — calculate tax savings vs take-home pay reduction for salary sacrifice into super, car lease, or other benefits. FY2025-26 tax brackets, Medicare levy, and retirement super projection included.",
  keywords: [
    "salary sacrifice calculator",
    "salary sacrifice calculator australia",
    "salary sacrifice into super calculator",
    "salary sacrifice tax savings",
    "salary sacrifice super",
    "salary packaging calculator",
    "novated lease calculator",
    "pre tax super contributions calculator",
    "salary sacrifice car lease",
    "salary sacrifice benefits australia",
    "concessional contributions calculator",
    "super salary sacrifice calculator 2026",
  ],
  openGraph: {
    title:
      "Salary Sacrifice Calculator Australia 2026 | Tax Savings & Super Impact",
    description:
      "Free salary sacrifice calculator — compare take-home pay with and without salary sacrifice. See tax savings, super growth projection, and concessional cap warnings.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is salary sacrifice in Australia?",
    answer:
      "Salary sacrifice (also called salary packaging) is an arrangement where you agree to receive less pre-tax salary in exchange for your employer providing benefits of a similar value. The most common form is sacrificing into superannuation, but it can also include novated car leases, laptops, and other benefits. Because the sacrifice comes from your pre-tax salary, you pay less income tax, effectively reducing the cost of the benefit.",
  },
  {
    question: "How much tax do I save with salary sacrifice into super?",
    answer:
      "The tax saving depends on your marginal tax rate. Salary sacrifice into super is taxed at 15% inside the fund, compared to your marginal rate which could be 30%, 37%, or 45% plus the 2% Medicare levy. For example, on a $90,000 salary, sacrificing $500/month saves approximately $1,080 per year in tax. The higher your income, the greater the saving — but watch the $30,000 annual concessional contributions cap.",
  },
  {
    question: "What is the concessional contributions cap for 2025-26?",
    answer:
      "The concessional (before-tax) contributions cap is $30,000 per year for 2025-26. This includes employer Super Guarantee (SG) contributions, salary sacrifice amounts, and any personal deductible contributions. If you exceed the cap, the excess is added to your assessable income and taxed at your marginal rate, plus an interest charge. You may be able to use unused cap amounts from previous years under the carry-forward rule if your total super balance was under $500,000.",
  },
  {
    question:
      "Does salary sacrifice reduce my employer super contributions?",
    answer:
      "No — your employer must still pay the 11.5% Super Guarantee (SG) on your original (pre-sacrifice) ordinary time earnings, not your reduced salary. This is an important protection under the Superannuation Guarantee legislation. However, check your employment agreement, as some employers may calculate SG on the reduced salary — this is legal but less common.",
  },
  {
    question: "What is the difference between salary sacrifice and after-tax super contributions?",
    answer:
      "Salary sacrifice contributions come from your pre-tax salary and are taxed at 15% inside super (concessional contributions, capped at $30,000/year). After-tax (non-concessional) contributions come from your take-home pay — tax has already been paid at your marginal rate, so they are not taxed again when entering super. The non-concessional cap is $120,000/year. Salary sacrifice is more tax-effective for most people earning above $45,000.",
  },
  {
    question: "Can I salary sacrifice into a novated car lease?",
    answer:
      "Yes — a novated lease is one of the most popular salary sacrifice arrangements after super. Your employer leases a car on your behalf and deducts lease payments from your pre-tax salary. This reduces your taxable income, similar to super sacrifice. However, Fringe Benefits Tax (FBT) applies to car leases, which can offset some of the tax benefit. The Employee Contribution Method (ECM) can reduce FBT by making post-tax contributions. This calculator shows the income tax saving from the pre-tax deduction.",
  },
  {
    question: "Who can salary sacrifice in Australia?",
    answer:
      "Most employees can enter a salary sacrifice arrangement, but it must be agreed with your employer before the income is earned — you cannot retrospectively sacrifice salary you've already received. Not all employers offer salary packaging, and the available benefits vary. Government and not-for-profit employees often have additional FBT-exempt benefits (e.g., meal entertainment, living expenses up to certain caps). Self-employed individuals cannot salary sacrifice, but can make personal deductible contributions to super instead.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Salary Sacrifice Calculator",
  description:
    "Free salary sacrifice calculator Australia. Calculate tax savings vs take-home pay reduction for salary sacrifice into super, car lease, or other benefits. Includes FY2025-26 tax brackets and retirement super projection.",
  url: "https://au-calculators.vercel.app/calculators/salary-sacrifice",
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
            Australian Salary Sacrifice Calculator
          </h1>
          <p className="text-gray-600">
            Calculate how salary sacrifice affects your take-home pay, tax bill,
            and superannuation balance at retirement. Compare with and without
            salary sacrifice side-by-side using FY2025-26 tax brackets and
            Medicare levy.
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
            Salary Sacrifice in Australia: Key Facts for 2025-26
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                How Salary Sacrifice Works
              </h3>
              <p>
                Salary sacrifice reduces your <strong>taxable income</strong> by
                redirecting part of your pre-tax salary into super or other
                benefits. You pay <strong>15% contributions tax</strong> inside
                super instead of your marginal rate (up to 45% + 2% Medicare
                levy). For a $90,000 salary, the marginal rate on the last
                dollar is 30% — so each dollar sacrificed saves you 17 cents in
                tax (30% + 2% - 15%).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                FY2025-26 Tax Brackets
              </h3>
              <p>
                $0-$18,200: <strong>0%</strong> | $18,201-$45,000:{" "}
                <strong>16%</strong> | $45,001-$135,000: <strong>30%</strong> |
                $135,001-$190,000: <strong>37%</strong> | $190,001+:{" "}
                <strong>45%</strong>. Plus <strong>2% Medicare levy</strong> on
                taxable income above $26,000. These are the rates used in this
                calculator.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Concessional Contributions Cap
              </h3>
              <p>
                The annual cap for before-tax contributions is{" "}
                <strong>$30,000</strong>. This includes employer SG, salary
                sacrifice, and personal deductible contributions. Exceeding the
                cap means the excess is taxed at your marginal rate plus an
                interest charge. The carry-forward rule allows use of unused cap
                from up to 5 prior years if your super balance is under
                $500,000.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Impact on Other Benefits
              </h3>
              <p>
                Salary sacrifice <strong>reduces your reportable income</strong>{" "}
                for some government benefits (e.g., child care subsidy,
                HELP/HECS repayments). However, the ATO adds back reportable
                fringe benefits and reportable super contributions when
                calculating income tests for many benefits. Check individual
                benefit rules before relying on salary sacrifice to reduce
                income test thresholds.
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
