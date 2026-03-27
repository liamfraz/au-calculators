"use client";
import Link from "next/link";

import { useState, useMemo } from "react";

type RepaymentType = "pi" | "io";

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

export default function PropertyCashFlowCalculator() {
  // Income
  const [weeklyRent, setWeeklyRent] = useState(550);
  const [otherWeeklyIncome, setOtherWeeklyIncome] = useState(0);

  // Mortgage
  const [loanAmount, setLoanAmount] = useState(400000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("pi");

  // Expenses
  const [councilRates, setCouncilRates] = useState(2000);
  const [waterRates, setWaterRates] = useState(800);
  const [insurance, setInsurance] = useState(1500);
  const [strata, setStrata] = useState(0);
  const [maintenance, setMaintenance] = useState(2000);
  const [managementFeePercent, setManagementFeePercent] = useState(7);
  const [landTax, setLandTax] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const results = useMemo(() => {
    // Mortgage repayment
    const periodicRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    let monthlyRepayment: number;
    if (repaymentType === "io" || periodicRate === 0) {
      monthlyRepayment = repaymentType === "io"
        ? loanAmount * periodicRate
        : loanAmount / totalPayments;
    } else {
      monthlyRepayment =
        (loanAmount * (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
        (Math.pow(1 + periodicRate, totalPayments) - 1);
    }

    const annualMortgage = monthlyRepayment * 12;

    // Income
    const annualRent = weeklyRent * 52;
    const annualOtherIncome = otherWeeklyIncome * 52;
    const totalAnnualIncome = annualRent + annualOtherIncome;

    // Expenses
    const managementFeeAmount = annualRent * (managementFeePercent / 100);
    const totalAnnualExpenses =
      annualMortgage +
      councilRates +
      waterRates +
      insurance +
      strata +
      maintenance +
      managementFeeAmount +
      landTax +
      otherExpenses;

    // Cash flow
    const annualCashFlow = totalAnnualIncome - totalAnnualExpenses;
    const monthlyCashFlow = annualCashFlow / 12;
    const weeklyCashFlow = annualCashFlow / 52;
    const cashFlowYield = loanAmount > 0 ? (annualCashFlow / loanAmount) * 100 : 0;

    return {
      monthlyRepayment,
      annualMortgage,
      annualRent,
      annualOtherIncome,
      totalAnnualIncome,
      managementFeeAmount,
      totalAnnualExpenses,
      annualCashFlow,
      monthlyCashFlow,
      weeklyCashFlow,
      cashFlowYield,
    };
  }, [
    weeklyRent,
    otherWeeklyIncome,
    loanAmount,
    interestRate,
    loanTerm,
    repaymentType,
    councilRates,
    waterRates,
    insurance,
    strata,
    maintenance,
    managementFeePercent,
    landTax,
    otherExpenses,
  ]);

  const isPositive = results.annualCashFlow >= 0;

  return (
    <div className="space-y-8">
      {/* Income Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rental Income</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="weeklyRent" className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Rent ($)
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
          <div>
            <label htmlFor="otherIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Other Weekly Income ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="otherIncome"
                type="number"
                min={0}
                step={5}
                value={otherWeeklyIncome}
                onChange={(e) => setOtherWeeklyIncome(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">e.g., parking, storage</p>
          </div>
        </div>
      </div>

      {/* Mortgage Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mortgage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="loanAmount"
                type="number"
                min={0}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <input
              id="interestRate"
              type="number"
              min={0}
              max={30}
              step={0.01}
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (years)
            </label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Type</label>
            <div className="flex gap-2">
              {([
                ["pi", "Principal & Interest"],
                ["io", "Interest Only"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setRepaymentType(value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    repaymentType === value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Annual Expenses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="councilRates" className="block text-sm font-medium text-gray-700 mb-1">
              Council Rates ($)
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
            <label htmlFor="waterRates" className="block text-sm font-medium text-gray-700 mb-1">
              Water Rates ($)
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
          <div>
            <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance ($)
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
            <label htmlFor="strata" className="block text-sm font-medium text-gray-700 mb-1">
              Strata / Body Corp ($)
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
            <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance ($)
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
            <label htmlFor="managementFee" className="block text-sm font-medium text-gray-700 mb-1">
              Management Fee (% of rent)
            </label>
            <input
              id="managementFee"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={managementFeePercent}
              onChange={(e) => setManagementFeePercent(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              = {formatCurrency(results.managementFeeAmount)} per year
            </p>
          </div>
          <div>
            <label htmlFor="landTax" className="block text-sm font-medium text-gray-700 mb-1">
              Land Tax ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="landTax"
                type="number"
                min={0}
                step={100}
                value={landTax}
                onChange={(e) => setLandTax(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="otherExpenses" className="block text-sm font-medium text-gray-700 mb-1">
              Other Annual Expenses ($)
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

      {/* Results Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Total Annual Income</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(results.totalAnnualIncome)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Total Annual Expenses</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(results.totalAnnualExpenses)}
          </p>
        </div>
        <div
          className={`border rounded-xl p-5 text-center col-span-2 sm:col-span-1 ${
            isPositive
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <p className={`text-sm mb-1 ${isPositive ? "text-green-700" : "text-red-700"}`}>
            Annual Cash Flow
          </p>
          <p className={`text-2xl font-bold ${isPositive ? "text-green-800" : "text-red-800"}`}>
            {results.annualCashFlow >= 0 ? "" : "-"}
            {formatCurrency(Math.abs(results.annualCashFlow))}
          </p>
          <p className={`text-xs mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "Positive Cash Flow" : "Negative Cash Flow"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Monthly Cash Flow</p>
          <p className={`text-2xl font-bold ${isPositive ? "text-green-800" : "text-red-800"}`}>
            {results.monthlyCashFlow >= 0 ? "" : "-"}
            {formatCurrencyExact(Math.abs(results.monthlyCashFlow))}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Weekly Cash Flow</p>
          <p className={`text-2xl font-bold ${isPositive ? "text-green-800" : "text-red-800"}`}>
            {results.weeklyCashFlow >= 0 ? "" : "-"}
            {formatCurrencyExact(Math.abs(results.weeklyCashFlow))}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Cash Flow Yield</p>
          <p className={`text-2xl font-bold ${isPositive ? "text-green-800" : "text-red-800"}`}>
            {results.cashFlowYield.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">of loan amount</p>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Income & Expense Breakdown</h3>
        <div className="space-y-1 text-sm">
          {/* Income */}
          <div className="font-medium text-gray-700 pt-2 pb-1">Income</div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Rental Income ({formatCurrency(weeklyRent)}/wk)</span>
            <span className="font-medium text-green-700">{formatCurrency(results.annualRent)}</span>
          </div>
          {otherWeeklyIncome > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Other Income ({formatCurrency(otherWeeklyIncome)}/wk)</span>
              <span className="font-medium text-green-700">{formatCurrency(results.annualOtherIncome)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-t border-gray-100 font-semibold">
            <span className="text-gray-800">Total Income</span>
            <span className="text-green-700">{formatCurrency(results.totalAnnualIncome)}</span>
          </div>

          {/* Expenses */}
          <div className="font-medium text-gray-700 pt-4 pb-1">Expenses</div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">
              Mortgage Repayments ({repaymentType === "pi" ? "P&I" : "Interest Only"})
            </span>
            <span className="font-medium text-red-700">{formatCurrency(results.annualMortgage)}</span>
          </div>
          {councilRates > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Council Rates</span>
              <span className="font-medium text-red-700">{formatCurrency(councilRates)}</span>
            </div>
          )}
          {waterRates > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Water Rates</span>
              <span className="font-medium text-red-700">{formatCurrency(waterRates)}</span>
            </div>
          )}
          {insurance > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Insurance</span>
              <span className="font-medium text-red-700">{formatCurrency(insurance)}</span>
            </div>
          )}
          {strata > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Strata / Body Corp</span>
              <span className="font-medium text-red-700">{formatCurrency(strata)}</span>
            </div>
          )}
          {maintenance > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Maintenance</span>
              <span className="font-medium text-red-700">{formatCurrency(maintenance)}</span>
            </div>
          )}
          {managementFeePercent > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Management Fee ({managementFeePercent}%)</span>
              <span className="font-medium text-red-700">{formatCurrency(results.managementFeeAmount)}</span>
            </div>
          )}
          {landTax > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Land Tax</span>
              <span className="font-medium text-red-700">{formatCurrency(landTax)}</span>
            </div>
          )}
          {otherExpenses > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Other Expenses</span>
              <span className="font-medium text-red-700">{formatCurrency(otherExpenses)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-t border-gray-100 font-semibold">
            <span className="text-gray-800">Total Expenses</span>
            <span className="text-red-700">{formatCurrency(results.totalAnnualExpenses)}</span>
          </div>

          {/* Net Cash Flow */}
          <div className={`flex justify-between py-2 border-t-2 border-gray-300 font-bold text-base ${isPositive ? "text-green-800" : "text-red-800"}`}>
            <span>Annual Cash Flow</span>
            <span>
              {results.annualCashFlow >= 0 ? "" : "-"}
              {formatCurrency(Math.abs(results.annualCashFlow))}
            </span>
          </div>
          <div className={`flex justify-between py-1 text-sm ${isPositive ? "text-green-700" : "text-red-700"}`}>
            <span>Monthly</span>
            <span>
              {results.monthlyCashFlow >= 0 ? "" : "-"}
              {formatCurrencyExact(Math.abs(results.monthlyCashFlow))}
            </span>
          </div>
          <div className={`flex justify-between py-1 text-sm ${isPositive ? "text-green-700" : "text-red-700"}`}>
            <span>Weekly</span>
            <span>
              {results.weeklyCashFlow >= 0 ? "" : "-"}
              {formatCurrencyExact(Math.abs(results.weeklyCashFlow))}
            </span>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Bar */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Annual Income</span>
              <span className="font-medium text-green-700">{formatCurrency(results.totalAnnualIncome)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, results.totalAnnualIncome > 0 ? (results.totalAnnualIncome / Math.max(results.totalAnnualIncome, results.totalAnnualExpenses)) * 100 : 0)}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Annual Expenses</span>
              <span className="font-medium text-red-700">{formatCurrency(results.totalAnnualExpenses)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, results.totalAnnualExpenses > 0 ? (results.totalAnnualExpenses / Math.max(results.totalAnnualIncome, results.totalAnnualExpenses)) * 100 : 0)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="border border-blue-200 rounded-xl p-5 bg-blue-50">
        <h3 className="font-semibold text-blue-900 mb-2">About This Calculator</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          This shows your <strong>pre-tax cash flow</strong> — the actual money coming in and going
          out before tax deductions. For your after-tax position including depreciation benefits,
          negative gearing tax offsets, and your marginal tax rate, use our{" "}
          <Link href="/calculators/negative-gearing" className="underline hover:text-blue-900">
            Negative Gearing Calculator
          </Link>
          .
        </p>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/rental-yield"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Rental Yield Calculator</span>
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
            href="/calculators/land-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Land Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
