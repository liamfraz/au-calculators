"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Inputs {
  currentBalance: number;
  currentAge: number;
  retirementAge: number;
  annualContributions: number;
  returnRate: number;
  annualFeeRate: number;
  taxOnEarnings: number;
}

interface YearRow {
  year: number;
  age: number;
  balance: number;
  contributions: number;
  earnings: number;
  taxPaid: number;
  feesPaid: number;
}

interface ProjectionResult {
  projectedBalance: number;
  totalContributions: number;
  totalInvestmentGrowth: number;
  totalFeesPaid: number;
  totalTaxPaid: number;
  annualPension: number;
  yearByYear: YearRow[];
}

function calculateSMSFProjection(inputs: Inputs): ProjectionResult {
  const {
    currentBalance,
    currentAge,
    retirementAge,
    annualContributions,
    returnRate,
    annualFeeRate,
    taxOnEarnings,
  } = inputs;

  const yearsToRetirement = Math.max(1, retirementAge - currentAge);
  const returnRateDecimal = returnRate / 100;
  const feeRateDecimal = annualFeeRate / 100;
  const taxRateDecimal = taxOnEarnings / 100;

  let balance = currentBalance;
  let totalContributions = 0;
  let totalInvestmentGrowth = 0;
  let totalFeesPaid = 0;
  let totalTaxPaid = 0;
  const rows: YearRow[] = [];

  for (let i = 0; i < yearsToRetirement; i++) {
    const age = currentAge + i;
    const year = i + 1;

    // Start of year: add contributions
    const balanceBeforeGrowth = balance + annualContributions;

    // Apply gross return
    const earnings = balanceBeforeGrowth * returnRateDecimal;

    // Deduct earnings tax (SMSF pays tax on earnings)
    const earningsTax = earnings * taxRateDecimal;
    const netEarnings = earnings - earningsTax;

    // Deduct annual fees
    const feesDeducted = balanceBeforeGrowth * feeRateDecimal;

    // End of year balance
    const endBalance = balanceBeforeGrowth + netEarnings - feesDeducted;
    balance = Math.max(0, endBalance);

    totalContributions += annualContributions;
    totalInvestmentGrowth += netEarnings;
    totalFeesPaid += feesDeducted;
    totalTaxPaid += earningsTax;

    rows.push({
      year,
      age,
      balance: Math.round(balance),
      contributions: Math.round(annualContributions),
      earnings: Math.round(netEarnings),
      taxPaid: Math.round(earningsTax),
      feesPaid: Math.round(feesDeducted),
    });
  }

  const annualPension = balance * 0.04;

  return {
    projectedBalance: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    totalInvestmentGrowth: Math.round(totalInvestmentGrowth),
    totalFeesPaid: Math.round(totalFeesPaid),
    totalTaxPaid: Math.round(totalTaxPaid),
    annualPension: Math.round(annualPension),
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

export default function SMSFCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    currentBalance: 200000,
    currentAge: 40,
    retirementAge: 65,
    annualContributions: 27500,
    returnRate: 7,
    annualFeeRate: 0.5,
    taxOnEarnings: 15,
  });

  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => calculateSMSFProjection(inputs), [inputs]);

  const chartData = useMemo(() => {
    return result.yearByYear.map((row) => {
      const totalContributionsToDate = inputs.currentBalance + row.contributions * row.year;
      const investmentGrowthToDate = row.balance - totalContributionsToDate;
      return {
        age: row.age,
        contributions: Math.max(0, totalContributionsToDate),
        growth: Math.max(0, investmentGrowthToDate),
      };
    });
  }, [result, inputs.currentBalance]);

  const update = (field: keyof Inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const yearsToRetirement = Math.max(0, inputs.retirementAge - inputs.currentAge);

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current SMSF Balance ($)
            </label>
            <input
              type="number"
              value={inputs.currentBalance}
              onChange={(e) => update("currentBalance", parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min={0}
              step={10000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Age
            </label>
            <input
              type="number"
              value={inputs.currentAge}
              onChange={(e) => update("currentAge", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min={18}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retirement Age
            </label>
            <input
              type="number"
              value={inputs.retirementAge}
              onChange={(e) => update("retirementAge", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min={55}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Contributions ($)
            </label>
            <input
              type="number"
              value={inputs.annualContributions}
              onChange={(e) => update("annualContributions", parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min={0}
              step={1000}
            />
            <p className="text-xs text-gray-400 mt-1">
              Cap: $30,000/year (concessional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Return Rate (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.returnRate}
              onChange={(e) => update("returnRate", parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min={0}
              max={20}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">
              Balanced: 6-7%, Growth: 7-8%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Fees (% of balance)
            </label>
            <input
              type="number"
              value={inputs.annualFeeRate}
              onChange={(e) => update("annualFeeRate", parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min={0}
              max={5}
              step={0.1}
            />
            <p className="text-xs text-gray-400 mt-1">
              Typical: 0.3-1.0% (compliance + platform)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax on Earnings (%)
            </label>
            <input
              type="number"
              value={inputs.taxOnEarnings}
              onChange={(e) => update("taxOnEarnings", parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min={0}
              max={50}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">
              Accumulation: 15%, Pension: 0%
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ResultCard
          label="Projected Balance at Retirement"
          value={formatCurrency(result.projectedBalance)}
          subtext={`Age ${inputs.retirementAge}`}
        />
        <ResultCard
          label="Annual Pension (4% SWR)"
          value={formatCurrency(result.annualPension)}
          subtext="Safe withdrawal rate"
        />
        <ResultCard
          label="Years to Retirement"
          value={String(yearsToRetirement)}
        />
        <ResultCard
          label="Total Contributions Made"
          value={formatCurrency(result.totalContributions)}
        />
        <ResultCard
          label="Total Investment Growth"
          value={formatCurrency(result.totalInvestmentGrowth)}
          subtext="After tax"
        />
        <ResultCard
          label="Total Fees Paid"
          value={formatCurrency(result.totalFeesPaid)}
        />
      </div>

      {/* Contribution Cap Warning */}
      {inputs.annualContributions > 30000 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Your annual contribution of{" "}
            {formatCurrency(inputs.annualContributions)} exceeds the 2025/26
            concessional contribution cap of $30,000. Amounts over the cap are
            subject to an additional 47% tax. Consider using the non-concessional
            cap ($120,000/year) or spreading contributions across 3 years.
          </p>
        </div>
      )}

      {/* Growth Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Projected SMSF Balance Breakdown
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Blue = contributions accumulated, Green = investment growth after costs
        </p>
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
                formatter={(value: number | string | (readonly (number | string)[]) | undefined) => [
                  formatCurrency(Number(value)),
                ]}
              />
              <Area
                type="monotone"
                dataKey="contributions"
                stackId="1"
                stroke="#1e40af"
                fill="#3b82f6"
                fillOpacity={0.7}
                name="Contributions"
              />
              <Area
                type="monotone"
                dataKey="growth"
                stackId="1"
                stroke="#059669"
                fill="#34d399"
                fillOpacity={0.7}
                name="Investment Growth"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Projection Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="text-gray-600 mb-1">Total Tax Paid</p>
            <p className="text-lg font-bold text-blue-900">
              {formatCurrency(result.totalTaxPaid)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Effective Fee Rate</p>
            <p className="text-lg font-bold text-blue-900">
              {result.projectedBalance > 0
                ? ((result.totalFeesPaid / result.projectedBalance) * 100).toFixed(2)
                : "0"}
              %
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Net Return After All Costs</p>
            <p className="text-lg font-bold text-blue-900">
              {result.totalContributions > 0
                ? (((result.projectedBalance - result.totalContributions) /
                    result.totalContributions) *
                    100).toFixed(1)
                : "0"}
              %
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Years Projecting</p>
            <p className="text-lg font-bold text-blue-900">{yearsToRetirement}</p>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Super Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/income-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Income Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/compound-interest"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Savings Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/capital-gains-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Capital Gains Tax Calculator</span>
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
          <h3 className="font-semibold text-gray-800">Year-by-Year Breakdown</h3>
          <span className="text-gray-400 text-xl">{showTable ? "▲" : "▼"}</span>
        </button>

        {showTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-t border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">
                    Year
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">
                    Age
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Contributions
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Earnings (Net)
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Tax Paid
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Fees Paid
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Balance
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
                    <td className="px-3 py-2 text-gray-800">{row.age}</td>
                    <td className="px-3 py-2 text-right text-blue-700">
                      {formatCurrency(row.contributions)}
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-600">
                      {formatCurrency(row.earnings)}
                    </td>
                    <td className="px-3 py-2 text-right text-red-500">
                      {formatCurrency(row.taxPaid)}
                    </td>
                    <td className="px-3 py-2 text-right text-orange-500">
                      {formatCurrency(row.feesPaid)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatCurrency(row.balance)}
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
