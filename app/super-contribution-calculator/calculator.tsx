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
  { min: 45001, max: 135000, rate: 0.3, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 },
];

const MEDICARE_LEVY_RATE = 0.02;
const SUPER_TAX_RATE = 0.15;
const CONCESSIONAL_CAP = 30000;
const NON_CONCESSIONAL_CAP = 120000;
const CARRY_FORWARD_THRESHOLD = 500000;
const CARRY_FORWARD_YEARS = 5;

interface Inputs {
  currentAge: number;
  retirementAge: number;
  currentSuperBalance: number;
  annualSalary: number;
  employerRate: number;
  voluntaryAmount: number;
  voluntaryFrequency: "weekly" | "fortnightly" | "monthly" | "annually";
  expectedReturnRate: number;
  priorUnusedCap: number;
}

interface ScenarioResult {
  name: string;
  annualVoluntary: number;
  totalConcessional: number;
  overCap: boolean;
  excessAmount: number;
  annualTaxSaving: number;
  projectedBalance: number;
  yearByYear: YearRow[];
}

interface YearRow {
  age: number;
  year: number;
  balance: number;
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

function calculateMedicareLevy(taxableIncome: number): number {
  if (taxableIncome <= 26000) return 0;
  return taxableIncome * MEDICARE_LEVY_RATE;
}

function calculateTotalTax(taxableIncome: number): number {
  const tax = calculateIncomeTax(taxableIncome);
  const medicare = calculateMedicareLevy(taxableIncome);
  return Math.max(0, tax) + medicare;
}

function getSGRate(financialYear: number, userRate: number): number {
  if (financialYear <= 2025) return Math.max(userRate, 11.5);
  return Math.max(userRate, 12);
}

function getAnnualAmount(
  amount: number,
  frequency: Inputs["voluntaryFrequency"]
): number {
  switch (frequency) {
    case "weekly":
      return amount * 52;
    case "fortnightly":
      return amount * 26;
    case "monthly":
      return amount * 12;
    case "annually":
      return amount;
  }
}

function calculateScenario(
  name: string,
  annualVoluntary: number,
  inputs: Inputs
): ScenarioResult {
  const currentYear = 2026;
  const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const annualReturn = inputs.expectedReturnRate / 100;
  const employerSG =
    inputs.annualSalary * (getSGRate(currentYear, inputs.employerRate) / 100);

  const totalConcessional = employerSG + annualVoluntary;
  const effectiveCap =
    CONCESSIONAL_CAP +
    (inputs.currentSuperBalance < CARRY_FORWARD_THRESHOLD
      ? inputs.priorUnusedCap
      : 0);
  const overCap = totalConcessional > effectiveCap;
  const excessAmount = Math.max(0, totalConcessional - effectiveCap);

  // Tax saving: difference between marginal rate and 15% super tax on the voluntary amount
  const taxWithout = calculateTotalTax(inputs.annualSalary);
  const taxWith = calculateTotalTax(inputs.annualSalary - annualVoluntary);
  const superTaxOnVoluntary = annualVoluntary * SUPER_TAX_RATE;
  const annualTaxSaving = taxWithout - taxWith - superTaxOnVoluntary;

  // Project super balance
  let balance = inputs.currentSuperBalance;
  const rows: YearRow[] = [];

  for (let i = 0; i < years; i++) {
    const fy = currentYear + i;
    const sgRate = getSGRate(fy, inputs.employerRate) / 100;
    const employer = inputs.annualSalary * sgRate;
    const voluntaryNet = annualVoluntary * (1 - SUPER_TAX_RATE);
    const employerNet = employer * (1 - SUPER_TAX_RATE);

    const totalContrib = employerNet + voluntaryNet;
    const midBalance = balance + totalContrib / 2;
    balance = balance + totalContrib + midBalance * annualReturn;

    rows.push({
      age: inputs.currentAge + i + 1,
      year: fy,
      balance: Math.round(balance),
    });
  }

  return {
    name,
    annualVoluntary,
    totalConcessional: Math.round(totalConcessional),
    overCap,
    excessAmount: Math.round(excessAmount),
    annualTaxSaving: Math.round(Math.max(0, annualTaxSaving)),
    projectedBalance: Math.round(balance),
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
  highlight?: "green" | "red" | "blue" | "purple";
}) {
  const colorClass =
    highlight === "green"
      ? "text-emerald-700"
      : highlight === "red"
        ? "text-red-600"
        : highlight === "purple"
          ? "text-purple-700"
          : "text-blue-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function SuperContributionCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    currentAge: 30,
    retirementAge: 67,
    currentSuperBalance: 50000,
    annualSalary: 90000,
    employerRate: 11.5,
    voluntaryAmount: 500,
    voluntaryFrequency: "monthly",
    expectedReturnRate: 7,
    priorUnusedCap: 0,
  });

  const [showTable, setShowTable] = useState(false);

  const annualVoluntary = useMemo(
    () => getAnnualAmount(inputs.voluntaryAmount, inputs.voluntaryFrequency),
    [inputs.voluntaryAmount, inputs.voluntaryFrequency]
  );

  const employerSG = useMemo(() => {
    const sgRate = getSGRate(2026, inputs.employerRate) / 100;
    return inputs.annualSalary * sgRate;
  }, [inputs.annualSalary, inputs.employerRate]);

  const maxVoluntaryToCapAnnual = Math.max(
    0,
    CONCESSIONAL_CAP +
      (inputs.currentSuperBalance < CARRY_FORWARD_THRESHOLD
        ? inputs.priorUnusedCap
        : 0) -
      employerSG
  );

  // Build comparison scenarios
  const scenarios = useMemo(() => {
    const sgOnly = calculateScenario("SG Only", 0, inputs);
    const userChoice = calculateScenario(
      "Your Contribution",
      annualVoluntary,
      inputs
    );
    const maxToCap = calculateScenario(
      "Max to Cap",
      maxVoluntaryToCapAnnual,
      inputs
    );
    return [sgOnly, userChoice, maxToCap];
  }, [inputs, annualVoluntary, maxVoluntaryToCapAnnual]);

  const userScenario = scenarios[1];

  const chartData = useMemo(() => {
    const maxLen = Math.max(...scenarios.map((s) => s.yearByYear.length));
    const data = [];
    for (let i = 0; i < maxLen; i++) {
      data.push({
        age: scenarios[0].yearByYear[i]?.age ?? inputs.currentAge + i + 1,
        sgOnly: scenarios[0].yearByYear[i]?.balance ?? 0,
        yours: scenarios[1].yearByYear[i]?.balance ?? 0,
        maxCap: scenarios[2].yearByYear[i]?.balance ?? 0,
      });
    }
    return data;
  }, [scenarios, inputs.currentAge]);

  const barData = useMemo(
    () =>
      scenarios.map((s) => ({
        name: s.name,
        balance: s.projectedBalance,
      })),
    [scenarios]
  );

  const update = <K extends keyof Inputs>(field: K, value: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const totalConcessional = employerSG + annualVoluntary;
  const effectiveCap =
    CONCESSIONAL_CAP +
    (inputs.currentSuperBalance < CARRY_FORWARD_THRESHOLD
      ? inputs.priorUnusedCap
      : 0);
  const capUsedPercent = Math.min(
    100,
    (totalConcessional / effectiveCap) * 100
  );

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              onChange={(e) =>
                update("currentSuperBalance", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salary ($)
            </label>
            <input
              type="number"
              value={inputs.annualSalary}
              onChange={(e) => update("annualSalary", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employer Contribution Rate (%)
            </label>
            <input
              type="number"
              value={inputs.employerRate}
              onChange={(e) => update("employerRate", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={30}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">
              SG rate: 11.5% (2025-26), 12% (2026-27+)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voluntary Contribution ($)
            </label>
            <input
              type="number"
              value={inputs.voluntaryAmount}
              onChange={(e) =>
                update("voluntaryAmount", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              step={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contribution Frequency
            </label>
            <select
              value={inputs.voluntaryFrequency}
              onChange={(e) =>
                update(
                  "voluntaryFrequency",
                  e.target.value as Inputs["voluntaryFrequency"]
                )
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
              Expected Return Rate (% p.a.)
            </label>
            <input
              type="number"
              value={inputs.expectedReturnRate}
              onChange={(e) =>
                update("expectedReturnRate", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={20}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prior Unused Cap (Carry-Forward $)
            </label>
            <input
              type="number"
              value={inputs.priorUnusedCap}
              onChange={(e) =>
                update("priorUnusedCap", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={CONCESSIONAL_CAP * CARRY_FORWARD_YEARS}
              step={1000}
            />
            <p className="text-xs text-gray-400 mt-1">
              Up to 5 years of unused cap if super balance &lt; $500,000
            </p>
          </div>
        </div>
      </div>

      {/* Concessional Cap Gauge */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Concessional Contributions Cap Usage
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Employer SG: {formatCurrency(Math.round(employerSG))}
            </span>
            <span>
              Voluntary: {formatCurrency(Math.round(annualVoluntary))}
            </span>
            <span>
              Cap: {formatCurrency(effectiveCap)}
              {inputs.priorUnusedCap > 0 &&
                inputs.currentSuperBalance < CARRY_FORWARD_THRESHOLD &&
                ` (incl. ${formatCurrency(inputs.priorUnusedCap)} carry-forward)`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, capUsedPercent)}%`,
                backgroundColor:
                  capUsedPercent > 100
                    ? "#dc2626"
                    : capUsedPercent > 90
                      ? "#f59e0b"
                      : "#059669",
              }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              Total: {formatCurrency(Math.round(totalConcessional))} /{" "}
              {formatCurrency(effectiveCap)}
            </span>
            <span
              className={
                totalConcessional > effectiveCap
                  ? "text-red-600 font-medium"
                  : "text-emerald-600 font-medium"
              }
            >
              {totalConcessional > effectiveCap
                ? `${formatCurrency(Math.round(totalConcessional - effectiveCap))} over cap`
                : `${formatCurrency(Math.round(effectiveCap - totalConcessional))} remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Cap Warning */}
      {userScenario.overCap && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <p className="text-sm text-red-800 font-medium">
            Your total concessional contributions (
            {formatCurrency(userScenario.totalConcessional)}) exceed the{" "}
            {formatCurrency(effectiveCap)} cap by{" "}
            {formatCurrency(userScenario.excessAmount)}. Excess contributions
            are taxed at your marginal rate plus an interest charge. Consider
            reducing voluntary contributions or making after-tax
            (non-concessional) contributions instead (cap: {formatCurrency(NON_CONCESSIONAL_CAP)}
            /year).
          </p>
        </div>
      )}

      {/* Key Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ResultCard
          label="Projected Balance"
          value={formatCurrency(userScenario.projectedBalance)}
          subtext={`At age ${inputs.retirementAge}`}
          highlight="blue"
        />
        <ResultCard
          label="Annual Tax Saving"
          value={formatCurrency(userScenario.annualTaxSaving)}
          subtext="From salary sacrifice"
          highlight="green"
        />
        <ResultCard
          label="Extra vs SG Only"
          value={formatCurrency(
            userScenario.projectedBalance - scenarios[0].projectedBalance
          )}
          subtext="Voluntary contributions impact"
          highlight="green"
        />
        <ResultCard
          label="Max-to-Cap Balance"
          value={formatCurrency(scenarios[2].projectedBalance)}
          subtext={`Contributing ${formatCurrency(maxVoluntaryToCapAnnual)}/yr`}
          highlight="purple"
        />
      </div>

      {/* Scenario Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Contribution Scenario Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Scenario
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Voluntary / yr
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Total Concessional
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Tax Saving / yr
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Balance at {inputs.retirementAge}
                </th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr
                  key={s.name}
                  className={`border-b border-gray-100 ${s.name === "Your Contribution" ? "bg-blue-50" : ""}`}
                >
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {s.name}
                    {s.overCap && (
                      <span className="ml-2 text-xs text-red-600">
                        Over cap
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(Math.round(s.annualVoluntary))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(s.totalConcessional)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-600">
                    {formatCurrency(s.annualTaxSaving)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {formatCurrency(s.projectedBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Projected Balance by Scenario
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1000000
                    ? `$${(v / 1000000).toFixed(1)}M`
                    : `$${(v / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(
                  value:
                    | number
                    | string
                    | (readonly (number | string)[])
                    | undefined
                ) => [formatCurrency(Number(value)), "Balance at Retirement"]}
              />
              <Bar dataKey="balance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Super Balance Growth: All Scenarios
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
                  value:
                    | number
                    | string
                    | (readonly (number | string)[])
                    | undefined,
                  name: number | string | undefined
                ) => [
                  formatCurrency(Number(value)),
                  name === "sgOnly"
                    ? "SG Only"
                    : name === "yours"
                      ? "Your Contribution"
                      : "Max to Cap",
                ]}
              />
              <Legend
                formatter={(value: string) =>
                  value === "sgOnly"
                    ? "SG Only"
                    : value === "yours"
                      ? "Your Contribution"
                      : "Max to Cap"
                }
              />
              <Area
                type="monotone"
                dataKey="sgOnly"
                stroke="#94a3b8"
                fill="#cbd5e1"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="yours"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="maxCap"
                stroke="#059669"
                fill="#34d399"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Year-by-Year Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-semibold text-gray-800">
            Year-by-Year Projection
          </h3>
          <span className="text-gray-400 text-xl">
            {showTable ? "\u25B2" : "\u25BC"}
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
                    SG Only
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Your Contribution
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600">
                    Max to Cap
                  </th>
                </tr>
              </thead>
              <tbody>
                {scenarios[0].yearByYear.map((row, i) => (
                  <tr
                    key={row.age}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-gray-800">{row.age}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {row.year}-{String(row.year + 1).slice(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(row.balance)}
                    </td>
                    <td className="px-3 py-2 text-right text-blue-700 font-medium">
                      {formatCurrency(
                        scenarios[1].yearByYear[i]?.balance ?? 0
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-600 font-medium">
                      {formatCurrency(
                        scenarios[2].yearByYear[i]?.balance ?? 0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">
          Related Calculators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Superannuation Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/salary-sacrifice"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Salary Sacrifice Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/tax-withholding-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Income Tax Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/compound-interest"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Compound Interest Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
