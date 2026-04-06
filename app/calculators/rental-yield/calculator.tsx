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

// --- City averages ---

const cityAverages = [
  { city: "Sydney", grossYield: 3.2 },
  { city: "Melbourne", grossYield: 3.5 },
  { city: "Brisbane", grossYield: 4.2 },
  { city: "Adelaide", grossYield: 4.3 },
  { city: "Perth", grossYield: 4.5 },
  { city: "Hobart", grossYield: 4.8 },
];

// --- Types ---

interface PropertyInputs {
  label: string;
  purchasePrice: number;
  weeklyRent: number;
  councilRates: number;
  insurance: number;
  maintenance: number;
  managementFees: number;
  strata: number;
  waterRates: number;
  otherExpenses: number;
}

function defaultProperty(label: string): PropertyInputs {
  return {
    label,
    purchasePrice: 0,
    weeklyRent: 0,
    councilRates: 0,
    insurance: 0,
    maintenance: 0,
    managementFees: 0,
    strata: 0,
    waterRates: 0,
    otherExpenses: 0,
  };
}

function calcResults(p: PropertyInputs) {
  const annualRent = p.weeklyRent * 52;
  const totalExpenses =
    p.councilRates +
    p.insurance +
    p.maintenance +
    p.managementFees +
    p.strata +
    p.waterRates +
    p.otherExpenses;
  const grossYield = p.purchasePrice > 0 ? (annualRent / p.purchasePrice) * 100 : 0;
  const netIncome = annualRent - totalExpenses;
  const netYield = p.purchasePrice > 0 ? (netIncome / p.purchasePrice) * 100 : 0;
  const weeklyNetIncome = netIncome / 52;
  return { annualRent, grossYield, totalExpenses, netIncome, netYield, weeklyNetIncome };
}

// --- Component ---

interface RentalYieldCalculatorProps {
  defaultPurchasePrice?: number;
  defaultWeeklyRent?: number;
}

export default function RentalYieldCalculator({
  defaultPurchasePrice = 500000,
  defaultWeeklyRent = 500,
}: RentalYieldCalculatorProps = {}) {
  const [purchasePrice, setPurchasePrice] = useState(defaultPurchasePrice);
  const [weeklyRent, setWeeklyRent] = useState(defaultWeeklyRent);
  const [councilRates, setCouncilRates] = useState(2000);
  const [insurance, setInsurance] = useState(1500);
  const [maintenance, setMaintenance] = useState(2000);
  const [managementFees, setManagementFees] = useState(0);
  const [strata, setStrata] = useState(0);
  const [waterRates, setWaterRates] = useState(800);
  const [otherExpenses, setOtherExpenses] = useState(0);

  // Property comparison
  const [showComparison, setShowComparison] = useState(false);
  const [compareProperties, setCompareProperties] = useState<PropertyInputs[]>([
    defaultProperty("Property A"),
    defaultProperty("Property B"),
  ]);

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

  function updateCompareProperty(index: number, field: keyof PropertyInputs, value: string | number) {
    setCompareProperties((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: typeof value === "string" ? value : Math.max(0, value) };
      return updated;
    });
  }

  function addCompareProperty() {
    if (compareProperties.length < 3) {
      setCompareProperties((prev) => [...prev, defaultProperty(`Property ${String.fromCharCode(65 + prev.length)}`)]);
    }
  }

  function removeCompareProperty(index: number) {
    if (compareProperties.length > 2) {
      setCompareProperties((prev) => prev.filter((_, i) => i !== index));
    }
  }

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

      {/* Average Rental Yields by City */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Average Rental Yields by Capital City
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Typical gross rental yields for Australian capital cities (houses &amp; units combined). Your yield of{" "}
          <span className={`font-semibold ${yieldColor(results.grossYield)}`}>
            {formatPercent(results.grossYield)}
          </span>{" "}
          is highlighted for comparison.
        </p>

        <div className="space-y-3">
          {cityAverages.map((c) => {
            const barWidth = Math.min(100, (c.grossYield / 6) * 100);
            const userBarWidth = Math.min(100, (results.grossYield / 6) * 100);
            return (
              <div key={c.city}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{c.city}</span>
                  <span className={`font-semibold ${yieldColor(c.grossYield)}`}>
                    {formatPercent(c.grossYield)}
                  </span>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-blue-200 rounded-full"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: `${userBarWidth}%` }}
                    title={`Your yield: ${formatPercent(results.grossYield)}`}
                  />
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-blue-200 rounded" /> City average
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-0.5 bg-red-500" /> Your gross yield
            </span>
          </div>
        </div>
      </div>

      {/* Property Comparison */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Compare Properties</h3>
            <p className="text-sm text-gray-500">Enter details for up to 3 properties to compare yields side by side.</p>
          </div>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {showComparison ? "Hide" : "Show"} Comparison
          </button>
        </div>

        {showComparison && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compareProperties.map((prop, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={prop.label}
                      onChange={(e) => updateCompareProperty(idx, "label", e.target.value)}
                      className="font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-0 py-0.5 w-full"
                    />
                    {compareProperties.length > 2 && (
                      <button
                        onClick={() => removeCompareProperty(idx)}
                        className="text-gray-400 hover:text-red-500 ml-2 text-sm"
                        title="Remove property"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Purchase Price</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={10000}
                        value={prop.purchasePrice}
                        onChange={(e) => updateCompareProperty(idx, "purchasePrice", Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Weekly Rent</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={10}
                        value={prop.weeklyRent}
                        onChange={(e) => updateCompareProperty(idx, "weeklyRent", Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Annual Expenses (total)</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={500}
                        value={
                          prop.councilRates +
                          prop.insurance +
                          prop.maintenance +
                          prop.managementFees +
                          prop.strata +
                          prop.waterRates +
                          prop.otherExpenses
                        }
                        onChange={(e) => {
                          const total = Math.max(0, Number(e.target.value));
                          updateCompareProperty(idx, "otherExpenses", total);
                          updateCompareProperty(idx, "councilRates", 0);
                          updateCompareProperty(idx, "insurance", 0);
                          updateCompareProperty(idx, "maintenance", 0);
                          updateCompareProperty(idx, "managementFees", 0);
                          updateCompareProperty(idx, "strata", 0);
                          updateCompareProperty(idx, "waterRates", 0);
                        }}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {compareProperties.length < 3 && (
              <button
                onClick={addCompareProperty}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add property
              </button>
            )}

            {/* Comparison Results */}
            {compareProperties.some((p) => p.purchasePrice > 0) && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-4 font-medium text-gray-700">Metric</th>
                      {compareProperties.map((p, idx) => (
                        <th key={idx} className="text-right py-2 px-4 font-medium text-gray-700">
                          {p.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Purchase Price", key: "purchasePrice" as const, fmt: "currency" },
                      { label: "Weekly Rent", key: "weeklyRent" as const, fmt: "currency" },
                      { label: "Annual Rent", key: "annualRent" as const, fmt: "currency" },
                      { label: "Annual Expenses", key: "totalExpenses" as const, fmt: "currency" },
                      { label: "Gross Yield", key: "grossYield" as const, fmt: "percent" },
                      { label: "Net Yield", key: "netYield" as const, fmt: "percent" },
                      { label: "Net Annual Income", key: "netIncome" as const, fmt: "currency" },
                      { label: "Weekly Net Income", key: "weeklyNetIncome" as const, fmt: "currency" },
                    ].map((row) => {
                      const values = compareProperties.map((p) => {
                        const r = calcResults(p);
                        if (row.key === "purchasePrice") return p.purchasePrice;
                        if (row.key === "weeklyRent") return p.weeklyRent;
                        return r[row.key as keyof typeof r];
                      });

                      // Find best yield for highlighting
                      const yieldKeys = ["grossYield", "netYield", "netIncome", "weeklyNetIncome"];
                      const isYieldRow = yieldKeys.includes(row.key);
                      const activeValues = values.filter((_, i) => compareProperties[i].purchasePrice > 0);
                      const bestVal = isYieldRow && activeValues.length > 1 ? Math.max(...activeValues) : null;

                      return (
                        <tr key={row.key} className="border-b border-gray-100">
                          <td className="py-2 pr-4 text-gray-600">{row.label}</td>
                          {values.map((val, idx) => {
                            if (compareProperties[idx].purchasePrice === 0) {
                              return (
                                <td key={idx} className="text-right py-2 px-4 text-gray-300">
                                  —
                                </td>
                              );
                            }
                            const isBest = bestVal !== null && val === bestVal;
                            const colorClass =
                              row.fmt === "percent"
                                ? yieldColor(val)
                                : row.key === "netIncome" || row.key === "weeklyNetIncome"
                                  ? val >= 0
                                    ? "text-gray-900"
                                    : "text-red-600"
                                  : "text-gray-900";
                            return (
                              <td
                                key={idx}
                                className={`text-right py-2 px-4 font-medium ${colorClass} ${isBest ? "bg-green-50" : ""}`}
                              >
                                {row.fmt === "percent"
                                  ? formatPercent(val)
                                  : formatCurrency(Math.round(val))}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/negative-gearing"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/investment-property-cashflow"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Investment Property Cash Flow Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/cgt-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Capital Gains Tax Calculator</span>
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
