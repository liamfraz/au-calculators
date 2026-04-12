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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface YearRow {
  age: number;
  year: number;
  employerContributions: number;
  voluntaryContributions: number;
  investmentReturns: number;
  balance: number;
  realBalance: number;
  contributionsTotal: number;
  investmentGrowth: number;
}

interface ProjectionResult {
  rows: YearRow[];
  retirementBalance: number;
  realRetirementBalance: number;
  monthlyIncome: number;
  yearsToRetirement: number;
  totalEmployerContributions: number;
  totalVoluntaryContributions: number;
  totalInvestmentReturns: number;
}

function calculateProjection(
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  salary: number,
  sgRate: number,
  extraContributionsPerYear: number,
  returnRate: number,
  inflationRate: number
): ProjectionResult {
  const rows: YearRow[] = [];
  let balance = currentBalance;
  let totalEmployerContribs = 0;
  let totalVoluntaryContribs = 0;
  let totalInvestmentReturns = 0;

  const yearsToRetirement = retirementAge - currentAge;

  for (let i = 1; i <= yearsToRetirement; i++) {
    const age = currentAge + i;
    const year = new Date().getFullYear() + i;

    const employerContrib = salary * (sgRate / 100);
    totalEmployerContribs += employerContrib;

    const voluntaryContrib = extraContributionsPerYear;
    totalVoluntaryContribs += voluntaryContrib;

    const totalContribThisYear = employerContrib + voluntaryContrib;

    // Mid-year approximation for investment return
    const avgBalance = balance + totalContribThisYear / 2;
    const investmentReturn = avgBalance * (returnRate / 100);
    totalInvestmentReturns += investmentReturn;

    balance = balance + totalContribThisYear + investmentReturn;

    // Real (inflation-adjusted) balance in today's dollars
    const realBalance = balance / Math.pow(1 + inflationRate / 100, i);

    const cumulativeContribs = totalEmployerContribs + totalVoluntaryContribs;
    const cumulativeInvestment = totalInvestmentReturns;

    rows.push({
      age,
      year,
      employerContributions: employerContrib,
      voluntaryContributions: voluntaryContrib,
      investmentReturns: investmentReturn,
      balance: Math.round(balance),
      realBalance: Math.round(realBalance),
      contributionsTotal: Math.round(cumulativeContribs),
      investmentGrowth: Math.round(cumulativeInvestment),
    });
  }

  // Real balance at retirement
  const realRetirementBalance = balance / Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Monthly income via annuity formula (20 years, using investment return rate)
  const monthlyRate = returnRate / 12 / 100;
  const n = 240; // 20 years × 12 months
  const monthlyIncome =
    monthlyRate > 0
      ? (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n))
      : balance / n;

  return {
    rows,
    retirementBalance: Math.round(balance),
    realRetirementBalance: Math.round(realRetirementBalance),
    monthlyIncome: Math.round(monthlyIncome),
    yearsToRetirement,
    totalEmployerContributions: Math.round(totalEmployerContribs),
    totalVoluntaryContributions: Math.round(totalVoluntaryContribs),
    totalInvestmentReturns: Math.round(totalInvestmentReturns),
  };
}

export default function SuperannuationRetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(67);
  const [currentBalance, setCurrentBalance] = useState(25000);
  const [salary, setSalary] = useState(80000);
  const [sgRate, setSgRate] = useState(11.5);
  const [extraContributions, setExtraContributions] = useState(0);
  const [returnRate, setReturnRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);

  const results = useMemo(
    () =>
      calculateProjection(
        currentAge,
        retirementAge,
        currentBalance,
        salary,
        sgRate,
        extraContributions,
        returnRate,
        inflationRate
      ),
    [currentAge, retirementAge, currentBalance, salary, sgRate, extraContributions, returnRate, inflationRate]
  );

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Age: <span className="text-blue-600">{currentAge}</span>
            </label>
            <input
              type="range"
              min="18"
              max="65"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="18"
              max="65"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Retirement Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retirement Age: <span className="text-blue-600">{retirementAge}</span>
            </label>
            <input
              type="range"
              min="55"
              max="75"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="55"
              max="75"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Current Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Super Balance: {formatCurrency(currentBalance)}
            </label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="1000"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="0"
              max="2000000"
              step="1000"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Salary: {formatCurrency(salary)}
            </label>
            <input
              type="range"
              min="20000"
              max="500000"
              step="1000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="20000"
              max="500000"
              step="1000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* SG Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employer SG Rate: <span className="text-blue-600">{sgRate.toFixed(1)}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="15"
              step="0.5"
              value={sgRate}
              onChange={(e) => setSgRate(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="5"
              max="15"
              step="0.5"
              value={sgRate}
              onChange={(e) => setSgRate(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Extra Contributions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Voluntary Contributions ($/year): {formatCurrency(extraContributions)}
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={extraContributions}
              onChange={(e) => setExtraContributions(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="0"
              max="50000"
              step="500"
              value={extraContributions}
              onChange={(e) => setExtraContributions(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Return Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Investment Return: <span className="text-blue-600">{returnRate.toFixed(1)}% p.a.</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="1"
              max="15"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Inflation Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Inflation: <span className="text-blue-600">{inflationRate.toFixed(2)}% p.a.</span>
            </label>
            <input
              type="range"
              min="0"
              max="8"
              step="0.25"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="0"
              max="8"
              step="0.25"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Hero Result Card — nominal + real */}
      <div className="bg-blue-700 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Projected Balance at Retirement (Age {retirementAge})</p>
            <p className="text-4xl font-bold">{formatCurrency(results.retirementBalance)}</p>
            <p className="text-xs text-blue-200 mt-1">Nominal (future dollars)</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Real Value (Today&apos;s Dollars)</p>
            <p className="text-4xl font-bold">{formatCurrency(results.realRetirementBalance)}</p>
            <p className="text-xs text-blue-200 mt-1">Inflation-adjusted at {inflationRate.toFixed(2)}% p.a.</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Monthly Income (20 yrs)</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(results.monthlyIncome)}</p>
          <p className="text-xs text-gray-400 mt-1">annuity formula</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Years to Retirement</p>
          <p className="text-lg font-bold text-gray-900">{results.yearsToRetirement}</p>
          <p className="text-xs text-gray-400 mt-1">years</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Total Employer SG</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(results.totalEmployerContributions)}</p>
          <p className="text-xs text-gray-400 mt-1">contributions</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Total Investment Returns</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(results.totalInvestmentReturns)}</p>
          <p className="text-xs text-gray-400 mt-1">growth</p>
        </div>
      </div>

      {/* Chart */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Super Balance Growth Curve</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={results.rows}>
            <defs>
              <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="age"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              label={{ value: "Age", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              tickFormatter={(v) => {
                if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                return `$${v}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Age ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="contributionsTotal"
              stackId="1"
              stroke="#1e40af"
              fillOpacity={1}
              fill="url(#colorContributions)"
              name="Cumulative Contributions"
            />
            <Area
              type="monotone"
              dataKey="investmentGrowth"
              stackId="1"
              stroke="#059669"
              fillOpacity={1}
              fill="url(#colorReturns)"
              name="Investment Growth"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Year-by-Year Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Year-by-Year Projection</h3>
          <p className="text-xs text-gray-500 mt-1">Nominal vs real (inflation-adjusted) balance over time</p>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Age</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Year</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Balance (Nominal)</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Balance (Real)</th>
              </tr>
            </thead>
            <tbody>
              {results.rows.map((row) => (
                <tr key={row.age} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{row.age}</td>
                  <td className="px-4 py-2 text-gray-500">{row.year}</td>
                  <td className="px-4 py-2 text-right text-gray-900 font-medium">{formatCurrency(row.balance)}</td>
                  <td className="px-4 py-2 text-right text-blue-700">{formatCurrency(row.realBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Education Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">How Super Works in Australia</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong>Employer Guarantee (SG) Rate:</strong> Your employer must contribute a percentage
            of your ordinary time earnings to your superannuation. For 2025–26, this rate is 11.5%,
            rising to 12% from 1 July 2026. This is compulsory and separate from your salary.
          </p>
          <p>
            <strong>Contribution Caps (2025–26):</strong> Concessional contributions (salary sacrifice,
            employer SG) are capped at $30,000 per financial year. Non-concessional contributions
            (after-tax voluntary contributions) are capped at $120,000 per year, or $540,000 under the
            bring-forward rule over 3 years.
          </p>
          <p>
            <strong>Tax Benefits:</strong> Super contributions and earnings are taxed at a lower rate
            (15%) than personal income tax (up to 45%), making super a tax-effective savings vehicle.
            Investment returns inside your super are taxed at 15%, compared to your marginal tax rate
            outside super.
          </p>
          <p>
            <strong>Monthly Income (Annuity Formula):</strong> This calculator uses the present value
            annuity formula to estimate the monthly income your balance could fund for 20 years at your
            chosen investment return rate: PMT = PV × r / (1 − (1+r)^−240), where r is the monthly
            return rate and 240 = 20 years of monthly payments.
          </p>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/super"
            className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <p className="font-medium text-gray-900">Super Contribution Calculator</p>
            <p className="text-xs text-gray-500">Calculate tax-effective contributions</p>
          </Link>
          <Link
            href="/calculators/smsf-balance-projection"
            className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <p className="font-medium text-gray-900">SMSF Balance Projection</p>
            <p className="text-xs text-gray-500">Project self-managed fund balance</p>
          </Link>
          <Link
            href="/calculators/income-tax"
            className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <p className="font-medium text-gray-900">Income Tax Calculator</p>
            <p className="text-xs text-gray-500">Estimate your tax liability</p>
          </Link>
          <Link
            href="/calculators/compound-interest"
            className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <p className="font-medium text-gray-900">Compound Interest Calculator</p>
            <p className="text-xs text-gray-500">See how your money grows</p>
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 italic">
        This is a general estimate only — not financial advice. Projections assume constant salary,
        return rate, and contributions with no fees or tax deducted. Actual results will vary. Consult a
        financial adviser for personalised advice.
      </p>
    </div>
  );
}
