"use client";
import Link from "next/link";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── State-based energy data (2026 averages) ─────────────────────────
interface StateData {
  label: string;
  // Flat rate
  flatRate: number; // c/kWh
  dailySupplyCharge: number; // c/day
  // Time-of-use rates
  touPeakRate: number; // c/kWh (2pm-8pm weekdays)
  touShoulderRate: number; // c/kWh (7am-2pm, 8pm-10pm weekdays)
  touOffPeakRate: number; // c/kWh (10pm-7am, weekends)
  // Controlled load (hot water etc)
  controlledLoadRate: number; // c/kWh
  // Other
  avgDailyUsage: number; // kWh/day household average
  feedInTariff: number; // c/kWh default
  avgSolarHours: number; // peak sun hours
}

const STATE_DATA: Record<string, StateData> = {
  NSW: {
    label: "New South Wales",
    flatRate: 35,
    dailySupplyCharge: 110,
    touPeakRate: 52,
    touShoulderRate: 28,
    touOffPeakRate: 18,
    controlledLoadRate: 20,
    avgDailyUsage: 18,
    feedInTariff: 5,
    avgSolarHours: 4.7,
  },
  VIC: {
    label: "Victoria",
    flatRate: 31,
    dailySupplyCharge: 105,
    touPeakRate: 46,
    touShoulderRate: 25,
    touOffPeakRate: 16,
    controlledLoadRate: 18,
    avgDailyUsage: 16,
    feedInTariff: 4.5,
    avgSolarHours: 4.2,
  },
  QLD: {
    label: "Queensland",
    flatRate: 30,
    dailySupplyCharge: 100,
    touPeakRate: 45,
    touShoulderRate: 24,
    touOffPeakRate: 17,
    controlledLoadRate: 19,
    avgDailyUsage: 20,
    feedInTariff: 5,
    avgSolarHours: 5.2,
  },
  SA: {
    label: "South Australia",
    flatRate: 42,
    dailySupplyCharge: 120,
    touPeakRate: 55,
    touShoulderRate: 34,
    touOffPeakRate: 22,
    controlledLoadRate: 25,
    avgDailyUsage: 17,
    feedInTariff: 6,
    avgSolarHours: 5.0,
  },
  WA: {
    label: "Western Australia",
    flatRate: 31,
    dailySupplyCharge: 105,
    touPeakRate: 47,
    touShoulderRate: 26,
    touOffPeakRate: 17,
    controlledLoadRate: 19,
    avgDailyUsage: 19,
    feedInTariff: 3,
    avgSolarHours: 5.3,
  },
  TAS: {
    label: "Tasmania",
    flatRate: 29,
    dailySupplyCharge: 95,
    touPeakRate: 42,
    touShoulderRate: 23,
    touOffPeakRate: 15,
    controlledLoadRate: 17,
    avgDailyUsage: 16,
    feedInTariff: 5,
    avgSolarHours: 3.5,
  },
  NT: {
    label: "Northern Territory",
    flatRate: 27,
    dailySupplyCharge: 90,
    touPeakRate: 40,
    touShoulderRate: 22,
    touOffPeakRate: 15,
    controlledLoadRate: 18,
    avgDailyUsage: 22,
    feedInTariff: 8.3,
    avgSolarHours: 5.8,
  },
  ACT: {
    label: "Australian Capital Territory",
    flatRate: 28,
    dailySupplyCharge: 92,
    touPeakRate: 40,
    touShoulderRate: 23,
    touOffPeakRate: 15,
    controlledLoadRate: 17,
    avgDailyUsage: 17,
    feedInTariff: 6,
    avgSolarHours: 4.5,
  },
};

// ── Provider reference rates (2026 DMO / VDO reference rates) ───────
interface ProviderRates {
  name: string;
  rates: Record<string, { usageRate: number; dailySupply: number; discount: string }>;
}

const PROVIDERS: ProviderRates[] = [
  {
    name: "AGL",
    rates: {
      NSW: { usageRate: 36.5, dailySupply: 110, discount: "Up to 12% pay-on-time" },
      VIC: { usageRate: 32.0, dailySupply: 108, discount: "Up to 10% guaranteed" },
      QLD: { usageRate: 31.5, dailySupply: 102, discount: "Up to 15% direct debit" },
      SA: { usageRate: 44.0, dailySupply: 122, discount: "Up to 10% pay-on-time" },
      WA: { usageRate: 31.0, dailySupply: 106, discount: "Synergy regulated" },
      TAS: { usageRate: 0, dailySupply: 0, discount: "Not available" },
      NT: { usageRate: 0, dailySupply: 0, discount: "Not available" },
      ACT: { usageRate: 29.0, dailySupply: 94, discount: "Up to 8% pay-on-time" },
    },
  },
  {
    name: "Origin Energy",
    rates: {
      NSW: { usageRate: 34.8, dailySupply: 105, discount: "Up to 10% online" },
      VIC: { usageRate: 30.5, dailySupply: 103, discount: "Up to 12% guaranteed" },
      QLD: { usageRate: 30.0, dailySupply: 98, discount: "Up to 12% pay-on-time" },
      SA: { usageRate: 41.5, dailySupply: 118, discount: "Up to 15% online" },
      WA: { usageRate: 31.0, dailySupply: 105, discount: "Synergy regulated" },
      TAS: { usageRate: 0, dailySupply: 0, discount: "Not available" },
      NT: { usageRate: 0, dailySupply: 0, discount: "Not available" },
      ACT: { usageRate: 28.5, dailySupply: 92, discount: "Up to 10% online" },
    },
  },
  {
    name: "EnergyAustralia",
    rates: {
      NSW: { usageRate: 35.5, dailySupply: 108, discount: "Up to 10% pay-on-time" },
      VIC: { usageRate: 31.2, dailySupply: 106, discount: "Up to 12% direct debit" },
      QLD: { usageRate: 30.8, dailySupply: 100, discount: "Up to 12% pay-on-time" },
      SA: { usageRate: 43.0, dailySupply: 120, discount: "Up to 12% pay-on-time" },
      WA: { usageRate: 0, dailySupply: 0, discount: "Not available" },
      TAS: { usageRate: 0, dailySupply: 0, discount: "Not available" },
      NT: { usageRate: 0, dailySupply: 0, discount: "Not available" },
      ACT: { usageRate: 28.8, dailySupply: 93, discount: "Up to 10% pay-on-time" },
    },
  },
];

// ── Household size to estimated kWh mapping ─────────────────────────
const HOUSEHOLD_KWH: Record<number, number> = {
  1: 10,
  2: 15,
  3: 18,
  4: 22,
  5: 26,
  6: 30,
};

// ── Interfaces ───────────────────────────────────────────────────────
type TariffType = "flat" | "tou" | "controlled_load";
type InputMode = "household" | "kwh";

interface Inputs {
  state: string;
  inputMode: InputMode;
  householdSize: number;
  dailyUsage: number; // kWh/day (manual)
  tariffType: TariffType;
  solarSize: number; // kW
  feedInTariff: number; // c/kWh
  homeType: "house" | "apartment";
  // TOU usage split (% of daily usage)
  touPeakPct: number;
  touShoulderPct: number;
  // Controlled load kWh (e.g. hot water)
  controlledLoadKwh: number;
}

interface TariffResult {
  tariffType: TariffType;
  label: string;
  quarterlyBill: number;
  annualBill: number;
  supplyCharge: number;
  usageCharge: number;
  effectiveRate: number; // blended c/kWh
}

interface Result {
  primary: TariffResult;
  allTariffs: TariffResult[];
  solarSavingsQuarterly: number;
  solarSavingsAnnual: number;
  solarExportIncomeQuarterly: number;
  dailyUsageKwh: number;
  stateAvgQuarterly: number;
  comparisonToAvg: number;
  providerComparison: { name: string; quarterly: number; annual: number; discount: string }[];
}

// ── Calculation ──────────────────────────────────────────────────────
const DAYS_PER_QUARTER = 91;
const SELF_CONSUMPTION_RATIO = 0.4;

function calcTariff(
  tariffType: TariffType,
  dailyKwh: number,
  stateData: StateData,
  touPeakPct: number,
  touShoulderPct: number,
  controlledLoadKwh: number,
): TariffResult {
  const supplyCharge = (stateData.dailySupplyCharge * DAYS_PER_QUARTER) / 100;
  let usageCharge: number;
  let label: string;

  switch (tariffType) {
    case "flat": {
      usageCharge = (dailyKwh * DAYS_PER_QUARTER * stateData.flatRate) / 100;
      label = "Flat Rate";
      break;
    }
    case "tou": {
      const peakKwh = dailyKwh * (touPeakPct / 100);
      const shoulderKwh = dailyKwh * (touShoulderPct / 100);
      const offPeakKwh = dailyKwh * (1 - touPeakPct / 100 - touShoulderPct / 100);
      usageCharge =
        ((peakKwh * stateData.touPeakRate +
          shoulderKwh * stateData.touShoulderRate +
          offPeakKwh * stateData.touOffPeakRate) *
          DAYS_PER_QUARTER) /
        100;
      label = "Time-of-Use";
      break;
    }
    case "controlled_load": {
      const mainKwh = Math.max(0, dailyKwh - controlledLoadKwh);
      usageCharge =
        ((mainKwh * stateData.flatRate + controlledLoadKwh * stateData.controlledLoadRate) *
          DAYS_PER_QUARTER) /
        100;
      label = "Flat + Controlled Load";
      break;
    }
  }

  const quarterlyBill = supplyCharge + usageCharge;
  const effectiveRate = dailyKwh > 0 ? (usageCharge / (dailyKwh * DAYS_PER_QUARTER)) * 100 : 0;

  return {
    tariffType,
    label,
    quarterlyBill: Math.round(quarterlyBill),
    annualBill: Math.round(quarterlyBill * 4),
    supplyCharge: Math.round(supplyCharge),
    usageCharge: Math.round(usageCharge),
    effectiveRate: Math.round(effectiveRate * 10) / 10,
  };
}

function calculateEnergyBill(inputs: Inputs): Result {
  const stateData = STATE_DATA[inputs.state];

  // Determine daily usage
  let dailyUsageKwh: number;
  if (inputs.inputMode === "household") {
    const base = HOUSEHOLD_KWH[Math.min(inputs.householdSize, 6)] ?? 30;
    const homeFactor = inputs.homeType === "apartment" ? 0.75 : 1;
    dailyUsageKwh = base * homeFactor;
  } else {
    dailyUsageKwh = inputs.dailyUsage;
  }

  // Calculate all three tariff types
  const allTariffs: TariffResult[] = [
    calcTariff("flat", dailyUsageKwh, stateData, inputs.touPeakPct, inputs.touShoulderPct, inputs.controlledLoadKwh),
    calcTariff("tou", dailyUsageKwh, stateData, inputs.touPeakPct, inputs.touShoulderPct, inputs.controlledLoadKwh),
    calcTariff("controlled_load", dailyUsageKwh, stateData, inputs.touPeakPct, inputs.touShoulderPct, inputs.controlledLoadKwh),
  ];

  const primary = allTariffs.find((t) => t.tariffType === inputs.tariffType)!;

  // Solar
  const dailySolarGen = inputs.solarSize * stateData.avgSolarHours;
  const selfConsumed = dailySolarGen * SELF_CONSUMPTION_RATIO;
  const exported = dailySolarGen * (1 - SELF_CONSUMPTION_RATIO);
  const solarSelfConsumeSavingQ = (selfConsumed * DAYS_PER_QUARTER * stateData.flatRate) / 100;
  const solarExportIncomeQ = (exported * DAYS_PER_QUARTER * inputs.feedInTariff) / 100;
  const solarSavingsQuarterly = solarSelfConsumeSavingQ + solarExportIncomeQ;

  // State average (flat rate, avg household)
  const avgUsage = stateData.avgDailyUsage;
  const stateAvgQuarterly =
    (stateData.dailySupplyCharge * DAYS_PER_QUARTER) / 100 +
    (avgUsage * DAYS_PER_QUARTER * stateData.flatRate) / 100;

  const netQuarterly = primary.quarterlyBill - Math.round(solarSavingsQuarterly);

  // Provider comparison
  const providerComparison = PROVIDERS.map((p) => {
    const rates = p.rates[inputs.state];
    if (!rates || rates.usageRate === 0) {
      return { name: p.name, quarterly: 0, annual: 0, discount: rates?.discount ?? "Not available" };
    }
    const q =
      (rates.dailySupply * DAYS_PER_QUARTER) / 100 +
      (dailyUsageKwh * DAYS_PER_QUARTER * rates.usageRate) / 100;
    return {
      name: p.name,
      quarterly: Math.round(q),
      annual: Math.round(q * 4),
      discount: rates.discount,
    };
  });

  return {
    primary,
    allTariffs,
    solarSavingsQuarterly: Math.round(solarSavingsQuarterly),
    solarSavingsAnnual: Math.round(solarSavingsQuarterly * 4),
    solarExportIncomeQuarterly: Math.round(solarExportIncomeQ),
    dailyUsageKwh: Math.round(dailyUsageKwh * 10) / 10,
    stateAvgQuarterly: Math.round(stateAvgQuarterly),
    comparisonToAvg: Math.round(netQuarterly - stateAvgQuarterly),
    providerComparison,
  };
}

// ── Formatting ───────────────────────────────────────────────────────
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function ResultCard({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string;
  value: string;
  subtext?: string;
  highlight?: "green" | "red" | "blue";
}) {
  const colorClass =
    highlight === "green"
      ? "text-emerald-700"
      : highlight === "red"
        ? "text-red-600"
        : "text-blue-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

// ── Component ────────────────────────────────────────────────────────
export default function EnergyBillCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    state: "NSW",
    inputMode: "household",
    householdSize: 3,
    dailyUsage: 18,
    tariffType: "flat",
    solarSize: 0,
    feedInTariff: STATE_DATA["NSW"].feedInTariff,
    homeType: "house",
    touPeakPct: 30,
    touShoulderPct: 40,
    controlledLoadKwh: 5,
  });

  const result = useMemo(() => calculateEnergyBill(inputs), [inputs]);

  const update = <K extends keyof Inputs>(field: K, value: Inputs[K]) => {
    setInputs((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "state") {
        next.feedInTariff = STATE_DATA[value as string].feedInTariff;
        if (next.inputMode === "kwh") {
          next.dailyUsage = STATE_DATA[value as string].avgDailyUsage;
        }
      }
      return next;
    });
  };

  // Chart data
  const tariffComparisonData = useMemo(() => {
    return result.allTariffs.map((t) => ({
      name: t.label,
      quarterly: t.quarterlyBill,
      effective: t.effectiveRate,
    }));
  }, [result.allTariffs]);

  const stateComparisonData = useMemo(() => {
    return Object.entries(STATE_DATA).map(([key, data]) => {
      const q =
        (data.dailySupplyCharge * DAYS_PER_QUARTER) / 100 +
        (data.avgDailyUsage * DAYS_PER_QUARTER * data.flatRate) / 100;
      return {
        state: key,
        quarterly: Math.round(q),
        isSelected: key === inputs.state,
      };
    });
  }, [inputs.state]);

  const breakdownData = useMemo(() => [
    { name: "Supply Charge", value: result.primary.supplyCharge },
    { name: "Usage Charge", value: result.primary.usageCharge },
  ], [result.primary]);

  // Solar section data
  const solarComparisonSizes = useMemo(() => {
    const stateData = STATE_DATA[inputs.state];
    return [3, 5, 6.6, 8, 10, 13].map((size) => {
      const dailyGen = size * stateData.avgSolarHours;
      const selfConsumed = dailyGen * SELF_CONSUMPTION_RATIO;
      const exported = dailyGen * (1 - SELF_CONSUMPTION_RATIO);
      const savingQ =
        (selfConsumed * DAYS_PER_QUARTER * stateData.flatRate) / 100 +
        (exported * DAYS_PER_QUARTER * inputs.feedInTariff) / 100;
      return {
        size: `${size}kW`,
        savingsAnnual: Math.round(savingQ * 4),
        dailyGen: Math.round(dailyGen * 10) / 10,
      };
    });
  }, [inputs.state, inputs.feedInTariff]);

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State / Territory
            </label>
            <select
              value={inputs.state}
              onChange={(e) => update("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {Object.entries(STATE_DATA).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.label} ({key})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Flat rate: {STATE_DATA[inputs.state].flatRate}c/kWh
            </p>
          </div>

          {/* Input mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimate Usage By
            </label>
            <select
              value={inputs.inputMode}
              onChange={(e) => update("inputMode", e.target.value as InputMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="household">Household size</option>
              <option value="kwh">Enter kWh usage</option>
            </select>
          </div>

          {/* Usage input */}
          {inputs.inputMode === "household" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  People in Household
                </label>
                <select
                  value={inputs.householdSize}
                  onChange={(e) => update("householdSize", Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value={1}>1 person (~10 kWh/day)</option>
                  <option value={2}>2 people (~15 kWh/day)</option>
                  <option value={3}>3 people (~18 kWh/day)</option>
                  <option value={4}>4 people (~22 kWh/day)</option>
                  <option value={5}>5 people (~26 kWh/day)</option>
                  <option value={6}>6+ people (~30 kWh/day)</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Electricity Usage (kWh)
              </label>
              <input
                type="number"
                value={inputs.dailyUsage}
                onChange={(e) => update("dailyUsage", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={0}
                max={100}
                step={1}
              />
              <p className="text-xs text-gray-400 mt-1">
                {inputs.state} avg: {STATE_DATA[inputs.state].avgDailyUsage} kWh/day
              </p>
            </div>
          )}

          {/* Home type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Type
            </label>
            <select
              value={inputs.homeType}
              onChange={(e) => update("homeType", e.target.value as "house" | "apartment")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment / Unit</option>
            </select>
          </div>

          {/* Tariff type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tariff Type
            </label>
            <select
              value={inputs.tariffType}
              onChange={(e) => update("tariffType", e.target.value as TariffType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="flat">Flat Rate (single rate)</option>
              <option value="tou">Time-of-Use (peak/shoulder/off-peak)</option>
              <option value="controlled_load">Flat + Controlled Load</option>
            </select>
          </div>

          {/* TOU split (only if TOU selected) */}
          {inputs.tariffType === "tou" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peak Usage (% of daily, 2-8pm)
                </label>
                <input
                  type="number"
                  value={inputs.touPeakPct}
                  onChange={(e) => update("touPeakPct", Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min={0}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Peak: {STATE_DATA[inputs.state].touPeakRate}c/kWh
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shoulder Usage (% of daily)
                </label>
                <input
                  type="number"
                  value={inputs.touShoulderPct}
                  onChange={(e) => update("touShoulderPct", Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min={0}
                  max={100 - inputs.touPeakPct}
                  step={5}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Shoulder: {STATE_DATA[inputs.state].touShoulderRate}c | Off-peak: {STATE_DATA[inputs.state].touOffPeakRate}c (remaining {Math.max(0, 100 - inputs.touPeakPct - inputs.touShoulderPct)}%)
                </p>
              </div>
            </>
          )}

          {/* Controlled load kWh */}
          {inputs.tariffType === "controlled_load" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Controlled Load Usage (kWh/day)
              </label>
              <input
                type="number"
                value={inputs.controlledLoadKwh}
                onChange={(e) => update("controlledLoadKwh", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={0}
                max={20}
                step={1}
              />
              <p className="text-xs text-gray-400 mt-1">
                Hot water systems typically use 4-8 kWh/day. Rate: {STATE_DATA[inputs.state].controlledLoadRate}c/kWh
              </p>
            </div>
          )}

          {/* Solar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solar System Size (kW)
            </label>
            <select
              value={inputs.solarSize}
              onChange={(e) => update("solarSize", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value={0}>No solar</option>
              <option value={3}>3 kW (budget system)</option>
              <option value={5}>5 kW (small-medium)</option>
              <option value={6.6}>6.6 kW (most popular)</option>
              <option value={8}>8 kW (medium-large)</option>
              <option value={10}>10 kW (large)</option>
              <option value={13}>13 kW (max single phase)</option>
            </select>
          </div>

          {/* Feed-in tariff */}
          {inputs.solarSize > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feed-in Tariff (c/kWh)
              </label>
              <input
                type="number"
                value={inputs.feedInTariff}
                onChange={(e) => update("feedInTariff", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={0}
                max={20}
                step={0.5}
              />
            </div>
          )}
        </div>
      </div>

      {/* Primary Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ResultCard
          label="Estimated Quarterly Bill"
          value={formatCurrency(result.primary.quarterlyBill - result.solarSavingsQuarterly)}
          subtext={`${result.primary.label} | ${DAYS_PER_QUARTER} days`}
        />
        <ResultCard
          label="Annual Cost"
          value={formatCurrency(result.primary.annualBill - result.solarSavingsAnnual)}
          subtext="4 quarters"
        />
        <ResultCard
          label="vs State Average"
          value={
            (result.comparisonToAvg >= 0 ? "+" : "") +
            formatCurrency(result.comparisonToAvg) +
            "/qtr"
          }
          subtext={
            result.comparisonToAvg > 0
              ? "Above average"
              : result.comparisonToAvg < 0
                ? "Below average"
                : "On par"
          }
          highlight={result.comparisonToAvg <= 0 ? "green" : "red"}
        />
        <ResultCard
          label="Daily Usage"
          value={`${result.dailyUsageKwh} kWh`}
          subtext="Effective daily consumption"
        />
        <ResultCard
          label="Effective Rate"
          value={`${result.primary.effectiveRate}c/kWh`}
          subtext={`Blended ${result.primary.label.toLowerCase()} rate`}
        />
        {inputs.solarSize > 0 && (
          <ResultCard
            label="Solar Savings"
            value={formatCurrency(result.solarSavingsAnnual) + "/yr"}
            subtext={`${inputs.solarSize}kW system`}
            highlight="green"
          />
        )}
      </div>

      {/* Tariff Comparison */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Tariff Type Comparison — {STATE_DATA[inputs.state].label}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Compare how different tariff structures affect your quarterly bill based on your usage of {result.dailyUsageKwh} kWh/day.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-600">Tariff Type</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Effective Rate</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Quarterly</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-600">Annual</th>
              </tr>
            </thead>
            <tbody>
              {result.allTariffs.map((t) => {
                const isCheapest = t.quarterlyBill === Math.min(...result.allTariffs.map((x) => x.quarterlyBill));
                const isSelected = t.tariffType === inputs.tariffType;
                return (
                  <tr
                    key={t.tariffType}
                    className={`border-b border-gray-100 ${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <td className="py-3 pr-4">
                      <span className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                        {t.label}
                      </span>
                      {isCheapest && (
                        <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Cheapest
                        </span>
                      )}
                      {isSelected && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">{t.effectiveRate}c/kWh</td>
                    <td className="text-right py-3 px-4 font-medium text-gray-900">{formatCurrency(t.quarterlyBill)}</td>
                    <td className="text-right py-3 pl-4 text-gray-700">{formatCurrency(t.annualBill)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tariffComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `$${v}`} />
              <Tooltip formatter={(value: number | string | (readonly (number | string)[]) | undefined) => [formatCurrency(Number(value)), "Quarterly Bill"]} />
              <Bar dataKey="quarterly" radius={[6, 6, 0, 0]}>
                {tariffComparisonData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.name === result.primary.label ? "#1e40af" : "#93c5fd"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provider Comparison */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Provider Comparison — {STATE_DATA[inputs.state].label}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Estimated quarterly costs from major retailers based on their published reference rates for {result.dailyUsageKwh} kWh/day usage. Actual plans may differ.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-600">Provider</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Usage Rate</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Supply/Day</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Quarterly</th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">Annual</th>
                <th className="text-left py-2 pl-4 font-medium text-gray-600">Discount</th>
              </tr>
            </thead>
            <tbody>
              {result.providerComparison.map((p) => {
                if (p.quarterly === 0) {
                  return (
                    <tr key={p.name} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-800">{p.name}</td>
                      <td colSpan={4} className="py-3 px-4 text-center text-gray-400 italic">
                        Not available in {inputs.state}
                      </td>
                      <td className="py-3 pl-4 text-gray-400">{p.discount}</td>
                    </tr>
                  );
                }
                const isCheapest = p.quarterly === Math.min(
                  ...result.providerComparison.filter((x) => x.quarterly > 0).map((x) => x.quarterly)
                );
                const provider = PROVIDERS.find((pr) => pr.name === p.name)!;
                const rates = provider.rates[inputs.state];
                return (
                  <tr key={p.name} className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-gray-800">{p.name}</span>
                      {isCheapest && (
                        <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Lowest
                        </span>
                      )}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">{rates.usageRate}c/kWh</td>
                    <td className="text-right py-3 px-4 text-gray-700">{rates.dailySupply}c</td>
                    <td className="text-right py-3 px-4 font-medium text-gray-900">{formatCurrency(p.quarterly)}</td>
                    <td className="text-right py-3 px-4 text-gray-700">{formatCurrency(p.annual)}</td>
                    <td className="py-3 pl-4 text-xs text-gray-500">{p.discount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Rates are indicative reference rates as of early 2026. Actual rates depend on your specific plan, usage tier, and any applicable discounts. Compare plans at{" "}
          <span className="text-blue-500">Energy Made Easy</span> (gov.au) or the Victorian Energy Compare website.
        </p>
      </div>

      {/* Cost Breakdown Pie */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Quarterly Cost Breakdown
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="h-64 w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={(props: { name?: string; value?: number }) =>
                    `${props.name ?? ""}: ${formatCurrency(props.value ?? 0)}`
                  }
                >
                  {breakdownData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | string | (readonly (number | string)[]) | undefined) => [
                    formatCurrency(Number(value)),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 space-y-2">
            {breakdownData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
            {result.solarSavingsQuarterly > 0 && (
              <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                  <span className="text-gray-700">Solar savings</span>
                </div>
                <span className="font-medium text-emerald-700">
                  -{formatCurrency(result.solarSavingsQuarterly)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm border-t pt-2 mt-2 font-semibold">
              <span>Net Total</span>
              <span>{formatCurrency(result.primary.quarterlyBill - result.solarSavingsQuarterly)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solar Offset Calculator */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Solar Savings by System Size — {STATE_DATA[inputs.state].label}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Estimated annual savings for different solar system sizes in {inputs.state} ({STATE_DATA[inputs.state].avgSolarHours} avg peak sun hours/day).
          Assumes 40% self-consumption and {inputs.feedInTariff}c/kWh feed-in tariff.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {solarComparisonSizes.map((s) => (
            <div
              key={s.size}
              className={`border rounded-lg p-3 text-center ${
                `${inputs.solarSize}kW` === s.size
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-medium text-gray-800">{s.size}</p>
              <p className="text-lg font-bold text-emerald-700">{formatCurrency(s.savingsAnnual)}/yr</p>
              <p className="text-xs text-gray-400">{s.dailyGen} kWh/day generated</p>
            </div>
          ))}
        </div>
        {inputs.solarSize > 0 && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-800">
              Your {inputs.solarSize}kW system generates ~{Math.round(inputs.solarSize * STATE_DATA[inputs.state].avgSolarHours * 10) / 10} kWh/day.
              Quarterly savings: <span className="font-bold">{formatCurrency(result.solarSavingsQuarterly)}</span> ({formatCurrency(result.solarExportIncomeQuarterly)} from feed-in exports).
              Your net quarterly bill after solar: <span className="font-bold">{formatCurrency(result.primary.quarterlyBill - result.solarSavingsQuarterly)}</span>.
            </p>
          </div>
        )}
      </div>

      {/* State Comparison Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Average Quarterly Bill by State
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                formatter={(value: number | string | (readonly (number | string)[]) | undefined) => [
                  formatCurrency(Number(value)),
                  "Avg Quarterly Bill",
                ]}
              />
              <Legend formatter={() => "Avg Quarterly Bill"} />
              <Bar dataKey="quarterly" radius={[6, 6, 0, 0]}>
                {stateComparisonData.map((entry) => (
                  <Cell key={entry.state} fill={entry.isSelected ? "#1e40af" : "#93c5fd"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Your state ({inputs.state}) is highlighted. Based on average household usage per state at flat rates.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-3">
          Tips to Reduce Your Electricity Bill
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-amber-800">
            <span className="mt-0.5 shrink-0">*</span>
            <span>Compare energy plans regularly — switching retailers can save $200-500/year. Use the government Energy Made Easy website.</span>
          </li>
          {inputs.tariffType === "flat" && (
            <li className="flex items-start gap-2 text-sm text-amber-800">
              <span className="mt-0.5 shrink-0">*</span>
              <span>If you can shift usage to off-peak hours (overnight, weekends), a time-of-use tariff could save you {formatCurrency(result.allTariffs[0].quarterlyBill - result.allTariffs[1].quarterlyBill)}/quarter.</span>
            </li>
          )}
          {inputs.solarSize === 0 && (
            <li className="flex items-start gap-2 text-sm text-amber-800">
              <span className="mt-0.5 shrink-0">*</span>
              <span>A 6.6kW solar system could save you ~{formatCurrency(solarComparisonSizes.find((s) => s.size === "6.6kW")?.savingsAnnual ?? 0)}/year in {inputs.state}.</span>
            </li>
          )}
          <li className="flex items-start gap-2 text-sm text-amber-800">
            <span className="mt-0.5 shrink-0">*</span>
            <span>LED lighting uses 75% less energy than halogen. Replacing 10 downlights saves ~$100/year.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-amber-800">
            <span className="mt-0.5 shrink-0">*</span>
            <span>Set your thermostat to 24-25°C in summer and 18-20°C in winter. Each degree of heating/cooling adds 5-10% to your bill.</span>
          </li>
          {inputs.solarSize > 0 && inputs.feedInTariff < 5 && (
            <li className="flex items-start gap-2 text-sm text-amber-800">
              <span className="mt-0.5 shrink-0">*</span>
              <span>Your feed-in tariff is low ({inputs.feedInTariff}c/kWh). A battery could increase self-consumption from 40% to 70-80%, boosting savings significantly.</span>
            </li>
          )}
        </ul>
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
            href="/calculators/mortgage-repayment"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Mortgage Repayment Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Superannuation Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/hecs-help"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">HECS-HELP Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
