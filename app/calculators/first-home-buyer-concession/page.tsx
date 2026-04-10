import type { Metadata } from "next";
import FHBConcessionCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "First Home Buyer Stamp Duty Calculator Australia 2026 | All States",
  description:
    "Free first home buyer stamp duty concession calculator for all Australian states and territories. Compare FHB exemptions and concessions across NSW, VIC, QLD, SA, WA, TAS, NT, and ACT. See how much you save with 2025-2026 rates.",
  keywords: [
    "first home buyer stamp duty calculator australia",
    "first home buyer stamp duty exemption",
    "first home buyer concession calculator",
    "stamp duty concession first home buyer",
    "fhb stamp duty nsw",
    "fhb stamp duty vic",
    "fhb stamp duty qld",
    "first home buyer stamp duty 2026",
    "how much stamp duty first home buyer",
    "first home buyer concession australia",
  ],
  openGraph: {
    title: "First Home Buyer Stamp Duty Calculator Australia 2026",
    description:
      "Calculate your first home buyer stamp duty concession across all Australian states. Compare exemptions and savings with official 2025-2026 rates.",
    type: "website",
  },
};

const faqs = [
  {
    question: "Do first home buyers pay stamp duty in Australia?",
    answer:
      "Most states and territories in Australia offer stamp duty concessions or exemptions for eligible first home buyers. NSW exempts properties up to $800,000 with reduced duty to $1 million. Victoria exempts up to $600,000 with concessions to $750,000. Queensland exempts up to $700,000. South Australia offers full exemption for new homes with no price cap. The ACT exempts up to $1.017 million. However, Tasmania offers a 50% duty reduction, and the Northern Territory does not offer stamp duty concessions but provides a $50,000 grant instead. Use this calculator to see the benefit for your state and property price.",
  },
  {
    question: "Which state has the best stamp duty concession for first home buyers?",
    answer:
      "The \"best\" concession depends on your property price. The ACT offers the highest threshold at $1.017 million with full exemption, making it excellent for higher-priced properties. NSW and South Australia (for new homes) also offer generous concessions. For properties under $430,000, Western Australia's full exemption is excellent. Queensland's threshold of $700,000 covers most first home buyer purchases. Use the state comparison table in the calculator to see which state is best for your property price.",
  },
  {
    question: "What is the first home buyer stamp duty threshold in NSW, VIC, and QLD?",
    answer:
      "NSW: Full exemption on properties up to $800,000, with reduced concession up to $1 million. Victoria: Full exemption up to $600,000, with reduced concession up to $750,000. Queensland: Full exemption up to $700,000. These thresholds apply to eligible first home buyers purchasing a primary residence with a valid first home buyer certificate.",
  },
  {
    question: "Can I get the first home buyer stamp duty exemption on an investment property?",
    answer:
      "No. First home buyer stamp duty concessions only apply to primary residences (owner-occupied properties) that you intend to live in. Investment properties and rental properties are not eligible for these concessions. You will pay the full stamp duty rate without any FHB reduction. This is why it is important to have a plan to live in the property to qualify for the exemption.",
  },
  {
    question: "How do I claim the first home buyer stamp duty concession?",
    answer:
      "To claim the first home buyer stamp duty concession, you must obtain a First Home Buyer Certificate from your state's revenue office. Requirements typically include: (1) you have not previously owned a residential property in Australia, (2) the property is your principal place of residence, (3) you meet any income thresholds (where applicable). Apply for the certificate through your state's land titles office or revenue office and present it when lodging your property transfer. Your conveyancer can help guide you through the process and ensure you meet all eligibility criteria.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "First Home Buyer Stamp Duty Calculator Australia 2026",
  description:
    "Free calculator to estimate first home buyer stamp duty concessions and exemptions across all Australian states and territories.",
  url: "https://au-calculators.vercel.app/calculators/first-home-buyer-concession",
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

export default function FirstHomeBuyerConcessionPage() {
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
            First Home Buyer Stamp Duty Calculator 2026
          </h1>
          <p className="text-gray-600">
            Calculate your first home buyer stamp duty concession or exemption across all Australian
            states and territories. Compare the benefit of each state&apos;s FHB scheme using official
            2025–2026 rates.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <FHBConcessionCalculator />

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
