import type { Metadata } from "next";
import InvestmentPropertyCashFlowCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Investment Property Cash Flow Calculator Australia 2026 | Rental Property Returns",
  description:
    "Free Australian investment property cash flow calculator. Calculate gross yield, net yield, cash-on-cash return, break-even rent, and negative gearing tax benefits using 2025-26 ATO brackets. Includes vacancy rate, council rates, strata, insurance, and management fees.",
  keywords: [
    "investment property calculator australia",
    "investment property cash flow",
    "rental property calculator australia",
    "investment property calculator australia 2026",
    "property cash flow calculator",
    "rental yield calculator australia",
    "negative gearing calculator",
    "cash on cash return property",
    "break even rent calculator",
    "investment property expenses australia",
    "property investment returns",
    "rental property cash flow analysis",
  ],
  openGraph: {
    title:
      "Investment Property Cash Flow Calculator Australia 2026 | Rental Property Returns",
    description:
      "Calculate investment property cash flow, yields, and negative gearing tax benefits. Free calculator with AU tax brackets and all property expenses.",
    type: "website",
  },
};

const faqs = [
  {
    question:
      "How do I calculate cash flow on an investment property in Australia?",
    answer:
      "To calculate investment property cash flow, subtract all annual expenses from your annual rental income. Expenses include mortgage repayments (principal and interest or interest only), council rates, water rates, insurance, strata fees, property management fees (typically 5-10% of rent), maintenance, land tax, and any other recurring costs. Don't forget to account for vacancy — most investors budget 2-4 weeks per year (roughly 3-5%). The result is your pre-tax cash flow. If it's positive, the property pays for itself; if negative, you have a shortfall that may be offset by negative gearing tax benefits.",
  },
  {
    question: "What is a good gross yield for an investment property?",
    answer:
      "In Australia, gross rental yields typically range from 2-3% in premium capital city suburbs to 6-10% in regional areas. A gross yield above 5% is generally considered solid for cash flow, while yields of 3-4% are common in growth-focused suburbs of Sydney and Melbourne. Remember that gross yield doesn't account for expenses — your net yield will always be lower. A property with a high gross yield but very high expenses (old building, high strata) may actually perform worse than one with a lower gross yield but minimal running costs.",
  },
  {
    question: "What is cash-on-cash return and why does it matter?",
    answer:
      "Cash-on-cash return measures the annual cash flow generated relative to the actual cash you invested (your deposit and purchase costs). For example, if you put down $130,000 and the property generates $5,000 per year in cash flow, your cash-on-cash return is 3.85%. This metric is crucial because it tells you how hard your actual money is working — a property might have a great yield on the full purchase price, but if you only put down 10%, leverage amplifies both returns and risks. Compare your cash-on-cash return against alternative investments like term deposits or shares.",
  },
  {
    question:
      "How does negative gearing reduce my tax in Australia?",
    answer:
      "Under Australian tax law, if your investment property's deductible expenses (interest, rates, insurance, depreciation, management fees, etc.) exceed rental income, the loss is offset against your other taxable income — salary, business income, etc. This reduces the tax you owe. The benefit is greater for higher income earners: at a 45% marginal rate (income over $190,000), every $1 of rental loss saves you 47 cents in tax (including Medicare levy). At 30% (income $45,001-$135,000), each dollar saves 32 cents. This calculator uses the 2025-26 ATO tax brackets to estimate your saving.",
  },
  {
    question: "What is the break-even rent for my investment property?",
    answer:
      "Break-even rent is the minimum weekly rent you need to charge so that rental income covers all property expenses including the mortgage, rates, insurance, management fees, maintenance, and vacancy allowance. If your actual rent is below the break-even amount, the property is negatively geared (cash flow negative). Knowing your break-even rent helps you assess risk: if market rents drop or vacancy increases, how much buffer do you have before the property costs you money? A property where current rent significantly exceeds break-even rent is more resilient to market changes.",
  },
  {
    question:
      "Should I choose interest-only or principal and interest for investment property?",
    answer:
      "Interest-only (IO) loans result in lower repayments and better cash flow because you're not repaying the principal. This maximises your tax-deductible interest and frees up cash for other investments. However, you don't build equity through repayments and the loan balance stays the same. After the IO period (typically 1-5 years), repayments increase significantly when you switch to P&I. Principal and interest (P&I) loans cost more per month but you build equity over time and pay less total interest. Many investors start with IO for cash flow and tax reasons, then reassess. Consult a mortgage broker for advice specific to your situation.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Investment Property Cash Flow Calculator Australia 2026",
  description:
    "Free investment property cash flow calculator for Australians. Calculate gross yield, net yield, cash-on-cash return, break-even rent, and negative gearing tax benefits with 2025-26 ATO brackets.",
  url: "https://au-calculators.vercel.app/calculators/investment-property-cashflow",
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
      name: "Investment Property Cash Flow Calculator",
      item: "https://au-calculators.vercel.app/calculators/investment-property-cashflow",
    },
  ],
};

export default function InvestmentPropertyCashFlowPage() {
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
            Investment Property Cash Flow Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your investment property cash flow, gross and net yields,
            cash-on-cash return, and break-even rent. Enter your purchase price,
            deposit, rental income (weekly), and all property expenses. Toggle
            negative gearing to see how rental losses offset your taxable income
            using 2025-26 ATO tax brackets.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <InvestmentPropertyCashFlowCalculator />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
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
      </div>
    </>
  );
}
