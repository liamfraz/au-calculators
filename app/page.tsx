import Link from "next/link";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AU Calculators — Free Financial Calculators for Australians",
  description:
    "Free Australian financial calculators for mortgage repayments, stamp duty, income tax, superannuation, car loans, capital gains tax, and more. Updated with 2025-26 rates and thresholds.",
  url: "https://au-calculators.vercel.app",
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
  featureList: [
    "Income Tax Calculator 2025-26",
    "Mortgage Repayment Calculator",
    "Mortgage Offset Calculator",
    "Stamp Duty Calculator — All States",
    "Income Tax & PAYG Withholding Calculator",
    "Car Loan Calculator",
    "Capital Gains Tax Calculator",
    "Superannuation Calculator",
    "HECS-HELP Repayment Calculator",
    "Compound Interest Calculator",
    "Centrelink Payment Estimator",
    "Rental Yield Calculator",
    "Property Cash Flow Calculator",
    "Investment Property Cash Flow Calculator",
    "Land Tax Calculator",
    "Depreciation Schedule Estimator",
    "Energy Bill Calculator",
    "Age Pension Calculator",
    "Super Contribution Calculator",
    "Child Care Subsidy Calculator",
    "BMI Calculator",
  ],
};

interface Calculator {
  title: string;
  description: string;
  href: string;
  icon: string;
  tags: string[];
  comingSoon?: boolean;
}

const calculators: Calculator[] = [
  {
    title: "Income Tax Calculator 2025-26",
    description:
      "Calculate your Australian income tax, Medicare levy, HELP repayments, and net take-home pay using official ATO 2025-26 tax brackets. See your Stage 3 tax cut savings with a detailed bracket-by-bracket breakdown.",
    href: "/calculators/income-tax",
    icon: "💰",
    tags: ["Income Tax", "ATO 2025-26", "Take-Home Pay"],
  },
  {
    title: "Mortgage Repayment Calculator",
    description:
      "Calculate your home loan repayments, total interest, and view an amortization schedule. Compare different rates and terms side by side.",
    href: "/calculators/mortgage-repayment",
    icon: "🏠",
    tags: ["Home Loan", "Interest", "Amortization"],
  },
  {
    title: "Mortgage Offset Calculator",
    description:
      "See how much interest an offset account saves on your home loan. Compare offset vs redraw, view AU bank offset products, and calculate time saved.",
    href: "/calculators/mortgage-offset",
    icon: "🏦",
    tags: ["Offset Account", "Interest Saved", "Redraw"],
  },
  {
    title: "Car Loan Calculator",
    description:
      "Calculate car loan repayments with balloon payment option. Compare weekly, fortnightly, and monthly repayments across different rates and terms.",
    href: "/car-loan-calculator",
    icon: "🚗",
    tags: ["Car Finance", "Vehicle Loan", "Balloon Payment"],
  },
  {
    title: "Stamp Duty Calculator 2026 — All States",
    description:
      "Calculate stamp duty for all Australian states and territories. Covers first home buyer concessions, foreign buyer surcharges, transfer fees, and your full settlement day total.",
    href: "/calculators/stamp-duty",
    icon: "📋",
    tags: ["Property", "Transfer Duty", "All States", "First Home Buyer"],
  },
  {
    title: "First Home Buyer Stamp Duty Concession Calculator",
    description:
      "Calculate your stamp duty concession as a first home buyer. Covers all Australian states and territories with 2025–2026 rates.",
    href: "/calculators/first-home-buyer-concession",
    icon: "🏠",
    tags: ["Property", "Tax", "First Home", "Stamp Duty"],
  },
  {
    title: "Income Tax Calculator",
    description:
      "Calculate your Australian income tax, PAYG withholding, Medicare levy, HELP repayments, and net take-home pay using 2025-26 ATO tax brackets.",
    href: "/tax-withholding-calculator",
    icon: "💰",
    tags: ["Tax", "PAYG", "Medicare"],
  },
  {
    title: "Superannuation Calculator",
    description:
      "Project your superannuation balance at retirement based on your current contributions and investment returns.",
    href: "/calculators/super",
    icon: "📈",
    tags: ["Super", "Retirement"],
  },
  {
    title: "Energy Bill Calculator",
    description:
      "Estimate your quarterly electricity and gas costs by state, calculate solar savings, and compare to the state average.",
    href: "/calculators/energy-bill",
    icon: "⚡",
    tags: ["Electricity", "Gas", "Solar"],
  },
  {
    title: "HECS-HELP Repayment Calculator",
    description:
      "Calculate your HECS-HELP student loan repayments based on ATO thresholds. See fortnightly deductions, years to repay, and indexation impact.",
    href: "/calculators/hecs-help",
    icon: "🎓",
    tags: ["HECS", "Student Loan", "ATO"],
  },
  {
    title: "Rental Yield Calculator",
    description:
      "Calculate gross and net rental yield from purchase price and weekly rent. Compare investment property returns with detailed expense breakdowns.",
    href: "/calculators/rental-yield",
    icon: "📊",
    tags: ["Rental Yield", "Investment", "Returns"],
  },
  {
    title: "Negative Gearing Calculator",
    description:
      "Estimate the tax benefit of negatively geared investment property. See how rental losses offset your taxable income using 2025-26 ATO tax rates.",
    href: "/calculators/negative-gearing",
    icon: "🏘️",
    tags: ["Negative Gearing", "Investment Property", "Tax Benefit"],
  },
  {
    title: "Property Cash Flow Calculator",
    description:
      "Compare rental income against all expenses including mortgage, rates, insurance, and management fees. See your monthly and annual cash position.",
    href: "/calculators/property-cashflow",
    icon: "💵",
    tags: ["Cash Flow", "Investment Property", "Expenses"],
  },
  {
    title: "Investment Property Cash Flow Calculator",
    description:
      "Calculate gross yield, net yield, cash-on-cash return, break-even rent, and negative gearing tax benefits. Full property investment analysis with 2025-26 ATO tax brackets.",
    href: "/calculators/investment-property-cashflow",
    icon: "🏠",
    tags: ["Cash Flow", "Yields", "Negative Gearing"],
  },
  {
    title: "Land Tax Calculator",
    description:
      "Calculate land tax for all Australian states using 2025-2026 thresholds and rates. Compare land tax across states with trust and absentee surcharges.",
    href: "/land-tax-calculator",
    icon: "🏗️",
    tags: ["Land Tax", "All States", "Thresholds"],
  },
  {
    title: "Depreciation Schedule Estimator",
    description:
      "Estimate building allowance (Division 43) and plant & equipment (Division 40) depreciation for investment properties. Maximise your tax deductions.",
    href: "/calculators/depreciation",
    icon: "📉",
    tags: ["Depreciation", "Division 43", "Division 40"],
  },
  {
    title: "Compound Interest Calculator",
    description:
      "Calculate compound interest on savings with Australian bank rate presets. Compare growth with and without monthly contributions and view year-by-year breakdowns.",
    href: "/calculators/compound-interest",
    icon: "💹",
    tags: ["Compound Interest", "Savings", "Bank Rates"],
  },
  {
    title: "Capital Gains Tax Calculator",
    description:
      "Calculate CGT on property, shares, and crypto. Auto-detects the 50% discount for assets held over 12 months and estimates tax using 2025-26 ATO brackets.",
    href: "/cgt-calculator",
    icon: "📊",
    tags: ["CGT", "Property", "Shares"],
  },
  {
    title: "Super Contribution Calculator",
    description:
      "Calculate optimal super contributions, salary sacrifice tax savings, concessional cap ($30K), carry-forward amounts, and compare contribution scenarios for FY2025-26.",
    href: "/super-contribution-calculator",
    icon: "\uD83C\uDFAF",
    tags: ["Super", "Contributions", "Tax Savings"],
  },
  {
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index, healthy weight range, ideal weight, and waist-to-height ratio. Includes Australian health guidelines for Asian populations.",
    href: "/bmi-calculator",
    icon: "⚖️",
    tags: ["BMI", "Healthy Weight", "Health"],
  },
  {
    title: "Age Pension Calculator",
    description:
      "Calculate your Centrelink Age Pension using 2025-26 income test and assets test thresholds. Shows fortnightly and annual rates for singles and couples.",
    href: "/calculators/age-pension",
    icon: "\uD83C\uDFE6",
    tags: ["Age Pension", "Income Test", "Assets Test"],
  },
  {
    title: "Child Care Subsidy Calculator",
    description:
      "Calculate your CCS percentage, subsidised hours, gap fees, and annual out-of-pocket childcare costs. Uses 2025-26 income tiers and activity test.",
    href: "/calculators/child-care-subsidy",
    icon: "\uD83D\uDC76",
    tags: ["CCS", "Childcare", "Gap Fee"],
  },
  {
    title: "Centrelink Payment Estimator",
    description:
      "Estimate Centrelink payments including JobSeeker, Youth Allowance, Age Pension, and Parenting Payment. Apply income test and assets test with 2025-26 rates.",
    href: "/centrelink-payment-estimator",
    icon: "\uD83C\uDFE6",
    tags: ["JobSeeker", "Income Test", "Assets Test"],
  },
  {
    title: "Salary Sacrifice Calculator",
    description:
      "Calculate tax savings from salary sacrificing into super. Compare take-home pay, check the $30,000 concessional cap, and project your super balance at retirement.",
    href: "/salary-sacrifice-calculator",
    icon: "\uD83D\uDCB8",
    tags: ["Salary Sacrifice", "Super", "Tax Savings"],
  },
  {
    title: "Electricity Bill Calculator",
    description:
      "Estimate your quarterly and annual electricity costs by state. Adjust usage rates, supply charges, and calculate how much solar panels can save you.",
    href: "/electricity-bill-calculator",
    icon: "💡",
    tags: ["Electricity", "Power Bill", "Solar"],
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Free Financial Calculators for Australians
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Simple, accurate financial tools designed for Australian conditions — rates, taxes, and
          regulations. No sign-up required.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {calculators.map((calc) => {
          const cardClass = `block p-6 rounded-xl border border-gray-200 transition-all ${
            calc.comingSoon
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5"
          }`;
          const inner = (
            <div className="flex items-start gap-4">
              <span className="text-3xl">{calc.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-gray-900">{calc.title}</h2>
                  {calc.comingSoon && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{calc.description}</p>
                <div className="flex gap-2">
                  {calc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
          return calc.comingSoon ? (
            <div key={calc.title} className={cardClass}>{inner}</div>
          ) : (
            <Link key={calc.title} href={calc.href} className={cardClass}>{inner}</Link>
          );
        })}
      </div>
    </div>
    </>
  );
}
