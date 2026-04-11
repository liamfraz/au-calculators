"use client";

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

// ─── Payroll Tax Config ───────────────────────────────────────────

interface PayrollTaxConfig {
  threshold: number;
  rate: number;
}

const payrollTaxByState: Record<string, PayrollTaxConfig> = {
  NSW: { threshold: 1200000, rate: 0.0545 },
  VIC: { threshold: 700000, rate: 0.0485 },
  QLD: { threshold: 1300000, rate: 0.0475 },
  WA: { threshold: 1000000, rate: 0.055 },
  SA: { threshold: 1500000, rate: 0.0495 },
  TAS: { threshold: 2000000, rate: 0.061 },
  ACT: { threshold: 2000000, rate: 0.0685 },
  NT: { threshold: 1500000, rate: 0.055 },
};

// ─── ATO 2025-26 Tax Brackets (Resident) ──────────────────────────

// ─── Calculation Functions ───────────────────────────────────────

function calcTax(income: number): number {
  if (income <= 0) return 0;
  let tax = 0;
  if (income > 18200) {
    tax += Math.min(income - 18200, 45000 - 18201) * 0.16;
  }
  if (income > 45000) {
    tax += Math.min(income - 45000, 135000 - 45001) * 0.30;
  }
  if (income > 135000) {
    tax += Math.min(income - 135000, 190000 - 135001) * 0.37;
  }
  if (income > 190000) {
    tax += (income - 190000) * 0.45;
  }
  return tax;
}

function calcLITO(income: number): number {
  if (income <= 37500) return 700;
  if (income <= 45000) return 700 - (income - 37500) * 0.05;
  if (income <= 66667) return 325 - (income - 45000) * 0.015;
  return 0;
}

function calcMedicare(income: number): number {
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

function fmtExact(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// ─── Scenario Calculation ────────────────────────────────────────

interface ScenarioResult {
  employeeTakeHome: number;
  employeeTax: number;
  employeeIncomeTax: number;
  employeeMedicare: number;
  employerSuper: number;
  employeeLeaveValue: number;
  totalEmployeePackage: number;
  contractorTakeHome: number;
  contractorTax: number;
  contractorIncomeTax: number;
  contractorMedicare: number;
  contractorSuperContrib: number;
  totalContractorPackage: number;
  contractorAdvantage: number;
}

function calcScenario(
  rate: number,
  superIncluded: boolean,
  deductions: number,
  hasABN: boolean
): ScenarioResult {
  // ─── Employee Scenario ───
  const grossSalary = rate;
  const employerSuper = grossSalary * 0.115;

  const employeeGrossTax = calcTax(grossSalary);
  const employeeLITO = calcLITO(grossSalary);
  const employeeIncomeTax = Math.max(0, employeeGrossTax - employeeLITO);
  const employeeMedicare = calcMedicare(grossSalary);
  const employeeTax = employeeIncomeTax + employeeMedicare;
  const employeeTakeHome = grossSalary - employeeTax;

  // Leave entitlements: annual leave (4 wks) + sick leave (10 days) + public holidays (~11 days)
  const employeeLeaveValue = grossSalary * (4 / 52 + 10 / 260 + 11 / 260);
  const totalEmployeePackage = employeeTakeHome + employerSuper;

  // ─── Contractor Scenario ───
  let contractorIncome = rate;
  let contractorSuperContrib = 0;

  if (superIncluded) {
    contractorIncome = rate / 1.115;
    contractorSuperContrib = rate - contractorIncome;
  }

  // Apply 47% withholding if no ABN
  let contractorTax = 0;
  let contractorIncomeTax = 0;
  let contractorMedicare = 0;

  if (!hasABN) {
    // 47% withholding applies
    contractorTax = contractorIncome * 0.47;
  } else {
    const taxableIncome = Math.max(0, contractorIncome - deductions);
    const contractorGrossTax = calcTax(taxableIncome);
    const contractorLITO = calcLITO(taxableIncome);
    contractorIncomeTax = Math.max(0, contractorGrossTax - contractorLITO);
    contractorMedicare = calcMedicare(taxableIncome);
    contractorTax = contractorIncomeTax + contractorMedicare;
  }

  const contractorTakeHome = contractorIncome - contractorTax;
  const totalContractorPackage =
    contractorTakeHome + contractorSuperContrib;

  const contractorAdvantage =
    totalContractorPackage - totalEmployeePackage;

  return {
    employeeTakeHome,
    employeeTax,
    employeeIncomeTax,
    employeeMedicare,
    employerSuper,
    employeeLeaveValue,
    totalEmployeePackage,
    contractorTakeHome,
    contractorTax,
    contractorIncomeTax,
    contractorMedicare,
    contractorSuperContrib,
    totalContractorPackage,
    contractorAdvantage,
  };
}

// ─── Component ────────────────────────────────────────────────────

export default function ContractorVsEmployeeCalculator() {
  const [incomeMode, setIncomeMode] = useState<"annual" | "dayrate">("annual");
  const [annualRate, setAnnualRate] = useState(100000);
  const [dayRate, setDayRate] = useState(454.5);
  const [daysPerYear, setDaysPerYear] = useState(220);
  const [state, setState] = useState("NSW");
  const [superIncluded, setSuperIncluded] = useState(false);
  const [hasABN, setHasABN] = useState(true);
  const [businessDeductions, setBusinessDeductions] = useState(5000);

  // Calculate effective annual rate based on mode
  const effectiveAnnualRate = incomeMode === "annual" ? annualRate : dayRate * daysPerYear;

  const scenario = useMemo(
    () => calcScenario(effectiveAnnualRate, superIncluded, businessDeductions, hasABN),
    [effectiveAnnualRate, superIncluded, businessDeductions, hasABN]
  );

  const breakEvenRate = useMemo(() => {
    // Find the contractor rate needed to match total employee package
    // Binary search or iteration
    const targetPackage = scenario.totalEmployeePackage;
    let low = effectiveAnnualRate * 0.8;
    let high = effectiveAnnualRate * 2;

    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      const testScenario = calcScenario(mid, superIncluded, businessDeductions, hasABN);
      if (testScenario.totalContractorPackage < targetPackage) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return (low + high) / 2;
  }, [effectiveAnnualRate, superIncluded, businessDeductions, hasABN, scenario.totalEmployeePackage]);

  const comparisonTableData = useMemo(() => {
    const incomes = [80000, 100000, 120000, 150000, 200000];
    return incomes.map((income) => {
      const s = calcScenario(income, superIncluded, businessDeductions, hasABN);
      return {
        income,
        employeeTakeHome: s.employeeTakeHome,
        employeeTotalPackage: s.totalEmployeePackage,
        contractorTakeHome: s.contractorTakeHome,
        contractorTotalPackage: s.totalContractorPackage,
        difference: s.contractorAdvantage,
      };
    });
  }, [superIncluded, businessDeductions, hasABN]);

  const chartData = [
    {
      name: "Take-Home Pay",
      Employee: Math.max(0, scenario.employeeTakeHome),
      Contractor: Math.max(0, scenario.contractorTakeHome),
    },
    {
      name: "Tax Paid",
      Employee: scenario.employeeTax,
      Contractor: scenario.contractorTax,
    },
    {
      name: "Super",
      Employee: scenario.employerSuper,
      Contractor: scenario.contractorSuperContrib,
    },
    {
      name: "Leave Value",
      Employee: scenario.employeeLeaveValue,
      Contractor: 0,
    },
  ];

  const activeBtn = "bg-blue-600 text-white border-blue-600";
  const inactiveBtn = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

  const isContractorBetter = scenario.contractorAdvantage > 0;

  return (
    <div className="space-y-6">
      {/* ─── Inputs ─── */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Employment Details
        </h2>

        {/* Income Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Income Type
          </label>
          <div className="flex gap-2">
            {(["annual", "dayrate"] as const).map((val) => (
              <button
                key={val}
                onClick={() => setIncomeMode(val)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  incomeMode === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {val === "annual" ? "Annual Salary" : "Day Rate"}
              </button>
            ))}
          </div>
        </div>

        {/* Annual Salary Input */}
        {incomeMode === "annual" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salary / Contract Rate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={annualRate || ""}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
                step={1000}
              />
            </div>
          </div>
        )}

        {/* Day Rate Inputs */}
        {incomeMode === "dayrate" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={dayRate || ""}
                  onChange={(e) => setDayRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={0}
                  step={50}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Working Days per Year
              </label>
              <input
                type="number"
                value={daysPerYear || ""}
                onChange={(e) => setDaysPerYear(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
                step={1}
              />
              <p className="text-xs text-gray-500 mt-1">
                Calculated annual: {fmt(dayRate * daysPerYear)}
              </p>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State (for reference)
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Super Included in Rate?
            </label>
            <div className="flex gap-2">
              {([false, true] as const).map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setSuperIncluded(val)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    superIncluded === val ? activeBtn : inactiveBtn
                  }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Has ABN?
            </label>
            <div className="flex gap-2">
              {([true, false] as const).map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setHasABN(val)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    hasABN === val ? activeBtn : inactiveBtn
                  }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Deductions (Contractor)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              value={businessDeductions || ""}
              onChange={(e) =>
                setBusinessDeductions(Math.max(0, Number(e.target.value)))
              }
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={0}
              step={500}
            />
          </div>
        </div>
      </div>

      {/* ─── Hero Result Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-green-600 text-white rounded-xl p-4 text-center col-span-2">
          <p className="text-xs text-green-100 mb-1">Employee Take-Home</p>
          <p className="text-2xl font-bold">{fmt(scenario.employeeTakeHome)}</p>
          <p className="text-xs text-green-200 mt-1">
            {fmtExact(scenario.employeeTakeHome / 12)}/mo
          </p>
        </div>
        <div className="bg-blue-600 text-white rounded-xl p-4 text-center col-span-2">
          <p className="text-xs text-blue-100 mb-1">Contractor Take-Home</p>
          <p className="text-2xl font-bold">
            {fmt(scenario.contractorTakeHome)}
          </p>
          <p className="text-xs text-blue-200 mt-1">
            {fmtExact(scenario.contractorTakeHome / 12)}/mo
          </p>
        </div>
      </div>

      {/* ─── Side-by-Side Comparison Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Employee Card */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Gross Salary</span>
              <span className="font-semibold text-gray-900">
                {fmt(effectiveAnnualRate)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Income Tax (PAYG)</span>
              <span className="font-semibold text-gray-900">
                {fmt(scenario.employeeIncomeTax)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Medicare Levy</span>
              <span className="font-semibold text-gray-900">
                {fmt(scenario.employeeMedicare)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Employer Super (11.5%)</span>
              <span className="font-semibold text-gray-900">
                {fmt(scenario.employerSuper)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Leave Entitlements</span>
              <span className="font-semibold text-gray-900">
                {fmt(scenario.employeeLeaveValue)}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-900">Total Package</span>
              <span className="font-bold text-green-600">
                {fmt(scenario.totalEmployeePackage)}
              </span>
            </div>
          </div>
        </div>

        {/* Contractor Card */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contractor</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Contract Income</span>
              <span className="font-semibold text-gray-900">
                {fmt(
                  superIncluded
                    ? effectiveAnnualRate / 1.115
                    : effectiveAnnualRate
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Deductions Claimed</span>
              <span className="font-semibold text-gray-900">
                -{fmt(businessDeductions)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Estimated Tax Bill</span>
              <span className="font-semibold text-gray-900">
                {fmt(scenario.contractorTax)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Own Super (11.5%)</span>
              <span className="font-semibold text-gray-900">
                {fmt(scenario.contractorSuperContrib)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-700">Leave Entitlements</span>
              <span className="font-semibold text-gray-900">$0</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-900">Total Package</span>
              <span className="font-bold text-blue-600">
                {fmt(scenario.totalContractorPackage)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recommendation Card ─── */}
      <div
        className={`border rounded-xl p-6 ${
          isContractorBetter
            ? "border-green-200 bg-green-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <h3
          className={`text-lg font-bold mb-2 ${
            isContractorBetter ? "text-green-900" : "text-amber-900"
          }`}
        >
          {isContractorBetter
            ? `Contractor arrangement is better by ${fmt(
                scenario.contractorAdvantage
              )}/year`
            : `Employee arrangement is better when including ${fmt(
                scenario.employeeLeaveValue
              )} in leave benefits`}
        </h3>
        <p className={`text-sm mb-4 ${
          isContractorBetter ? "text-green-800" : "text-amber-800"
        }`}>
          Break-even rate: {fmt(breakEvenRate)}/year for contractor to match
          employee total package.
        </p>
        <ul
          className={`text-sm space-y-1 ${
            isContractorBetter ? "text-green-800" : "text-amber-800"
          }`}
        >
          <li>
            • Contractors must manage their own super, deductions, and tax
            compliance
          </li>
          <li>• Employees receive paid leave and job security</li>
          <li>• Contractor savings depend on deductions and super strategy</li>
          <li>• State-based variations not included (for reference only)</li>
        </ul>
      </div>

      {/* ─── Payroll Tax Context Card ─── */}
      <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Payroll Tax Context
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>
            <span className="font-semibold">{state}</span> payroll tax threshold:{" "}
            <span className="font-semibold">
              {fmt(payrollTaxByState[state]?.threshold || 0)}
            </span>
            {" "}(rate: {((payrollTaxByState[state]?.rate || 0) * 100).toFixed(2)}%)
          </p>
          <p className="text-xs">
            Payroll tax applies when a single employer's total payroll exceeds
            this threshold. For a small business with one employee, payroll tax
            is typically $0.
          </p>
        </div>
      </div>

      {/* ─── ABN Warning ─── */}
      {!hasABN && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
          <p className="text-sm font-semibold text-red-900 mb-1">
            No ABN: 47% Withholding Applied
          </p>
          <p className="text-sm text-red-800">
            Without an ABN, payers must withhold 47% of all payments. This is
            held by the ATO and credited at tax time, but significantly reduces
            your cash flow. Register for an ABN to enable normal tax treatment.
          </p>
        </div>
      )}

      {/* ─── Comparison Chart ─── */}
      {effectiveAnnualRate > 0 && (
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Annual Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => fmt(value as number)} />
              <Legend />
              <Bar dataKey="Employee" fill="#22c55e" />
              <Bar dataKey="Contractor" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ─── PSI (80/20 Rule) Info Card ─── */}
      <div className="border border-amber-200 rounded-xl p-6 bg-amber-50">
        <div className="flex gap-3">
          <div className="text-amber-600 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              Understanding the 80/20 Rule for Personal Services Income
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>
                <span className="font-semibold">What is PSI?</span> If more than
                80% of your contractor income comes from a single client in an
                income year, the ATO may classify your income as Personal
                Services Income (PSI).
              </li>
              <li>
                <span className="font-semibold">Tax impact:</span> If PSI rules
                apply, the ATO restricts deductions you can claim (e.g., home
                office, certain super contributions, vehicle expenses). You're
                taxed similarly to an employee, losing your tax advantage.
              </li>
              <li>
                <span className="font-semibold">How to avoid PSI:</span> Work
                for multiple clients, employ staff, work from your own premises,
                or establish a business structure (e.g., trust, company).
              </li>
              <li>
                <a
                  href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare/personal-services-income"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline hover:text-amber-900 font-semibold"
                >
                  Learn more on the ATO website →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Affiliate Links Section ─── */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tools for Contractors & Freelancers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          {/* Rounded Card */}
          <div className="border-2 border-blue-300 rounded-xl p-5 bg-white hover:shadow-lg transition-shadow">
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              Rounded — Contractor Invoicing
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Purpose-built for Australian contractors. Create invoices, track
              expenses, and manage your ABN in one place.
            </p>
            <a
              href="https://rounded.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Rounded →
            </a>
            <p className="text-xs text-gray-500 mt-3">
              Invoicing, expenses & tax for AU contractors
            </p>
          </div>

          {/* Xero Card */}
          <div className="border-2 border-green-300 rounded-xl p-5 bg-white hover:shadow-lg transition-shadow">
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              Xero — Small Business Accounting
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Australia's leading accounting software. Perfect for contractors
              managing BAS, invoices, and annual tax.
            </p>
            <a
              href="https://www.xero.com/au/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Try Xero →
            </a>
            <p className="text-xs text-gray-500 mt-3">
              BAS, invoicing & GST for Australian contractors
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center">
          These are partner links. We may earn a commission if you sign up, at
          no extra cost to you.
        </p>
      </div>

      {/* ─── Comparison Table ─── */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Common Income Levels
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2 font-semibold text-gray-900">
                  Income
                </th>
                <th className="text-right px-4 py-2 font-semibold text-gray-900">
                  Employee Take-Home
                </th>
                <th className="text-right px-4 py-2 font-semibold text-gray-900">
                  Employee Package
                </th>
                <th className="text-right px-4 py-2 font-semibold text-gray-900">
                  Contractor Take-Home
                </th>
                <th className="text-right px-4 py-2 font-semibold text-gray-900">
                  Contractor Package
                </th>
                <th className="text-right px-4 py-2 font-semibold text-gray-900">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonTableData.map((row, idx) => (
                <tr
                  key={row.income}
                  className={
                    row.income === effectiveAnnualRate
                      ? "bg-blue-50 border-b border-gray-200"
                      : idx % 2 === 0
                      ? "border-b border-gray-200 bg-white"
                      : "border-b border-gray-200 bg-gray-50"
                  }
                >
                  <td className="text-left px-4 py-2 font-semibold text-gray-900">
                    {fmt(row.income)}
                    {row.income === effectiveAnnualRate && (
                      <span className="text-xs text-blue-600 block">
                        (current)
                      </span>
                    )}
                  </td>
                  <td className="text-right px-4 py-2 text-gray-700">
                    {fmt(row.employeeTakeHome)}
                  </td>
                  <td className="text-right px-4 py-2 font-semibold text-green-600">
                    {fmt(row.employeeTotalPackage)}
                  </td>
                  <td className="text-right px-4 py-2 text-gray-700">
                    {fmt(row.contractorTakeHome)}
                  </td>
                  <td className="text-right px-4 py-2 font-semibold text-blue-600">
                    {fmt(row.contractorTotalPackage)}
                  </td>
                  <td
                    className={`text-right px-4 py-2 font-semibold ${
                      row.difference > 0 ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {row.difference > 0 ? "+" : ""}
                    {fmt(row.difference)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
