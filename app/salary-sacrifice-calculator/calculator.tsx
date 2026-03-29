"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MEDICARE_LEVY_RATE = 0.02;
const CONCESSIONAL_CAP = 30000;
const TAX_BRACKETS_2026 = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 },
];

function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (let i = TAX_BRACKETS_2026.length - 1; i >= 0; i--) {
    const bracket = TAX_BRACKETS_2026[i];
    if (taxableIncome >= bracket.min) {
      return bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate;
    }
  }
  return 0;
}

function getMarginalRate(taxableIncome: number): number {
  for (let i = TAX_BRACKETS_2026.length - 1; i >= 0; i--) {
    if (taxableIncome >= TAX_BRACKETS_2026[i].min) {
      return TAX_BRACKETS_2026[i].rate;
    }
  }
  return 0;
}

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return (
    sign +
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value))
  );
}

function ResultCard({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string;
  value: string;
  subtext?: string;
  highlight?: "green" | "red" | "blue" | "amber";
}) {
  const colorClass =
    highlight === "green"
      ? "text-emerald-700"
      : highlight === "red"
        ? "text-red-600"
        : highlight === "amber"
          ? "text-amber-600"
          : "text-blue-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

interface Inputs {
  grossSalary: number;
  currentSuperRate: number;
  sacrificeAmount: number;
  yearsToRetirement: number;
  currentSuperBalance: number;
  investmentReturn: number;
}

export default function SalarySacrificeCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    grossSalary: 100000,
    currentSuperRate: 11.5,
    sacrificeAmount: 10000,
    yearsToRetirement: 25,
    currentSuperBalance: 50000,
    investmentReturn: 7,
  });

  const results = useMemo(() => {
    const grossSalary = inputs.grossSalary;
    const employerSG = grossSalary * (inputs.currentSuperRate / 100);
    const sacrificeAmount = inputs.sacrificeAmount;
    const totalConcessional = employerSG + sacrificeAmount;
    const exceedsCap = totalConcessional > CONCESSIONAL_CAP;
    const cappedSacrifice = exceedsCap
      ? Math.max(0, CONCESSIONAL_CAP - employerSG)
      : sacrificeAmount;
    const cappedTotalConcessional = employerSG + cappedSacrifice;

    // Before salary sacrifice
    const taxableIncomeBefore = grossSalary;
    const incomeTaxBefore = calculateIncomeTax(taxableIncomeBefore);
    const medicareBefore = taxableIncomeBefore * MEDICARE_LEVY_RATE;
    const totalTaxBefore = incomeTaxBefore + medicareBefore;
    const takeHomeBefore = grossSalary - totalTaxBefore;

    // After salary sacrifice
    const taxableIncomeAfter = grossSalary - cappedSacrifice;
    const incomeTaxAfter = calculateIncomeTax(taxableIncomeAfter);
    const medicareAfter = taxableIncomeAfter * MEDICARE_LEVY_RATE;
    const totalTaxAfter = incomeTaxAfter + medicareAfter;
    const takeHomeAfter = taxableIncomeAfter - totalTaxAfter;

    // Tax on concessional contributions (15% in super)
    const superContribTax = cappedSacrifice * 0.15;

    // Net tax saved
    const personalTaxSaved = totalTaxBefore - totalTaxAfter;
    const netTaxBenefit = personalTaxSaved - superContribTax;

    // Take-home pay reduction
    const takeHomeReduction = takeHomeBefore - takeHomeAfter;

    // Marginal rate
    const marginalRate = getMarginalRate(grossSalary);
    const effectiveRate = marginalRate + MEDICARE_LEVY_RATE;

    // Per-dollar benefit: for each $1 sacrificed, you pay 15% super tax instead of marginal rate
    const taxSavingPerDollar = effectiveRate - 0.15;

    // Super balance projection
    const growthRate = inputs.investmentReturn / 100;
    const annualContribWithSacrifice = cappedTotalConcessional * (1 - 0.15); // net of 15% contributions tax
    const annualContribWithoutSacrifice = employerSG * (1 - 0.15);

    const projectionData: {
      year: number;
      age: string;
      withSacrifice: number;
      withoutSacrifice: number;
      difference: number;
    }[] = [];

    let balanceWith = inputs.currentSuperBalance;
    let balanceWithout = inputs.currentSuperBalance;

    for (let y = 0; y <= inputs.yearsToRetirement; y++) {
      projectionData.push({
        year: y,
        age: `Year ${y}`,
        withSacrifice: Math.round(balanceWith),
        withoutSacrifice: Math.round(balanceWithout),
        difference: Math.round(balanceWith - balanceWithout),
      });
      balanceWith = balanceWith * (1 + growthRate) + annualContribWithSacrifice;
      balanceWithout =
        balanceWithout * (1 + growthRate) + annualContribWithoutSacrifice;
    }

    const finalWith =
      projectionData[projectionData.length - 1]?.withSacrifice ?? 0;
    const finalWithout =
      projectionData[projectionData.length - 1]?.withoutSacrifice ?? 0;
    const superDifference = finalWith - finalWithout;

    // Comparison table data
    const comparisonData = [
      {
        metric: "Amount directed to super",
        salarySacrifice: formatCurrency(cappedSacrifice),
        afterTax: formatCurrency(cappedSacrifice),
      },
      {
        metric: "Tax paid on contribution",
        salarySacrifice: `${formatCurrency(superContribTax)} (15%)`,
        afterTax: `${formatCurrency(cappedSacrifice * effectiveRate)} (${(effectiveRate * 100).toFixed(0)}%)`,
      },
      {
        metric: "Net amount into super",
        salarySacrifice: formatCurrency(cappedSacrifice * 0.85),
        afterTax: formatCurrency(cappedSacrifice),
      },
      {
        metric: "Reduction in take-home pay",
        salarySacrifice: formatCurrency(takeHomeReduction),
        afterTax: formatCurrency(cappedSacrifice),
      },
      {
        metric: "Effective cost per $1 in super",
        salarySacrifice: `$${(takeHomeReduction / (cappedSacrifice * 0.85)).toFixed(2)}`,
        afterTax: "$1.00",
      },
      {
        metric: "Tax benefit vs paying marginal rate",
        salarySacrifice: formatCurrency(netTaxBenefit),
        afterTax: formatCurrency(0),
      },
    ];

    return {
      employerSG: Math.round(employerSG),
      totalConcessional: Math.round(totalConcessional),
      cappedSacrifice: Math.round(cappedSacrifice),
      cappedTotalConcessional: Math.round(cappedTotalConcessional),
      exceedsCap,
      remainingCap: Math.round(
        Math.max(0, CONCESSIONAL_CAP - employerSG)
      ),
      takeHomeBefore: Math.round(takeHomeBefore),
      takeHomeAfter: Math.round(takeHomeAfter),
      takeHomeReduction: Math.round(takeHomeReduction),
      personalTaxSaved: Math.round(personalTaxSaved),
      superContribTax: Math.round(superContribTax),
      netTaxBenefit: Math.round(netTaxBenefit),
      marginalRate,
      effectiveRate,
      taxSavingPerDollar,
      projectionData,
      finalWith: Math.round(finalWith),
      finalWithout: Math.round(finalWithout),
      superDifference: Math.round(superDifference),
      comparisonData,
      totalTaxBefore: Math.round(totalTaxBefore),
      totalTaxAfter: Math.round(totalTaxAfter),
    };
  }, [inputs]);

  const update = <K extends keyof Inputs>(field: K, value: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Details
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gross Annual Salary ($)
            </label>
            <input
              type="number"
              value={inputs.grossSalary}
              onChange={(e) => update("grossSalary", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={5000}
            />
            <p className="text-xs text-gray-400 mt-1">
              Marginal rate: {(results.marginalRate * 100).toFixed(0)}% (+2%
              Medicare)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employer Super Rate (%)
            </label>
            <input
              type="number"
              value={inputs.currentSuperRate}
              onChange={(e) =>
                update("currentSuperRate", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={25}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">
              SG minimum: 11.5% for FY2025-26
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salary Sacrifice ($)
            </label>
            <input
              type="number"
              value={inputs.sacrificeAmount}
              onChange={(e) =>
                update("sacrificeAmount", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
            <p className="text-xs text-gray-400 mt-1">
              Amount to redirect from pre-tax salary to super
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Super Balance ($)
            </label>
            <input
              type="number"
              value={inputs.currentSuperBalance}
              onChange={(e) =>
                update("currentSuperBalance", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={10000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years to Retirement
            </label>
            <input
              type="number"
              value={inputs.yearsToRetirement}
              onChange={(e) =>
                update("yearsToRetirement", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={1}
              max={50}
              step={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Investment Return (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.investmentReturn}
              onChange={(e) =>
                update("investmentReturn", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={15}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">
              Long-term average: ~7% (balanced fund)
            </p>
          </div>
        </div>
      </div>

      {/* Cap Warning */}
      {results.exceedsCap && (
        <div className="rounded-xl p-6 border bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">
            Concessional Contributions Cap Exceeded
          </h3>
          <p className="text-sm text-red-700">
            Your employer SG of{" "}
            <strong>{formatCurrency(results.employerSG)}</strong> plus your
            salary sacrifice of{" "}
            <strong>{formatCurrency(inputs.sacrificeAmount)}</strong> totals{" "}
            <strong>{formatCurrency(results.totalConcessional)}</strong>, which
            exceeds the <strong>{formatCurrency(CONCESSIONAL_CAP)}</strong>{" "}
            concessional cap. Excess contributions are taxed at your marginal
            rate instead of 15%. The calculator has capped your sacrifice at{" "}
            <strong>{formatCurrency(results.cappedSacrifice)}</strong> to stay
            within the limit. You may have unused carry-forward cap from prior
            years if your super balance was under $500,000.
          </p>
        </div>
      )}

      {/* Key Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <ResultCard
          label="Take-Home Before"
          value={formatCurrency(results.takeHomeBefore)}
          subtext={`${formatCurrency(Math.round(results.takeHomeBefore / 26))}/fortnight`}
          highlight="blue"
        />
        <ResultCard
          label="Take-Home After"
          value={formatCurrency(results.takeHomeAfter)}
          subtext={`${formatCurrency(Math.round(results.takeHomeAfter / 26))}/fortnight`}
          highlight="blue"
        />
        <ResultCard
          label="Take-Home Reduction"
          value={formatCurrency(results.takeHomeReduction)}
          subtext={`${formatCurrency(Math.round(results.takeHomeReduction / 26))}/fortnight`}
          highlight="amber"
        />
        <ResultCard
          label="Income Tax Saved"
          value={formatCurrency(results.personalTaxSaved)}
          subtext={`At ${(results.effectiveRate * 100).toFixed(0)}% effective rate`}
          highlight="green"
        />
        <ResultCard
          label="Net Tax Benefit"
          value={formatCurrency(results.netTaxBenefit)}
          subtext="After 15% super contributions tax"
          highlight="green"
        />
        <ResultCard
          label="Concessional Cap Used"
          value={`${Math.round((results.cappedTotalConcessional / CONCESSIONAL_CAP) * 100)}%`}
          subtext={`${formatCurrency(results.cappedTotalConcessional)} of ${formatCurrency(CONCESSIONAL_CAP)}`}
          highlight={results.exceedsCap ? "red" : "blue"}
        />
      </div>

      {/* Take-Home Breakdown */}
      <div className="rounded-xl p-6 border bg-emerald-50 border-emerald-200">
        <h3 className="font-semibold text-emerald-800 mb-2">
          How Salary Sacrifice Works for You
        </h3>
        <p className="text-sm text-emerald-700">
          By sacrificing{" "}
          <strong>{formatCurrency(results.cappedSacrifice)}</strong> per year,
          your take-home pay drops by{" "}
          <strong>{formatCurrency(results.takeHomeReduction)}</strong> — not the
          full sacrifice amount — because you save{" "}
          <strong>{formatCurrency(results.personalTaxSaved)}</strong> in income
          tax. Your super contribution is taxed at 15% (
          {formatCurrency(results.superContribTax)}) instead of your marginal
          rate of {(results.effectiveRate * 100).toFixed(0)}%. The net tax
          advantage is{" "}
          <strong>{formatCurrency(results.netTaxBenefit)}</strong> per year. For
          every dollar you sacrifice, it only costs you{" "}
          <strong>
            $
            {(
              results.takeHomeReduction /
              (results.cappedSacrifice || 1)
            ).toFixed(2)}
          </strong>{" "}
          in reduced take-home pay.
        </p>
      </div>

      {/* Pay Comparison Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Annual Pay Breakdown: Before vs After Sacrifice
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  scenario: "Before Sacrifice",
                  "Take-Home Pay": results.takeHomeBefore,
                  "Income Tax & Medicare": results.totalTaxBefore,
                  "Salary Sacrifice": 0,
                },
                {
                  scenario: "After Sacrifice",
                  "Take-Home Pay": results.takeHomeAfter,
                  "Income Tax & Medicare": results.totalTaxAfter,
                  "Salary Sacrifice": results.cappedSacrifice,
                },
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(
                  value:
                    | number
                    | string
                    | (readonly (number | string)[])
                    | undefined
                ) => [formatCurrency(Number(value))]}
              />
              <Legend />
              <Bar
                dataKey="Take-Home Pay"
                stackId="a"
                fill="#059669"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Income Tax & Medicare"
                stackId="a"
                fill="#ef4444"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Salary Sacrifice"
                stackId="a"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table: Salary Sacrifice vs After-Tax Contribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Salary Sacrifice vs After-Tax Contribution
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Metric
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Salary Sacrifice
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  After-Tax Contribution
                </th>
              </tr>
            </thead>
            <tbody>
              {results.comparisonData.map((row) => (
                <tr
                  key={row.metric}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-700">{row.metric}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">
                    {row.salarySacrifice}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {row.afterTax}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Salary sacrifice is taxed at 15% inside super vs your marginal rate of{" "}
          {(results.effectiveRate * 100).toFixed(0)}%. After-tax contributions
          do not reduce your taxable income but may qualify for the government
          co-contribution if your income is below $60,400.
        </p>
      </div>

      {/* Super Balance Projection */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Super Balance Projection at Retirement
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={results.projectionData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1000000
                    ? `$${(v / 1000000).toFixed(1)}M`
                    : `$${(v / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(
                  value:
                    | number
                    | string
                    | (readonly (number | string)[])
                    | undefined
                ) => [formatCurrency(Number(value))]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="withSacrifice"
                stroke="#059669"
                strokeWidth={2}
                name="With Salary Sacrifice"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="withoutSacrifice"
                stroke="#9ca3af"
                strokeWidth={2}
                name="Without Salary Sacrifice"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600">With Sacrifice</p>
            <p className="text-xl font-bold text-emerald-700">
              {formatCurrency(results.finalWith)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Without Sacrifice</p>
            <p className="text-xl font-bold text-gray-700">
              {formatCurrency(results.finalWithout)}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Extra at Retirement</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(results.superDifference)}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Projection assumes {inputs.investmentReturn}% annual return, constant
          contributions, and 15% contributions tax. Does not account for
          inflation, fee changes, insurance premiums, or Division 293 tax for
          incomes above $250,000.
        </p>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">
          Related Calculators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Superannuation Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/super-contribution-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Super Contribution Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/tax-withholding-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Income Tax Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/compound-interest"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Compound Interest Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
