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

const TAX_BRACKETS: Bracket[] = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18201, max: 45000, rate: 0.16 },
  { min: 45001, max: 135000, rate: 0.30 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

const LITO_CONFIG = {
  base: 700,
  phase1Max: 37500,
  phase2Max: 45000,
  phase3Max: 66667,
  phase2Rate: 0.05,
  phase3Rate: 0.015,
};

const PAYROLL_TAX = {
  NSW: { rate: 0.0545, threshold: 1200000 },
  VIC: { rate: 0.0485, threshold: 700000 },
  QLD: { rate: 0.0475, threshold: 1300000 },
  SA: { rate: 0.0495, threshold: 1500000 },
  WA: { rate: 0.055, threshold: 1000000 },
  TAS: { rate: 0.04, threshold: 1250000 },
  NT: { rate: 0.055, threshold: 1500000 },
  ACT: { rate: 0.0685, threshold: 2000000 },
};

// ─── Calculation Functions ───────────────────────────────────

function calcIncomeTax(income: number, brackets: Bracket[] = TAX_BRACKETS): number {
  if (income <= 0) return 0;
  let tax = 0;
  for (const b of brackets) {
    const lower = b.min === 0 ? 0 : b.min - 1;
    const upper = b.max === Infinity ? income : Math.min(income, b.max);
    const taxableAmount = Math.max(0, upper - lower);
    tax += taxableAmount * b.rate;
    if (income <= b.max) break;
  }
  return tax;
}

function calcLITO(income: number): number {
  if (income <= LITO_CONFIG.phase1Max) return LITO_CONFIG.base;
  if (income <= LITO_CONFIG.phase2Max) {
    return LITO_CONFIG.base - (income - LITO_CONFIG.phase1Max) * LITO_CONFIG.phase2Rate;
  }
  if (income <= LITO_CONFIG.phase3Max) {
    return 325 - (income - LITO_CONFIG.phase2Max) * LITO_CONFIG.phase3Rate;
  }
  return 0;
}

function calcMedicareLevy(income: number): number {
  if (income <= 24276) return 0;
  if (income <= 30345) return (income - 24276) * 0.1;
  return income * 0.02;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Component ───────────────────────────────────────────────

export default function ContractorVsEmployeeCalculator() {
  const [contractorHourlyRate, setContractorHourlyRate] = useState(100);
  const [billableWeeks, setBillableWeeks] = useState(48);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [entityType, setEntityType] = useState<"abn" | "pty_ltd">("abn");
  const [employeeSalary, setEmployeeSalary] = useState(150000);
  const [superRate, setSuperRate] = useState(11.5);
  const [state, setState] = useState("NSW");
  const [includeSuper, setIncludeSuper] = useState(true);

  const r = useMemo(() => {
    // ─── CONTRACTOR SCENARIO ─────────────────────────────────
    const annualRevenue = contractorHourlyRate * hoursPerWeek * billableWeeks;
    const estimatedExpenses = 4600;
    const contractorTaxableIncome = Math.max(0, annualRevenue - estimatedExpenses);

    const contractorIncomeTax = calcIncomeTax(contractorTaxableIncome);
    const contractorMedicareLevyGross = calcMedicareLevy(contractorTaxableIncome);
    const contractorLITO = calcLITO(contractorTaxableIncome);
    const contractorNetTax = Math.max(
      0,
      contractorIncomeTax + contractorMedicareLevyGross - contractorLITO
    );
    const contractorSelfFundedSuper = includeSuper
      ? contractorTaxableIncome * (superRate / 100)
      : 0;
    const contractorTakeHome =
      contractorTaxableIncome - contractorNetTax - contractorSelfFundedSuper;

    // Pty Ltd approximation: ~4% benefit for high earners due to company tax rate 25%
    const contractorTakeHomePtyLtd =
      entityType === "pty_ltd" ? contractorTakeHome * 1.04 : contractorTakeHome;

    // ─── EMPLOYEE SCENARIO ──────────────────────────────────
    const grossSalary = employeeSalary;
    const employeeIncomeTax = calcIncomeTax(grossSalary);
    const employeeMedicareLevy = calcMedicareLevy(grossSalary);
    const employeeLITO = calcLITO(grossSalary);
    const employeeNetTax = Math.max(0, employeeIncomeTax + employeeMedicareLevy - employeeLITO);
    const employeeTakeHome = grossSalary - employeeNetTax;
    const employerSuper = grossSalary * (superRate / 100);

    // Leave entitlements
    const annualLeaveDays = 20;
    const sickLeaveDays = 10;
    const publicHolidayDays = 10;
    const totalLeaveDays = annualLeaveDays + sickLeaveDays + publicHolidayDays;
    const dailyRate = grossSalary / 260;
    const leaveEntitlementsValue = totalLeaveDays * dailyRate;

    // Payroll tax (informational - not actual cost)
    const payrollTaxConfig = PAYROLL_TAX[state as keyof typeof PAYROLL_TAX] || PAYROLL_TAX.NSW;
    const payrollTaxAmount =
      grossSalary > payrollTaxConfig.threshold
        ? (grossSalary - payrollTaxConfig.threshold) * payrollTaxConfig.rate
        : 0;

    // Total employer cost
    const totalEmployerCost = grossSalary + employerSuper + leaveEntitlementsValue * 0.5;

    // ─── BREAK-EVEN RATE ────────────────────────────────────
    let breakEvenRate = 0;
    {
      let lo = 10;
      let hi = 500;
      for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        const revenue = mid * hoursPerWeek * billableWeeks;
        const taxable = revenue - estimatedExpenses;
        const incomeTax = calcIncomeTax(taxable);
        const medicareLevyAmount = calcMedicareLevy(taxable);
        const litoAmount = calcLITO(taxable);
        const netTax = Math.max(0, incomeTax + medicareLevyAmount - litoAmount);
        const superAmt = includeSuper ? taxable * (superRate / 100) : 0;
        const takeHome = taxable - netTax - superAmt;

        if (takeHome < employeeTakeHome) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      breakEvenRate = Math.round((lo + hi) / 2 * 100) / 100;
    }

    // ─── SUPER GAP ──────────────────────────────────────────
    const superGap = employerSuper - contractorSelfFundedSuper;

    return {
      // Contractor
      annualRevenue,
      estimatedExpenses,
      contractorTaxableIncome,
      contractorIncomeTax,
      contractorMedicareLevyGross,
      contractorLITO,
      contractorNetTax,
      contractorSelfFundedSuper,
      contractorTakeHome,
      contractorTakeHomePtyLtd,
      // Employee
      grossSalary,
      employeeIncomeTax,
      employeeMedicareLevy,
      employeeLITO,
      employeeNetTax,
      employeeTakeHome,
      employerSuper,
      annualLeaveDays,
      sickLeaveDays,
      publicHolidayDays,
      totalLeaveDays,
      dailyRate,
      leaveEntitlementsValue,
      payrollTaxAmount,
      totalEmployerCost,
      // Metrics
      breakEvenRate,
      superGap,
    };
  }, [
    contractorHourlyRate,
    billableWeeks,
    hoursPerWeek,
    entityType,
    employeeSalary,
    superRate,
    state,
    includeSuper,
  ]);

  const activeBtn = "bg-blue-600 text-white border-blue-600";
  const inactiveBtn = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

  // Chart data for comparison
  const chartData = [
    {
      label: "Contractor",
      "Take-Home": Math.max(0, entityType === "pty_ltd" ? r.contractorTakeHomePtyLtd : r.contractorTakeHome),
      "Tax Paid": r.contractorNetTax,
      Super: r.contractorSelfFundedSuper,
    },
    {
      label: "Employee",
      "Take-Home": Math.max(0, r.employeeTakeHome),
      "Tax Paid": r.employeeNetTax,
      Super: r.employerSuper,
      "Leave Value": r.leaveEntitlementsValue,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Inputs ─── */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Contractor vs Employee</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left column: Contractor Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-800">Contractor Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contractor Hourly Rate ($/hr)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={contractorHourlyRate || ""}
                  onChange={(e) => setContractorHourlyRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={0}
                  step={5}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billable Weeks per Year
              </label>
              <input
                type="number"
                value={billableWeeks || ""}
                onChange={(e) => setBillableWeeks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
                max={52}
                step={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours per Week
              </label>
              <input
                type="number"
                value={hoursPerWeek || ""}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
                max={60}
                step={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entity Type
              </label>
              <div className="flex gap-2">
                {(["abn", "pty_ltd"] as const).map((val) => (
                  <button
                    key={val}
                    onClick={() => setEntityType(val)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      entityType === val ? activeBtn : inactiveBtn
                    }`}
                  >
                    {val === "abn" ? "ABN" : "Pty Ltd"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Employee Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-green-800">Employee Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Annual Salary ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={employeeSalary || ""}
                  onChange={(e) => setEmployeeSalary(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={0}
                  step={5000}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Superannuation Rate (%)
              </label>
              <input
                type="number"
                value={superRate || ""}
                onChange={(e) => setSuperRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
                max={50}
                step={0.1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State (for payroll tax info)
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(PAYROLL_TAX).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSuper}
                  onChange={(e) => setIncludeSuper(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Contractor self-funds super
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Results Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contractor Card */}
        <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
          <h3 className="text-sm font-semibold text-blue-800 mb-4">
            {entityType === "pty_ltd" ? "Pty Ltd" : "ABN"} Contractor
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Revenue</span>
              <span className="font-semibold text-gray-900">{fmt(r.annualRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Expenses</span>
              <span className="font-semibold text-red-600">−{fmt(r.estimatedExpenses)}</span>
            </div>
            <div className="border-t border-blue-200 pt-3 flex justify-between">
              <span className="text-gray-600">Taxable Income</span>
              <span className="font-semibold text-gray-900">
                {fmt(r.contractorTaxableIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Income Tax</span>
              <span className="font-semibold text-red-600">−{fmt(r.contractorNetTax)}</span>
            </div>
            {includeSuper && (
              <div className="flex justify-between">
                <span className="text-gray-600">Self-Funded Super</span>
                <span className="font-semibold text-red-600">
                  −{fmt(r.contractorSelfFundedSuper)}
                </span>
              </div>
            )}
            <div className="border-t border-blue-200 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Annual Take-Home</span>
              <span className="font-bold text-blue-700 text-lg">
                {fmt(entityType === "pty_ltd" ? r.contractorTakeHomePtyLtd : r.contractorTakeHome)}
              </span>
            </div>
          </div>
        </div>

        {/* Employee Card */}
        <div className="border border-green-200 rounded-xl p-6 bg-green-50">
          <h3 className="text-sm font-semibold text-green-800 mb-4">Employee</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Salary</span>
              <span className="font-semibold text-gray-900">{fmt(r.grossSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Income Tax</span>
              <span className="font-semibold text-red-600">−{fmt(r.employeeNetTax)}</span>
            </div>
            <div className="border-t border-green-200 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Annual Take-Home</span>
              <span className="font-bold text-green-700 text-lg">{fmt(r.employeeTakeHome)}</span>
            </div>
            <div className="border-t border-green-200 pt-3 text-xs text-gray-500">
              <p className="mb-2 text-gray-600">Also receiving (not in pocket):</p>
              <div className="flex justify-between">
                <span>Employer Super</span>
                <span className="font-semibold text-gray-700">{fmt(r.employerSuper)}</span>
              </div>
              <div className="flex justify-between">
                <span>Leave Value (est.)</span>
                <span className="font-semibold text-gray-700">{fmt(r.leaveEntitlementsValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Key Metrics Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-4 text-center bg-white">
          <p className="text-xs text-gray-500 mb-1">Break-even Hourly Rate</p>
          <p className="text-2xl font-bold text-blue-700">${r.breakEvenRate.toFixed(2)}/hr</p>
          <p className="text-xs text-gray-400 mt-1">
            {r.breakEvenRate > contractorHourlyRate
              ? `Need $${(r.breakEvenRate - contractorHourlyRate).toFixed(2)} more`
              : `$${(contractorHourlyRate - r.breakEvenRate).toFixed(2)} above break-even`}
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 text-center bg-white">
          <p className="text-xs text-gray-500 mb-1">Super Gap (Annual)</p>
          <p className={`text-2xl font-bold ${r.superGap >= 0 ? "text-green-600" : "text-red-600"}`}>
            {fmt(Math.abs(r.superGap))}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {r.superGap >= 0 ? "Employee ahead" : "Contractor ahead"}
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 text-center bg-white">
          <p className="text-xs text-gray-500 mb-1">Leave Value (Employee)</p>
          <p className="text-2xl font-bold text-green-600">
            {fmt(r.leaveEntitlementsValue)}
          </p>
          <p className="text-xs text-gray-400 mt-1">{r.totalLeaveDays} days/yr</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 text-center bg-white">
          <p className="text-xs text-gray-500 mb-1">Take-Home Difference</p>
          <p className={`text-2xl font-bold ${r.contractorTakeHome >= r.employeeTakeHome ? "text-green-600" : "text-red-600"}`}>
            {fmt(Math.abs(r.contractorTakeHome - r.employeeTakeHome))}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {r.contractorTakeHome >= r.employeeTakeHome ? "Contractor ahead" : "Employee ahead"}
          </p>
        </div>
      </div>

      {/* ─── Leave & Benefits Breakdown ─── */}
      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Leave & Benefits Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-semibold text-gray-900">Leave Type</th>
                <th className="text-right py-2 px-4 font-semibold text-gray-900">Days</th>
                <th className="text-right py-2 px-4 font-semibold text-gray-900">Daily Rate</th>
                <th className="text-right py-2 px-4 font-semibold text-gray-900">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-600">Annual Leave</td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {r.annualLeaveDays}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {fmt(r.dailyRate)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {fmt(r.annualLeaveDays * r.dailyRate)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-600">Sick Leave</td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {r.sickLeaveDays}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {fmt(r.dailyRate)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {fmt(r.sickLeaveDays * r.dailyRate)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">Public Holidays</td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {r.publicHolidayDays}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {fmt(r.dailyRate)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {fmt(r.publicHolidayDays * r.dailyRate)}
                </td>
              </tr>
              <tr className="border-t border-gray-200 bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-semibold">Total</td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {r.totalLeaveDays}
                </td>
                <td className="py-3 px-4 text-right text-gray-600" />
                <td className="py-3 px-4 text-right text-gray-900 font-bold">
                  {fmt(r.leaveEntitlementsValue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Note: Contractor receives $0 for these benefits. Factor the value into your hourly
          rate.
        </p>
      </div>

      {/* ─── Comparison Bar Chart ─── */}
      {r.contractorTaxableIncome > 0 && r.grossSalary > 0 && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Annual Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ left: 20, right: 20, top: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => fmt(Number(value))} />
              <Legend />
              <Bar dataKey="Take-Home" stackId="a" fill="#22c55e" />
              <Bar dataKey="Tax Paid" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Super" stackId="a" fill="#6b7280" />
              <Bar dataKey="Leave Value" stackId="a" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ─── Related Links ─── */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          Related calculators:{" "}
          <Link href="/calculators/income-tax" className="underline font-semibold">
            Income Tax
          </Link>
          {" • "}
          <Link href="/calculators/super" className="underline font-semibold">
            Superannuation
          </Link>
        </p>
      </div>
    </div>
  );
}
