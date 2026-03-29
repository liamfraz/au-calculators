"use client";
import Link from "next/link";

import { useState, useMemo } from "react";
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
type RepaymentType = "principal-interest" | "interest-only";

interface Inputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  frequency: Frequency;
  repaymentType: RepaymentType;
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

interface BankRate {
  bank: string;
  variable: number;
  fixed1yr: number;
  fixed2yr: number;
  fixed3yr: number;
  comparison: number;
}

const BIG4_RATES: BankRate[] = [
  { bank: "Commonwealth Bank", variable: 6.49, fixed1yr: 5.99, fixed2yr: 6.09, fixed3yr: 6.19, comparison: 6.58 },
  { bank: "Westpac", variable: 6.44, fixed1yr: 5.89, fixed2yr: 6.04, fixed3yr: 6.14, comparison: 6.53 },
  { bank: "ANZ", variable: 6.39, fixed1yr: 5.94, fixed2yr: 6.14, fixed3yr: 6.24, comparison: 6.50 },
  { bank: "NAB", variable: 6.44, fixed1yr: 5.84, fixed2yr: 5.99, fixed3yr: 6.09, comparison: 6.54 },
];

function calculateMortgage(inputs: Inputs): CalcResult {
  const { loanAmount, interestRate, loanTerm, frequency, repaymentType } = inputs;
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const totalPeriods = loanTerm * periodsPerYear;
  const periodicRate = interestRate / 100 / periodsPerYear;

  if (repaymentType === "interest-only") {
    const interestPayment = periodicRate === 0 ? 0 : loanAmount * periodicRate;
    const schedule: AmortizationRow[] = [];
    for (let i = 1; i <= totalPeriods; i++) {
      schedule.push({
        period: i,
        payment: interestPayment,
        principal: 0,
        interest: interestPayment,
        balance: loanAmount,
      });
    }
    const totalPaid = interestPayment * totalPeriods;
    return {
      repayment: interestPayment,
      totalInterest: totalPaid,
      totalPaid: totalPaid + loanAmount,
      schedule,
    };
  }

  if (periodicRate === 0) {
    const repayment = loanAmount / totalPeriods;
    const schedule: AmortizationRow[] = [];
    let balance = loanAmount;
    for (let i = 1; i <= totalPeriods; i++) {
      balance -= repayment;
      schedule.push({
        period: i,
        payment: repayment,
        principal: repayment,
        interest: 0,
        balance: Math.max(0, balance),
      });
    }
    return { repayment, totalInterest: 0, totalPaid: loanAmount, schedule };
  }

  const repayment =
    (loanAmount * (periodicRate * Math.pow(1 + periodicRate, totalPeriods))) /
    (Math.pow(1 + periodicRate, totalPeriods) - 1);

  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;

  for (let i = 1; i <= totalPeriods; i++) {
    const interestPayment = balance * periodicRate;
    const principalPayment = repayment - interestPayment;
    balance -= principalPayment;
    schedule.push({
      period: i,
      payment: repayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  const totalPaid = repayment * totalPeriods;
  const totalInterest = totalPaid - loanAmount;

  return { repayment, totalInterest, totalPaid, schedule };
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
          step={10000}
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
        <div className="flex gap-2 mb-2">
          {[25, 30].map((term) => (
            <button
              key={term}
              onClick={() => onChange({ ...inputs, loanTerm: term })}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                inputs.loanTerm === term
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {term} years
            </button>
          ))}
        </div>
        <input
          type="number"
          value={inputs.loanTerm}
          onChange={(e) => onChange({ ...inputs, loanTerm: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          min={1}
          max={40}
          step={1}
        />
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ ...inputs, repaymentType: "principal-interest" })}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputs.repaymentType === "principal-interest"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Principal & Interest
          </button>
          <button
            onClick={() => onChange({ ...inputs, repaymentType: "interest-only" })}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputs.repaymentType === "interest-only"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Interest Only
          </button>
        </div>
        {inputs.repaymentType === "interest-only" && (
          <p className="text-xs text-amber-600 mt-1">
            Interest-only loans do not reduce the principal. The full loan amount remains owing at term end.
          </p>
        )}
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

function BankRatesTable({ onSelectRate }: { onSelectRate: (rate: number) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Big 4 Bank Reference Rates</h3>
        <p className="text-xs text-gray-500 mt-1">
          Owner-occupier, P&I, $250k+ loan. Rates are indicative only and may change.
          Always confirm with your lender. Last updated March 2026.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Bank</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Variable</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">1yr Fixed</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">2yr Fixed</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">3yr Fixed</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Comparison*</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">Use</th>
            </tr>
          </thead>
          <tbody>
            {BIG4_RATES.map((bank) => (
              <tr key={bank.bank} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{bank.bank}</td>
                <td className="px-4 py-3 text-right">{bank.variable.toFixed(2)}%</td>
                <td className="px-4 py-3 text-right">{bank.fixed1yr.toFixed(2)}%</td>
                <td className="px-4 py-3 text-right">{bank.fixed2yr.toFixed(2)}%</td>
                <td className="px-4 py-3 text-right">{bank.fixed3yr.toFixed(2)}%</td>
                <td className="px-4 py-3 text-right text-gray-500">{bank.comparison.toFixed(2)}%</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onSelectRate(bank.variable)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                    title={`Use ${bank.bank}'s variable rate`}
                  >
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          *Comparison rate based on $150,000 loan over 25 years. WARNING: This comparison rate applies only to the example given. Different loan amounts and terms will result in different comparison rates. Costs such as redraw fees and early repayment costs are not included.
        </p>
      </div>
    </div>
  );
}

export default function MortgageCalculator({
  defaultLoanAmount = 500000,
}: {
  defaultLoanAmount?: number;
}) {
  const [inputs, setInputs] = useState<Inputs>({
    loanAmount: defaultLoanAmount,
    interestRate: 6.2,
    loanTerm: 30,
    frequency: "monthly",
    repaymentType: "principal-interest",
  });

  const [compareMode, setCompareMode] = useState(false);
  const [inputs2, setInputs2] = useState<Inputs>({
    loanAmount: 500000,
    interestRate: 5.5,
    loanTerm: 30,
    frequency: "monthly",
    repaymentType: "principal-interest",
  });

  const [showSchedule, setShowSchedule] = useState(false);
  const [showBankRates, setShowBankRates] = useState(false);

  const result = useMemo(() => calculateMortgage(inputs), [inputs]);
  const result2 = useMemo(() => (compareMode ? calculateMortgage(inputs2) : null), [compareMode, inputs2]);

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

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
          >
            {compareMode ? "Remove comparison" : "Compare a second scenario"}
          </button>
          <button
            onClick={() => setShowBankRates(!showBankRates)}
            className="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
          >
            {showBankRates ? "Hide bank rates" : "View Big 4 bank rates"}
          </button>
        </div>
      </div>

      {/* Bank Rates */}
      {showBankRates && (
        <BankRatesTable
          onSelectRate={(rate) => setInputs({ ...inputs, interestRate: rate })}
        />
      )}

      {/* Results */}
      <div className={`grid gap-6 ${compareMode ? "md:grid-cols-2" : ""}`}>
        <div>
          {compareMode && <h3 className="font-semibold text-gray-700 mb-3">Scenario A</h3>}
          <div className="grid grid-cols-3 gap-3">
            <ResultCard
              label={`${FREQUENCY_LABELS[inputs.frequency]} Repayment`}
              value={formatCurrencyExact(result.repayment)}
            />
            <ResultCard label="Total Interest" value={formatCurrency(result.totalInterest)} />
            <ResultCard
              label="Total Amount Paid"
              value={formatCurrency(result.totalPaid)}
              subtext={inputs.repaymentType === "interest-only" ? "Interest + principal owing" : undefined}
            />
          </div>
        </div>

        {compareMode && result2 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Scenario B</h3>
            <div className="grid grid-cols-3 gap-3">
              <ResultCard
                label={`${FREQUENCY_LABELS[inputs2.frequency]} Repayment`}
                value={formatCurrencyExact(result2.repayment)}
              />
              <ResultCard label="Total Interest" value={formatCurrency(result2.totalInterest)} />
              <ResultCard
                label="Total Amount Paid"
                value={formatCurrency(result2.totalPaid)}
                subtext={inputs2.repaymentType === "interest-only" ? "Interest + principal owing" : undefined}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interest-only warning */}
      {inputs.repaymentType === "interest-only" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-900 mb-1">Interest-Only Loan</h3>
          <p className="text-sm text-amber-800">
            You will still owe the full <strong>{formatCurrency(inputs.loanAmount)}</strong> at the end
            of the {inputs.loanTerm}-year term. Interest-only periods are typically 1-5 years, after which
            the loan reverts to principal and interest repayments at a higher amount.
          </p>
        </div>
      )}

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

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/stamp-duty"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Superannuation Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/car-loan"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Car Loan Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/hecs-help"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">HECS-HELP Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
