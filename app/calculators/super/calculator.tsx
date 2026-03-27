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
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualSalary: number;
  employerRate: number;
  salarySacrifice: number;
  afterTaxContribution: number;
  returnRate: number;
  inflationRate: number;
  insuranceFeeWeekly: number;
}

interface YearRow {
  age: number;
  year: number;
  openingBalance: number;
  employerContribution: number;
  salarySacrificeContribution: number;
  afterTaxContribution: number;
  insuranceFees: number;
  investmentReturn: number;
  closingBalance: number;
  closingBalanceReal: number;
}

interface ProjectionResult {
  projectedBalance: number;
  projectedBalanceReal: number;
  totalEmployerContributions: number;
  totalPersonalContributions: number;
  totalInvestmentReturns: number;
  yearByYear: YearRow[];
}

// Scheduled SG rate increases
function getSGRate(financialYear: number, userRate: number): number {
  // financialYear = calendar year the FY starts in (e.g. 2025 = FY 2025-26)
  if (financialYear <= 2025) return Math.max(userRate, 11.5);
  return Math.max(userRate, 12); // 12% from 2026-27 onwards
}

function calculateSuper(inputs: Inputs): ProjectionResult {
  const {
    currentAge,
    retirementAge,
    currentBalance,
    annualSalary,
    employerRate,
    salarySacrifice,
    afterTaxContribution,
    returnRate,
    inflationRate,
    insuranceFeeWeekly,
  } = inputs;

  const years = retirementAge - currentAge;
  if (years <= 0) {
    return {
      projectedBalance: currentBalance,
      projectedBalanceReal: currentBalance,
      totalEmployerContributions: 0,
      totalPersonalContributions: 0,
      totalInvestmentReturns: 0,
      yearByYear: [],
    };
  }

  const currentCalendarYear = 2026;
  const annualInsuranceFees = insuranceFeeWeekly * 52;
  const annualReturnRate = returnRate / 100;
  const annualInflationRate = inflationRate / 100;

  let balance = currentBalance;
  let totalEmployer = 0;
  let totalPersonal = 0;
  let totalReturns = 0;
  const rows: YearRow[] = [];

  for (let i = 0; i < years; i++) {
    const age = currentAge + i;
    const financialYear = currentCalendarYear + i;
    const sgRate = getSGRate(financialYear, employerRate) / 100;

    const opening = balance;
    const employer = annualSalary * sgRate;
    const salSac = salarySacrifice * 12;
    const afterTax = afterTaxContribution * 12;
    const fees = annualInsuranceFees;

    // Contributions added, fees deducted, then returns on mid-year average
    const midYearBalance = opening + (employer + salSac + afterTax - fees) / 2;
    const investReturn = midYearBalance * annualReturnRate;

    balance = opening + employer + salSac + afterTax - fees + investReturn;
    balance = Math.max(0, balance);

    totalEmployer += employer;
    totalPersonal += salSac + afterTax;
    totalReturns += investReturn;

    const realFactor = Math.pow(1 + annualInflationRate, i + 1);

    rows.push({
      age,
      year: financialYear,
      openingBalance: Math.round(opening),
      employerContribution: Math.round(employer),
      salarySacrificeContribution: Math.round(salSac),
      afterTaxContribution: Math.round(afterTax),
      insuranceFees: Math.round(fees),
      investmentReturn: Math.round(investReturn),
      closingBalance: Math.round(balance),
      closingBalanceReal: Math.round(balance / realFactor),
    });
  }

  const realFactor = Math.pow(1 + annualInflationRate, years);

  return {
    projectedBalance: Math.round(balance),
    projectedBalanceReal: Math.round(balance / realFactor),
    totalEmployerContributions: Math.round(totalEmployer),
    totalPersonalContributions: Math.round(totalPersonal),
    totalInvestmentReturns: Math.round(totalReturns),
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

export default function SuperCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    currentAge: 30,
    retirementAge: 67,
    currentBalance: 50000,
    annualSalary: 90000,
    employerRate: 11.5,
    salarySacrifice: 0,
    afterTaxContribution: 0,
    returnRate: 7,
    inflationRate: 2.5,
    insuranceFeeWeekly: 5,
  });

  const [showTable, setShowTable] = useState(false);
  const [showSacrificeComparison, setShowSacrificeComparison] = useState(false);

  const result = useMemo(() => calculateSuper(inputs), [inputs]);

  // Comparison: same inputs but with $200/month salary sacrifice if currently 0, or without if currently set
  const comparisonResult = useMemo(() => {
    if (!showSacrificeComparison) return null;
    const compInputs = {
      ...inputs,
      salarySacrifice: inputs.salarySacrifice === 0 ? 200 : 0,
    };
    return calculateSuper(compInputs);
  }, [inputs, showSacrificeComparison]);

  const chartData = useMemo(() => {
    return result.yearByYear.map((row) => ({
      age: row.age,
      balance: row.closingBalance,
      balanceReal: row.closingBalanceReal,
      ...(comparisonResult
        ? {
            comparisonBalance:
              comparisonResult.yearByYear.find((r) => r.age === row.age)
                ?.closingBalance ?? 0,
          }
        : {}),
    }));
  }, [result, comparisonResult]);

  const comparisonChartData = useMemo(() => {
    if (!comparisonResult) return [];
    const withSacrifice =
      inputs.salarySacrifice > 0
        ? result.projectedBalance
        : comparisonResult.projectedBalance;
    const withoutSacrifice =
      inputs.salarySacrifice === 0
        ? result.projectedBalance
        : comparisonResult.projectedBalance;
    return [
      { name: "Without Salary Sacrifice", value: withoutSacrifice },
      { name: "With Salary Sacrifice", value: withSacrifice },
    ];
  }, [result, comparisonResult, inputs.salarySacrifice]);

  const update = (field: keyof Inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Age
            </label>
            <input
              type="number"
              value={inputs.currentAge}
              onChange={(e) => update("currentAge", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={18}
              max={75}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retirement Age
            </label>
            <input
              type="number"
              value={inputs.retirementAge}
              onChange={(e) => update("retirementAge", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={55}
              max={75}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Super Balance ($)
            </label>
            <input
              type="number"
              value={inputs.currentBalance}
              onChange={(e) => update("currentBalance", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salary ($)
            </label>
            <input
              type="number"
              value={inputs.annualSalary}
              onChange={(e) => update("annualSalary", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employer Contribution Rate (%)
            </label>
            <input
              type="number"
              value={inputs.employerRate}
              onChange={(e) => update("employerRate", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={30}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">
              SG rate: 11.5% (2025-26), 12% (2026-27+)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Sacrifice ($/month, pre-tax)
            </label>
            <input
              type="number"
              value={inputs.salarySacrifice}
              onChange={(e) => update("salarySacrifice", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              After-Tax Contributions ($/month)
            </label>
            <input
              type="number"
              value={inputs.afterTaxContribution}
              onChange={(e) =>
                update("afterTaxContribution", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Return Rate (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.returnRate}
              onChange={(e) => update("returnRate", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={20}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inflation Rate (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.inflationRate}
              onChange={(e) => update("inflationRate", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={10}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Fees ($/week)
            </label>
            <input
              type="number"
              value={inputs.insuranceFeeWeekly}
              onChange={(e) =>
                update("insuranceFeeWeekly", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ResultCard
          label="Projected Balance at Retirement"
          value={formatCurrency(result.projectedBalance)}
          subtext={`Age ${inputs.retirementAge}`}
        />
        <ResultCard
          label="In Today's Dollars"
          value={formatCurrency(result.projectedBalanceReal)}
          subtext="Adjusted for inflation"
        />
        <ResultCard
          label="Monthly Retirement Income"
          value={formatCurrency(Math.round(result.projectedBalance * 0.04 / 12))}
          subtext="Using the 4% rule"
        />
        <ResultCard
          label="Annual Retirement Income"
          value={formatCurrency(Math.round(result.projectedBalance * 0.04))}
          subtext="4% drawdown rate"
        />
        <ResultCard
          label="Total Employer Contributions"
          value={formatCurrency(result.totalEmployerContributions)}
        />
        <ResultCard
          label="Total Personal Contributions"
          value={formatCurrency(result.totalPersonalContributions)}
          subtext="Salary sacrifice + after-tax"
        />
        <ResultCard
          label="Total Investment Returns"
          value={formatCurrency(result.totalInvestmentReturns)}
        />
        <ResultCard
          label="Years to Retirement"
          value={String(Math.max(0, inputs.retirementAge - inputs.currentAge))}
        />
      </div>

      {/* Salary Sacrifice Comparison Toggle */}
      <div>
        <button
          onClick={() => setShowSacrificeComparison(!showSacrificeComparison)}
          className="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
        >
          {showSacrificeComparison
            ? "✕ Hide salary sacrifice comparison"
            : `＋ Compare ${inputs.salarySacrifice === 0 ? "with" : "without"} $${inputs.salarySacrifice === 0 ? "200" : inputs.salarySacrifice}/month salary sacrifice`}
        </button>
      </div>

      {/* Comparison Summary */}
      {showSacrificeComparison && comparisonResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Salary Sacrifice Comparison
          </h3>
          <p className="text-sm text-blue-800">
            {inputs.salarySacrifice === 0 ? (
              <>
                Adding <strong>$200/month</strong> in salary sacrifice would
                grow your super to{" "}
                <strong>{formatCurrency(comparisonResult.projectedBalance)}</strong>{" "}
                — that&apos;s{" "}
                <strong>
                  {formatCurrency(
                    comparisonResult.projectedBalance - result.projectedBalance
                  )}
                </strong>{" "}
                more at retirement.
              </>
            ) : (
              <>
                Without salary sacrifice, your super would be{" "}
                <strong>{formatCurrency(comparisonResult.projectedBalance)}</strong>.
                Your current sacrifice of{" "}
                <strong>${inputs.salarySacrifice}/month</strong> adds{" "}
                <strong>
                  {formatCurrency(
                    result.projectedBalance - comparisonResult.projectedBalance
                  )}
                </strong>{" "}
                to your retirement balance.
              </>
            )}
          </p>
        </div>
      )}

      {/* Comparison Bar Chart */}
      {showSacrificeComparison && comparisonChartData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            With vs Without Salary Sacrifice
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v: number) =>
                    v >= 1000000
                      ? `$${(v / 1000000).toFixed(1)}M`
                      : `$${(v / 1000).toFixed(0)}k`
                  }
                />
                <Tooltip
                  formatter={(value: number | string | (readonly (number | string)[]) | undefined) => [
                    formatCurrency(Number(value)),
                    "Balance at Retirement",
                  ]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Growth Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Projected Super Balance Over Time
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="age"
                label={{
                  value: "Age",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1000000
                    ? `$${(v / 1000000).toFixed(1)}M`
                    : `$${(v / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(
                  value: number | string | (readonly (number | string)[]) | undefined,
                  name: number | string | undefined
                ) => [
                  formatCurrency(Number(value)),
                  name === "balance"
                    ? "Nominal Balance"
                    : name === "balanceReal"
                      ? "In Today's Dollars"
                      : "With Salary Sacrifice",
                ]}
              />
              <Legend
                formatter={(value: string) =>
                  value === "balance"
                    ? "Nominal Balance"
                    : value === "balanceReal"
                      ? "In Today's Dollars"
                      : "With Salary Sacrifice"
                }
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#1e40af"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="balanceReal"
                stroke="#059669"
                fill="#34d399"
                fillOpacity={0.4}
              />
              {showSacrificeComparison && (
                <Area
                  type="monotone"
                  dataKey="comparisonBalance"
                  stroke="#f59e0b"
                  fill="#fbbf24"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Mortgage Repayment Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/hecs-help"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">HECS-HELP Repayment Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/stamp-duty"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/energy-bill"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Energy Bill Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Year-by-Year Breakdown Table */}
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
                    Age
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Opening
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Employer
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Sal. Sacrifice
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    After-Tax
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Fees
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Returns
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Closing
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Today&apos;s $
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.yearByYear.map((row) => (
                  <tr
                    key={row.age}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-gray-800">{row.age}</td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(row.openingBalance)}
                    </td>
                    <td className="px-3 py-2 text-right text-blue-700">
                      {formatCurrency(row.employerContribution)}
                    </td>
                    <td className="px-3 py-2 text-right text-purple-600">
                      {formatCurrency(row.salarySacrificeContribution)}
                    </td>
                    <td className="px-3 py-2 text-right text-teal-600">
                      {formatCurrency(row.afterTaxContribution)}
                    </td>
                    <td className="px-3 py-2 text-right text-red-500">
                      -{formatCurrency(row.insuranceFees)}
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-600">
                      {formatCurrency(row.investmentReturn)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatCurrency(row.closingBalance)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {formatCurrency(row.closingBalanceReal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
