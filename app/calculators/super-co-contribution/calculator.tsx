"use client";

import { useState, useMemo } from "react";

// --- Government Co-contribution Rules 2024-25 ---
// ATO source: ato.gov.au/super/co-contribution

const LOWER_THRESHOLD = 45400;   // Full rate below this income
const UPPER_THRESHOLD = 60400;   // Phases out to $0 at this income
const MAX_CO_CONTRIBUTION = 500; // Maximum government payment
const CO_CONTRIBUTION_RATE = 0.5; // 50 cents per $1 contributed

function calculateCoContribution(income: number, personalContribution: number): {
  coContribution: number;
  maxEntitlement: number;
  phaseOutApplied: boolean;
} {
  if (income >= UPPER_THRESHOLD || personalContribution <= 0) {
    return { coContribution: 0, maxEntitlement: 0, phaseOutApplied: false };
  }

  let maxEntitlement: number;
  let phaseOutApplied = false;

  if (income <= LOWER_THRESHOLD) {
    maxEntitlement = MAX_CO_CONTRIBUTION;
  } else {
    // Phase-out: reduces proportionally between lower and upper threshold
    maxEntitlement =
      MAX_CO_CONTRIBUTION * ((UPPER_THRESHOLD - income) / (UPPER_THRESHOLD - LOWER_THRESHOLD));
    phaseOutApplied = true;
  }

  // Co-contribution = lesser of 50% of personal contribution OR entitlement maximum
  const coContribution = Math.min(
    Math.round(personalContribution * CO_CONTRIBUTION_RATE),
    Math.round(maxEntitlement)
  );

  return { coContribution, maxEntitlement: Math.round(maxEntitlement), phaseOutApplied };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyDecimal(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SuperCoContributionCalculator() {
  const [income, setIncome] = useState(42000);
  const [personalContribution, setPersonalContribution] = useState(1000);

  const results = useMemo(() => {
    const { coContribution, maxEntitlement, phaseOutApplied } = calculateCoContribution(
      income,
      personalContribution
    );
    const totalBoost = personalContribution + coContribution;
    const governmentRate = personalContribution > 0 ? coContribution / personalContribution : 0;
    const eligible = income < UPPER_THRESHOLD && personalContribution > 0;

    // Optimal contribution to maximise $500
    const optimalContribution = maxEntitlement > 0 ? Math.ceil(maxEntitlement / CO_CONTRIBUTION_RATE) : 0;

    return {
      coContribution,
      maxEntitlement,
      phaseOutApplied,
      totalBoost,
      governmentRate,
      eligible,
      optimalContribution,
    };
  }, [income, personalContribution]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Inputs */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Income (2024-25)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                max={200000}
                step={1000}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Include salary, investment income, and reportable fringe benefits
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal Super Contribution (after-tax)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                value={personalContribution}
                onChange={(e) => setPersonalContribution(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                max={10000}
                step={100}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              After-tax (non-concessional) contribution made to your super fund this year
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 space-y-4">
        {/* Eligibility status */}
        {income >= UPPER_THRESHOLD ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            <strong>Not eligible.</strong> The government co-contribution phases out completely when
            total income reaches {formatCurrency(UPPER_THRESHOLD)}. Your income of{" "}
            {formatCurrency(income)} is above this threshold.
          </div>
        ) : (
          <>
            {/* Co-contribution result */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-700">Government Co-contribution</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">
                    {formatCurrency(results.coContribution)}
                  </p>
                  {results.phaseOutApplied && (
                    <p className="text-xs text-gray-500 mt-1">
                      Reduced from maximum {formatCurrency(results.maxEntitlement)} due to income
                      phase-out
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Government rate</p>
                  <p className="text-lg font-bold text-gray-700">
                    {(results.governmentRate * 100).toFixed(0)}¢ per $1
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Super Boost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Your personal contribution</span>
                  <span className="font-medium text-gray-900">{formatCurrency(personalContribution)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Government co-contribution</span>
                  <span className="font-medium text-green-700">{formatCurrency(results.coContribution)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-gray-900">Total super boost</span>
                  <span className="text-blue-700">{formatCurrency(results.totalBoost)}</span>
                </div>
              </div>
            </div>

            {/* Income phase-out indicator */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Income vs. Thresholds</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{formatCurrency(LOWER_THRESHOLD)} (full rate)</span>
                  <span>{formatCurrency(UPPER_THRESHOLD)} (no entitlement)</span>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-red-400 w-full rounded-full" />
                  <div
                    className="absolute inset-y-0 left-0 right-0 bg-gray-200 rounded-full"
                    style={{
                      left: `${Math.min(100, Math.max(0, ((income - LOWER_THRESHOLD) / (UPPER_THRESHOLD - LOWER_THRESHOLD)) * 100))}%`,
                    }}
                  />
                  {/* Income marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow"
                    style={{
                      left: `calc(${Math.min(100, Math.max(0, ((income - LOWER_THRESHOLD) / (UPPER_THRESHOLD - LOWER_THRESHOLD)) * 100))}% - 6px)`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Your income: <strong>{formatCurrency(income)}</strong>
                  {income <= LOWER_THRESHOLD
                    ? " — Full rate applies"
                    : income < UPPER_THRESHOLD
                    ? ` — ${((1 - (income - LOWER_THRESHOLD) / (UPPER_THRESHOLD - LOWER_THRESHOLD)) * 100).toFixed(0)}% entitlement remaining`
                    : " — No entitlement"}
                </p>
              </div>
            </div>

            {/* Tip: optimal contribution */}
            {results.optimalContribution > 0 && results.coContribution < results.maxEntitlement && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Tip:</strong> To receive the maximum co-contribution of{" "}
                {formatCurrency(results.maxEntitlement)}, contribute at least{" "}
                {formatCurrency(results.optimalContribution)} to your super fund this year.
              </div>
            )}

            {results.coContribution === MAX_CO_CONTRIBUTION && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                <strong>Maximum reached!</strong> You are receiving the full{" "}
                {formatCurrency(MAX_CO_CONTRIBUTION)} government co-contribution.
              </div>
            )}

            <p className="text-xs text-gray-400">
              Calculations are based on 2024-25 ATO rules. The co-contribution is paid directly into your
              super account after you lodge your tax return. You must have &lt;10% of income from eligible
              employment and be under 71 years old.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
