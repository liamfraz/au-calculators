import type { Metadata } from "next";
import RedundancyPayoutCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Redundancy Pay Calculator Australia 2026 — Fair Work Entitlements",
  description:
    "Calculate your Fair Work redundancy entitlements instantly. Enter your years of service and weekly earnings to see exactly what you're owed. Includes tax-free threshold calculations.",
  keywords: [
    "redundancy pay calculator australia",
    "redundancy payout calculator",
    "fair work redundancy pay",
    "how much redundancy am I entitled to australia",
    "redundancy payment calculator 2026",
    "redundancy calculator",
    "fair work calculator",
  ],
  openGraph: {
    title:
      "Redundancy Pay Calculator Australia 2026 — Calculate Your Entitlements",
    description:
      "Free redundancy pay calculator for Fair Work entitlements. Calculate based on years of service and weekly earnings.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How is redundancy pay calculated under Fair Work?",
    answer:
      "Under the Fair Work Act, redundancy pay is calculated by multiplying your weeks of entitlement by your weekly ordinary time earnings. The number of weeks depends on your years of service, ranging from 3 weeks (1 year) up to a maximum of 12 weeks (10+ years). For example, an employee with 5 years of service earning $1,500 per week is entitled to 8 weeks × $1,500 = $12,000. These are the minimum entitlements — many enterprise agreements provide higher amounts.",
  },
  {
    question:
      "What is the difference between genuine and non-genuine redundancy?",
    answer:
      "Genuine redundancy occurs when the employer's business closes, a specific job becomes redundant, or there is a genuine restructure. Non-genuine redundancy includes dismissal for other reasons (performance, conduct, etc.). Only genuine redundancy payouts qualify for the full tax-free threshold of $12,524 + ($6,264 × years of service). Non-genuine payments may be treated differently for tax purposes. If you're unsure whether your redundancy is genuine, speak to Fair Work or a workplace lawyer.",
  },
  {
    question: "How is redundancy pay taxed?",
    answer:
      "For genuine redundancy, the first $12,524 (plus $6,264 per year of service) is tax-free. Any amount above this threshold is taxed at your marginal income tax rate (the rate applicable to your annual income). For example, if your tax-free threshold is $43,844 but your payout is $50,000, the $6,156 excess is taxed at your marginal rate. Non-genuine redundancy may have different tax treatment. Always consult a tax accountant for your specific situation.",
  },
  {
    question:
      "What does 'weekly ordinary time earnings' mean for redundancy calculations?",
    answer:
      "Weekly ordinary time earnings (WOTE) is your base pay excluding bonuses, commission, overtime, and allowances (with some exceptions for award-specified allowances). It's the rate you would normally earn for ordinary hours of work in a week. For salaried employees, divide your annual salary by 52 weeks. For hourly workers, multiply your hourly rate by the ordinary hours per week. The calculator uses this figure to determine your total redundancy payout.",
  },
  {
    question:
      "Are small businesses exempt from paying redundancy in Australia?",
    answer:
      "Yes. Businesses with fewer than 15 employees are exempt from the redundancy requirements of the Fair Work Act. This is called the 'small business exemption'. However, employees may still have redundancy entitlements under their employment contract, award, or state-based legislation. If you work for a small business, check your employment agreement or contact Fair Work (1300 654 415) to confirm your entitlements.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Redundancy Pay Calculator 2026",
  description:
    "Free redundancy pay calculator for Australian Fair Work entitlements. Calculate based on years of service and weekly earnings.",
  url: "https://au-calculators.vercel.app/calculators/redundancy-payout",
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

export default function RedundancyPayoutPage() {
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
            Redundancy Pay Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your Fair Work redundancy entitlements instantly. Enter your years of
            service and weekly earnings to see exactly what you&apos;re owed.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <RedundancyPayoutCalculator />

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
