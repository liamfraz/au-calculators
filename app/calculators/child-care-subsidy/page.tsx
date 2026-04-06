import type { Metadata } from "next";
import ChildCareSubsidyCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Child Care Subsidy Calculator Australia 2026 | CCS Calculator",
  description:
    "Free Australian Child Care Subsidy (CCS) calculator. Calculate your subsidy percentage, gap fees, and annual out-of-pocket childcare costs using 2025-26 income tiers and activity test.",
  keywords: [
    "childcare subsidy calculator",
    "ccs calculator australia",
    "child care subsidy calculator australia 2026",
    "childcare subsidy calculator australia 2026",
    "ccs calculator",
    "child care subsidy percentage",
    "childcare gap fee calculator",
    "childcare cost calculator australia",
    "activity test childcare",
    "how much childcare subsidy will i get",
  ],
  openGraph: {
    title: "Child Care Subsidy Calculator Australia 2026 — CCS Gap Fee Estimator",
    description:
      "Calculate your Child Care Subsidy percentage, subsidised hours, gap fees, and annual childcare costs. Uses 2025-26 CCS income tiers and activity test.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How is the Child Care Subsidy (CCS) percentage calculated?",
    answer:
      "The CCS percentage is based on your combined family income. For 2025-26, families earning $80,000 or less receive the maximum 90% subsidy. The percentage decreases on a sliding scale as income increases, reaching 0% at $530,000. The subsidy is applied to the lesser of the hourly fee charged by your provider or the government's hourly rate cap for your type of care.",
  },
  {
    question: "What is the activity test for Child Care Subsidy?",
    answer:
      "The activity test determines how many hours of subsidised care you can access per fortnight. It is based on the parent with the lower activity level. Recognised activities include paid work, self-employment, study, training, volunteering, and looking for work. If the lower-activity parent does 8-16 hours per fortnight, the family gets 36 subsidised hours. 16-48 hours gives 72 hours, and 48+ hours gives 100 hours per fortnight.",
  },
  {
    question: "What are the hourly rate caps for CCS in 2025-26?",
    answer:
      "The CCS hourly rate caps for 2025-26 are: Centre-Based Day Care $15.60/hr, Family Day Care $13.73/hr, Outside School Hours Care $16.17/hr, and In Home Care $36.81/hr. If your provider charges more than the rate cap, the subsidy is calculated on the cap amount and you pay the difference as an additional gap fee.",
  },
  {
    question: "How much will I pay out of pocket for childcare?",
    answer:
      "Your out-of-pocket cost (gap fee) depends on your CCS percentage, the hourly fee charged, and the hourly rate cap. For example, if your CCS is 75% and the fee is $12/hr (below the cap), the government pays $9/hr and you pay a $3/hr gap fee. If the fee exceeds the rate cap, you also pay the difference between the fee and the cap. Annual costs also depend on how many hours of care you use per fortnight.",
  },
  {
    question: "What is the Additional Child Care Subsidy (ACCS)?",
    answer:
      "The Additional Child Care Subsidy provides a higher rate of assistance (up to 100% of the fee, up to the rate cap) for families in specific circumstances. This includes children at risk of serious abuse or neglect, families experiencing temporary financial hardship, parents transitioning from income support to work, and grandparent carers on income support. ACCS is administered by Services Australia and requires a separate application.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Child Care Subsidy Calculator 2026",
  description:
    "Free CCS calculator for Australian families. Calculate your subsidy percentage, subsidised hours, gap fees, and annual childcare costs using 2025-26 income tiers.",
  url: "https://au-calculators.vercel.app/calculators/child-care-subsidy",
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
      name: "Child Care Subsidy Calculator",
      item: "https://au-calculators.vercel.app/calculators/child-care-subsidy",
    },
  ],
};

export default function ChildCareSubsidyPage() {
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
            Child Care Subsidy Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your Child Care Subsidy (CCS) percentage, subsidised hours, gap fees, and
            annual out-of-pocket childcare costs. Uses 2025-26 income tiers, activity test, and
            hourly rate caps.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <ChildCareSubsidyCalculator />
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>

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
