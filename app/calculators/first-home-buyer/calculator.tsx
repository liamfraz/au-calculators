"use client";
import { useState, useMemo } from "react";

type State = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";
type ResidencyStatus = "citizen" | "permanent_resident" | "other";

interface Inputs {
  state: State;
  propertyPrice: number;
  annualIncome: number;
  isCombinedIncome: boolean;
  savings: number;
  isFirstHomeBuyer: boolean;
  residencyStatus: ResidencyStatus;
  isNewBuild: boolean;
}

interface SchemeResult {
  name: string;
  eligible: boolean;
  reason: string;
  estimatedSaving: number;
  nextSteps: string[];
}

// FHBG income cap: $125k single, $200k combined
const FHBG_INCOME_CAP_SINGLE = 125000;
const FHBG_INCOME_CAP_COMBINED = 200000;
const FHBG_PROPERTY_CAP: Record<State, number> = {
  NSW: 900000,
  VIC: 800000,
  QLD: 700000,
  WA: 600000,
  SA: 600000,
  TAS: 600000,
  ACT: 750000,
  NT: 600000,
};

// FHSS max voluntary contributions withdrawable
const FHSS_MAX_RELEASE = 50000;
const FHSS_TAX_RATE_MARGINAL_APPROX = 0.3;
const FHSS_TAX_RATE_CONCESSIONAL = 0.15;

// FHOG by state (2024-25)
interface FHOGConfig {
  grantAmount: number;
  newBuildOnly: boolean;
  propertyCapNew: number;
  propertyCapExisting: number;
}

const FHOG_CONFIG: Record<State, FHOGConfig> = {
  NSW: { grantAmount: 10000, newBuildOnly: true, propertyCapNew: 600000, propertyCapExisting: 0 },
  VIC: { grantAmount: 10000, newBuildOnly: true, propertyCapNew: 750000, propertyCapExisting: 0 },
  QLD: { grantAmount: 30000, newBuildOnly: true, propertyCapNew: 750000, propertyCapExisting: 0 },
  WA: { grantAmount: 10000, newBuildOnly: true, propertyCapNew: 750000, propertyCapExisting: 0 },
  SA: { grantAmount: 15000, newBuildOnly: true, propertyCapNew: 650000, propertyCapExisting: 0 },
  TAS: { grantAmount: 30000, newBuildOnly: true, propertyCapNew: 750000, propertyCapExisting: 0 },
  ACT: { grantAmount: 7000, newBuildOnly: true, propertyCapNew: 750000, propertyCapExisting: 0 },
  NT: { grantAmount: 10000, newBuildOnly: false, propertyCapNew: 750000, propertyCapExisting: 650000 },
};

// Stamp duty exemption thresholds by state for first home buyers (2024-25)
interface StampDutyExemption {
  exemptionThreshold: number;
  concessionThreshold: number;
  newBuildOnly: boolean;
  estimateFullDuty: (price: number) => number;
}

const STAMP_DUTY_CONFIG: Record<State, StampDutyExemption> = {
  NSW: {
    exemptionThreshold: 800000,
    concessionThreshold: 1000000,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      if (p <= 17000) return p * 0.0125;
      if (p <= 36000) return 212.5 + (p - 17000) * 0.015;
      if (p <= 97000) return 497.5 + (p - 36000) * 0.0175;
      if (p <= 364000) return 1565 + (p - 97000) * 0.035;
      if (p <= 1214000) return 10912.5 + (p - 364000) * 0.045;
      return 49162.5 + (p - 1214000) * 0.055;
    },
  },
  VIC: {
    exemptionThreshold: 600000,
    concessionThreshold: 750000,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      if (p <= 25000) return p * 0.014;
      if (p <= 130000) return 350 + (p - 25000) * 0.024;
      if (p <= 960000) return 2870 + (p - 130000) * 0.06;
      return 2870 + (960000 - 130000) * 0.06 + (p - 960000) * 0.055;
    },
  },
  QLD: {
    exemptionThreshold: 700000,
    concessionThreshold: 800000,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      if (p <= 5000) return 0;
      if (p <= 75000) return (p - 5000) * 0.015;
      if (p <= 540000) return 1050 + (p - 75000) * 0.035;
      if (p <= 1000000) return 17325 + (p - 540000) * 0.045;
      return 38025 + (p - 1000000) * 0.0575;
    },
  },
  WA: {
    exemptionThreshold: 430000,
    concessionThreshold: 530000,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      if (p <= 120000) return p * 0.019;
      if (p <= 150000) return 2280 + (p - 120000) * 0.0285;
      if (p <= 360000) return 3135 + (p - 150000) * 0.038;
      if (p <= 725000) return 11115 + (p - 360000) * 0.0475;
      return 28452.5 + (p - 725000) * 0.0515;
    },
  },
  SA: {
    exemptionThreshold: 0,
    concessionThreshold: 0,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      if (p <= 12000) return p * 0.01;
      if (p <= 30000) return 120 + (p - 12000) * 0.02;
      if (p <= 50000) return 480 + (p - 30000) * 0.03;
      if (p <= 100000) return 1080 + (p - 50000) * 0.035;
      if (p <= 200000) return 2830 + (p - 100000) * 0.04;
      if (p <= 250000) return 6830 + (p - 200000) * 0.0425;
      if (p <= 300000) return 8955 + (p - 250000) * 0.0475;
      if (p <= 500000) return 11330 + (p - 300000) * 0.05;
      return 21330 + (p - 500000) * 0.055;
    },
  },
  TAS: {
    exemptionThreshold: 0,
    concessionThreshold: 400000,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      if (p <= 3000) return 50;
      if (p <= 25000) return 50 + (p - 3000) * 0.0175;
      if (p <= 75000) return 435 + (p - 25000) * 0.025;
      if (p <= 200000) return 1685 + (p - 75000) * 0.035;
      if (p <= 375000) return 6060 + (p - 200000) * 0.04;
      if (p <= 725000) return 13060 + (p - 375000) * 0.0425;
      return 27935 + (p - 725000) * 0.045;
    },
  },
  ACT: {
    exemptionThreshold: 1000000,
    concessionThreshold: 1000000,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      if (p <= 260000) return p * 0.006 * 1.2;
      if (p <= 300000) return 1872 + (p - 260000) * 0.023 * 1.2;
      if (p <= 500000) return 2976 + (p - 300000) * 0.034 * 1.2;
      if (p <= 750000) return 12136 + (p - 500000) * 0.041 * 1.2;
      if (p <= 1000000) return 24436 + (p - 750000) * 0.05 * 1.2;
      if (p <= 1455000) return 39436 + (p - 1000000) * 0.05 * 1.2;
      return 66736 + (p - 1455000) * 0.055 * 1.2;
    },
  },
  NT: {
    exemptionThreshold: 0,
    concessionThreshold: 0,
    newBuildOnly: false,
    estimateFullDuty: (p) => {
      const v = p / 1000;
      if (p <= 525000) return (0.06571441 * v * v + 15 * v) * 1;
      return p * 0.0495;
    },
  },
};

function fmt(n: number): string {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function checkEligibility(inputs: Inputs): SchemeResult[] {
  const results: SchemeResult[] = [];
  const { state, propertyPrice, annualIncome, isCombinedIncome, savings, isFirstHomeBuyer, residencyStatus, isNewBuild } = inputs;
  const isResident = residencyStatus === "citizen" || residencyStatus === "permanent_resident";
  const depositPercent = propertyPrice > 0 ? (savings / propertyPrice) * 100 : 0;

  // 1. First Home Guarantee (FHBG)
  const fhbgIncomeCap = isCombinedIncome ? FHBG_INCOME_CAP_COMBINED : FHBG_INCOME_CAP_SINGLE;
  const fhbgPropertyCap = FHBG_PROPERTY_CAP[state];
  const fhbgEligible =
    isFirstHomeBuyer &&
    isResident &&
    annualIncome <= fhbgIncomeCap &&
    propertyPrice <= fhbgPropertyCap &&
    depositPercent >= 5;

  let fhbgReason = "";
  if (!isFirstHomeBuyer) fhbgReason = "Must be a first home buyer";
  else if (!isResident) fhbgReason = "Must be an Australian citizen or permanent resident";
  else if (annualIncome > fhbgIncomeCap)
    fhbgReason = `Income exceeds ${fmt(fhbgIncomeCap)} cap (${isCombinedIncome ? "combined" : "single"})`;
  else if (propertyPrice > fhbgPropertyCap)
    fhbgReason = `Property price exceeds ${fmt(fhbgPropertyCap)} cap for ${state}`;
  else if (depositPercent < 5)
    fhbgReason = `Need at least 5% deposit (${fmt(propertyPrice * 0.05)})`;

  // Estimate LMI saving (rough: ~2% of loan for <20% deposit)
  const loanWithout = propertyPrice - savings;
  const lmiEstimate = depositPercent < 20 && depositPercent >= 5 ? Math.round(loanWithout * 0.02) : 0;

  results.push({
    name: "First Home Guarantee (FHBG)",
    eligible: fhbgEligible,
    reason: fhbgEligible
      ? `Buy with just 5% deposit (${fmt(propertyPrice * 0.05)}) — no LMI required. Estimated LMI saving: ${fmt(lmiEstimate)}`
      : fhbgReason,
    estimatedSaving: fhbgEligible ? lmiEstimate : 0,
    nextSteps: fhbgEligible
      ? [
          "Apply through a participating lender (NAB, CBA, etc.)",
          "Places are limited — apply early in the financial year",
          "Visit housing.gov.au for the full list of participating lenders",
        ]
      : [],
  });

  // 2. First Home Super Saver (FHSS) scheme
  const fhssEligible = isFirstHomeBuyer && isResident;
  const fhssSaving = fhssEligible
    ? Math.round(FHSS_MAX_RELEASE * (FHSS_TAX_RATE_MARGINAL_APPROX - FHSS_TAX_RATE_CONCESSIONAL))
    : 0;

  results.push({
    name: "First Home Super Saver (FHSS)",
    eligible: fhssEligible,
    reason: fhssEligible
      ? `Withdraw up to ${fmt(FHSS_MAX_RELEASE)} of voluntary super contributions for your deposit. Tax saving of ~${fmt(fhssSaving)} vs saving outside super.`
      : !isFirstHomeBuyer
      ? "Must be a first home buyer"
      : "Must be an Australian citizen or permanent resident",
    estimatedSaving: fhssSaving,
    nextSteps: fhssEligible
      ? [
          "Make voluntary concessional super contributions (salary sacrifice or personal deductible)",
          "Apply to the ATO for a FHSS determination, then a release",
          "You must sign a contract within 12 months of requesting release",
          "Maximum $15,000 per financial year, $50,000 total",
        ]
      : [],
  });

  // 3. First Home Owner Grant (FHOG)
  const fhogConfig = FHOG_CONFIG[state];
  const fhogPriceCap = isNewBuild ? fhogConfig.propertyCapNew : fhogConfig.propertyCapExisting;
  const fhogEligible =
    isFirstHomeBuyer &&
    isResident &&
    (isNewBuild || !fhogConfig.newBuildOnly) &&
    propertyPrice <= fhogPriceCap &&
    fhogPriceCap > 0;

  let fhogReason = "";
  if (!isFirstHomeBuyer) fhogReason = "Must be a first home buyer";
  else if (!isResident) fhogReason = "Must be an Australian citizen or permanent resident";
  else if (fhogConfig.newBuildOnly && !isNewBuild)
    fhogReason = `${state} only offers FHOG for new builds`;
  else if (propertyPrice > fhogPriceCap && fhogPriceCap > 0)
    fhogReason = `Property price exceeds ${fmt(fhogPriceCap)} cap for ${state}`;
  else if (fhogPriceCap === 0)
    fhogReason = `${state} does not offer FHOG for existing properties`;

  results.push({
    name: `First Home Owner Grant (FHOG) — ${state}`,
    eligible: fhogEligible,
    reason: fhogEligible
      ? `${state} grant of ${fmt(fhogConfig.grantAmount)} for ${isNewBuild ? "new" : "existing"} homes under ${fmt(fhogPriceCap)}`
      : fhogReason,
    estimatedSaving: fhogEligible ? fhogConfig.grantAmount : 0,
    nextSteps: fhogEligible
      ? [
          "Apply through your state revenue office or your lender at settlement",
          "You must move in within 12 months and live there for at least 6 months",
          `Visit your ${state} revenue office website for the application form`,
        ]
      : [],
  });

  // 4. Stamp Duty Exemption/Concession
  const sdConfig = STAMP_DUTY_CONFIG[state];
  const fullDuty = Math.round(sdConfig.estimateFullDuty(propertyPrice));
  let sdSaving = 0;
  let sdEligible = false;
  let sdReason = "";

  if (!isFirstHomeBuyer) {
    sdReason = "Must be a first home buyer";
  } else if (!isResident) {
    sdReason = "Must be an Australian citizen or permanent resident";
  } else if (sdConfig.exemptionThreshold === 0 && sdConfig.concessionThreshold === 0) {
    sdReason = `${state} does not currently offer first home buyer stamp duty exemptions`;
  } else if (propertyPrice <= sdConfig.exemptionThreshold) {
    sdEligible = true;
    sdSaving = fullDuty;
    sdReason = `Full stamp duty exemption — property is under ${fmt(sdConfig.exemptionThreshold)} threshold. Saving: ${fmt(fullDuty)}`;
  } else if (propertyPrice <= sdConfig.concessionThreshold) {
    sdEligible = true;
    const ratio =
      (propertyPrice - sdConfig.exemptionThreshold) /
      (sdConfig.concessionThreshold - sdConfig.exemptionThreshold);
    sdSaving = Math.round(fullDuty * (1 - ratio));
    sdReason = `Partial stamp duty concession — reduced duty applies between ${fmt(sdConfig.exemptionThreshold)} and ${fmt(sdConfig.concessionThreshold)}. Estimated saving: ${fmt(sdSaving)}`;
  } else {
    sdReason = `Property price exceeds the ${fmt(sdConfig.concessionThreshold)} concession threshold for ${state}`;
  }

  results.push({
    name: `Stamp Duty Exemption — ${state}`,
    eligible: sdEligible,
    reason: sdReason,
    estimatedSaving: sdSaving,
    nextSteps: sdEligible
      ? [
          "The exemption/concession is usually applied at settlement by your solicitor",
          "Ensure you declare first home buyer status on the transfer documents",
          `Check the ${state} revenue office for exact thresholds and any recent changes`,
        ]
      : [],
  });

  return results;
}

const STATE_OPTIONS: { value: State; label: string }[] = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
];

export default function FirstHomeBuyerCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    state: "NSW",
    propertyPrice: 650000,
    annualIncome: 90000,
    isCombinedIncome: false,
    savings: 50000,
    isFirstHomeBuyer: true,
    residencyStatus: "citizen",
    isNewBuild: false,
  });

  const results = useMemo(() => checkEligibility(inputs), [inputs]);
  const totalSaving = results.reduce((sum, r) => sum + r.estimatedSaving, 0);
  const eligibleCount = results.filter((r) => r.eligible).length;

  return (
    <div>
      {/* Input Form */}
      <div className="border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State / Territory</label>
            <select
              value={inputs.state}
              onChange={(e) => setInputs((p) => ({ ...p, state: e.target.value as State }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {STATE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={inputs.propertyPrice || ""}
                onChange={(e) => setInputs((p) => ({ ...p, propertyPrice: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="650,000"
              />
            </div>
          </div>

          {/* Annual Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Taxable Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={inputs.annualIncome || ""}
                onChange={(e) => setInputs((p) => ({ ...p, annualIncome: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="90,000"
              />
            </div>
          </div>

          {/* Savings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Savings / Deposit Available</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={inputs.savings || ""}
                onChange={(e) => setInputs((p) => ({ ...p, savings: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50,000"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.isCombinedIncome}
                onChange={(e) => setInputs((p) => ({ ...p, isCombinedIncome: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Combined income (couple)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.isFirstHomeBuyer}
                onChange={(e) => setInputs((p) => ({ ...p, isFirstHomeBuyer: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">First home buyer</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.isNewBuild}
                onChange={(e) => setInputs((p) => ({ ...p, isNewBuild: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">New build / off-the-plan</span>
            </label>
          </div>

          {/* Residency */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Residency Status</label>
            <div className="flex flex-wrap gap-3">
              {([
                { value: "citizen", label: "Australian Citizen" },
                { value: "permanent_resident", label: "Permanent Resident" },
                { value: "other", label: "Other Visa / Non-Resident" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInputs((p) => ({ ...p, residencyStatus: opt.value }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    inputs.residencyStatus === opt.value
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-sm text-green-600 mb-1">Schemes You May Be Eligible For</p>
          <p className="text-3xl font-bold text-green-900">{eligibleCount} of {results.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-600 mb-1">Total Estimated Savings</p>
          <p className="text-3xl font-bold text-blue-900">{fmt(totalSaving)}</p>
        </div>
      </div>

      {/* Deposit Analysis */}
      <div className="mt-6 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Deposit Analysis</h3>
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-gray-500">Your deposit</p>
            <p className="font-semibold text-gray-900">{fmt(inputs.savings)}</p>
          </div>
          <div>
            <p className="text-gray-500">Deposit percentage</p>
            <p className="font-semibold text-gray-900">
              {inputs.propertyPrice > 0 ? ((inputs.savings / inputs.propertyPrice) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div>
            <p className="text-gray-500">For 20% (no LMI normally)</p>
            <p className="font-semibold text-gray-900">{fmt(inputs.propertyPrice * 0.2)}</p>
          </div>
        </div>
      </div>

      {/* Scheme Results */}
      <div className="mt-6 space-y-4">
        {results.map((scheme) => (
          <div
            key={scheme.name}
            className={`border rounded-xl p-6 ${
              scheme.eligible
                ? "border-green-200 bg-green-50/50"
                : "border-gray-200 bg-gray-50/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  scheme.eligible ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                {scheme.eligible ? "\u2713" : "\u2717"}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                  {scheme.eligible && scheme.estimatedSaving > 0 && (
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Save {fmt(scheme.estimatedSaving)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{scheme.reason}</p>

                {scheme.eligible && scheme.nextSteps.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Next Steps</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {scheme.nextSteps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-blue-500 flex-shrink-0">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 border border-amber-200 bg-amber-50 rounded-xl p-4">
        <p className="text-xs text-amber-800">
          <strong>Disclaimer:</strong> This tool provides estimates based on publicly available 2024-25 thresholds.
          Eligibility criteria may change. Always verify with the relevant state revenue office and the Australian
          Government&apos;s Housing Australia website before making financial decisions. This is not financial advice.
        </p>
      </div>
    </div>
  );
}
