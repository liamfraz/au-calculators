"use client";

import { useState } from "react";

const TAX_BRACKETS_2025_26 = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18201, max: 45000, rate: 0.16 },
  { min: 45001, max: 135000, rate: 0.30 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

function calculateMarginalRate(taxableIncome: number): number {
  for (let i = TAX_BRACKETS_2025_26.length - 1; i >= 0; i--) {
    if (taxableIncome >= TAX_BRACKETS_2025_26[i].min) {
      return TAX_BRACKETS_2025_26[i].rate;
    }
  }
  return 0;
}

function calculateTaxOnAmount(taxableIncome: number): number {
  let tax = 0;
  for (const bracket of TAX_BRACKETS_2025_26) {
    if (taxableIncome <= 0) break;
    const taxableInBracket = Math.min(
      taxableIncome,
      bracket.max - bracket.min + 1
    );
    tax += taxableInBracket * bracket.rate;
    taxableIncome -= taxableInBracket;
  }
  return tax;
}

function monthsBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return (
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface Results {
  capitalGain: number;
  heldMonths: number;
  discountEligible: boolean;
  discountAmount: number;
  taxableGain: number;
  marginalRate: number;
  estimatedTax: number;
  taxWithoutGain: number;
  taxWithGain: number;
  effectiveCgtRate: number;
}

export default function CapitalGainsTaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [capitalCosts, setCapitalCosts] = useState("");
  const [taxableIncome, setTaxableIncome] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const purchase = parseFloat(purchasePrice) || 0;
    const sale = parseFloat(salePrice) || 0;
    const costs = parseFloat(capitalCosts) || 0;
    const income = parseFloat(taxableIncome) || 0;

    if (!purchase || !sale || !purchaseDate || !saleDate) return;

    const capitalGain = sale - purchase - costs;
    if (capitalGain <= 0) {
      setResults({
        capitalGain,
        heldMonths: monthsBetween(purchaseDate, saleDate),
        discountEligible: false,
        discountAmount: 0,
        taxableGain: 0,
        marginalRate: calculateMarginalRate(income),
        estimatedTax: 0,
        taxWithoutGain: calculateTaxOnAmount(income),
        taxWithGain: calculateTaxOnAmount(income),
        effectiveCgtRate: 0,
      });
      return;
    }

    const heldMonths = monthsBetween(purchaseDate, saleDate);
    const discountEligible = heldMonths >= 12;
    const discountAmount = discountEligible ? capitalGain * 0.5 : 0;
    const taxableGain = capitalGain - discountAmount;

    const taxWithoutGain = calculateTaxOnAmount(income);
    const taxWithGain = calculateTaxOnAmount(income + taxableGain);
    const estimatedTax = taxWithGain - taxWithoutGain;
    const marginalRate = calculateMarginalRate(income + taxableGain);
    const effectiveCgtRate = capitalGain > 0 ? (estimatedTax / capitalGain) * 100 : 0;

    setResults({
      capitalGain,
      heldMonths,
      discountEligible,
      discountAmount,
      taxableGain,
      marginalRate,
      estimatedTax,
      taxWithoutGain,
      taxWithGain,
      effectiveCgtRate,
    });
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Asset Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price ($)
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price ($)
            </label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="e.g. 750000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Date
            </label>
            <input
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capital Costs ($)
              <span className="text-gray-400 font-normal ml-1">
                e.g. agent fees, legal, renovations
              </span>
            </label>
            <input
              type="number"
              value={capitalCosts}
              onChange={(e) => setCapitalCosts(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Taxable Income ($)
              <span className="text-gray-400 font-normal ml-1">
                excluding this gain
              </span>
            </label>
            <input
              type="number"
              value={taxableIncome}
              onChange={(e) => setTaxableIncome(e.target.value)}
              placeholder="e.g. 90000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calculate CGT
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Summary card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Capital Gains Tax Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">
                  Capital Gain
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(results.capitalGain)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">
                  50% Discount
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {results.discountEligible ? formatCurrency(results.discountAmount) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">
                  Taxable Gain
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(results.taxableGain)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide">
                  Estimated Tax
                </p>
                <p className="text-xl font-bold text-red-700">
                  {formatCurrency(results.estimatedTax)}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detailed Breakdown
            </h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-600">Sale Price</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(parseFloat(salePrice) || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Less: Purchase Price</td>
                  <td className="py-2 text-right font-medium">−{formatCurrency(parseFloat(purchasePrice) || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Less: Capital Costs</td>
                  <td className="py-2 text-right font-medium">−{formatCurrency(parseFloat(capitalCosts) || 0)}</td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 text-gray-900">Capital Gain</td>
                  <td className="py-2 text-right">{formatCurrency(results.capitalGain)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">
                    Holding Period
                  </td>
                  <td className="py-2 text-right font-medium">
                    {results.heldMonths} months
                    {results.discountEligible && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Discount eligible
                      </span>
                    )}
                    {!results.discountEligible && results.capitalGain > 0 && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        No discount (&lt;12 months)
                      </span>
                    )}
                  </td>
                </tr>
                {results.discountEligible && (
                  <tr>
                    <td className="py-2 text-gray-600">Less: 50% CGT Discount</td>
                    <td className="py-2 text-right font-medium text-green-700">
                      −{formatCurrency(results.discountAmount)}
                    </td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-2 text-gray-900">Net Taxable Capital Gain</td>
                  <td className="py-2 text-right">{formatCurrency(results.taxableGain)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Your Marginal Tax Rate</td>
                  <td className="py-2 text-right font-medium">{(results.marginalRate * 100).toFixed(0)}%</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Tax on Income (without gain)</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(results.taxWithoutGain)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Tax on Income (with gain)</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(results.taxWithGain)}</td>
                </tr>
                <tr className="font-semibold text-red-700">
                  <td className="py-2">Estimated CGT Payable</td>
                  <td className="py-2 text-right">{formatCurrency(results.estimatedTax)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Effective CGT Rate</td>
                  <td className="py-2 text-right font-medium">{results.effectiveCgtRate.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Exemptions & concessions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              Exemptions & Concessions
            </h3>
            <div className="space-y-3 text-sm text-amber-800">
              <div>
                <p className="font-semibold">Main Residence Exemption</p>
                <p>
                  Your main home (principal place of residence) is generally exempt from CGT.
                  If you lived in the property for the entire time you owned it, no CGT applies.
                  Partial exemptions apply if it was your home for part of the ownership period or
                  was used to produce income.
                </p>
              </div>
              <div>
                <p className="font-semibold">6-Year Absence Rule</p>
                <p>
                  If you move out of your main residence and rent it out, you can treat it as your
                  main residence for CGT purposes for up to 6 years — provided you do not claim
                  another property as your main residence during that time.
                </p>
              </div>
              <div>
                <p className="font-semibold">Small Business CGT Concessions</p>
                <p>
                  Small businesses with aggregated turnover under $2 million (or net CGT assets
                  under $6 million) may qualify for the 15-year exemption, 50% active asset reduction,
                  retirement exemption, or rollover relief. These can significantly reduce or eliminate
                  CGT on active business assets.
                </p>
              </div>
              <div>
                <p className="font-semibold">Shares & Crypto</p>
                <p>
                  The 50% CGT discount also applies to shares, ETFs, managed funds, and cryptocurrency
                  held for more than 12 months by Australian individual taxpayers. Losses can offset
                  gains but cannot reduce other income.
                </p>
              </div>
            </div>
          </div>

          {/* 2025-26 Tax Brackets reference */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              2025–26 ATO Tax Brackets Used
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-1">Taxable Income</th>
                  <th className="py-1 text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-1">$0 – $18,200</td><td className="py-1 text-right">0%</td></tr>
                <tr><td className="py-1">$18,201 – $45,000</td><td className="py-1 text-right">16%</td></tr>
                <tr><td className="py-1">$45,001 – $135,000</td><td className="py-1 text-right">30%</td></tr>
                <tr><td className="py-1">$135,001 – $190,000</td><td className="py-1 text-right">37%</td></tr>
                <tr><td className="py-1">$190,001+</td><td className="py-1 text-right">45%</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">
              Medicare levy of 2% is not included in this estimate. Consult a tax professional for your specific situation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
