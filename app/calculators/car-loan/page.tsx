import type { Metadata } from "next";
import CarLoanCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "Car Loan Calculator Australia 2026 | Free Repayment Estimator",
  description:
    "Free Australian car loan repayment calculator. Enter vehicle price, deposit, interest rate, and loan term to calculate monthly repayments, total interest, and view a full amortization schedule. Compare rates and balloon payment options.",
  keywords: [
    "car loan calculator australia",
    "car loan repayment calculator",
    "vehicle finance calculator",
    "car finance calculator australia",
    "car loan calculator with balloon payment",
    "car loan interest calculator australia",
    "how much are car loan repayments",
    "car finance repayments australia 2026",
    "car loan comparison rate",
    "car loan calculator with deposit",
  ],
  openGraph: {
    title: "Car Loan Calculator Australia 2026 | Free Repayment Estimator",
    description:
      "Calculate your car loan repayments, total interest, and compare rates. Free vehicle finance calculator with balloon payment option for Australians.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much are repayments on a $30,000 car loan in Australia?",
    answer:
      "At the current Australian average of around 7.5% interest over 5 years with monthly repayments, a $30,000 car loan costs approximately $601 per month. Over the life of the loan you would pay about $6,044 in total interest, making the total cost around $36,044. Your actual repayments depend on your interest rate, loan term, deposit amount, and whether you include a balloon payment.",
  },
  {
    question: "What is a balloon payment on a car loan?",
    answer:
      "A balloon payment (also called a residual value) is a large lump sum due at the end of your car loan term. For example, a 30% balloon on a $30,000 loan means you owe $9,000 at the end. While balloon payments reduce your regular repayments, you pay more interest overall because the principal reduces more slowly. At the end of the loan you must pay the balloon, refinance it, or return the vehicle (if under a lease).",
  },
  {
    question: "What is a comparison rate and why does it matter?",
    answer:
      "A comparison rate is a legally required figure in Australia under the National Consumer Credit Protection Act that helps you compare the true cost of loans. It combines the interest rate with most fees and charges into a single percentage. For car loans it is calculated on a $30,000 secured loan over 5 years. A loan advertised at 6.99% might have a comparison rate of 7.5% or more once fees are included. Always check the comparison rate when shopping for car finance — you can verify rates at ASIC MoneySmart (moneysmart.gov.au).",
  },
  {
    question: "Is it better to get a car loan from a bank or dealer?",
    answer:
      "Banks and credit unions typically offer lower interest rates (5–8%) compared to dealer finance (7–12%), but dealer finance can be more convenient. Always get a pre-approved loan from your bank or credit union before visiting the dealer — this gives you negotiating power and a benchmark. Compare using the comparison rate, not just the headline rate. ASIC MoneySmart recommends getting at least three quotes before committing to any car finance product.",
  },
  {
    question: "How much deposit should I put on a car loan?",
    answer:
      "A larger deposit reduces your loan amount, monthly repayments, and total interest paid. Most lenders require no minimum deposit for a secured car loan, but putting down 10–20% of the vehicle price is a common recommendation. For example, a $5,000 deposit on a $35,000 car reduces your loan to $30,000, saving you hundreds or thousands in interest over the loan term depending on your rate.",
  },
  {
    question: "How does interest rate affect my car loan repayments?",
    answer:
      "Even a 1% difference in interest rate can significantly impact your total cost. On a $30,000 loan over 5 years, the difference between 6.5% and 7.5% is roughly $850 in total interest. Use the rate comparison table in this calculator to see exactly how different rates affect your repayments. Shopping around and negotiating your rate is one of the most effective ways to save on car finance.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Car Loan Calculator Australia 2026",
  description:
    "Free car loan repayment calculator for Australians. Calculate vehicle finance repayments, total interest, balloon payments, and compare different interest rates.",
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
      name: "Car Loan Calculator",
      item: "https://au-calculators.vercel.app/calculators/car-loan",
    },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Car Loan Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your car loan repayments by entering the vehicle price, deposit, interest rate,
            and loan term. Compare repayments at different rates, add a balloon payment, and view a
            full amortization schedule. Pre-filled with the current Australian average car loan rate
            of 7.5%.
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
