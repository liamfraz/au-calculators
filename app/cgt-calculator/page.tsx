import type { Metadata } from "next";
import CapitalGainsTaxCalculator from "../calculators/capital-gains-tax/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Capital Gains Tax Calculator Australia 2026 — CGT on Property, Shares & Crypto",
  description:
    "Free Australian capital gains tax calculator. Calculate CGT on investment property, shares, and crypto. 50% CGT discount for 12+ month holdings, 33.3% for super funds. 2025-26 ATO tax brackets.",
  keywords: [
    "capital gains tax calculator australia",
    "cgt calculator australia",
    "cgt on investment property",
    "how to calculate capital gains tax",
    "capital gains tax calculator 2026",
    "cgt discount 50 percent",
    "capital gains tax on shares australia",
    "capital gains tax crypto australia",
    "cgt calculator",
    "capital gains tax property australia",
    "cgt on rental property",
    "capital gains tax super fund",
    "cgt smsf discount",
  ],
  openGraph: {
    title:
      "Capital Gains Tax Calculator Australia 2026 — CGT on Property, Shares & Crypto",
    description:
      "Calculate CGT on investment property, shares, and crypto. Auto-detects 50% discount eligibility. Uses 2025-26 ATO tax brackets.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/cgt-calculator",
  },
};

const faqs = [
  {
    question:
      "How do I calculate capital gains tax on an investment property in Australia?",
    answer:
      "To calculate CGT on an investment property, subtract your cost base from the sale proceeds. The cost base includes the original purchase price, stamp duty paid on acquisition, legal fees, capital improvements (renovations, extensions), and selling costs (agent commissions, advertising, legal fees). If you held the property for more than 12 months and you are an individual taxpayer, you can apply the 50% CGT discount — meaning only half the gain is added to your taxable income. The gain is then taxed at your marginal tax rate. For example, a $200,000 capital gain with the 50% discount means $100,000 is added to your income and taxed at your marginal rate.",
  },
  {
    question: "What is the 50% CGT discount and who qualifies?",
    answer:
      "The 50% CGT discount is available to Australian individual taxpayers and trusts who hold a CGT asset for at least 12 months before selling. It halves the taxable capital gain. For example, a $150,000 gain becomes a $75,000 taxable gain. Self-managed super funds (SMSFs) receive a reduced discount of one-third (33.33%), so a $150,000 gain becomes a $100,000 taxable gain. Companies do not qualify for any CGT discount — the full gain is taxed at the company tax rate (25% for base-rate entities). The discount applies to investment property, shares, ETFs, managed funds, and cryptocurrency held for 12+ months.",
  },
  {
    question: "How is capital gains tax calculated in Australia for 2025-26?",
    answer:
      "CGT in Australia is calculated in four steps: (1) Determine the capital gain by subtracting the cost base (purchase price + stamp duty + legal fees + improvements + selling costs) from the sale price. (2) Apply any capital losses from the same or prior years. (3) Apply the CGT discount if eligible — 50% for individuals holding 12+ months, 33.33% for SMSFs, 0% for companies. (4) Add the net capital gain to your other taxable income and calculate tax at your marginal rate using the 2025-26 ATO tax brackets: 0% up to $18,200, 16% from $18,201 to $45,000, 30% from $45,001 to $135,000, 37% from $135,001 to $190,000, and 45% above $190,001.",
  },
  {
    question: "Do I pay CGT on my primary residence in Australia?",
    answer:
      "Your main residence (primary home) is generally fully exempt from CGT under the main residence exemption. To qualify, the property must have been your home for the entire ownership period, you must not have used it to produce assessable income (such as renting it out), and the land must be under 2 hectares. If you move out and rent the property, the 6-year absence rule may allow you to maintain the full exemption for up to 6 years, provided you do not claim another property as your main residence. Partial exemptions apply if the property was your home for only part of the ownership period. Refer to ATO guide NAT 4152 for full details.",
  },
  {
    question: "What selling costs can I include in my CGT cost base?",
    answer:
      "Selling costs that reduce your capital gain include real estate agent commissions (typically 1.5–3% of the sale price), solicitor or conveyancer fees, auctioneer fees, advertising and marketing costs, styling and staging expenses, building and pest inspection reports obtained for the sale, and any repair costs required to fulfil the sale contract. You can also include costs of acquisition in the cost base: stamp duty on purchase, legal fees, valuation fees, and search fees. Capital improvements (renovations, extensions, structural work) are also included but day-to-day repairs and maintenance are not.",
  },
  {
    question:
      "How does CGT work for companies and self-managed super funds (SMSFs)?",
    answer:
      "Companies pay CGT on the full capital gain at the company tax rate of 25% for base-rate entities (aggregated turnover under $50 million) or 30% otherwise. Companies do not receive any CGT discount regardless of how long the asset was held. SMSFs pay tax at a flat 15% rate on capital gains, but if the asset was held for 12 months or more, the SMSF receives a one-third (33.33%) discount — meaning only two-thirds of the gain is taxable at 15%, giving an effective rate of 10%. Assets held in the pension phase of an SMSF are generally tax-free, including any capital gains.",
  },
  {
    question: "Can I offset capital losses against my income?",
    answer:
      "No. Capital losses can only be offset against capital gains — they cannot be deducted from other income such as salary, wages, or business income. If your capital losses exceed your capital gains in a financial year, the net loss is carried forward indefinitely to offset future capital gains. You must apply losses against gains before applying the 50% CGT discount. There is no time limit on carrying forward capital losses, but they must be reported in your tax return in the year they occur. The ATO requires you to keep records of all capital losses.",
  },
  {
    question:
      "What are the ATO rules for CGT on cryptocurrency in Australia?",
    answer:
      "The ATO treats cryptocurrency as a CGT asset. You trigger a CGT event when you sell crypto for AUD, trade one crypto for another, use crypto to purchase goods or services, or gift crypto. The 50% CGT discount applies if you held the crypto for at least 12 months. If you are a crypto trader (buying and selling frequently for profit), your gains may be assessed as ordinary income rather than capital gains. The ATO receives data from Australian crypto exchanges and uses data-matching programs to identify taxpayers who have not reported crypto gains.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Capital Gains Tax Calculator Australia 2026",
  description:
    "Free Australian CGT calculator. Calculate capital gains tax on investment property, shares, and crypto with 50% discount for 12+ month holdings. Uses 2025-26 ATO tax brackets.",
  url: "https://au-calculators.vercel.app/cgt-calculator",
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

export default function CgtCalculatorPage() {
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
            Capital Gains Tax Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your Australian capital gains tax on investment property,
            shares, crypto, and other CGT assets. Enter your purchase and sale
            details, capital improvements, and selling costs. The calculator
            automatically applies the{" "}
            <strong>50% CGT discount</strong> for individuals holding 12+ months,{" "}
            <strong>33.3% for super funds</strong>, and uses official 2025-26
            ATO tax brackets to estimate your tax payable.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CapitalGainsTaxCalculator />

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

        {/* Example Calculation Walkthrough */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Example: CGT on an Investment Property
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-blue-900 mb-4">
              Sarah (individual taxpayer, $90,000 salary) bought an investment
              property in March 2023 and sold it in June 2026:
            </p>
            <table className="w-full text-sm mb-4">
              <tbody className="divide-y divide-blue-100">
                <tr>
                  <td className="py-2 text-blue-800">Purchase Price</td>
                  <td className="py-2 text-right font-medium text-blue-900">
                    $600,000
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">Sale Price</td>
                  <td className="py-2 text-right font-medium text-blue-900">
                    $780,000
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">
                    Capital Improvements (new kitchen)
                  </td>
                  <td className="py-2 text-right font-medium text-blue-900">
                    −$25,000
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">
                    Selling Costs (agent 2% + legal)
                  </td>
                  <td className="py-2 text-right font-medium text-blue-900">
                    −$17,600
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 text-blue-900">
                    Gross Capital Gain
                  </td>
                  <td className="py-2 text-right text-blue-900">
                    $137,400
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">
                    Less: 50% CGT Discount (held 3+ years)
                  </td>
                  <td className="py-2 text-right font-medium text-green-700">
                    −$68,700
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 text-blue-900">
                    Net Taxable Capital Gain
                  </td>
                  <td className="py-2 text-right text-blue-900">
                    $68,700
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">
                    Added to $90,000 salary → total taxable income $158,700
                  </td>
                  <td className="py-2 text-right font-medium text-blue-900" />
                </tr>
                <tr className="font-semibold text-red-700">
                  <td className="py-2">Estimated CGT Payable</td>
                  <td className="py-2 text-right">~$22,300</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-blue-700">
              This example uses the &quot;enter taxable income&quot; method for
              the most accurate result. The gain pushes part of Sarah&apos;s
              income into the 37% bracket ($135,001–$190,000). Medicare levy of
              2% is not included.
            </p>
          </div>
        </section>

        {/* CGT Discount Comparison Table */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            CGT Discount by Entity Type
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">
                    Entity Type
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-900">
                    CGT Discount
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-900">
                    Tax Rate
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-900">
                    Effective CGT Rate*
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-700">Individual</td>
                  <td className="px-4 py-3 text-right font-medium">50%</td>
                  <td className="px-4 py-3 text-right">Marginal rate (0–45%)</td>
                  <td className="px-4 py-3 text-right">0–22.5%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Trust (to individuals)</td>
                  <td className="px-4 py-3 text-right font-medium">50%</td>
                  <td className="px-4 py-3 text-right">Beneficiary&apos;s marginal rate</td>
                  <td className="px-4 py-3 text-right">0–22.5%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">SMSF</td>
                  <td className="px-4 py-3 text-right font-medium">33.33%</td>
                  <td className="px-4 py-3 text-right">15%</td>
                  <td className="px-4 py-3 text-right">10%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Company</td>
                  <td className="px-4 py-3 text-right font-medium">0%</td>
                  <td className="px-4 py-3 text-right">25% (base rate) / 30%</td>
                  <td className="px-4 py-3 text-right">25–30%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            *Effective rate assumes asset held 12+ months. Individuals&apos;
            effective rate depends on marginal bracket. Medicare levy (2%) not
            included.
          </p>
        </section>

        {/* ATO Reference Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ATO Capital Gains Tax Rules
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4 text-sm text-gray-700">
            <p>
              The Australian Taxation Office (ATO) administers capital gains tax
              as part of the income tax system. CGT is not a separate tax — your
              net capital gain is added to your assessable income and taxed at
              your marginal rate.
            </p>
            <p>
              Key ATO resources for capital gains tax:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>ATO CGT guide</strong> — comprehensive guide to capital
                gains tax events, cost base elements, and exemptions (NAT 4152)
              </li>
              <li>
                <strong>CGT discount rules</strong> — eligibility criteria for
                the 50% individual discount and 33.33% super fund discount
              </li>
              <li>
                <strong>Main residence exemption</strong> — rules for the
                principal place of residence exemption and 6-year absence rule
              </li>
              <li>
                <strong>Record keeping</strong> — the ATO requires you to keep
                CGT records for 5 years after the CGT event occurs
              </li>
              <li>
                <strong>Small business CGT concessions</strong> — 15-year
                exemption, 50% active asset reduction, retirement exemption, and
                rollover relief for eligible businesses
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              For the most up-to-date CGT information, visit the{" "}
              <a
                href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                ATO Capital Gains Tax page
              </a>
              . This calculator provides estimates only — consult a registered
              tax agent for advice specific to your situation.
            </p>
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
