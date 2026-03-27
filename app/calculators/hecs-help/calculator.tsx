"use client";
import Link from "next/link";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Inputs {
  helpDebt: number;
  annualSalary: number;
  salaryGrowthRate: number;
  indexationRate: number;
}

interface YearRow {
  year: number;
  openingDebt: number;
  indexation: number;
  repayment: number;
  closingDebt: number;
  salary: number;
  rate: number;
}

interface RepaymentResult {
  annualRepayment: number;
  fortnightlyDeduction: number;
  repaymentRate: number;
  yearsToRepay: number;
  totalRepaid: number;
  totalIndexation: number;
  yearByYear: YearRow[];
}

// ATO 2025-26 HELP repayment income thresholds and rates
// Source: https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-thresholds
const REPAYMENT_THRESHOLDS = [
  { min: 0, max: 54434, rate: 0 },
  { min: 54435, max: 62850, rate: 1.0 },
  { min: 62851, max: 66620, rate: 2.0 },
  { min: 66621, max: 70618, rate: 2.5 },
  { min: 70619, max: 74855, rate: 3.0 },
  { min: 74856, max: 76912, rate: 3.5 },
  { min: 76913, max: 79576, rate: 4.0 },
  { min: 79577, max: 84107, rate: 4.5 },
  { min: 84108, max: 89154, rate: 5.0 },
  { min: 89155, max: 94503, rate: 5.5 },
  { min: 94504, max: 100174, rate: 6.0 },
  { min: 100175, max: 106185, rate: 6.5 },
  { min: 106186, max: 112556, rate: 7.0 },
  { min: 112557, max: 119309, rate: 7.5 },
  { min: 119310, max: 126467, rate: 8.0 },
  { min: 126468, max: 134056, rate: 8.5 },
  { min: 134057, max: 142100, rate: 9.0 },
  { min: 142101, max: 151200, rate: 9.5 },
  { min: 151201, max: Infinity, rate: 10.0 },
];

function getRepaymentRate(income: number): number {
  for (const bracket of REPAYMENT_THRESHOLDS) {
    if (income >= bracket.min && income <= bracket.max) {
      return bracket.rate;
    }
  }
  return 10.0;
}

function calculateHecs(inputs: Inputs): RepaymentResult {
  const { helpDebt, annualSalary, salaryGrowthRate, indexationRate } = inputs;

  const currentRate = getRepaymentRate(annualSalary);
  const annualRepayment =
    currentRate > 0 ? Math.round(annualSalary * (currentRate / 100)) : 0;
  const fortnightlyDeduction =
    annualRepayment > 0 ? annualRepayment / 26 : 0;

  if (helpDebt <= 0 || annualRepayment <= 0) {
    return {
      annualRepayment,
      fortnightlyDeduction,
      repaymentRate: currentRate,
      yearsToRepay: currentRate === 0 ? -1 : 0,
      totalRepaid: 0,
      totalIndexation: 0,
      yearByYear: [],
    };
  }

  // Simulate year-by-year repayment
  let debt = helpDebt;
  let salary = annualSalary;
  let totalRepaid = 0;
  let totalIndexation = 0;
  const rows: YearRow[] = [];
  const maxYears = 50;

  for (let y = 1; y <= maxYears && debt > 0; y++) {
    const opening = debt;

    // Indexation is applied on 1 June each year to the remaining debt
    const indexation = Math.round(opening * (indexationRate / 100));
    debt = opening + indexation;
    totalIndexation += indexation;

    // Repayment based on that year's salary
    const rate = getRepaymentRate(salary);
    let repayment = rate > 0 ? Math.round(salary * (rate / 100)) : 0;

    // Don't overpay
    if (repayment > debt) {
      repayment = Math.round(debt);
    }

    debt = debt - repayment;
    totalRepaid += repayment;

    rows.push({
      year: y,
      openingDebt: Math.round(opening),
      indexation,
      repayment,
      closingDebt: Math.max(0, Math.round(debt)),
      salary: Math.round(salary),
      rate,
    });

    if (debt <= 0) break;

    // Salary grows for next year
    salary = salary * (1 + salaryGrowthRate / 100);
  }

  return {
    annualRepayment,
    fortnightlyDeduction,
    repaymentRate: currentRate,
    yearsToRepay: rows.length,
    totalRepaid: Math.round(totalRepaid),
    totalIndexation: Math.round(totalIndexation),
    yearByYear: rows,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function ResultCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-blue-800">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function HecsHelpCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    helpDebt: 30000,
    annualSalary: 75000,
    salaryGrowthRate: 3,
    indexationRate: 3.2,
  });

  const [showTable, setShowTable] = useState(false);
  const [showIndexationComparison, setShowIndexationComparison] =
    useState(false);

  const result = useMemo(() => calculateHecs(inputs), [inputs]);

  // Comparison: what if indexation was 0% (voluntary repayment benefit)
  const noIndexationResult = useMemo(() => {
    if (!showIndexationComparison) return null;
    return calculateHecs({ ...inputs, indexationRate: 0 });
  }, [inputs, showIndexationComparison]);

  const chartData = useMemo(() => {
    return result.yearByYear.map((row) => ({
      year: `Year ${row.year}`,
      debt: row.closingDebt,
      ...(noIndexationResult
        ? {
            debtNoIndexation:
              noIndexationResult.yearByYear.find((r) => r.year === row.year)
                ?.closingDebt ?? 0,
          }
        : {}),
    }));
  }, [result, noIndexationResult]);

  const indexationChartData = useMemo(() => {
    if (!noIndexationResult) return [];
    return [
      { name: "With Indexation", value: result.totalRepaid },
      { name: "Without Indexation", value: noIndexationResult.totalRepaid },
    ];
  }, [result, noIndexationResult]);

  // Repayment threshold chart data
  const thresholdData = useMemo(() => {
    return REPAYMENT_THRESHOLDS.filter((t) => t.rate > 0)
      .slice(0, 10)
      .map((t) => ({
        bracket: `$${(t.min / 1000).toFixed(0)}k`,
        rate: t.rate,
        isCurrentBracket:
          inputs.annualSalary >= t.min && inputs.annualSalary <= t.max,
      }));
  }, [inputs.annualSalary]);

  const update = (field: keyof Inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const belowThreshold = result.repaymentRate === 0;

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current HELP Debt ($)
            </label>
            <input
              type="number"
              value={inputs.helpDebt}
              onChange={(e) => update("helpDebt", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
            <p className="text-xs text-gray-400 mt-1">
              Check your balance at myGov &gt; ATO &gt; Tax
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salary (before tax) ($)
            </label>
            <input
              type="number"
              value={inputs.annualSalary}
              onChange={(e) => update("annualSalary", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
            <p className="text-xs text-gray-400 mt-1">
              Repayment Income = taxable income + fringe benefits + net
              investment losses
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Salary Growth (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.salaryGrowthRate}
              onChange={(e) =>
                update("salaryGrowthRate", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={20}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indexation Rate (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.indexationRate}
              onChange={(e) =>
                update("indexationRate", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={15}
              step={0.1}
            />
            <p className="text-xs text-gray-400 mt-1">
              HELP debts are indexed annually to CPI (was 4.7% in 2024, capped
              at CPI from 2023)
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {belowThreshold ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2">
            Below Repayment Threshold
          </h3>
          <p className="text-sm text-amber-800">
            At a salary of <strong>{formatCurrency(inputs.annualSalary)}</strong>
            , you are below the 2025-26 compulsory repayment threshold of{" "}
            <strong>$54,435</strong>. No compulsory repayments are required, but
            your debt will continue to grow with indexation. You can still make
            voluntary repayments at any time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ResultCard
            label="Annual Repayment"
            value={formatCurrency(result.annualRepayment)}
            subtext={`${result.repaymentRate}% of income`}
          />
          <ResultCard
            label="Fortnightly Deduction"
            value={formatCurrency(Math.round(result.fortnightlyDeduction))}
            subtext="Withheld from pay"
          />
          <ResultCard
            label="Years to Repay"
            value={
              result.yearsToRepay > 0 ? `${result.yearsToRepay}` : "N/A"
            }
            subtext="At current salary growth"
          />
          <ResultCard
            label="Total Amount Repaid"
            value={formatCurrency(result.totalRepaid)}
            subtext={`Original debt: ${formatCurrency(inputs.helpDebt)}`}
          />
          <ResultCard
            label="Total Indexation Added"
            value={formatCurrency(result.totalIndexation)}
            subtext="Accumulated interest"
          />
          <ResultCard
            label="Indexation Cost"
            value={`${inputs.helpDebt > 0 ? Math.round((result.totalIndexation / inputs.helpDebt) * 100) : 0}%`}
            subtext="Of original debt"
          />
        </div>
      )}

      {/* Repayment Threshold Info Callouts */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">
          2025-26 HELP Repayment Thresholds
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-lg">&#x1f6ab;</span>
            <div>
              <p className="text-sm font-medium text-gray-800">Below $54,435 &mdash; 0%</p>
              <p className="text-xs text-gray-500">No compulsory repayment. Debt still indexed annually.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-lg">&#x1f4b0;</span>
            <div>
              <p className="text-sm font-medium text-gray-800">$54,435 &ndash; $62,850 &mdash; 1%</p>
              <p className="text-xs text-gray-500">First repayment tier. E.g. $55K income = $550/yr.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-lg">&#x1f4c8;</span>
            <div>
              <p className="text-sm font-medium text-gray-800">$62,851 &ndash; $79,576 &mdash; 2% to 4%</p>
              <p className="text-xs text-gray-500">Rates scale in 0.5% steps through middle-income brackets.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-lg">&#x1f4b8;</span>
            <div>
              <p className="text-sm font-medium text-gray-800">$79,577 &ndash; $151,200 &mdash; 4.5% to 9.5%</p>
              <p className="text-xs text-gray-500">Upper brackets. Repayment applied to total income, not just amount above threshold.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3 sm:col-span-2">
            <span className="text-lg">&#x26a0;&#xfe0f;</span>
            <div>
              <p className="text-sm font-medium text-gray-800">Above $151,201 &mdash; 10%</p>
              <p className="text-xs text-gray-500">Maximum rate. E.g. $160K income = $16,000/yr compulsory repayment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Threshold Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          2025-26 HELP Repayment Rates by Income
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={thresholdData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, 10]}
              />
              <Tooltip
                formatter={(
                  value: number | string | (readonly (number | string)[]) | undefined
                ) => [`${value}%`, "Repayment Rate"]}
              />
              <Bar
                dataKey="rate"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                label={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your income:{" "}
          <strong>{formatCurrency(inputs.annualSalary)}</strong> ={" "}
          <strong>{result.repaymentRate}%</strong> repayment rate. The rate
          applies to your total repayment income, not just the amount above the
          threshold.
        </p>
      </div>

      {/* Indexation Comparison Toggle */}
      {!belowThreshold && (
        <div>
          <button
            onClick={() =>
              setShowIndexationComparison(!showIndexationComparison)
            }
            className="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
          >
            {showIndexationComparison
              ? "✕ Hide indexation impact comparison"
              : "＋ Compare total cost with vs without indexation"}
          </button>
        </div>
      )}

      {/* Indexation Comparison Summary */}
      {showIndexationComparison && noIndexationResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Indexation Impact
          </h3>
          <p className="text-sm text-blue-800">
            With {inputs.indexationRate}% annual indexation, you&apos;ll repay{" "}
            <strong>{formatCurrency(result.totalRepaid)}</strong> over{" "}
            <strong>{result.yearsToRepay} years</strong>. Without indexation,
            you&apos;d repay{" "}
            <strong>{formatCurrency(noIndexationResult.totalRepaid)}</strong>{" "}
            over <strong>{noIndexationResult.yearsToRepay} years</strong> —
            indexation costs you an extra{" "}
            <strong>
              {formatCurrency(
                result.totalRepaid - noIndexationResult.totalRepaid
              )}
            </strong>
            .
          </p>
        </div>
      )}

      {/* Indexation Comparison Bar Chart */}
      {showIndexationComparison && indexationChartData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Total Repaid: With vs Without Indexation
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={indexationChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(
                    value: number | string | (readonly (number | string)[]) | undefined
                  ) => [formatCurrency(Number(value)), "Total Repaid"]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Debt Over Time Chart */}
      {!belowThreshold && result.yearByYear.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            HELP Debt Balance Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(
                    value: number | string | (readonly (number | string)[]) | undefined,
                    name: number | string | undefined
                  ) => [
                    formatCurrency(Number(value)),
                    name === "debt"
                      ? "Remaining Debt"
                      : "Without Indexation",
                  ]}
                />
                <Legend
                  formatter={(value: string) =>
                    value === "debt"
                      ? "Remaining Debt"
                      : "Without Indexation"
                  }
                />
                <Area
                  type="monotone"
                  dataKey="debt"
                  stroke="#1e40af"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                {showIndexationComparison && (
                  <Area
                    type="monotone"
                    dataKey="debtNoIndexation"
                    stroke="#059669"
                    fill="#34d399"
                    fillOpacity={0.4}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Year-by-Year Breakdown Table */}
      {!belowThreshold && result.yearByYear.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800">
              Year-by-Year Breakdown
            </h3>
            <span className="text-gray-400 text-xl">
              {showTable ? "▲" : "▼"}
            </span>
          </button>

          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-t border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium text-gray-600">
                      Year
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">
                      Salary
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">
                      Rate
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">
                      Opening Debt
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">
                      Indexation
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">
                      Repayment
                    </th>
                    <th className="px-3 py-3 text-right font-medium text-gray-600">
                      Closing Debt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearByYear.map((row) => (
                    <tr
                      key={row.year}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 text-gray-800">{row.year}</td>
                      <td className="px-3 py-2 text-right text-gray-600">
                        {formatCurrency(row.salary)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600">
                        {row.rate}%
                      </td>
                      <td className="px-3 py-2 text-right">
                        {formatCurrency(row.openingDebt)}
                      </td>
                      <td className="px-3 py-2 text-right text-amber-600">
                        +{formatCurrency(row.indexation)}
                      </td>
                      <td className="px-3 py-2 text-right text-emerald-600">
                        -{formatCurrency(row.repayment)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {formatCurrency(row.closingDebt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Internal Links */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Related Calculators
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/calculators/super"
            className="block p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow transition-all text-sm"
          >
            <span className="font-medium text-gray-900">
              Superannuation Calculator
            </span>
            <p className="text-gray-500 text-xs mt-1">
              Project your super balance at retirement
            </p>
          </Link>
          <Link
            href="/calculators/mortgage-repayment"
            className="block p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow transition-all text-sm"
          >
            <span className="font-medium text-gray-900">
              Mortgage Calculator
            </span>
            <p className="text-gray-500 text-xs mt-1">
              Calculate your home loan repayments
            </p>
          </Link>
          <Link
            href="/calculators/energy-bill"
            className="block p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow transition-all text-sm"
          >
            <span className="font-medium text-gray-900">
              Energy Bill Calculator
            </span>
            <p className="text-gray-500 text-xs mt-1">
              Estimate your electricity and gas costs
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
