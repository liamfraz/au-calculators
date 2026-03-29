"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// FY2025-26 Australian tax brackets (resident)
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.3, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 },
];

const MEDICARE_LEVY_RATE = 0.02;

interface Inputs {
  purchasePrice: number;
  weeklyRent: number;
  mortgageAmount: number;
  interestRate: number;
  councilRates: number;
  insurance: number;
  managementFees: number;
  repairs: number;
  otherExpenses: number;
  depreciation: number;
  marginalTaxRate: "0" | "0.16" | "0.30" | "0.37" | "0.45";
  includesMedicare: boolean;
}

function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate;
    }
  }
  const last = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return last.base + (taxableIncome - last.min + 1) * last.rate;
}

function getMarginalRate(taxableIncome: number): number {
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate;
}

function getSalaryForRate(rate: string): number {
  switch (rate) {
    case "0":
      return 15000;
    case "0.16":
      return 35000;
    case "0.30":
      return 90000;
    case "0.37":
      return 160000;
    case "0.45":
      return 220000;
    default:
      return 90000;
  }
}

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return (
    sign +
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value))
  );
}

function ResultCard({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string;
  value: string;
  subtext?: string;
  highlight?: "green" | "red" | "blue" | "amber";
}) {
  const colorClass =
    highlight === "green"
      ? "text-emerald-700"
      : highlight === "red"
        ? "text-red-600"
        : highlight === "amber"
          ? "text-amber-600"
          : "text-blue-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function NegativeGearingCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    purchasePrice: 700000,
    weeklyRent: 550,
    mortgageAmount: 560000,
    interestRate: 6.2,
    councilRates: 2200,
    insurance: 1800,
    managementFees: 3000,
    repairs: 1500,
    otherExpenses: 500,
    depreciation: 8000,
    marginalTaxRate: "0.30",
    includesMedicare: true,
  });

  const results = useMemo(() => {
    const annualRent = inputs.weeklyRent * 52;
    const annualInterest =
      inputs.mortgageAmount * (inputs.interestRate / 100);
    const totalCashExpenses =
      annualInterest +
      inputs.councilRates +
      inputs.insurance +
      inputs.managementFees +
      inputs.repairs +
      inputs.otherExpenses;
    const totalDeductibleExpenses = totalCashExpenses + inputs.depreciation;
    const netRentalIncome = annualRent - totalDeductibleExpenses;
    const isNegativelyGeared = netRentalIncome < 0;
    const rentalLoss = isNegativelyGeared ? Math.abs(netRentalIncome) : 0;

    const marginalRate = parseFloat(inputs.marginalTaxRate);
    const effectiveRate = inputs.includesMedicare
      ? marginalRate + MEDICARE_LEVY_RATE
      : marginalRate;

    const taxDeduction = rentalLoss * effectiveRate;

    const cashOutOfPocket = totalCashExpenses - annualRent;
    const afterTaxCost = Math.max(0, cashOutOfPocket - taxDeduction);

    const grossYield = (annualRent / inputs.purchasePrice) * 100;
    const breakEvenRent = totalDeductibleExpenses / 52;

    // Compare different tax brackets
    const bracketData = [
      { rate: 0.16, label: "$18,201–$45,000 (16%)", salary: 35000 },
      { rate: 0.3, label: "$45,001–$135,000 (30%)", salary: 90000 },
      { rate: 0.37, label: "$135,001–$190,000 (37%)", salary: 160000 },
      { rate: 0.45, label: "$190,001+ (45%)", salary: 220000 },
    ].map((b) => {
      const eff = b.rate + MEDICARE_LEVY_RATE;
      const deduction = rentalLoss * eff;
      const afterTax = Math.max(0, cashOutOfPocket - deduction);
      return {
        bracket: b.label,
        taxDeduction: Math.round(deduction),
        afterTaxCost: Math.round(afterTax),
        weeklyAfterTaxCost: Math.round(afterTax / 52),
      };
    });

    return {
      annualRent,
      annualInterest: Math.round(annualInterest),
      totalCashExpenses: Math.round(totalCashExpenses),
      totalDeductibleExpenses: Math.round(totalDeductibleExpenses),
      netRentalIncome: Math.round(netRentalIncome),
      isNegativelyGeared,
      rentalLoss: Math.round(rentalLoss),
      taxDeduction: Math.round(taxDeduction),
      cashOutOfPocket: Math.round(cashOutOfPocket),
      afterTaxCost: Math.round(afterTaxCost),
      afterTaxCostWeekly: Math.round(afterTaxCost / 52),
      grossYield: grossYield.toFixed(2),
      breakEvenRent: Math.round(breakEvenRent),
      bracketData,
    };
  }, [inputs]);

  const chartData = useMemo(
    () =>
      results.bracketData.map((b) => ({
        bracket: b.bracket.split(" (")[0],
        "Tax Deduction": b.taxDeduction,
        "After-Tax Cost": b.afterTaxCost,
      })),
    [results.bracketData]
  );

  const cashflowData = useMemo(
    () => [
      { name: "Rental Income", amount: results.annualRent },
      { name: "Interest", amount: -results.annualInterest },
      { name: "Council Rates", amount: -inputs.councilRates },
      { name: "Insurance", amount: -inputs.insurance },
      { name: "Management", amount: -inputs.managementFees },
      { name: "Repairs", amount: -inputs.repairs },
      { name: "Other", amount: -inputs.otherExpenses },
      { name: "Tax Saving", amount: results.taxDeduction },
    ],
    [results, inputs]
  );

  const update = <K extends keyof Inputs>(field: K, value: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Property Details
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Purchase Price ($)
            </label>
            <input
              type="number"
              value={inputs.purchasePrice}
              onChange={(e) => update("purchasePrice", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={10000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Rental Income ($)
            </label>
            <input
              type="number"
              value={inputs.weeklyRent}
              onChange={(e) => update("weeklyRent", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={10}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formatCurrency(inputs.weeklyRent * 52)} per year
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mortgage Amount ($)
            </label>
            <input
              type="number"
              value={inputs.mortgageAmount}
              onChange={(e) => update("mortgageAmount", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={10000}
            />
            <p className="text-xs text-gray-400 mt-1">
              LVR:{" "}
              {inputs.purchasePrice > 0
                ? (
                    (inputs.mortgageAmount / inputs.purchasePrice) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.interestRate}
              onChange={(e) => update("interestRate", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={15}
              step={0.05}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marginal Tax Rate
            </label>
            <select
              value={inputs.marginalTaxRate}
              onChange={(e) =>
                update(
                  "marginalTaxRate",
                  e.target.value as Inputs["marginalTaxRate"]
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="0">0% ($0 – $18,200)</option>
              <option value="0.16">16% ($18,201 – $45,000)</option>
              <option value="0.30">30% ($45,001 – $135,000)</option>
              <option value="0.37">37% ($135,001 – $190,000)</option>
              <option value="0.45">45% ($190,001+)</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includesMedicare}
                onChange={(e) => update("includesMedicare", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Include 2% Medicare Levy
              </span>
            </label>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
          Annual Property Expenses
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Council Rates ($)
            </label>
            <input
              type="number"
              value={inputs.councilRates}
              onChange={(e) => update("councilRates", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landlord Insurance ($)
            </label>
            <input
              type="number"
              value={inputs.insurance}
              onChange={(e) => update("insurance", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Management Fees ($)
            </label>
            <input
              type="number"
              value={inputs.managementFees}
              onChange={(e) => update("managementFees", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={100}
            />
            <p className="text-xs text-gray-400 mt-1">
              Typical: 7-10% of rent (
              {formatCurrency(Math.round(inputs.weeklyRent * 52 * 0.08))})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repairs &amp; Maintenance ($)
            </label>
            <input
              type="number"
              value={inputs.repairs}
              onChange={(e) => update("repairs", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Expenses ($)
            </label>
            <input
              type="number"
              value={inputs.otherExpenses}
              onChange={(e) => update("otherExpenses", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={100}
            />
            <p className="text-xs text-gray-400 mt-1">
              Water, strata, pest, etc.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depreciation Estimate ($)
            </label>
            <input
              type="number"
              value={inputs.depreciation}
              onChange={(e) => update("depreciation", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={500}
            />
            <p className="text-xs text-gray-400 mt-1">
              Get a quantity surveyor report for accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <ResultCard
          label="Annual Rental Income"
          value={formatCurrency(results.annualRent)}
          subtext={`${formatCurrency(inputs.weeklyRent)}/week`}
          highlight="blue"
        />
        <ResultCard
          label="Total Deductible Expenses"
          value={formatCurrency(results.totalDeductibleExpenses)}
          subtext={`Incl. ${formatCurrency(inputs.depreciation)} depreciation`}
          highlight="red"
        />
        <ResultCard
          label={
            results.isNegativelyGeared ? "Net Rental Loss" : "Net Rental Income"
          }
          value={formatCurrency(results.netRentalIncome)}
          subtext={
            results.isNegativelyGeared
              ? "Negatively geared"
              : "Positively geared"
          }
          highlight={results.isNegativelyGeared ? "red" : "green"}
        />
        <ResultCard
          label="Tax Deduction Value"
          value={formatCurrency(results.taxDeduction)}
          subtext={`At ${(parseFloat(inputs.marginalTaxRate) * 100).toFixed(0)}%${inputs.includesMedicare ? " + 2% ML" : ""}`}
          highlight="green"
        />
        <ResultCard
          label="After-Tax Holding Cost"
          value={formatCurrency(results.afterTaxCost)}
          subtext={`${formatCurrency(results.afterTaxCostWeekly)}/week`}
          highlight="amber"
        />
        <ResultCard
          label="Gross Rental Yield"
          value={`${results.grossYield}%`}
          subtext={`Break-even: $${results.breakEvenRent}/wk`}
          highlight="blue"
        />
      </div>

      {/* Gearing Status */}
      <div
        className={`rounded-xl p-6 border ${results.isNegativelyGeared ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}
      >
        <h3
          className={`font-semibold mb-2 ${results.isNegativelyGeared ? "text-amber-800" : "text-emerald-800"}`}
        >
          {results.isNegativelyGeared
            ? "This property is negatively geared"
            : "This property is positively geared"}
        </h3>
        <p
          className={`text-sm ${results.isNegativelyGeared ? "text-amber-700" : "text-emerald-700"}`}
        >
          {results.isNegativelyGeared ? (
            <>
              The property generates a net rental loss of{" "}
              <strong>{formatCurrency(results.rentalLoss)}</strong> per year.
              This loss can be offset against your other income (e.g. salary),
              reducing your taxable income and saving you{" "}
              <strong>{formatCurrency(results.taxDeduction)}</strong> in tax at
              your marginal rate. After the tax benefit, the property costs you{" "}
              <strong>{formatCurrency(results.afterTaxCost)}</strong> per year (
              {formatCurrency(results.afterTaxCostWeekly)}/week) out of pocket
              to hold.
            </>
          ) : (
            <>
              The property generates a net rental income of{" "}
              <strong>{formatCurrency(results.netRentalIncome)}</strong> per
              year. This income is added to your taxable income and taxed at your
              marginal rate. To break even, you would need weekly rent of at
              least <strong>${results.breakEvenRent}</strong>.
            </>
          )}
        </p>
      </div>

      {/* Income vs Expenses Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Annual Cash Flow Breakdown
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cashflowData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 0 ? `$${(v / 1000).toFixed(0)}k` : `-$${(Math.abs(v) / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(
                  value:
                    | number
                    | string
                    | (readonly (number | string)[])
                    | undefined
                ) => [formatCurrency(Number(value)), "Amount"]}
              />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tax Bracket Comparison */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Tax Benefit by Income Bracket (incl. Medicare Levy)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Tax Bracket
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Tax Deduction
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  After-Tax Cost / yr
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  After-Tax Cost / wk
                </th>
              </tr>
            </thead>
            <tbody>
              {results.bracketData.map((b) => (
                <tr
                  key={b.bracket}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-700">{b.bracket}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                    {formatCurrency(b.taxDeduction)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(b.afterTaxCost)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {formatCurrency(b.weeklyAfterTaxCost)}/wk
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.isNegativelyGeared && (
          <p className="text-xs text-gray-400 mt-3">
            Higher income earners receive a greater tax benefit from negative
            gearing because the rental loss is deducted at their marginal rate.
          </p>
        )}
      </div>

      {/* Tax Bracket Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Tax Deduction vs After-Tax Cost by Bracket
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(
                  value:
                    | number
                    | string
                    | (readonly (number | string)[])
                    | undefined
                ) => [formatCurrency(Number(value))]}
              />
              <Legend />
              <Bar
                dataKey="Tax Deduction"
                fill="#059669"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="After-Tax Cost"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">
          Related Calculators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/rental-yield"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Rental Yield Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/property-cashflow"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Property Cash Flow Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Mortgage Repayment Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/cgt-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Capital Gains Tax Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/stamp-duty-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Stamp Duty Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/land-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Land Tax Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
