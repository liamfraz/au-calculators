import type { Metadata } from "next";
import CentrelinkPaymentCalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Centrelink Payment Calculator Australia 2026 — JobSeeker, Youth Allowance, Age Pension",
  description:
    "Free Centrelink payment estimator with 2025-26 rates. Calculate JobSeeker Payment, Youth Allowance, Age Pension, and Parenting Payment. Apply income test and assets test to estimate your fortnightly payment.",
  keywords: [
    "centrelink payment calculator",
    "jobseeker payment calculator",
    "centrelink income test calculator",
    "youth allowance calculator",
    "age pension calculator",
    "parenting payment calculator",
    "centrelink income test",
    "centrelink assets test",
    "how much will centrelink pay me",
    "jobseeker payment rate 2026",
    "centrelink payment rates 2026",
    "services australia payment estimator",
  ],
  openGraph: {
    title:
      "Centrelink Payment Calculator Australia 2026 — JobSeeker, Youth Allowance, Age Pension",
    description:
      "Estimate your Centrelink payment with income and assets tests applied. Covers JobSeeker, Youth Allowance, Age Pension, and Parenting Payment at 2025-26 rates.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/centrelink-payment-estimator",
  },
};

const faqs = [
  {
    question: "How much is JobSeeker Payment in 2026?",
    answer:
      "The maximum JobSeeker Payment for a single person with no children is approximately $762.70 per fortnight (including base rate). Singles with children receive up to $816.90 per fortnight. Partnered recipients receive up to $693.10 each per fortnight. These rates are indexed twice yearly in March and September.",
  },
  {
    question: "How does the Centrelink income test work?",
    answer:
      "The income test reduces your payment when you earn above the income free area. For JobSeeker, you can earn up to $150 per fortnight with no reduction. For every dollar earned between $150 and $256 per fortnight, your payment is reduced by 50 cents. For every dollar above $256, the reduction increases to 60 cents per dollar. The income free area and taper rates vary by payment type.",
  },
  {
    question: "What is the Centrelink assets test?",
    answer:
      "The assets test sets limits on what you can own and still receive a payment. For single homeowners, the limit is approximately $314,000. For single non-homeowners, it is approximately $566,000. For couples, the limits are $470,000 (homeowners) and $722,000 (non-homeowners). Assets include bank accounts, shares, investment properties, vehicles, and other valuable items. Your family home is excluded.",
  },
  {
    question: "What is the difference between income test and assets test?",
    answer:
      "Centrelink applies both tests and pays you the lower amount. The income test reduces your payment based on how much you earn. The assets test checks the total value of what you own. If your assets exceed the limit, your payment is reduced to zero regardless of your income. If both tests reduce your payment, the one that results in the lower payment is the 'binding' test.",
  },
  {
    question: "How much can I earn on JobSeeker before it affects my payment?",
    answer:
      "You can earn up to $150 per fortnight ($3,900 per year) without any reduction to your JobSeeker Payment. Between $150 and $256 per fortnight, your payment reduces by 50 cents for each dollar earned. Above $256 per fortnight, the reduction rate increases to 60 cents per dollar. Your payment reaches zero when your income is high enough to offset the full payment amount.",
  },
  {
    question: "What is the Age Pension rate for 2026?",
    answer:
      "The maximum Age Pension for a single person is approximately $1,116.30 per fortnight. For partnered pensioners, the rate is approximately $841.40 each per fortnight. These amounts include the pension supplement. The Age Pension income free area is $204 per fortnight for singles, with a taper rate of 50 cents per dollar above this threshold.",
  },
  {
    question: "How much is Parenting Payment?",
    answer:
      "Parenting Payment Single is approximately $987.70 per fortnight — one of the higher Centrelink payments. Parenting Payment Partnered is approximately $693.10 per fortnight. Single parents can earn up to $202.60 per fortnight before any income test reduction applies, with a taper rate of 40 cents per dollar above the free area.",
  },
  {
    question: "Does my partner's income affect my Centrelink payment?",
    answer:
      "Yes, if you are partnered, both your income and your partner's income are assessed together under the income test. The partner income free area and taper rates are generally the same as for singles, but the combined household income is what determines your payment reduction. The assets test also considers combined assets for couples.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Centrelink Payment Calculator Australia 2026",
  description:
    "Free Centrelink payment estimator with 2025-26 rates. Calculate JobSeeker, Youth Allowance, Age Pension, and Parenting Payment with income and assets tests.",
  url: "https://au-calculators.vercel.app/centrelink-payment-estimator",
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

export default function CentrelinkPaymentEstimatorPage() {
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
            Centrelink Payment Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Estimate your Centrelink payment based on 2025–2026 rates. Select
            your payment type, enter your income and assets, and see an instant
            estimate with the income test and assets test applied. Covers
            JobSeeker Payment, Youth Allowance, Age Pension, and Parenting
            Payment.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CentrelinkPaymentCalculator />

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

        {/* Payment-specific content for SEO */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Centrelink Payment Rates 2025–2026
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                JobSeeker Payment Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                JobSeeker Payment is the main income support for people aged 22
                to Age Pension age who are looking for work. The single rate is
                approximately $762.70 per fortnight. The income free area is $150
                per fortnight, with a taper rate of 50c per dollar up to $256,
                then 60c per dollar above that.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Youth Allowance Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Youth Allowance (Job Seeker) is for young people aged 16–21 who
                are looking for work. The single rate away from home is
                approximately $455.20 per fortnight. Income test rules are
                similar to JobSeeker with a $150 per fortnight free area and
                50c/60c taper rates.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Age Pension Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The Age Pension is for people who have reached Age Pension age
                (67). The single rate is approximately $1,116.30 per fortnight —
                the highest of the main Centrelink payments. The income free area
                is $204 per fortnight with a 50c per dollar taper rate.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Parenting Payment Rates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Parenting Payment Single is approximately $987.70 per fortnight
                for the principal carer of a child under 14. Partnered rate is
                $693.10 per fortnight for a child under 6. The income free area
                is $202.60 per fortnight with a 40c per dollar taper rate —
                more generous than JobSeeker.
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
