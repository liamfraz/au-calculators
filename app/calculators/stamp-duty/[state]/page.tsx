import type { Metadata } from "next";
import StampDutyCalculator from "../calculator";
import { StateCode, STATE_NAMES } from "../constants";
import AdUnit from "../../../components/AdUnit";
import Link from "next/link";

const SLUG_TO_CODE: Record<string, StateCode> = {
  nsw: "NSW", vic: "VIC", qld: "QLD", wa: "WA",
  sa: "SA", tas: "TAS", act: "ACT", nt: "NT",
};

// --- State-specific content ---

interface StateContent {
  ratesDescription: string;
  brackets: string[];
  fhbInfo: string;
  additionalNotes: string;
}

const STATE_CONTENT: Record<StateCode, StateContent> = {
  NSW: {
    ratesDescription: "NSW stamp duty (transfer duty) is calculated on a progressive scale with rates from 1.25% to 7%. The top marginal rate of 7% applies to properties valued above $3,721,000.",
    brackets: [
      "Up to $17,000 — 1.25%",
      "$17,001 to $37,000 — $212 + 1.5% of excess",
      "$37,001 to $99,000 — $512 + 1.75% of excess",
      "$99,001 to $372,000 — $1,597 + 3.5% of excess",
      "$372,001 to $1,240,000 — $11,152 + 4.5% of excess",
      "$1,240,001 to $3,721,000 — $50,212 + 5.5% of excess",
      "Over $3,721,000 — $186,667 + 7% of excess",
    ],
    fhbInfo: "First home buyers in NSW are exempt from stamp duty on properties valued up to $800,000. A reduced rate applies for properties between $800,000 and $1,000,000, with the concession phasing out linearly. This applies to both new and existing homes purchased as a primary residence.",
    additionalNotes: "NSW also offers a choice between paying stamp duty upfront or opting into an annual property tax for eligible properties. Foreign purchasers pay an additional 8% surcharge on top of standard duty rates.",
  },
  VIC: {
    ratesDescription: "Victoria has separate stamp duty scales for general transfers and primary residences (for properties under $550,000). General rates range from 1.4% to 6.5%, with the top rate applying above $2,000,000.",
    brackets: [
      "Up to $25,000 — 1.4%",
      "$25,001 to $130,000 — $350 + 2.4% of excess",
      "$130,001 to $960,000 — $2,870 + 6% of excess",
      "$960,001 to $2,000,000 — 5.5% of total value",
      "Over $2,000,000 — $110,000 + 6.5% of excess",
      "Primary residence discount applies for properties under $550,000",
    ],
    fhbInfo: "Victorian first home buyers pay no stamp duty on properties valued up to $600,000. A concession applies for properties between $600,000 and $750,000, reducing on a sliding scale. The First Home Owner Grant of $10,000 is also available for new homes valued up to $750,000.",
    additionalNotes: "Victoria imposes a foreign purchaser additional duty of 8%. An off-the-plan concession may reduce the dutiable value for apartments and units purchased before construction is complete.",
  },
  QLD: {
    ratesDescription: "Queensland stamp duty (transfer duty) uses separate rate scales for general purchases and home concession (owner-occupied primary residences). The home concession rate starts at 1% and offers significant savings on properties up to $540,000.",
    brackets: [
      "General: Up to $5,000 — nil",
      "General: $5,001 to $75,000 — 1.5% of excess over $5,000",
      "General: $75,001 to $540,000 — $1,050 + 3.5% of excess",
      "General: $540,001 to $1,000,000 — $17,325 + 4.5% of excess",
      "General: Over $1,000,000 — $38,025 + 5.75% of excess",
      "Home concession: Up to $350,000 — 1% of value",
      "Home concession: $350,001 to $540,000 — $3,500 + 3.5% of excess",
    ],
    fhbInfo: "Queensland first home buyers are exempt from stamp duty on properties valued up to $700,000 when using the home concession rate. The First Home Owner Grant of $30,000 applies to new homes valued under $750,000. There is no sliding scale — the exemption is a hard cut-off at $700,000.",
    additionalNotes: "Queensland charges an additional 7% foreign acquirer duty. The home concession rate is only available if you intend to live in the property as your principal place of residence within 12 months of settlement.",
  },
  SA: {
    ratesDescription: "South Australia stamp duty is calculated on a progressive scale with 9 brackets, ranging from 1% to 5.5%. The same rates apply regardless of whether the property is a primary residence or investment.",
    brackets: [
      "Up to $12,000 — 1%",
      "$12,001 to $30,000 — $120 + 2% of excess",
      "$30,001 to $50,000 — $480 + 3% of excess",
      "$50,001 to $100,000 — $1,080 + 3.5% of excess",
      "$100,001 to $200,000 — $2,830 + 4% of excess",
      "$200,001 to $250,000 — $6,830 + 4.25% of excess",
      "$250,001 to $300,000 — $8,955 + 4.75% of excess",
      "$300,001 to $500,000 — $11,330 + 5% of excess",
      "Over $500,000 — $21,330 + 5.5% of excess",
    ],
    fhbInfo: "South Australia offers a full stamp duty exemption for first home buyers purchasing new homes, with no price cap. This is one of the most generous first home buyer schemes in Australia. The $15,000 First Home Owner Grant also applies to new homes valued up to $650,000. Note: the stamp duty exemption applies to new homes only — established homes do not qualify.",
    additionalNotes: "SA charges a foreign ownership surcharge of 7%. Off-the-plan purchasers may be eligible for a stamp duty concession based on construction costs excluded from the dutiable value.",
  },
  WA: {
    ratesDescription: "Western Australia stamp duty is calculated on a 5-bracket progressive scale with rates from 1.9% to 5.15%. WA does not differentiate between primary residences and investment properties for base duty calculation.",
    brackets: [
      "Up to $120,000 — 1.9%",
      "$120,001 to $150,000 — $2,280 + 2.85% of excess",
      "$150,001 to $360,000 — $3,135 + 3.8% of excess",
      "$360,001 to $725,000 — $11,115 + 4.75% of excess",
      "Over $725,000 — $28,453 + 5.15% of excess",
    ],
    fhbInfo: "WA first home buyers are exempt from stamp duty on properties valued up to $500,000. A reduced rate applies for properties between $500,000 and $700,000, phasing out linearly. The First Home Owner Grant of $10,000 applies for new homes valued under $750,000.",
    additionalNotes: "WA charges a foreign buyer surcharge of 7%. The Keystart home loan scheme is also available to eligible first home buyers, offering low-deposit loans with no lenders mortgage insurance.",
  },
  TAS: {
    ratesDescription: "Tasmania stamp duty uses a 7-bracket progressive scale with rates from 1.75% to 4.5%. Tasmania has the lowest top marginal rate of any Australian state, making it relatively affordable for high-value property purchases.",
    brackets: [
      "Up to $3,000 — $50 minimum",
      "$3,001 to $25,000 — $50 + 1.75% of excess over $3,000",
      "$25,001 to $75,000 — $435 + 2.25% of excess",
      "$75,001 to $200,000 — $1,560 + 3.5% of excess",
      "$200,001 to $375,000 — $5,935 + 4% of excess",
      "$375,001 to $725,000 — $12,935 + 4.25% of excess",
      "Over $725,000 — $27,810 + 4.5% of excess",
    ],
    fhbInfo: "Tasmanian first home buyers are exempt from stamp duty on properties valued up to $750,000. This exemption is available until 30 June 2026. The First Home Owner Grant of $30,000 is available for new homes in Tasmania, one of the most generous grants in the country.",
    additionalNotes: "Tasmania charges a foreign investor duty surcharge of 8%. The first home buyer stamp duty exemption applies to both new and existing homes, provided the buyer intends to live in the property as their principal residence.",
  },
  ACT: {
    ratesDescription: "The ACT uses a unique stamp duty system as part of its transition to a land tax-based model. There are separate scales for owner-occupiers (lower rates from 0.28%) and investors (higher rates from 1.2%). The ACT generally has the lowest stamp duty in Australia for owner-occupiers.",
    brackets: [
      "Owner-occupier: Up to $260,000 — 0.28%",
      "Owner-occupier: $260,001 to $300,000 — $728 + 0.49% of excess",
      "Owner-occupier: $300,001 to $500,000 — $924 + 3.4% of excess",
      "Owner-occupier: $500,001 to $750,000 — $7,724 + 4.15% of excess",
      "Owner-occupier: $750,001 to $1,000,000 — $18,099 + 4.32% of excess",
      "Investor: Up to $200,000 — 1.2%",
      "Investor: $200,001 to $300,000 — $2,400 + 2.2% of excess",
      "Investor: $300,001 to $500,000 — $4,600 + 3.4% of excess",
    ],
    fhbInfo: "ACT first home buyers are exempt from stamp duty on properties valued up to $1,020,000 — the highest threshold in Australia. For properties above this value, a partial concession of up to $35,238 applies. An income test applies: the combined household income must be under $160,000. The Home Buyer Concession Scheme replaced the previous FHOG in the ACT.",
    additionalNotes: "The ACT is progressively abolishing stamp duty and replacing it with higher annual land tax (rates). Foreign purchasers pay a surcharge of 0.75% of the unimproved land value annually. The ACT does not charge a separate foreign buyer stamp duty surcharge.",
  },
  NT: {
    ratesDescription: "The Northern Territory uses a unique quadratic formula for properties valued under $525,000, resulting in a smoothly increasing rate. Above $525,000, tiered flat rates of 4.95% to 5.95% apply depending on value.",
    brackets: [
      "Up to $525,000 — formula: V × (0.06571441 × V/1000 + 15) per $1,000",
      "$525,001 to $3,000,000 — 4.95% of total value",
      "$3,000,001 to $5,000,000 — 5.75% of total value",
      "Over $5,000,000 — 5.95% of total value",
    ],
    fhbInfo: "The NT does not offer stamp duty concessions for first home buyers. Instead, the Territory Home Owner Discount provides a reduction of up to $18,601 on stamp duty for owner-occupiers (not limited to first home buyers). The $50,000 HomeGrown Territory grant is available for first home buyers purchasing or building new homes.",
    additionalNotes: "The NT does not impose a foreign buyer stamp duty surcharge. The HomeGrown Territory grant is one of the most generous in Australia and is available for new homes valued up to $750,000.",
  },
};

export function generateStaticParams() {
  return Object.keys(SLUG_TO_CODE).map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const code = SLUG_TO_CODE[slug];
  if (!code) return {};

  const fullName = STATE_NAMES[code];
  const title = `${code} Stamp Duty Calculator 2026 | ${fullName} Transfer Duty`;
  const description = `Free ${fullName} stamp duty calculator. Calculate ${code} transfer duty, first home buyer concessions, and compare rates using official 2025–2026 ${code} stamp duty brackets.`;

  return {
    title,
    description,
    keywords: [
      `stamp duty calculator ${slug}`,
      `${slug} stamp duty 2026`,
      `${fullName.toLowerCase()} stamp duty calculator`,
      `${slug} transfer duty calculator`,
      `first home buyer stamp duty ${slug}`,
      `stamp duty ${slug} 2026`,
      `how much is stamp duty in ${slug}`,
      `${fullName.toLowerCase()} stamp duty rates`,
    ],
    openGraph: {
      title: `${code} Stamp Duty Calculator 2026 — ${fullName}`,
      description,
      type: "website",
    },
  };
}

export default async function StateStampDutyPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const code = SLUG_TO_CODE[slug];
  if (!code) return null;

  const fullName = STATE_NAMES[code];
  const content = STATE_CONTENT[code];
  const otherStates = Object.entries(SLUG_TO_CODE).filter(([, c]) => c !== code);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${code} Stamp Duty Calculator 2026`,
    description: `Free ${fullName} stamp duty calculator with ${code} transfer duty rates, first home buyer concessions, and state comparison.`,
    url: `https://au-calculators.vercel.app/calculators/stamp-duty/${slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    author: { "@type": "Organization", name: "AU Calculators" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {code} Stamp Duty Calculator 2026
          </h1>
          <p className="text-gray-600">
            Calculate stamp duty (transfer duty) for {fullName} using official
            2025–2026 rates. See {code} first home buyer concessions, compare
            with other states, and estimate your total duty payable.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <StampDutyCalculator initialState={code} />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />

            {/* State-specific rates section */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {fullName} Stamp Duty Rates 2025–2026
              </h2>
              <p className="text-gray-600 mb-4">{content.ratesDescription}</p>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {code} Stamp Duty Brackets
                </h3>
                <ul className="space-y-2">
                  {content.brackets.map((bracket) => (
                    <li
                      key={bracket}
                      className="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span className="text-blue-500 mt-1 shrink-0">&#8226;</span>
                      {bracket}
                    </li>
                  ))}
                </ul>
              </div>

              {/* First Home Buyer section */}
              <div className="border border-green-200 rounded-xl p-6 bg-green-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {code} First Home Buyer Stamp Duty Concessions
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {content.fhbInfo}
                </p>
              </div>

              {/* Additional notes */}
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Additional Information
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {content.additionalNotes}
                </p>
              </div>
            </section>

            {/* Internal links to other state calculators */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Stamp Duty Calculators by State
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/stamp-duty"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">
                    All States — Stamp Duty Calculator
                  </span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {otherStates.map(([otherSlug, otherCode]) => (
                  <Link
                    key={otherSlug}
                    href={`/calculators/stamp-duty/${otherSlug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <span className="text-blue-600 font-medium">
                      {otherCode} Stamp Duty Calculator
                    </span>
                    <span className="text-gray-400 ml-auto">&rarr;</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar ad: Desktop only */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
