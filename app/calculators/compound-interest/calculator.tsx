"use client";
import Link from "next/link";

import { useState, useMemo } from "react";

// --- AU Bank Rate Presets (savings accounts, March 2026) ---

const bankPresets = [
  { name: "CommBank GoalSaver", rate: 4.75 },
  { name: "Westpac Life", rate: 5.0 },
  { name: "NAB iSaver", rate: 5.0 },
  { name: "ANZ Plus Save", rate: 4.9 },
  { name: "ING Savings Maximiser", rate: 5.5 },
  { name: "Custom", rate: 0 },
];

// --- Formatting ---

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

// --- Component ---

export default function CompoundInterestCalculator() {
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(5.0);
  const [years, setYears] = useState(10);
  const [selectedPreset, setSelectedPreset] = useState("Westpac Life");
  const [compoundFrequency, setCompoundFrequency] = useState<"monthly" | "quarterly" | "annually">("monthly");

  function handlePresetChange(presetName: string) {
    setSelectedPreset(presetName);
    const preset = bankPresets.find((p) => p.name === presetName);
    if (preset && preset.name !== "Custom") {
      setAnnualRate(preset.rate);
    }
  }

  const results = useMemo(() => {
    const periodsPerYear = compoundFrequency === "monthly" ? 12 : compoundFrequency === "quarterly" ? 4 : 1;
    const ratePerPeriod = annualRate / 100 / periodsPerYear;
    const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear);

    // Year-by-year breakdown
    const breakdown: {
      year: number;
      startBalance: number;
      contributions: number;
      interest: number;
      endBalance: number;
      endBalanceNoContrib: number;
    }[] = [];

    let balance = initialDeposit;
    let balanceNoContrib = initialDeposit;
    let totalContributions = 0;
    let totalInterest = 0;

    for (let y = 1; y <= years; y++) {
      const startBalance = balance;
      let yearInterest = 0;
      const yearContributions = contributionPerPeriod * periodsPerYear;

      for (let p = 0; p < periodsPerYear; p++) {
        const interestThisPeriod = balance * ratePerPeriod;
        balance += interestThisPeriod + contributionPerPeriod;
        yearInterest += interestThisPeriod;

        balanceNoContrib += balanceNoContrib * ratePerPeriod;
      }

      totalContributions += yearContributions;
      totalInterest += yearInterest;

      breakdown.push({
        year: y,
        startBalance,
        contributions: yearContributions,
        interest: yearInterest,
        endBalance: balance,
        endBalanceNoContrib: balanceNoContrib,
      });
    }

    return {
      finalBalance: balance,
      finalBalanceNoContrib: balanceNoContrib,
      totalContributions,
      totalInterest,
      totalDeposited: initialDeposit + totalContributions,
      breakdown,
    };
  }, [initialDeposit, monthlyContribution, annualRate, years, compoundFrequency]);

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Investment Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Initial Deposit */}
          <div>
            <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Deposit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="initialDeposit"
                type="number"
                min={0}
                step={1000}
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Monthly Contribution */}
          <div>
            <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Contribution
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="monthlyContribution"
                type="number"
                min={0}
                step={50}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bank Preset */}
          <div>
            <label htmlFor="bankPreset" className="block text-sm font-medium text-gray-700 mb-1">
              AU Bank Rate Preset
            </label>
            <select
              id="bankPreset"
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {bankPresets.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}{preset.name !== "Custom" ? ` (${preset.rate}% p.a.)` : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Rates are indicative and subject to change</p>
          </div>

          {/* Interest Rate */}
          <div>
            <label htmlFor="annualRate" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Interest Rate (%)
            </label>
            <div className="relative">
              <input
                id="annualRate"
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={annualRate}
                onChange={(e) => {
                  setAnnualRate(Math.max(0, Number(e.target.value)));
                  setSelectedPreset("Custom");
                }}
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          {/* Years */}
          <div>
            <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-1">
              Investment Period (Years)
            </label>
            <input
              id="years"
              type="number"
              min={1}
              max={50}
              step={1}
              value={years}
              onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Compound Frequency */}
          <div>
            <label htmlFor="compoundFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              Compounding Frequency
            </label>
            <select
              id="compoundFrequency"
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value as "monthly" | "quarterly" | "annually")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-green-200 bg-green-50 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Final Balance</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(results.finalBalance)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Total Deposited</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.totalDeposited)}</p>
        </div>
        <div className="border border-blue-200 bg-blue-50 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Total Interest Earned</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.totalInterest)}</p>
        </div>
      </div>

      {/* With vs Without Contributions */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">
          Impact of Monthly Contributions
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">With {formatCurrency(monthlyContribution)}/month contributions</span>
            <span className="font-bold text-green-600 text-lg">{formatCurrency(results.finalBalance)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Without contributions (deposit only)</span>
            <span className="font-bold text-gray-900 text-lg">{formatCurrency(results.finalBalanceNoContrib)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-medium text-gray-900">Difference from contributions</span>
            <span className="font-bold text-blue-600 text-lg">
              +{formatCurrency(results.finalBalance - results.finalBalanceNoContrib)}
            </span>
          </div>
        </div>
      </div>

      {/* Year-by-Year Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Year-by-Year Breakdown
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          See how your savings grow each year at {annualRate}% p.a. with {formatCurrency(monthlyContribution)}/month contributions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Year</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Start Balance</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Contributions</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Interest</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">End Balance</th>
              </tr>
            </thead>
            <tbody>
              {results.breakdown.map((row) => (
                <tr
                  key={row.year}
                  className={`border-b border-gray-100 ${row.year === years ? "bg-blue-50" : ""}`}
                >
                  <td className="py-2 pr-4">
                    <span className={`font-medium ${row.year === years ? "text-blue-800" : "text-gray-900"}`}>
                      {row.year}
                    </span>
                    {row.year === years && (
                      <span className="text-xs text-blue-600 ml-2">Final</span>
                    )}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrencyExact(row.startBalance)}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrency(row.contributions)}
                  </td>
                  <td className="text-right py-2 px-4 font-medium text-blue-600">
                    {formatCurrencyExact(row.interest)}
                  </td>
                  <td className="text-right py-2 pl-4 font-medium text-green-600">
                    {formatCurrencyExact(row.endBalance)}
                  </td>
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
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Superannuation Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Mortgage Repayment Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/tax-withholding-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Income Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/rental-yield"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Rental Yield Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
