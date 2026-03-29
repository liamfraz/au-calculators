import type { Metadata } from "next";
import Link from "next/link";
import {
  SUBURBS,
  SLUG_TO_SUBURB,
  SUBURBS_BY_CITY,
  AVG_HECS_DEBT,
  NATIONAL_AVG_GRAD_SALARY,
  STATE_AVERAGES,
} from "../suburbs";
import AdUnit from "../../components/AdUnit";

// ATO 2025-26 HELP repayment thresholds (duplicated from calculator for static computation)
const REPAYMENT_THRESHOLDS = [
  { min: 0, max: 54_434, rate: 0 },
  { min: 54_435, max: 62_850, rate: 1.0 },
  { min: 62_851, max: 66_620, rate: 2.0 },
  { min: 66_621, max: 70_618, rate: 2.5 },
  { min: 70_619, max: 74_855, rate: 3.0 },
  { min: 74_856, max: 79_346, rate: 3.5 },
  { min: 79_347, max: 84_107, rate: 4.0 },
  { min: 84_108, max: 89_154, rate: 4.5 },
  { min: 89_155, max: 94_503, rate: 5.0 },
  { min: 94_504, max: 100_174, rate: 5.5 },
  { min: 100_175, max: 106_185, rate: 6.0 },
  { min: 106_186, max: 112_556, rate: 6.5 },
  { min: 112_557, max: 119_309, rate: 7.0 },
  { min: 119_310, max: 126_467, rate: 7.5 },
  { min: 126_468, max: 134_056, rate: 8.0 },
  { min: 134_057, max: 142_100, rate: 8.5 },
  { min: 142_101, max: 150_626, rate: 9.0 },
  { min: 150_627, max: 159_663, rate: 9.5 },
  { min: 159_664, max: Infinity, rate: 10.0 },
];

function getRepaymentRate(income: number): number {
  for (const bracket of REPAYMENT_THRESHOLDS) {
    if (income >= bracket.min && income <= bracket.max) {
      return bracket.rate;
    }
  }
  return 10.0;
}

/** Simulate HECS repayment year-by-year and return years to pay off + total repaid */
function simulateRepayment(
  debt: number,
  startingIncome: number,
  indexationRate = 3.2,
  salaryGrowth = 3.0
): { years: number; totalRepaid: number; totalIndexation: number } {
  let balance = debt;
  let income = startingIncome;
  let totalRepaid = 0;
  let totalIndexation = 0;

  for (let y = 1; y <= 50 && balance > 0; y++) {
    const indexation = Math.round(balance * (indexationRate / 100));
    balance += indexation;
    totalIndexation += indexation;

    const rate = getRepaymentRate(income);
    let repayment = rate > 0 ? Math.round(income * (rate / 100)) : 0;
    if (repayment > balance) repayment = Math.round(balance);

    balance -= repayment;
    totalRepaid += repayment;

    if (balance <= 0) return { years: y, totalRepaid: Math.round(totalRepaid), totalIndexation: Math.round(totalIndexation) };

    income *= 1 + salaryGrowth / 100;
  }

  return { years: balance > 0 ? -1 : 50, totalRepaid: Math.round(totalRepaid), totalIndexation: Math.round(totalIndexation) };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateStaticParams() {
  return SUBURBS.map((s) => ({ suburb: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>;
}): Promise<Metadata> {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return {};

  const sim = simulateRepayment(AVG_HECS_DEBT, suburb.avgGraduateSalary);
  const title = `HECS Repayment in ${suburb.name} | How Long to Pay Off`;
  const description = `Graduates in ${suburb.name}, ${suburb.state} earn ~${formatCurrency(suburb.avgGraduateSalary)}/yr. At that salary, a ${formatCurrency(AVG_HECS_DEBT)} HECS debt takes ~${sim.years} years to pay off. Free HECS calculator for ${suburb.name}.`;

  return {
    title,
    description,
    keywords: [
      `hecs repayment ${suburb.name.toLowerCase()}`,
      `hecs debt ${suburb.name.toLowerCase()}`,
      `how long to pay off hecs ${suburb.name.toLowerCase()}`,
      `graduate salary ${suburb.name.toLowerCase()}`,
      `hecs calculator ${suburb.name.toLowerCase()}`,
      `hecs repayment ${suburb.state.toLowerCase()}`,
      `student debt ${suburb.name.toLowerCase()}`,
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function HecsSuburbPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slug } = await params;
  const suburb = SLUG_TO_SUBURB[slug];
  if (!suburb) return null;

  const sim = simulateRepayment(AVG_HECS_DEBT, suburb.avgGraduateSalary);
  const rate = getRepaymentRate(suburb.avgGraduateSalary);
  const annualRepayment = Math.round(suburb.avgGraduateSalary * (rate / 100));
  const monthlyRepayment = Math.round(annualRepayment / 12);

  // State and national comparisons
  const stateAvg = STATE_AVERAGES[suburb.state] ?? NATIONAL_AVG_GRAD_SALARY;
  const stateSim = simulateRepayment(AVG_HECS_DEBT, stateAvg);
  const nationalSim = simulateRepayment(AVG_HECS_DEBT, NATIONAL_AVG_GRAD_SALARY);

  // Nearby suburbs in same city
  const nearbySuburbs = (SUBURBS_BY_CITY[suburb.city] || []).filter((s) => s.slug !== slug);
  const otherCitySuburbs = SUBURBS.filter((s) => s.slug !== slug && s.city !== suburb.city).slice(0, 8);

  const salaryDiffNational = suburb.avgGraduateSalary - NATIONAL_AVG_GRAD_SALARY;
  const salaryDiffLabel =
    salaryDiffNational > 0
      ? `${formatCurrency(salaryDiffNational)} above`
      : salaryDiffNational < 0
        ? `${formatCurrency(Math.abs(salaryDiffNational))} below`
        : "equal to";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `HECS Repayment Calculator — ${suburb.name}`,
    description: `Calculate how long it takes to pay off HECS-HELP debt for graduates in ${suburb.name}, ${suburb.state}.`,
    url: `https://au-calculators.vercel.app/hecs-repayment-calculator/${slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    author: { "@type": "Organization", name: "AU Calculators" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How long does it take to pay off HECS in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on the average graduate salary of ${formatCurrency(suburb.avgGraduateSalary)} in the ${suburb.name} area, a ${formatCurrency(AVG_HECS_DEBT)} HECS-HELP debt would take approximately ${sim.years} years to pay off through compulsory repayments, assuming 3.2% annual indexation and 3% salary growth.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the average graduate salary in ${suburb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The average graduate salary in the ${suburb.name}, ${suburb.state} area is approximately ${formatCurrency(suburb.avgGraduateSalary)} per year (2025-26 estimate based on ABS state-level data). This is ${salaryDiffLabel} the national graduate average of ${formatCurrency(NATIONAL_AVG_GRAD_SALARY)}.`,
        },
      },
      {
        "@type": "Question",
        name: `How much is the HECS repayment at ${formatCurrency(suburb.avgGraduateSalary)} income?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At an annual income of ${formatCurrency(suburb.avgGraduateSalary)}, the 2025-26 HECS-HELP compulsory repayment rate is ${rate}%, which means an annual repayment of ${formatCurrency(annualRepayment)} (approximately ${formatCurrency(monthlyRepayment)} per month).`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/hecs-repayment-calculator" className="hover:text-blue-600 transition-colors">
              HECS Calculator
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{suburb.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HECS Repayment in {suburb.name}
          </h1>
          <p className="text-gray-600">
            How long does it take to pay off your HECS-HELP debt as a graduate in {suburb.name}, {suburb.state}?
            Based on the average local graduate salary of {formatCurrency(suburb.avgGraduateSalary)}, here&apos;s what to expect.
          </p>
        </div>

        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Avg Graduate Salary</p>
                <p className="text-lg font-bold text-blue-900">{formatCurrency(suburb.avgGraduateSalary)}</p>
                <p className="text-xs text-blue-500 mt-1">{suburb.name} area</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-xs text-emerald-600 mb-1">Years to Pay Off</p>
                <p className="text-lg font-bold text-emerald-900">{sim.years > 0 ? `~${sim.years}` : "50+"}</p>
                <p className="text-xs text-emerald-500 mt-1">{formatCurrency(AVG_HECS_DEBT)} debt</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">Annual Repayment</p>
                <p className="text-lg font-bold text-amber-900">{formatCurrency(annualRepayment)}</p>
                <p className="text-xs text-amber-500 mt-1">{rate}% of income</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-600 mb-1">Monthly Deduction</p>
                <p className="text-lg font-bold text-purple-900">{formatCurrency(monthlyRepayment)}</p>
                <p className="text-xs text-purple-500 mt-1">From take-home pay</p>
              </div>
            </div>

            {/* Comparison table */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {suburb.name} vs State &amp; National Average
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Metric</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">{suburb.name}</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">{suburb.state} Average</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">National Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-800">Graduate Salary</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-700">{formatCurrency(suburb.avgGraduateSalary)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(stateAvg)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(NATIONAL_AVG_GRAD_SALARY)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-800">Repayment Rate</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-700">{rate}%</td>
                      <td className="px-4 py-3 text-right text-gray-600">{getRepaymentRate(stateAvg)}%</td>
                      <td className="px-4 py-3 text-right text-gray-600">{getRepaymentRate(NATIONAL_AVG_GRAD_SALARY)}%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-800">Annual Repayment</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-700">{formatCurrency(annualRepayment)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(Math.round(stateAvg * (getRepaymentRate(stateAvg) / 100)))}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(Math.round(NATIONAL_AVG_GRAD_SALARY * (getRepaymentRate(NATIONAL_AVG_GRAD_SALARY) / 100)))}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-800">Years to Pay Off {formatCurrency(AVG_HECS_DEBT)}</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-700">~{sim.years}</td>
                      <td className="px-4 py-3 text-right text-gray-600">~{stateSim.years}</td>
                      <td className="px-4 py-3 text-right text-gray-600">~{nationalSim.years}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-800">Total Repaid (inc. indexation)</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-700">{formatCurrency(sim.totalRepaid)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(stateSim.totalRepaid)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(nationalSim.totalRepaid)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Assumes {formatCurrency(AVG_HECS_DEBT)} average HECS debt, 3.2% indexation, 3% annual salary growth. State-level ABS data used as proxy for suburb-level estimates.
              </p>
            </section>

            {/* CTA to main calculator */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">Calculate Your Exact Repayment</h3>
              <p className="text-sm text-blue-800 mb-4">
                The figures above use average estimates. Enter your actual HECS debt and income to get a personalised year-by-year breakdown
                with indexation impact analysis.
              </p>
              <Link
                href="/hecs-repayment-calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open HECS Calculator
                <span>&rarr;</span>
              </Link>
            </div>

            <AdUnit slot="below-results" format="horizontal" className="mb-8" />

            {/* Suburb content */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Graduate Employment in {suburb.name}, {suburb.state}
              </h2>
              <p className="text-gray-600 mb-4">{suburb.description}</p>

              <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {suburb.name} Employment Snapshot
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Average graduate salary:</strong> {formatCurrency(suburb.avgGraduateSalary)} per year ({salaryDiffLabel} the national average)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>HECS repayment rate:</strong> {rate}% of repayment income ({formatCurrency(annualRepayment)}/year)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Time to clear {formatCurrency(AVG_HECS_DEBT)} debt:</strong> approximately {sim.years} years with compulsory repayments
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      <strong>Total cost of debt:</strong> {formatCurrency(sim.totalRepaid)} (includes {formatCurrency(sim.totalIndexation)} in indexation)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Local Employment Note</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{suburb.employmentNote}</p>
              </div>
            </section>

            {/* FAQ section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                HECS Repayment FAQs — {suburb.name}
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long does it take to pay off HECS in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Based on the average graduate salary of {formatCurrency(suburb.avgGraduateSalary)} in the {suburb.name} area,
                    a {formatCurrency(AVG_HECS_DEBT)} HECS-HELP debt would take approximately {sim.years} years to pay off
                    through compulsory repayments. This assumes 3.2% annual indexation and 3% salary growth. Higher income
                    or voluntary repayments can significantly reduce this timeframe.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What is the average graduate salary in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The average graduate salary in the {suburb.name}, {suburb.state} area is approximately {formatCurrency(suburb.avgGraduateSalary)} per year
                    (2025-26 estimate based on ABS state-level data). This is {salaryDiffLabel} the national graduate average
                    of {formatCurrency(NATIONAL_AVG_GRAD_SALARY)}. Actual salaries vary significantly by field of study, with STEM and
                    professional degrees typically commanding higher starting salaries.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How much is deducted from my pay for HECS in {suburb.name}?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    At the average graduate income of {formatCurrency(suburb.avgGraduateSalary)}, the ATO applies a {rate}% compulsory
                    repayment rate. This means approximately {formatCurrency(monthlyRepayment)} per month ({formatCurrency(annualRepayment)} per year)
                    is withheld from your pay to go toward your HECS-HELP debt. Your employer calculates this automatically through the PAYG withholding system.
                  </p>
                </div>
              </div>
            </section>

            {/* Nearby suburb links */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                HECS Repayment in Other {suburb.city} Suburbs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/hecs-repayment-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">HECS Repayment Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                {nearbySuburbs.map((other) => {
                  const otherSim = simulateRepayment(AVG_HECS_DEBT, other.avgGraduateSalary);
                  return (
                    <Link
                      key={other.slug}
                      href={`/hecs-repayment-calculator/${other.slug}`}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-blue-600 font-medium">
                        HECS in {other.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">~{otherSim.years} yrs</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Other city suburbs */}
            {otherCitySuburbs.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  More Suburb HECS Estimates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {otherCitySuburbs.map((other) => {
                    const otherSim = simulateRepayment(AVG_HECS_DEBT, other.avgGraduateSalary);
                    return (
                      <Link
                        key={other.slug}
                        href={`/hecs-repayment-calculator/${other.slug}`}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                      >
                        <span className="text-blue-600 font-medium">
                          HECS in {other.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">{other.state} · ~{otherSim.years} yrs</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Related calculators */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/calculators/salary-sacrifice"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Salary Sacrifice Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/super"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Superannuation Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/calculators/mortgage-repayment"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Mortgage Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
                <Link
                  href="/tax-withholding-calculator"
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-blue-600 font-medium">Tax Withholding Calculator</span>
                  <span className="text-gray-400 ml-auto">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar ad */}
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
