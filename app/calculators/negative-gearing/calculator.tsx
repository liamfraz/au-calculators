"use client";
import Link from "next/link";

import { useState, useMemo } from "react";

// --- 2025-26 ATO Tax Brackets (Australian Resident) ---

const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 },
];

const MEDICARE_LEVY = 0.02;

function calculateTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min) {
      if (taxableIncome <= bracket.max) {
        tax = bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate;
        break;
      }
    }
  }

  // Add Medicare levy
  tax += taxableIncome * MEDICARE_LEVY;

  return Math.round(tax);
}

function getMarginalRate(taxableIncome: number): number {
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate;
}

// --- Formatting ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// --- Component ---

export default function NegativeGearingCalculator() {
  const [salary, setSalary] = useState(120000);
  const [rentalIncome, setRentalIncome] = useState(26000);
  const [mortgageInterest, setMortgageInterest] = useState(30000);
  const [councilRates, setCouncilRates] = useState(2000);
  const [insurance, setInsurance] = useState(1500);
  const [maintenance, setMaintenance] = useState(2000);
  const [managementFees, setManagementFees] = useState(1820);
  const [depreciation, setDepreciation] = useState(8000);
  const [strataFees, setStrataFees] = useState(0);
  const [waterRates, setWaterRates] = useState(800);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const results = useMemo(() => {
    const totalPropertyExpenses =
      mortgageInterest +
      councilRates +
      insurance +
      maintenance +
      managementFees +
      depreciation +
      strataFees +
      waterRates +
      otherExpenses;

    // Rental loss (negative = loss, positive = profit)
    const rentalLoss = rentalIncome - totalPropertyExpenses;

    // Tax without property
    const taxWithoutProperty = calculateTax(salary);

    // Taxable income with property (rental loss reduces income)
    const taxableIncomeWithProperty = Math.max(0, salary + rentalLoss);
    const taxWithProperty = calculateTax(taxableIncomeWithProperty);

    // Tax saving
    const taxSaving = taxWithoutProperty - taxWithProperty;

    // Cash out of pocket (depreciation is non-cash, so exclude it)
    const cashExpenses = totalPropertyExpenses - depreciation;
    const cashShortfall = cashExpenses - rentalIncome;

    // After-tax annual cost
    const afterTaxCost = cashShortfall - taxSaving;

    // Marginal rate
    const marginalRate = getMarginalRate(salary);
    const effectiveMarginalWithMedicare = marginalRate + MEDICARE_LEVY;

    return {
      totalPropertyExpenses,
      rentalLoss,
      taxWithoutProperty,
      taxableIncomeWithProperty,
      taxWithProperty,
      taxSaving,
      cashExpenses,
      cashShortfall,
      afterTaxCost,
      marginalRate,
      effectiveMarginalWithMedicare,
    };
  }, [
    salary,
    rentalIncome,
    mortgageInterest,
    councilRates,
    insurance,
    maintenance,
    managementFees,
    depreciation,
    strataFees,
    waterRates,
    otherExpenses,
  ]);

  const inputs: { label: string; value: number; setter: (v: number) => void; id: string }[] = [
    { label: "Annual Taxable Income (Salary)", value: salary, setter: setSalary, id: "salary" },
    { label: "Annual Rental Income", value: rentalIncome, setter: setRentalIncome, id: "rental" },
    { label: "Annual Mortgage Interest", value: mortgageInterest, setter: setMortgageInterest, id: "interest" },
    { label: "Annual Council Rates", value: councilRates, setter: setCouncilRates, id: "council" },
    { label: "Annual Insurance", value: insurance, setter: setInsurance, id: "insurance" },
    { label: "Annual Maintenance / Repairs", value: maintenance, setter: setMaintenance, id: "maintenance" },
    { label: "Annual Management Fees", value: managementFees, setter: setManagementFees, id: "management" },
    { label: "Annual Depreciation", value: depreciation, setter: setDepreciation, id: "depreciation" },
    { label: "Annual Strata Fees", value: strataFees, setter: setStrataFees, id: "strata" },
    { label: "Annual Water Rates", value: waterRates, setter: setWaterRates, id: "water" },
    { label: "Other Deductible Expenses", value: otherExpenses, setter: setOtherExpenses, id: "other" },
  ];

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Income &amp; Expenses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inputs.map((input) => (
            <div key={input.id}>
              <label htmlFor={input.id} className="block text-sm font-medium text-gray-700 mb-1">
                {input.label}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  id={input.id}
                  type="number"
                  min={0}
                  step={500}
                  value={input.value}
                  onChange={(e) => input.setter(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Total Property Expenses</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(results.totalPropertyExpenses)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Rental Loss (Neg. Gearing)</p>
          <p className={`text-2xl font-bold ${results.rentalLoss < 0 ? "text-red-600" : "text-green-600"}`}>
            {formatCurrency(results.rentalLoss)}
          </p>
        </div>
        <div className="border border-green-200 rounded-xl p-5 bg-green-50 text-center">
          <p className="text-sm text-green-700 mb-1">Annual Tax Saving</p>
          <p className="text-2xl font-bold text-green-800">
            {formatCurrency(results.taxSaving)}
          </p>
        </div>
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-blue-700 mb-1">After-Tax Annual Cost</p>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(results.afterTaxCost)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {formatCurrency(Math.round(results.afterTaxCost / 12))}/month
          </p>
        </div>
      </div>

      {/* Income vs Expenses Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Income vs Expenses Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between font-medium text-green-700 border-b border-gray-100 pb-2">
            <span>Rental Income</span>
            <span>{formatCurrency(rentalIncome)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Mortgage Interest</span>
            <span>{formatCurrency(mortgageInterest)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Council Rates</span>
            <span>{formatCurrency(councilRates)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Insurance</span>
            <span>{formatCurrency(insurance)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Maintenance / Repairs</span>
            <span>{formatCurrency(maintenance)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Management Fees</span>
            <span>{formatCurrency(managementFees)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Depreciation (non-cash)</span>
            <span>{formatCurrency(depreciation)}</span>
          </div>
          {strataFees > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Strata Fees</span>
              <span>{formatCurrency(strataFees)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Water Rates</span>
            <span>{formatCurrency(waterRates)}</span>
          </div>
          {otherExpenses > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Other Expenses</span>
              <span>{formatCurrency(otherExpenses)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total Property Expenses</span>
            <span className="text-gray-900">{formatCurrency(results.totalPropertyExpenses)}</span>
          </div>
          <div className={`flex justify-between font-semibold ${results.rentalLoss < 0 ? "text-red-700" : "text-green-700"}`}>
            <span>Net Rental {results.rentalLoss < 0 ? "Loss" : "Income"}</span>
            <span>{formatCurrency(results.rentalLoss)}</span>
          </div>
        </div>
      </div>

      {/* Tax Bracket Comparison */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Tax Comparison — Before &amp; After Property</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700"></th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Without Property</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">With Property</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">Taxable Income</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(salary)}</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(results.taxableIncomeWithProperty)}</td>
                <td className="text-right py-2 pl-4 font-medium text-red-600">
                  {formatCurrency(results.rentalLoss)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">Income Tax + Medicare</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(results.taxWithoutProperty)}</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(results.taxWithProperty)}</td>
                <td className="text-right py-2 pl-4 font-medium text-green-600">
                  -{formatCurrency(results.taxSaving)}
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-gray-600">Marginal Rate (incl. Medicare)</td>
                <td className="text-right py-2 px-4 font-medium" colSpan={2}>
                  {(results.effectiveMarginalWithMedicare * 100).toFixed(0)}%
                </td>
                <td className="text-right py-2 pl-4 text-gray-500 text-xs">
                  ({(results.marginalRate * 100).toFixed(0)}% + 2% Medicare)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Cash Flow Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Cash expenses (excluding depreciation)</span>
            <span className="font-medium">{formatCurrency(results.cashExpenses)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Rental income received</span>
            <span className="font-medium">{formatCurrency(rentalIncome)}</span>
          </div>
          <div className="flex justify-between text-gray-600 border-t border-gray-100 pt-2">
            <span>Cash out of pocket (before tax benefit)</span>
            <span className="font-medium text-red-600">{formatCurrency(results.cashShortfall)}</span>
          </div>
          <div className="flex justify-between text-green-700">
            <span>Tax saving from negative gearing</span>
            <span className="font-medium">-{formatCurrency(results.taxSaving)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
            <span>After-tax annual cost</span>
            <span className="text-blue-800">{formatCurrency(results.afterTaxCost)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs">
            <span>Per week</span>
            <span>{formatCurrency(Math.round(results.afterTaxCost / 52))}/wk</span>
          </div>
        </div>
      </div>

      {/* Tax Brackets Reference */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">2025-26 ATO Tax Brackets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Taxable Income</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Rate</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Tax On This Bracket</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$0 - $18,200</td>
                <td className="text-right py-2 px-4">Nil</td>
                <td className="text-right py-2 pl-4 text-gray-500">$0</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$18,201 - $45,000</td>
                <td className="text-right py-2 px-4">16%</td>
                <td className="text-right py-2 pl-4 text-gray-500">$4,288</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$45,001 - $135,000</td>
                <td className="text-right py-2 px-4">30%</td>
                <td className="text-right py-2 pl-4 text-gray-500">$27,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$135,001 - $190,000</td>
                <td className="text-right py-2 px-4">37%</td>
                <td className="text-right py-2 pl-4 text-gray-500">$20,350</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-gray-600">$190,001+</td>
                <td className="text-right py-2 px-4">45%</td>
                <td className="text-right py-2 pl-4 text-gray-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Plus Medicare levy of 2% on total taxable income. Your marginal rate including Medicare is{" "}
          {(results.effectiveMarginalWithMedicare * 100).toFixed(0)}%.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Disclaimer:</span> This calculator provides estimates only
          based on the 2025-26 ATO tax rates. It does not account for the Medicare Levy Surcharge,
          private health insurance rebate adjustments, HELP debt repayments, or other offsets. Consult
          a registered tax agent for specific tax advice about your investment property.
        </p>
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
            href="/tax-withholding-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Income Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Superannuation Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
