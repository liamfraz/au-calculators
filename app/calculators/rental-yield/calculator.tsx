"use client";
import Link from "next/link";

import { useState, useMemo } from "react";

// --- Formatting ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function yieldColor(yieldPct: number): string {
  if (yieldPct >= 5) return "text-green-600";
  if (yieldPct >= 3) return "text-blue-600";
  return "text-orange-600";
}

function yieldBorderBg(yieldPct: number): string {
  if (yieldPct >= 5) return "border-green-200 bg-green-50";
  if (yieldPct >= 3) return "border-blue-200 bg-blue-50";
  return "border-orange-200 bg-orange-50";
}

// --- Component ---

export default function RentalYieldCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [weeklyRent, setWeeklyRent] = useState(500);
  const [councilRates, setCouncilRates] = useState(2000);
  const [insurance, setInsurance] = useState(1500);
  const [maintenance, setMaintenance] = useState(2000);
  const [managementFees, setManagementFees] = useState(0);
  const [strata, setStrata] = useState(0);
  const [waterRates, setWaterRates] = useState(800);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const results = useMemo(() => {
    const annualRent = weeklyRent * 52;
    const grossYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
    const totalExpenses =
      councilRates + insurance + maintenance + managementFees + strata + waterRates + otherExpenses;
    const netIncome = annualRent - totalExpenses;
    const netYield = purchasePrice > 0 ? (netIncome / purchasePrice) * 100 : 0;
    const weeklyNetIncome = netIncome / 52;

    return {
      annualRent,
      grossYield,
      totalExpenses,
      netIncome,
      netYield,
      weeklyNetIncome,
    };
  }, [purchasePrice, weeklyRent, councilRates, insurance, maintenance, managementFees, strata, waterRates, otherExpenses]);

  const expenses = useMemo(
    () => [
      { label: "Council Rates", value: councilRates },
      { label: "Insurance", value: insurance },
      { label: "Maintenance", value: maintenance },
      { label: "Management Fees", value: managementFees },
      { label: "Strata / Body Corp", value: strata },
      { label: "Water Rates", value: waterRates },
      { label: "Other Expenses", value: otherExpenses },
    ],
    [councilRates, insurance, maintenance, managementFees, strata, waterRates, otherExpenses],
  );

  const yieldComparison = useMemo(() => {
    const offsets = [-100, -50, 0, 50, 100];
    return offsets.map((offset) => {
      const rent = Math.max(0, weeklyRent + offset);
      const annual = rent * 52;
      const gross = purchasePrice > 0 ? (annual / purchasePrice) * 100 : 0;
      const totalExp =
        councilRates + insurance + maintenance + managementFees + strata + waterRates + otherExpenses;
      const net = purchasePrice > 0 ? ((annual - totalExp) / purchasePrice) * 100 : 0;
      return { weeklyRent: rent, annualRent: annual, grossYield: gross, netYield: net, isCurrent: offset === 0 };
    });
  }, [purchasePrice, weeklyRent, councilRates, insurance, maintenance, managementFees, strata, waterRates, otherExpenses]);

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="purchasePrice"
                type="number"
                min={0}
                step={10000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Weekly Rent */}
          <div>
            <label htmlFor="weeklyRent" className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Rent
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="weeklyRent"
                type="number"
                min={0}
                step={10}
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Annual Expenses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Council Rates */}
          <div>
            <label htmlFor="councilRates" className="block text-sm font-medium text-gray-700 mb-1">
              Council Rates
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="councilRates"
                type="number"
                min={0}
                step={100}
                value={councilRates}
                onChange={(e) => setCouncilRates(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Insurance */}
          <div>
            <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="insurance"
                type="number"
                min={0}
                step={100}
                value={insurance}
                onChange={(e) => setInsurance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Maintenance */}
          <div>
            <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="maintenance"
                type="number"
                min={0}
                step={100}
                value={maintenance}
                onChange={(e) => setMaintenance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Management Fees */}
          <div>
            <label htmlFor="managementFees" className="block text-sm font-medium text-gray-700 mb-1">
              Management Fees
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="managementFees"
                type="number"
                min={0}
                step={100}
                value={managementFees}
                onChange={(e) => setManagementFees(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Typically 7-10% of annual rent</p>
          </div>

          {/* Strata */}
          <div>
            <label htmlFor="strata" className="block text-sm font-medium text-gray-700 mb-1">
              Strata / Body Corp
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="strata"
                type="number"
                min={0}
                step={100}
                value={strata}
                onChange={(e) => setStrata(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Water Rates */}
          <div>
            <label htmlFor="waterRates" className="block text-sm font-medium text-gray-700 mb-1">
              Water Rates
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="waterRates"
                type="number"
                min={0}
                step={100}
                value={waterRates}
                onChange={(e) => setWaterRates(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Other Expenses */}
          <div className="sm:col-span-2">
            <label htmlFor="otherExpenses" className="block text-sm font-medium text-gray-700 mb-1">
              Other Annual Expenses
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="otherExpenses"
                type="number"
                min={0}
                step={100}
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Annual Rent</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.annualRent)}</p>
        </div>
        <div className={`border rounded-xl p-5 text-center ${yieldBorderBg(results.grossYield)}`}>
          <p className="text-sm text-gray-500 mb-1">Gross Yield</p>
          <p className={`text-2xl font-bold ${yieldColor(results.grossYield)}`}>
            {formatPercent(results.grossYield)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Total Annual Expenses</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.totalExpenses)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Net Annual Income</p>
          <p className={`text-2xl font-bold ${results.netIncome >= 0 ? "text-gray-900" : "text-red-600"}`}>
            {formatCurrency(results.netIncome)}
          </p>
        </div>
        <div className={`border rounded-xl p-5 text-center ${yieldBorderBg(results.netYield)}`}>
          <p className="text-sm text-gray-500 mb-1">Net Yield</p>
          <p className={`text-2xl font-bold ${yieldColor(results.netYield)}`}>
            {formatPercent(results.netYield)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Weekly Net Income</p>
          <p className={`text-2xl font-bold ${results.weeklyNetIncome >= 0 ? "text-gray-900" : "text-red-600"}`}>
            {formatCurrency(Math.round(results.weeklyNetIncome))}
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Expense Breakdown</h3>
        <div className="space-y-2 text-sm">
          {expenses.map((expense) => (
            <div key={expense.label} className="flex justify-between">
              <span className="text-gray-600">{expense.label}</span>
              <span className="font-medium">{formatCurrency(expense.value)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total Annual Expenses</span>
            <span className="text-gray-900">{formatCurrency(results.totalExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Yield Comparison Table */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Yield at Different Rent Levels
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          See how changing the weekly rent affects your gross and net yield on a{" "}
          {formatCurrency(purchasePrice)} property.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Weekly Rent</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Annual Rent</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Gross Yield</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Net Yield</th>
              </tr>
            </thead>
            <tbody>
              {yieldComparison.map((row) => (
                <tr
                  key={row.weeklyRent}
                  className={`border-b border-gray-100 ${row.isCurrent ? "bg-blue-50" : ""}`}
                >
                  <td className="py-2 pr-4">
                    <span className={`font-medium ${row.isCurrent ? "text-blue-800" : "text-gray-900"}`}>
                      {formatCurrency(row.weeklyRent)}/wk
                    </span>
                    {row.isCurrent && (
                      <span className="text-xs text-blue-600 ml-2">Current</span>
                    )}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrency(row.annualRent)}
                  </td>
                  <td className={`text-right py-2 px-4 font-medium ${yieldColor(row.grossYield)}`}>
                    {formatPercent(row.grossYield)}
                  </td>
                  <td className={`text-right py-2 pl-4 font-medium ${yieldColor(row.netYield)}`}>
                    {formatPercent(row.netYield)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            href="/calculators/stamp-duty"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/negative-gearing"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/property-cashflow"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Property Cash Flow Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
