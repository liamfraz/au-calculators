"use client";

import { useState, useMemo } from "react";
import {
  StateCode,
  STATE_NAMES,
  ALL_STATES,
  calculateFHBConcession,
  STATE_FHB_THRESHOLDS,
  STATE_FHB_SOURCES,
} from "./constants";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function FHBConcessionCalculator({
  initialState = "NSW",
  defaultPropertyValue = 550000,
}: {
  initialState?: StateCode;
  defaultPropertyValue?: number;
} = {}) {
  const [state, setState] = useState<StateCode>(initialState);
  const [propertyValue, setPropertyValue] = useState(defaultPropertyValue);
  const [propertyIsNew, setPropertyIsNew] = useState(true); // For SA only

  const result = useMemo(
    () => calculateFHBConcession(state, propertyValue, propertyIsNew),
    [state, propertyValue, propertyIsNew],
  );

  const comparison = useMemo(() => {
    return ALL_STATES.map((s) => {
      const res = calculateFHBConcession(s, propertyValue, propertyIsNew);
      return {
        code: s,
        name: STATE_NAMES[s],
        ...res,
      };
    }).sort((a, b) => a.amountPayable - b.amountPayable);
  }, [propertyValue, propertyIsNew]);

  const savingsPercentage =
    result.fullDuty > 0
      ? ((result.concessionAmount / result.fullDuty) * 100).toFixed(1)
      : "0";

  const effectiveRate =
    propertyValue > 0
      ? ((result.amountPayable / propertyValue) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Calculate Your First Home Buyer Stamp Duty Concession
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* State selector */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">
              State / Territory
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value as StateCode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ALL_STATES.map((s) => (
                <option key={s} value={s}>
                  {s} — {STATE_NAMES[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Property value */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1.5">
              Property Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="value"
                type="number"
                min={0}
                step={10000}
                value={propertyValue}
                onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* SA: new vs established toggle */}
          {state === "SA" && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Property Status
              </label>
              <div className="flex gap-2">
                {(
                  [
                    [true, "New / Off-the-plan"],
                    [false, "Established"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={String(value)}
                    onClick={() => setPropertyIsNew(value)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      propertyIsNew === value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                SA concession only applies to new and off-the-plan homes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Eligibility Badge */}
      <div
        className={`border rounded-xl p-4 text-center ${
          result.isFullyExempt
            ? "border-green-200 bg-green-50"
            : result.isPartiallyExempt
              ? "border-yellow-200 bg-yellow-50"
              : "border-red-200 bg-red-50"
        }`}
      >
        <p className="text-sm font-medium mb-1">
          {result.isFullyExempt
            ? "Fully Exempt"
            : result.isPartiallyExempt
              ? "Partial Concession"
              : "Not Eligible"}
        </p>
        <p
          className={`text-xs ${
            result.isFullyExempt
              ? "text-green-700"
              : result.isPartiallyExempt
                ? "text-yellow-700"
                : "text-red-700"
          }`}
        >
          {result.eligibilityNote}
        </p>
      </div>

      {/* Results: 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Full Stamp Duty */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Full Stamp Duty</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.fullDuty)}</p>
          <p className="text-xs text-gray-400 mt-1">Without concession</p>
        </div>

        {/* Concession / Exemption Amount */}
        <div className="border border-green-200 rounded-xl p-5 bg-green-50 text-center">
          <p className="text-sm text-green-700 mb-1">Concession / Exemption</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.concessionAmount)}</p>
          <p className="text-xs text-green-600 mt-1">{savingsPercentage}% saved</p>
        </div>

        {/* Amount Payable */}
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-blue-700 mb-1">Amount Payable</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(result.amountPayable)}</p>
          <p className="text-xs text-blue-600 mt-1">{effectiveRate}% effective rate</p>
        </div>
      </div>

      {/* Detailed Eligibility Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Eligibility Details — {STATE_NAMES[state]}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Property Price</span>
            <span className="font-medium">{formatCurrency(propertyValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Full Stamp Duty</span>
            <span className="font-medium">{formatCurrency(result.fullDuty)}</span>
          </div>
          {result.concessionAmount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>First Home Buyer Concession</span>
              <span className="font-medium">−{formatCurrency(result.concessionAmount)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
            <span>Amount Payable</span>
            <span className="text-blue-800">{formatCurrency(result.amountPayable)}</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-xs text-gray-600 mb-2">
              <span className="font-semibold text-gray-900">{STATE_NAMES[state]} FHB Concession Rules:</span>
            </p>
            <p className="text-xs text-gray-700">{result.eligibilityNote}</p>
            <p className="text-xs text-gray-500 mt-2">
              Eligibility threshold: {STATE_FHB_THRESHOLDS[state]}
            </p>
          </div>
        </div>
      </div>

      {/* State Comparison Table */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">Compare All States</h3>
        <p className="text-sm text-gray-500 mb-4">
          First home buyer stamp duty for a {formatCurrency(propertyValue)} property
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">State</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Full Duty</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Concession</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Payable</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Eff. Rate</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr
                  key={row.code}
                  className={`border-b border-gray-100 ${row.code === state ? "bg-blue-50" : ""}`}
                >
                  <td className="py-2 pr-4">
                    <span className={`font-medium ${row.code === state ? "text-blue-800" : "text-gray-900"}`}>
                      {row.code}
                    </span>
                    <span className="text-gray-500 ml-1 hidden sm:inline">
                      {STATE_NAMES[row.code]}
                    </span>
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrency(row.fullDuty)}
                  </td>
                  <td className={`text-right py-2 px-4 font-medium ${row.concessionAmount > 0 ? "text-green-600" : "text-gray-400"}`}>
                    {row.concessionAmount > 0 ? `−${formatCurrency(row.concessionAmount)}` : "—"}
                  </td>
                  <td className={`text-right py-2 px-4 font-semibold ${row.code === state ? "text-blue-900" : "text-gray-900"}`}>
                    {formatCurrency(row.amountPayable)}
                  </td>
                  <td className="text-right py-2 pl-4 text-gray-500">
                    {propertyValue > 0 ? ((row.amountPayable / propertyValue) * 100).toFixed(2) : "0.00"}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source Attribution */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Rates sourced from official state revenue offices (2025–2026). See{" "}
          <span className="font-medium">{STATE_FHB_SOURCES[state]}</span> for details.
        </p>
      </div>
    </div>
  );
}
