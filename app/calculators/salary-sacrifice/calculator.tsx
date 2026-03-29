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

// FY2025-26 Australian tax brackets (resident)
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 },
];

const MEDICARE_LEVY_RATE = 0.02;
const SUPER_TAX_RATE = 0.15;
const LOW_INCOME_TAX_OFFSET_MAX = 700;
const LITO_PHASE_OUT_START = 37500;
const LITO_PHASE_OUT_END = 66667;

type SacrificeType = "super" | "car_lease" | "other";

interface Inputs {
  grossSalary: number;
  sacrificeAmount: number;
  sacrificeFrequency: "weekly" | "fortnightly" | "monthly" | "annually";
  sacrificeType: SacrificeType;
  currentAge: number;
  retirementAge: number;
  currentSuperBalance: number;
  superReturnRate: number;
  employerSGRate: number;
}

interface TaxBreakdown {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  lito: number;
  medicareLevy: number;
  totalTax: number;
  netIncome: number;
  superContributionTax: number;
}

interface ComparisonResult {
  without: TaxBreakdown;
  with: TaxBreakdown;
  annualSacrifice: number;
  taxSaving: number;
  takeHomeReduction: number;
  effectiveCostPerDollar: number;
  superBalanceWithout: number;
  superBalanceWith: number;
  superDifference: number;
  yearByYear: YearRow[];
}

interface YearRow {
  age: number;
  year: number;
  balanceWithout: number;
  balanceWith: number;
  difference: number;
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

function calculateLITO(taxableIncome: number): number {
  if (taxableIncome <= LITO_PHASE_OUT_START) return LOW_INCOME_TAX_OFFSET_MAX;
  if (taxableIncome >= LITO_PHASE_OUT_END) return 0;
  const reduction =
    ((taxableIncome - LITO_PHASE_OUT_START) /
      (LITO_PHASE_OUT_END - LITO_PHASE_OUT_START)) *
    LOW_INCOME_TAX_OFFSET_MAX;
  return Math.max(0, LOW_INCOME_TAX_OFFSET_MAX - reduction);
}

function calculateMedicareLevy(taxableIncome: number): number {
  // Simplified: full levy above $26,000 threshold
  if (taxableIncome <= 26000) return 0;
  return taxableIncome * MEDICARE_LEVY_RATE;
}

function calculateTaxBreakdown(grossIncome: number, preTaxDeduction: number): TaxBreakdown {
  const taxableIncome = Math.max(0, grossIncome - preTaxDeduction);
  const incomeTax = calculateIncomeTax(taxableIncome);
  const lito = calculateLITO(taxableIncome);
  const medicareLevy = calculateMedicareLevy(taxableIncome);
  const totalTax = Math.max(0, incomeTax - lito) + medicareLevy;
  const netIncome = taxableIncome - totalTax;
  const superContributionTax = preTaxDeduction * SUPER_TAX_RATE;

  return {
    grossIncome,
    taxableIncome,
    incomeTax: Math.round(incomeTax),
    lito: Math.round(lito),
    medicareLevy: Math.round(medicareLevy),
    totalTax: Math.round(totalTax),
    netIncome: Math.round(netIncome),
    superContributionTax: Math.round(superContributionTax),
  };
}

function getAnnualSacrifice(amount: number, frequency: Inputs["sacrificeFrequency"]): number {
  switch (frequency) {
    case "weekly": return amount * 52;
    case "fortnightly": return amount * 26;
    case "monthly": return amount * 12;
    case "annually": return amount;
  }
}

function getSGRate(financialYear: number, userRate: number): number {
  if (financialYear <= 2025) return Math.max(userRate, 11.5);
  return Math.max(userRate, 12);
}

function calculateComparison(inputs: Inputs): ComparisonResult {
  const annualSacrifice = getAnnualSacrifice(inputs.sacrificeAmount, inputs.sacrificeFrequency);

  const without = calculateTaxBreakdown(inputs.grossSalary, 0);
  const withSacrifice = calculateTaxBreakdown(
    inputs.grossSalary,
    inputs.sacrificeType === "super" ? annualSacrifice : annualSacrifice
  );

  const taxSaving = without.totalTax - withSacrifice.totalTax;
  const takeHomeReduction = without.netIncome - withSacrifice.netIncome;
  const effectiveCostPerDollar = annualSacrifice > 0 ? takeHomeReduction / annualSacrifice : 0;

  // Super projection
  const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const annualReturn = inputs.superReturnRate / 100;
  const currentYear = 2026;

  let balanceWithout = inputs.currentSuperBalance;
  let balanceWith = inputs.currentSuperBalance;
  const rows: YearRow[] = [];

  for (let i = 0; i < years; i++) {
    const fy = currentYear + i;
    const sgRate = getSGRate(fy, inputs.employerSGRate) / 100;
    const employerContrib = inputs.grossSalary * sgRate;

    // Without sacrifice: just employer SG
    const midWithout = balanceWithout + employerContrib / 2;
    balanceWithout = balanceWithout + employerContrib + midWithout * annualReturn;

    // With sacrifice: employer SG + sacrifice amount (net of 15% super tax)
    const sacrificeNet = inputs.sacrificeType === "super"
      ? annualSacrifice * (1 - SUPER_TAX_RATE)
      : 0;
    const midWith = balanceWith + (employerContrib + sacrificeNet) / 2;
    balanceWith = balanceWith + employerContrib + sacrificeNet + midWith * annualReturn;

    rows.push({
      age: inputs.currentAge + i,
      year: fy,
      balanceWithout: Math.round(balanceWithout),
      balanceWith: Math.round(balanceWith),
      difference: Math.round(balanceWith - balanceWithout),
    });
  }

  return {
    without,
    with: withSacrifice,
    annualSacrifice,
    taxSaving,
    takeHomeReduction,
    effectiveCostPerDollar,
    superBalanceWithout: Math.round(balanceWithout),
    superBalanceWith: Math.round(balanceWith),
    superDifference: Math.round(balanceWith - balanceWithout),
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
  highlight,
}: {
  label: string;
  value: string;
  subtext?: string;
  highlight?: "green" | "red" | "blue";
}) {
  const colorClass =
    highlight === "green"
      ? "text-emerald-700"
      : highlight === "red"
        ? "text-red-600"
        : highlight === "blue"
          ? "text-blue-800"
          : "text-blue-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function SalarySacrificeCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    grossSalary: 90000,
    sacrificeAmount: 500,
    sacrificeFrequency: "monthly",
    sacrificeType: "super",
    currentAge: 30,
    retirementAge: 67,
    currentSuperBalance: 50000,
    superReturnRate: 7,
    employerSGRate: 11.5,
  });

  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => calculateComparison(inputs), [inputs]);

  const chartData = useMemo(() => {
    return result.yearByYear.map((row) => ({
      age: row.age,
      without: row.balanceWithout,
      with: row.balanceWith,
    }));
  }, [result]);

  const comparisonBarData = useMemo(() => [
    {
      category: "Annual Tax",
      Without: result.without.totalTax,
      With: result.with.totalTax,
    },
    {
      category: "Take-Home Pay",
      Without: result.without.netIncome,
      With: result.with.netIncome,
    },
  ], [result]);

  const update = <K extends keyof Inputs>(field: K, value: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const concessionalCap = 30000;
  const annualSacrifice = result.annualSacrifice;
  const employerSG = inputs.grossSalary * (inputs.employerSGRate / 100);
  const totalConcessional = annualSacrifice + employerSG;
  const overCap = totalConcessional > concessionalCap;

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gross Annual Salary ($)
            </label>
            <input
              type="number"
              value={inputs.grossSalary}
              onChange={(e) => update("grossSalary", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Sacrifice Amount ($)
            </label>
            <input
              type="number"
              value={inputs.sacrificeAmount}
              onChange={(e) => update("sacrificeAmount", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sacrifice Frequency
            </label>
            <select
              value={inputs.sacrificeFrequency}
              onChange={(e) =>
                update("sacrificeFrequency", e.target.value as Inputs["sacrificeFrequency"])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="weekly">Per Week</option>
              <option value="fortnightly">Per Fortnight</option>
              <option value="monthly">Per Month</option>
              <option value="annually">Per Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sacrifice Type
            </label>
            <select
              value={inputs.sacrificeType}
              onChange={(e) =>
                update("sacrificeType", e.target.value as SacrificeType)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="super">Into Super</option>
              <option value="car_lease">Car Lease (Novated)</option>
              <option value="other">Other (Laptop, etc.)</option>
            </select>
          </div>

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
              value={inputs.currentSuperBalance}
              onChange={(e) => update("currentSuperBalance", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Super Return Rate (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.superReturnRate}
              onChange={(e) => update("superReturnRate", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={20}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employer SG Rate (%)
            </label>
            <input
              type="number"
              value={inputs.employerSGRate}
              onChange={(e) => update("employerSGRate", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={30}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">
              SG rate: 11.5% (2025-26), 12% (2026-27+)
            </p>
          </div>
        </div>
      </div>

      {/* Concessional Cap Warning */}
      {overCap && inputs.sacrificeType === "super" && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <p className="text-sm text-amber-800 font-medium">
            Warning: Your total concessional contributions ({formatCurrency(Math.round(totalConcessional))})
            exceed the $30,000 annual cap. Employer SG ({formatCurrency(Math.round(employerSG))})
            + salary sacrifice ({formatCurrency(Math.round(annualSacrifice))}) ={" "}
            {formatCurrency(Math.round(totalConcessional))}.
            Excess contributions will be taxed at your marginal rate plus an interest charge.
          </p>
        </div>
      )}

      {/* Key Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ResultCard
          label="Annual Tax Saving"
          value={formatCurrency(result.taxSaving)}
          subtext="Income tax + Medicare saved"
          highlight="green"
        />
        <ResultCard
          label="Take-Home Pay Reduction"
          value={formatCurrency(result.takeHomeReduction)}
          subtext="Per year"
          highlight="red"
        />
        <ResultCard
          label="Effective Cost per $1 Sacrificed"
          value={`$${result.effectiveCostPerDollar.toFixed(2)}`}
          subtext="After tax savings"
          highlight="blue"
        />
        <ResultCard
          label="Annual Sacrifice"
          value={formatCurrency(annualSacrifice)}
          subtext={inputs.sacrificeType === "super" ? "Pre-tax into super" : "Pre-tax benefit"}
        />
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Side-by-Side Comparison: FY2025-26
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600"></th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Without Sacrifice
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  With Sacrifice
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700 font-medium">Gross Salary</td>
                <td className="px-4 py-3 text-right">{formatCurrency(result.without.grossIncome)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(result.with.grossIncome)}</td>
                <td className="px-4 py-3 text-right text-gray-400">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700 font-medium">Salary Sacrifice</td>
                <td className="px-4 py-3 text-right">{formatCurrency(0)}</td>
                <td className="px-4 py-3 text-right text-purple-600">
                  -{formatCurrency(annualSacrifice)}
                </td>
                <td className="px-4 py-3 text-right text-purple-600">
                  -{formatCurrency(annualSacrifice)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700 font-medium">Taxable Income</td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(result.without.taxableIncome)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(result.with.taxableIncome)}
                </td>
                <td className="px-4 py-3 text-right text-emerald-600">
                  -{formatCurrency(result.without.taxableIncome - result.with.taxableIncome)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700 font-medium">Income Tax</td>
                <td className="px-4 py-3 text-right text-red-600">
                  {formatCurrency(result.without.incomeTax)}
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  {formatCurrency(result.with.incomeTax)}
                </td>
                <td className="px-4 py-3 text-right text-emerald-600">
                  -{formatCurrency(result.without.incomeTax - result.with.incomeTax)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700 font-medium">
                  LITO (offset)
                </td>
                <td className="px-4 py-3 text-right text-emerald-600">
                  -{formatCurrency(result.without.lito)}
                </td>
                <td className="px-4 py-3 text-right text-emerald-600">
                  -{formatCurrency(result.with.lito)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(result.with.lito - result.without.lito)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700 font-medium">Medicare Levy</td>
                <td className="px-4 py-3 text-right text-red-600">
                  {formatCurrency(result.without.medicareLevy)}
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  {formatCurrency(result.with.medicareLevy)}
                </td>
                <td className="px-4 py-3 text-right text-emerald-600">
                  -{formatCurrency(result.without.medicareLevy - result.with.medicareLevy)}
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-blue-50">
                <td className="px-4 py-3 text-gray-900 font-bold">Total Tax</td>
                <td className="px-4 py-3 text-right font-bold text-red-700">
                  {formatCurrency(result.without.totalTax)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-red-700">
                  {formatCurrency(result.with.totalTax)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-700">
                  -{formatCurrency(result.taxSaving)}
                </td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="px-4 py-3 text-gray-900 font-bold">Take-Home Pay</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-700">
                  {formatCurrency(result.without.netIncome)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-700">
                  {formatCurrency(result.with.netIncome)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-red-600">
                  -{formatCurrency(result.takeHomeReduction)}
                </td>
              </tr>
              {inputs.sacrificeType === "super" && (
                <tr className="border-t border-gray-200 bg-purple-50">
                  <td className="px-4 py-3 text-gray-900 font-bold">
                    Super Contribution Tax (15%)
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(0)}</td>
                  <td className="px-4 py-3 text-right text-purple-700">
                    {formatCurrency(result.with.superContributionTax)}
                  </td>
                  <td className="px-4 py-3 text-right text-purple-700">
                    {formatCurrency(result.with.superContributionTax)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Comparison Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Tax &amp; Take-Home Comparison
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonBarData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
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
              <Legend />
              <Bar dataKey="Without" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="With" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Super Growth Projection (only for super sacrifice type) */}
      {inputs.sacrificeType === "super" && result.yearByYear.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <ResultCard
              label="Super at Retirement (Without)"
              value={formatCurrency(result.superBalanceWithout)}
              subtext="Employer SG only"
            />
            <ResultCard
              label="Super at Retirement (With)"
              value={formatCurrency(result.superBalanceWith)}
              subtext="SG + salary sacrifice"
              highlight="green"
            />
            <ResultCard
              label="Extra Super at Retirement"
              value={formatCurrency(result.superDifference)}
              subtext={`${inputs.retirementAge - inputs.currentAge} years of growth`}
              highlight="green"
            />
          </div>

          {/* Super Growth Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Super Balance Projection: With vs Without Salary Sacrifice
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
                      name === "with"
                        ? "With Salary Sacrifice"
                        : "Without Salary Sacrifice",
                    ]}
                  />
                  <Legend
                    formatter={(value: string) =>
                      value === "with"
                        ? "With Salary Sacrifice"
                        : "Without Salary Sacrifice"
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="without"
                    stroke="#94a3b8"
                    fill="#cbd5e1"
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="with"
                    stroke="#059669"
                    fill="#34d399"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year-by-Year Super Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowTable(!showTable)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-800">
                Year-by-Year Super Projection
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
                      <th className="px-3 py-3 text-left font-medium text-gray-600">
                        FY
                      </th>
                      <th className="px-3 py-3 text-right font-medium text-gray-600">
                        Without Sacrifice
                      </th>
                      <th className="px-3 py-3 text-right font-medium text-gray-600">
                        With Sacrifice
                      </th>
                      <th className="px-3 py-3 text-right font-medium text-gray-600">
                        Difference
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
                        <td className="px-3 py-2 text-gray-500">
                          {row.year}-{String(row.year + 1).slice(2)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(row.balanceWithout)}
                        </td>
                        <td className="px-3 py-2 text-right text-emerald-600 font-medium">
                          {formatCurrency(row.balanceWith)}
                        </td>
                        <td className="px-3 py-2 text-right text-blue-700">
                          +{formatCurrency(row.difference)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Superannuation Calculator</span>
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
            href="/calculators/capital-gains-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Capital Gains Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/negative-gearing"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
