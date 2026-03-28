import Link from "next/link";

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
    title: "Mortgage Repayment Calculator",
    description:
      "Calculate your home loan repayments, total interest, and view an amortization schedule. Compare different rates and terms side by side.",
    href: "/calculators/mortgage-repayment",
    icon: "🏠",
    tags: ["Home Loan", "Interest", "Amortization"],
  },
  {
    title: "Car Loan Calculator",
    description:
      "Calculate car loan repayments with balloon payment option. Compare weekly, fortnightly, and monthly repayments across different rates and terms.",
    href: "/calculators/car-loan",
    icon: "🚗",
    tags: ["Car Finance", "Vehicle Loan", "Balloon Payment"],
  },
  {
    title: "Stamp Duty Calculator",
    description:
      "Calculate stamp duty (transfer duty) for all Australian states and territories. Compare rates, apply first home buyer concessions, and see 2025–2026 rates.",
    href: "/calculators/stamp-duty",
    icon: "📋",
    tags: ["Property", "Transfer Duty", "All States"],
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
    title: "Land Tax Calculator",
    description:
      "Calculate land tax for all Australian states using 2025-2026 thresholds and rates. Compare land tax across states with trust and absentee surcharges.",
    href: "/calculators/land-tax",
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
    href: "/calculators/capital-gains-tax",
    icon: "📊",
    tags: ["CGT", "Property", "Shares"],
  },
  {
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index, healthy weight range, ideal weight, and waist-to-height ratio. Includes Australian health guidelines for Asian populations.",
    href: "/bmi-calculator",
    icon: "⚖️",
    tags: ["BMI", "Healthy Weight", "Health"],
  },
];

export default function Home() {
  return (
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
  );
}
