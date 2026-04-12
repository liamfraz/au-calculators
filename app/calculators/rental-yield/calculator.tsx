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

function formatCurrencyExact(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

const CITY_AVERAGES = [
  { city: "Sydney", grossYield: 3.2, rentRange: "$550–$900/wk", medianPrice: "$1.4M" },
  { city: "Melbourne", grossYield: 3.5, rentRange: "$450–$750/wk", medianPrice: "$950K" },
  { city: "Brisbane", grossYield: 4.2, rentRange: "$550–$750/wk", medianPrice: "$820K" },
  { city: "Perth", grossYield: 4.5, rentRange: "$600–$850/wk", medianPrice: "$780K" },
  { city: "Adelaide", grossYield: 4.3, rentRange: "$450–$650/wk", medianPrice: "$720K" },
  { city: "Hobart", grossYield: 4.8, rentRange: "$450–$600/wk", medianPrice: "$620K" },
];

// --- Types ---

interface PropertyInputs {
  label: string;
  purchasePrice: number;
  weeklyRent: number;
  councilRates: number;
  insurance: number;
  maintenance: number;
  managementFeePercent: number;
  depositPercent: number;
  mortgageRate: number;
  loanTerm: number;
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
    managementFeePercent: 8,
    depositPercent: 20,
    mortgageRate: 6.2,
    loanTerm: 30,
    strata: 0,
    waterRates: 0,
    otherExpenses: 0,
  };
}

function calcResults(p: PropertyInputs) {
  const annualRent = p.weeklyRent * 52;

  // Management fees calculation (percentage-based)
  const managementFeeAmount = (p.managementFeePercent / 100) * annualRent;

  // Other expenses (excluding management fees)
  const otherExpensesTotal =
    p.councilRates +
    p.insurance +
    p.maintenance +
    p.strata +
    p.waterRates +
    p.otherExpenses;

  const totalExpenses = managementFeeAmount + otherExpensesTotal;

  const grossYield = p.purchasePrice > 0 ? (annualRent / p.purchasePrice) * 100 : 0;

  // Mortgage calculation
  const depositAmount = p.purchasePrice * (p.depositPercent / 100);
  const loanAmount = p.purchasePrice - depositAmount;
  const monthlyRate = p.mortgageRate / 100 / 12;
  const totalPeriods = p.loanTerm * 12;

  let monthlyRepayment = 0;
  if (monthlyRate === 0) {
    monthlyRepayment = loanAmount / totalPeriods;
  } else {
    const numerator = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPeriods));
    const denominator = Math.pow(1 + monthlyRate, totalPeriods) - 1;
    monthlyRepayment = numerator / denominator;
  }

  const annualMortgage = monthlyRepayment * 12;

  // Cash flow calculation
  const netIncome = annualRent - totalExpenses;
  const annualCashFlow = netIncome - annualMortgage;
  const cashOnCash = depositAmount > 0 ? (annualCashFlow / depositAmount) * 100 : 0;

  // Net yield (without mortgage)
  const netYield = p.purchasePrice > 0 ? (netIncome / p.purchasePrice) * 100 : 0;

  // Break-even weekly rent
  let breakEvenWeeklyRent = 0;
  if (p.depositPercent < 100) {
    const managementFeeFactor = 1 - p.managementFeePercent / 100;
    if (managementFeeFactor > 0) {
      breakEvenWeeklyRent = (otherExpensesTotal + annualMortgage) / (52 * managementFeeFactor);
    }
  }

  const weeklyNetIncome = netIncome / 52;

  return {
    annualRent,
    grossYield,
    totalExpenses,
    managementFeeAmount,
    otherExpensesTotal,
    netIncome,
    netYield,
    weeklyNetIncome,
    depositAmount,
    loanAmount,
    monthlyRepayment,
    annualMortgage,
    annualCashFlow,
    cashOnCash,
    breakEvenWeeklyRent,
  };
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
  const [managementFeePercent, setManagementFeePercent] = useState(8);
  const [depositPercent, setDepositPercent] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(6.2);
  const [loanTerm, setLoanTerm] = useState(30);
  const [strata, setStrata] = useState(0);
  const [waterRates, setWaterRates] = useState(800);
  const [otherExpenses, setOtherExpenses] = useState(0);

  // Property comparison
  const [showComparison, setShowComparison] = useState(false);
  const [compareProperties, setCompareProperties] = useState<PropertyInputs[]>([
    defaultProperty("Property A"),
    defaultProperty("Property B"),
  ]);

  // Test case values for verification comment:
  // Purchase price: $750,000 | Deposit: 20% ($150,000) | Loan: $600,000
  // Mortgage rate: 6.2% | Loan term: 30 years
  // Weekly rent: $600 | Annual rent: $31,200
  // Council: $2,000 | Insurance: $1,500 | Maintenance: $2,000 | Water: $800 | Strata: $0 | Other: $0
  // Management fee: 8% × $31,200 = $2,496
  // Total other expenses: $6,300
  // Monthly repayment: ~$3,674 (P&I formula)
  // Annual mortgage: ~$44,087
  // Gross yield: ($31,200 / $750,000) = 4.16%
  // Net yield: ($31,200 - $2,496 - $6,300) / $750,000 = $22,404 / $750,000 = 2.99%
  // Annual cash flow: $31,200 - $2,496 - $6,300 - $44,087 = -$21,683
  // Cash-on-cash: -$21,683 / $150,000 = -14.46%
  // Break-even weekly: ($6,300 + $44,087) / (52 × 0.92) = $50,387 / 47.84 = ~$1,053/wk

  const results = useMemo(() => {
    const p: PropertyInputs = {
      label: "Main Property",
      purchasePrice,
      weeklyRent,
      councilRates,
      insurance,
      maintenance,
      managementFeePercent,
      depositPercent,
      mortgageRate,
      loanTerm,
      strata,
      waterRates,
      otherExpenses,
    };
    return calcResults(p);
  }, [purchasePrice, weeklyRent, councilRates, insurance, maintenance, managementFeePercent, depositPercent, mortgageRate, loanTerm, strata, waterRates, otherExpenses]);

  const expenses = useMemo(
    () => [
      { label: "Council Rates", value: councilRates },
      { label: "Insurance", value: insurance },
      { label: "Maintenance", value: maintenance },
      { label: `Management Fees (${managementFeePercent}%)`, value: results.managementFeeAmount },
      { label: "Strata / Body Corp", value: strata },
      { label: "Water Rates", value: waterRates },
      { label: "Other Expenses", value: otherExpenses },
    ],
    [councilRates, insurance, maintenance, managementFeePercent, results.managementFeeAmount, strata, waterRates, otherExpenses],
  );

  const yieldComparison = useMemo(() => {
    const offsets = [-100, -50, 0, 50, 100];
    return offsets.map((offset) => {
      const rent = Math.max(0, weeklyRent + offset);
      const annual = rent * 52;
      const gross = purchasePrice > 0 ? (annual / purchasePrice) * 100 : 0;
      const mgmtFee = (managementFeePercent / 100) * annual;
      const otherExp = councilRates + insurance + maintenance + strata + waterRates + otherExpenses;
      const totalExp = mgmtFee + otherExp;
      const net = purchasePrice > 0 ? ((annual - totalExp) / purchasePrice) * 100 : 0;
      return { weeklyRent: rent, annualRent: annual, grossYield: gross, netYield: net, isCurrent: offset === 0 };
    });
  }, [purchasePrice, weeklyRent, councilRates, insurance, maintenance, managementFeePercent, strata, waterRates, otherExpenses]);

  function updateCompareProperty(index: number, field: keyof PropertyInputs, value: string | number) {
    setCompareProperties((prev) => {
      const updated = [...prev];
      if (field === "label") {
        updated[index] = { ...updated[index], label: typeof value === "string" ? value : String(value) };
      } else {
        const numValue = typeof value === "string" ? parseFloat(value) || 0 : Math.max(0, value);
        updated[index] = { ...updated[index], [field]: numValue };
      }
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Deposit % */}
          <div>
            <label htmlFor="depositPercent" className="block text-sm font-medium text-gray-700 mb-1">
              Deposit %
            </label>
            <input
              id="depositPercent"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={depositPercent}
              onChange={(e) => setDepositPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(results.depositAmount)} deposit, {formatCurrency(results.loanAmount)} loan</p>
          </div>

          {/* Mortgage Rate % */}
          <div>
            <label htmlFor="mortgageRate" className="block text-sm font-medium text-gray-700 mb-1">
              Mortgage Rate (% p.a.)
            </label>
            <input
              id="mortgageRate"
              type="number"
              min={0}
              max={20}
              step={0.01}
              value={mortgageRate}
              onChange={(e) => setMortgageRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (years)
            </label>
            <div className="flex gap-2 mb-2">
              {[25, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    loanTerm === term
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {term}y
                </button>
              ))}
            </div>
            <input
              id="loanTerm"
              type="number"
              min={1}
              max={40}
              step={1}
              value={loanTerm}
              onChange={(e) => setLoanTerm(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Management Fee % */}
          <div>
            <label htmlFor="managementFeePercent" className="block text-sm font-medium text-gray-700 mb-1">
              Management Fee %
            </label>
            <input
              id="managementFeePercent"
              type="number"
              min={0}
              max={20}
              step={0.1}
              value={managementFeePercent}
              onChange={(e) => setManagementFeePercent(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(results.managementFeeAmount)}/year</p>
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results - Row 1 */}
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

      {/* Results - Row 2: Mortgage & Cash Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Monthly Loan Repayment</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrencyExact(results.monthlyRepayment)}</p>
        </div>
        <div className={`border rounded-xl p-5 text-center ${results.annualCashFlow >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <p className="text-sm text-gray-500 mb-1">Annual Cash Flow</p>
          <p className={`text-2xl font-bold ${results.annualCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(results.annualCashFlow)}
          </p>
        </div>
        <div className={`border rounded-xl p-5 text-center ${results.cashOnCash >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <p className="text-sm text-gray-500 mb-1">Cash-on-Cash Return</p>
          <p className={`text-2xl font-bold ${results.cashOnCash >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatPercent(results.cashOnCash)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Break-Even Weekly Rent</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(Math.round(results.breakEvenWeeklyRent))}/wk</p>
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

        {/* Bar Chart Section */}
        <div className="space-y-3 mb-6">
          {CITY_AVERAGES.map((c) => {
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

        {/* Data Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">City</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Avg Gross Yield</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Typical Rent Range</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Median House Price</th>
              </tr>
            </thead>
            <tbody>
              {CITY_AVERAGES.map((city) => (
                <tr key={city.city} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-900 font-medium">{city.city}</td>
                  <td className={`text-right py-2 px-4 font-medium ${yieldColor(city.grossYield)}`}>
                    {formatPercent(city.grossYield)}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">{city.rentRange}</td>
                  <td className="text-right py-2 pl-4 text-gray-600">{city.medianPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                    <label className="block text-xs text-gray-500 mb-0.5">Council Rates</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={prop.councilRates}
                        onChange={(e) => updateCompareProperty(idx, "councilRates", Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Insurance</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={prop.insurance}
                        onChange={(e) => updateCompareProperty(idx, "insurance", Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Maintenance</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={prop.maintenance}
                        onChange={(e) => updateCompareProperty(idx, "maintenance", Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Management Fee %</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.1}
                      value={prop.managementFeePercent}
                      onChange={(e) => updateCompareProperty(idx, "managementFeePercent", Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Strata / Body Corp</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={prop.strata}
                        onChange={(e) => updateCompareProperty(idx, "strata", Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Water Rates</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={prop.waterRates}
                        onChange={(e) => updateCompareProperty(idx, "waterRates", Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-0.5">Other Expenses</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={prop.otherExpenses}
                        onChange={(e) => updateCompareProperty(idx, "otherExpenses", Number(e.target.value))}
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
                      { label: "Monthly Loan Repayment", key: "monthlyRepayment" as const, fmt: "currency" },
                      { label: "Annual Cash Flow", key: "annualCashFlow" as const, fmt: "currency" },
                      { label: "Cash-on-Cash Return", key: "cashOnCash" as const, fmt: "percent" },
                    ].map((row) => {
                      const values = compareProperties.map((p) => {
                        const r = calcResults(p);
                        if (row.key === "purchasePrice") return p.purchasePrice;
                        if (row.key === "weeklyRent") return p.weeklyRent;
                        return r[row.key as keyof typeof r];
                      });

                      // Find best yield for highlighting
                      const yieldKeys = ["grossYield", "netYield", "netIncome", "weeklyNetIncome", "monthlyRepayment", "annualCashFlow", "cashOnCash"];
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
                                : row.key === "netIncome" || row.key === "weeklyNetIncome" || row.key === "annualCashFlow"
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
            href="/calculators/investment-property-cashflow"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Investment Property Cash Flow Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
