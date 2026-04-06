import type { Metadata } from "next";
import IncomeTaxCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Income Tax Calculator Australia 2026 | ATO Tax Calculator 2025-26",
  description:
    "Free Australian income tax calculator for 2025-2026. Calculate income tax, Medicare levy, Medicare Levy Surcharge, HELP repayments, LITO, SAPTO, and net take-home pay using official ATO tax brackets. See your Stage 3 tax cut savings.",
  keywords: [
    "income tax calculator australia 2026",
    "ato tax calculator",
    "australian tax calculator",
    "income tax calculator australia",
    "tax calculator australia 2026",
    "how much tax do i pay australia",
    "australian income tax rates 2025-26",
    "take home pay calculator australia",
    "salary after tax australia",
    "medicare levy calculator",
    "HELP repayment calculator",
    "tax brackets australia 2026",
    "stage 3 tax cuts calculator",
    "effective tax rate calculator australia",
    "PAYG tax calculator",
    "net income calculator australia",
  ],
  openGraph: {
    title:
      "Income Tax Calculator Australia 2026 — ATO Tax Rates & Take-Home Pay",
    description:
      "Calculate your Australian income tax, Medicare levy, HELP repayments, and net take-home pay using official 2025-26 ATO tax brackets. See how much you save under Stage 3 tax cuts.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much income tax do I pay on $100,000 in Australia?",
    answer:
      "On a $100,000 salary as an Australian resident in 2025-26, you pay $22,788 in income tax (after the LITO is no longer available at this income). Add the 2% Medicare levy ($2,000) and your total tax is $24,788, leaving you with $75,212 net take-home pay per year ($5,939/month or $2,893/fortnight). If you have a HELP debt, an additional 5% ($5,000) is withheld.",
  },
  {
    question: "What are the Australian tax brackets for 2025-26?",
    answer:
      "For Australian residents, the 2025-26 tax brackets are: $0-$18,200 at 0% (tax-free threshold), $18,201-$45,000 at 16%, $45,001-$135,000 at 30%, $135,001-$190,000 at 37%, and $190,001+ at 45%. These rates include the Stage 3 tax cuts effective from 1 July 2024, which lowered the 19% rate to 16% and raised the 32.5% bracket threshold from $120,000 to $135,000.",
  },
  {
    question: "What is the Medicare Levy Surcharge and when does it apply?",
    answer:
      "The Medicare Levy Surcharge (MLS) is an additional tax of 1% to 1.5% on top of the standard 2% Medicare levy. It applies to Australian residents who earn over $93,000 (singles) or $186,000 (families) and do not have an appropriate level of private hospital cover. The tiers are: 1% for $93,001-$108,000, 1.25% for $108,001-$144,000, and 1.5% for $144,001+. Getting basic hospital cover often costs less than paying the MLS.",
  },
  {
    question: "How do the Stage 3 tax cuts affect my tax?",
    answer:
      "The Stage 3 tax cuts, effective from 1 July 2024, benefit all taxpayers earning over $18,200. The 19% rate was cut to 16%, and the 32.5% rate was cut to 30% with the threshold raised from $120,000 to $135,000. For someone on $90,000, this saves approximately $1,929 per year. On $150,000, the saving is around $3,729 per year. Use the calculator above to see your exact saving.",
  },
  {
    question: "What is the Low Income Tax Offset (LITO)?",
    answer:
      "The LITO reduces tax for Australian residents with lower incomes. The maximum offset is $700 for taxable incomes up to $37,500. It phases out between $37,501 and $66,667: reducing by 5 cents per dollar over $37,500 (to $325 at $45,000), then by 1.5 cents per dollar over $45,000 (to nil at $66,667). LITO is applied automatically when you lodge your tax return.",
  },
  {
    question: "What is SAPTO and who can claim it?",
    answer:
      "The Seniors and Pensioners Tax Offset (SAPTO) provides a tax offset of up to $2,230 for eligible singles (or $1,602 each for couples). To qualify, you must meet the age requirement for the Age Pension and satisfy the income test. The offset reduces by 12.5 cents for each dollar of income over $32,279 for singles, cutting out entirely at $50,119.",
  },
  {
    question: "How are HELP/HECS repayments calculated?",
    answer:
      "HELP repayments are based on your repayment income (taxable income plus fringe benefits, rental losses, etc.). For 2025-26, repayments start at 1% when income exceeds $54,435 and increase progressively to 10% for incomes above $159,663. Your employer withholds HELP repayments from each pay if you indicate you have a HELP debt on your TFN declaration. These repayments reduce your HELP debt balance.",
  },
  {
    question: "Do non-residents pay more tax in Australia?",
    answer:
      "Yes, significantly more. Non-residents do not receive the $18,200 tax-free threshold and are taxed at 30% from the first dollar up to $135,000. They also cannot claim LITO or SAPTO, and do not pay the Medicare levy. Working holiday makers (visa 417/462) pay a special rate of 15% on the first $45,000, then standard rates above that.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Income Tax Calculator 2025-2026",
  description:
    "Free Australian income tax calculator using official ATO 2025-26 tax brackets. Calculate income tax, Medicare levy, Medicare Levy Surcharge, HELP repayments, tax offsets, and net take-home pay.",
  url: "https://au-calculators.vercel.app/calculators/income-tax",
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
    "2025-26 ATO tax bracket calculations",
    "Medicare Levy and Medicare Levy Surcharge",
    "HELP/HECS-HELP repayment calculator",
    "Low Income Tax Offset (LITO)",
    "Seniors and Pensioners Tax Offset (SAPTO)",
    "Stage 3 tax cut comparison",
    "Resident, non-resident, and working holiday rates",
    "Net take-home pay: annual, monthly, and fortnightly",
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
      name: "Income Tax Calculator",
      item: "https://au-calculators.vercel.app/calculators/income-tax",
    },
  ],
};

export default function IncomeTaxPage() {
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
            Australian Income Tax Calculator 2025&ndash;2026
          </h1>
          <p className="text-gray-600">
            Calculate your income tax, Medicare levy, HELP repayments, and net
            take-home pay using official ATO 2025&ndash;26 tax brackets. See
            exactly how much you keep and how much goes to tax, with a detailed
            bracket-by-bracket breakdown and Stage 3 tax cut comparison.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <IncomeTaxCalculator />

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
      </div>
    </>
  );
}
