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

// --- Formatting ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// --- Calculation ---

interface YearRow {
  age: number;
  year: number;
  employerContributions: number;
  voluntaryContributions: number;
  investmentReturns: number;
  balance: number;
  contributionsTotal: number;
  investmentGrowth: number;
}

interface ProjectionResult {
  rows: YearRow[];
  retirementBalance: number;
  annualIncomeRetirement: number;
  yearsToRetirement: number;
  totalEmployerContributions: number;
  totalVoluntaryContributions: number;
  totalInvestmentReturns: number;
  meetsASFASingle: boolean;
  meetsASFACouple: boolean;
}

const ASFA_SINGLE = 51278;
const ASFA_COUPLE = 72148;

function calculateProjection(
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  salary: number,
  sgRate: number,
  extraContributions: number,
  returnRate: number
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

    // Employer SG contribution
    const employerContrib = salary * (sgRate / 100);
    totalEmployerContribs += employerContrib;

    // Voluntary contribution
    const voluntaryContrib = extraContributions * 12;
    totalVoluntaryContribs += voluntaryContrib;

    // Total contributions this year
    const totalContribThisYear = employerContrib + voluntaryContrib;

    // Investment return (mid-year approximation: average of start and end balance)
    const avgBalance = balance + totalContribThisYear / 2;
    const investmentReturn = avgBalance * (returnRate / 100);
    totalInvestmentReturns += investmentReturn;

    // New balance
    balance = balance + totalContribThisYear + investmentReturn;

    // Track cumulative for stacked chart
    const cumulativeContribs = totalEmployerContribs + totalVoluntaryContribs;
    const cumulativeInvestment = totalInvestmentReturns;

    rows.push({
      age,
      year,
      employerContributions: employerContrib,
      voluntaryContributions: voluntaryContrib,
      investmentReturns: investmentReturn,
      balance: Math.round(balance),
      contributionsTotal: Math.round(cumulativeContribs),
      investmentGrowth: Math.round(cumulativeInvestment),
    });
  }

  const annualIncomeRetirement = balance * 0.04;
  const meetsASFASingle = annualIncomeRetirement >= ASFA_SINGLE;
  const meetsASFACouple = annualIncomeRetirement >= ASFA_COUPLE;

  return {
    rows,
    retirementBalance: balance,
    annualIncomeRetirement,
    yearsToRetirement,
    totalEmployerContributions: totalEmployerContribs,
    totalVoluntaryContributions: totalVoluntaryContribs,
    totalInvestmentReturns: totalInvestmentReturns,
    meetsASFASingle,
    meetsASFACouple,
  };
}

// --- Component ---

export default function SuperannuationRetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(67);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [salary, setSalary] = useState(85000);
  const [sgRate, setSgRate] = useState(11.5);
  const [extraContributions, setExtraContributions] = useState(0);
  const [returnRate, setReturnRate] = useState(7);
  const [retirementType, setRetirementType] = useState<"single" | "couple">(
    "single"
  );

  const results = useMemo(
    () =>
      calculateProjection(
        currentAge,
        retirementAge,
        currentBalance,
        salary,
        sgRate,
        extraContributions,
        returnRate
      ),
    [currentAge, retirementAge, currentBalance, salary, sgRate, extraContributions, returnRate]
  );

  const asfalThreshold =
    retirementType === "single" ? ASFA_SINGLE : ASFA_COUPLE;
  const asfalProgress = Math.min(
    (results.annualIncomeRetirement / asfalThreshold) * 100,
    100
  );
  const asfalProgressColor =
    asfalProgress >= 100 ? "bg-green-500" : asfalProgress >= 60 ? "bg-amber-500" : "bg-red-500";
  const asfalBgColor =
    asfalProgress >= 100
      ? "bg-green-50 border-green-200"
      : asfalProgress >= 60
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200";

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Your Details
        </h2>

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
              Employer SG Rate (%): <span className="text-blue-600">{sgRate.toFixed(1)}</span>%
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
              Extra Voluntary Contributions ($/mo): {formatCurrency(extraContributions * 12)}
              /yr
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={extraContributions}
              onChange={(e) => setExtraContributions(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="0"
              max="5000"
              step="50"
              value={extraContributions}
              onChange={(e) => setExtraContributions(Number(e.target.value))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Return Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Investment Return (% p.a.): <span className="text-blue-600">{returnRate.toFixed(1)}</span>%
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

          {/* Retirement Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Retirement Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="retirement-type"
                  value="single"
                  checked={retirementType === "single"}
                  onChange={(e) =>
                    setRetirementType(e.target.value as "single" | "couple")
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Single</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="retirement-type"
                  value="couple"
                  checked={retirementType === "couple"}
                  onChange={(e) =>
                    setRetirementType(e.target.value as "single" | "couple")
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Couple</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Result Card */}
      <div className="bg-blue-700 rounded-xl p-6 text-white text-center">
        <p className="text-sm text-blue-100 mb-2">Projected Balance at Retirement (Age {retirementAge})</p>
        <p className="text-4xl font-bold">{formatCurrency(results.retirementBalance)}</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Annual Retirement Income</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(results.annualIncomeRetirement)}
          </p>
          <p className="text-xs text-gray-400 mt-1">(4% rule)</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Years to Retirement</p>
          <p className="text-lg font-bold text-gray-900">{results.yearsToRetirement}</p>
          <p className="text-xs text-gray-400 mt-1">years</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Total Employer SG</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(results.totalEmployerContributions)}
          </p>
          <p className="text-xs text-gray-400 mt-1">contributions</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
          <p className="text-xs text-gray-500 mb-1">Total Investment Returns</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(results.totalInvestmentReturns)}
          </p>
          <p className="text-xs text-gray-400 mt-1">growth</p>
        </div>
      </div>

      {/* ASFA Comparison */}
      <div className={`border border-gray-200 rounded-xl p-6 ${asfalBgColor}`}>
        <h3 className="font-semibold text-gray-900 mb-4">ASFA Comfortable Retirement Standard</h3>

        <div className="space-y-4">
          {/* Single */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Single: $51,278/yr
                {results.meetsASFASingle ? (
                  <span className="ml-2 text-green-600">✓</span>
                ) : (
                  <span className="ml-2 text-red-600">✗</span>
                )}
              </span>
              <span className="text-sm text-gray-600">
                {formatCurrency(results.annualIncomeRetirement)}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  results.annualIncomeRetirement >= ASFA_SINGLE
                    ? "bg-green-500"
                    : results.annualIncomeRetirement >= ASFA_SINGLE * 0.6
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${Math.min((results.annualIncomeRetirement / ASFA_SINGLE) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Couple */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Couple: $72,148/yr
                {results.meetsASFACouple ? (
                  <span className="ml-2 text-green-600">✓</span>
                ) : (
                  <span className="ml-2 text-red-600">✗</span>
                )}
              </span>
              <span className="text-sm text-gray-600">
                {formatCurrency(results.annualIncomeRetirement)}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  results.annualIncomeRetirement >= ASFA_COUPLE
                    ? "bg-green-500"
                    : results.annualIncomeRetirement >= ASFA_COUPLE * 0.6
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${Math.min((results.annualIncomeRetirement / ASFA_COUPLE) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {results.meetsASFASingle && retirementType === "single" && (
          <p className="text-sm text-green-700 mt-4">
            Your projected income of {formatCurrency(results.annualIncomeRetirement)}/yr meets
            the comfortable retirement standard for a single person.
          </p>
        )}
        {results.meetsASFACouple && retirementType === "couple" && (
          <p className="text-sm text-green-700 mt-4">
            Your projected income of {formatCurrency(results.annualIncomeRetirement)}/yr meets
            the comfortable retirement standard for a couple.
          </p>
        )}
        {!results.meetsASFASingle && retirementType === "single" && (
          <p className="text-sm text-amber-700 mt-4">
            Your projected income is {formatCurrency(ASFA_SINGLE - results.annualIncomeRetirement)} short of the comfortable
            retirement standard. Consider increasing contributions or extending your working life.
          </p>
        )}
        {!results.meetsASFACouple && retirementType === "couple" && (
          <p className="text-sm text-amber-700 mt-4">
            Your projected income is {formatCurrency(ASFA_COUPLE - results.annualIncomeRetirement)} short of the comfortable
            retirement standard. Consider increasing contributions or extending your working life.
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Super Balance Over Time</h3>
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
            <strong>Access Age:</strong> You cannot access your super until age 55 (rising to 60 by
            2024) except in limited circumstances (severe financial hardship, terminal illness, etc.).
            From your preservation age until age 60, you can access super as a transition-to-retirement
            income stream.
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
