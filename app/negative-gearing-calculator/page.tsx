import type { Metadata } from "next";
import NegativeGearingCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Negative Gearing Calculator Australia 2026 | Property Tax Deduction Tool",
  description:
    "Free Australian negative gearing calculator — calculate your rental loss, tax deduction, after-tax holding cost, and break-even yield. Compare benefits across tax brackets with FY2025-26 rates.",
  keywords: [
    "negative gearing calculator",
    "negative gearing calculator australia",
    "is negative gearing worth it",
    "how does negative gearing work",
    "negative gearing tax deduction",
    "negative gearing property investment",
    "rental property tax deduction australia",
    "investment property tax calculator",
    "negative gearing benefits",
    "property investment calculator australia",
    "rental loss tax deduction",
    "negatively geared property calculator",
  ],
  openGraph: {
    title:
      "Negative Gearing Calculator Australia 2026 | Property Tax Deduction Tool",
    description:
      "Calculate your rental property's negative gearing tax benefit. See your annual rental loss, tax deduction value, and after-tax holding cost with FY2025-26 rates.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/negative-gearing-calculator",
  },
};

const faqs = [
  {
    question: "What is negative gearing in Australia?",
    answer:
      "Negative gearing occurs when the costs of owning a rental property (mortgage interest, rates, insurance, management fees, repairs, depreciation) exceed the rental income it generates. The resulting net rental loss can be deducted from your other income — such as your salary — reducing your total taxable income and therefore your tax bill. For example, if your property earns $28,600 in rent but costs $42,000 in deductible expenses, you have a $13,400 rental loss. At the 30% marginal rate plus 2% Medicare levy, that saves you $4,288 in tax.",
  },
  {
    question: "How does negative gearing reduce my taxable income?",
    answer:
      "Australia allows rental losses to be offset against all other assessable income — not just rental income. If you earn $100,000 in salary and have a $13,400 net rental loss, your taxable income drops to $86,600. You then pay tax on $86,600 instead of $100,000, which at the 30% + 2% Medicare rate saves approximately $4,288. The higher your marginal tax rate, the greater the dollar benefit from the same rental loss. This is why negative gearing is most advantageous for higher-income earners in the 37% or 45% brackets.",
  },
  {
    question: "Is negative gearing worth it in 2026?",
    answer:
      "Whether negative gearing is worth it depends on several factors: your marginal tax rate, the size of the rental loss, expected capital growth, and your investment time horizon. Negative gearing reduces your annual holding cost through tax savings, but you are still spending more on the property than it earns in rent — you are betting on capital growth to deliver total returns. In 2025-26, with interest rates around 6%, typical negative gearing losses are larger than during low-rate periods. A property that costs $150/week after tax to hold needs strong capital growth (5%+ per year) to justify the ongoing cash drain. Always model the numbers before committing.",
  },
  {
    question: "What expenses can I claim on a negatively geared property?",
    answer:
      "Deductible expenses on a rental property include: mortgage interest (not principal repayments), council rates, water charges, landlord insurance, property management fees (typically 7-10% of rent), repairs and maintenance (but not capital improvements), depreciation of the building (Division 43 — 2.5% per year for properties built after 1987) and plant and equipment (Division 40), advertising for tenants, legal fees, strata levies, pest inspections, and travel costs that comply with ATO rules. Capital works (renovations, extensions) cannot be claimed immediately but may be depreciated over 40 years. Get a quantity surveyor's depreciation schedule to maximise your deductions.",
  },
  {
    question:
      "What is the difference between negative gearing and positive gearing?",
    answer:
      "A negatively geared property has total expenses exceeding rental income, resulting in a net loss that reduces your taxable income. A positively geared property earns more in rent than its total expenses, producing a net profit that is added to your taxable income. Neutral gearing is when income and expenses roughly balance. Positive gearing generates immediate cash flow but increases your tax bill. Negative gearing reduces tax but costs money out of pocket each year. The strategy you choose depends on whether you prioritise cash flow now (positive) or tax-advantaged capital growth over time (negative).",
  },
  {
    question: "How much does negative gearing save on tax?",
    answer:
      "The tax saving equals your net rental loss multiplied by your marginal tax rate (including Medicare levy). For a $15,000 rental loss: at 16% + 2% = $2,700 saving; at 30% + 2% = $4,800 saving; at 37% + 2% = $5,850 saving; at 45% + 2% = $7,050 saving. Higher earners benefit most in dollar terms. However, the tax saving is always less than the rental loss — you never 'profit' from negative gearing through tax alone. The strategy relies on capital growth to deliver overall returns.",
  },
  {
    question: "What is depreciation and why does it matter for negative gearing?",
    answer:
      "Depreciation is a non-cash deduction that accounts for the wear and tear of the building structure (Division 43 — 2.5% per year for 40 years on properties built after 1985) and plant and equipment items like carpets, blinds, hot water systems, and air conditioning (Division 40 — various rates). Because depreciation is a paper expense — no cash leaves your pocket — it increases your deductible expenses and therefore your rental loss without costing you anything. A typical depreciation claim on a relatively new investment property might be $8,000-$15,000 per year in the early years. A quantity surveyor's report (costing $400-$800) is required to claim depreciation.",
  },
  {
    question: "Will the government change negative gearing rules?",
    answer:
      "Negative gearing has been a politically contested topic in Australia for years. Labor took a policy to restrict negative gearing to new builds only to the 2019 election but lost, and subsequently dropped the policy. As of 2025-26, there are no legislated changes to negative gearing. Both major parties have indicated no immediate plans to change the current rules, though housing affordability remains a key issue. Any future changes would likely be grandfathered for existing investments. Investors should be aware of policy risk but should not rely on negative gearing being abolished when making investment decisions.",
  },
  {
    question: "How do I calculate break-even rental yield?",
    answer:
      "Break-even rental yield is the gross yield at which rental income exactly covers all deductible expenses (including depreciation), resulting in zero net rental income — neither positive nor negative gearing. To calculate it: divide total annual deductible expenses by the property purchase price, then multiply by 100. For example, if total expenses are $42,000 on a $700,000 property, the break-even yield is 6.0%. If the actual gross yield is below this, the property is negatively geared. If above, it is positively geared. Our calculator shows the break-even weekly rent needed.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Negative Gearing Calculator Australia 2026",
  description:
    "Free Australian negative gearing calculator. Calculate your rental property's net loss, tax deduction, after-tax holding cost, and break-even yield with FY2025-26 tax rates.",
  url: "https://au-calculators.vercel.app/negative-gearing-calculator",
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

export default function NegativeGearingCalculatorPage() {
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
            Negative Gearing Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate whether your investment property is negatively geared and
            how much tax you could save. Enter your property details, rental
            income, loan interest, and expenses to see your net rental
            loss, tax deduction value, after-tax holding cost, and break-even
            yield. Compare the benefit across all FY2025-26 tax brackets.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <NegativeGearingCalculator />

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
            Understanding Negative Gearing in Australia
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                What Is Negative Gearing?
              </h3>
              <p>
                Negative gearing is an investment strategy where the costs of
                holding a rental property exceed the income it generates. The
                net rental loss is deducted from your other taxable income
                (salary, business income, etc.), reducing your overall tax bill.
                It is one of the most widely used property investment strategies
                in Australia, with over{" "}
                <strong>1.3 million Australians</strong> claiming net rental
                losses on their tax returns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                How the Tax Deduction Works
              </h3>
              <p>
                The ATO allows you to offset your rental loss against your
                salary and other income. If your property generates a{" "}
                <strong>$12,000 net rental loss</strong> and you earn $100,000
                in salary, your taxable income drops to $88,000. At the 30%
                marginal rate + 2% Medicare levy, that saves{" "}
                <strong>$3,840 in tax</strong>. The higher your marginal rate,
                the greater the tax benefit — which is why negative gearing
                disproportionately benefits higher-income earners.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                2025-26 Policy Context
              </h3>
              <p>
                Negative gearing remains unchanged for FY2025-26. There are no
                legislated restrictions on which properties can be negatively
                geared, and rental losses can still be offset against all
                income types. The Stage 3 tax cuts (effective from 1 July 2024)
                changed the marginal rates — notably the 30% bracket now covers
                $45,001 to $135,000, reducing the benefit slightly for some
                mid-range earners compared to the old 32.5% rate. Interest
                rates around 6% mean larger interest deductions and therefore
                larger rental losses than during the low-rate era.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                The Capital Growth Bet
              </h3>
              <p>
                Negative gearing is not free money — you are spending more on
                the property than it earns. The strategy only works if the
                property appreciates in value enough to offset the accumulated
                after-tax holding costs. A property costing $100/week after tax
                to hold costs <strong>$5,200/year</strong> or{" "}
                <strong>$52,000 over 10 years</strong>. The property needs to
                deliver at least that much in capital growth (after CGT) to
                break even. Always model worst-case scenarios — not just optimistic
                growth assumptions.
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
