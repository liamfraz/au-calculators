"use client";

import { useState, useMemo } from "react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const MARGINAL_RATES = [
  { label: "19% ($18,201 – $45,000)", value: 0.19 },
  { label: "32.5% ($45,001 – $120,000)", value: 0.325 },
  { label: "37% ($120,001 – $180,000)", value: 0.37 },
  { label: "45% ($180,001+)", value: 0.45 },
];

export default function CryptoCgtCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [marginalRate, setMarginalRate] = useState(0.325);
  const [otherGains, setOtherGains] = useState("");

  const hasInput = useMemo(() => {
    return purchasePrice !== "" && salePrice !== "" && purchaseDate !== "" && saleDate !== "";
  }, [purchasePrice, salePrice, purchaseDate, saleDate]);

  const results = useMemo(() => {
    if (!hasInput) return null;

    const purchase = parseFloat(purchasePrice) || 0;
    const sale = parseFloat(salePrice) || 0;
    const other = parseFloat(otherGains) || 0;

    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    const holdDays = Math.floor(
      (saleDateObj.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (holdDays < 0) return null;

    const rawGain = sale - purchase;
    const isGain = rawGain > 0;
    const heldOver12Months = holdDays >= 365;
    const cgtDiscountApplies = isGain && heldOver12Months;

    const discountAmount = cgtDiscountApplies ? rawGain * 0.5 : 0;
    const discountedGain = cgtDiscountApplies ? rawGain * 0.5 : rawGain;

    // Net taxable capital gain: discounted crypto gain + other gains
    // Capital losses (negative rawGain) reduce other gains
    const netTaxableGain = discountedGain + other;
    const taxableGain = Math.max(0, netTaxableGain);

    const estimatedTax = taxableGain * marginalRate;
    const afterTaxProfit = rawGain - estimatedTax;

    const holdYears = Math.floor(holdDays / 365);
    const holdMonths = Math.floor((holdDays % 365) / 30);

    return {
      rawGain,
      isGain,
      holdDays,
      holdYears,
      holdMonths,
      heldOver12Months,
      cgtDiscountApplies,
      discountAmount,
      discountedGain,
      netTaxableGain,
      taxableGain,
      estimatedTax,
      afterTaxProfit,
    };
  }, [purchasePrice, salePrice, purchaseDate, saleDate, marginalRate, otherGains, hasInput]);

  const holdingSummary = useMemo(() => {
    if (!results) return "";
    const { holdYears, holdMonths, holdDays } = results;
    if (holdYears > 0) return `${holdYears}y ${holdMonths}m (${holdDays} days)`;
    if (holdMonths > 0) return `${holdMonths} month${holdMonths !== 1 ? "s" : ""} (${holdDays} days)`;
    return `${holdDays} day${holdDays !== 1 ? "s" : ""}`;
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Your Crypto Trade</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <label htmlFor="purchase-price" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price (AUD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                id="purchase-price"
                type="number"
                min={0}
                step={0.01}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Total cost including fees</p>
          </div>

          {/* Sale Price */}
          <div>
            <label htmlFor="sale-price" className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price (AUD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                id="sale-price"
                type="number"
                min={0}
                step={0.01}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Proceeds including fees</p>
          </div>

          {/* Purchase Date */}
          <div>
            <label htmlFor="purchase-date" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              id="purchase-date"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sale Date */}
          <div>
            <label htmlFor="sale-date" className="block text-sm font-medium text-gray-700 mb-1">
              Sale Date
            </label>
            <input
              id="sale-date"
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Marginal Tax Rate */}
          <div>
            <label htmlFor="marginal-rate" className="block text-sm font-medium text-gray-700 mb-1">
              Marginal Tax Rate
            </label>
            <select
              id="marginal-rate"
              value={marginalRate}
              onChange={(e) => setMarginalRate(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {MARGINAL_RATES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Your highest income tax bracket</p>
          </div>

          {/* Other Capital Gains */}
          <div>
            <label htmlFor="other-gains" className="block text-sm font-medium text-gray-700 mb-1">
              Other Capital Gains This Year (AUD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                id="other-gains"
                type="number"
                step={0.01}
                value={otherGains}
                onChange={(e) => setOtherGains(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Shares, property, other crypto gains (0 if none)</p>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {/* Holding period info */}
          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Holding Period: {holdingSummary}</p>
              <p className="text-xs text-blue-600 mt-0.5">
                {results.heldOver12Months
                  ? "Held over 12 months — 50% CGT discount applies"
                  : `Held under 12 months — no CGT discount (need ${365 - results.holdDays} more days)`}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              results.heldOver12Months
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}>
              {results.heldOver12Months ? "Discount eligible" : "No discount"}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Capital gain/loss */}
            <div className={`border rounded-xl p-5 ${
              results.rawGain >= 0 ? "border-gray-200 bg-white" : "border-orange-200 bg-orange-50"
            }`}>
              <p className="text-sm text-gray-600 mb-1">Capital {results.rawGain >= 0 ? "Gain" : "Loss"}</p>
              <p className={`text-2xl font-bold ${results.rawGain >= 0 ? "text-gray-900" : "text-orange-700"}`}>
                {formatCurrency(Math.abs(results.rawGain))}
              </p>
              {results.rawGain < 0 && (
                <p className="text-xs text-orange-600 mt-1">Loss offsets other capital gains</p>
              )}
            </div>

            {/* CGT Discount */}
            <div className={`border rounded-xl p-5 ${
              results.cgtDiscountApplies ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
            }`}>
              <p className="text-sm text-gray-600 mb-1">CGT Discount (50%)</p>
              <p className={`text-2xl font-bold ${results.cgtDiscountApplies ? "text-green-700" : "text-gray-400"}`}>
                {results.cgtDiscountApplies ? formatCurrency(results.discountAmount) : "—"}
              </p>
              <p className={`text-xs mt-1 ${results.cgtDiscountApplies ? "text-green-600" : "text-gray-500"}`}>
                {results.cgtDiscountApplies ? "Discount applied — gain halved" : "Not applicable"}
              </p>
            </div>

            {/* Net taxable gain */}
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <p className="text-sm text-gray-600 mb-1">Net Taxable Capital Gain</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.taxableGain > 0 ? formatCurrency(results.taxableGain) : "$0.00"}
              </p>
              {results.netTaxableGain < 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Net loss of {formatCurrency(Math.abs(results.netTaxableGain))} — carried forward
                </p>
              )}
            </div>

            {/* Estimated tax */}
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <p className="text-sm text-gray-600 mb-1">Tax Rate Applied</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercent(marginalRate)}</p>
              <p className="text-xs text-gray-500 mt-1">Your marginal rate on the net gain</p>
            </div>
          </div>

          {/* Main result: Tax owed */}
          <div className={`border rounded-xl p-6 ${
            results.estimatedTax > 0 ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${results.estimatedTax > 0 ? "text-red-700" : "text-green-700"}`}>
                  Estimated Tax Owed
                </p>
                <p className={`text-4xl font-bold ${results.estimatedTax > 0 ? "text-red-700" : "text-green-700"}`}>
                  {formatCurrency(results.estimatedTax)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium mb-1 ${results.rawGain >= 0 ? "text-gray-700" : "text-orange-700"}`}>
                  After-Tax {results.afterTaxProfit >= 0 ? "Profit" : "Loss"}
                </p>
                <p className={`text-3xl font-bold ${results.afterTaxProfit >= 0 ? "text-gray-900" : "text-orange-700"}`}>
                  {formatCurrency(Math.abs(results.afterTaxProfit))}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Calculation Breakdown</h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-5 py-3 text-gray-600">Sale Price</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">{formatCurrency(parseFloat(salePrice) || 0)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-5 py-3 text-gray-600">Less: Purchase Price</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">({formatCurrency(parseFloat(purchasePrice) || 0)})</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">Capital {results.rawGain >= 0 ? "Gain" : "Loss"}</td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">{formatCurrency(results.rawGain)}</td>
                </tr>
                {results.cgtDiscountApplies && (
                  <tr className="border-b border-gray-100">
                    <td className="px-5 py-3 text-gray-600">Less: 50% CGT Discount</td>
                    <td className="px-5 py-3 text-right font-medium text-green-700">({formatCurrency(results.discountAmount)})</td>
                  </tr>
                )}
                {parseFloat(otherGains) !== 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="px-5 py-3 text-gray-600">Plus: Other Capital Gains</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">{formatCurrency(parseFloat(otherGains) || 0)}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">Net Taxable Capital Gain</td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">{formatCurrency(results.taxableGain)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-5 py-3 text-gray-600">Tax at {formatPercent(marginalRate)}</td>
                  <td className="px-5 py-3 text-right font-medium text-red-700">{formatCurrency(results.estimatedTax)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">After-Tax {results.afterTaxProfit >= 0 ? "Profit" : "Loss"}</td>
                  <td className={`px-5 py-3 text-right font-bold text-lg ${results.afterTaxProfit >= 0 ? "text-gray-900" : "text-orange-700"}`}>
                    {formatCurrency(results.afterTaxProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Crypto tax software CTA */}
      <div className="border border-purple-200 rounded-xl p-5 bg-purple-50">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-purple-900 mb-1">
              Trading frequently? Use dedicated crypto tax software
            </p>
            <p className="text-xs text-purple-700 mb-3">
              Koinly automatically imports transactions from 700+ exchanges and wallets, calculates your CGT, and generates ATO-ready tax reports in minutes.
            </p>
            <a
              href="https://koinly.io/?via=au-calculators"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Try Koinly Free
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        <p className="text-xs text-purple-500 mt-2">Affiliate link — we may earn a commission at no cost to you</p>
      </div>

      {/* Disclaimer */}
      <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Disclaimer:</strong> This calculator is a guide only and does not constitute financial or tax advice. CGT rules are complex and your individual circumstances may vary. Consult a registered tax agent or accountant before lodging your return. Capital losses may be carried forward — this calculator does not account for prior year losses.
        </p>
      </div>
    </div>
  );
}
