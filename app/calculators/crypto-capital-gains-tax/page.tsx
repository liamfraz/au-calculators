import type { Metadata } from "next";
import CryptoCgtCalculator from "./calculator";
import AdUnit from "../../components/AdUnit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crypto Tax Calculator Australia 2025-26 | CGT on Bitcoin & Crypto",
  description:
    "Calculate capital gains tax (CGT) on your crypto trades in Australia. Includes 50% CGT discount for assets held 12+ months, marginal tax rates, and ATO-compliant calculations for Bitcoin, Ethereum and all cryptocurrencies.",
  keywords: [
    "crypto tax calculator Australia",
    "cryptocurrency CGT Australia",
    "bitcoin capital gains tax Australia",
    "crypto capital gains tax calculator",
    "ATO crypto tax 2025",
    "crypto CGT discount Australia",
    "cryptocurrency tax Australia 2026",
    "bitcoin tax calculator ATO",
  ],
  openGraph: {
    title: "Crypto Tax Calculator Australia 2025-26 | CGT on Bitcoin & Crypto",
    description:
      "Calculate your crypto capital gains tax with the 50% CGT discount, marginal tax rates, and ATO-compliant results. Free, instant, no login required.",
    type: "website",
  },
};

const faqs = [
  {
    question: "Do I have to pay tax on crypto in Australia?",
    answer:
      "Yes. The ATO treats cryptocurrency as a CGT asset, not currency. Every time you sell, trade, or otherwise dispose of crypto you trigger a CGT event. This includes selling crypto for AUD, swapping one coin for another (crypto-to-crypto), using crypto to buy goods or services, and receiving crypto as income (mining, staking, airdrops). You must report these in your tax return.",
  },
  {
    question: "What is the 50% CGT discount and when does it apply?",
    answer:
      "If you hold a crypto asset for more than 12 months before disposing of it, you can discount the capital gain by 50% before adding it to your assessable income. For example, a $10,000 gain on Bitcoin held for 18 months becomes a $5,000 taxable gain. The 50% discount only applies to individuals and trusts — companies do not get the discount. It only applies to gains, not losses.",
  },
  {
    question: "Is crypto-to-crypto a taxable event in Australia?",
    answer:
      "Yes. Swapping one cryptocurrency for another (e.g., ETH for SOL) is treated as a disposal of the first asset and an acquisition of the second. The ATO considers the AUD market value at the time of the swap as the proceeds. You must record the AUD value of both coins at the time of the trade. This is why dedicated crypto tax software that tracks historical prices is valuable for active traders.",
  },
  {
    question: "How do capital losses on crypto work?",
    answer:
      "If you sell crypto at a loss, that capital loss can offset capital gains in the same income year. For example, if you have a $5,000 capital gain from Bitcoin and a $2,000 loss from another coin, only $3,000 is taxable (after any applicable CGT discount). If your total capital losses exceed your gains for the year, the excess is carried forward to future income years — it cannot be used to offset other income like wages.",
  },
  {
    question: "What marginal tax rate applies to crypto gains?",
    answer:
      "Crypto capital gains are added to your total assessable income and taxed at your marginal rate. For 2025-26, the rates are: 0% up to $18,200; 19% from $18,201–$45,000; 32.5% from $45,001–$120,000; 37% from $120,001–$180,000; and 45% above $180,000. The Medicare Levy (2%) also applies. Because crypto gains can push you into a higher bracket, timing your disposals across financial years is a common strategy.",
  },
  {
    question: "Does the ATO know about my crypto?",
    answer:
      "Yes. The ATO receives data from Australian exchanges (Coinbase, Independent Reserve, CoinSpot, Swyftx, etc.) through its data matching program, and receives information from foreign exchanges via international tax information sharing agreements. The ATO has explicitly stated crypto is a compliance focus. Failure to report gains can result in penalties, interest, and back-taxes.",
  },
  {
    question: "What records do I need to keep?",
    answer:
      "The ATO requires you to keep records for all crypto transactions for 5 years after disposal. For each transaction you need: the date, the type of transaction, the amount in AUD (or the AUD value at the time), the exchange or wallet used, and any fees paid. Transaction fees (gas fees, exchange fees) can be added to your cost base, reducing your capital gain.",
  },
  {
    question: "What is the best crypto tax software for Australian users?",
    answer:
      "Koinly is the most popular crypto tax tool for Australians, supporting 700+ exchanges and wallets and generating ATO-compliant tax reports. Other options include CryptoTaxCalculator (Australian-made), Syla, and CoinTracker. For simple one-off trades, this calculator is sufficient. For multiple transactions across exchanges, dedicated software will save hours of manual work.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Crypto Capital Gains Tax Calculator",
  description:
    "Calculate capital gains tax on cryptocurrency trades in Australia, including the 50% CGT discount for assets held over 12 months.",
  url: "https://aucalculators.com.au/calculators/crypto-capital-gains-tax",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  featureList: [
    "50% CGT discount for assets held 12+ months",
    "Marginal tax rate calculation",
    "Capital loss offsetting",
    "After-tax profit calculation",
    "ATO-compliant results",
  ],
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

export default function CryptoCgtPage() {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crypto Tax Calculator Australia 2025–26
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Calculate capital gains tax (CGT) on your cryptocurrency trades. Includes the 50% CGT
            discount for assets held over 12 months and ATO-compliant calculations for BTC, ETH, and
            all crypto assets.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <CryptoCgtCalculator />
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24 space-y-4">
              <AdUnit slot="sidebar" format="vertical" />

              {/* Quick rules box */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">ATO Crypto Tax Rules</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>50% CGT discount if held &gt;12 months</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>Capital gains taxed at your marginal rate</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>Crypto-to-crypto swaps are taxable events</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>Capital losses offset gains in the same year</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>Excess losses carried forward to future years</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold shrink-0">!</span>
                    <span>ATO receives data from Aus exchanges automatically</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Calculators */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/calculators/capital-gains-tax"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Capital Gains Tax</p>
              <p className="text-gray-500 text-xs mt-1">CGT on shares, property, and other assets</p>
            </Link>
            <Link
              href="/calculators/income-tax"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">Income Tax Calculator</p>
              <p className="text-gray-500 text-xs mt-1">Estimate your total income tax for 2025–26</p>
            </Link>
            <Link
              href="/calculators/hecs-help"
              className="block p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-gray-900 text-sm">HECS / HELP Repayment</p>
              <p className="text-gray-500 text-xs mt-1">See if your crypto income triggers HECS repayment</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
