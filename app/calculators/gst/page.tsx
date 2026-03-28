import type { Metadata } from "next";
import GstCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "GST Calculator Australia 2026 | Add or Remove GST Instantly",
  description:
    "Free Australian GST calculator. Add GST (multiply by 1.1) or remove GST (divide by 1.1) from any amount. Includes bulk mode for multiple amounts and a BAS GST helper for quarterly reporting.",
  keywords: [
    "gst calculator australia",
    "gst calculator",
    "add gst calculator",
    "remove gst from price",
    "gst calculator online",
    "australian gst calculator",
    "calculate gst",
    "gst amount calculator",
    "bas gst calculator",
    "10 percent gst calculator",
    "gst inclusive calculator",
    "gst exclusive calculator",
  ],
  openGraph: {
    title: "GST Calculator Australia 2026 — Add or Remove GST",
    description:
      "Instantly add or remove 10% GST from any amount. Bulk mode for invoices and a BAS helper for quarterly GST reporting.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How do I add GST to a price in Australia?",
    answer:
      "To add GST to a price, multiply the ex-GST amount by 1.1. For example, if an item costs $100 ex-GST, the GST-inclusive price is $100 × 1.1 = $110. The GST component is $10 (10% of the original price). All goods and services in Australia are subject to a flat 10% GST unless specifically exempt.",
  },
  {
    question: "How do I remove GST from a price?",
    answer:
      "To remove GST from a GST-inclusive price, divide the total by 1.1. For example, if an item costs $110 including GST, the ex-GST price is $110 ÷ 1.1 = $100, and the GST component is $10. A common mistake is to calculate 10% of the inclusive price ($11) — this gives the wrong answer. Always divide by 1.1 to extract the GST correctly.",
  },
  {
    question: "What is the GST rate in Australia?",
    answer:
      "The Australian Goods and Services Tax (GST) rate is 10%. It was introduced on 1 July 2000 and has remained at 10% since. GST applies to most goods, services, and other items sold or consumed in Australia. Some items are GST-free, including most basic food, certain health services, and some education courses.",
  },
  {
    question: "What items are GST-free in Australia?",
    answer:
      "GST-free items include most basic food (bread, milk, fruit, vegetables, meat), certain medical and health services, some education courses, childcare, exports, and sales of going concerns. Fresh food is generally GST-free, but prepared meals, confectionery, and snack food are not. Check the ATO website for the full list of GST-free items.",
  },
  {
    question: "Do I need to register for GST?",
    answer:
      "You must register for GST if your business has a GST turnover of $75,000 or more per year ($150,000 for non-profit organisations). You can choose to register voluntarily if your turnover is below the threshold. Once registered, you must charge GST on your taxable sales, lodge Business Activity Statements (BAS), and can claim GST credits for business purchases.",
  },
  {
    question: "How do I calculate GST for my BAS?",
    answer:
      "For your BAS, calculate the total GST collected on sales (1A) and total GST paid on purchases (1B). Your net GST position is 1A minus 1B. If positive, you owe the ATO. If negative, you are entitled to a refund. Most small businesses lodge BAS quarterly, but you can elect to lodge monthly. The ATO offers an instalment method or a calculation method for reporting.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian GST Calculator 2026",
  description:
    "Free GST calculator for Australia. Add or remove 10% GST from any amount. Includes bulk mode and BAS quarterly GST helper.",
  url: "https://au-calculators.vercel.app/calculators/gst",
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

export default function GstPage() {
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
            Australian GST Calculator 2026
          </h1>
          <p className="text-gray-600">
            Instantly add or remove 10% GST from any amount. Use bulk mode to calculate GST on
            multiple amounts at once, or the BAS helper to work out your quarterly GST payable
            or refund.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <GstCalculator />

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
