"use client";

import { useState } from "react";
import Link from "next/link";

type AssetType = "shares" | "crypto" | "property" | "other";
type EntityType = "individual" | "company" | "smsf" | "trust";
type TaxInputMode = "income" | "rate";

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: "shares", label: "Shares / ETFs" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "property", label: "Property" },
  { value: "other", label: "Other" },
];

const TAX_BRACKETS_2025_26 = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18201, max: 45000, rate: 0.16 },
  { min: 45001, max: 135000, rate: 0.3 },
  { min: 135001, max: 190000, rate: 0.37 },
  { min: 190001, max: Infinity, rate: 0.45 },
];

const COMMON_RATES = [
  { label: "0% ($0 – $18,200)", value: 0 },
  { label: "16% ($18,201 – $45,000)", value: 0.16 },
  { label: "30% ($45,001 – $135,000)", value: 0.3 },
  { label: "37% ($135,001 – $190,000)", value: 0.37 },
  { label: "45% ($190,001+)", value: 0.45 },
];

const ENTITY_INFO: Record<EntityType, { label: string; discountPct: number; discountLabel: string }> = {
  individual: { label: "Individual", discountPct: 50, discountLabel: "50% CGT discount" },
  company: { label: "Company", discountPct: 0, discountLabel: "No CGT discount" },
  smsf: { label: "Self-Managed Super Fund (SMSF)", discountPct: 33.33, discountLabel: "33⅓% CGT discount" },
  trust: { label: "Trust", discountPct: 50, discountLabel: "50% CGT discount (distributed to individuals)" },
};

function calculateTaxOnAmount(taxableIncome: number): number {
  let tax = 0;
  let remaining = taxableIncome;
  for (const bracket of TAX_BRACKETS_2025_26) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, bracket.max - bracket.min + 1);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
  }
  return tax;
}

function calculateMarginalRate(taxableIncome: number): number {
  for (let i = TAX_BRACKETS_2025_26.length - 1; i >= 0; i--) {
    if (taxableIncome >= TAX_BRACKETS_2025_26[i].min) {
      return TAX_BRACKETS_2025_26[i].rate;
    }
  }
  return 0;
}

function monthsBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
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
  discountPct: number;
  discountAmount: number;
  taxableGain: number;
  otherGains: number;
  totalTaxableGain: number;
  marginalRate: number;
  estimatedTax: number;
  netGainAfterTax: number;
  effectiveCgtRate: number;
  entityType: EntityType;
  assetType: AssetType;
  isLoss: boolean;
  taxInputMode: TaxInputMode;
  taxWithoutGain: number;
  taxWithGain: number;
}

export default function CapitalGainsTaxCalculator() {
  const [assetType, setAssetType] = useState<AssetType>("shares");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [capitalImprovements, setCapitalImprovements] = useState("");
  const [sellingCosts, setSellingCosts] = useState("");
  const [otherNetGains, setOtherNetGains] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("individual");
  const [taxInputMode, setTaxInputMode] = useState<TaxInputMode>("rate");
  const [taxableIncome, setTaxableIncome] = useState("");
  const [selectedRate, setSelectedRate] = useState("0.37");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const purchase = parseFloat(purchasePrice) || 0;
    const sale = parseFloat(salePrice) || 0;
    const costs = (parseFloat(capitalImprovements) || 0) + (parseFloat(sellingCosts) || 0);
    const otherGains = parseFloat(otherNetGains) || 0;

    if (!purchase || !sale || !purchaseDate || !saleDate) return;

    const capitalGain = sale - purchase - costs;
    const heldMonths = monthsBetween(purchaseDate, saleDate);
    const discountEligible = heldMonths >= 12 && entityType !== "company" && capitalGain > 0;
    const discountPct = discountEligible ? ENTITY_INFO[entityType].discountPct : 0;
    const discountAmount = capitalGain > 0 ? capitalGain * (discountPct / 100) : 0;
    const taxableGain = capitalGain > 0 ? capitalGain - discountAmount : capitalGain;
    const totalTaxableGain = taxableGain + otherGains;

    if (totalTaxableGain <= 0) {
      setResults({
        capitalGain,
        heldMonths,
        discountEligible,
        discountPct,
        discountAmount,
        taxableGain,
        otherGains,
        totalTaxableGain,
        marginalRate: 0,
        estimatedTax: 0,
        netGainAfterTax: capitalGain,
        effectiveCgtRate: 0,
        entityType,
        assetType,
        isLoss: totalTaxableGain < 0,
        taxInputMode,
        taxWithoutGain: 0,
        taxWithGain: 0,
      });
      return;
    }

    let estimatedTax: number;
    let marginalRate: number;
    let taxWithoutGain = 0;
    let taxWithGain = 0;

    if (entityType === "company") {
      marginalRate = 0.25;
      estimatedTax = totalTaxableGain * 0.25;
    } else if (entityType === "smsf") {
      marginalRate = 0.15;
      estimatedTax = totalTaxableGain * 0.15;
    } else if (taxInputMode === "rate") {
      marginalRate = parseFloat(selectedRate);
      estimatedTax = totalTaxableGain * marginalRate;
    } else {
      const income = parseFloat(taxableIncome) || 0;
      taxWithoutGain = calculateTaxOnAmount(income);
      taxWithGain = calculateTaxOnAmount(income + totalTaxableGain);
      estimatedTax = taxWithGain - taxWithoutGain;
      marginalRate = calculateMarginalRate(income + totalTaxableGain);
    }

    const effectiveCgtRate = capitalGain > 0 ? (estimatedTax / capitalGain) * 100 : 0;
    const netGainAfterTax = capitalGain - estimatedTax;

    setResults({
      capitalGain,
      heldMonths,
      discountEligible,
      discountPct,
      discountAmount,
      taxableGain,
      otherGains,
      totalTaxableGain,
      marginalRate,
      estimatedTax,
      netGainAfterTax,
      effectiveCgtRate,
      entityType,
      assetType,
      isLoss: false,
      taxInputMode,
      taxWithoutGain,
      taxWithGain,
    });
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Details</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Type
          </label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as AssetType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {ASSET_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

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
              Capital Improvements ($)
              <span className="text-gray-400 font-normal ml-1">
                renovations, extensions
              </span>
            </label>
            <input
              type="number"
              value={capitalImprovements}
              onChange={(e) => setCapitalImprovements(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Costs ($)
              <span className="text-gray-400 font-normal ml-1">
                agent fees, legal, advertising
              </span>
            </label>
            <input
              type="number"
              value={sellingCosts}
              onChange={(e) => setSellingCosts(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Details</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entity Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(ENTITY_INFO) as EntityType[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setEntityType(key)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  entityType === key
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {ENTITY_INFO[key].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {ENTITY_INFO[entityType].discountLabel}
            {entityType === "company" && " — taxed at flat 25% company rate"}
            {entityType === "smsf" && " — taxed at flat 15% super rate"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Other net capital gains / losses this FY ($)
            <span className="text-gray-400 font-normal ml-1">optional — use negative for losses</span>
          </label>
          <input
            type="number"
            value={otherNetGains}
            onChange={(e) => setOtherNetGains(e.target.value)}
            placeholder="e.g. -5000 for a $5,000 loss, or 10000 for a $10,000 gain"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter other CGT gains or losses from this financial year (already net of the CGT discount where applicable) to offset against this asset&apos;s gain.
          </p>
        </div>

        {entityType !== "company" && entityType !== "smsf" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you like to estimate your tax?
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setTaxInputMode("rate")}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  taxInputMode === "rate"
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                Select marginal rate
              </button>
              <button
                type="button"
                onClick={() => setTaxInputMode("income")}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  taxInputMode === "income"
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                Enter taxable income
              </button>
            </div>

            {taxInputMode === "rate" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Marginal Tax Rate
                </label>
                <select
                  value={selectedRate}
                  onChange={(e) => setSelectedRate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {COMMON_RATES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Taxable Income ($)
                  <span className="text-gray-400 font-normal ml-1">
                    excluding this capital gain
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
            )}
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calculate CGT
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Capital loss notice */}
          {results.isLoss && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Capital Loss: {formatCurrency(Math.abs(results.capitalGain))}
              </h3>
              <div className="text-sm text-red-800 space-y-2">
                <p>
                  You have made a <strong>capital loss</strong> on this asset. Capital losses
                  cannot be claimed as a tax deduction against other income (like salary or
                  wages), but they <strong>can be used to offset capital gains</strong> in the
                  same financial year or carried forward to offset future capital gains.
                </p>
                <p>
                  <strong>Carry forward rules:</strong> There is no time limit on carrying
                  forward capital losses. You must apply losses against capital gains in the
                  order they were incurred. You must report the loss in your tax return for the
                  year it occurred, even though it may not reduce your tax in that year.
                </p>
                <p>
                  <strong>Important:</strong> Capital losses on personal-use assets (items
                  costing $10,000 or less) and collectables cannot be offset against other
                  capital gains — only against gains from the same type of asset.
                </p>
              </div>
            </div>
          )}

          {/* Summary card */}
          {!results.isLoss && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Capital Gains Tax Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Capital Gain</p>
                  <p className="text-xl font-bold text-blue-900">
                    {formatCurrency(results.capitalGain)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide">
                    {results.discountPct > 0 ? `${results.discountPct}% Discount` : "Discount"}
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    {results.discountEligible
                      ? formatCurrency(results.discountAmount)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide">
                    {results.otherGains !== 0 ? "Total Net Taxable Gain" : "Net Taxable Gain"}
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    {formatCurrency(results.otherGains !== 0 ? results.totalTaxableGain : results.taxableGain)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Estimated Tax</p>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(results.estimatedTax)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Net Gain After Tax</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(results.netGainAfterTax)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed breakdown */}
          {!results.isLoss && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 text-gray-600">Sale Price</td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(parseFloat(salePrice) || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Less: Purchase Price</td>
                    <td className="py-2 text-right font-medium">
                      &minus;{formatCurrency(parseFloat(purchasePrice) || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Less: Capital Improvements</td>
                    <td className="py-2 text-right font-medium">
                      &minus;{formatCurrency(parseFloat(capitalImprovements) || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Less: Selling Costs</td>
                    <td className="py-2 text-right font-medium">
                      &minus;{formatCurrency(parseFloat(sellingCosts) || 0)}
                    </td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-2 text-gray-900">Capital Gain</td>
                    <td className="py-2 text-right">{formatCurrency(results.capitalGain)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Holding Period</td>
                    <td className="py-2 text-right font-medium">
                      {results.heldMonths} months
                      {results.discountEligible && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Discount eligible
                        </span>
                      )}
                      {!results.discountEligible && results.capitalGain > 0 && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {results.entityType === "company"
                            ? "Companies ineligible"
                            : "No discount (<12 months)"}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Entity Type</td>
                    <td className="py-2 text-right font-medium">
                      {ENTITY_INFO[results.entityType].label}
                    </td>
                  </tr>
                  {results.discountEligible && (
                    <tr>
                      <td className="py-2 text-gray-600">
                        Less: {results.discountPct}% CGT Discount
                      </td>
                      <td className="py-2 text-right font-medium text-green-700">
                        &minus;{formatCurrency(results.discountAmount)}
                      </td>
                    </tr>
                  )}
                  <tr className="font-semibold">
                    <td className="py-2 text-gray-900">Taxable Gain (this asset)</td>
                    <td className="py-2 text-right">{formatCurrency(results.taxableGain)}</td>
                  </tr>
                  {results.otherGains !== 0 && (
                    <tr>
                      <td className="py-2 text-gray-600">
                        {results.otherGains < 0 ? "Less: Other capital losses this FY" : "Plus: Other capital gains this FY"}
                      </td>
                      <td className={`py-2 text-right font-medium ${results.otherGains < 0 ? "text-green-700" : ""}`}>
                        {results.otherGains < 0
                          ? `\u2212${formatCurrency(Math.abs(results.otherGains))}`
                          : `+${formatCurrency(results.otherGains)}`}
                      </td>
                    </tr>
                  )}
                  {results.otherGains !== 0 && (
                    <tr className="font-semibold">
                      <td className="py-2 text-gray-900">Total Net Taxable Capital Gain</td>
                      <td className="py-2 text-right">{formatCurrency(results.totalTaxableGain)}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 text-gray-600">
                      {results.entityType === "company"
                        ? "Company Tax Rate"
                        : results.entityType === "smsf"
                          ? "Super Fund Tax Rate"
                          : "Marginal Tax Rate"}
                    </td>
                    <td className="py-2 text-right font-medium">
                      {(results.marginalRate * 100).toFixed(0)}%
                    </td>
                  </tr>
                  {results.taxInputMode === "income" &&
                    results.entityType !== "company" &&
                    results.entityType !== "smsf" && (
                      <>
                        <tr>
                          <td className="py-2 text-gray-600">Tax on Income (without gain)</td>
                          <td className="py-2 text-right font-medium">
                            {formatCurrency(results.taxWithoutGain)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">Tax on Income (with gain)</td>
                          <td className="py-2 text-right font-medium">
                            {formatCurrency(results.taxWithGain)}
                          </td>
                        </tr>
                      </>
                    )}
                  <tr className="font-semibold text-red-700">
                    <td className="py-2">Estimated CGT Payable</td>
                    <td className="py-2 text-right">{formatCurrency(results.estimatedTax)}</td>
                  </tr>
                  <tr className="font-semibold text-green-700">
                    <td className="py-2">Net Gain After Tax</td>
                    <td className="py-2 text-right">{formatCurrency(results.netGainAfterTax)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Effective CGT Rate</td>
                    <td className="py-2 text-right font-medium">
                      {results.effectiveCgtRate.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex gap-3">
            <span className="text-yellow-600 text-lg shrink-0">⚠</span>
            <p className="text-sm text-yellow-800">
              <strong>This is an estimate only. Consult a registered tax agent for advice.</strong> CGT calculations can be affected by losses carried forward, the main residence exemption, small business concessions, and other factors not captured here.
            </p>
          </div>

          {/* Affiliate CTA */}
          <div className="bg-blue-700 rounded-xl p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Need help lodging your tax return?</h3>
                <p className="text-blue-100 text-sm">
                  H&amp;R Block&apos;s registered tax agents can help you maximise CGT deductions,
                  apply the correct discount, and lodge your return correctly.
                </p>
              </div>
              <a
                href="https://www.hrblock.com.au/tax-services"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="shrink-0 inline-block bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm text-center"
              >
                Book a tax agent →
              </a>
            </div>
          </div>

          {/* 50% CGT Discount explanation */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              Understanding the CGT Discount
            </h3>
            <div className="space-y-3 text-sm text-green-800">
              <p>
                Australian tax law provides a CGT discount for assets held for at least
                12 months before disposal. The discount reduces the capital gain before it is
                added to your taxable income:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Individuals &amp; Trusts:</strong> 50% discount — only half the
                  capital gain is taxable
                </li>
                <li>
                  <strong>SMSFs:</strong> 33⅓% discount — two-thirds of the capital gain is
                  taxable
                </li>
                <li>
                  <strong>Companies:</strong> No discount — the full capital gain is taxed at
                  the company rate (25% for base-rate entities, 30% otherwise)
                </li>
              </ul>
              <p>
                The discount applies to most CGT assets including investment property, shares,
                ETFs, managed funds, and cryptocurrency. It does <strong>not</strong> apply to
                assets acquired before 20 September 1999 (which use the indexation method
                instead).
              </p>
            </div>
          </div>

          {/* Capital losses info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              Capital Losses &amp; Carry Forward
            </h3>
            <div className="space-y-3 text-sm text-amber-800">
              <p>
                If you make a capital loss, it can be used to <strong>offset capital gains</strong> in
                the same financial year. Any unused losses can be <strong>carried forward
                indefinitely</strong> to offset future capital gains.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Capital losses <strong>cannot</strong> be deducted against other income (salary, wages, business income)</li>
                <li>You must apply the loss against gains <strong>before</strong> applying the CGT discount</li>
                <li>Losses must be reported in your tax return for the year they occur</li>
                <li>There is <strong>no time limit</strong> on carrying forward capital losses</li>
                <li>Losses on personal-use assets and collectables have special restrictions</li>
              </ul>
            </div>
          </div>

          {/* Exemptions & concessions */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Common Exemptions &amp; Concessions
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold">Main Residence Exemption</p>
                <p>
                  Your principal place of residence is generally exempt from CGT. Partial
                  exemptions apply if the property was your home for only part of the
                  ownership period or was used to produce income.
                </p>
              </div>
              <div>
                <p className="font-semibold">6-Year Absence Rule</p>
                <p>
                  If you move out and rent your main residence, you can maintain the exemption
                  for up to 6 years — provided you do not claim another property as your main
                  residence during that time.
                </p>
              </div>
              <div>
                <p className="font-semibold">Small Business CGT Concessions</p>
                <p>
                  Businesses with aggregated turnover under $2 million (or net CGT assets under
                  $6 million) may qualify for the 15-year exemption, 50% active asset reduction,
                  retirement exemption, or rollover relief.
                </p>
              </div>
            </div>
          </div>

          {/* Tax brackets reference */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              2025–26 ATO Tax Brackets
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
              Medicare levy of 2% is not included. Company base rate is 25%. SMSF rate is 15%.
              Consult a tax professional for your specific situation.
            </p>
          </div>

          {/* Related Calculators */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/stamp-duty-calculator"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
              <Link
                href="/calculators/investment-property-cashflow"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Investment Property Cash Flow</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
              <Link
                href="/tax-withholding-calculator"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Income Tax / PAYG Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
              <Link
                href="/calculators/negative-gearing"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
              <Link
                href="/calculators/depreciation"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Depreciation Schedule Estimator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
              <Link
                href="/calculators/rental-yield"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-blue-600 font-medium">Rental Yield Calculator</span>
                <span className="text-gray-400 ml-auto">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
