"use client";

import { useState } from "react";
import Link from "next/link";

interface Results {
  yearsOfService: number;
  weeksEntitled: number;
  weeklyEarnings: number;
  totalPayout: number;
  taxFreeThreshold: number;
  taxableAmount: number;
  isGenuineRedundancy: boolean;
  age: number;
}

// Fair Work redundancy scale (weeks)
function getRedundancyWeeks(yearsOfService: number): number {
  const scale: { years: number; weeks: number }[] = [
    { years: 1, weeks: 3 },
    { years: 2, weeks: 4 },
    { years: 3, weeks: 6 },
    { years: 4, weeks: 7 },
    { years: 5, weeks: 8 },
    { years: 6, weeks: 10 },
    { years: 7, weeks: 11 },
    { years: 8, weeks: 11 },
    { years: 9, weeks: 11 },
    { years: 10, weeks: 12 },
  ];

  if (yearsOfService <= 0) return 0;
  if (yearsOfService >= 10) return 12;

  const wholeYears = Math.floor(yearsOfService);
  const fractionalPart = yearsOfService - wholeYears;

  if (wholeYears === 0) {
    // Between 0 and 1 year: interpolate from 0 to 3 weeks
    return fractionalPart * 3;
  }

  // Find the bracket
  const currentWeeks = scale[wholeYears - 1]?.weeks || 0;
  const nextWeeks = scale[wholeYears]?.weeks || 12;

  // Interpolate between this year and next
  return currentWeeks + fractionalPart * (nextWeeks - currentWeeks);
}

function getTaxFreeThreshold(yearsOfService: number, isGenuineRedundancy: boolean): number {
  if (!isGenuineRedundancy) return 0;
  const wholeYears = Math.floor(yearsOfService);
  return 12524 + 6264 * wholeYears;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RedundancyPayoutCalculator() {
  const [yearsOfService, setYearsOfService] = useState("");
  const [weeklyEarnings, setWeeklyEarnings] = useState("");
  const [age, setAge] = useState("");
  const [isGenuineRedundancy, setIsGenuineRedundancy] = useState(true);
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const years = parseFloat(yearsOfService) || 0;
    const weekly = parseFloat(weeklyEarnings) || 0;
    const userAge = parseFloat(age) || 0;

    if (!yearsOfService || !weeklyEarnings || !age) return;

    const weeksEntitled = getRedundancyWeeks(years);
    const totalPayout = weeksEntitled * weekly;
    const taxFreeThreshold = getTaxFreeThreshold(years, isGenuineRedundancy);
    const taxableAmount = Math.max(0, totalPayout - taxFreeThreshold);

    setResults({
      yearsOfService: years,
      weeksEntitled,
      weeklyEarnings: weekly,
      totalPayout,
      taxFreeThreshold,
      taxableAmount,
      isGenuineRedundancy,
      age: userAge,
    });
  }

  return (
    <div>
      {/* Input Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Service
            </label>
            <input
              type="number"
              step="0.5"
              value={yearsOfService}
              onChange={(e) => setYearsOfService(e.target.value)}
              placeholder="e.g. 5.5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Decimals OK (e.g. 3.5 years)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Ordinary Time Earnings ($)
            </label>
            <input
              type="number"
              value={weeklyEarnings}
              onChange={(e) => setWeeklyEarnings(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Base pay, excluding bonuses or allowances</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Age
              <span className="text-gray-400 font-normal ml-1">(used for tax context)</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 35"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genuine Redundancy?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsGenuineRedundancy(true)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  isGenuineRedundancy
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsGenuineRedundancy(false)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  !isGenuineRedundancy
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                No
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Affects tax-free threshold eligibility</p>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          Calculate Redundancy Payout
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-6 space-y-4">
          {/* Summary Grid */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Your Redundancy Entitlements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">Weeks Entitled</p>
                <p className="text-xl font-bold text-blue-900">
                  {results.weeksEntitled.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">Weekly Earnings</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(results.weeklyEarnings)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">Total Payout</p>
                <p className="text-xl font-bold text-green-700">
                  {formatCurrency(results.totalPayout)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">Your Age</p>
                <p className="text-xl font-bold text-blue-900">{results.age}</p>
              </div>
            </div>
          </div>

          {/* Enterprise Agreement Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <span className="text-amber-600 text-lg shrink-0">📋</span>
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Check your enterprise agreement</p>
              <p>
                This uses Fair Work minimums — many enterprise agreements and modern awards provide
                <strong> higher entitlements</strong>. Your agreement may also include redundancy
                bonuses, extended notice periods, or other benefits.
              </p>
            </div>
          </div>

          {/* Tax-Free Threshold (if genuine redundancy) */}
          {results.isGenuineRedundancy && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                Tax-Free Redundancy Threshold
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-green-800 mb-2">
                    <span className="font-semibold">Formula:</span> $12,524 + ($6,264 × whole years of service)
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-gray-500">
                      $12,524 + ($6,264 × {Math.floor(results.yearsOfService)}) ={" "}
                      <span className="font-semibold text-green-900">
                        {formatCurrency(results.taxFreeThreshold)}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-green-800">
                  Redundancy payouts up to this amount are <strong>tax-free</strong>. Amounts above
                  this threshold are taxed at your marginal income tax rate.
                </p>
              </div>
            </div>
          )}

          {/* Taxable Amount (if applicable) */}
          {results.isGenuineRedundancy && results.taxableAmount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Estimated Taxable Portion
              </h3>
              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <p className="text-sm text-orange-800 mb-3">
                  The amount <strong>above</strong> your tax-free threshold is taxable:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payout</span>
                    <span className="font-medium">{formatCurrency(results.totalPayout)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Less: Tax-free threshold</span>
                    <span className="font-medium">−{formatCurrency(results.taxFreeThreshold)}</span>
                  </div>
                  <div className="border-t border-orange-100 pt-2 flex justify-between text-sm font-semibold">
                    <span>Taxable amount</span>
                    <span className="text-orange-700">{formatCurrency(results.taxableAmount)}</span>
                  </div>
                </div>
                <p className="text-xs text-orange-700 mt-3">
                  This amount will be taxed at your marginal tax rate (your income tax bracket).
                </p>
              </div>
            </div>
          )}

          {/* Detailed Breakdown Table */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Breakdown</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-600">Years of Service</td>
                  <td className="py-2 text-right font-medium">{results.yearsOfService.toFixed(1)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Fair Work Entitlement</td>
                  <td className="py-2 text-right font-medium">{results.weeksEntitled.toFixed(1)} weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Weekly Ordinary Time Earnings</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(results.weeklyEarnings)}</td>
                </tr>
                <tr className="font-semibold bg-blue-50">
                  <td className="py-2 text-gray-900">Redundancy Payout</td>
                  <td className="py-2 text-right text-blue-900">{formatCurrency(results.totalPayout)}</td>
                </tr>
                {results.isGenuineRedundancy && (
                  <>
                    <tr>
                      <td className="py-2 text-gray-600">Tax-Free Threshold</td>
                      <td className="py-2 text-right font-medium">
                        {formatCurrency(results.taxFreeThreshold)}
                      </td>
                    </tr>
                    <tr className="font-semibold bg-green-50">
                      <td className="py-2 text-gray-900">Taxable Amount</td>
                      <td className="py-2 text-right text-green-900">
                        {formatCurrency(results.taxableAmount)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Fair Work Scale Explanation */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Fair Work Redundancy Scale
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              The National Employment Standards set minimum redundancy pay based on years of service.
              These are the <strong>minimum entitlements</strong> — most enterprise agreements and awards
              provide higher payments.
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 font-medium">Years of Service</th>
                  <th className="py-2 font-medium">Weeks of Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-900">Less than 1 year</td>
                  <td className="py-2 text-gray-600">Pro-rata (1–3 weeks)</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900">1 year</td>
                  <td className="py-2 text-gray-600">3 weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900">2 years</td>
                  <td className="py-2 text-gray-600">4 weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900">3 years</td>
                  <td className="py-2 text-gray-600">6 weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900">4 years</td>
                  <td className="py-2 text-gray-600">7 weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900">5 years</td>
                  <td className="py-2 text-gray-600">8 weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900">6 years</td>
                  <td className="py-2 text-gray-600">10 weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-900">7–9 years</td>
                  <td className="py-2 text-gray-600">11 weeks</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-2 text-gray-900 font-semibold">10+ years</td>
                  <td className="py-2 text-gray-600 font-semibold">12 weeks (capped)</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">
              Note: For partial years, the calculator interpolates linearly between values (e.g. 3.5 years
              = 6.5 weeks). The entitlement is capped at 12 weeks.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex gap-3">
            <span className="text-yellow-600 text-lg shrink-0">⚠</span>
            <p className="text-sm text-yellow-800">
              <strong>This is an estimate</strong> — redundancy laws are complex and vary by state, industry,
              and employment agreement. Speak to Fair Work (1300 654 415) or a workplace lawyer for your
              specific situation. This calculator uses Fair Work Act minimums for the 2025-26 financial year.
            </p>
          </div>

          {/* Related Calculators */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/calculators/income-tax"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Income Tax Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
              <Link
                href="/calculators/super"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Superannuation Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
              <Link
                href="/calculators/capital-gains-tax"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Capital Gains Tax Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
