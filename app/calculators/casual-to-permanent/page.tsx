import type { Metadata } from "next";
import CasualToPermanentCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Casual to Permanent Employment Calculator Australia 2026 | Fair Work Entitlements",
  description:
    "Calculate your casual to permanent employment conversion. Check eligibility under the Fair Work Act, calculate equivalent permanent rate without casual loading, and understand leave entitlements and job security.",
  keywords: [
    "casual to permanent employment rights Australia",
    "casual conversion entitlements 2026",
    "casual to permanent calculator",
    "fair work casual conversion",
    "25% casual loading removal",
    "casual conversion request Australia",
  ],
  openGraph: {
    title:
      "Casual to Permanent Employment Calculator Australia 2026 | Fair Work Entitlements",
    description:
      "Calculate your casual to permanent employment conversion. Check eligibility under the Fair Work Act, calculate equivalent permanent rate without casual loading, and understand leave entitlements and job security.",
    type: "website",
  },
};

const faqs = [
  {
    question: "Am I eligible for casual conversion under the Fair Work Act?",
    answer:
      "Under the Fair Work Act, you become eligible for casual conversion after 12 months of continuous employment with a regular and systematic pattern of work. This means you work set hours on an ongoing basis, not just ad-hoc shifts. The employer must have been offering you work with reasonable regularity. If you meet these criteria, you have the right to request conversion to permanent employment. However, your employer can refuse if they can show the role is genuinely temporary or seasonal, or if there are other genuine operational reasons.",
  },
  {
    question: "Can my employer refuse a casual conversion request?",
    answer:
      "Yes, your employer can refuse a casual conversion request, but only on genuine grounds. Valid reasons include: the role is genuinely temporary or seasonal in nature, you cannot perform the role on a full-time or part-time basis, or there are genuine operational reasons for not converting. Simply being able to afford casual pay is not a valid reason to refuse. If your employer refuses, they must provide written reasons. If you believe the refusal was unreasonable, you can pursue dispute resolution through Fair Work.",
  },
  {
    question: "How do I request casual to permanent conversion?",
    answer:
      "Once you have been employed on a casual basis for at least 12 months with a regular and systematic pattern of work, you can request conversion. The request should be in writing and clearly state that you&apos;re requesting conversion to permanent employment. Your employer then has 21 days to either agree in writing, or provide written reasons for refusal. If you cannot reach agreement, you can pursue formal dispute resolution through Fair Work conciliation or seek advice from the Fair Work Ombudsman (phone 13 13 94).",
  },
  {
    question: "What is the 25% casual loading and will I earn less as a permanent?",
    answer:
      "The 25% casual loading is a compensation payment for lack of job security, notice periods, and leave entitlements. It&apos;s typically added to a casual worker&apos;s hourly rate. When converting to permanent, your base hourly rate is calculated by removing this 25% loading (dividing your casual rate by 1.25). While your hourly rate decreases, as a permanent employee you&apos;re paid for all 52 weeks of the year, including paid annual and sick leave. For most people, the total annual earnings increase or stay similar, plus you gain job security and statutory protections.",
  },
  {
    question: "What leave entitlements do I get as a permanent employee?",
    answer:
      "Permanent employees under the National Employment Standards are entitled to: 4 weeks of paid annual leave per year (5 weeks in South Australia after 12 months), 10 days of paid personal/sick leave per year (pro-rata for part-time workers), 2 days of paid compassionate leave per occasion, and unpaid parental leave. These are minimum entitlements — many awards and enterprise agreements provide higher amounts. As a casual, you don&apos;t receive these paid leaves, which is why the casual loading exists as compensation.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Casual to Permanent Employment Calculator 2026",
  description:
    "Calculate casual to permanent conversion, check Fair Work eligibility, and understand leave entitlements.",
  url: "https://au-calculators.vercel.app/calculators/casual-to-permanent",
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

export default function CasualToPermanentPage() {
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
            Casual to Permanent Employment Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Check your eligibility for casual conversion under Fair Work, calculate your permanent equivalent rate, and understand your leave entitlements and job security benefits.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CasualToPermanentCalculator />

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
