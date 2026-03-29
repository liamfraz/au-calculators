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
  vehiclePrice: number;
  deposit: number;
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
  loanAmount: number;
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

function calculateCarLoan(
  vehiclePrice: number,
  deposit: number,
  interestRate: number,
  loanTerm: number,
  frequency: Frequency,
  balloonPayment: number
): CalcResult {
  const loanAmount = Math.max(0, vehiclePrice - deposit);
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const totalPeriods = loanTerm * periodsPerYear;
  const periodicRate = interestRate / 100 / periodsPerYear;
  const balloon = Math.min(balloonPayment, loanAmount);

  if (loanAmount <= 0) {
    return { repayment: 0, totalInterest: 0, totalPaid: 0, loanAmount: 0, schedule: [] };
  }

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
    return { repayment, totalInterest: 0, totalPaid: loanAmount, loanAmount, schedule };
  }

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

  return { repayment, totalInterest, totalPaid, loanAmount, schedule };
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
    vehiclePrice: 35000,
    deposit: 5000,
    interestRate: 7.5,
    loanTerm: 5,
    frequency: "monthly",
    balloonPayment: 0,
  });

  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(
    () =>
      calculateCarLoan(
        inputs.vehiclePrice,
        inputs.deposit,
        inputs.interestRate,
        inputs.loanTerm,
        inputs.frequency,
        inputs.balloonPayment
      ),
    [inputs]
  );

  const rateComparison = useMemo(() => {
    const rates = [
      { label: `${(inputs.interestRate - 1).toFixed(1)}%`, rate: inputs.interestRate - 1 },
      { label: `${inputs.interestRate.toFixed(1)}% (current)`, rate: inputs.interestRate },
      { label: `${(inputs.interestRate + 1).toFixed(1)}%`, rate: inputs.interestRate + 1 },
    ];
    return rates
      .filter((r) => r.rate > 0)
      .map((r) => {
        const res = calculateCarLoan(
          inputs.vehiclePrice,
          inputs.deposit,
          r.rate,
          inputs.loanTerm,
          inputs.frequency,
          inputs.balloonPayment
        );
        return {
          label: r.label,
          rate: r.rate,
          repayment: res.repayment,
          totalInterest: res.totalInterest,
          totalCost: res.totalPaid,
        };
      });
  }, [inputs]);

  const chartData = useMemo(() => {
    const periodsPerYear = PERIODS_PER_YEAR[inputs.frequency];
    const data: { year: number; principal: number; interest: number }[] = [];

    for (let year = 1; year <= inputs.loanTerm; year++) {
      const endIdx = year * periodsPerYear;
      const startIdx = (year - 1) * periodsPerYear;
      const yearSlice = result.schedule.slice(startIdx, endIdx);
      const yearPrincipal = yearSlice.reduce((sum, r) => sum + r.principal, 0);
      const yearInterest = yearSlice.reduce((sum, r) => sum + r.interest, 0);
      data.push({ year, principal: Math.round(yearPrincipal), interest: Math.round(yearInterest) });
    }

    return data;
  }, [result, inputs.frequency, inputs.loanTerm]);

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

  const update = (partial: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Price: {formatCurrency(inputs.vehiclePrice)}
            </label>
            <input
              type="range"
              value={inputs.vehiclePrice}
              onChange={(e) => update({ vehiclePrice: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              min={5000}
              max={150000}
              step={1000}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$5,000</span>
              <span>$150,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deposit: {formatCurrency(inputs.deposit)}
            </label>
            <input
              type="range"
              value={inputs.deposit}
              onChange={(e) => update({ deposit: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              min={0}
              max={Math.min(inputs.vehiclePrice, 100000)}
              step={500}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$0</span>
              <span>{formatCurrency(Math.min(inputs.vehiclePrice, 100000))}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <p className="text-sm text-blue-800">
            Loan amount: <strong>{formatCurrency(result.loanAmount)}</strong>
            <span className="text-blue-600 ml-1">
              ({formatCurrency(inputs.vehiclePrice)} − {formatCurrency(inputs.deposit)} deposit)
            </span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate: {inputs.interestRate.toFixed(2)}%
            <span className="font-normal text-gray-400 ml-1">(AU avg ~7.5%)</span>
          </label>
          <input
            type="range"
            value={inputs.interestRate}
            onChange={(e) => update({ interestRate: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            min={1}
            max={15}
            step={0.1}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span>
            <span>15%</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
            <select
              value={inputs.loanTerm}
              onChange={(e) => update({ loanTerm: Number(e.target.value) })}
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
              onChange={(e) => update({ frequency: e.target.value as Frequency })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
                <option key={f} value={f}>
                  {FREQUENCY_LABELS[f]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balloon Payment ($)
            <span className="font-normal text-gray-400 ml-1">optional</span>
          </label>
          <input
            type="number"
            value={inputs.balloonPayment}
            onChange={(e) => update({ balloonPayment: Math.max(0, Number(e.target.value)) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            min={0}
            step={1000}
          />
          <p className="text-xs text-gray-400 mt-1">
            A lump sum due at the end of the loan term. Reduces regular repayments but increases total interest.
          </p>
        </div>
      </div>

      {/* Results */}
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

      {/* Rate Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Rate Comparison</h3>
          <p className="text-xs text-gray-500 mt-1">
            See how a 1% change in interest rate affects your repayments
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Interest Rate</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  {FREQUENCY_LABELS[inputs.frequency]} Repayment
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Total Interest</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {rateComparison.map((row) => (
                <tr
                  key={row.rate}
                  className={`border-t border-gray-100 ${
                    row.rate === inputs.interestRate
                      ? "bg-blue-50 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-800">{row.label}</td>
                  <td className="px-4 py-3 text-right">{formatCurrencyExact(row.repayment)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(row.totalInterest)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(row.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  name === "principal" ? "Principal" : "Interest",
                ]}
              />
              <Legend
                formatter={(value: string) => (value === "principal" ? "Principal" : "Interest")}
              />
              <Area type="monotone" dataKey="principal" stackId="1" stroke="#1e40af" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="interest" stackId="1" stroke="#f59e0b" fill="#fbbf24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Rate Explanation + ASIC MoneySmart */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-2">Understanding Comparison Rates</h3>
        <p className="text-sm text-amber-800 leading-relaxed mb-3">
          In Australia, lenders are legally required to display a <strong>comparison rate</strong> alongside
          the advertised interest rate under the National Consumer Credit Protection Act 2009. The
          comparison rate includes the interest rate plus most fees and charges, giving you a more
          accurate picture of the true cost of a loan.
        </p>
        <p className="text-sm text-amber-800 leading-relaxed mb-3">
          For car loans, the comparison rate is calculated on a $30,000 secured loan over 5 years.
          A loan advertised at 6.99% might have a comparison rate of 7.5% or higher once
          establishment fees and monthly account-keeping fees are factored in. Always compare loans
          using the comparison rate, not just the headline interest rate.
        </p>
        <p className="text-sm text-amber-800 leading-relaxed">
          For independent car finance guidance, visit{" "}
          <a
            href="https://moneysmart.gov.au/car-loans"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-900 underline font-medium hover:text-amber-700"
          >
            ASIC MoneySmart — Car Loans
          </a>
          .
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

      {/* Related Calculators */}
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
            href="/calculators/stamp-duty"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">📋</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Stamp Duty Calculator</p>
              <p className="text-xs text-gray-500">Transfer duty for all states</p>
            </div>
          </Link>
          <Link
            href="/calculators/compound-interest"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xl">💹</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Compound Interest Calculator</p>
              <p className="text-xs text-gray-500">Grow your savings over time</p>
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
        </div>
      </div>
    </div>
  );
}
