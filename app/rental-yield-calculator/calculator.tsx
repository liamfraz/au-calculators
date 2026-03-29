"use client";
import Link from "next/link";
import { useState, useMemo } from "react";

// --- Formatting ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function yieldColor(yieldPct: number): string {
  if (yieldPct >= 5) return "text-green-600";
  if (yieldPct >= 3) return "text-blue-600";
  return "text-orange-600";
}

function yieldBorderBg(yieldPct: number): string {
  if (yieldPct >= 5) return "border-green-200 bg-green-50";
  if (yieldPct >= 3) return "border-blue-200 bg-blue-50";
  return "border-orange-200 bg-orange-50";
}

function cashFlowColor(value: number): string {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-gray-900";
}

// --- Mortgage calculation ---

function calculateMonthlyRepayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

// --- Capital city typical yields ---

const CAPITAL_CITY_YIELDS = [
  { city: "Sydney", house: 2.8, unit: 4.0, median: "$1,200,000" },
  { city: "Melbourne", house: 3.0, unit: 4.3, median: "$900,000" },
  { city: "Brisbane", house: 3.8, unit: 5.2, median: "$780,000" },
  { city: "Perth", house: 4.2, unit: 5.5, median: "$680,000" },
  { city: "Adelaide", house: 3.6, unit: 4.8, median: "$720,000" },
  { city: "Hobart", house: 3.9, unit: 4.6, median: "$650,000" },
  { city: "Darwin", house: 5.4, unit: 6.2, median: "$530,000" },
  { city: "Canberra", house: 3.5, unit: 5.0, median: "$850,000" },
];

// --- Component ---

export default function RentalYieldFullCalculator() {
  // Property
  const [purchasePrice, setPurchasePrice] = useState(650000);
  const [weeklyRent, setWeeklyRent] = useState(550);

  // Annual expenses
  const [councilRates, setCouncilRates] = useState(2000);
  const [strata, setStrata] = useState(0);
  const [insurance, setInsurance] = useState(1500);
  const [managementFeePct, setManagementFeePct] = useState(7);
  const [maintenancePct, setMaintenancePct] = useState(1);
  const [vacancyWeeks, setVacancyWeeks] = useState(2);

  // Loan
  const [depositPct, setDepositPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.2);
  const [loanTerm, setLoanTerm] = useState(30);

  const results = useMemo(() => {
    const annualRent = weeklyRent * 52;
    const vacancyCost = weeklyRent * vacancyWeeks;
    const effectiveRent = annualRent - vacancyCost;
    const managementFee = Math.round(effectiveRent * (managementFeePct / 100));
    const maintenanceCost = Math.round(purchasePrice * (maintenancePct / 100));

    const totalExpenses =
      councilRates + strata + insurance + managementFee + maintenanceCost + vacancyCost;

    // Yields
    const grossYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
    const netRentalIncome = annualRent - totalExpenses;
    const netYield = purchasePrice > 0 ? (netRentalIncome / purchasePrice) * 100 : 0;

    // Loan
    const depositAmount = Math.round(purchasePrice * (depositPct / 100));
    const loanAmount = purchasePrice - depositAmount;
    const monthlyRepayment = calculateMonthlyRepayment(loanAmount, interestRate, loanTerm);
    const annualMortgage = monthlyRepayment * 12;

    // Cash flow
    const annualCashFlow = netRentalIncome - annualMortgage;
    const monthlyCashFlow = annualCashFlow / 12;

    // Cash-on-cash return (cash flow / total cash invested)
    // Total cash invested = deposit + stamp duty estimate (~4%) + other buying costs (~1.5%)
    const estimatedBuyingCosts = Math.round(purchasePrice * 0.055);
    const totalCashInvested = depositAmount + estimatedBuyingCosts;
    const cashOnCash =
      totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

    // Break-even weekly rent (rent where annual cash flow = 0)
    // annualRent - totalExpenses - annualMortgage = 0
    // weeklyRent * 52 - expenses(weeklyRent) - annualMortgage = 0
    // Let R = weekly rent. Effective rent = R*52 - R*vacancyWeeks = R*(52-vacancyWeeks)
    // Management = R*(52-vacancyWeeks) * mgmtPct/100
    // So: R*52 - (councilRates + strata + insurance + R*(52-vacancyWeeks)*mgmtPct/100 + purchasePrice*maintPct/100 + R*vacancyWeeks) - annualMortgage = 0
    // R*52 - R*vacancyWeeks - R*(52-vacancyWeeks)*mgmtPct/100 = councilRates + strata + insurance + purchasePrice*maintPct/100 + annualMortgage
    // R * [52 - vacancyWeeks - (52-vacancyWeeks)*mgmtPct/100] = fixedCosts + annualMortgage
    const fixedCosts = councilRates + strata + insurance + maintenanceCost;
    const rentMultiplier =
      52 - vacancyWeeks - (52 - vacancyWeeks) * (managementFeePct / 100);
    const breakEvenWeeklyRent =
      rentMultiplier > 0
        ? Math.ceil((fixedCosts + annualMortgage) / rentMultiplier)
        : 0;

    return {
      annualRent,
      grossYield,
      totalExpenses,
      netRentalIncome,
      netYield,
      depositAmount,
      loanAmount,
      monthlyRepayment,
      annualMortgage,
      annualCashFlow,
      monthlyCashFlow,
      totalCashInvested,
      cashOnCash,
      breakEvenWeeklyRent,
      managementFee,
      maintenanceCost,
      vacancyCost,
    };
  }, [
    purchasePrice,
    weeklyRent,
    councilRates,
    strata,
    insurance,
    managementFeePct,
    maintenancePct,
    vacancyWeeks,
    depositPct,
    interestRate,
    loanTerm,
  ]);

  return (
    <div className="space-y-8">
      {/* Property Details */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="purchasePrice"
                type="number"
                min={0}
                step={10000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="weeklyRent" className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Rent
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="weeklyRent"
                type="number"
                min={0}
                step={10}
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Annual Expenses */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Annual Expenses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="councilRates" className="block text-sm font-medium text-gray-700 mb-1">
              Council Rates
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="councilRates"
                type="number"
                min={0}
                step={100}
                value={councilRates}
                onChange={(e) => setCouncilRates(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="strata" className="block text-sm font-medium text-gray-700 mb-1">
              Strata / Body Corp
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="strata"
                type="number"
                min={0}
                step={100}
                value={strata}
                onChange={(e) => setStrata(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
              Landlord Insurance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="insurance"
                type="number"
                min={0}
                step={100}
                value={insurance}
                onChange={(e) => setInsurance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="managementFeePct" className="block text-sm font-medium text-gray-700 mb-1">
              Property Management Fee
            </label>
            <div className="relative">
              <input
                id="managementFeePct"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={managementFeePct}
                onChange={(e) => setManagementFeePct(Math.max(0, Math.min(20, Number(e.target.value))))}
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              of rent — typically 7-10%
            </p>
          </div>
          <div>
            <label htmlFor="maintenancePct" className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance
            </label>
            <div className="relative">
              <input
                id="maintenancePct"
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={maintenancePct}
                onChange={(e) => setMaintenancePct(Math.max(0, Math.min(5, Number(e.target.value))))}
                className="w-full pr-14 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">% value</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              of property value — typically 1%
            </p>
          </div>
          <div>
            <label htmlFor="vacancyWeeks" className="block text-sm font-medium text-gray-700 mb-1">
              Vacancy
            </label>
            <div className="relative">
              <input
                id="vacancyWeeks"
                type="number"
                min={0}
                max={26}
                step={1}
                value={vacancyWeeks}
                onChange={(e) => setVacancyWeeks(Math.max(0, Math.min(26, Number(e.target.value))))}
                className="w-full pr-16 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">wks/yr</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              typically 2-4 weeks per year
            </p>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Loan Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="depositPct" className="block text-sm font-medium text-gray-700 mb-1">
              Deposit
            </label>
            <div className="relative">
              <input
                id="depositPct"
                type="number"
                min={0}
                max={100}
                step={1}
                value={depositPct}
                onChange={(e) => setDepositPct(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(results.depositAmount)} deposit, {formatCurrency(results.loanAmount)} loan
            </p>
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate
            </label>
            <div className="relative">
              <input
                id="interestRate"
                type="number"
                min={0}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Math.min(15, Number(e.target.value))))}
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term
            </label>
            <div className="relative">
              <input
                id="loanTerm"
                type="number"
                min={1}
                max={40}
                step={1}
                value={loanTerm}
                onChange={(e) => setLoanTerm(Math.max(1, Math.min(40, Number(e.target.value))))}
                className="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className={`border rounded-xl p-5 text-center ${yieldBorderBg(results.grossYield)}`}>
          <p className="text-sm text-gray-500 mb-1">Gross Yield</p>
          <p className={`text-2xl font-bold ${yieldColor(results.grossYield)}`}>
            {formatPercent(results.grossYield)}
          </p>
        </div>
        <div className={`border rounded-xl p-5 text-center ${yieldBorderBg(results.netYield)}`}>
          <p className="text-sm text-gray-500 mb-1">Net Yield</p>
          <p className={`text-2xl font-bold ${yieldColor(results.netYield)}`}>
            {formatPercent(results.netYield)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Annual Cash Flow</p>
          <p className={`text-2xl font-bold ${cashFlowColor(results.annualCashFlow)}`}>
            {formatCurrency(Math.round(results.annualCashFlow))}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Monthly Cash Flow</p>
          <p className={`text-2xl font-bold ${cashFlowColor(results.monthlyCashFlow)}`}>
            {formatCurrency(Math.round(results.monthlyCashFlow))}
          </p>
        </div>
        <div className={`border rounded-xl p-5 text-center ${yieldBorderBg(results.cashOnCash)}`}>
          <p className="text-sm text-gray-500 mb-1">Cash-on-Cash Return</p>
          <p className={`text-2xl font-bold ${yieldColor(results.cashOnCash)}`}>
            {formatPercent(results.cashOnCash)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Break-Even Rent</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(results.breakEvenWeeklyRent)}/wk
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Income & Expenses */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Income &amp; Expenses</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Rent (52 weeks)</span>
              <span className="font-medium">{formatCurrency(results.annualRent)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Expenses</p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Council Rates</span>
              <span className="font-medium text-red-600">-{formatCurrency(councilRates)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Strata / Body Corp</span>
              <span className="font-medium text-red-600">-{formatCurrency(strata)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance</span>
              <span className="font-medium text-red-600">-{formatCurrency(insurance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Management ({managementFeePct}%)</span>
              <span className="font-medium text-red-600">-{formatCurrency(results.managementFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maintenance ({maintenancePct}%)</span>
              <span className="font-medium text-red-600">-{formatCurrency(results.maintenanceCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vacancy ({vacancyWeeks} wks)</span>
              <span className="font-medium text-red-600">-{formatCurrency(results.vacancyCost)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span>Total Expenses</span>
              <span className="text-red-600">-{formatCurrency(results.totalExpenses)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Net Rental Income</span>
              <span className={cashFlowColor(results.netRentalIncome)}>
                {formatCurrency(results.netRentalIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Mortgage & Cash Flow */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Mortgage &amp; Cash Flow</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Amount</span>
              <span className="font-medium">{formatCurrency(results.loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Repayment</span>
              <span className="font-medium">{formatCurrency(Math.round(results.monthlyRepayment))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Mortgage Cost</span>
              <span className="font-medium text-red-600">-{formatCurrency(Math.round(results.annualMortgage))}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span>Annual Cash Flow</span>
              <span className={cashFlowColor(results.annualCashFlow)}>
                {formatCurrency(Math.round(results.annualCashFlow))}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Monthly Cash Flow</span>
              <span className={cashFlowColor(results.monthlyCashFlow)}>
                {formatCurrency(Math.round(results.monthlyCashFlow))}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Return on Cash</p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deposit</span>
              <span className="font-medium">{formatCurrency(results.depositAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Buying Costs (~5.5%)</span>
              <span className="font-medium">{formatCurrency(results.totalCashInvested - results.depositAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cash Invested</span>
              <span className="font-medium">{formatCurrency(results.totalCashInvested)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Cash-on-Cash Return</span>
              <span className={cashFlowColor(results.cashOnCash)}>
                {formatPercent(results.cashOnCash)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Capital City Yields */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Typical Rental Yields by Capital City
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Approximate gross yields based on recent market data. Actual yields vary by suburb and property type.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">City</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Houses</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Units</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Median Price</th>
              </tr>
            </thead>
            <tbody>
              {CAPITAL_CITY_YIELDS.map((row) => (
                <tr key={row.city} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-900">{row.city}</td>
                  <td className={`text-right py-2 px-4 font-medium ${yieldColor(row.house)}`}>
                    {row.house.toFixed(1)}%
                  </td>
                  <td className={`text-right py-2 px-4 font-medium ${yieldColor(row.unit)}`}>
                    {row.unit.toFixed(1)}%
                  </td>
                  <td className="text-right py-2 pl-4 text-gray-600">{row.median}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            href="/calculators/capital-gains-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Capital Gains Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/negative-gearing"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Mortgage Repayment Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
