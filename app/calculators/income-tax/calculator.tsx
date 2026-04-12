"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── ATO 2025-26 Tax Brackets ────────────────────────────────

type Bracket = { min: number; max: number; rate: number };

const RESIDENT_BRACKETS: Bracket[] = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18201, max: 45000, rate: 0.16 },
  { min: 45001, max: 135000, rate: 0.30 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

const NON_RESIDENT_BRACKETS: Bracket[] = [
  { min: 0, max: 135000, rate: 0.30 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

const WORKING_HOLIDAY_BRACKETS: Bracket[] = [
  { min: 0, max: 45000, rate: 0.15 },
  { min: 45001, max: 135000, rate: 0.30 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

// 2023-24 brackets (pre Stage 3 cuts) for comparison
const RESIDENT_BRACKETS_PREV: Bracket[] = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18201, max: 45000, rate: 0.19 },
  { min: 45001, max: 120000, rate: 0.325 },
  { min: 120001, max: 180000, rate: 0.37 },
  { min: 180001, max: Infinity, rate: 0.45 },
];

// ─── HELP Repayment Thresholds 2025-26 ───────────────────────

const HELP_THRESHOLDS = [
  { max: 54434, rate: 0 },
  { max: 62850, rate: 0.01 },
  { max: 66620, rate: 0.02 },
  { max: 70618, rate: 0.025 },
  { max: 74855, rate: 0.03 },
  { max: 79346, rate: 0.035 },
  { max: 84107, rate: 0.04 },
  { max: 89154, rate: 0.045 },
  { max: 94503, rate: 0.05 },
  { max: 100174, rate: 0.055 },
  { max: 106185, rate: 0.06 },
  { max: 112556, rate: 0.065 },
  { max: 119309, rate: 0.07 },
  { max: 126467, rate: 0.075 },
  { max: 134056, rate: 0.08 },
  { max: 142100, rate: 0.085 },
  { max: 150626, rate: 0.09 },
  { max: 159663, rate: 0.095 },
  { max: Infinity, rate: 0.10 },
];

// ─── Medicare Levy Surcharge thresholds (singles) ────────────

const MLS_TIERS = [
  { max: 93000, rate: 0 },
  { max: 108000, rate: 0.01 },
  { max: 144000, rate: 0.0125 },
  { max: Infinity, rate: 0.015 },
];

// ─── Calculation Functions ───────────────────────────────────

function getBrackets(residency: string): Bracket[] {
  if (residency === "non-resident") return NON_RESIDENT_BRACKETS;
  if (residency === "working-holiday") return WORKING_HOLIDAY_BRACKETS;
  return RESIDENT_BRACKETS;
}

function calcBracketBreakdown(income: number, brackets: Bracket[]) {
  const breakdown: { label: string; rate: number; taxableAmount: number; tax: number }[] = [];
  let totalTax = 0;

  for (const b of brackets) {
    const lower = b.min === 0 ? 0 : b.min - 1;
    const upper = b.max === Infinity ? income : Math.min(income, b.max);
    const taxableAmount = Math.max(0, upper - lower);
    const tax = taxableAmount * b.rate;
    totalTax += tax;

    const label =
      b.max === Infinity
        ? `$${(b.min).toLocaleString()}+`
        : `$${b.min === 0 ? "0" : b.min.toLocaleString()} \u2013 $${b.max.toLocaleString()}`;

    breakdown.push({ label, rate: b.rate, taxableAmount, tax });

    if (income <= b.max) break;
  }

  return { breakdown, totalTax };
}

function calcTax(income: number, brackets: Bracket[]): number {
  if (income <= 0) return 0;
  return calcBracketBreakdown(income, brackets).totalTax;
}

function calcLITO(income: number, residency: string): number {
  if (residency !== "resident") return 0;
  if (income <= 37500) return 700;
  if (income <= 45000) return 700 - (income - 37500) * 0.05;
  if (income <= 66667) return 325 - (income - 45000) * 0.015;
  return 0;
}

function calcSAPTO(income: number, enabled: boolean): number {
  if (!enabled) return 0;
  if (income <= 32279) return 2230;
  const reduction = (income - 32279) * 0.125;
  return Math.max(0, 2230 - reduction);
}

function calcMedicare(income: number, residency: string): number {
  if (residency !== "resident") return 0;
  if (income <= 24276) return 0;
  if (income <= 30345) return (income - 24276) * 0.1;
  return income * 0.02;
}

function calcMLS(income: number, residency: string, hasPHI: boolean): number {
  if (residency !== "resident") return 0;
  if (hasPHI) return 0;
  for (const tier of MLS_TIERS) {
    if (income <= tier.max) return Math.round(income * tier.rate);
  }
  return 0;
}

function calcHELP(income: number, hasDebt: boolean): number {
  if (!hasDebt) return 0;
  for (const t of HELP_THRESHOLDS) {
    if (income <= t.max) return Math.round(income * t.rate);
  }
  return 0;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtExact(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// ─── Component ───────────────────────────────────────────────

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(90000);
  const [residency, setResidency] = useState("resident");
  const [hasHELP, setHasHELP] = useState(false);
  const [hasPHI, setHasPHI] = useState(true);
  const [claimLITO, setClaimLITO] = useState(true);
  const [claimSAPTO, setClaimSAPTO] = useState(false);

  const r = useMemo(() => {
    const gross = Math.max(0, income);
    const brackets = getBrackets(residency);
    const { breakdown, totalTax: grossTax } = calcBracketBreakdown(gross, brackets);

    const lito = claimLITO ? calcLITO(gross, residency) : 0;
    const sapto = calcSAPTO(gross, claimSAPTO && residency === "resident");
    const totalOffsets = lito + sapto;
    const incomeTax = Math.max(0, grossTax - totalOffsets);

    const medicare = calcMedicare(gross, residency);
    const mls = calcMLS(gross, residency, hasPHI);
    const help = calcHELP(gross, hasHELP);
    const superAmount = Math.round(gross * 0.115);

    const totalTax = incomeTax + medicare + mls + help;
    const netAnnual = gross - totalTax;
    const netMonthly = netAnnual / 12;
    const netFortnightly = netAnnual / 26;
    const effectiveRate = gross > 0 ? totalTax / gross : 0;

    // Previous year comparison (2023-24 pre Stage 3)
    const prevBrackets = residency === "resident" ? RESIDENT_BRACKETS_PREV : brackets;
    const prevGrossTax = calcTax(gross, prevBrackets);
    const prevLito = residency === "resident" ? calcLITO(gross, "resident") : 0;
    const prevIncomeTax = Math.max(0, prevGrossTax - prevLito);
    const prevMedicare = calcMedicare(gross, residency);
    const prevTotal = prevIncomeTax + prevMedicare;
    const taxCutAmount = prevTotal - (incomeTax + medicare);

    return {
      gross,
      grossTax,
      lito,
      sapto,
      totalOffsets,
      incomeTax,
      medicare,
      mls,
      help,
      superAmount,
      totalTax,
      netAnnual,
      netMonthly,
      netFortnightly,
      effectiveRate,
      breakdown,
      brackets,
      prevIncomeTax,
      prevMedicare,
      prevTotal,
      taxCutAmount,
    };
  }, [income, residency, hasHELP, hasPHI, claimLITO, claimSAPTO]);

  const isResident = residency === "resident";
  const activeBtn = "bg-blue-600 text-white border-blue-600";
  const inactiveBtn = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

  // Chart data
  const chartData = [
    { name: "Take-Home", value: Math.max(0, r.netAnnual), fill: "#22c55e" },
    { name: "Income Tax", value: r.incomeTax, fill: "#3b82f6" },
    { name: "Medicare", value: r.medicare + r.mls, fill: "#f59e0b" },
    ...(hasHELP && r.help > 0 ? [{ name: "HELP", value: r.help, fill: "#a855f7" }] : []),
    { name: "Super (employer)", value: r.superAmount, fill: "#6b7280" },
  ];

  // Comparison chart
  const comparisonData =
    isResident && r.gross > 0
      ? [
          {
            name: "2023-24 (pre Stage 3)",
            incomeTax: r.prevIncomeTax,
            medicare: r.prevMedicare,
            net: r.gross - r.prevTotal,
          },
          {
            name: "2025-26 (current)",
            incomeTax: r.incomeTax,
            medicare: r.medicare + r.mls,
            net: r.gross - (r.incomeTax + r.medicare + r.mls),
          },
        ]
      : [];

  return (
    <div className="space-y-6">
      {/* ─── Inputs ─── */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Your Income Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gross Annual Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              value={income || ""}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={0}
              step={1000}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Residency Status
          </label>
          <div className="flex gap-2">
            {(
              [
                ["resident", "Australian Resident"],
                ["non-resident", "Non-Resident"],
                ["working-holiday", "Working Holiday"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setResidency(val)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${residency === val ? activeBtn : inactiveBtn}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HELP / HECS-HELP Debt
            </label>
            <div className="flex gap-2">
              {([false, true] as const).map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setHasHELP(val)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${hasHELP === val ? activeBtn : inactiveBtn}`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Private Health Insurance
            </label>
            <div className="flex gap-2">
              {([true, false] as const).map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setHasPHI(val)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${hasPHI === val ? activeBtn : inactiveBtn}`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isResident && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Offsets
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={claimLITO}
                  onChange={(e) => setClaimLITO(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Low Income Tax Offset (LITO)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={claimSAPTO}
                  onChange={(e) => setClaimSAPTO(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Seniors &amp; Pensioners (SAPTO)
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ─── Hero Result Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-green-600 text-white rounded-xl p-4 text-center col-span-2">
          <p className="text-xs text-green-100 mb-1">Net Take-Home Pay</p>
          <p className="text-2xl font-bold">{fmt(r.netAnnual)}</p>
          <p className="text-xs text-green-200 mt-1">
            {fmtExact(r.netMonthly)}/mo &middot; {fmtExact(r.netFortnightly)}/fn
          </p>
        </div>
        <div className="bg-blue-600 text-white rounded-xl p-4 text-center col-span-2">
          <p className="text-xs text-blue-100 mb-1">Total Tax</p>
          <p className="text-2xl font-bold">{fmt(r.totalTax)}</p>
          <p className="text-xs text-blue-200 mt-1">
            Effective rate: {(r.effectiveRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* ─── Detailed Summary Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Income Tax</p>
          <p className="text-xl font-bold text-gray-900">{fmt(r.incomeTax)}</p>
          {r.totalOffsets > 0 && (
            <p className="text-xs text-green-600 mt-1">
              incl. {fmt(Math.round(r.totalOffsets))} offsets
            </p>
          )}
        </div>
        <div className="border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Medicare Levy</p>
          <p className="text-xl font-bold text-gray-900">{fmt(r.medicare)}</p>
          <p className="text-xs text-gray-400 mt-1">2% of taxable income</p>
        </div>
        {r.mls > 0 && (
          <div className="border border-orange-200 rounded-xl p-4 text-center bg-orange-50">
            <p className="text-xs text-orange-600 mb-1">Medicare Levy Surcharge</p>
            <p className="text-xl font-bold text-orange-700">{fmt(r.mls)}</p>
            <p className="text-xs text-orange-500 mt-1">No private health insurance</p>
          </div>
        )}
        {hasHELP && (
          <div className="border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">HELP Repayment</p>
            <p className="text-xl font-bold text-purple-600">{fmt(r.help)}</p>
          </div>
        )}
        <div className="border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Super (employer)</p>
          <p className="text-xl font-bold text-gray-600">{fmt(r.superAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">11.5% SG rate</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Net Monthly</p>
          <p className="text-xl font-bold text-green-700">{fmtExact(r.netMonthly)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Net Fortnightly</p>
          <p className="text-xl font-bold text-green-700">{fmtExact(r.netFortnightly)}</p>
        </div>
      </div>

      {/* ─── Income Breakdown Bar ─── */}
      {r.gross > 0 && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Where Your Money Goes
          </h3>
          <div className="flex rounded-lg overflow-hidden h-10 mb-4">
            <div
              style={{ width: `${(Math.max(0, r.netAnnual) / (r.gross + r.superAmount)) * 100}%` }}
              className="bg-green-500 transition-all duration-300"
              title={`Take-Home: ${fmt(r.netAnnual)}`}
            />
            {r.incomeTax > 0 && (
              <div
                style={{ width: `${(r.incomeTax / (r.gross + r.superAmount)) * 100}%` }}
                className="bg-blue-500 transition-all duration-300"
                title={`Income Tax: ${fmt(r.incomeTax)}`}
              />
            )}
            {(r.medicare + r.mls) > 0 && (
              <div
                style={{ width: `${((r.medicare + r.mls) / (r.gross + r.superAmount)) * 100}%` }}
                className="bg-amber-500 transition-all duration-300"
                title={`Medicare: ${fmt(r.medicare + r.mls)}`}
              />
            )}
            {hasHELP && r.help > 0 && (
              <div
                style={{ width: `${(r.help / (r.gross + r.superAmount)) * 100}%` }}
                className="bg-purple-500 transition-all duration-300"
                title={`HELP: ${fmt(r.help)}`}
              />
            )}
            <div
              style={{ width: `${(r.superAmount / (r.gross + r.superAmount)) * 100}%` }}
              className="bg-gray-400 transition-all duration-300"
              title={`Super: ${fmt(r.superAmount)}`}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-500" />
              Take-Home ({((Math.max(0, r.netAnnual) / (r.gross + r.superAmount)) * 100).toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500" />
              Income Tax ({((r.incomeTax / (r.gross + r.superAmount)) * 100).toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              Medicare ({(((r.medicare + r.mls) / (r.gross + r.superAmount)) * 100).toFixed(1)}%)
            </span>
            {hasHELP && r.help > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                HELP ({((r.help / (r.gross + r.superAmount)) * 100).toFixed(1)}%)
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-400" />
              Super ({((r.superAmount / (r.gross + r.superAmount)) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      )}

      {/* ─── Visual Bar Chart ─── */}
      {r.gross > 0 && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Income Breakdown Chart
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => fmt(Number(value))}
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ─── Tax Bracket Breakdown ─── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            Tax Bracket Breakdown &mdash;{" "}
            {residency === "resident"
              ? "Australian Resident"
              : residency === "non-resident"
                ? "Non-Resident"
                : "Working Holiday"}{" "}
            2025&ndash;26
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Bracket
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Rate
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Taxable Amount
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Tax
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {r.breakdown.map((b, i) => (
              <tr key={i} className={b.taxableAmount > 0 && b.rate > 0 ? "bg-blue-50" : ""}>
                <td className="px-4 py-3 text-gray-700">{b.label}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {(b.rate * 100).toFixed(0)}%
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {fmt(b.taxableAmount)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {b.tax > 0 ? fmt(Math.round(b.tax)) : "Nil"}
                </td>
              </tr>
            ))}
            <tr className="bg-blue-100 font-semibold">
              <td className="px-4 py-3 text-gray-900" colSpan={3}>
                Gross Tax (before offsets)
              </td>
              <td className="px-4 py-3 text-right text-blue-700">
                {fmt(Math.round(r.grossTax))}
              </td>
            </tr>
            {r.totalOffsets > 0 && (
              <tr className="bg-green-50">
                <td className="px-4 py-3 text-green-700" colSpan={3}>
                  Less: Tax Offsets (LITO{r.sapto > 0 ? " + SAPTO" : ""})
                </td>
                <td className="px-4 py-3 text-right text-green-700 font-medium">
                  &minus;{fmt(Math.round(r.totalOffsets))}
                </td>
              </tr>
            )}
            <tr className="bg-blue-600 text-white font-semibold">
              <td className="px-4 py-3" colSpan={3}>
                Net Income Tax Payable
              </td>
              <td className="px-4 py-3 text-right">{fmt(r.incomeTax)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─── Full Breakdown Table ─── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Complete Tax Summary</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Component
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Annual
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Monthly
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Fortnightly
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 text-gray-700">Gross Income</td>
              <td className="px-4 py-3 text-right font-medium">{fmt(r.gross)}</td>
              <td className="px-4 py-3 text-right">{fmtExact(r.gross / 12)}</td>
              <td className="px-4 py-3 text-right">{fmtExact(r.gross / 26)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Income Tax</td>
              <td className="px-4 py-3 text-right text-red-600">&minus;{fmt(r.incomeTax)}</td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmtExact(r.incomeTax / 12)}
              </td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmtExact(r.incomeTax / 26)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Medicare Levy</td>
              <td className="px-4 py-3 text-right text-red-600">&minus;{fmt(r.medicare)}</td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmtExact(r.medicare / 12)}
              </td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmtExact(r.medicare / 26)}
              </td>
            </tr>
            {r.mls > 0 && (
              <tr>
                <td className="px-4 py-3 text-orange-700">Medicare Levy Surcharge</td>
                <td className="px-4 py-3 text-right text-orange-600">&minus;{fmt(r.mls)}</td>
                <td className="px-4 py-3 text-right text-orange-600">
                  &minus;{fmtExact(r.mls / 12)}
                </td>
                <td className="px-4 py-3 text-right text-orange-600">
                  &minus;{fmtExact(r.mls / 26)}
                </td>
              </tr>
            )}
            {hasHELP && (
              <tr>
                <td className="px-4 py-3 text-gray-700">HELP Repayment</td>
                <td className="px-4 py-3 text-right text-red-600">&minus;{fmt(r.help)}</td>
                <td className="px-4 py-3 text-right text-red-600">
                  &minus;{fmtExact(r.help / 12)}
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  &minus;{fmtExact(r.help / 26)}
                </td>
              </tr>
            )}
            <tr className="bg-blue-50 font-semibold">
              <td className="px-4 py-3 text-gray-900">Total Tax &amp; Deductions</td>
              <td className="px-4 py-3 text-right text-blue-700">&minus;{fmt(r.totalTax)}</td>
              <td className="px-4 py-3 text-right text-blue-700">
                &minus;{fmtExact(r.totalTax / 12)}
              </td>
              <td className="px-4 py-3 text-right text-blue-700">
                &minus;{fmtExact(r.totalTax / 26)}
              </td>
            </tr>
            <tr className="bg-green-50 font-semibold">
              <td className="px-4 py-3 text-gray-900">Net Take-Home Pay</td>
              <td className="px-4 py-3 text-right text-green-700">{fmt(r.netAnnual)}</td>
              <td className="px-4 py-3 text-right text-green-700">{fmtExact(r.netMonthly)}</td>
              <td className="px-4 py-3 text-right text-green-700">
                {fmtExact(r.netFortnightly)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─── Year-on-Year Comparison ─── */}
      {isResident && r.gross > 0 && r.taxCutAmount !== 0 && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Stage 3 Tax Cut Savings
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Comparison of your tax under the current 2025&ndash;26 rates vs the pre-Stage 3
            (2023&ndash;24) rates.
          </p>

          {r.taxCutAmount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
              <p className="text-sm text-green-700">You save</p>
              <p className="text-3xl font-bold text-green-700">{fmt(r.taxCutAmount)}</p>
              <p className="text-sm text-green-600">per year under the Stage 3 tax cuts</p>
            </div>
          )}

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={comparisonData} margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => fmt(Number(value))} />
              <Legend />
              <Bar dataKey="incomeTax" name="Income Tax" fill="#3b82f6" stackId="a" />
              <Bar dataKey="medicare" name="Medicare" fill="#f59e0b" stackId="a" />
              <Bar dataKey="net" name="Take-Home" fill="#22c55e" stackId="a" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-600">Period</th>
                  <th className="text-right py-2 font-medium text-gray-600">
                    2023&ndash;24 Tax
                  </th>
                  <th className="text-right py-2 font-medium text-gray-600">
                    2025&ndash;26 Tax
                  </th>
                  <th className="text-right py-2 font-medium text-green-600">Saving</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-700">Income Tax</td>
                  <td className="py-2 text-right">{fmt(r.prevIncomeTax)}</td>
                  <td className="py-2 text-right">{fmt(r.incomeTax)}</td>
                  <td className="py-2 text-right text-green-600 font-medium">
                    {fmt(r.prevIncomeTax - r.incomeTax)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">Medicare Levy</td>
                  <td className="py-2 text-right">{fmt(r.prevMedicare)}</td>
                  <td className="py-2 text-right">{fmt(r.medicare)}</td>
                  <td className="py-2 text-right text-gray-400">$0</td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 text-gray-900">Total</td>
                  <td className="py-2 text-right">{fmt(r.prevTotal)}</td>
                  <td className="py-2 text-right">{fmt(r.incomeTax + r.medicare)}</td>
                  <td className="py-2 text-right text-green-600">{fmt(r.taxCutAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MLS Warning ─── */}
      {isResident && !hasPHI && r.gross > 93000 && (
        <div className="border border-orange-200 rounded-xl p-4 bg-orange-50">
          <p className="text-sm text-orange-800">
            <strong>Medicare Levy Surcharge applies.</strong> You earn over $93,000 and don&apos;t
            have private hospital cover. The MLS of {fmt(r.mls)} ({r.gross <= 108000 ? "1%" : r.gross <= 144000 ? "1.25%" : "1.5%"})
            may cost more than a basic hospital policy. Consider comparing private health insurance options.
          </p>
        </div>
      )}

      {/* Recommended Tools */}
      <div className="mt-6 border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 text-base mb-1">Recommended Tools</h3>
        <p className="text-sm text-gray-500 mb-4">Lodging your tax return? These tools can help.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://www.hrblock.com.au/online-tax-return"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <div>
              <p className="font-medium text-gray-900">H&amp;R Block Online</p>
              <p className="text-xs text-gray-500">Lodge your tax return online</p>
            </div>
            <span className="text-blue-500 text-lg">→</span>
          </a>
          <a
            href="https://www.ato.gov.au/individuals-and-families/lodging-deductions-and-reporting/lodging-a-tax-return"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <div>
              <p className="font-medium text-gray-900">Lodge via myTax</p>
              <p className="text-xs text-gray-500">Free ATO online lodgement</p>
            </div>
            <span className="text-blue-500 text-lg">→</span>
          </a>
          <a
            href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <div>
              <p className="font-medium text-gray-900">ATO Deductions Guide</p>
              <p className="text-xs text-gray-500">What you can claim this year</p>
            </div>
            <span className="text-blue-500 text-lg">→</span>
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-3">We may earn a commission if you use the H&amp;R Block link. ATO links are not sponsored.</p>
      </div>

      {/* ─── Related Calculators ─── */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              name: "PAYG Withholding Calculator",
              href: "/tax-withholding-calculator",
              desc: "Per-pay-period tax withholding",
            },
            {
              name: "HECS-HELP Repayment",
              href: "/calculators/hecs-help",
              desc: "Student loan repayment schedule",
            },
            {
              name: "Superannuation Calculator",
              href: "/calculators/super",
              desc: "Project your super at retirement",
            },
            {
              name: "Salary Sacrifice Calculator",
              href: "/salary-sacrifice-calculator",
              desc: "Tax savings from salary sacrifice",
            },
            {
              name: "Capital Gains Tax",
              href: "/calculators/capital-gains-tax",
              desc: "CGT on property, shares & crypto",
            },
            {
              name: "Medicare Levy Calculator",
              href: "/tax-withholding-calculator",
              desc: "Medicare levy & surcharge details",
            },
            {
              name: "Contractor vs Employee Calculator",
              href: "/calculators/contractor-vs-employee",
              desc: "Compare true cost: contracting vs employment",
            },
          ].map((c) => (
            <Link
              key={c.href + c.name}
              href={c.href}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors bg-white"
            >
              <span className="text-sm font-medium text-gray-900">{c.name}</span>
              <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
