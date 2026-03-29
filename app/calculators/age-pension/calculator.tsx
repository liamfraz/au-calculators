"use client";

import { useState } from "react";
import Link from "next/link";

type RelationshipStatus = "single" | "couple";

// 2025-26 Age Pension rates (per fortnight)
const MAX_PENSION_RATES = {
  single: 1116.3, // $1,116.30/fn
  couple: 1682.8, // $1,682.80/fn combined (both eligible)
};

// Energy Supplement (per fortnight)
const ENERGY_SUPPLEMENT = {
  single: 14.1,
  couple: 21.2, // combined
};

// Income Test thresholds (per fortnight)
const INCOME_TEST = {
  single: { threshold: 204, taperRate: 0.5 },
  couple: { threshold: 360, taperRate: 0.5 }, // combined
};

// Assets Test thresholds
const ASSETS_TEST = {
  single: {
    homeowner: { threshold: 301750, taperRate: 3 }, // $3/fn per $1,000 over
    nonHomeowner: { threshold: 543750, taperRate: 3 },
  },
  couple: {
    homeowner: { threshold: 451500, taperRate: 3 },
    nonHomeowner: { threshold: 693500, taperRate: 3 },
  },
};

// Assets Test upper limits (cut-off points)
const ASSETS_CUTOFF = {
  single: {
    homeowner: 674000,
    nonHomeowner: 916000,
  },
  couple: {
    homeowner: 1012500,
    nonHomeowner: 1254500,
  },
};

// Deeming rates for financial assets
const DEEMING = {
  single: { threshold: 60400, lowerRate: 0.0025, upperRate: 0.0025 }, // 0.25% below, 0.25% above (both same since July 2024)
  couple: { threshold: 100200, lowerRate: 0.0025, upperRate: 0.0025 },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrencyWhole(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface Results {
  maxPensionFn: number;
  incomeTestPensionFn: number;
  assetsTestPensionFn: number;
  actualPensionFn: number;
  reductionFn: number;
  controllingTest: "income" | "assets" | "both";
  annualPension: number;
  incomeReductionFn: number;
  assetsReductionFn: number;
  energySupplementFn: number;
  isEligible: boolean;
  ageEligible: boolean;
}

export default function AgePensionCalculator() {
  const [age, setAge] = useState("");
  const [relationship, setRelationship] = useState<RelationshipStatus>("single");
  const [homeowner, setHomeowner] = useState(true);
  const [totalAssets, setTotalAssets] = useState("");
  const [fortnightlyIncome, setFortnightlyIncome] = useState("");
  const [superBalance, setSuperBalance] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const ageVal = parseInt(age) || 0;
    const assets = parseFloat(totalAssets) || 0;
    const income = parseFloat(fortnightlyIncome) || 0;
    const superBal = parseFloat(superBalance) || 0;

    const ageEligible = ageVal >= 67;

    const maxFn = MAX_PENSION_RATES[relationship];
    const energyFn = ENERGY_SUPPLEMENT[relationship];

    // --- Income Test ---
    const incomeThreshold = INCOME_TEST[relationship].threshold;
    const taperRate = INCOME_TEST[relationship].taperRate;

    // Deeming: super + financial assets deemed to earn income
    const deemingThreshold = DEEMING[relationship].threshold;
    const deemedIncome =
      Math.min(superBal, deemingThreshold) * DEEMING[relationship].lowerRate +
      Math.max(0, superBal - deemingThreshold) * DEEMING[relationship].upperRate;
    const deemedIncomeFn = deemedIncome / 26; // annual to fortnightly

    const totalIncomeFn = income + deemedIncomeFn;
    const incomeExcess = Math.max(0, totalIncomeFn - incomeThreshold);
    const incomeReductionFn = incomeExcess * taperRate;
    const incomeTestPensionFn = Math.max(0, maxFn - incomeReductionFn);

    // --- Assets Test ---
    const ownerKey = homeowner ? "homeowner" : "nonHomeowner";
    const assetsThreshold = ASSETS_TEST[relationship][ownerKey].threshold;
    const assetsTaperRate = ASSETS_TEST[relationship][ownerKey].taperRate;
    const assetsCutoff = ASSETS_CUTOFF[relationship][ownerKey];

    // Total assessable assets include super for Age Pension recipients
    const totalAssessableAssets = assets + superBal;

    let assetsTestPensionFn: number;
    if (totalAssessableAssets > assetsCutoff) {
      assetsTestPensionFn = 0;
    } else {
      const assetsExcess = Math.max(0, totalAssessableAssets - assetsThreshold);
      const assetsReductionFn = (assetsExcess / 1000) * assetsTaperRate;
      assetsTestPensionFn = Math.max(0, maxFn - assetsReductionFn);
    }

    // The lower amount applies
    const actualPensionFn = Math.min(incomeTestPensionFn, assetsTestPensionFn);
    const assetsReductionFn = maxFn - assetsTestPensionFn;

    let controllingTest: "income" | "assets" | "both";
    if (incomeTestPensionFn === assetsTestPensionFn) {
      controllingTest = "both";
    } else if (incomeTestPensionFn < assetsTestPensionFn) {
      controllingTest = "income";
    } else {
      controllingTest = "assets";
    }

    const reductionFn = maxFn - actualPensionFn;
    const annualPension = actualPensionFn * 26;

    setResults({
      maxPensionFn: maxFn,
      incomeTestPensionFn,
      assetsTestPensionFn,
      actualPensionFn,
      reductionFn,
      controllingTest,
      annualPension,
      incomeReductionFn,
      assetsReductionFn,
      energySupplementFn: actualPensionFn > 0 ? energyFn : 0,
      isEligible: actualPensionFn > 0,
      ageEligible,
    });
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 67"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">You must be 67 or older to qualify</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Status
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as RelationshipStatus)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="single">Single</option>
              <option value="couple">Couple (combined)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Ownership</label>
            <select
              value={homeowner ? "yes" : "no"}
              onChange={(e) => setHomeowner(e.target.value === "yes")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="yes">Homeowner</option>
              <option value="no">Non-homeowner (renter)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Your home is not counted as an asset</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Superannuation Balance ($)
            </label>
            <input
              type="number"
              value={superBalance}
              onChange={(e) => setSuperBalance(e.target.value)}
              placeholder="e.g. 200000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Counted as both an asset and deemed for income
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Assessable Assets ($)
            </label>
            <input
              type="number"
              value={totalAssets}
              onChange={(e) => setTotalAssets(e.target.value)}
              placeholder="e.g. 150000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Excluding your home and super (investments, savings, vehicles, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Fortnightly Income ($)
            </label>
            <input
              type="number"
              value={fortnightlyIncome}
              onChange={(e) => setFortnightlyIncome(e.target.value)}
              placeholder="e.g. 300"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Employment income, rental income, etc. (excluding deemed income from super)
            </p>
          </div>
        </div>

        <button
          onClick={calculate}
          className="mt-6 w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Calculate Pension
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Age Warning */}
          {!results.ageEligible && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 font-semibold">
                You must be at least 67 years old to qualify for the Age Pension. The calculations
                below show what you would receive at pension age.
              </p>
            </div>
          )}

          {/* Summary Card */}
          <div
            className={`rounded-xl p-6 ${results.isEligible ? "bg-blue-50 border border-blue-200" : "bg-red-50 border border-red-200"}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${results.isEligible ? "text-blue-900" : "text-red-900"}`}
            >
              {results.isEligible
                ? "Your Estimated Age Pension"
                : "Not Eligible for Age Pension"}
            </h3>
            {results.isEligible ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Fortnightly Pension</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(results.actualPensionFn)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Annual Pension</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(results.annualPension)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Energy Supplement (fn)</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(results.energySupplementFn)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-800">
                Based on your assets and income, you exceed the thresholds for the Age Pension. You
                may still be eligible for the Commonwealth Seniors Health Card.
              </p>
            )}
          </div>

          {/* Test Comparison */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Income Test vs Assets Test
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Centrelink applies both tests and pays the <strong>lower</strong> amount.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`rounded-lg p-4 ${results.controllingTest === "income" || results.controllingTest === "both" ? "bg-amber-50 border-2 border-amber-400" : "bg-gray-50 border border-gray-200"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Income Test</h4>
                  {(results.controllingTest === "income" ||
                    results.controllingTest === "both") && (
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      Controlling Test
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(results.incomeTestPensionFn)}
                  <span className="text-sm font-normal text-gray-500">/fn</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Reduction: {formatCurrency(results.incomeReductionFn)}/fn
                </p>
              </div>
              <div
                className={`rounded-lg p-4 ${results.controllingTest === "assets" || results.controllingTest === "both" ? "bg-amber-50 border-2 border-amber-400" : "bg-gray-50 border border-gray-200"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Assets Test</h4>
                  {(results.controllingTest === "assets" ||
                    results.controllingTest === "both") && (
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      Controlling Test
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(results.assetsTestPensionFn)}
                  <span className="text-sm font-normal text-gray-500">/fn</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Reduction: {formatCurrency(results.assetsReductionFn)}/fn
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-600">Maximum pension rate ({relationship})</td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(results.maxPensionFn)}/fn
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Your fortnightly pension</td>
                  <td className="py-2 text-right font-medium text-blue-700">
                    {formatCurrency(results.actualPensionFn)}/fn
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Total reduction</td>
                  <td className="py-2 text-right font-medium text-red-600">
                    −{formatCurrency(results.reductionFn)}/fn
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Energy Supplement</td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(results.energySupplementFn)}/fn
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-semibold text-gray-900">
                    Total fortnightly payment
                  </td>
                  <td className="py-2 text-right font-bold text-blue-700">
                    {formatCurrency(results.actualPensionFn + results.energySupplementFn)}/fn
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-gray-900">Total annual payment</td>
                  <td className="py-2 text-right font-bold text-blue-700">
                    {formatCurrency(
                      (results.actualPensionFn + results.energySupplementFn) * 26
                    )}
                    /yr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2025-26 Thresholds Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-2">Income Test Thresholds</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>Single: {formatCurrencyWhole(204)}/fn before taper</li>
                <li>Couple: {formatCurrencyWhole(360)}/fn before taper</li>
                <li>Taper rate: 50 cents per $1 over threshold</li>
                <li>Super balance deemed at 0.25% p.a.</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-2">
                Assets Test Thresholds (2025-26)
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>Single homeowner: {formatCurrencyWhole(301750)} threshold</li>
                <li>Single non-homeowner: {formatCurrencyWhole(543750)}</li>
                <li>Couple homeowner: {formatCurrencyWhole(451500)}</li>
                <li>Couple non-homeowner: {formatCurrencyWhole(693500)}</li>
                <li>Taper: $3/fn per $1,000 over threshold</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Maximum Pension Rates (2025-26)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium">Single</p>
                <ul className="space-y-1 mt-1">
                  <li>Base rate + supplement: {formatCurrency(1116.3)}/fn</li>
                  <li>Energy Supplement: {formatCurrency(14.1)}/fn</li>
                  <li>
                    <strong>Total: {formatCurrency(1130.4)}/fn</strong>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Couple (combined)</p>
                <ul className="space-y-1 mt-1">
                  <li>Base rate + supplement: {formatCurrency(1682.8)}/fn</li>
                  <li>Energy Supplement: {formatCurrency(21.2)}/fn</li>
                  <li>
                    <strong>Total: {formatCurrency(1704.0)}/fn</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Calculators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/calculators/super"
                className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
              >
                Superannuation Calculator &rarr;
              </Link>
              <Link
                href="/calculators/capital-gains-tax"
                className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
              >
                Capital Gains Tax Calculator &rarr;
              </Link>
              <Link
                href="/centrelink-payment-estimator"
                className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
              >
                Centrelink Payment Estimator &rarr;
              </Link>
              <Link
                href="/tax-withholding-calculator"
                className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
              >
                Income Tax Calculator &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
