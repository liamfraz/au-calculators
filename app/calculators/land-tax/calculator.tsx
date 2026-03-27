"use client";
import Link from "next/link";

import { useState, useMemo } from "react";

type StateCode = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS";
type OwnerType = "individual" | "trust";

const STATE_NAMES: Record<StateCode, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
};

const ALL_STATES: StateCode[] = ["NSW", "VIC", "QLD", "SA", "WA", "TAS"];

// --- Land Tax Thresholds ---

const THRESHOLDS: Record<StateCode, { individual: number; trust: number }> = {
  NSW: { individual: 1075000, trust: 0 },
  VIC: { individual: 50000, trust: 50000 },
  QLD: { individual: 600000, trust: 350000 },
  SA: { individual: 450000, trust: 25000 },
  WA: { individual: 300000, trust: 300000 },
  TAS: { individual: 100000, trust: 100000 },
};

const TOP_RATES: Record<StateCode, string> = {
  NSW: "2.0%",
  VIC: "2.55%",
  QLD: "2.25%",
  SA: "2.4%",
  WA: "~0.25%+",
  TAS: "1.5%",
};

// --- Absentee surcharge rates ---

const ABSENTEE_SURCHARGES: Record<StateCode, number> = {
  NSW: 0.04,
  VIC: 0.04,
  QLD: 0.02,
  SA: 0.02,
  WA: 0,
  TAS: 0,
};

// --- Land Tax Calculation Functions (2025-2026 FY rates) ---

function calcNSWIndividual(value: number): number {
  if (value <= 1075000) return 0;
  if (value <= 6680000) return 100 + (value - 1075000) * 0.016;
  return 89780 + (value - 6680000) * 0.02;
}

function calcNSWTrust(value: number): number {
  if (value <= 0) return 0;
  if (value <= 6680000) return value * 0.016;
  return 6680000 * 0.016 + (value - 6680000) * 0.02;
}

function calcVICIndividual(value: number): number {
  if (value <= 50000) return 0;
  if (value <= 100000) return 500;
  if (value <= 300000) return 975 + (value - 100000) * 0.002;
  if (value <= 600000) return 1375 + (value - 300000) * 0.005;
  if (value <= 1000000) return 2875 + (value - 600000) * 0.008;
  if (value <= 1800000) return 6075 + (value - 1000000) * 0.0155;
  if (value <= 3000000) return 18475 + (value - 1800000) * 0.02;
  return 42475 + (value - 3000000) * 0.0255;
}

function calcVICTrust(value: number): number {
  const base = calcVICIndividual(value);
  if (value <= 50000) return 0;
  return base + (value - 50000) * 0.00375;
}

function calcQLDIndividual(value: number): number {
  if (value <= 600000) return 0;
  if (value <= 999999) return 500 + (value - 600000) * 0.01;
  if (value <= 2999999) return 4500 + (value - 1000000) * 0.0165;
  if (value <= 4999999) return 37500 + (value - 3000000) * 0.0125;
  if (value <= 9999999) return 62500 + (value - 5000000) * 0.0175;
  return 150000 + (value - 10000000) * 0.0225;
}

function calcQLDTrust(value: number): number {
  if (value <= 350000) return 0;
  // Simplified: trusts use similar brackets but from $350K threshold
  if (value <= 999999) return 500 + (value - 350000) * 0.01;
  if (value <= 2999999) return 500 + (999999 - 350000) * 0.01 + (value - 1000000) * 0.0165;
  return calcQLDIndividual(value); // Higher brackets converge
}

function calcSAIndividual(value: number): number {
  if (value <= 450000) return 0;
  if (value <= 854000) return (value - 450000) * 0.005;
  if (value <= 1110000) return 2020 + (value - 854000) * 0.01;
  return 4580 + (value - 1110000) * 0.024;
}

function calcSATrust(value: number): number {
  if (value <= 25000) return 0;
  if (value <= 450000) return (value - 25000) * 0.005;
  if (value <= 854000) return 2125 + (value - 450000) * 0.005;
  if (value <= 1110000) return 2125 + (854000 - 450000) * 0.005 + (value - 854000) * 0.01;
  return calcSAIndividual(value) + (Math.min(value, 450000) - 25000) * 0.005;
}

function calcWAIndividual(value: number): number {
  if (value <= 300000) return 0;
  if (value <= 420000) {
    // Phase-in range: proportional calculation
    const excess = value - 300000;
    return excess * excess * 0.0025 / 120000;
  }
  // Above $420,000 - standard scale
  return (value - 300000) * 0.0025;
}

function calcTASIndividual(value: number): number {
  if (value <= 100000) return 0;
  if (value <= 350000) return 50 + (value - 100000) * 0.0055;
  return 1425 + (value - 350000) * 0.015;
}

// --- Main calculation ---

interface LandTaxResult {
  threshold: number;
  baseTax: number;
  absenteeSurcharge: number;
  totalTax: number;
  effectiveRate: number;
}

function calculateLandTax(
  state: StateCode,
  landValue: number,
  ownerType: OwnerType,
  isAbsentee: boolean,
): LandTaxResult {
  const threshold = THRESHOLDS[state][ownerType === "trust" ? "trust" : "individual"];

  let baseTax: number;
  if (ownerType === "trust") {
    switch (state) {
      case "NSW": baseTax = calcNSWTrust(landValue); break;
      case "VIC": baseTax = calcVICTrust(landValue); break;
      case "QLD": baseTax = calcQLDTrust(landValue); break;
      case "SA": baseTax = calcSATrust(landValue); break;
      case "WA": baseTax = calcWAIndividual(landValue); break; // WA same rates
      case "TAS": baseTax = calcTASIndividual(landValue); break; // TAS same rates
    }
  } else {
    switch (state) {
      case "NSW": baseTax = calcNSWIndividual(landValue); break;
      case "VIC": baseTax = calcVICIndividual(landValue); break;
      case "QLD": baseTax = calcQLDIndividual(landValue); break;
      case "SA": baseTax = calcSAIndividual(landValue); break;
      case "WA": baseTax = calcWAIndividual(landValue); break;
      case "TAS": baseTax = calcTASIndividual(landValue); break;
    }
  }

  baseTax = Math.round(baseTax!);

  const absenteeSurcharge = isAbsentee
    ? Math.round(landValue * ABSENTEE_SURCHARGES[state])
    : 0;

  const totalTax = baseTax + absenteeSurcharge;
  const effectiveRate = landValue > 0 ? (totalTax / landValue) * 100 : 0;

  return { threshold, baseTax, absenteeSurcharge, totalTax, effectiveRate };
}

// --- Formatting ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// --- Component ---

export default function LandTaxCalculator() {
  const [state, setState] = useState<StateCode>("NSW");
  const [landValue, setLandValue] = useState(500000);
  const [ownerType, setOwnerType] = useState<OwnerType>("individual");
  const [isAbsentee, setIsAbsentee] = useState(false);

  const result = useMemo(
    () => calculateLandTax(state, landValue, ownerType, isAbsentee),
    [state, landValue, ownerType, isAbsentee],
  );

  const comparison = useMemo(() => {
    return ALL_STATES.map((s) => ({
      code: s,
      name: STATE_NAMES[s],
      ...calculateLandTax(s, landValue, ownerType, isAbsentee),
    })).sort((a, b) => a.totalTax - b.totalTax);
  }, [landValue, ownerType, isAbsentee]);

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Calculate Your Land Tax
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* State selector */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value as StateCode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ALL_STATES.map((s) => (
                <option key={s} value={s}>{s} — {STATE_NAMES[s]}</option>
              ))}
            </select>
          </div>

          {/* Land value */}
          <div>
            <label htmlFor="landValue" className="block text-sm font-medium text-gray-700 mb-1">
              Total Land Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="landValue"
                type="number"
                min={0}
                step={10000}
                value={landValue}
                onChange={(e) => setLandValue(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Owner type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner Type
            </label>
            <div className="flex gap-2">
              {([
                ["individual", "Individual"],
                ["trust", "Trust / Company"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setOwnerType(value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    ownerType === value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Absentee owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Absentee / Foreign Owner
            </label>
            <div className="flex gap-2">
              {([
                [false, "No"],
                [true, "Yes"],
              ] as const).map(([value, label]) => (
                <button
                  key={String(value)}
                  onClick={() => setIsAbsentee(value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    isAbsentee === value
                      ? value
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {isAbsentee && ABSENTEE_SURCHARGES[state] > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                +{(ABSENTEE_SURCHARGES[state] * 100).toFixed(0)}% absentee surcharge applies in {state}
              </p>
            )}
            {isAbsentee && ABSENTEE_SURCHARGES[state] === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No absentee surcharge applies in {state}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Threshold ({state})</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.threshold)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Base Land Tax</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.baseTax)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Absentee Surcharge</p>
          <p className={`text-2xl font-bold ${result.absenteeSurcharge > 0 ? "text-amber-600" : "text-gray-400"}`}>
            {result.absenteeSurcharge > 0 ? formatCurrency(result.absenteeSurcharge) : "$0"}
          </p>
        </div>
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-blue-700 mb-1">Total Land Tax</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(result.totalTax)}</p>
          <p className="text-xs text-blue-600 mt-1">{result.effectiveRate.toFixed(2)}% effective rate</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Tax Breakdown — {STATE_NAMES[state]}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total land value</span>
            <span className="font-medium">{formatCurrency(landValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax-free threshold</span>
            <span className="font-medium">{formatCurrency(result.threshold)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Owner type</span>
            <span className="font-medium capitalize">{ownerType === "individual" ? "Individual" : "Trust / Company"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Base land tax</span>
            <span className="font-medium">{formatCurrency(result.baseTax)}</span>
          </div>
          {result.absenteeSurcharge > 0 && (
            <div className="flex justify-between text-amber-700">
              <span>Absentee surcharge ({(ABSENTEE_SURCHARGES[state] * 100).toFixed(0)}%)</span>
              <span className="font-medium">+{formatCurrency(result.absenteeSurcharge)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total land tax payable</span>
            <span className="text-blue-800">{formatCurrency(result.totalTax)}</span>
          </div>
        </div>
        {ownerType === "trust" && (
          <p className="text-xs text-gray-500 mt-3">
            Note: Trust and company rates are simplified. Some states have additional brackets
            and surcharges for trusts that may differ from this estimate. Consult your state
            revenue office for precise figures.
          </p>
        )}
      </div>

      {/* State Comparison Table */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Compare Land Tax Across All States
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          For a {formatCurrency(landValue)} land value ({ownerType === "individual" ? "individual" : "trust/company"} owner{isAbsentee ? ", absentee" : ""})
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">State</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Threshold</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Base Tax</th>
                {isAbsentee && (
                  <th className="text-right py-2 px-4 font-medium text-gray-700">Surcharge</th>
                )}
                <th className="text-right py-2 px-4 font-medium text-gray-700">Total</th>
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
                    {formatCurrency(row.threshold)}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrency(row.baseTax)}
                  </td>
                  {isAbsentee && (
                    <td className={`text-right py-2 px-4 ${row.absenteeSurcharge > 0 ? "text-amber-600" : "text-gray-400"}`}>
                      {row.absenteeSurcharge > 0 ? formatCurrency(row.absenteeSurcharge) : "--"}
                    </td>
                  )}
                  <td className="text-right py-2 px-4 font-semibold text-gray-900">
                    {formatCurrency(row.totalTax)}
                  </td>
                  <td className="text-right py-2 pl-4 text-gray-500">
                    {row.effectiveRate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threshold Summary */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Land Tax Thresholds & Top Rates by State
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          2025-2026 financial year — individual owner thresholds
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">State</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Individual Threshold</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Trust Threshold</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Top Marginal Rate</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Absentee Surcharge</th>
              </tr>
            </thead>
            <tbody>
              {ALL_STATES.map((s) => (
                <tr key={s} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-900">{s}</td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrency(THRESHOLDS[s].individual)}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {THRESHOLDS[s].trust === 0 ? "No threshold" : formatCurrency(THRESHOLDS[s].trust)}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">{TOP_RATES[s]}</td>
                  <td className="text-right py-2 pl-4 text-gray-600">
                    {ABSENTEE_SURCHARGES[s] > 0 ? `+${(ABSENTEE_SURCHARGES[s] * 100).toFixed(0)}%` : "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NT and ACT notes */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <span className="font-medium text-gray-700 shrink-0">NT:</span>
            <span>The Northern Territory does not levy a general land tax on property owners.</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <span className="font-medium text-gray-700 shrink-0">ACT:</span>
            <span>The ACT has largely transitioned from stamp duty to a rates-based system. Land tax in the ACT is incorporated into general rates rather than levied as a separate tax.</span>
          </div>
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
            href="/calculators/rental-yield"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Rental Yield Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/property-cashflow"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Property Cash Flow Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/negative-gearing"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
