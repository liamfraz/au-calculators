"use client";

import { useState, useMemo } from "react";

type AUState = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

// --- FHOG Grant Rules by State (2024-25) ---

interface FHOGRule {
  amount: number;
  newOnly: boolean;
  priceCapNew: number | null;
  priceCapEstablished: number | null;
  notes: string;
  eligibleForEstablished?: boolean;
}

const FHOG_RULES: Record<AUState, FHOGRule> = {
  NSW: {
    amount: 10000,
    newOnly: true,
    priceCapNew: 750000,
    priceCapEstablished: null,
    notes: "Available for new homes or substantially renovated homes.",
  },
  VIC: {
    amount: 10000,
    newOnly: true,
    priceCapNew: 750000,
    priceCapEstablished: null,
    notes: "Available in regional Victoria only. Metro Melbourne FHOG ended July 2023.",
  },
  QLD: {
    amount: 30000,
    newOnly: true,
    priceCapNew: 750000,
    priceCapEstablished: null,
    notes: "Increased to $30,000 from November 2023 for new homes.",
  },
  SA: {
    amount: 15000,
    newOnly: true,
    priceCapNew: 650000,
    priceCapEstablished: null,
    notes: "Available for new homes valued up to $650,000.",
  },
  WA: {
    amount: 10000,
    newOnly: true,
    priceCapNew: 750000,
    priceCapEstablished: null,
    notes: "Available for new homes valued up to $750,000.",
  },
  TAS: {
    amount: 30000,
    newOnly: true,
    priceCapNew: 750000,
    priceCapEstablished: null,
    notes: "Increased to $30,000. Available for new homes valued up to $750,000.",
  },
  NT: {
    amount: 10000,
    newOnly: false,
    priceCapNew: 600000,
    priceCapEstablished: 600000,
    eligibleForEstablished: true,
    notes: "Available for new and established homes valued up to $600,000.",
  },
  ACT: {
    amount: 0,
    newOnly: false,
    priceCapNew: null,
    priceCapEstablished: null,
    notes:
      "ACT replaced FHOG with the Home Buyer Concession Scheme — a full stamp duty exemption for eligible buyers.",
  },
};

// --- Stamp Duty Concession Rules ---

interface StampDutyRule {
  exemptionLimit: number | null;
  concessionLimit: number | null;
  label: string;
  estimateSaving: (price: number) => number;
}

// Simplified NSW stamp duty formula for illustration
function nswSavingEstimate(price: number): number {
  if (price <= 800000) {
    // Full exemption — estimate full stamp duty avoided
    if (price <= 32000) return price * 0.0125;
    if (price <= 88000) return 400 + (price - 32000) * 0.015;
    if (price <= 327000) return 1240 + (price - 88000) * 0.0175;
    if (price <= 1089000) return 5418 + (price - 327000) * 0.035;
    return 32148 + (price - 1089000) * 0.045;
  }
  if (price <= 1000000) {
    // Partial: proportional concession
    const fullDuty =
      price <= 1089000 ? 5418 + (price - 327000) * 0.035 : 32148 + (price - 1089000) * 0.045;
    return Math.round(fullDuty * ((1000000 - price) / 200000));
  }
  return 0;
}

function vicSavingEstimate(price: number): number {
  if (price <= 600000) {
    // Full duty avoided (VIC duty on $600K ≈ $31,070)
    if (price <= 25000) return price * 0.014;
    if (price <= 130000) return 350 + (price - 25000) * 0.024;
    if (price <= 960000) return 2870 + (price - 130000) * 0.06;
    return 52670 + (price - 960000) * 0.065;
  }
  if (price <= 750000) {
    const fullDuty = 2870 + (price - 130000) * 0.06;
    return Math.round(fullDuty * ((750000 - price) / 150000));
  }
  return 0;
}

function waSavingEstimate(price: number): number {
  if (price <= 430000) {
    // Full exemption
    if (price <= 120000) return price * 0.019;
    if (price <= 150000) return 2280 + (price - 120000) * 0.0228;
    if (price <= 360000) return 2964 + (price - 150000) * 0.026;
    if (price <= 725000) return 8424 + (price - 360000) * 0.028;
    return 18644 + (price - 725000) * 0.04;
  }
  if (price <= 530000) {
    const fullDuty = 8424 + (price - 360000) * 0.028;
    return Math.round(fullDuty * ((530000 - price) / 100000));
  }
  return 0;
}

const STAMP_DUTY_RULES: Record<AUState, StampDutyRule> = {
  NSW: {
    exemptionLimit: 800000,
    concessionLimit: 1000000,
    label: "Full exemption under $800K, partial concession $800K–$1M",
    estimateSaving: nswSavingEstimate,
  },
  VIC: {
    exemptionLimit: 600000,
    concessionLimit: 750000,
    label: "Full exemption under $600K, partial concession $600K–$750K",
    estimateSaving: vicSavingEstimate,
  },
  QLD: {
    exemptionLimit: null,
    concessionLimit: 700000,
    label: "First home concession rate applies under $700,000 — significantly reduced duty",
    estimateSaving: (price) => (price <= 700000 ? Math.round(price * 0.025) : 0),
  },
  SA: {
    exemptionLimit: null,
    concessionLimit: null,
    label: "No specific first home buyer stamp duty exemption in SA",
    estimateSaving: () => 0,
  },
  WA: {
    exemptionLimit: 430000,
    concessionLimit: 530000,
    label: "Full exemption under $430K, partial concession $430K–$530K",
    estimateSaving: waSavingEstimate,
  },
  TAS: {
    exemptionLimit: null,
    concessionLimit: 600000,
    label: "50% duty reduction for established homes under $600K",
    estimateSaving: (price) =>
      price <= 600000 ? Math.round((price * 0.04) / 2) : 0,
  },
  NT: {
    exemptionLimit: null,
    concessionLimit: 650000,
    label: "50% First Home Owner Discount for homes under $650K",
    estimateSaving: (price) =>
      price <= 650000 ? Math.round((price * 0.045) / 2) : 0,
  },
  ACT: {
    exemptionLimit: 1000000,
    concessionLimit: null,
    label: "Full duty exemption under ~$1M via Home Buyer Concession Scheme (income-tested)",
    estimateSaving: (price) => (price <= 1000000 ? Math.round(price * 0.042) : 0),
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const AU_STATES: { value: AUState; label: string }[] = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

export default function FHOGCalculator() {
  const [state, setState] = useState<AUState>("NSW");
  const [propertyValue, setPropertyValue] = useState(650000);
  const [isNewBuild, setIsNewBuild] = useState(true);
  const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(true);

  const results = useMemo(() => {
    if (!isFirstHomeBuyer) {
      return {
        eligible: false,
        reason: "You must be a first home buyer who has never owned or co-owned residential property in Australia.",
        fhogEligible: false,
        fhogAmount: 0,
        fhogReason: "",
        sdEligible: false,
        sdSaving: 0,
        sdLabel: "",
        fhogNotes: "",
        totalBenefit: 0,
      };
    }

    const fhog = FHOG_RULES[state];
    const sdRule = STAMP_DUTY_RULES[state];

    // FHOG eligibility
    let fhogAmount = 0;
    let fhogEligible = false;
    let fhogReason = "";

    if (fhog.amount === 0) {
      fhogEligible = false;
      fhogReason = fhog.notes;
    } else if (fhog.newOnly && !isNewBuild) {
      fhogEligible = false;
      fhogReason = `The FHOG in ${state} is only available for new builds or substantially renovated homes.`;
    } else {
      const priceCap = isNewBuild ? fhog.priceCapNew : fhog.priceCapEstablished;
      if (priceCap && propertyValue > priceCap) {
        fhogEligible = false;
        fhogReason = `Property value ${formatCurrency(propertyValue)} exceeds the ${state} price cap of ${formatCurrency(priceCap)}.`;
      } else {
        fhogEligible = true;
        fhogAmount = fhog.amount;
      }
    }

    // Stamp duty concession
    const sdSaving = sdRule.estimateSaving(propertyValue);
    const sdEligible = sdSaving > 0;

    // Total benefit
    const totalBenefit = fhogAmount + sdSaving;

    return {
      eligible: fhogEligible || sdEligible,
      fhogEligible,
      fhogAmount,
      fhogReason,
      sdEligible,
      sdSaving,
      sdLabel: sdRule.label,
      fhogNotes: fhog.notes,
      totalBenefit,
    };
  }, [state, propertyValue, isNewBuild, isFirstHomeBuyer]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Inputs */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State / Territory</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value as AUState)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AU_STATES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Value</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={100000}
                max={2000000}
                step={10000}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsNewBuild(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  isNewBuild
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                New Build
              </button>
              <button
                onClick={() => setIsNewBuild(false)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  !isNewBuild
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                Established
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Home Buyer?</label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsFirstHomeBuyer(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  isFirstHomeBuyer
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setIsFirstHomeBuyer(false)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  !isFirstHomeBuyer
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        {!isFirstHomeBuyer ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            <strong>Not eligible.</strong> The First Home Owner Grant is only available to buyers who have never owned or co-owned residential property in Australia.
          </div>
        ) : (
          <div className="space-y-4">
            {/* FHOG Result */}
            <div className={`rounded-xl p-5 border ${results.fhogEligible ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">First Home Owner Grant (FHOG)</h3>
                  {results.fhogEligible ? (
                    <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(results.fhogAmount)}</p>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{results.fhogReason || FHOG_RULES[state].notes}</p>
                  )}
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${results.fhogEligible ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                  {results.fhogEligible ? "Eligible" : "Not eligible"}
                </span>
              </div>
              {results.fhogEligible && (
                <p className="text-xs text-gray-500 mt-2">{FHOG_RULES[state].notes}</p>
              )}
            </div>

            {/* Stamp Duty Concession */}
            <div className={`rounded-xl p-5 border ${results.sdEligible ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Stamp Duty Concession</h3>
                  {results.sdEligible ? (
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      ~{formatCurrency(results.sdSaving)}
                      <span className="text-sm font-normal text-blue-600 ml-1">estimated saving</span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{STAMP_DUTY_RULES[state].label}</p>
                  )}
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${results.sdEligible ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-600"}`}>
                  {results.sdEligible ? "Applicable" : "None"}
                </span>
              </div>
              {results.sdEligible && (
                <p className="text-xs text-gray-500 mt-2">{STAMP_DUTY_RULES[state].label}</p>
              )}
            </div>

            {/* Total Benefit */}
            {results.totalBenefit > 0 && (
              <div className="bg-blue-700 text-white rounded-xl p-5">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Estimated Total Benefit</span>
                  <span className="text-2xl font-bold">{formatCurrency(results.totalBenefit)}</span>
                </div>
                <p className="text-xs text-blue-200 mt-2">
                  Includes {results.fhogEligible ? "FHOG grant" : ""}
                  {results.fhogEligible && results.sdEligible ? " + " : ""}
                  {results.sdEligible ? "stamp duty concession estimate" : ""}. Stamp duty savings are indicative only.
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Eligibility rules are based on published 2024-25 state government guidelines. Always confirm with your state revenue office or a qualified conveyancer before purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
