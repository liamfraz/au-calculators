import type { Metadata } from "next";
import Link from "next/link";
import MortgageOffsetCalculator from "../../mortgage-offset-calculator/calculator";
import AdUnit from "../../components/AdUnit";
import { SUBURBS_BY_CITY } from "./suburbs";

export const metadata: Metadata = {
  title:
    "Mortgage Offset Calculator Australia 2026 | See How Much You Save",
  description:
    "Free Australian mortgage offset calculator. See total interest saved, time cut from your loan, and compare offset accounts vs redraw facilities. Includes Big 4 bank offset products.",
  keywords: [
    "offset account calculator australia",
    "mortgage offset calculator",
    "is offset account worth it",
    "offset vs redraw",
    "home loan offset calculator",
    "offset account savings calculator",
    "mortgage offset savings australia",
    "offset account interest saved",
    "100 percent offset account",
    "best offset account australia",
  ],
  openGraph: {
    title:
      "Mortgage Offset Calculator Australia 2026 — See How Much You Save",
    description:
      "Calculate how much interest an offset account saves on your home loan. Compare offset vs redraw, see AU bank offset products.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/calculators/mortgage-offset",
  },
};

const faqs = [
  {
    question: "How does a mortgage offset account work?",
    answer:
      "A mortgage offset account is a transaction account linked to your home loan. The balance in the offset account is deducted from your loan principal when calculating interest. For example, if you owe $500,000 and have $50,000 in your offset account, you only pay interest on $450,000. Your monthly repayment stays the same, but more of each payment goes toward reducing the principal instead of paying interest.",
  },
  {
    question: "Is a mortgage offset account worth it in Australia?",
    answer:
      "For most borrowers with savings of $20,000+, an offset account is worth it. On a $600,000 loan at 6.5%, keeping $50,000 in an offset account saves over $100,000 in interest and cuts years off your loan. The key is whether the interest savings exceed any package fees (typically $0-$395/yr). Even with a $395 annual fee, the offset is worthwhile if your average balance stays above roughly $6,000-$8,000.",
  },
  {
    question: "What is the difference between offset and redraw?",
    answer:
      "An offset account is a separate transaction account — your money sits alongside the loan and reduces interest, but the loan balance itself doesn't change. A redraw facility lets you make extra repayments directly into the loan and withdraw them later. The critical difference is for investment properties: redrawing from an investment loan for personal use can make that portion of the interest non-tax-deductible, whereas an offset account preserves full deductibility.",
  },
  {
    question: "Can I have multiple offset accounts?",
    answer:
      "Some lenders allow multiple offset sub-accounts linked to one home loan, which is useful for budgeting (e.g., separate accounts for bills, savings, and daily spending). All balances are combined when calculating the offset against your loan. Check with your lender — not all products support multiple offset accounts.",
  },
  {
    question: "Does the offset account earn interest?",
    answer:
      "No — an offset account does not earn interest. Instead, it reduces the interest charged on your home loan by an equivalent amount. This is actually better than earning savings interest because savings interest is taxable income, while the offset benefit (reduced home loan interest) is not taxed. At a 6.5% home loan rate, the offset is equivalent to earning 6.5% on your savings, tax-free.",
  },
  {
    question:
      "Should I put my emergency fund in the offset account?",
    answer:
      "Yes — your offset account is the ideal place for your emergency fund. The money remains fully accessible (debit card, transfers, BPay) while reducing your mortgage interest every day. Unlike a savings account where interest earned is taxed, the offset benefit is tax-free. There is no lock-up period and no penalty for withdrawals.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Mortgage Offset Calculator 2026",
  description:
    "Free mortgage offset calculator for Australian home loans. Calculate interest savings, time saved, and compare offset accounts vs redraw facilities.",
  url: "https://au-calculators.vercel.app/calculators/mortgage-offset",
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

const CITY_ORDER = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"];

export default function MortgageOffsetPage() {
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
            Mortgage Offset Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            See how much interest you can save with a mortgage offset account.
            Calculate total savings, time cut from your loan, and compare offset
            accounts vs redraw facilities across major Australian banks
            including Commonwealth Bank, ANZ, Westpac, NAB, and Macquarie.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <MortgageOffsetCalculator />

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

        {/* SEO Content: How offset accounts save you money */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How Offset Accounts Save You Money
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Daily Interest Reduction
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Australian home loans calculate interest daily on the
                outstanding balance. Every dollar in your offset account reduces
                that daily balance, so even parking your salary for a few weeks
                each month generates savings. The effect compounds — less
                interest means more principal paid, which means even less
                interest next month.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Tax-Free Equivalent Returns
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Money in a savings account earns taxable interest. Money in an
                offset account reduces your loan interest — which is not a
                taxable event. At a 6.5% loan rate and a 37% marginal tax rate,
                you would need a savings account paying over 10% to match the
                after-tax benefit of an offset. No savings account in Australia
                comes close.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Salary Parking Strategy
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A popular strategy is to have your salary deposited directly into
                the offset account and use a credit card (paid in full monthly)
                for daily expenses. Your full salary sits in the offset for up to
                55 days before being used, maximising the average daily balance
                and reducing interest.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Investment Property Advantage
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                For investors, an offset account on a non-deductible home loan
                (PPOR) is often smarter than paying down the loan directly. It
                preserves the ability to later convert the loan to a deductible
                investment loan at the full original balance. Redrawing does not
                provide this benefit due to ATO tax ruling TR 2000/2.
              </p>
            </div>
          </div>
        </section>

        {/* Suburb calculators grouped by city */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Offset Calculator by Suburb
          </h2>
          <p className="text-gray-600 mb-6">
            Get suburb-specific offset savings estimates with pre-filled median
            property prices for 30 top Australian suburbs across Sydney,
            Melbourne, Brisbane, Perth, Adelaide, and Canberra.
          </p>
          {CITY_ORDER.map((city) => (
            <div key={city} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {city}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {(SUBURBS_BY_CITY[city] || []).map((suburb) => (
                  <Link
                    key={suburb.slug}
                    href={`/calculators/mortgage-offset/${suburb.slug}`}
                    className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {suburb.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {suburb.state}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
