"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── ATO 2025-26 Tax Tables ─────────────────────────────────

type Bracket = { upTo: number; rate: number; base: number; threshold: number };

const RESIDENT_BRACKETS: Bracket[] = [
  { upTo: 18200, rate: 0, base: 0, threshold: 0 },
  { upTo: 45000, rate: 0.16, base: 0, threshold: 18200 },
  { upTo: 135000, rate: 0.30, base: 4288, threshold: 45000 },
  { upTo: 190000, rate: 0.37, base: 31288, threshold: 135000 },
  { upTo: Infinity, rate: 0.45, base: 51638, threshold: 190000 },
];

const RESIDENT_NO_THRESHOLD: Bracket[] = [
  { upTo: 45000, rate: 0.16, base: 0, threshold: 0 },
  { upTo: 135000, rate: 0.30, base: 7200, threshold: 45000 },
  { upTo: 190000, rate: 0.37, base: 34200, threshold: 135000 },
  { upTo: Infinity, rate: 0.45, base: 54550, threshold: 190000 },
];

const NON_RESIDENT_BRACKETS: Bracket[] = [
  { upTo: 135000, rate: 0.30, base: 0, threshold: 0 },
  { upTo: 190000, rate: 0.37, base: 40500, threshold: 135000 },
  { upTo: Infinity, rate: 0.45, base: 60850, threshold: 190000 },
];

const WORKING_HOLIDAY_BRACKETS: Bracket[] = [
  { upTo: 45000, rate: 0.15, base: 0, threshold: 0 },
  { upTo: 135000, rate: 0.30, base: 6750, threshold: 45000 },
  { upTo: 190000, rate: 0.37, base: 33750, threshold: 135000 },
  { upTo: Infinity, rate: 0.45, base: 54100, threshold: 190000 },
];

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

const PERIODS: Record<string, { divisor: number; label: string }> = {
  weekly: { divisor: 52, label: "Weekly" },
  fortnightly: { divisor: 26, label: "Fortnightly" },
  monthly: { divisor: 12, label: "Monthly" },
  annually: { divisor: 1, label: "Annual" },
};

// ─── Calculation Functions ───────────────────────────────────

function getBrackets(residency: string, claimThreshold: boolean): Bracket[] {
  if (residency === "non-resident") return NON_RESIDENT_BRACKETS;
  if (residency === "working-holiday") return WORKING_HOLIDAY_BRACKETS;
  return claimThreshold ? RESIDENT_BRACKETS : RESIDENT_NO_THRESHOLD;
}

function calcTax(income: number, brackets: Bracket[]): number {
  if (income <= 0) return 0;
  for (const b of brackets) {
    if (income <= b.upTo) return b.base + (income - b.threshold) * b.rate;
  }
  return 0;
}

function calcLITO(income: number, residency: string): number {
  if (residency !== "resident") return 0;
  if (income <= 37500) return 700;
  if (income <= 45000) return 700 - (income - 37500) * 0.05;
  if (income <= 66667) return 325 - (income - 45000) * 0.015;
  return 0;
}

function calcMedicare(income: number, residency: string, reduction: string): number {
  if (residency !== "resident") return 0;
  if (reduction === "exempt") return 0;
  if (reduction === "half") return income * 0.01;
  if (reduction === "low-income") {
    if (income <= 24276) return 0;
    if (income <= 30345) return (income - 24276) * 0.1;
  }
  return income * 0.02;
}

function calcHELP(income: number, hasDebt: boolean): number {
  if (!hasDebt) return 0;
  for (const t of HELP_THRESHOLDS) {
    if (income <= t.max) return Math.round(income * t.rate);
  }
  return 0;
}

function getMarginalRate(income: number, brackets: Bracket[]): number {
  for (const b of brackets) {
    if (income <= b.upTo) return b.rate;
  }
  return 0.45;
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

export default function TaxWithholdingCalculator() {
  const [salary, setSalary] = useState(80000);
  const [frequency, setFrequency] = useState("fortnightly");
  const [residency, setResidency] = useState("resident");
  const [claimThreshold, setClaimThreshold] = useState(true);
  const [hasHELP, setHasHELP] = useState(false);
  const [medicareReduction, setMedicareReduction] = useState("none");

  const r = useMemo(() => {
    const income = Math.max(0, salary);
    const brackets = getBrackets(residency, claimThreshold);
    const grossTax = calcTax(income, brackets);
    const lito = calcLITO(income, residency);
    const incomeTax = Math.max(0, grossTax - lito);
    const medicare = calcMedicare(income, residency, medicareReduction);
    const help = calcHELP(income, hasHELP);
    const totalWithholding = incomeTax + medicare + help;
    const netPay = income - totalWithholding;
    const marginalRate = getMarginalRate(income, brackets);
    const effectiveRate = income > 0 ? totalWithholding / income : 0;
    const div = PERIODS[frequency].divisor;
    return {
      income,
      incomeTax,
      lito,
      medicare,
      help,
      totalWithholding,
      netPay,
      marginalRate,
      effectiveRate,
      brackets,
      pp: {
        gross: income / div,
        tax: incomeTax / div,
        medicare: medicare / div,
        help: help / div,
        total: totalWithholding / div,
        net: netPay / div,
      },
    };
  }, [salary, frequency, residency, claimThreshold, hasHELP, medicareReduction]);

  const isResident = residency === "resident";
  const pLabel =
    frequency === "annually" ? "year" : PERIODS[frequency].label.toLowerCase();
  const activeBtn = "bg-blue-600 text-white border-blue-600";
  const inactiveBtn =
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
  const disabledBtn = "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

  return (
    <div className="space-y-6">
      {/* ─── Inputs ─── */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Income Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gross Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              value={salary || ""}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={0}
              step={1000}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pay Frequency
          </label>
          <div className="flex gap-2">
            {Object.entries(PERIODS).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setFrequency(key)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${frequency === key ? activeBtn : inactiveBtn}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Residency Status
          </label>
          <div className="flex gap-2">
            {(
              [
                ["resident", "Resident"],
                ["non-resident", "Non-Resident"],
                ["working-holiday", "Working Holiday"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                onClick={() => {
                  setResidency(val);
                  if (val !== "resident") setClaimThreshold(false);
                  else setClaimThreshold(true);
                }}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${residency === val ? activeBtn : inactiveBtn}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Claim Tax-Free Threshold
            {!isResident && (
              <span className="text-gray-400 ml-1">(residents only)</span>
            )}
          </label>
          <div className="flex gap-2">
            {([true, false] as const).map((val) => (
              <button
                key={String(val)}
                disabled={!isResident}
                onClick={() => setClaimThreshold(val)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${!isResident ? disabledBtn : claimThreshold === val ? activeBtn : inactiveBtn}`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

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

        {isResident && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicare Levy
            </label>
            <select
              value={medicareReduction}
              onChange={(e) => setMedicareReduction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="none">Full levy (2%)</option>
              <option value="low-income">Reduced &mdash; low income</option>
              <option value="half">Half levy (1%) &mdash; dependants</option>
              <option value="exempt">Exempt</option>
            </select>
          </div>
        )}
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Income Tax</p>
          <p className="text-xl font-bold text-gray-900">{fmt(r.incomeTax)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {fmtExact(r.pp.tax)}/{pLabel}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Medicare Levy</p>
          <p className="text-xl font-bold text-gray-900">{fmt(r.medicare)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {fmtExact(r.pp.medicare)}/{pLabel}
          </p>
        </div>
        {hasHELP && (
          <div className="border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">HELP Repayment</p>
            <p className="text-xl font-bold text-amber-600">{fmt(r.help)}</p>
            <p className="text-xs text-gray-400 mt-1">
              {fmtExact(r.pp.help)}/{pLabel}
            </p>
          </div>
        )}
        <div className="bg-blue-600 text-white rounded-xl p-4 text-center">
          <p className="text-xs text-blue-100 mb-1">Total Withholding</p>
          <p className="text-xl font-bold">{fmt(r.totalWithholding)}</p>
          <p className="text-xs text-blue-200 mt-1">
            {fmtExact(r.pp.total)}/{pLabel}
          </p>
        </div>
        <div
          className={`bg-green-600 text-white rounded-xl p-4 text-center ${hasHELP ? "col-span-2" : ""}`}
        >
          <p className="text-xs text-green-100 mb-1">Net Take-Home Pay</p>
          <p className="text-xl font-bold">{fmt(r.netPay)}</p>
          <p className="text-xs text-green-200 mt-1">
            {fmtExact(r.pp.net)}/{pLabel}
          </p>
        </div>
      </div>

      {/* ─── Tax Rates ─── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Effective Tax Rate</p>
          <p className="text-3xl font-bold text-blue-600">
            {(r.effectiveRate * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Total withholding &divide; gross income
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Marginal Tax Rate</p>
          <p className="text-3xl font-bold text-gray-900">
            {(r.marginalRate * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rate on your next dollar earned
          </p>
        </div>
      </div>

      {/* ─── Breakdown Bar ─── */}
      {r.income > 0 && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Income Breakdown
          </h3>
          <div className="flex rounded-lg overflow-hidden h-8 mb-4">
            {r.incomeTax > 0 && (
              <div
                style={{ width: `${(r.incomeTax / r.income) * 100}%` }}
                className="bg-blue-500 transition-all duration-300"
              />
            )}
            {r.medicare > 0 && (
              <div
                style={{ width: `${(r.medicare / r.income) * 100}%` }}
                className="bg-amber-500 transition-all duration-300"
              />
            )}
            {hasHELP && r.help > 0 && (
              <div
                style={{ width: `${(r.help / r.income) * 100}%` }}
                className="bg-purple-500 transition-all duration-300"
              />
            )}
            <div
              style={{ width: `${(Math.max(0, r.netPay) / r.income) * 100}%` }}
              className="bg-green-500 transition-all duration-300"
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500" />
              Income Tax ({((r.incomeTax / r.income) * 100).toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              Medicare ({((r.medicare / r.income) * 100).toFixed(1)}%)
            </span>
            {hasHELP && r.help > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                HELP ({((r.help / r.income) * 100).toFixed(1)}%)
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-500" />
              Net Pay ({((Math.max(0, r.netPay) / r.income) * 100).toFixed(1)}
              %)
            </span>
          </div>
        </div>
      )}

      {/* ─── Period Breakdown Table ─── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Component
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                {PERIODS[frequency].label}
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Annual
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 text-gray-700">Gross Income</td>
              <td className="px-4 py-3 text-right font-medium">
                {fmtExact(r.pp.gross)}
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {fmt(r.income)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Income Tax</td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmtExact(r.pp.tax)}
              </td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmt(r.incomeTax)}
              </td>
            </tr>
            {r.lito > 0 && (
              <tr>
                <td className="px-4 py-3 text-gray-500 text-xs pl-8">
                  &nbsp;&nbsp;includes LITO of {fmt(Math.round(r.lito))}
                </td>
                <td />
                <td />
              </tr>
            )}
            <tr>
              <td className="px-4 py-3 text-gray-700">Medicare Levy</td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmtExact(r.pp.medicare)}
              </td>
              <td className="px-4 py-3 text-right text-red-600">
                &minus;{fmt(r.medicare)}
              </td>
            </tr>
            {hasHELP && (
              <tr>
                <td className="px-4 py-3 text-gray-700">HELP Repayment</td>
                <td className="px-4 py-3 text-right text-red-600">
                  &minus;{fmtExact(r.pp.help)}
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  &minus;{fmt(r.help)}
                </td>
              </tr>
            )}
            <tr className="bg-blue-50 font-semibold">
              <td className="px-4 py-3 text-gray-900">Total Withholding</td>
              <td className="px-4 py-3 text-right text-blue-700">
                &minus;{fmtExact(r.pp.total)}
              </td>
              <td className="px-4 py-3 text-right text-blue-700">
                &minus;{fmt(r.totalWithholding)}
              </td>
            </tr>
            <tr className="bg-green-50 font-semibold">
              <td className="px-4 py-3 text-gray-900">Net Take-Home Pay</td>
              <td className="px-4 py-3 text-right text-green-700">
                {fmtExact(r.pp.net)}
              </td>
              <td className="px-4 py-3 text-right text-green-700">
                {fmt(r.netPay)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─── Tax Brackets Reference ─── */}
      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {residency === "resident"
            ? "Australian Resident"
            : residency === "non-resident"
              ? "Non-Resident"
              : "Working Holiday"}{" "}
          Tax Brackets 2025&ndash;26
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-600">
                  Taxable Income
                </th>
                <th className="text-right py-2 font-medium text-gray-600">
                  Rate
                </th>
                <th className="text-right py-2 pl-4 font-medium text-gray-600">
                  Tax on Bracket
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {r.brackets.map((b, i) => {
                const isCurrent =
                  r.income > b.threshold && r.income <= b.upTo;
                return (
                  <tr key={i} className={isCurrent ? "bg-blue-50" : ""}>
                    <td className="py-2 pr-4 text-gray-700">
                      {b.upTo === Infinity
                        ? `${fmt(b.threshold + 1)}+`
                        : `${fmt(b.threshold === 0 ? 0 : b.threshold + 1)} \u2013 ${fmt(b.upTo)}`}
                      {isCurrent && (
                        <span className="ml-2 text-xs text-blue-600 font-medium">
                          &larr; You
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {(b.rate * 100).toFixed(0)}%
                    </td>
                    <td className="py-2 pl-4 text-right text-gray-700">
                      {b.rate === 0
                        ? "Nil"
                        : b.base > 0
                          ? `${fmt(b.base)} + ${(b.rate * 100).toFixed(0)}%`
                          : `${(b.rate * 100).toFixed(0)}% of taxable income`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── LITO Info ─── */}
      {isResident && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Low Income Tax Offset (LITO)
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            The LITO reduces tax payable for Australian residents with lower
            incomes. It is applied automatically &mdash; you don&apos;t need to
            claim it.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">
                    Taxable Income
                  </th>
                  <th className="text-right py-2 font-medium text-gray-600">
                    Offset
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-700">$0 &ndash; $37,500</td>
                  <td className="py-2 text-right text-green-600">$700</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">
                    $37,501 &ndash; $45,000
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    $700 minus 5c per $1 over $37,500
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">
                    $45,001 &ndash; $66,667
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    $325 minus 1.5c per $1 over $45,000
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">$66,668+</td>
                  <td className="py-2 text-right text-gray-400">Nil</td>
                </tr>
              </tbody>
            </table>
          </div>
          {r.lito > 0 && (
            <p className="text-sm text-green-600 mt-3 font-medium">
              Your LITO: {fmt(Math.round(r.lito))} (already applied above)
            </p>
          )}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              <strong>Low and Middle Income Tax Offset (LMITO):</strong> This
              offset ended on 30 June 2022 and is no longer available for the
              2025&ndash;26 financial year.
            </p>
          </div>
        </div>
      )}

      {/* ─── Related Calculators ─── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Related Calculators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              name: "HECS-HELP Repayment",
              href: "/calculators/hecs-help",
              icon: "\uD83C\uDF93",
            },
            {
              name: "Superannuation",
              href: "/calculators/super",
              icon: "\uD83D\uDCB0",
            },
            {
              name: "Mortgage Repayment",
              href: "/calculators/mortgage-repayment",
              icon: "\uD83C\uDFE0",
            },
            {
              name: "Stamp Duty",
              href: "/calculators/stamp-duty",
              icon: "\uD83D\uDCCB",
            },
            {
              name: "Car Loan",
              href: "/calculators/car-loan",
              icon: "\uD83D\uDE97",
            },
            {
              name: "Energy Bill",
              href: "/calculators/energy-bill",
              icon: "\u26A1",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            >
              <span>{c.icon}</span>
              <span className="text-gray-700">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
