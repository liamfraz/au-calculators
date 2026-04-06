"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type RepaymentType = "pi" | "io";

interface Inputs {
  purchasePrice: number;
  depositPercent: number;
  interestRate: number;
  loanTerm: number;
  repaymentType: RepaymentType;
  weeklyRent: number;
  vacancyRate: number;
  councilRates: number;
  strataFees: number;
  insurance: number;
  managementFeePercent: number;
  maintenanceEstimate: number;
  waterRates: number;
  landTax: number;
  otherExpenses: number;
  showNegativeGearing: boolean;
  taxableIncome: number;
}

const AU_TAX_BRACKETS_2026 = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18201, max: 45000, rate: 0.16 },
  { min: 45001, max: 135000, rate: 0.30 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

const MEDICARE_LEVY = 0.02;

function calculateTax(taxableIncome: number): number {
  let tax = 0;
  for (const bracket of AU_TAX_BRACKETS_2026) {
    if (taxableIncome <= 0) break;
    const bracketSize = bracket.max === Infinity ? taxableIncome : Math.min(taxableIncome, bracket.max - bracket.min + 1);
    if (bracketSize > 0) {
      tax += bracketSize * bracket.rate;
      taxableIncome -= bracketSize;
    }
  }
  return tax;
}

function getMarginalRate(taxableIncome: number): number {
  for (let i = AU_TAX_BRACKETS_2026.length - 1; i >= 0; i--) {
    if (taxableIncome >= AU_TAX_BRACKETS_2026[i].min) {
      return AU_TAX_BRACKETS_2026[i].rate + MEDICARE_LEVY;
    }
  }
  return MEDICARE_LEVY;
}

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

function ResultCard({
  label,
  value,
  subtext,
  positive,
}: {
  label: string;
  value: string;
  subtext?: string;
  positive?: boolean | null;
}) {
  const colorClass =
    positive === true
      ? "text-green-800"
      : positive === false
        ? "text-red-800"
        : "text-blue-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function InvestmentPropertyCashFlowCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: 650000,
    depositPercent: 20,
    interestRate: 6.5,
    loanTerm: 30,
    repaymentType: "pi",
    weeklyRent: 550,
    vacancyRate: 3,
    councilRates: 2000,
    strataFees: 0,
    insurance: 1500,
    managementFeePercent: 7,
    maintenanceEstimate: 2000,
    waterRates: 800,
    landTax: 0,
    otherExpenses: 0,
    showNegativeGearing: false,
    taxableIncome: 90000,
  });

  const update = (partial: Partial<Inputs>) =>
    setInputs((prev) => ({ ...prev, ...partial }));

  const results = useMemo(() => {
    const deposit = inputs.purchasePrice * (inputs.depositPercent / 100);
    const loanAmount = inputs.purchasePrice - deposit;
    const periodicRate = inputs.interestRate / 100 / 12;
    const totalPayments = inputs.loanTerm * 12;

    // Mortgage repayment
    let monthlyRepayment: number;
    if (inputs.repaymentType === "io" || periodicRate === 0) {
      monthlyRepayment =
        inputs.repaymentType === "io"
          ? loanAmount * periodicRate
          : loanAmount / totalPayments;
    } else {
      monthlyRepayment =
        (loanAmount *
          (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
        (Math.pow(1 + periodicRate, totalPayments) - 1);
    }
    const annualMortgage = monthlyRepayment * 12;
    const annualInterest =
      inputs.repaymentType === "io"
        ? annualMortgage
        : loanAmount * (inputs.interestRate / 100);

    // Income (adjusted for vacancy)
    const grossAnnualRent = inputs.weeklyRent * 52;
    const vacancyLoss = grossAnnualRent * (inputs.vacancyRate / 100);
    const effectiveAnnualRent = grossAnnualRent - vacancyLoss;

    // Expenses (excluding mortgage)
    const managementFee = effectiveAnnualRent * (inputs.managementFeePercent / 100);
    const totalAnnualExpensesExMortgage =
      inputs.councilRates +
      inputs.strataFees +
      inputs.insurance +
      managementFee +
      inputs.maintenanceEstimate +
      inputs.waterRates +
      inputs.landTax +
      inputs.otherExpenses;

    const totalAnnualExpenses = totalAnnualExpensesExMortgage + annualMortgage;
    const annualCashFlow = effectiveAnnualRent - totalAnnualExpenses;
    const monthlyCashFlow = annualCashFlow / 12;
    const weeklyCashFlow = annualCashFlow / 52;

    // Yields
    const grossYield =
      inputs.purchasePrice > 0
        ? (grossAnnualRent / inputs.purchasePrice) * 100
        : 0;
    const netYield =
      inputs.purchasePrice > 0
        ? ((effectiveAnnualRent - totalAnnualExpensesExMortgage) /
            inputs.purchasePrice) *
          100
        : 0;
    const cashOnCashReturn =
      deposit > 0 ? (annualCashFlow / deposit) * 100 : 0;

    // Break-even rent (weekly)
    const breakEvenAnnual =
      totalAnnualExpensesExMortgage + annualMortgage + vacancyLoss;
    const vacancyMultiplier = 1 - inputs.vacancyRate / 100;
    const breakEvenWeeklyRent =
      vacancyMultiplier > 0
        ? breakEvenAnnual / (52 * vacancyMultiplier)
        : 0;

    // Negative gearing calculation
    const deductibleExpenses =
      annualInterest + totalAnnualExpensesExMortgage;
    const rentalLoss = effectiveAnnualRent - deductibleExpenses;
    const marginalRate = getMarginalRate(inputs.taxableIncome);

    const taxWithoutProperty =
      calculateTax(inputs.taxableIncome) +
      inputs.taxableIncome * MEDICARE_LEVY;
    const adjustedIncome = inputs.taxableIncome + rentalLoss;
    const taxWithProperty =
      calculateTax(Math.max(0, adjustedIncome)) +
      Math.max(0, adjustedIncome) * MEDICARE_LEVY;
    const taxSaving = Math.max(0, taxWithoutProperty - taxWithProperty);
    const afterTaxCashFlow = annualCashFlow + taxSaving;

    return {
      deposit,
      loanAmount,
      monthlyRepayment,
      annualMortgage,
      annualInterest,
      grossAnnualRent,
      vacancyLoss,
      effectiveAnnualRent,
      managementFee,
      totalAnnualExpensesExMortgage,
      totalAnnualExpenses,
      annualCashFlow,
      monthlyCashFlow,
      weeklyCashFlow,
      grossYield,
      netYield,
      cashOnCashReturn,
      breakEvenWeeklyRent,
      rentalLoss,
      marginalRate,
      taxSaving,
      afterTaxCashFlow,
    };
  }, [inputs]);

  const isPositive = results.annualCashFlow >= 0;
  const isAfterTaxPositive = results.afterTaxCashFlow >= 0;

  return (
    <div className="space-y-8">
      {/* Purchase & Loan */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Purchase & Loan Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price: {formatCurrency(inputs.purchasePrice)}
            </label>
            <input
              type="range"
              value={inputs.purchasePrice}
              onChange={(e) =>
                update({ purchasePrice: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              min={100000}
              max={3000000}
              step={10000}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$100k</span>
              <span>$3M</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deposit: {inputs.depositPercent}% (
              {formatCurrency(results.deposit)})
            </label>
            <input
              type="range"
              value={inputs.depositPercent}
              onChange={(e) =>
                update({ depositPercent: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              min={5}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <p className="text-sm text-blue-800">
            Loan amount: <strong>{formatCurrency(results.loanAmount)}</strong>
            <span className="text-blue-600 ml-1">
              ({formatCurrency(inputs.purchasePrice)} &minus;{" "}
              {formatCurrency(results.deposit)} deposit)
            </span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate: {inputs.interestRate.toFixed(2)}%
            <span className="font-normal text-gray-400 ml-1">
              (AU avg ~6.5%)
            </span>
          </label>
          <input
            type="range"
            value={inputs.interestRate}
            onChange={(e) => update({ interestRate: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            min={1}
            max={12}
            step={0.05}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span>
            <span>12%</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (years)
            </label>
            <select
              value={inputs.loanTerm}
              onChange={(e) => update({ loanTerm: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {[5, 10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>
                  {y} years
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repayment Type
            </label>
            <div className="flex gap-2">
              {(
                [
                  ["pi", "Principal & Interest"],
                  ["io", "Interest Only"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => update({ repaymentType: value })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    inputs.repaymentType === value
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

      {/* Rental Income */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Rental Income</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Rent: {formatCurrency(inputs.weeklyRent)}
            </label>
            <input
              type="range"
              value={inputs.weeklyRent}
              onChange={(e) => update({ weeklyRent: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              min={100}
              max={3000}
              step={10}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$100/wk</span>
              <span>$3,000/wk</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vacancy Rate: {inputs.vacancyRate}%
              <span className="font-normal text-gray-400 ml-1">
                (~{((inputs.vacancyRate / 100) * 52).toFixed(1)} wks/yr)
              </span>
            </label>
            <input
              type="range"
              value={inputs.vacancyRate}
              onChange={(e) => update({ vacancyRate: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              min={0}
              max={15}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>15%</span>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <p className="text-sm text-green-800">
            Effective annual rent:{" "}
            <strong>{formatCurrency(results.effectiveAnnualRent)}</strong>
            <span className="text-green-600 ml-1">
              ({formatCurrency(results.grossAnnualRent)} gross &minus;{" "}
              {formatCurrency(results.vacancyLoss)} vacancy)
            </span>
          </p>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Annual Property Expenses
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Council Rates ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={inputs.councilRates}
                onChange={(e) =>
                  update({ councilRates: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strata / Body Corp ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={inputs.strataFees}
                onChange={(e) =>
                  update({ strataFees: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={inputs.insurance}
                onChange={(e) =>
                  update({ insurance: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Management Fee (%)
            </label>
            <input
              type="number"
              min={0}
              max={20}
              step={0.5}
              value={inputs.managementFeePercent}
              onChange={(e) =>
                update({
                  managementFeePercent: Math.max(0, Number(e.target.value)),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              = {formatCurrency(results.managementFee)} per year
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance Estimate ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={inputs.maintenanceEstimate}
                onChange={(e) =>
                  update({
                    maintenanceEstimate: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Water Rates ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={inputs.waterRates}
                onChange={(e) =>
                  update({ waterRates: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Land Tax ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={inputs.landTax}
                onChange={(e) =>
                  update({ landTax: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Annual Expenses ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={inputs.otherExpenses}
                onChange={(e) =>
                  update({
                    otherExpenses: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results: Cash Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <ResultCard
          label="Weekly Cash Flow"
          value={`${results.weeklyCashFlow >= 0 ? "" : "-"}${formatCurrencyExact(Math.abs(results.weeklyCashFlow))}`}
          positive={isPositive}
        />
        <ResultCard
          label="Monthly Cash Flow"
          value={`${results.monthlyCashFlow >= 0 ? "" : "-"}${formatCurrencyExact(Math.abs(results.monthlyCashFlow))}`}
          positive={isPositive}
        />
        <ResultCard
          label="Annual Cash Flow"
          value={`${results.annualCashFlow >= 0 ? "" : "-"}${formatCurrency(Math.abs(results.annualCashFlow))}`}
          subtext={isPositive ? "Positive Cash Flow" : "Negative Cash Flow"}
          positive={isPositive}
        />
      </div>

      {/* Results: Yields & Returns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard
          label="Gross Yield"
          value={`${results.grossYield.toFixed(2)}%`}
          subtext="Rent / Purchase Price"
        />
        <ResultCard
          label="Net Yield"
          value={`${results.netYield.toFixed(2)}%`}
          subtext="After expenses (ex. mortgage)"
        />
        <ResultCard
          label="Cash-on-Cash Return"
          value={`${results.cashOnCashReturn.toFixed(2)}%`}
          subtext="Cash Flow / Deposit"
          positive={results.cashOnCashReturn >= 0}
        />
        <ResultCard
          label="Break-Even Rent"
          value={`${formatCurrency(Math.ceil(results.breakEvenWeeklyRent))}/wk`}
          subtext="Minimum to cover costs"
        />
      </div>

      {/* Income & Expense Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Income & Expense Breakdown (Annual)
        </h3>
        <div className="space-y-1 text-sm">
          <div className="font-medium text-gray-700 pt-2 pb-1">Income</div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">
              Gross Rental Income ({formatCurrency(inputs.weeklyRent)}/wk)
            </span>
            <span className="font-medium text-green-700">
              {formatCurrency(results.grossAnnualRent)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">
              Less Vacancy ({inputs.vacancyRate}%)
            </span>
            <span className="font-medium text-red-700">
              -{formatCurrency(results.vacancyLoss)}
            </span>
          </div>
          <div className="flex justify-between py-1 border-t border-gray-100 font-semibold">
            <span className="text-gray-800">Effective Rental Income</span>
            <span className="text-green-700">
              {formatCurrency(results.effectiveAnnualRent)}
            </span>
          </div>

          <div className="font-medium text-gray-700 pt-4 pb-1">Expenses</div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">
              Mortgage (
              {inputs.repaymentType === "pi" ? "P&I" : "Interest Only"})
            </span>
            <span className="font-medium text-red-700">
              {formatCurrency(results.annualMortgage)}
            </span>
          </div>
          {inputs.councilRates > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Council Rates</span>
              <span className="font-medium text-red-700">
                {formatCurrency(inputs.councilRates)}
              </span>
            </div>
          )}
          {inputs.waterRates > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Water Rates</span>
              <span className="font-medium text-red-700">
                {formatCurrency(inputs.waterRates)}
              </span>
            </div>
          )}
          {inputs.insurance > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Insurance</span>
              <span className="font-medium text-red-700">
                {formatCurrency(inputs.insurance)}
              </span>
            </div>
          )}
          {inputs.strataFees > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Strata / Body Corp</span>
              <span className="font-medium text-red-700">
                {formatCurrency(inputs.strataFees)}
              </span>
            </div>
          )}
          {inputs.maintenanceEstimate > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Maintenance</span>
              <span className="font-medium text-red-700">
                {formatCurrency(inputs.maintenanceEstimate)}
              </span>
            </div>
          )}
          {inputs.managementFeePercent > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">
                Management Fee ({inputs.managementFeePercent}%)
              </span>
              <span className="font-medium text-red-700">
                {formatCurrency(results.managementFee)}
              </span>
            </div>
          )}
          {inputs.landTax > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Land Tax</span>
              <span className="font-medium text-red-700">
                {formatCurrency(inputs.landTax)}
              </span>
            </div>
          )}
          {inputs.otherExpenses > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Other Expenses</span>
              <span className="font-medium text-red-700">
                {formatCurrency(inputs.otherExpenses)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1 border-t border-gray-100 font-semibold">
            <span className="text-gray-800">Total Expenses</span>
            <span className="text-red-700">
              {formatCurrency(results.totalAnnualExpenses)}
            </span>
          </div>

          <div
            className={`flex justify-between py-2 border-t-2 border-gray-300 font-bold text-base ${isPositive ? "text-green-800" : "text-red-800"}`}
          >
            <span>Annual Cash Flow (Pre-Tax)</span>
            <span>
              {results.annualCashFlow >= 0 ? "" : "-"}
              {formatCurrency(Math.abs(results.annualCashFlow))}
            </span>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Bar */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Income vs Expenses
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Annual Income</span>
              <span className="font-medium text-green-700">
                {formatCurrency(results.effectiveAnnualRent)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, results.effectiveAnnualRent > 0 ? (results.effectiveAnnualRent / Math.max(results.effectiveAnnualRent, results.totalAnnualExpenses)) * 100 : 0)}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Annual Expenses</span>
              <span className="font-medium text-red-700">
                {formatCurrency(results.totalAnnualExpenses)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, results.totalAnnualExpenses > 0 ? (results.totalAnnualExpenses / Math.max(results.effectiveAnnualRent, results.totalAnnualExpenses)) * 100 : 0)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Negative Gearing Toggle */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Negative Gearing Tax Benefit
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              See how a rental loss offsets your taxable income using 2025-26
              ATO tax brackets
            </p>
          </div>
          <button
            onClick={() =>
              update({ showNegativeGearing: !inputs.showNegativeGearing })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              inputs.showNegativeGearing ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                inputs.showNegativeGearing ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {inputs.showNegativeGearing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Taxable Income (excl. property):{" "}
                {formatCurrency(inputs.taxableIncome)}
              </label>
              <input
                type="range"
                value={inputs.taxableIncome}
                onChange={(e) =>
                  update({ taxableIncome: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                min={18200}
                max={300000}
                step={1000}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$18,200</span>
                <span>$300,000</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Marginal Tax Rate (inc. Medicare)</span>
                <span className="font-medium text-gray-900">
                  {(results.marginalRate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Rental{" "}
                  {results.rentalLoss < 0 ? "Loss" : "Profit"} (for tax)
                </span>
                <span
                  className={`font-medium ${results.rentalLoss < 0 ? "text-red-700" : "text-green-700"}`}
                >
                  {results.rentalLoss >= 0 ? "" : "-"}
                  {formatCurrency(Math.abs(results.rentalLoss))}
                </span>
              </div>
              {results.taxSaving > 0 && (
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-600 font-medium">
                    Tax Saving (Negative Gearing)
                  </span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(results.taxSaving)}
                  </span>
                </div>
              )}
              <div
                className={`flex justify-between border-t-2 border-gray-300 pt-2 font-bold ${isAfterTaxPositive ? "text-green-800" : "text-red-800"}`}
              >
                <span>After-Tax Cash Flow</span>
                <span>
                  {results.afterTaxCashFlow >= 0 ? "" : "-"}
                  {formatCurrency(Math.abs(results.afterTaxCashFlow))}
                  /yr
                </span>
              </div>
              <p className="text-xs text-gray-500">
                = {formatCurrencyExact(Math.abs(results.afterTaxCashFlow / 52))}
                /week after tax benefit
              </p>
            </div>

            {/* Tax Bracket Reference */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                      Taxable Income
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">
                      Tax Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AU_TAX_BRACKETS_2026.map((bracket, i) => {
                    const isActive =
                      inputs.taxableIncome >= bracket.min &&
                      (bracket.max === Infinity ||
                        inputs.taxableIncome <= bracket.max);
                    return (
                      <tr
                        key={i}
                        className={
                          isActive
                            ? "bg-blue-50 font-medium"
                            : "hover:bg-gray-50"
                        }
                      >
                        <td className="px-3 py-2 text-gray-800">
                          {formatCurrency(bracket.min)} &ndash;{" "}
                          {bracket.max === Infinity
                            ? "+"
                            : formatCurrency(bracket.max)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {(bracket.rate * 100).toFixed(0)}%
                          {bracket.rate > 0 && " + 2% Medicare"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Educational Content */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-amber-900">
          Understanding Positive vs Negative Gearing
        </h3>
        <div className="text-sm text-amber-800 leading-relaxed space-y-3">
          <p>
            <strong>Positive gearing</strong> means your rental income exceeds
            all property expenses, generating a surplus. The property is
            self-sustaining and puts cash in your pocket. Positively geared
            properties are more common in regional areas or lower-priced markets
            with higher rental yields.
          </p>
          <p>
            <strong>Negative gearing</strong> occurs when property expenses
            exceed rental income. While this creates a cash flow shortfall, the
            rental loss can be offset against your other taxable income under
            Australian tax law, reducing your overall tax bill. Many Australian
            investors accept negative gearing in exchange for expected capital
            growth over time.
          </p>
          <p>
            <strong>Depreciation benefits:</strong> In addition to cash
            expenses, investment property owners can claim depreciation
            deductions for the building structure (Division 43 — 2.5% per year
            for properties built after 1985) and plant &amp; equipment items
            (Division 40 — e.g., carpet, blinds, appliances). These are
            non-cash deductions that further reduce taxable income without any
            actual cash outlay. A depreciation schedule from a qualified
            quantity surveyor typically costs $600–$800 and can unlock thousands
            in annual deductions.
          </p>
          <p>
            For independent guidance on property investment, visit{" "}
            <a
              href="https://moneysmart.gov.au/property-investment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-900 underline font-medium hover:text-amber-700"
            >
              ASIC MoneySmart — Property Investment
            </a>
            .
          </p>
        </div>
      </div>

      {/* AU Tax Considerations */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          Australian Tax Considerations for Property Investors
        </h3>
        <ul className="text-sm text-blue-800 leading-relaxed space-y-2 list-disc pl-5">
          <li>
            <strong>Interest deductions:</strong> Interest on your investment
            loan is tax-deductible against rental income. If you refinance,
            only the portion used for the investment property remains
            deductible.
          </li>
          <li>
            <strong>Capital gains tax (CGT):</strong> When you sell, any profit
            is subject to CGT. If held for over 12 months, you receive a 50%
            CGT discount. Your gain is added to your taxable income and taxed
            at your marginal rate.
          </li>
          <li>
            <strong>Land tax:</strong> Varies by state and is calculated on the
            unimproved land value. Each state has different thresholds and rates.
            Use our{" "}
            <Link
              href="/calculators/land-tax"
              className="underline hover:text-blue-900"
            >
              Land Tax Calculator
            </Link>{" "}
            for specific amounts.
          </li>
          <li>
            <strong>Record keeping:</strong> The ATO requires you to keep
            records of all income and expenses for 5 years. Use a dedicated
            bank account for your investment property to simplify tracking.
          </li>
        </ul>
      </div>

      {/* Related Calculators */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Related Calculators
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/rental-yield"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">📊</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                Rental Yield Calculator
              </p>
              <p className="text-xs text-gray-500">
                Compare gross and net rental yields
              </p>
            </div>
          </Link>
          <Link
            href="/calculators/negative-gearing"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">🏘️</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                Negative Gearing Calculator
              </p>
              <p className="text-xs text-gray-500">
                Tax benefit of negatively geared property
              </p>
            </div>
          </Link>
          <Link
            href="/calculators/depreciation"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">📉</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                Depreciation Estimator
              </p>
              <p className="text-xs text-gray-500">
                Division 43 &amp; 40 deductions
              </p>
            </div>
          </Link>
          <Link
            href="/calculators/stamp-duty"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">📋</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                Stamp Duty Calculator
              </p>
              <p className="text-xs text-gray-500">
                Transfer duty for all states
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
