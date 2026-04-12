"use client";

import { useState, useMemo } from "react";

// ATO 2025-26 HELP repayment thresholds (exact values)
const REPAYMENT_THRESHOLDS = [
  { min: 0, max: 54434, rate: 0.0 },
  { min: 54435, max: 62849, rate: 0.01 },
  { min: 62850, max: 66620, rate: 0.02 },
  { min: 66621, max: 70618, rate: 0.025 },
  { min: 70619, max: 74855, rate: 0.03 },
  { min: 74856, max: 79346, rate: 0.035 },
  { min: 79347, max: 84108, rate: 0.04 },
  { min: 84109, max: 89154, rate: 0.045 },
  { min: 89155, max: 94503, rate: 0.05 },
  { min: 94504, max: 100174, rate: 0.055 },
  { min: 100175, max: 106185, rate: 0.06 },
  { min: 106186, max: 112556, rate: 0.065 },
  { min: 112557, max: 119310, rate: 0.07 },
  { min: 119311, max: 126468, rate: 0.075 },
  { min: 126469, max: 134056, rate: 0.08 },
  { min: 134057, max: 142100, rate: 0.085 },
  { min: 142101, max: 150626, rate: 0.09 },
  { min: 150627, max: 159663, rate: 0.095 },
  { min: 159664, max: Infinity, rate: 0.1 },
];

interface SimulationRow {
  year: number;
  income: number;
  rate: number;
  openingBalance: number;
  mandatoryRepayment: number;
  extraRepayment: number;
  totalRepayment: number;
  indexation: number;
  closingBalance: number;
}

interface SimulationResult {
  rows: SimulationRow[];
  yearCleared: number | null;
  totalIndexation: number;
  totalRepaid: number;
}

function getRepaymentRate(income: number): number {
  const tier = REPAYMENT_THRESHOLDS.find(t => income >= t.min && income <= t.max);
  return tier?.rate ?? 0;
}

function simulate(inputs: {
  currentDebt: number;
  annualIncome: number;
  incomeGrowth: number;
  projectionYears: number;
  cpiRate: number;
  extraRepayment: number;
  showExtraRepayment: boolean;
}): SimulationResult {
  let debt = inputs.currentDebt;
  let income = inputs.annualIncome;
  const rows: SimulationRow[] = [];
  let totalIndexation = 0;
  let totalRepaid = 0;
  let yearCleared: number | null = null;

  for (let year = 1; year <= inputs.projectionYears; year++) {
    if (debt <= 0) break;

    const openingBalance = debt;

    // 1. Apply CPI indexation FIRST
    const indexation = debt * (inputs.cpiRate / 100);
    debt += indexation;
    totalIndexation += indexation;

    // 2. Calculate mandatory repayment
    const rate = getRepaymentRate(income);
    const mandatoryRepayment = income * rate;

    // 3. Add voluntary extra repayment
    const totalRepayment = mandatoryRepayment + (inputs.showExtraRepayment ? inputs.extraRepayment : 0);

    // 4. Apply repayment (don't go below 0)
    const actualRepayment = Math.min(totalRepayment, debt);
    debt = Math.max(0, debt - actualRepayment);
    totalRepaid += actualRepayment;

    rows.push({
      year,
      income: Math.round(income),
      rate,
      openingBalance: Math.round(openingBalance),
      mandatoryRepayment: Math.round(mandatoryRepayment),
      extraRepayment: inputs.showExtraRepayment ? inputs.extraRepayment : 0,
      totalRepayment: Math.round(actualRepayment),
      indexation: Math.round(indexation),
      closingBalance: Math.round(debt),
    });

    if (debt <= 0 && yearCleared === null) {
      yearCleared = year;
      break;
    }

    // 5. Grow income for next year
    income *= (1 + inputs.incomeGrowth / 100);
  }

  return { rows, yearCleared, totalIndexation: Math.round(totalIndexation), totalRepaid: Math.round(totalRepaid) };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export default function HECSCalculator() {
  const [currentDebt, setCurrentDebt] = useState(26000);
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [incomeGrowth, setIncomeGrowth] = useState(3);
  const [projectionYears, setProjectionYears] = useState(20);
  const [cpiRate, setCpiRate] = useState(4.7);
  const [extraRepayment, setExtraRepayment] = useState(0);
  const [showExtraRepayment, setShowExtraRepayment] = useState(false);
  const [expandedTable, setExpandedTable] = useState(false);

  const result = useMemo(() => {
    return simulate({
      currentDebt,
      annualIncome,
      incomeGrowth,
      projectionYears,
      cpiRate,
      extraRepayment,
      showExtraRepayment,
    });
  }, [currentDebt, annualIncome, incomeGrowth, projectionYears, cpiRate, extraRepayment, showExtraRepayment]);

  const firstYearRate = getRepaymentRate(annualIncome);
  const firstYearRepayment = annualIncome * firstYearRate;

  return (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Debt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current HECS-HELP Debt
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                value={currentDebt}
                onChange={(e) => setCurrentDebt(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Annual Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Income
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Income Growth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Income Growth Rate
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={incomeGrowth}
                onChange={(e) => setIncomeGrowth(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>

          {/* CPI Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indexation (CPI) Rate
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={cpiRate}
                onChange={(e) => setCpiRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>

          {/* Projection Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projection Period
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={projectionYears}
                onChange={(e) => setProjectionYears(Math.min(30, Math.max(1, Number(e.target.value))))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="30"
              />
              <span className="text-gray-600">years</span>
            </div>
          </div>
        </div>

        {/* Voluntary Repayment Toggle */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showExtraRepayment}
              onChange={(e) => setShowExtraRepayment(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Make extra voluntary repayments?
            </span>
          </label>

          {showExtraRepayment && (
            <div className="mt-4 ml-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Annual Repayment
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">$</span>
                <input
                  type="number"
                  value={extraRepayment}
                  onChange={(e) => setExtraRepayment(Math.max(0, Number(e.target.value)))}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-blue-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Repayment Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Years Until Debt Free */}
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Years Until Cleared</p>
            <p className={`text-2xl font-bold ${
              result.yearCleared === null
                ? "text-red-600"
                : result.yearCleared >= 20
                ? "text-red-600"
                : result.yearCleared >= 10
                ? "text-amber-600"
                : "text-green-600"
            }`}>
              {result.yearCleared !== null ? result.yearCleared : `${projectionYears}+`}
            </p>
          </div>

          {/* Annual Repayment (Year 1) */}
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Repayment This Year</p>
            <p className="text-2xl font-bold text-blue-800">{formatCurrency(firstYearRepayment)}</p>
          </div>

          {/* Repayment Rate (Year 1) */}
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Repayment Rate</p>
            <p className="text-2xl font-bold text-blue-800">{formatPercentage(firstYearRate)}</p>
          </div>

          {/* Total Paid Back */}
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Total Paid Back</p>
            <p className="text-2xl font-bold text-blue-800">{formatCurrency(result.totalRepaid)}</p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Table */}
      {result.rows.length > 0 && (
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Year-by-Year Breakdown</h2>
            {result.rows.length > 10 && (
              <button
                onClick={() => setExpandedTable(!expandedTable)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {expandedTable ? "Show less" : "Show all years"}
              </button>
            )}
          </div>

          <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
            &#9432; Indexation is applied on 1 June each year based on CPI. The default rate of 4.7% reflects the 2025 indexation applied to HELP debts.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-3 font-semibold text-gray-700">Year</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700">Income</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700">Opening Balance</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700">Indexation Added</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700">Repayment</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700">Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.slice(0, expandedTable ? result.rows.length : 10).map((row) => (
                  <tr
                    key={row.year}
                    className={`border-b border-gray-100 last:border-0 transition-colors ${
                      row.closingBalance <= 0 ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-3 text-gray-900">{row.year}</td>
                    <td className="text-right px-3 py-3 text-gray-900">{formatCurrency(row.income)}</td>
                    <td className="text-right px-3 py-3 text-gray-900">{formatCurrency(row.openingBalance)}</td>
                    <td className="text-right px-3 py-3 text-orange-700">{formatCurrency(row.indexation)}</td>
                    <td className="text-right px-3 py-3 text-gray-900">{formatCurrency(row.totalRepayment)}</td>
                    <td className="text-right px-3 py-3 font-semibold text-blue-800">
                      {formatCurrency(row.closingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Affiliate: Savings Accounts Section */}
      <div className="border border-green-200 rounded-xl p-6 bg-green-50">
        <h3 className="font-semibold text-gray-900 mb-2">Want to pay off HECS faster?</h3>
        <p className="text-sm text-gray-700 mb-4">
          Earning more interest on your savings can help offset HECS indexation. Compare high-interest savings accounts to find the best rate.
        </p>
        <a
          href="https://www.canstar.com.au/savings-accounts/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Compare Savings Accounts →
        </a>
      </div>
    </div>
  );
}
