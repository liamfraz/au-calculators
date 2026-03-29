import type { Metadata } from "next";
import CarLoanCalculator from "../calculators/car-loan/calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title:
    "Car Loan Calculator Australia 2026 | Car Finance Calculator AU",
  description:
    "Free Australian car loan calculator. Calculate monthly repayments, total interest, and view a full amortization breakdown. Compare new vs used car loan rates. Car finance calculator AU.",
  keywords: [
    "car loan calculator australia",
    "car finance calculator au",
    "car loan calculator",
    "car loan repayment calculator australia",
    "vehicle finance calculator australia",
    "car loan interest calculator",
    "how much are car loan repayments australia",
    "new car loan calculator",
    "used car loan calculator",
    "car finance calculator australia 2026",
    "car loan comparison australia",
    "car loan balloon payment calculator",
  ],
  openGraph: {
    title:
      "Car Loan Calculator Australia 2026 | Car Finance Calculator AU",
    description:
      "Calculate your Australian car loan repayments, total interest paid, and compare new vs used car rates. Free car finance calculator.",
    type: "website",
  },
  alternates: {
    canonical:
      "https://au-calculators.vercel.app/car-loan-calculator",
  },
};

const faqs = [
  {
    question:
      "How much are repayments on a $30,000 car loan in Australia?",
    answer:
      "At 7.5% interest over 5 years with monthly repayments, a $30,000 car loan costs approximately $601 per month. Over the full term you will pay around $6,044 in total interest, making the total cost roughly $36,044. Your actual repayments depend on your credit score, the lender (CBA, ANZ, Westpac, NAB, or online lenders), whether the car is new or used, and whether you include a balloon payment.",
  },
  {
    question:
      "What is the average car loan interest rate in Australia in 2026?",
    answer:
      "As of March 2026, the average secured car loan rate in Australia is around 7.0% to 8.5% for new cars and 8.5% to 12.0% for used cars. Credit unions and online lenders often offer rates from 5.99%, while dealer finance typically ranges from 7% to 14%. Your rate depends on your credit score, loan-to-value ratio, the vehicle's age, and whether the loan is secured or unsecured.",
  },
  {
    question: "What is a balloon payment on a car loan?",
    answer:
      "A balloon payment (also called a residual value) is a large lump sum due at the end of your car loan term. For example, a 30% balloon on a $30,000 loan means you owe $9,000 at the end. While balloon payments reduce your regular repayments, you pay more interest overall because the principal reduces more slowly. At the end of the loan, you must pay the balloon, refinance it, or return the vehicle (if under a lease).",
  },
  {
    question:
      "Is it cheaper to finance a new or used car in Australia?",
    answer:
      "New cars typically attract lower interest rates (6.5% to 8.5%) compared to used cars (8.5% to 12%), but the total cost depends on the purchase price. A $25,000 used car at 9% over 5 years costs about $5,952 in interest, while a $45,000 new car at 7% costs about $10,692 in interest. Used cars depreciate less in dollar terms but may cost more to maintain. Consider total cost of ownership, not just the interest rate.",
  },
  {
    question:
      "Should I get a secured or unsecured car loan?",
    answer:
      "A secured car loan uses the vehicle as collateral, typically offering lower rates (6% to 9%) because the lender has less risk. An unsecured personal loan for a car usually carries higher rates (9% to 15%) but means your car is not at risk of repossession if you default. Secured loans often require the car to be under a certain age (usually less than 7-10 years old). For most buyers, a secured loan offers the best value.",
  },
  {
    question:
      "What is a comparison rate and why does it matter for car loans?",
    answer:
      "A comparison rate is a legally required figure in Australia that combines the interest rate with most fees and charges into a single percentage. For car loans, it is calculated on a $30,000 secured loan over 5 years. A loan advertised at 6.99% might have a comparison rate of 7.5% or more once fees are included. Always compare loans using the comparison rate from the Product Disclosure Statement.",
  },
  {
    question:
      "How does my credit score affect my car loan rate?",
    answer:
      "Your credit score significantly impacts the interest rate you will be offered. Borrowers with excellent credit (800+) may qualify for rates as low as 5.5% to 6.5%, while those with average credit (500-699) may face rates of 9% to 14%. A poor credit score (below 500) can mean rates above 15% or loan rejection. Before applying, check your credit report for free through Equifax, Experian, or illion, and dispute any errors.",
  },
  {
    question:
      "How much can I borrow for a car in Australia?",
    answer:
      "Most Australian lenders offer car loans from $5,000 to $100,000. The amount you can borrow depends on your income, existing debts, credit score, and the vehicle's value. As a general rule, your total car costs (repayments, insurance, fuel, registration) should not exceed 15-20% of your gross monthly income. For example, on a $80,000 salary you might comfortably afford repayments on a $25,000 to $35,000 loan. Banks like CBA, ANZ, Westpac, and NAB each have their own serviceability criteria — use this calculator to model different loan amounts and see what fits your budget.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Car Loan Calculator Australia 2026",
  description:
    "Free Australian car loan calculator. Calculate monthly repayments, total interest, amortization breakdown, and compare new vs used car loan rates.",
  url: "https://au-calculators.vercel.app/car-loan-calculator",
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

const newVsUsedRates = [
  { lender: "CBA (CommBank)", newRate: "6.99%", usedRate: "7.99%", notes: "Secured, terms 1–7 yrs" },
  { lender: "ANZ", newRate: "7.24%", usedRate: "8.24%", notes: "Secured, fixed rate" },
  { lender: "Westpac", newRate: "7.09%", usedRate: "8.09%", notes: "Secured, good credit" },
  { lender: "NAB", newRate: "7.19%", usedRate: "8.19%", notes: "Secured, fixed rate" },
  { lender: "Credit Unions (avg)", newRate: "6.49%", usedRate: "7.49%", notes: "Member rates, secured" },
  { lender: "Online Lenders (avg)", newRate: "5.99%", usedRate: "7.99%", notes: "Secured, fast approval" },
  { lender: "Dealer Finance (avg)", newRate: "7.50%", usedRate: "9.50%", notes: "Convenience, bundled extras" },
];

const securedVsUnsecured = [
  { feature: "Interest Rate (typical)", secured: "5.99% – 9.00%", unsecured: "9.00% – 15.00%" },
  { feature: "Vehicle as Collateral", secured: "Yes — lender can repossess", unsecured: "No — personal liability only" },
  { feature: "Vehicle Age Limit", secured: "Usually < 7–10 years old", unsecured: "No restriction" },
  { feature: "Loan Amounts", secured: "$5,000 – $100,000+", unsecured: "$2,000 – $50,000" },
  { feature: "Approval Speed", secured: "1–3 business days", unsecured: "Same day to 2 days" },
  { feature: "Best For", secured: "New or recent-model used cars", unsecured: "Older vehicles, private sales" },
];

export default function CarLoanCalculatorPage() {
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
            Car Loan Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your Australian car loan repayments, total interest paid,
            and view a full amortization breakdown. Compare new vs used car loan
            rates and find the best deal on vehicle finance.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CarLoanCalculator />

            {/* New vs Used Rate Comparison Table */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  New vs Used Car Loan Rates — Australia 2026
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Indicative rates as of March 2026. Actual rates depend on your
                  credit profile, loan amount, and lender.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Lender Type
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">
                        New Car Rate
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">
                        Used Car Rate
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {newVsUsedRates.map((row) => (
                      <tr
                        key={row.lender}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {row.lender}
                        </td>
                        <td className="px-4 py-3 text-right text-green-700 font-semibold">
                          {row.newRate}
                        </td>
                        <td className="px-4 py-3 text-right text-amber-700 font-semibold">
                          {row.usedRate}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {row.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                  Rates are indicative only and sourced from publicly available
                  comparison sites. Always confirm with your lender.
                </p>
              </div>
            </div>

            {/* Secured vs Unsecured Comparison */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Secured vs Unsecured Car Loans — Australia 2026
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Secured loans use the car as collateral for lower rates. Unsecured loans
                  offer flexibility for older vehicles.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Feature
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Secured Car Loan
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Unsecured Personal Loan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {securedVsUnsecured.map((row) => (
                      <tr
                        key={row.feature}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {row.feature}
                        </td>
                        <td className="px-4 py-3 text-green-700">
                          {row.secured}
                        </td>
                        <td className="px-4 py-3 text-amber-700">
                          {row.unsecured}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA: Compare car loans */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Compare AU Car Loan Rates
              </h2>
              <p className="text-sm text-blue-800 mb-4">
                Getting pre-approved before you visit a dealer gives you
                negotiating power. Compare rates from banks, credit unions, and
                online lenders to find the lowest rate for your situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-sm"
                >
                  Compare Car Loan Rates
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  Get Pre-Approved
                </a>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                Links coming soon. We are partnering with Australian comparison
                services and licensed finance brokers.
              </p>
            </div>

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

        {/* Key info section for SEO */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Car Loans in Australia
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                New vs Used Car Finance
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                New cars typically attract lower interest rates because they hold
                more value as security. A new car at 7% vs a used car at 9.5%
                over 5 years means paying roughly $1,200 more in interest per
                $10,000 borrowed for the used car. However, new cars depreciate
                faster — losing 20-30% of value in the first year alone.
                Consider total cost of ownership, not just the interest rate.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Balloon Payments Explained
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A balloon (residual) payment reduces your monthly repayments by
                deferring a portion of the principal to the end of the loan.
                While this lowers cash flow pressure, you pay more total interest
                because the principal reduces slower. At the end of the term, you
                must pay the balloon in full, refinance, or trade in. Balloon
                payments are common in novated leases and chattel mortgages.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Secured vs Unsecured Loans
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Secured car loans use the vehicle as collateral, offering rates
                1-3% lower than unsecured loans. Most lenders require the car to
                be under 7-10 years old for a secured loan. If you default, the
                lender can repossess the vehicle. Unsecured personal loans have
                higher rates but no asset risk — useful for older vehicles that
                don&apos;t qualify for secured finance.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Tips to Get a Lower Rate
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get pre-approved before visiting the dealer. Check your credit
                score for free via Equifax, Experian, or illion and fix any
                errors. Compare at least 3-4 lenders including your bank, a
                credit union, and an online lender. Consider a shorter loan term
                — 3 years instead of 7 — to reduce total interest. A larger
                deposit (20%+) can also unlock better rates.
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
