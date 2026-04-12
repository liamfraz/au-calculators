import type { Metadata } from "next";
import HECSCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "HECS-HELP Repayment Calculator 2026 — See When You'll Be Debt Free | AU Calculators",
  description:
    "Free HECS-HELP repayment calculator Australia 2026. Enter your debt balance and income to see exactly when you'll be debt free, using ATO's official 2025-26 repayment thresholds.",
  keywords: [
    "hecs repayment calculator",
    "hecs repayment calculator australia 2026",
    "help debt calculator",
    "hecs debt repayment",
    "when will i pay off hecs",
    "hecs indexation calculator",
  ],
  openGraph: {
    title:
      "HECS-HELP Repayment Calculator 2026 — See When You'll Be Debt Free",
    description:
      "Free HECS-HELP repayment calculator Australia 2026. Enter your debt balance and income to see exactly when you'll be debt free, using ATO's official 2025-26 repayment thresholds.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How is my HECS-HELP repayment amount calculated?",
    answer:
      "Your HECS-HELP repayment is based on your repayment income threshold, not your debt balance. Once your income exceeds $54,435 in 2025-26, you start repaying. The ATO applies a tiered percentage rate (1% to 10%) to your total repayment income. For example, at $80,000 income, your rate is 4.0%, giving an annual repayment of $3,200. The repayment is withheld from your salary through the PAYG system.",
  },
  {
    question: "What income does ATO use to calculate HECS repayments?",
    answer:
      "Repayment income includes your taxable income, plus fringe benefits, plus any net investment losses (such as rental property losses). It does NOT include non-assessable payments like the tax-free threshold offset or some government payments. Superannuation contributions and salary sacrifice amounts are deducted before calculating repayment income. Use your payslip or tax return to find your 'repayment income' figure — it will be clearly marked by the ATO.",
  },
  {
    question: "When is HECS debt indexed?",
    answer:
      "Your HECS-HELP debt is indexed annually on 1 June each year based on the Consumer Price Index (CPI). From 2023, indexation is capped at the lower of CPI or the Wage Price Index (WPI). Indexation is applied BEFORE that year's repayment is deducted, so making a voluntary repayment before 1 June reduces the amount that gets indexed. Indexation is not interest — it preserves the real value of your debt.",
  },
  {
    question: "Can I make voluntary HECS repayments?",
    answer:
      "Yes, you can make voluntary HECS-HELP repayments at any time with a minimum of $500. Voluntary repayments made before 1 June reduce the balance that gets indexed that year, saving you money in indexation costs. However, HECS debt typically has a low real cost (only CPI indexation), so if you can earn higher returns elsewhere (shares, super, paying down high-interest debt), voluntary repayments may not be the best use of your money. There is no discount bonus for voluntary repayments (that ended in 2022).",
  },
  {
    question: "What happens to my HECS debt if I go overseas?",
    answer:
      "If you leave Australia and work overseas, the Overseas Levy may apply to your HECS debt. This 10% levy is added to your mandatory repayment if your overseas income exceeds the repayment threshold (currently $54,435). So you would repay both the tiered rate (1-10%) PLUS an additional 10%. The levy applies to residents working overseas for more than a temporary visit. You must declare your overseas income to the ATO.",
  },
  {
    question: "Does HECS debt affect my borrowing capacity?",
    answer:
      "Yes, significantly. When you apply for a mortgage or personal loan, banks assess your HECS-HELP repayment as a mandatory expense. This reduces your borrowing capacity by roughly $25,000 to $40,000 depending on your debt level and the lender. For example, a $50,000 HECS debt with a 5% repayment rate ($2,500/year) could reduce your home loan borrowing by approximately $30,000. Paying down HECS debt before applying for a mortgage can improve your borrowing power.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HECS-HELP Repayment Calculator Australia 2026",
  description:
    "Free HECS-HELP repayment calculator. Enter your debt balance and income to see when you'll be debt free using ATO's official 2025-26 repayment thresholds.",
  url: "https://au-calculators.vercel.app/calculators/hecs-repayment",
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
  featureList: [
    "2025-26 ATO HECS-HELP repayment threshold calculations",
    "Year-by-year debt projection with CPI indexation",
    "Customizable income growth assumptions",
    "Voluntary repayment option",
    "Interactive debt clearing timeline",
    "Repayment rate tier lookup",
  ],
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
      name: "AU Calculators",
      item: "https://au-calculators.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "HECS-HELP Repayment Calculator",
      item: "https://au-calculators.vercel.app/calculators/hecs-repayment",
    },
  ],
};

export default function HecsRepaymentPage() {
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
            HECS-HELP Repayment Calculator 2026
          </h1>
          <p className="text-gray-600">
            Calculate your HECS-HELP student loan repayments using the
            2025&ndash;26 ATO repayment thresholds. See when you&rsquo;ll be
            debt free, how much you&rsquo;ll repay each year, and the true cost
            of CPI indexation on your debt.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <HECSCalculator />

            <AdUnit
              slot="below-results"
              format="horizontal"
              className="mt-8"
            />
          </div>

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

        {/* Related Calculators */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/calculators/income-tax"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Income Tax Calculator</p>
              <p className="text-gray-500 text-xs mt-1">Calculate your annual tax and take-home pay</p>
            </Link>
            <Link
              href="/calculators/super"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Super Contributions Calculator</p>
              <p className="text-gray-500 text-xs mt-1">Model employer and voluntary super contributions</p>
            </Link>
            <Link
              href="/calculators/contractor-vs-employee"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Contractor vs Employee</p>
              <p className="text-gray-500 text-xs mt-1">Compare contractor and PAYG take-home pay</p>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mt-12 border border-amber-200 rounded-xl p-6 bg-amber-50">
          <h3 className="font-semibold text-amber-900 mb-2">Disclaimer</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            This calculator provides estimates only and does not constitute financial advice. HECS-HELP repayment thresholds are based on 2025&ndash;26 ATO rates and may change each financial year. Indexation rates vary annually. Consult a qualified financial adviser for personalised advice.
          </p>
        </section>
      </div>
    </>
  );
}
