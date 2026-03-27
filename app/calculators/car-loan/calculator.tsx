"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Frequency = "weekly" | "fortnightly" | "monthly";

interface Inputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  frequency: Frequency;
  balloonPayment: number;
}

interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface CalcResult {
  repayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: AmortizationRow[];
  effectiveLoanAmount: number;
}

const FREQUENCY_LABELS: Record<Frequency, string> = {
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
};

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
};

function calculateCarLoan(inputs: Inputs): CalcResult {
  const { loanAmount, interestRate, loanTerm, frequency, balloonPayment } = inputs;
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const totalPeriods = loanTerm * periodsPerYear;
  const periodicRate = interestRate / 100 / periodsPerYear;
  const balloon = Math.min(balloonPayment, loanAmount);

  if (periodicRate === 0) {
    const effectiveAmount = loanAmount - balloon;
    const repayment = effectiveAmount / totalPeriods;
    const schedule: AmortizationRow[] = [];
    let balance = loanAmount;
    for (let i = 1; i <= totalPeriods; i++) {
      const principalPayment = i === totalPeriods ? balance - balloon : repayment;
      balance -= principalPayment;
      schedule.push({
        period: i,
        payment: i === totalPeriods ? repayment + balloon : repayment,
        principal: principalPayment,
        interest: 0,
        balance: Math.max(0, balance),
      });
    }
    return {
      repayment,
      totalInterest: 0,
      totalPaid: loanAmount,
      schedule,
      effectiveLoanAmount: effectiveAmount,
    };
  }

  // Car loan with balloon payment formula:
  // PMT = [PV - BV / (1+r)^n] * r * (1+r)^n / [(1+r)^n - 1]
  const compoundFactor = Math.pow(1 + periodicRate, totalPeriods);
  const presentValueBalloon = balloon / compoundFactor;
  const adjustedPrincipal = loanAmount - presentValueBalloon;
  const repayment =
    (adjustedPrincipal * periodicRate * compoundFactor) / (compoundFactor - 1);

  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;

  for (let i = 1; i <= totalPeriods; i++) {
    const interestPayment = balance * periodicRate;
    const principalPayment = repayment - interestPayment;
    balance -= principalPayment;

    if (i === totalPeriods) {
      schedule.push({
        period: i,
        payment: repayment + balloon,
        principal: principalPayment + balloon,
        interest: interestPayment,
        balance: 0,
      });
    } else {
      schedule.push({
        period: i,
        payment: repayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }
  }

  const totalRegularPayments = repayment * totalPeriods;
  const totalPaid = totalRegularPayments + balloon;
  const totalInterest = totalPaid - loanAmount;

  return {
    repayment,
    totalInterest,
    totalPaid,
    schedule,
    effectiveLoanAmount: adjustedPrincipal,
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

function formatCurrencyExact(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function InputPanel({
  inputs,
  onChange,
  label,
}: {
  inputs: Inputs;
  onChange: (inputs: Inputs) => void;
  label?: string;
}) {
  return (
    <div className="space-y-4">
      {label && <h3 className="font-semibold text-lg text-gray-800">{label}</h3>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount ($)</label>
        <input
          type="number"
          value={inputs.loanAmount}
          onChange={(e) => onChange({ ...inputs, loanAmount: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          min={0}
          step={1000}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
        <input
          type="number"
          value={inputs.interestRate}
          onChange={(e) => onChange({ ...inputs, interestRate: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          min={0}
          max={30}
          step={0.01}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
        <select
          value={inputs.loanTerm}
          onChange={(e) => onChange({ ...inputs, loanTerm: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((y) => (
            <option key={y} value={y}>
              {y} {y === 1 ? "year" : "years"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Frequency</label>
        <select
          value={inputs.frequency}
          onChange={(e) => onChange({ ...inputs, frequency: e.target.value as Frequency })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        >
          {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
            <option key={f} value={f}>
              {FREQUENCY_LABELS[f]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Balloon Payment ($)
          <span className="font-normal text-gray-400 ml-1">optional</span>
        </label>
        <input
          type="number"
          value={inputs.balloonPayment}
          onChange={(e) => onChange({ ...inputs, balloonPayment: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          min={0}
          step={1000}
        />
        <p className="text-xs text-gray-400 mt-1">
          A lump sum due at the end of the loan term. Reduces regular repayments but increases total interest.
        </p>
      </div>
    </div>
  );
}

function ResultCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-blue-800">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function CarLoanCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    loanAmount: 30000,
    interestRate: 7,
    loanTerm: 5,
    frequency: "monthly",
    balloonPayment: 0,
  });

  const [compareMode, setCompareMode] = useState(false);
  const [inputs2, setInputs2] = useState<Inputs>({
    loanAmount: 30000,
    interestRate: 5.5,
    loanTerm: 5,
    frequency: "monthly",
    balloonPayment: 0,
  });

  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(() => calculateCarLoan(inputs), [inputs]);
  const result2 = useMemo(() => (compareMode ? calculateCarLoan(inputs2) : null), [compareMode, inputs2]);

  const chartData = useMemo(() => {
    const periodsPerYear = PERIODS_PER_YEAR[inputs.frequency];
    const data: { year: number; principal: number; interest: number; principal2?: number; interest2?: number }[] = [];

    for (let year = 1; year <= inputs.loanTerm; year++) {
      const endIdx = year * periodsPerYear;
      const startIdx = (year - 1) * periodsPerYear;
      const yearSlice = result.schedule.slice(startIdx, endIdx);
      const yearPrincipal = yearSlice.reduce((sum, r) => sum + r.principal, 0);
      const yearInterest = yearSlice.reduce((sum, r) => sum + r.interest, 0);

      const row: (typeof data)[number] = { year, principal: Math.round(yearPrincipal), interest: Math.round(yearInterest) };

      if (result2) {
        const periodsPerYear2 = PERIODS_PER_YEAR[inputs2.frequency];
        const endIdx2 = year * periodsPerYear2;
        const startIdx2 = (year - 1) * periodsPerYear2;
        if (endIdx2 <= result2.schedule.length) {
          const yearSlice2 = result2.schedule.slice(startIdx2, endIdx2);
          row.principal2 = Math.round(yearSlice2.reduce((sum, r) => sum + r.principal, 0));
          row.interest2 = Math.round(yearSlice2.reduce((sum, r) => sum + r.interest, 0));
        }
      }

      data.push(row);
    }

    return data;
  }, [result, result2, inputs.frequency, inputs.loanTerm, inputs2.frequency]);

  const schedulePage = useMemo(() => {
    const periodsPerYear = PERIODS_PER_YEAR[inputs.frequency];
    const yearly: { year: number; totalPayment: number; totalPrincipal: number; totalInterest: number; endBalance: number }[] = [];

    for (let year = 1; year <= inputs.loanTerm; year++) {
      const endIdx = year * periodsPerYear;
      const startIdx = (year - 1) * periodsPerYear;
      const yearSlice = result.schedule.slice(startIdx, endIdx);
      yearly.push({
        year,
        totalPayment: yearSlice.reduce((s, r) => s + r.payment, 0),
        totalPrincipal: yearSlice.reduce((s, r) => s + r.principal, 0),
        totalInterest: yearSlice.reduce((s, r) => s + r.interest, 0),
        endBalance: yearSlice[yearSlice.length - 1]?.balance ?? 0,
      });
    }

    return yearly;
  }, [result, inputs.frequency, inputs.loanTerm]);

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className={`grid gap-8 ${compareMode ? "md:grid-cols-2" : "md:grid-cols-1 max-w-md"}`}>
          <InputPanel inputs={inputs} onChange={setInputs} label={compareMode ? "Scenario A" : undefined} />
          {compareMode && <InputPanel inputs={inputs2} onChange={setInputs2} label="Scenario B" />}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
          >
            {compareMode ? "✕ Remove comparison" : "＋ Compare a second scenario"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className={`grid gap-6 ${compareMode ? "md:grid-cols-2" : ""}`}>
        <div>
          {compareMode && <h3 className="font-semibold text-gray-700 mb-3">Scenario A</h3>}
          <div className={`grid gap-3 ${inputs.balloonPayment > 0 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
            <ResultCard
              label={`${FREQUENCY_LABELS[inputs.frequency]} Repayment`}
              value={formatCurrencyExact(result.repayment)}
            />
            <ResultCard label="Total Interest" value={formatCurrency(result.totalInterest)} />
            <ResultCard label="Total Cost" value={formatCurrency(result.totalPaid)} />
            {inputs.balloonPayment > 0 && (
              <ResultCard
                label="Balloon Due"
                value={formatCurrency(inputs.balloonPayment)}
                subtext="Lump sum at end of term"
              />
            )}
          </div>
        </div>

        {compareMode && result2 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Scenario B</h3>
            <div className={`grid gap-3 ${inputs2.balloonPayment > 0 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
              <ResultCard
                label={`${FREQUENCY_LABELS[inputs2.frequency]} Repayment`}
                value={formatCurrencyExact(result2.repayment)}
              />
              <ResultCard label="Total Interest" value={formatCurrency(result2.totalInterest)} />
              <ResultCard label="Total Cost" value={formatCurrency(result2.totalPaid)} />
              {inputs2.balloonPayment > 0 && (
                <ResultCard
                  label="Balloon Due"
                  value={formatCurrency(inputs2.balloonPayment)}
                  subtext="Lump sum at end of term"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comparison savings */}
      {compareMode && result2 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Comparison Summary</h3>
          <p className="text-sm text-blue-800">
            {result.totalInterest > result2.totalInterest ? (
              <>
                Scenario B saves you{" "}
                <strong>{formatCurrency(result.totalInterest - result2.totalInterest)}</strong> in
                interest over the life of the loan.
              </>
            ) : result.totalInterest < result2.totalInterest ? (
              <>
                Scenario A saves you{" "}
                <strong>{formatCurrency(result2.totalInterest - result.totalInterest)}</strong> in
                interest over the life of the loan.
              </>
            ) : (
              <>Both scenarios have the same total interest.</>
            )}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Principal vs Interest Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: "Year", position: "insideBottomRight", offset: -5 }} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number | string | (readonly (number | string)[]) | undefined, name: number | string | undefined) => [
                  formatCurrency(Number(value)),
                  name === "principal"
                    ? "Principal (A)"
                    : name === "interest"
                      ? "Interest (A)"
                      : name === "principal2"
                        ? "Principal (B)"
                        : "Interest (B)",
                ]}
              />
              <Legend
                formatter={(value: string) =>
                  value === "principal"
                    ? compareMode ? "Principal (A)" : "Principal"
                    : value === "interest"
                      ? compareMode ? "Interest (A)" : "Interest"
                      : value === "principal2"
                        ? "Principal (B)"
                        : "Interest (B)"
                }
              />
              <Area type="monotone" dataKey="principal" stackId="1" stroke="#1e40af" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="interest" stackId="1" stroke="#f59e0b" fill="#fbbf24" fillOpacity={0.6} />
              {compareMode && (
                <>
                  <Area type="monotone" dataKey="principal2" stackId="2" stroke="#059669" fill="#34d399" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="interest2" stackId="2" stroke="#dc2626" fill="#f87171" fillOpacity={0.4} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Rate Explanation */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-2">Understanding Comparison Rates</h3>
        <p className="text-sm text-amber-800 leading-relaxed mb-3">
          In Australia, lenders are legally required to display a <strong>comparison rate</strong> alongside
          the advertised interest rate. The comparison rate includes the interest rate plus most fees and
          charges, giving you a more accurate picture of the true cost of a loan.
        </p>
        <p className="text-sm text-amber-800 leading-relaxed mb-3">
          For car loans, the comparison rate is calculated on a $30,000 secured loan over 5 years. It
          includes establishment fees, monthly account-keeping fees, and other standard charges. A loan
          advertised at 6.99% might have a comparison rate of 7.5% or higher once fees are factored in.
        </p>
        <p className="text-sm text-amber-800 leading-relaxed">
          Always compare loans using the comparison rate, not just the headline interest rate. This
          calculator shows repayments based on the interest rate you enter — for the most accurate
          estimate, use the comparison rate from your lender&apos;s Product Disclosure Statement.
        </p>
      </div>

      {/* Amortization Schedule */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-semibold text-gray-800">Amortization Schedule (Yearly Summary)</h3>
          <span className="text-gray-400 text-xl">{showSchedule ? "▲" : "▼"}</span>
        </button>

        {showSchedule && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-t border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Year</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Total Payment</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Principal</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Interest</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedulePage.map((row) => (
                  <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{row.year}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(row.totalPayment)}</td>
                    <td className="px-4 py-2 text-right text-blue-700">{formatCurrency(row.totalPrincipal)}</td>
                    <td className="px-4 py-2 text-right text-amber-600">{formatCurrency(row.totalInterest)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(row.endBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Internal Links */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Related Calculators</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">🏠</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Mortgage Calculator</p>
              <p className="text-xs text-gray-500">Calculate home loan repayments</p>
            </div>
          </Link>
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">📈</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Super Calculator</p>
              <p className="text-xs text-gray-500">Project your retirement balance</p>
            </div>
          </Link>
          <Link
            href="/calculators/hecs-help"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">🎓</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">HECS-HELP Calculator</p>
              <p className="text-xs text-gray-500">Student loan repayment estimates</p>
            </div>
          </Link>
          <Link
            href="/calculators/energy-bill"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">⚡</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Energy Bill Calculator</p>
              <p className="text-xs text-gray-500">Estimate electricity and gas costs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
