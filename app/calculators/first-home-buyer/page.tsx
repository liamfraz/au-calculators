import type { Metadata } from "next";
import FirstHomeBuyerCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";

export const metadata: Metadata = {
  title: "First Home Buyer Eligibility Calculator Australia 2024",
  description:
    "Check your eligibility for Australian first home buyer schemes — First Home Guarantee, FHSS, FHOG grants, and stamp duty exemptions. See how much you could save by state.",
  keywords: [
    "first home buyer australia",
    "first home buyer eligibility",
    "first home buyer grant",
    "FHOG calculator",
    "first home guarantee",
    "FHBG eligibility",
    "first home super saver",
    "FHSS calculator",
    "stamp duty exemption first home buyer",
    "first home buyer schemes australia",
    "first home buyer calculator",
    "first home owner grant 2024",
    "first home buyer deposit scheme",
    "first home buyer concession",
    "housing australia first home",
  ],
  openGraph: {
    title: "First Home Buyer Eligibility Calculator Australia 2024",
    description:
      "Check your eligibility for FHBG, FHSS, FHOG, and stamp duty concessions. See estimated savings by state.",
    type: "website",
  },
  alternates: {
    canonical: "https://au-calculators.vercel.app/calculators/first-home-buyer",
  },
};

const faqs = [
  {
    question: "What is the First Home Guarantee (FHBG)?",
    answer:
      "The First Home Guarantee allows eligible first home buyers to purchase a home with as little as a 5% deposit without paying Lenders Mortgage Insurance (LMI). The government guarantees up to 15% of the property value. Income caps are $125,000 for singles and $200,000 for couples, and property price caps vary by state.",
  },
  {
    question: "How does the First Home Super Saver (FHSS) scheme work?",
    answer:
      "The FHSS lets you make voluntary contributions to your super fund, then withdraw them (plus deemed earnings) for a first home deposit. You can withdraw up to $50,000 in total contributions. Because super contributions are taxed at 15% instead of your marginal tax rate, you save on tax — typically around $7,500 on the maximum amount.",
  },
  {
    question: "How much is the First Home Owner Grant (FHOG) in each state?",
    answer:
      "FHOG amounts vary: QLD and TAS offer $30,000, SA offers $15,000, and NSW, VIC, WA, and NT offer $10,000. ACT offers $7,000. Most states restrict the grant to new builds only, with the NT being the exception that also covers existing homes. Property price caps range from $600,000 to $750,000 depending on the state.",
  },
  {
    question: "Can I combine multiple first home buyer schemes?",
    answer:
      "Yes! In most cases you can combine the FHBG, FHSS, FHOG, and stamp duty exemptions. For example, you could use FHSS to boost your deposit, claim the FHOG grant, get a stamp duty exemption, and buy with 5% deposit under the FHBG — potentially saving $50,000+ in total.",
  },
  {
    question: "What are the stamp duty exemptions for first home buyers?",
    answer:
      "Each state offers different concessions. NSW exempts properties under $800,000 with concessions up to $1,000,000. VIC exempts under $600,000. QLD exempts under $700,000. ACT exempts up to $1,000,000. WA exempts under $430,000. SA, TAS, and NT have limited or no first home buyer stamp duty exemptions.",
  },
  {
    question: "Do I need to be an Australian citizen to access these schemes?",
    answer:
      "Most schemes require you to be an Australian citizen or permanent resident. The FHBG requires at least one applicant to be an Australian citizen. The FHOG and stamp duty exemptions also generally require citizenship or permanent residency. Temporary visa holders are generally not eligible.",
  },
  {
    question: "What counts as a 'first home buyer' in Australia?",
    answer:
      "Generally, you qualify as a first home buyer if you have never owned or co-owned a residential property in Australia. Some schemes also require that you have not previously received a first home owner grant. You must intend to live in the property as your principal place of residence.",
  },
  {
    question: "What are the FHBG property price caps by state?",
    answer:
      "Property price caps under the First Home Guarantee (2024-25) are: NSW $900,000, VIC $800,000, QLD $700,000, ACT $750,000, and $600,000 for WA, SA, TAS, and NT. These caps apply to the total property purchase price.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "First Home Buyer Eligibility Calculator Australia 2024",
  description:
    "Check your eligibility for Australian first home buyer schemes including FHBG, FHSS, FHOG, and stamp duty exemptions. Calculate estimated savings by state.",
  url: "https://au-calculators.vercel.app/calculators/first-home-buyer",
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

export default function FirstHomeBuyerPage() {
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
            First Home Buyer Eligibility Calculator Australia 2024
          </h1>
          <p className="text-gray-600">
            Check which Australian first home buyer schemes you qualify for — the First Home
            Guarantee, First Home Super Saver, state grants, and stamp duty exemptions. Enter your
            details to see your estimated savings.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <FirstHomeBuyerCalculator />

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Ready to Buy Your First Home?
              </h2>
              <p className="text-sm text-blue-800 mb-4">
                These schemes can be combined to maximise your savings. Speak with a mortgage broker
                who specialises in first home buyers to get personalised advice on your situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.housingaustralia.gov.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                >
                  Visit Housing Australia
                </a>
                <a
                  href="https://www.ato.gov.au/individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  FHSS at ATO
                </a>
              </div>
            </div>

            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>

        {/* Info Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding First Home Buyer Schemes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">First Home Guarantee (FHBG)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The FHBG lets you buy with just 5% deposit without paying Lenders Mortgage Insurance
                (LMI). The government guarantees up to 15% of the property value. Places are limited
                to 35,000 per financial year, so apply early through a participating lender.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">First Home Super Saver (FHSS)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Save for your deposit inside super to take advantage of the lower 15% tax rate on
                concessional contributions. You can withdraw up to $50,000 of voluntary contributions
                plus deemed earnings. This can save you thousands compared to saving in a regular bank
                account.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">First Home Owner Grant (FHOG)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A one-off grant paid by your state government to help first home buyers. Amounts range
                from $7,000 to $30,000 depending on your state. Most states restrict this to new builds
                only, with property price caps varying by state.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Stamp Duty Exemptions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Most states offer first home buyers a full exemption or concession on stamp duty
                (transfer duty) below certain price thresholds. This can save tens of thousands of
                dollars — for example, a full exemption in NSW on a $700,000 property saves over
                $27,000 in stamp duty.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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
