import type { Metadata } from "next";
import Link from "next/link";
import SuperannuationRetirementCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Superannuation Calculator Australia 2026 — Project Your Retirement Balance",
  description:
    "Calculate your projected superannuation balance at retirement. Updated for 11.5% SG rate 2026. Free AU super calculator.",
  keywords: [
    "superannuation calculator",
    "super retirement calculator australia",
    "retirement projection calculator",
    "super balance at retirement",
    "ASFA comfortable retirement",
    "4% rule calculator australia",
    "how much super do i need",
  ],
  openGraph: {
    title:
      "Superannuation Calculator Australia 2026 — Project Your Retirement Balance",
    description:
      "Calculate your projected superannuation balance at retirement. Updated for 11.5% SG rate 2026. Free AU super calculator.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/superannuation-calculator",
  },
};

const faqs = [
  {
    question: "How does this superannuation calculator work?",
    answer:
      "This calculator projects your superannuation balance at your chosen retirement age by adding employer Superannuation Guarantee (SG) contributions, your voluntary contributions, and investment returns year by year. The employer SG contribution is 11.5% in 2025–26, rising to 12% from 2026–27. All contributions and returns are compounded annually at your nominated investment return rate. The projection uses real dollars (not inflation-adjusted).",
  },
  {
    question: "What is the ASFA comfortable retirement standard?",
    answer:
      "The ASFA (Association of Superannuation Funds of Australia) comfortable retirement standard is the amount of annual income needed to support a comfortable lifestyle in retirement. As of 2025, ASFA estimates a single person needs $51,278/year and a couple needs $72,148/year. These figures assume you own your home outright, are in good health, and are willing to spend moderately on hobbies and leisure. ASFA reviews these standards annually.",
  },
  {
    question: "What is the 4% drawdown rule?",
    answer:
      "The 4% rule is a retirement planning benchmark suggesting you can withdraw 4% of your retirement portfolio in your first year and adjust for inflation thereafter, while maintaining the balance over a 25+ year retirement. For example, if your retirement balance is $1 million, annual withdrawals would be $40,000. This calculator applies a simple 4% rule: dividing your projected balance by 25 (approximately). While widely used, the actual safe withdrawal rate depends on your circumstances, asset allocation, and inflation.",
  },
  {
    question: "What is the employer SG rate in 2025–26?",
    answer:
      "The employer Superannuation Guarantee (SG) rate in 2025–26 is 11.5% of ordinary time earnings. This rate is rising gradually and will reach 12% from 1 July 2026. This is compulsory — employers must contribute this amount to their employees&apos; super accounts regardless of whether employees make voluntary contributions.",
  },
  {
    question: "Do voluntary contributions grow the same way?",
    answer:
      "Yes. After-tax (non-concessional) and salary sacrifice contributions are treated the same as employer SG contributions once inside your superannuation fund. They are invested according to your chosen investment option (e.g., balanced, growth, conservative) and earn returns at the same rate as all other funds in your account. Both types are subject to contribution caps and tax rules.",
  },
  {
    question:
      "What investment return rate should I use?",
    answer:
      "The default 7% p.a. reflects long-term historical averages for Australian superannuation funds with a balanced investment option (mix of shares, bonds, and property). However, actual returns vary: growth portfolios may average 7–8%, while conservative ones average 4–5%. Your fund&apos;s annual report shows historical returns. Remember that past performance doesn&apos;t guarantee future results — consider your risk tolerance and investment time horizon when choosing a rate.",
  },
  {
    question:
      "What does 'projected annual income in retirement' mean?",
    answer:
      "This is the amount you can withdraw each year in retirement using the 4% rule. It&apos;s calculated as: Projected balance ÷ 25 (or × 4%). For example, if your balance at retirement is $1 million, your annual income is approximately $40,000. This assumes you draw down evenly each year and don&apos;t supplement with age pension, investment income, or other sources. Actual retirement spending varies widely based on lifestyle, health, and longevity.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Superannuation Retirement Calculator Australia 2026",
  description:
    "Project your superannuation balance at retirement. See how your super grows, estimated annual retirement income using the 4% rule, and ASFA comfortable retirement comparison.",
  url: "https://au-calculators.vercel.app/superannuation-calculator",
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

export default function SuperannuationCalculatorPage() {
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
            Superannuation Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Project your superannuation balance at retirement and see if
            you&apos;ll meet the ASFA comfortable retirement standard. This
            calculator accounts for employer SG contributions, your voluntary
            contributions, and compound investment returns over time. See how
            much super you&apos;ll have at retirement and estimate your annual
            retirement income using the 4% drawdown rule.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <SuperannuationRetirementCalculator />

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
            href="/calculators/super"
            className="text-blue-600 hover:underline"
          >
            Super Contribution Calculator
          </Link>{" "}
          ·{" "}
          <Link
            href="/calculators/income-tax"
            className="text-blue-600 hover:underline"
          >
            Income Tax Calculator
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
