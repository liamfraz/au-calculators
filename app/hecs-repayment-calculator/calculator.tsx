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
  annualIncome: number;
  indexationRate: number;
  salaryGrowthRate: number;
}

interface YearRow {
  year: number;
  openingDebt: number;
  indexation: number;
  repayment: number;
  closingDebt: number;
  income: number;
  rate: number;
}

interface RepaymentResult {
  annualRepayment: number;
  monthlyRepayment: number;
  repaymentRate: number;
  yearsToRepay: number;
  totalRepaid: number;
  totalIndexation: number;
  yearByYear: YearRow[];
}

// ATO 2025-26 HELP repayment income thresholds and rates
const REPAYMENT_THRESHOLDS = [
  { min: 0, max: 54434, rate: 0 },
  { min: 54435, max: 62850, rate: 1.0 },
  { min: 62851, max: 66620, rate: 2.0 },
  { min: 66621, max: 70618, rate: 2.5 },
  { min: 70619, max: 74855, rate: 3.0 },
  { min: 74856, max: 79346, rate: 3.5 },
  { min: 79347, max: 84107, rate: 4.0 },
  { min: 84108, max: 89154, rate: 4.5 },
  { min: 89155, max: 94503, rate: 5.0 },
  { min: 94504, max: 100174, rate: 5.5 },
  { min: 100175, max: 106185, rate: 6.0 },
  { min: 106186, max: 112556, rate: 6.5 },
  { min: 112557, max: 119309, rate: 7.0 },
  { min: 119310, max: 126467, rate: 7.5 },
  { min: 126468, max: 134056, rate: 8.0 },
  { min: 134057, max: 142100, rate: 8.5 },
  { min: 142101, max: 150626, rate: 9.0 },
  { min: 150627, max: 159663, rate: 9.5 },
  { min: 159664, max: Infinity, rate: 10.0 },
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
  const { helpDebt, annualIncome, indexationRate, salaryGrowthRate } = inputs;

  const currentRate = getRepaymentRate(annualIncome);
  const annualRepayment =
    currentRate > 0 ? Math.round(annualIncome * (currentRate / 100)) : 0;
  const monthlyRepayment = annualRepayment > 0 ? annualRepayment / 12 : 0;

  if (helpDebt <= 0 || annualRepayment <= 0) {
    return {
      annualRepayment,
      monthlyRepayment,
      repaymentRate: currentRate,
      yearsToRepay: currentRate === 0 ? -1 : 0,
      totalRepaid: 0,
      totalIndexation: 0,
      yearByYear: [],
    };
  }

  let debt = helpDebt;
  let income = annualIncome;
  let totalRepaid = 0;
  let totalIndexation = 0;
  const rows: YearRow[] = [];
  const maxYears = 50;

  for (let y = 1; y <= maxYears && debt > 0; y++) {
    const opening = debt;

    // Indexation applied 1 June each year
    const indexation = Math.round(opening * (indexationRate / 100));
    debt = opening + indexation;
    totalIndexation += indexation;

    // Repayment based on that year's income
    const rate = getRepaymentRate(income);
    let repayment = rate > 0 ? Math.round(income * (rate / 100)) : 0;

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
      income: Math.round(income),
      rate,
    });

    if (debt <= 0) break;

    income = income * (1 + salaryGrowthRate / 100);
  }

  return {
    annualRepayment,
    monthlyRepayment,
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

export default function HecsRepaymentCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    helpDebt: 30000,
    annualIncome: 75000,
    indexationRate: 3.2,
    salaryGrowthRate: 3,
  });

  const [showTable, setShowTable] = useState(false);
  const [showIndexationComparison, setShowIndexationComparison] =
    useState(false);

  const result = useMemo(() => calculateHecs(inputs), [inputs]);

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

  const thresholdData = useMemo(() => {
    return REPAYMENT_THRESHOLDS.filter((t) => t.rate > 0)
      .slice(0, 12)
      .map((t) => ({
        bracket: `$${(t.min / 1000).toFixed(0)}k`,
        rate: t.rate,
      }));
  }, []);

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
              Current HECS/HELP Debt ($)
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
              Annual Income (before tax) ($)
            </label>
            <input
              type="number"
              value={inputs.annualIncome}
              onChange={(e) => update("annualIncome", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
            <p className="text-xs text-gray-400 mt-1">
              Repayment income = taxable income + fringe benefits + net
              investment losses
            </p>
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
              HELP debts are indexed annually to CPI (capped at lower of CPI or
              WPI from 2023)
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
        </div>
      </div>

      {/* Results */}
      {belowThreshold ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2">
            Below Repayment Threshold
          </h3>
          <p className="text-sm text-amber-800">
            At an income of{" "}
            <strong>{formatCurrency(inputs.annualIncome)}</strong>, you are below
            the 2025-26 compulsory repayment threshold of{" "}
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
            label="Monthly Repayment"
            value={formatCurrency(Math.round(result.monthlyRepayment))}
            subtext="Approximate monthly deduction"
          />
          <ResultCard
            label="Years to Pay Off"
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
            subtext="Accumulated over repayment period"
          />
          <ResultCard
            label="Indexation Cost"
            value={`${inputs.helpDebt > 0 ? Math.round((result.totalIndexation / inputs.helpDebt) * 100) : 0}%`}
            subtext="Of original debt"
          />
        </div>
      )}

      {/* Full Repayment Threshold Table */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">
          2025-26 HECS-HELP Repayment Thresholds
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Repayment Income
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Rate
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Annual Repayment (at min)
                </th>
              </tr>
            </thead>
            <tbody>
              {REPAYMENT_THRESHOLDS.map((t) => {
                const isActive =
                  inputs.annualIncome >= t.min &&
                  inputs.annualIncome <= t.max;
                return (
                  <tr
                    key={t.min}
                    className={`border-b border-gray-100 ${isActive ? "bg-blue-50 font-medium" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-4 py-2 text-gray-800">
                      {t.max === Infinity
                        ? `$${t.min.toLocaleString()}+`
                        : `$${t.min.toLocaleString()} - $${t.max.toLocaleString()}`}
                      {isActive && (
                        <span className="ml-2 text-xs text-blue-600 font-semibold">
                          Your bracket
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      {t.rate}%
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      {t.rate > 0
                        ? formatCurrency(Math.round(t.min * (t.rate / 100)))
                        : "Nil"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repayment Threshold Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Repayment Rates by Income Bracket
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
                  value:
                    | number
                    | string
                    | (readonly (number | string)[])
                    | undefined
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
          Your income: <strong>{formatCurrency(inputs.annualIncome)}</strong> ={" "}
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
              ? "Hide indexation impact comparison"
              : "Compare total cost with vs without indexation"}
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

      {/* Debt Over Time Chart */}
      {!belowThreshold && result.yearByYear.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            HECS Debt Balance Over Time
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
                    value:
                      | number
                      | string
                      | (readonly (number | string)[])
                      | undefined,
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
                      Income
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
                        {formatCurrency(row.income)}
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

      {/* Related Calculators */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Related Calculators
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/calculators/salary-sacrifice"
            className="block p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow transition-all text-sm"
          >
            <span className="font-medium text-gray-900">
              Salary Sacrifice Calculator
            </span>
            <p className="text-gray-500 text-xs mt-1">
              Reduce your taxable income and HECS repayment
            </p>
          </Link>
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
              See how HECS affects borrowing capacity
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
