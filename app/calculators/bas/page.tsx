import type { Metadata } from "next";
import BasCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "BAS Calculator Australia 2026 | GST & PAYG Quarterly Statement",
  description:
    "Free BAS calculator for Australian small businesses. Calculate net GST payable or refundable, PAYG withholding, and total ATO payment for your quarterly Business Activity Statement.",
  keywords: [
    "BAS calculator Australia",
    "BAS calculator",
    "GST calculator Australia",
    "quarterly BAS Australia 2026",
    "how to calculate BAS",
    "business activity statement calculator",
    "PAYG withholding calculator",
    "GST payable calculator",
    "ATO BAS lodgement",
    "net GST calculator",
    "BAS GST refund",
    "quarterly GST Australia",
  ],
  openGraph: {
    title: "BAS Calculator Australia 2026 — GST & PAYG Quarterly Statement",
    description:
      "Calculate your quarterly BAS in seconds. Enter GST collected, GST paid on purchases, PAYG withholding and fuel tax credits to get your ATO payment due.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How do I calculate my BAS?",
    answer:
      "To calculate your BAS, enter the total GST collected on sales (1A) and total GST paid on purchases (1B). Your net GST position is 1A minus 1B. If positive, you owe the ATO. If negative, you are entitled to a refund. Then add any PAYG withholding (W2) that was deducted from payments to contractors or other suppliers. The total amount owing is net GST plus PAYG withholding. Many small businesses lodge BAS quarterly, but you can elect to lodge monthly if you prefer.",
  },
  {
    question: "What is the GST rate in Australia?",
    answer:
      "The Australian Goods and Services Tax (GST) rate is 10%. It was introduced on 1 July 2000 and has remained at 10% since. GST applies to most goods, services, and other items sold or consumed in Australia. You must register for GST if your business has a GST turnover of $75,000 or more per year ($150,000 for non-profit organisations). Once registered, you must charge GST on your taxable sales, lodge Business Activity Statements (BAS), and can claim GST credits for business purchases. You can choose to register voluntarily if your turnover is below the threshold.",
  },
  {
    question: "What are the BAS lodgement deadlines for 2026?",
    answer:
      "BAS lodgement deadlines for 2026 are: Q1 (July – September) due 28 October, Q2 (October – December) due 28 February, Q3 (January – March) due 28 April, and Q4 (April – June) due 28 July. If you lodge through a tax agent, you may receive a 4-week extension beyond these dates. It is essential to lodge on time to avoid penalties and interest charges from the ATO.",
  },
  {
    question: "What is PAYG withholding on a BAS?",
    answer:
      "PAYG withholding is tax that is withheld from payments to contractors and other suppliers. Field W1 on your BAS is the total salary, wages, and contractor payments made, while W2 is the amount of tax withheld from those payments. If you pay contractors or suppliers, you must withhold 47% PAYG tax (or the applicable rate) and include this in your BAS. The PAYG withholding is credited against the contractor's tax liability and reported to the ATO.",
  },
  {
    question: "Can I get a GST refund from my BAS?",
    answer:
      "Yes, if your GST paid on purchases (1B) is greater than your GST collected on sales (1A), you are entitled to a GST refund from the ATO. This commonly occurs for businesses with large input purchases or those in early growth phases. The ATO typically processes BAS refunds within 14 days if you lodge electronically. Refunds are paid into your nominated bank account.",
  },
  {
    question: "What are fuel tax credits?",
    answer:
      "Fuel tax credits (formerly known as fuel tax credits or fuel rebates) are a scheme that allows eligible businesses to claim a credit for excise on fuel used in qualifying activities. This includes fuel used for business vehicles in eligible activities such as primary production, freight transport, or off-road use. The credit rate varies depending on the type of fuel and is set by the ATO. You can claim fuel tax credits on your quarterly BAS by entering the amount in the relevant field. Check the ATO website for current rates and eligible activities.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian BAS Calculator 2026",
  description:
    "Free BAS calculator for Australia. Calculate quarterly GST payable or refundable, PAYG withholding, and total ATO payment.",
  url: "https://au-calculators.vercel.app/calculators/bas",
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

export default function BasPage() {
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
            BAS Calculator Australia 2026
          </h1>
          <p className="text-gray-600">
            Calculate your quarterly Business Activity Statement (BAS) in seconds. Enter your GST
            collected and paid, PAYG withholding, and fuel tax credits to find out your total ATO
            payment or refund due.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <BasCalculator />

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
