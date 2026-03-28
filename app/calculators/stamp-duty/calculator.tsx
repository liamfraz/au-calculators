"use client";
import Link from "next/link";

import { useState, useMemo } from "react";
import { StateCode, STATE_NAMES, ALL_STATES } from "./constants";

type PropertyType = "primary" | "investment" | "vacant";

// --- Stamp Duty Calculation Functions (2025-2026 FY rates) ---

function calcNSW(value: number): number {
  if (value <= 0) return 0;
  if (value <= 17000) return value * 0.0125;
  if (value <= 37000) return 212 + (value - 17000) * 0.015;
  if (value <= 99000) return 512 + (value - 37000) * 0.0175;
  if (value <= 372000) return 1597 + (value - 99000) * 0.035;
  if (value <= 1240000) return 11152 + (value - 372000) * 0.045;
  if (value <= 3721000) return 50212 + (value - 1240000) * 0.055;
  return 186667 + (value - 3721000) * 0.07;
}

function calcVICGeneral(value: number): number {
  if (value <= 0) return 0;
  if (value <= 25000) return value * 0.014;
  if (value <= 130000) return 350 + (value - 25000) * 0.024;
  if (value <= 960000) return 2870 + (value - 130000) * 0.06;
  if (value <= 2000000) return value * 0.055;
  return 110000 + (value - 2000000) * 0.065;
}

function calcVICPrimary(value: number): number {
  if (value <= 0) return 0;
  if (value > 550000) return calcVICGeneral(value);
  if (value <= 25000) return value * 0.014;
  if (value <= 130000) return 350 + (value - 25000) * 0.024;
  if (value <= 440000) return 2870 + (value - 130000) * 0.05;
  return 18370 + (value - 440000) * 0.06;
}

function calcQLDGeneral(value: number): number {
  if (value <= 5000) return 0;
  if (value <= 75000) return (value - 5000) * 0.015;
  if (value <= 540000) return 1050 + (value - 75000) * 0.035;
  if (value <= 1000000) return 17325 + (value - 540000) * 0.045;
  return 38025 + (value - 1000000) * 0.0575;
}

function calcQLDPrimary(value: number): number {
  if (value <= 0) return 0;
  if (value <= 350000) return value * 0.01;
  if (value <= 540000) return 3500 + (value - 350000) * 0.035;
  if (value <= 1000000) return 10150 + (value - 540000) * 0.045;
  return 30850 + (value - 1000000) * 0.0575;
}

function calcSA(value: number): number {
  if (value <= 0) return 0;
  if (value <= 12000) return value * 0.01;
  if (value <= 30000) return 120 + (value - 12000) * 0.02;
  if (value <= 50000) return 480 + (value - 30000) * 0.03;
  if (value <= 100000) return 1080 + (value - 50000) * 0.035;
  if (value <= 200000) return 2830 + (value - 100000) * 0.04;
  if (value <= 250000) return 6830 + (value - 200000) * 0.0425;
  if (value <= 300000) return 8955 + (value - 250000) * 0.0475;
  if (value <= 500000) return 11330 + (value - 300000) * 0.05;
  return 21330 + (value - 500000) * 0.055;
}

function calcWA(value: number): number {
  if (value <= 0) return 0;
  if (value <= 120000) return value * 0.019;
  if (value <= 150000) return 2280 + (value - 120000) * 0.0285;
  if (value <= 360000) return 3135 + (value - 150000) * 0.038;
  if (value <= 725000) return 11115 + (value - 360000) * 0.0475;
  return 28453 + (value - 725000) * 0.0515;
}

function calcTAS(value: number): number {
  if (value <= 3000) return 50;
  if (value <= 25000) return 50 + (value - 3000) * 0.0175;
  if (value <= 75000) return 435 + (value - 25000) * 0.0225;
  if (value <= 200000) return 1560 + (value - 75000) * 0.035;
  if (value <= 375000) return 5935 + (value - 200000) * 0.04;
  if (value <= 725000) return 12935 + (value - 375000) * 0.0425;
  return 27810 + (value - 725000) * 0.045;
}

function calcNT(value: number): number {
  if (value <= 0) return 0;
  if (value <= 525000) {
    const v = value / 1000;
    return 0.06571441 * v * v + 15 * v;
  }
  if (value <= 3000000) return value * 0.0495;
  if (value <= 5000000) return value * 0.0575;
  return value * 0.0595;
}

function calcACTOwner(value: number): number {
  if (value <= 0) return 0;
  if (value <= 260000) return value * 0.0028;
  if (value <= 300000) return 728 + (value - 260000) * 0.0049;
  if (value <= 500000) return 924 + (value - 300000) * 0.034;
  if (value <= 750000) return 7724 + (value - 500000) * 0.0415;
  if (value <= 1000000) return 18099 + (value - 750000) * 0.0432;
  if (value <= 1455000) return 28899 + (value - 1000000) * 0.0454;
  return value * 0.0454 - 35238;
}

function calcACTInvestor(value: number): number {
  if (value <= 0) return 0;
  if (value <= 200000) return value * 0.012;
  if (value <= 300000) return 2400 + (value - 200000) * 0.022;
  if (value <= 500000) return 4600 + (value - 300000) * 0.034;
  if (value <= 750000) return 11400 + (value - 500000) * 0.0415;
  if (value <= 1000000) return 21775 + (value - 750000) * 0.0432;
  if (value <= 1455000) return 32575 + (value - 1000000) * 0.0454;
  return value * 0.0454;
}

// --- Main calculation orchestrator ---

interface DutyResult {
  baseDuty: number;
  concession: number;
  foreignSurcharge: number;
  totalDuty: number;
}

function getBaseDuty(state: StateCode, value: number, type: PropertyType): number {
  switch (state) {
    case "NSW": return calcNSW(value);
    case "VIC": return type === "primary" ? calcVICPrimary(value) : calcVICGeneral(value);
    case "QLD": return type === "primary" ? calcQLDPrimary(value) : calcQLDGeneral(value);
    case "SA": return calcSA(value);
    case "WA": return calcWA(value);
    case "TAS": return calcTAS(value);
    case "NT": return calcNT(value);
    case "ACT": return type === "investment" || type === "vacant"
      ? calcACTInvestor(value) : calcACTOwner(value);
  }
}

function getFHBConcession(state: StateCode, value: number, baseDuty: number): number {
  switch (state) {
    case "NSW":
      if (value <= 800000) return baseDuty;
      if (value <= 1000000) return baseDuty * (1 - (value - 800000) / 200000);
      return 0;
    case "VIC":
      if (value <= 600000) return baseDuty;
      if (value <= 750000) return baseDuty * (1 - (value - 600000) / 150000);
      return 0;
    case "QLD":
      if (value <= 700000) return baseDuty;
      return 0;
    case "SA":
      return baseDuty; // Full exemption for new homes (no cap)
    case "WA":
      if (value <= 500000) return baseDuty;
      if (value <= 700000) return baseDuty * (1 - (value - 500000) / 200000);
      return 0;
    case "TAS":
      if (value <= 750000) return baseDuty;
      return 0;
    case "ACT":
      if (value <= 1020000) return baseDuty;
      return Math.min(baseDuty, 35238);
    case "NT":
      return 0; // NT uses grants, not duty concessions
  }
}

function calculateStampDuty(
  state: StateCode,
  value: number,
  type: PropertyType,
  firstHomeBuyer: boolean,
  foreignBuyer: boolean,
): DutyResult {
  const baseDuty = Math.round(getBaseDuty(state, value, type));
  const foreignSurcharge = foreignBuyer ? Math.round(value * FOREIGN_SURCHARGE[state]) : 0;

  if (!firstHomeBuyer || type === "investment") {
    return { baseDuty, concession: 0, foreignSurcharge, totalDuty: baseDuty + foreignSurcharge };
  }

  const concession = Math.round(getFHBConcession(state, value, baseDuty));
  return { baseDuty, concession, foreignSurcharge, totalDuty: Math.max(0, baseDuty - concession) + foreignSurcharge };
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

// --- Foreign buyer surcharge rates (% of property value) ---

const FOREIGN_SURCHARGE: Record<StateCode, number> = {
  NSW: 0.09,  // 9% — increased from 8% on 1 Jan 2025
  VIC: 0.08,  // 8%
  QLD: 0.08,  // 8% AFAD
  SA: 0.07,   // 7%
  WA: 0.07,   // 7%
  TAS: 0.08,  // 8%
  NT: 0,      // No surcharge
  ACT: 0,     // No stamp duty surcharge (annual land tax surcharge instead)
};

const FOREIGN_NOTES: Record<StateCode, string> = {
  NSW: "9% surcharge on residential property (increased Jan 2025)",
  VIC: "8% foreign purchaser additional duty",
  QLD: "8% Additional Foreign Acquirer Duty (AFAD)",
  SA: "7% Foreign Ownership Surcharge",
  WA: "7% foreign transfer duty on residential property",
  TAS: "8% Foreign Investor Duty Surcharge",
  NT: "No foreign buyer surcharge applies in the NT",
  ACT: "No stamp duty surcharge — 0.75% annual land tax surcharge instead",
};

// --- FHB notes per state ---

const FHB_NOTES: Record<StateCode, string> = {
  NSW: "Exempt up to $800K, reduced to $1M (new & existing homes)",
  VIC: "Exempt up to $600K, reduced to $750K",
  QLD: "Exempt up to $700K (home concession)",
  SA: "Full exemption for new homes only (no cap)",
  WA: "Exempt up to $500K, reduced to $700K",
  TAS: "Exempt up to $750K (until June 2026)",
  ACT: "Exempt up to $1.02M, partial concession above (income test applies)",
  NT: "No stamp duty concession — $50K HomeGrown grant available instead",
};

// --- Component ---

export default function StampDutyCalculator({ initialState = "NSW", defaultPropertyValue = 500000 }: { initialState?: StateCode; defaultPropertyValue?: number } = {}) {
  const [state, setState] = useState<StateCode>(initialState);
  const [propertyValue, setPropertyValue] = useState(defaultPropertyValue);
  const [propertyType, setPropertyType] = useState<PropertyType>("primary");
  const [firstHomeBuyer, setFirstHomeBuyer] = useState(false);
  const [foreignBuyer, setForeignBuyer] = useState(false);

  const result = useMemo(
    () => calculateStampDuty(state, propertyValue, propertyType, firstHomeBuyer, foreignBuyer),
    [state, propertyValue, propertyType, firstHomeBuyer, foreignBuyer],
  );

  const comparison = useMemo(() => {
    return ALL_STATES.map((s) => ({
      code: s,
      name: STATE_NAMES[s],
      ...calculateStampDuty(s, propertyValue, propertyType, firstHomeBuyer, foreignBuyer),
    })).sort((a, b) => a.totalDuty - b.totalDuty);
  }, [propertyValue, propertyType, firstHomeBuyer, foreignBuyer]);

  const effectiveRate = propertyValue > 0
    ? ((result.totalDuty / propertyValue) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Calculate Your Stamp Duty
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* State selector */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State / Territory
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

          {/* Property value */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Property Value
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

          {/* Property type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <div className="flex gap-2">
              {([
                ["primary", "Primary Residence"],
                ["investment", "Investment"],
                ["vacant", "Vacant Land"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setPropertyType(value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    propertyType === value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* First home buyer toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Home Buyer
            </label>
            <button
              onClick={() => setFirstHomeBuyer(!firstHomeBuyer)}
              disabled={propertyType === "investment"}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                firstHomeBuyer && propertyType !== "investment"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } ${propertyType === "investment" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {firstHomeBuyer && propertyType !== "investment" ? "Yes — Concession Applied" : "No"}
            </button>
            {firstHomeBuyer && propertyType !== "investment" && (
              <p className="text-xs text-gray-500 mt-1">{FHB_NOTES[state]}</p>
            )}
          </div>

          {/* Foreign buyer surcharge toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foreign Buyer
            </label>
            <button
              onClick={() => setForeignBuyer(!foreignBuyer)}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
                foreignBuyer
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {foreignBuyer ? "Yes — Surcharge Applied" : "No"}
            </button>
            {foreignBuyer && (
              <p className="text-xs text-gray-500 mt-1">{FOREIGN_NOTES[state]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Base Duty</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(result.baseDuty)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Concessions</p>
          <p className={`text-xl font-bold ${result.concession > 0 ? "text-green-600" : "text-gray-400"}`}>
            {result.concession > 0 ? `−${formatCurrency(result.concession)}` : "$0"}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Foreign Surcharge</p>
          <p className={`text-xl font-bold ${result.foreignSurcharge > 0 ? "text-red-600" : "text-gray-400"}`}>
            {result.foreignSurcharge > 0 ? formatCurrency(result.foreignSurcharge) : "$0"}
          </p>
        </div>
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-blue-700 mb-1">Total Stamp Duty</p>
          <p className="text-xl font-bold text-blue-900">{formatCurrency(result.totalDuty)}</p>
          <p className="text-xs text-blue-600 mt-1">{effectiveRate}% effective rate</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Duty Breakdown — {STATE_NAMES[state]}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Property value</span>
            <span className="font-medium">{formatCurrency(propertyValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Property type</span>
            <span className="font-medium capitalize">{propertyType === "primary" ? "Primary residence" : propertyType === "investment" ? "Investment" : "Vacant land"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Standard duty ({STATE_NAMES[state]})</span>
            <span className="font-medium">{formatCurrency(result.baseDuty)}</span>
          </div>
          {result.concession > 0 && (
            <div className="flex justify-between text-green-700">
              <span>First home buyer concession</span>
              <span className="font-medium">−{formatCurrency(result.concession)}</span>
            </div>
          )}
          {result.foreignSurcharge > 0 && (
            <div className="flex justify-between text-red-700">
              <span>Foreign buyer surcharge ({(FOREIGN_SURCHARGE[state] * 100).toFixed(0)}%)</span>
              <span className="font-medium">+{formatCurrency(result.foreignSurcharge)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total stamp duty payable</span>
            <span className="text-blue-800">{formatCurrency(result.totalDuty)}</span>
          </div>
        </div>
      </div>

      {/* Total Purchase Cost Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Total Purchase Cost</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Property price</span>
            <span className="font-medium">{formatCurrency(propertyValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Stamp duty</span>
            <span className="font-medium">{formatCurrency(result.totalDuty)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-base">
            <span>Estimated total cost</span>
            <span className="text-blue-800">{formatCurrency(propertyValue + result.totalDuty)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Excludes legal fees, building inspections, loan fees, and other settlement costs.
          </p>
        </div>
      </div>

      {/* State Comparison Table */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          Compare Stamp Duty Across All States
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          For a {formatCurrency(propertyValue)} {propertyType === "primary" ? "primary residence" : propertyType === "investment" ? "investment property" : "vacant land block"}
          {firstHomeBuyer && propertyType !== "investment" ? " (first home buyer)" : ""}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">State</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Base Duty</th>
                {firstHomeBuyer && propertyType !== "investment" && (
                  <th className="text-right py-2 px-4 font-medium text-gray-700">Concession</th>
                )}
                {foreignBuyer && (
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
                    {formatCurrency(row.baseDuty)}
                  </td>
                  {firstHomeBuyer && propertyType !== "investment" && (
                    <td className={`text-right py-2 px-4 ${row.concession > 0 ? "text-green-600" : "text-gray-400"}`}>
                      {row.concession > 0 ? `−${formatCurrency(row.concession)}` : "—"}
                    </td>
                  )}
                  {foreignBuyer && (
                    <td className={`text-right py-2 px-4 ${row.foreignSurcharge > 0 ? "text-red-600" : "text-gray-400"}`}>
                      {row.foreignSurcharge > 0 ? formatCurrency(row.foreignSurcharge) : "—"}
                    </td>
                  )}
                  <td className="text-right py-2 px-4 font-semibold text-gray-900">
                    {formatCurrency(row.totalDuty)}
                  </td>
                  <td className="text-right py-2 pl-4 text-gray-500">
                    {propertyValue > 0 ? ((row.totalDuty / propertyValue) * 100).toFixed(2) : "0.00"}%
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
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Mortgage Repayment Calculator</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link
            href="/calculators/car-loan"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Car Loan Calculator</span>
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
            href="/calculators/hecs-help"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">HECS-HELP Calculator</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
