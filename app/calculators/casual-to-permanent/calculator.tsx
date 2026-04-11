"use client";

import { useState } from "react";
import Link from "next/link";

interface Results {
  monthsEmployed: number;
  isEligible: boolean;
  permanentRate: number;
  casualAnnual: number;
  permanentAnnual: number;
  annualLeaveValue: number;
  sickLeaveValue: number;
  casualAnnualWithLeave: number;
  takehomeDifference: number;
  hoursPerWeek: number;
  casualHourlyRate: number;
  industry: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CasualToPermanentCalculator() {
  const [startDate, setStartDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [industry, setIndustry] = useState("retail");
  const [casualHourlyRate, setCasualHourlyRate] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    if (!startDate || !hoursPerWeek || !casualHourlyRate) return;

    const hours = parseFloat(hoursPerWeek) || 0;
    const rate = parseFloat(casualHourlyRate) || 0;

    // Calculate months employed
    const startDateObj = new Date(startDate);
    const today = new Date();
    const monthsEmployed = Math.floor(
      (today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    );

    // Eligibility: 12+ months employed
    const isEligible = monthsEmployed >= 12;

    // Permanent hourly rate (remove 25% casual loading)
    const permanentRate = rate / 1.25;

    // Annual earnings
    const casualAnnual = rate * hours * 52;
    const permanentAnnual = permanentRate * hours * 52;

    // Annual leave: 4 weeks (NES entitlement)
    const annualLeaveValue = permanentRate * hours * 4;

    // Personal/Sick leave: 10 days per year
    // For part-time: pro-rata based on ordinary hours
    const hoursPerDay = hours / 5;
    const sickLeaveValue = hoursPerDay * 10 * permanentRate;

    // Annual take-home scenario:
    // Casual (working 46 weeks, 4 weeks holiday + 2 weeks sick unpaid): casualHourlyRate * hoursPerWeek * 46
    // Permanent (paid for all 52 weeks): permanentAnnual
    const casualAnnualWithLeave = rate * hours * 46;
    const takehomeDifference = casualAnnualWithLeave - permanentAnnual;

    setResults({
      monthsEmployed,
      isEligible,
      permanentRate,
      casualAnnual,
      permanentAnnual,
      annualLeaveValue,
      sickLeaveValue,
      casualAnnualWithLeave,
      takehomeDifference,
      hoursPerWeek: hours,
      casualHourlyRate: rate,
      industry,
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
              Employment Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">When you started as casual</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average Hours Per Week
            </label>
            <input
              type="number"
              step="0.5"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              placeholder="e.g. 20"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Your ordinary hours</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Casual Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={casualHourlyRate}
              onChange={(e) => setCasualHourlyRate(e.target.value)}
              placeholder="e.g. 25.50"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Includes casual loading</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="retail">Retail</option>
              <option value="hospitality">Hospitality</option>
              <option value="admin">Administration</option>
              <option value="construction">Construction</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          Calculate Conversion
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-6 space-y-4">
          {/* Eligibility Verdict */}
          {results.isEligible ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                Eligibility Verdict
              </h3>
              <p className="text-green-800 mb-2">
                <span className="font-semibold">You are likely eligible for casual conversion.</span> You have been employed for {results.monthsEmployed} months, exceeding the 12-month threshold required by the Fair Work Act.
              </p>
              <p className="text-sm text-green-700">
                <strong>Important:</strong> Regular, systematic pattern of work is also required. This calculator assumes your hours represent a regular pattern. You have the right to request conversion to permanent employment.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Not Yet Eligible
              </h3>
              <p className="text-amber-800 mb-2">
                You need <strong>{12 - results.monthsEmployed} more months</strong> to reach the 12-month eligibility threshold for casual conversion under the Fair Work Act.
              </p>
              <p className="text-sm text-amber-700">
                Continue building your employment history. Once you reach 12 months with a regular and systematic pattern of work, you can request conversion.
              </p>
            </div>
          )}

          {/* Side-by-side Comparison Table */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Casual vs. Permanent Comparison
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-3 font-medium text-gray-700">Benefit</th>
                  <th className="py-3 font-medium text-gray-700">Casual</th>
                  <th className="py-3 font-medium text-gray-700">Permanent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 text-gray-900 font-medium">Hourly Rate</td>
                  <td className="py-3 text-gray-600">{formatCurrency(results.casualHourlyRate)}</td>
                  <td className="py-3 text-gray-600">{formatCurrency(results.permanentRate)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900 font-medium">Annual Earnings (52 weeks)</td>
                  <td className="py-3 text-gray-600">{formatCurrency(results.casualAnnual)}</td>
                  <td className="py-3 text-gray-600">{formatCurrency(results.permanentAnnual)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900 font-medium">Annual Leave Entitlement</td>
                  <td className="py-3 text-gray-600">None (included in loading)</td>
                  <td className="py-3 text-gray-600">{formatCurrency(results.annualLeaveValue)} (4 weeks)</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900 font-medium">Personal/Sick Leave</td>
                  <td className="py-3 text-gray-600">None</td>
                  <td className="py-3 text-gray-600">{formatCurrency(results.sickLeaveValue)} (10 days)</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900 font-medium">Job Security</td>
                  <td className="py-3 text-gray-600">None</td>
                  <td className="py-3 text-gray-600">Protected after 12 months</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900 font-medium">Notice Period</td>
                  <td className="py-3 text-gray-600">None required</td>
                  <td className="py-3 text-gray-600">Minimum 1&ndash;4 weeks</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900 font-medium">Unfair Dismissal Protection</td>
                  <td className="py-3 text-gray-600">Not applicable</td>
                  <td className="py-3 text-gray-600">Protected after 12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Annual Take-Home Scenario */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Annual Take-Home Scenario
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              If both you and a permanent employee take 4 weeks annual leave + 10 days sick leave per year:
            </p>
            <div className="space-y-3 bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Casual (46 weeks worked)</span>
                <span className="font-semibold text-lg">{formatCurrency(results.casualAnnualWithLeave)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Permanent (52 weeks paid)</span>
                <span className="font-semibold text-lg">{formatCurrency(results.permanentAnnual)}</span>
              </div>
              <div className="border-t border-blue-100 pt-3 flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Difference</span>
                <span className={`font-bold text-lg ${results.takehomeDifference > 0 ? "text-orange-700" : "text-green-700"}`}>
                  {results.takehomeDifference > 0 ? "+" : ""}{formatCurrency(Math.abs(results.takehomeDifference))}
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-800 mt-4">
              {results.takehomeDifference > 0
                ? `As a casual, you earn approximately ${formatCurrency(results.takehomeDifference)} more per year in this scenario, because you don't receive paid leave. However, you lose job security and statutory protections.`
                : `As a permanent employee, you earn approximately ${formatCurrency(Math.abs(results.takehomeDifference))} more per year in this scenario because you're paid for all 52 weeks, including annual and sick leave.`}
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Recommendation</h3>
            {results.isEligible ? (
              <>
                {results.takehomeDifference > 5000 ? (
                  <p className="text-blue-800">
                    The casual premium is significant at approximately {formatCurrency(results.takehomeDifference)} per year. Before converting, carefully consider your job security needs versus the financial trade-off. However, permanent employment provides statutory protections, notice requirements, and unfair dismissal rights that casual employment does not offer.
                  </p>
                ) : (
                  <p className="text-blue-800">
                    The financial difference is modest at approximately {formatCurrency(Math.abs(results.takehomeDifference))} per year. Converting to permanent employment gives you job security, paid leave entitlements, and full National Employment Standard protections&mdash;significant benefits beyond just base earnings.
                  </p>
                )}
              </>
            ) : (
              <p className="text-blue-800">
                Continue building your employment history. You need {12 - results.monthsEmployed} more months of continuous employment with a regular and systematic pattern of work before you can request casual conversion.
              </p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex gap-3">
            <span className="text-yellow-600 text-lg shrink-0">⚠</span>
            <p className="text-sm text-yellow-800">
              <strong>Fair Work Disclaimer:</strong> This calculator provides general information. Casual conversion laws are complex and vary by industry, modern award, and enterprise agreement. Your industry award may provide different entitlements or eligibility criteria. For personalised advice, contact Fair Work Ombudsman (1300 654 415) or speak to a workplace lawyer.
            </p>
          </div>

          {/* Related Calculators */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/calculators/redundancy-payout"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Redundancy Pay Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
