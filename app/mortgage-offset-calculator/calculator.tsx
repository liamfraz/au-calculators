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

// --- Formatting ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} month${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${y} year${y !== 1 ? "s" : ""}`;
  return `${y} yr${y !== 1 ? "s" : ""} ${m} mo`;
}

// --- Calculation ---

interface AmortRow {
  year: number;
  interestNoOffset: number;
  interestWithOffset: number;
  balanceNoOffset: number;
  balanceWithOffset: number;
}

function calculateOffset(
  loanAmount: number,
  annualRate: number,
  termYears: number,
  offsetBalance: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;

  if (loanAmount <= 0 || annualRate <= 0 || termYears <= 0) {
    return {
      monthlyRepayment: 0,
      totalInterestNoOffset: 0,
      totalInterestWithOffset: 0,
      totalSavings: 0,
      monthsSavedRaw: 0,
      yearlyData: [],
    };
  }

  // Monthly repayment (P&I) — stays the same regardless of offset
  const monthlyRepayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Amortise WITHOUT offset
  let balanceNo = loanAmount;
  let totalInterestNo = 0;
  const yearlyInterestNo: number[] = [];
  const yearlyBalanceNo: number[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    const interest = balanceNo * monthlyRate;
    totalInterestNo += interest;
    balanceNo = Math.max(0, balanceNo + interest - monthlyRepayment);
    if (m % 12 === 0) {
      yearlyInterestNo.push(totalInterestNo);
      yearlyBalanceNo.push(balanceNo);
    }
  }

  // Amortise WITH offset
  let balanceWith = loanAmount;
  let totalInterestWith = 0;
  let paidOffMonth = totalMonths;
  const yearlyInterestWith: number[] = [];
  const yearlyBalanceWith: number[] = [];
  let paidOff = false;

  for (let m = 1; m <= totalMonths; m++) {
    if (paidOff) {
      if (m % 12 === 0) {
        yearlyInterestWith.push(totalInterestWith);
        yearlyBalanceWith.push(0);
      }
      continue;
    }
    // Interest only accrues on (balance - offset)
    const effectiveBalance = Math.max(0, balanceWith - offsetBalance);
    const interest = effectiveBalance * monthlyRate;
    totalInterestWith += interest;
    // The full repayment still applies — more goes to principal
    balanceWith = Math.max(0, balanceWith + interest - monthlyRepayment);
    if (balanceWith <= 0 && !paidOff) {
      paidOff = true;
      paidOffMonth = m;
    }
    if (m % 12 === 0) {
      yearlyInterestWith.push(totalInterestWith);
      yearlyBalanceWith.push(Math.max(0, balanceWith));
    }
  }

  const monthsSaved = totalMonths - paidOffMonth;

  const yearlyData: AmortRow[] = [];
  const years = Math.max(yearlyInterestNo.length, yearlyInterestWith.length);
  for (let i = 0; i < years; i++) {
    yearlyData.push({
      year: i + 1,
      interestNoOffset: Math.round(yearlyInterestNo[i] ?? totalInterestNo),
      interestWithOffset: Math.round(
        yearlyInterestWith[i] ?? totalInterestWith
      ),
      balanceNoOffset: Math.round(yearlyBalanceNo[i] ?? 0),
      balanceWithOffset: Math.round(yearlyBalanceWith[i] ?? 0),
    });
  }

  return {
    monthlyRepayment,
    totalInterestNoOffset: totalInterestNo,
    totalInterestWithOffset: totalInterestWith,
    totalSavings: totalInterestNo - totalInterestWith,
    monthsSavedRaw: monthsSaved,
    yearlyData,
  };
}

// --- AU Bank offset products ---

const OFFSET_PRODUCTS = [
  {
    bank: "Commonwealth Bank",
    product: "Wealth Package",
    rate: "6.49%",
    offsetPct: "100%",
    fee: "$395/yr",
  },
  {
    bank: "ANZ",
    product: "ANZ Plus Home Loan",
    rate: "6.34%",
    offsetPct: "100%",
    fee: "$0",
  },
  {
    bank: "Westpac",
    product: "Premier Advantage",
    rate: "6.49%",
    offsetPct: "100%",
    fee: "$395/yr",
  },
  {
    bank: "NAB",
    product: "Choice Package",
    rate: "6.44%",
    offsetPct: "100%",
    fee: "$395/yr",
  },
  {
    bank: "Macquarie Bank",
    product: "Basic Home Loan",
    rate: "6.25%",
    offsetPct: "100%",
    fee: "$0",
  },
];

// --- Component ---

export default function MortgageOffsetCalculator() {
  const [loanAmount, setLoanAmount] = useState(600000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [offsetBalance, setOffsetBalance] = useState(50000);
  const [showComparison, setShowComparison] = useState(false);

  const results = useMemo(
    () => calculateOffset(loanAmount, interestRate, loanTerm, offsetBalance),
    [loanAmount, interestRate, loanTerm, offsetBalance]
  );

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Loan &amp; Offset Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Loan Amount */}
          <div>
            <label
              htmlFor="loanAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="loanAmount"
                type="number"
                min={100000}
                max={2000000}
                step={10000}
                value={loanAmount}
                onChange={(e) =>
                  setLoanAmount(
                    Math.max(100000, Math.min(2000000, Number(e.target.value)))
                  )
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$100K</span>
              <span>$2M</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label
              htmlFor="interestRate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Interest Rate
            </label>
            <div className="relative">
              <input
                id="interestRate"
                type="number"
                min={4}
                max={8}
                step={0.1}
                value={interestRate}
                onChange={(e) =>
                  setInterestRate(
                    Math.max(4, Math.min(8, Number(e.target.value)))
                  )
                }
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={8}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>4%</span>
              <span>8%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label
              htmlFor="loanTerm"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loan Term
            </label>
            <div className="relative">
              <input
                id="loanTerm"
                type="number"
                min={15}
                max={30}
                step={1}
                value={loanTerm}
                onChange={(e) =>
                  setLoanTerm(
                    Math.max(15, Math.min(30, Number(e.target.value)))
                  )
                }
                className="w-full pr-14 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                years
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={30}
              step={1}
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>15 yrs</span>
              <span>30 yrs</span>
            </div>
          </div>

          {/* Offset Balance */}
          <div>
            <label
              htmlFor="offsetBalance"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Offset Account Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="offsetBalance"
                type="number"
                min={0}
                max={500000}
                step={5000}
                value={offsetBalance}
                onChange={(e) =>
                  setOffsetBalance(
                    Math.max(0, Math.min(500000, Number(e.target.value)))
                  )
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={5000}
              value={offsetBalance}
              onChange={(e) => setOffsetBalance(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$0</span>
              <span>$500K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Monthly Repayment</p>
          <p className="text-2xl font-bold text-blue-800">
            {formatCurrency(Math.round(results.monthlyRepayment))}
          </p>
          <p className="text-xs text-gray-400 mt-1">same with or without offset</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Interest Without Offset</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(Math.round(results.totalInterestNoOffset))}
          </p>
        </div>
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-gray-500 mb-1">Interest With Offset</p>
          <p className="text-2xl font-bold text-blue-800">
            {formatCurrency(Math.round(results.totalInterestWithOffset))}
          </p>
        </div>
        <div className="border border-green-200 rounded-xl p-5 bg-green-50 text-center col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500 mb-1">Total Interest Saved</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(Math.round(results.totalSavings))}
          </p>
        </div>
        <div className="border border-green-200 rounded-xl p-5 bg-green-50 text-center col-span-2 sm:col-span-2">
          <p className="text-sm text-gray-500 mb-1">Time Saved on Loan</p>
          <p className="text-2xl font-bold text-green-600">
            {results.monthsSavedRaw > 0
              ? formatYears(results.monthsSavedRaw)
              : "0 months"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            paid off in{" "}
            {formatYears(loanTerm * 12 - results.monthsSavedRaw)} instead of{" "}
            {loanTerm} years
          </p>
        </div>
      </div>

      {/* Chart: Interest over time */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Cumulative Interest Paid Over Time
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={results.yearlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: "Year", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                tickFormatter={(v) =>
                  `$${(v / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "interestNoOffset"
                    ? "Without Offset"
                    : "With Offset",
                ]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend
                formatter={(value) =>
                  value === "interestNoOffset"
                    ? "Without Offset"
                    : "With Offset"
                }
              />
              <Area
                type="monotone"
                dataKey="interestNoOffset"
                stroke="#ef4444"
                fill="#fecaca"
                fillOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="interestWithOffset"
                stroke="#3b82f6"
                fill="#bfdbfe"
                fillOpacity={0.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          The gap between the two lines represents your total interest savings
          from the offset account.
        </p>
      </div>

      {/* Offset vs Redraw Comparison */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-semibold text-gray-900">
            Offset Account vs Redraw Facility
          </h3>
          <span className="text-gray-400">{showComparison ? "▲" : "▼"}</span>
        </button>
        {showComparison && (
          <div className="px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-medium text-gray-700">
                      Feature
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-blue-700">
                      Offset Account
                    </th>
                    <th className="text-left py-3 pl-4 font-medium text-gray-700">
                      Redraw Facility
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      How it works
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      Separate transaction account linked to your loan. Balance
                      offsets the loan principal for interest calculation.
                    </td>
                    <td className="py-3 pl-4 text-gray-600">
                      Extra repayments sit inside the loan. You can redraw them
                      if needed.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      Access to funds
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      Full transactional access — debit card, transfers, BPay.
                      Money is always yours.
                    </td>
                    <td className="py-3 pl-4 text-gray-600">
                      Must apply to redraw. Some lenders restrict access or
                      charge fees.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      Interest savings
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      100% offset — every dollar reduces interest calculated
                      daily.
                    </td>
                    <td className="py-3 pl-4 text-gray-600">
                      Same interest benefit while funds remain in the loan.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      Tax implications
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      No interest earned, so no tax payable. Ideal for
                      investment property owners preserving tax deductibility.
                    </td>
                    <td className="py-3 pl-4 text-gray-600">
                      Redrawing on an investment loan can change the tax
                      deductibility of the interest.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      Typical fees
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      Often comes with package loans ($0-$395/yr). May have a
                      slightly higher rate.
                    </td>
                    <td className="py-3 pl-4 text-gray-600">
                      Usually free with basic variable loans. No package fee
                      required.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      Best for
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      Salary parking, emergency funds, investment property
                      owners, people with large savings.
                    </td>
                    <td className="py-3 pl-4 text-gray-600">
                      Borrowers making extra repayments who want a low-cost
                      option.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Key difference for investors:</strong> If you redraw
                from an investment loan and use the funds for personal expenses,
                the ATO may reclassify that portion of the loan as
                non-deductible. An offset account avoids this risk entirely
                because the loan balance never actually changes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AU Bank Offset Products */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Australian Banks with 100% Offset Accounts
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Major bank home loan products offering full offset. Rates are variable
          and subject to change — always check the lender&apos;s website.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">
                  Bank
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">
                  Product
                </th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">
                  Rate
                </th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">
                  Offset
                </th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">
                  Annual Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {OFFSET_PRODUCTS.map((row) => (
                <tr
                  key={row.bank}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 pr-4 font-medium text-gray-900">
                    {row.bank}
                  </td>
                  <td className="py-2 px-4 text-gray-600">{row.product}</td>
                  <td className="py-2 px-4 text-right font-medium text-blue-700">
                    {row.rate}
                  </td>
                  <td className="py-2 px-4 text-center text-green-600 font-medium">
                    {row.offsetPct}
                  </td>
                  <td className="py-2 pl-4 text-right text-gray-600">
                    {row.fee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Rates shown are indicative variable rates as of early 2026. CBA =
          Commonwealth Bank of Australia. All products include a 100% offset
          sub-account.
        </p>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">
          Related Calculators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Mortgage Repayment Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/stamp-duty-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Stamp Duty Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/rental-yield-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Rental Yield Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/property-cashflow"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">
              Property Cash Flow Calculator
            </span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
