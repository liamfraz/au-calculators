import type { Metadata } from "next";
import SuperCoContributionCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Super Co-contribution Calculator Australia 2025 | Government Boost",
  description:
    "Calculate your government super co-contribution for 2024-25. See how much the ATO will add to your super when you make a personal after-tax contribution. Free, instant estimate — income thresholds $45,400 to $60,400.",
  keywords: [
    "super co-contribution calculator",
    "government super co-contribution",
    "super co-contribution 2025",
    "super co-contribution australia",
    "ATO co-contribution calculator",
    "super co-contribution eligibility",
    "government super boost calculator",
    "low income super co-contribution",
    "personal super contribution government match",
    "super co-contribution threshold 2025",
  ],
  openGraph: {
    title: "Super Co-contribution Calculator Australia 2025",
    description:
      "Calculate your 2024-25 government super co-contribution. See how much the ATO adds to your super based on your income and personal contribution.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/calculators/super-co-contribution",
  },
};

const faqs = [
  {
    question: "What is the super co-contribution?",
    answer:
      "The super co-contribution is a government program where the ATO adds money to your superannuation when you make a personal after-tax (non-concessional) contribution. For every $1 you contribute, the government adds up to 50 cents — up to a maximum of $500 per year. The benefit is only available if your total income is below $60,400 for the 2024-25 financial year.",
  },
  {
    question: "Who is eligible for the super co-contribution?",
    answer:
      "To be eligible you must: (1) make a personal after-tax super contribution during the financial year, (2) have total income below $60,400 (2024-25), (3) be under age 71 at the end of the financial year, (4) have a super fund that is not a defined benefit scheme, (5) lodge your tax return for the year, and (6) have less than 10% of your income from eligible employment (salary and wages or business income). The ATO automatically assesses eligibility when you lodge your return.",
  },
  {
    question: "How much is the government co-contribution for 2024-25?",
    answer:
      "The maximum co-contribution is $500 for 2024-25. You receive the full $500 if your total income is $45,400 or less and you contribute at least $1,000 to your super. The benefit reduces proportionally if your income is between $45,400 and $60,400. For example, at $52,900 income (halfway through the phase-out range), your maximum entitlement is approximately $250.",
  },
  {
    question: "What income is included in the 'total income' threshold?",
    answer:
      "The income test for super co-contribution includes: salary and wages, business income, rental income, investment income (dividends, interest, capital gains), reportable employer super contributions (amounts your employer contributed above the SG minimum), and reportable fringe benefits. It does not include employer SG contributions (the compulsory 11.5%). The ATO calculates this automatically from your tax return.",
  },
  {
    question: "How do I make an eligible personal super contribution?",
    answer:
      "Log in to your super fund's member portal and make a personal contribution from your after-tax bank account. Ensure you do NOT lodge a 'Notice of Intent to Claim a Deduction' for this contribution — if you claim a deduction, it becomes a concessional contribution and is no longer eligible for the co-contribution. The contribution must be received by your fund by 30 June of the relevant financial year.",
  },
  {
    question: "When is the co-contribution paid?",
    answer:
      "The co-contribution is paid automatically by the ATO after you lodge your tax return. The ATO matches your personal contribution against your income and pays the co-contribution directly into your super fund — usually within a few months of lodging your return. You do not need to apply separately; it is assessed automatically.",
  },
  {
    question: "Does the co-contribution count toward the contribution caps?",
    answer:
      "No — the government co-contribution does not count toward either the concessional ($30,000) or non-concessional ($120,000) contribution caps. Only your personal contribution counts toward the non-concessional cap. This makes the co-contribution essentially free extra money in your super.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Super Co-contribution Calculator Australia 2025",
  description:
    "Calculate your 2024-25 government super co-contribution. Enter your income and personal contribution to see how much the ATO will add to your super fund.",
  url: "https://au-calculators.vercel.app/calculators/super-co-contribution",
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

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate Your Super Co-contribution",
  description:
    "Steps to estimate the government co-contribution you can receive for your personal super contribution.",
  step: [
    {
      "@type": "HowToStep",
      name: "Enter your total income",
      text: "Enter your total income for 2024-25, including salary, investment income, and reportable fringe benefits. The co-contribution is available if income is below $60,400.",
    },
    {
      "@type": "HowToStep",
      name: "Enter your personal super contribution",
      text: "Enter the after-tax (non-concessional) amount you plan to contribute to your super fund. Do not include employer SG or salary sacrifice amounts.",
    },
    {
      "@type": "HowToStep",
      name: "View your government co-contribution",
      text: "The calculator shows the government co-contribution (up to $500), your total super boost, and the optimal contribution amount to maximise the benefit.",
    },
    {
      "@type": "HowToStep",
      name: "Make your personal contribution",
      text: "Transfer the contribution directly to your super fund from your after-tax bank account before 30 June. Do not lodge a 'Notice of Intent to Claim a Deduction' or it will not be eligible.",
    },
    {
      "@type": "HowToStep",
      name: "Lodge your tax return",
      text: "The ATO automatically assesses your co-contribution entitlement when you lodge your tax return and pays it directly into your super fund.",
    },
  ],
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
      name: "Super Co-contribution Calculator",
      item: "https://au-calculators.vercel.app/calculators/super-co-contribution",
    },
  ],
};

export default function SuperCoContributionPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Super Co-contribution Calculator Australia 2025
          </h1>
          <p className="text-gray-600">
            Calculate your 2024-25 government super co-contribution. The ATO adds up to{" "}
            <strong>$500</strong> to your super when you make a personal after-tax contribution — if
            your income is below $60,400.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <SuperCoContributionCalculator />

            {/* Info panel */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3">
                How to Claim Your Co-contribution
              </h2>
              <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside leading-relaxed">
                <li>
                  Log in to your super fund and make a personal contribution from your after-tax bank
                  account before <strong>30 June 2025</strong>.
                </li>
                <li>
                  Do <strong>not</strong> lodge a Notice of Intent to Claim a Tax Deduction — this
                  converts it to concessional and disqualifies the co-contribution.
                </li>
                <li>Lodge your 2024-25 tax return.</li>
                <li>
                  The ATO automatically assesses your entitlement and pays the co-contribution
                  directly into your super fund — no separate application needed.
                </li>
              </ol>
              <a
                href="https://www.ato.gov.au/individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/government-super-contributions/co-contributions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-sm font-medium text-blue-700 hover:text-blue-900 underline"
              >
                ATO Co-contribution Guide →
              </a>
            </div>

            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>

        {/* Info section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Super Co-contribution: Key Facts for 2024-25
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Income Thresholds</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The co-contribution is available for incomes below{" "}
                <strong>$60,400 (2024-25)</strong>. You receive the full $500 maximum if your income
                is $45,400 or less. Between $45,400 and $60,400, the benefit phases out gradually.
                Above $60,400, no co-contribution is payable.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Maximum Benefit</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The government contributes <strong>50 cents for every $1</strong> you contribute, up
                to a maximum of <strong>$500 per year</strong>. To receive the full $500, you need to
                earn $45,400 or less and contribute at least $1,000 of your own money after tax.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Does Not Affect Caps</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The government co-contribution does not count toward your concessional ($30,000) or
                non-concessional ($120,000) contribution caps. It is essentially free extra money
                added to your super — a 50% guaranteed return on your after-tax contribution up to
                $1,000.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Automatic Assessment</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                You do not need to apply for the co-contribution. After you lodge your tax return, the
                ATO automatically checks your eligibility and transfers the co-contribution directly
                to your super fund. Ensure your super fund has your Tax File Number (TFN) registered
                — otherwise the fund may not accept the payment.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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
