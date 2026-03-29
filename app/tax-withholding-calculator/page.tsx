import type { Metadata } from "next";
import TaxWithholdingCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Tax Calculator Australia 2026 | PAYG Withholding & Income Tax Calculator",
  description:
    "Free Australian income tax calculator for 2025-2026. Calculate PAYG withholding, Medicare levy, HELP repayments, and take-home pay. Uses official ATO tax brackets for residents, non-residents, and working holiday makers.",
  keywords: [
    "tax calculator australia",
    "tax calculator australia 2026",
    "PAYG withholding calculator",
    "income tax calculator australia",
    "pay calculator australia",
    "Australian tax calculator",
    "take home pay calculator australia",
    "salary calculator australia",
    "PAYG tax calculator",
    "how much tax do I pay australia",
    "medicare levy calculator",
    "HECS HELP repayment calculator",
    "ATO tax rates 2026",
  ],
  openGraph: {
    title:
      "Tax Calculator Australia 2026 — PAYG Withholding & Income Tax",
    description:
      "Calculate your Australian income tax, Medicare levy, HELP repayments, and net take-home pay using official 2025-26 ATO tax brackets.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much tax do I pay on $80,000 in Australia?",
    answer:
      "On an $80,000 salary as an Australian resident claiming the tax-free threshold, you would pay approximately $14,788 in income tax plus $1,600 in Medicare levy, totalling $16,388 in withholding. This leaves you with a net take-home pay of around $63,612 per year or $2,446.62 per fortnight. If you have a HELP/HECS debt, an additional 4.0% ($3,200) would be withheld.",
  },
  {
    question: "What are the Australian tax brackets for 2025-26?",
    answer:
      "For Australian residents, the 2025-26 tax brackets are: $0-$18,200 at 0% (tax-free threshold), $18,201-$45,000 at 16%, $45,001-$135,000 at 30%, $135,001-$190,000 at 37%, and $190,001+ at 45%. These rates were updated as part of the Stage 3 tax cuts from 1 July 2024, which lowered the 19% rate to 16% and raised the 32.5% bracket threshold from $120,000 to $135,000.",
  },
  {
    question: "What is the difference between marginal and effective tax rate?",
    answer:
      "Your marginal tax rate is the rate you pay on each additional dollar you earn — it is the rate of the tax bracket your income falls into. Your effective tax rate is the average rate across your entire income (total tax divided by total income). For example, on $80,000 your marginal rate is 30% but your effective rate is only about 20.5%, because the first $18,200 is tax-free and the next $26,800 is taxed at just 16%.",
  },
  {
    question: "What is the PAYG withholding system?",
    answer:
      "PAYG (Pay As You Go) withholding is the system where your employer deducts tax from your pay each period and sends it to the ATO on your behalf. The amount withheld is based on ATO tax tables and depends on your income level, residency status, whether you claim the tax-free threshold, and whether you have a HELP debt. At the end of the financial year, you lodge a tax return to reconcile the amounts withheld with your actual tax liability.",
  },
  {
    question: "Do non-residents pay more tax in Australia?",
    answer:
      "Yes, non-residents pay significantly more tax because they do not receive the $18,200 tax-free threshold and are taxed at 30% from the first dollar earned (up to $135,000). Non-residents are also not eligible for the Low Income Tax Offset (LITO) and do not pay the Medicare levy. Working holiday makers (visa subclasses 417 and 462) have a special rate of 15% on the first $45,000.",
  },
  {
    question: "What is the Low Income Tax Offset (LITO)?",
    answer:
      "The LITO is a tax offset that reduces the amount of tax payable for Australian residents with lower incomes. The maximum offset is $700 for taxable incomes up to $37,500. It phases out between $37,501 and $66,667, reducing by 5 cents per dollar over $37,500 (to $325 at $45,000), then by 1.5 cents per dollar over $45,000 (to nil at $66,667). The LITO is automatically applied — you do not need to claim it separately.",
  },
  {
    question: "When do I have to start repaying my HELP/HECS-HELP debt?",
    answer:
      "HELP/HECS-HELP repayments are compulsory once your repayment income exceeds the minimum threshold, which is $54,435 for the 2024-25 financial year. The repayment rate starts at 1% and increases progressively up to 10% for incomes above $159,664. Repayments are withheld from your pay by your employer if you indicate you have a HELP debt on your TFN declaration.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Tax Calculator 2026 — PAYG Withholding Calculator",
  description:
    "Free Australian income tax calculator using official ATO 2025-26 tax tables. Calculate PAYG withholding, Medicare levy, HELP repayments, and net take-home pay.",
  url: "https://au-calculators.vercel.app/tax-withholding-calculator",
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

export default function TaxWithholdingPage() {
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
            Australian Tax Calculator 2025&ndash;2026
          </h1>
          <p className="text-gray-600">
            Calculate your PAYG tax withholding, Medicare levy, HELP/HECS-HELP
            repayments, and net take-home pay using official ATO 2025&ndash;26
            tax brackets. Supports Australian residents, non-residents, and
            working holiday makers.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <TaxWithholdingCalculator />

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
      </div>
    </>
  );
}
