import type { Metadata } from "next";
import CarLoanCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Car Loan Calculator Australia 2026 | Vehicle Finance Repayment Calculator",
  description:
    "Free Australian car loan calculator. Calculate vehicle finance repayments with balloon payment option. Compare weekly, fortnightly, and monthly repayments. Car loan calculator Australia.",
  keywords: [
    "car loan calculator australia",
    "vehicle finance calculator",
    "car loan repayment calculator",
    "car finance calculator australia",
    "vehicle loan calculator",
    "car loan calculator with balloon payment",
    "car loan interest calculator australia",
    "how much are car loan repayments",
    "car finance repayments australia 2026",
  ],
  openGraph: {
    title: "Car Loan Calculator Australia 2026",
    description:
      "Calculate your car loan repayments, total interest, and compare scenarios. Free vehicle finance calculator for Australians.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much are repayments on a $30,000 car loan?",
    answer:
      "At 7% interest over 5 years with monthly repayments, a $30,000 car loan costs approximately $594 per month. Over the life of the loan, you would pay about $5,644 in total interest, making the total cost around $35,644. Your actual repayments depend on your interest rate, loan term, and whether you have a balloon payment.",
  },
  {
    question: "What is a balloon payment on a car loan?",
    answer:
      "A balloon payment (also called a residual value) is a large lump sum due at the end of your car loan term. For example, a 30% balloon on a $30,000 loan means you owe $9,000 at the end. While balloon payments reduce your regular repayments, you pay more interest overall because the principal reduces more slowly. At the end of the loan, you must pay the balloon amount, refinance it, or return the vehicle (if under a lease).",
  },
  {
    question: "What is a comparison rate and why does it matter?",
    answer:
      "A comparison rate is a legally required figure in Australia that helps you compare the true cost of loans. It combines the interest rate with most fees and charges into a single percentage. For car loans, it is calculated on a $30,000 secured loan over 5 years. A loan advertised at 6.99% might have a comparison rate of 7.5% or more once fees are included. Always use the comparison rate when shopping around for car finance.",
  },
  {
    question: "Is it better to get a car loan from a bank or dealer?",
    answer:
      "Banks and credit unions typically offer lower interest rates (5-8%) compared to dealer finance (7-12%), but dealer finance can be more convenient and may include extras like warranty packages. Always get a pre-approved loan from your bank or credit union before visiting the dealer — this gives you negotiating power and a benchmark to compare against dealer finance offers. Check the comparison rate, not just the headline rate.",
  },
  {
    question: "Should I choose weekly, fortnightly, or monthly car loan repayments?",
    answer:
      "More frequent repayments can save you money on interest. With fortnightly repayments, you effectively make 26 half-payments per year (equivalent to 13 monthly payments instead of 12), which pays off your loan faster and reduces total interest. Weekly repayments provide an even greater effect. For a $30,000 car loan at 7% over 5 years, switching from monthly to fortnightly repayments can save you several hundred dollars in interest.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Car Loan Calculator",
  description:
    "Free car loan repayment calculator for Australians. Calculate vehicle finance repayments, total interest, balloon payments, and compare different loan scenarios.",
  url: "https://au-calculators.vercel.app/calculators/car-loan",
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

export default function CarLoanPage() {
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
            Australian Car Loan Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your car loan repayments, total interest paid, and view a full amortization
            schedule. Add a balloon payment to see how it affects your repayments. Compare two
            scenarios side by side to find the best deal.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CarLoanCalculator />

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
