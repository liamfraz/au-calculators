"use client";

import { useState, useMemo } from "react";

// ── Payment types & rates (current as of March 2026) ────────────────
type PaymentType = "jobseeker" | "youth" | "age_pension" | "parenting";
type RelationshipStatus = "single" | "partnered";

interface PaymentRates {
  label: string;
  description: string;
  maxFortnightly: Record<
    RelationshipStatus,
    { base: number; withChildren?: number }
  >;
  incomeFreeArea: number; // $/fortnight
  incomeThreshold: number; // $/fortnight – where taper rate changes
  taperRate1: number; // cents per $ over free area
  taperRate2: number; // cents per $ over threshold
  assetsFreeArea: Record<RelationshipStatus, { homeowner: number; nonHomeowner: number }>;
  energySupplement: Record<RelationshipStatus, number>; // $/fortnight
  childAdd: number; // additional per child per fortnight
}

const PAYMENT_RATES: Record<PaymentType, PaymentRates> = {
  jobseeker: {
    label: "JobSeeker Payment",
    description:
      "For people aged 22 to Age Pension age who are looking for work or unable to work due to illness or injury.",
    maxFortnightly: {
      single: { base: 762.7, withChildren: 816.9 },
      partnered: { base: 693.1 },
    },
    incomeFreeArea: 150,
    incomeThreshold: 256,
    taperRate1: 0.5,
    taperRate2: 0.6,
    assetsFreeArea: {
      single: { homeowner: 314000, nonHomeowner: 566000 },
      partnered: { homeowner: 470000, nonHomeowner: 722000 },
    },
    energySupplement: { single: 8.8, partnered: 7.9 },
    childAdd: 64.4,
  },
  youth: {
    label: "Youth Allowance (Job Seeker)",
    description:
      "For young people aged 16-21 (or 16-24 if a full-time student) who are looking for work.",
    maxFortnightly: {
      single: { base: 455.2, withChildren: 632.6 },
      partnered: { base: 455.2, withChildren: 632.6 },
    },
    incomeFreeArea: 150,
    incomeThreshold: 256,
    taperRate1: 0.5,
    taperRate2: 0.6,
    assetsFreeArea: {
      single: { homeowner: 314000, nonHomeowner: 566000 },
      partnered: { homeowner: 470000, nonHomeowner: 722000 },
    },
    energySupplement: { single: 5.3, partnered: 5.3 },
    childAdd: 64.4,
  },
  age_pension: {
    label: "Age Pension",
    description:
      "For people who have reached Age Pension age (currently 67) and meet residence requirements.",
    maxFortnightly: {
      single: { base: 1116.3 },
      partnered: { base: 841.4 },
    },
    incomeFreeArea: 204,
    incomeThreshold: 204, // single taper rate, no second threshold
    taperRate1: 0.5,
    taperRate2: 0.5,
    assetsFreeArea: {
      single: { homeowner: 314000, nonHomeowner: 566000 },
      partnered: { homeowner: 470000, nonHomeowner: 722000 },
    },
    energySupplement: { single: 14.1, partnered: 10.6 },
    childAdd: 0,
  },
  parenting: {
    label: "Parenting Payment",
    description:
      "For the principal carer of a young child. Single rate applies to youngest child under 14; partnered rate for youngest under 6.",
    maxFortnightly: {
      single: { base: 987.7 },
      partnered: { base: 693.1 },
    },
    incomeFreeArea: 202.6,
    incomeThreshold: 202.6, // single taper for parenting single
    taperRate1: 0.4,
    taperRate2: 0.4,
    assetsFreeArea: {
      single: { homeowner: 314000, nonHomeowner: 566000 },
      partnered: { homeowner: 470000, nonHomeowner: 722000 },
    },
    energySupplement: { single: 12.5, partnered: 7.9 },
    childAdd: 64.4,
  },
};

// ── Calculation logic ───────────────────────────────────────────────
interface Result {
  maxPayment: number;
  incomeReduction: number;
  assetsExceed: boolean;
  estimatedFortnightly: number;
  annualTotal: number;
  energySupplement: number;
  bindingTest: "income" | "assets" | "both" | "none";
}

function calculate(
  paymentType: PaymentType,
  relationship: RelationshipStatus,
  children: number,
  annualIncome: number,
  assets: number,
  isHomeowner: boolean
): Result {
  const rates = PAYMENT_RATES[paymentType];
  const rateGroup = rates.maxFortnightly[relationship];

  // Determine base max payment
  let maxPayment = rateGroup.base;
  if (children > 0 && rateGroup.withChildren) {
    maxPayment = rateGroup.withChildren;
  }
  // Add per-child supplement (beyond first child already in withChildren)
  if (children > 1) {
    maxPayment += (children - 1) * rates.childAdd;
  }

  const energySupplement = rates.energySupplement[relationship];
  const maxWithSupplement = maxPayment + energySupplement;

  // Income test
  const fortnightlyIncome = annualIncome / 26;
  let incomeReduction = 0;
  if (fortnightlyIncome > rates.incomeFreeArea) {
    const overFreeArea = fortnightlyIncome - rates.incomeFreeArea;
    if (fortnightlyIncome <= rates.incomeThreshold) {
      incomeReduction = overFreeArea * rates.taperRate1;
    } else {
      const band1 = rates.incomeThreshold - rates.incomeFreeArea;
      const band2 = fortnightlyIncome - rates.incomeThreshold;
      incomeReduction = band1 * rates.taperRate1 + band2 * rates.taperRate2;
    }
  }

  const paymentAfterIncome = Math.max(0, maxWithSupplement - incomeReduction);

  // Assets test
  const assetLimit = rates.assetsFreeArea[relationship][isHomeowner ? "homeowner" : "nonHomeowner"];
  const assetsExceed = assets > assetLimit;

  // Determine binding test
  let bindingTest: Result["bindingTest"] = "none";
  if (assetsExceed && paymentAfterIncome === 0) {
    bindingTest = "both";
  } else if (assetsExceed) {
    bindingTest = "assets";
  } else if (incomeReduction > 0) {
    bindingTest = "income";
  }

  const estimatedFortnightly = assetsExceed ? 0 : paymentAfterIncome;

  return {
    maxPayment: maxWithSupplement,
    incomeReduction,
    assetsExceed,
    estimatedFortnightly,
    annualTotal: estimatedFortnightly * 26,
    energySupplement,
    bindingTest,
  };
}

// ── Formatting helpers ──────────────────────────────────────────────
const fmt = (v: number) =>
  v.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  });

// ── Component ───────────────────────────────────────────────────────
export default function CentrelinkPaymentCalculator() {
  const [paymentType, setPaymentType] = useState<PaymentType>("jobseeker");
  const [relationship, setRelationship] = useState<RelationshipStatus>("single");
  const [children, setChildren] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [assets, setAssets] = useState(0);
  const [isHomeowner, setIsHomeowner] = useState(true);

  const result = useMemo(
    () => calculate(paymentType, relationship, children, annualIncome, assets, isHomeowner),
    [paymentType, relationship, children, annualIncome, assets, isHomeowner]
  );

  const rates = PAYMENT_RATES[paymentType];

  return (
    <div className="space-y-8">
      {/* ── Inputs ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>

        {/* Payment type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Type
          </label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(PAYMENT_RATES).map(([key, r]) => (
              <option key={key} value={key}>
                {r.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">{rates.description}</p>
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Status
          </label>
          <div className="flex gap-3">
            {(["single", "partnered"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setRelationship(s)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  relationship === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                {s === "single" ? "Single" : "Partnered"}
              </button>
            ))}
          </div>
        </div>

        {/* Number of children */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Dependent Children
          </label>
          <input
            type="number"
            min={0}
            max={10}
            value={children}
            onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Annual income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Income (You + Partner if applicable)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              min={0}
              step={1000}
              value={annualIncome || ""}
              onChange={(e) => setAnnualIncome(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Income free area: {fmt(rates.incomeFreeArea)} per fortnight ({fmt(rates.incomeFreeArea * 26)}/year)
          </p>
        </div>

        {/* Assets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Assessable Assets
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              min={0}
              step={10000}
              value={assets || ""}
              onChange={(e) => setAssets(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Homeowner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Home Ownership
          </label>
          <div className="flex gap-3">
            {([true, false] as const).map((v) => (
              <button
                key={String(v)}
                onClick={() => setIsHomeowner(v)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  isHomeowner === v
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                {v ? "Homeowner" : "Non-Homeowner"}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Assets limit ({relationship}, {isHomeowner ? "homeowner" : "non-homeowner"}):{" "}
            {fmt(rates.assetsFreeArea[relationship][isHomeowner ? "homeowner" : "nonHomeowner"])}
          </p>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Estimated {rates.label}
        </h2>

        {/* Key figures */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">
              Estimated Fortnightly
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {fmt(result.estimatedFortnightly)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">Annual Total</p>
            <p className="text-2xl font-bold text-green-900">
              {fmt(result.annualTotal)}
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Maximum base payment</span>
            <span className="font-medium text-gray-900">
              {fmt(result.maxPayment - result.energySupplement)} /fn
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Energy Supplement</span>
            <span className="font-medium text-gray-900">
              +{fmt(result.energySupplement)} /fn
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Maximum total (incl. supplement)</span>
            <span className="font-medium text-gray-900">
              {fmt(result.maxPayment)} /fn
            </span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Income reduction</span>
            <span className={`font-medium ${result.incomeReduction > 0 ? "text-red-600" : "text-gray-900"}`}>
              {result.incomeReduction > 0 ? "-" : ""}
              {fmt(result.incomeReduction)} /fn
            </span>
          </div>
          {result.assetsExceed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 font-medium">
                Assets exceed the limit — payment reduced to $0
              </p>
              <p className="text-xs text-red-600 mt-1">
                Your assessable assets of {fmt(assets)} exceed the{" "}
                {isHomeowner ? "homeowner" : "non-homeowner"} limit of{" "}
                {fmt(rates.assetsFreeArea[relationship][isHomeowner ? "homeowner" : "nonHomeowner"])}.
              </p>
            </div>
          )}
        </div>

        {/* Which test applies */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Binding Test
          </p>
          <p className="text-sm text-gray-600">
            {result.bindingTest === "income" &&
              "The income test is reducing your payment. You earn above the income free area."}
            {result.bindingTest === "assets" &&
              "The assets test is disqualifying your payment. Your assessable assets exceed the allowable limit."}
            {result.bindingTest === "both" &&
              "Both the income test and assets test are reducing your payment to $0."}
            {result.bindingTest === "none" &&
              "Neither test is reducing your payment. You are eligible for the full rate."}
          </p>
        </div>

        {/* Income test detail */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Income Test Breakdown
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              Fortnightly income: {fmt(annualIncome / 26)}
            </p>
            <p>
              Income free area: {fmt(rates.incomeFreeArea)} /fn — earn up to
              this with no reduction
            </p>
            <p>
              Taper: {rates.taperRate1 * 100}c per $1 over free area
              {rates.taperRate1 !== rates.taperRate2 &&
                `, then ${rates.taperRate2 * 100}c per $1 over ${fmt(rates.incomeThreshold)} /fn`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Payment comparison table ──────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Comparison (Max Fortnightly Rates)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">
                  Payment
                </th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">
                  Single
                </th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">
                  Single + Kids
                </th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">
                  Partnered
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(PAYMENT_RATES).map(([key, r]) => (
                <tr
                  key={key}
                  className={`border-b border-gray-100 ${
                    key === paymentType ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="py-2 pr-4 font-medium text-gray-900">
                    {r.label}
                  </td>
                  <td className="py-2 px-4 text-right text-gray-700">
                    {fmt(r.maxFortnightly.single.base)}
                  </td>
                  <td className="py-2 px-4 text-right text-gray-700">
                    {r.maxFortnightly.single.withChildren
                      ? fmt(r.maxFortnightly.single.withChildren)
                      : "—"}
                  </td>
                  <td className="py-2 pl-4 text-right text-gray-700">
                    {fmt(r.maxFortnightly.partnered.base)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Disclaimer ────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This calculator provides estimates only
          based on publicly available Centrelink rates and thresholds. Actual
          eligibility and payment amounts depend on many factors not captured
          here, including waiting periods, residency requirements, liquid assets
          waiting periods, and partner income. Always check with{" "}
          <a
            href="https://www.servicesaustralia.gov.au"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            Services Australia
          </a>{" "}
          for your specific circumstances.
        </p>
      </div>
    </div>
  );
}
