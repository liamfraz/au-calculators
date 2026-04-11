import type { Metadata } from "next";
import SMSFCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "SMSF Balance Projection Calculator Australia 2025 | Self-Managed Super Fund",
  description: "Free SMSF balance projection calculator for Australia. Project your Self-Managed Super Fund balance at retirement with contributions, investment returns, fees and tax.",
  keywords: ["SMSF calculator", "self-managed super fund calculator", "SMSF balance projection", "SMSF retirement calculator Australia", "SMSF investment calculator", "super fund balance calculator"],
  openGraph: {
    title: "SMSF Balance Projection Calculator",
    description: "Project your SMSF balance and retirement income with our free Australian calculator",
    url: "https://au-calculators.vercel.app/calculators/smsf-balance-projection",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/calculators/smsf-balance-projection",
  },
};

export default function SMSFBalanceProjectionPage() {
  const faqs = [
    {
      question: "How much do I need to start an SMSF?",
      answer: "The ATO recommends a minimum balance of $200,000–$500,000 to make an SMSF cost-effective. With $200,000, annual compliance costs of $2,500–$3,500 represent 1.25–1.75% of your balance — significantly higher than most retail or industry super funds charging 0.3–1.5% in total fees. Once your balance exceeds $500,000, the percentage cost drops considerably.",
    },
    {
      question: "What is the concessional contribution cap for 2025/26?",
      answer: "The concessional contribution cap for 2025/26 is $30,000 per year. This includes all pre-tax contributions: employer Super Guarantee (11.5% in 2025/26), salary sacrifice, and personal contributions you claim a tax deduction for. Concessional contributions are taxed at 15% inside the fund, which is advantageous if your marginal tax rate is higher.",
    },
    {
      question: "How is SMSF balance projected in this calculator?",
      answer: "This calculator projects your SMSF balance year-by-year. Each year: (1) your annual contributions are added to your balance, (2) investment earnings are calculated at your stated return rate, (3) the 15% tax on earnings is deducted, and (4) annual fees (as a % of balance) are deducted. This gives a realistic net balance after costs — not just gross return. The 4% Safe Withdrawal Rate (SWR) estimate assumes you draw 4% of your retirement balance per year.",
    },
    {
      question: "What investment return should I use for my SMSF?",
      answer: "Australian SMSFs have historically returned 7–9% p.a. before fees for balanced investment strategies. The ASX 200 has returned approximately 9.5% p.a. over 30 years (including dividends). A conservative estimate of 6–7% p.a. accounts for potential lower-return environments. SMSFs holding property or direct shares may experience more volatile returns. Use 5–6% for conservative/balanced, 7–8% for growth-oriented portfolios.",
    },
    {
      question: "Is an SMSF right for me?",
      answer: "An SMSF suits people who: (1) have $250,000+ in super and want more investment control, (2) want to hold direct property, ASX shares, or alternative assets not available in retail funds, (3) are willing to take on trustee responsibilities and compliance obligations, (4) have the time and interest to manage their own fund. If you have less than $200,000 or don't want the compliance burden, an industry or retail fund is likely more cost-effective.",
    },
    {
      question: "What is the 4% Safe Withdrawal Rate?",
      answer: "The 4% Safe Withdrawal Rate (SWR) is a retirement planning rule suggesting you can withdraw 4% of your portfolio per year without depleting it over a 30-year retirement. For example, a $1,000,000 SMSF balance would support $40,000/year in drawdowns. In pension phase (after 60), SMSF earnings and withdrawals are tax-free, making the 4% rule particularly effective. The minimum pension drawdown from an SMSF is 4% under age 65.",
    },
    {
      question: "What are SMSF running costs in Australia?",
      answer: "Typical annual SMSF costs include: ATO supervisory levy ($259/year), annual audit ($500–$1,200), accounting and tax return ($1,500–$3,000), and ASIC fees (if a company trustee). Total annual compliance costs typically range from $2,000–$3,500. Some SMSFs also pay for financial advice, investment platforms, or insurance. Our calculator uses an annual fee percentage — at $500,000 balance with $2,500 in costs, that's 0.5% p.a.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SMSF Balance Projection Calculator",
            url: "https://au-calculators.vercel.app/calculators/smsf-balance-projection",
            description: "Free SMSF balance projection calculator for Australia",
            applicationCategory: "FinanceApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "AUD",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          SMSF Balance Projection Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Project your Self-Managed Super Fund balance at retirement with contributions, investment returns, and costs
        </p>
      </div>

      {/* Main Layout: Calculator + Ads */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Ad: Above Calculator */}
          <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

          {/* Calculator */}
          <SMSFCalculator />

          {/* Ad: Below Results */}
          <AdUnit slot="below-results" format="horizontal" className="mt-8" />
        </div>

        {/* Sidebar Ad */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-24">
            <AdUnit slot="sidebar" format="vertical" />
          </div>
        </aside>
      </div>

      {/* Understanding SMSF Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Understanding SMSF in Australia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Contribution Caps */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">
              Contribution Caps 2025/26
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <strong>Concessional:</strong> $30,000/year (includes employer SG + salary sacrifice + personal deductible)
              </li>
              <li>
                <strong>Non-concessional:</strong> $120,000/year (or $360,000 over 3 years using bring-forward rule)
              </li>
              <li className="text-amber-700 bg-amber-50 p-2 rounded">
                Exceeding caps triggers 47% extra tax — use the cap as your contribution limit
              </li>
            </ul>
          </div>

          {/* Card 2: Setup & Running Costs */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">
              SMSF Setup & Running Costs
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <strong>Setup:</strong> $1,500–$3,000 one-off (legal docs, ATO registration)
              </li>
              <li>
                <strong>Annual:</strong> $2,000–$3,500/year (accountant, audit, ASIC fees)
              </li>
              <li className="text-blue-700 bg-blue-50 p-2 rounded">
                Generally need $250K+ to make SMSF cost-competitive vs retail super
              </li>
            </ul>
          </div>

          {/* Card 3: Tax Advantages */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">
              SMSF Tax Advantages
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>15% tax on concessional contributions (vs your marginal rate)</li>
              <li>15% tax on investment earnings in accumulation phase</li>
              <li>0% tax on earnings in pension phase (after age 60)</li>
              <li>33% capital gains discount (effective 10% CGT rate if held 12+ months)</li>
            </ul>
          </div>

          {/* Card 4: Investment Rules */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">
              SMSF Investment Rules
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>Must diversify — cannot invest all funds in one asset</li>
              <li>Cannot acquire assets from related parties (except listed shares)</li>
              <li>Sole purpose test: investments must be for retirement benefits only</li>
              <li className="text-red-700 bg-red-50 p-2 rounded">
                Trustees have personal liability — get professional SMSF advice
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Is SMSF Right for You */}
      <section className="mb-12">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            Is an SMSF Right for You?
          </h2>
          <p className="text-indigo-800 mb-6">
            Check these criteria to see if an SMSF suits your situation:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-indigo-900 mb-3">Good Fit for SMSF</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Balance over $250,000 and growing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Want to hold direct property or specific ASX shares</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Comfortable with trustee/compliance obligations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Want maximum investment control and flexibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Willing to seek professional advice (accountant, auditor)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-3">Better to Use Retail Super</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Balance under $200,000 (compliance costs too high %)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Not willing to spend time on fund administration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Want simple, low-effort retirement saving</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Prefer hands-off investment (delegated to fund manager)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Don&apos;t have $250K+ in investable super yet</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <summary className="font-semibold text-gray-900 hover:text-blue-700 transition-colors">
                {faq.question}
              </summary>
              <p className="text-gray-700 mt-3 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600">
          <strong>Disclaimer:</strong> This calculator provides estimates only and does not constitute financial advice. Please consult a qualified financial adviser or SMSF accountant before making any decisions about contributions, investments, or fund structure. ATO rules and contribution caps are correct as of April 2025.
        </p>
      </div>
    </div>
  );
}
