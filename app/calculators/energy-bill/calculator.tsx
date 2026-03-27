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
  electricityRate: number; // c/kWh
  dailySupplyCharge: number; // c/day
  avgDailyUsage: number; // kWh/day household average
  feedInTariff: number; // c/kWh default
  gasRate: number; // c/MJ
  gasDailySupply: number; // c/day
}

const STATE_DATA: Record<string, StateData> = {
  NSW: {
    label: "New South Wales",
    electricityRate: 35,
    dailySupplyCharge: 110,
    avgDailyUsage: 18,
    feedInTariff: 5,
    gasRate: 3.5,
    gasDailySupply: 65,
  },
  VIC: {
    label: "Victoria",
    electricityRate: 31,
    dailySupplyCharge: 105,
    avgDailyUsage: 16,
    feedInTariff: 4.5,
    gasRate: 3.2,
    gasDailySupply: 60,
  },
  QLD: {
    label: "Queensland",
    electricityRate: 30,
    dailySupplyCharge: 100,
    avgDailyUsage: 20,
    feedInTariff: 5,
    gasRate: 3.8,
    gasDailySupply: 58,
  },
  SA: {
    label: "South Australia",
    electricityRate: 42,
    dailySupplyCharge: 120,
    avgDailyUsage: 17,
    feedInTariff: 6,
    gasRate: 4.0,
    gasDailySupply: 70,
  },
  WA: {
    label: "Western Australia",
    electricityRate: 31,
    dailySupplyCharge: 105,
    avgDailyUsage: 19,
    feedInTariff: 3,
    gasRate: 3.0,
    gasDailySupply: 55,
  },
  TAS: {
    label: "Tasmania",
    electricityRate: 29,
    dailySupplyCharge: 95,
    avgDailyUsage: 16,
    feedInTariff: 5,
    gasRate: 0,
    gasDailySupply: 0,
  },
  NT: {
    label: "Northern Territory",
    electricityRate: 27,
    dailySupplyCharge: 90,
    avgDailyUsage: 22,
    feedInTariff: 8.3,
    gasRate: 3.5,
    gasDailySupply: 50,
  },
  ACT: {
    label: "Australian Capital Territory",
    electricityRate: 28,
    dailySupplyCharge: 92,
    avgDailyUsage: 17,
    feedInTariff: 6,
    gasRate: 3.3,
    gasDailySupply: 62,
  },
};

// ── Interfaces ───────────────────────────────────────────────────────
interface Inputs {
  state: string;
  usageMode: "daily" | "quarterly";
  dailyUsage: number; // kWh/day
  quarterlyBill: number; // $ (used to back-calculate usage)
  solarSize: number; // kW
  feedInTariff: number; // c/kWh
  gasUsage: number; // MJ/day
  householdSize: number;
  homeType: "house" | "apartment";
  acHoursPerDay: number;
}

interface Result {
  quarterlyElectricityCost: number;
  quarterlyGasCost: number;
  quarterlyTotal: number;
  annualTotal: number;
  supplyChargeQuarterly: number;
  usageChargeQuarterly: number;
  gasSupplyQuarterly: number;
  gasUsageQuarterly: number;
  solarSavingsQuarterly: number;
  solarSavingsAnnual: number;
  solarExportIncomeQuarterly: number;
  dailyUsageKwh: number;
  stateAvgQuarterly: number;
  comparisonToAvg: number; // positive = above average
}

// ── Calculation ──────────────────────────────────────────────────────
const DAYS_PER_QUARTER = 91;
const AVG_SOLAR_HOURS = 4.5; // peak sun hours per day (Australian average)
const SELF_CONSUMPTION_RATIO = 0.4; // 40% self-consumed, 60% exported

function calculateEnergyBill(inputs: Inputs): Result {
  const stateData = STATE_DATA[inputs.state];
  const rateCentsPerKwh = stateData.electricityRate;
  const supplyChargeCentsPerDay = stateData.dailySupplyCharge;

  // Determine daily usage
  let dailyUsageKwh: number;
  if (inputs.usageMode === "daily") {
    dailyUsageKwh = inputs.dailyUsage;
  } else {
    // Back-calculate from quarterly bill
    const totalSupply = (supplyChargeCentsPerDay * DAYS_PER_QUARTER) / 100;
    const usagePortion = Math.max(0, inputs.quarterlyBill - totalSupply);
    dailyUsageKwh = (usagePortion / (rateCentsPerKwh / 100)) / DAYS_PER_QUARTER;
  }

  // AC adjustment: each hour of AC adds ~1.5 kWh/day
  const acAdjustment = inputs.acHoursPerDay * 1.5;
  const adjustedDailyUsage = dailyUsageKwh + acAdjustment;

  // Household size adjustment (base is 2.5 people)
  const householdFactor = 1 + (inputs.householdSize - 2.5) * 0.1;
  const homeTypeFactor = inputs.homeType === "apartment" ? 0.75 : 1;
  const effectiveDailyUsage = adjustedDailyUsage * householdFactor * homeTypeFactor;

  // Solar generation
  const dailySolarGeneration = inputs.solarSize * AVG_SOLAR_HOURS; // kWh/day
  const selfConsumed = dailySolarGeneration * SELF_CONSUMPTION_RATIO;
  const exported = dailySolarGeneration * (1 - SELF_CONSUMPTION_RATIO);

  // Net electricity usage after solar self-consumption
  const netDailyUsage = Math.max(0, effectiveDailyUsage - selfConsumed);

  // Electricity costs (quarterly)
  const supplyChargeQuarterly = (supplyChargeCentsPerDay * DAYS_PER_QUARTER) / 100;
  const usageChargeQuarterly = (netDailyUsage * DAYS_PER_QUARTER * rateCentsPerKwh) / 100;
  const solarExportIncomeQuarterly = (exported * DAYS_PER_QUARTER * inputs.feedInTariff) / 100;
  const quarterlyElectricityCost = supplyChargeQuarterly + usageChargeQuarterly - solarExportIncomeQuarterly;

  // Solar savings = what you would have paid without solar minus what you pay with solar
  const usageWithoutSolarQuarterly = (effectiveDailyUsage * DAYS_PER_QUARTER * rateCentsPerKwh) / 100;
  const solarSavingsQuarterly = usageWithoutSolarQuarterly - usageChargeQuarterly + solarExportIncomeQuarterly;

  // Gas costs (quarterly)
  let gasSupplyQuarterly = 0;
  let gasUsageQuarterly = 0;
  if (inputs.gasUsage > 0 && stateData.gasRate > 0) {
    gasSupplyQuarterly = (stateData.gasDailySupply * DAYS_PER_QUARTER) / 100;
    gasUsageQuarterly = (inputs.gasUsage * DAYS_PER_QUARTER * stateData.gasRate) / 100;
  }
  const quarterlyGasCost = gasSupplyQuarterly + gasUsageQuarterly;

  const quarterlyTotal = quarterlyElectricityCost + quarterlyGasCost;
  const annualTotal = quarterlyTotal * 4;

  // State average comparison (average household: 2.5 people, house, no solar, 2h AC)
  const avgUsage = stateData.avgDailyUsage + 2 * 1.5; // include average AC
  const avgElecQuarterly = (supplyChargeCentsPerDay * DAYS_PER_QUARTER) / 100 +
    (avgUsage * DAYS_PER_QUARTER * rateCentsPerKwh) / 100;
  const avgGasQuarterly = stateData.gasRate > 0
    ? (stateData.gasDailySupply * DAYS_PER_QUARTER) / 100 + (20 * DAYS_PER_QUARTER * stateData.gasRate) / 100
    : 0;
  const stateAvgQuarterly = avgElecQuarterly + avgGasQuarterly;

  return {
    quarterlyElectricityCost: Math.round(quarterlyElectricityCost),
    quarterlyGasCost: Math.round(quarterlyGasCost),
    quarterlyTotal: Math.round(quarterlyTotal),
    annualTotal: Math.round(annualTotal),
    supplyChargeQuarterly: Math.round(supplyChargeQuarterly),
    usageChargeQuarterly: Math.round(usageChargeQuarterly),
    gasSupplyQuarterly: Math.round(gasSupplyQuarterly),
    gasUsageQuarterly: Math.round(gasUsageQuarterly),
    solarSavingsQuarterly: Math.round(solarSavingsQuarterly),
    solarSavingsAnnual: Math.round(solarSavingsQuarterly * 4),
    solarExportIncomeQuarterly: Math.round(solarExportIncomeQuarterly),
    dailyUsageKwh: Math.round(effectiveDailyUsage * 10) / 10,
    stateAvgQuarterly: Math.round(stateAvgQuarterly),
    comparisonToAvg: Math.round(quarterlyTotal - stateAvgQuarterly),
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

// ── Pie chart colours ────────────────────────────────────────────────
const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

// ── Component ────────────────────────────────────────────────────────
export default function EnergyBillCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    state: "NSW",
    usageMode: "daily",
    dailyUsage: 18,
    quarterlyBill: 500,
    solarSize: 0,
    feedInTariff: STATE_DATA["NSW"].feedInTariff,
    gasUsage: 0,
    householdSize: 3,
    homeType: "house",
    acHoursPerDay: 2,
  });

  const result = useMemo(() => calculateEnergyBill(inputs), [inputs]);

  const update = <K extends keyof Inputs>(field: K, value: Inputs[K]) => {
    setInputs((prev) => {
      const next = { ...prev, [field]: value };
      // When state changes, update feed-in tariff to state default
      if (field === "state") {
        next.feedInTariff = STATE_DATA[value as string].feedInTariff;
        next.dailyUsage = STATE_DATA[value as string].avgDailyUsage;
      }
      return next;
    });
  };

  // ── Chart data ──────────────────────────────────────────────────
  const breakdownData = useMemo(() => {
    const items = [
      { name: "Elec. Supply", value: result.supplyChargeQuarterly },
      { name: "Elec. Usage", value: result.usageChargeQuarterly },
    ];
    if (result.gasSupplyQuarterly > 0)
      items.push({ name: "Gas Supply", value: result.gasSupplyQuarterly });
    if (result.gasUsageQuarterly > 0)
      items.push({ name: "Gas Usage", value: result.gasUsageQuarterly });
    return items;
  }, [result]);

  const stateComparisonData = useMemo(() => {
    return Object.entries(STATE_DATA).map(([key, data]) => {
      const avgUsage = data.avgDailyUsage + 2 * 1.5;
      const elecQ =
        (data.dailySupplyCharge * DAYS_PER_QUARTER) / 100 +
        (avgUsage * DAYS_PER_QUARTER * data.electricityRate) / 100;
      const gasQ =
        data.gasRate > 0
          ? (data.gasDailySupply * DAYS_PER_QUARTER) / 100 +
            (20 * DAYS_PER_QUARTER * data.gasRate) / 100
          : 0;
      return {
        state: key,
        quarterly: Math.round(elecQ + gasQ),
        isSelected: key === inputs.state,
      };
    });
  }, [inputs.state]);

  // ── Tips ────────────────────────────────────────────────────────
  const tips = useMemo(() => {
    const t: string[] = [];
    if (inputs.solarSize === 0)
      t.push(
        "Consider a solar system — even a 5kW system could save you " +
          formatCurrency(
            Math.round(
              ((5 * AVG_SOLAR_HOURS * SELF_CONSUMPTION_RATIO * STATE_DATA[inputs.state].electricityRate * DAYS_PER_QUARTER) / 100 +
                (5 * AVG_SOLAR_HOURS * (1 - SELF_CONSUMPTION_RATIO) * inputs.feedInTariff * DAYS_PER_QUARTER) / 100) * 4
            )
          ) +
          "/year."
      );
    if (inputs.acHoursPerDay > 4)
      t.push(
        "Your AC usage is high. Setting your thermostat 1-2 degrees warmer in summer can reduce cooling costs by 5-10%."
      );
    if (inputs.homeType === "house")
      t.push(
        "Draught-proofing doors and windows can reduce heating/cooling costs by up to 25%."
      );
    if (inputs.gasUsage > 30)
      t.push(
        "High gas usage? Switching to a heat pump hot water system can cut water heating costs by 60-80%."
      );
    t.push(
      "Compare energy plans regularly — switching retailers can save $200-500/year. Use the government's Energy Made Easy website."
    );
    if (inputs.solarSize > 0 && inputs.feedInTariff < 5)
      t.push(
        "Your feed-in tariff is low. Consider a battery to store excess solar and use it at night instead of exporting."
      );
    return t;
  }, [inputs]);

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
              Avg rate: {STATE_DATA[inputs.state].electricityRate}c/kWh
            </p>
          </div>

          {/* Usage mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Usage As
            </label>
            <select
              value={inputs.usageMode}
              onChange={(e) =>
                update("usageMode", e.target.value as "daily" | "quarterly")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="daily">Daily kWh usage</option>
              <option value="quarterly">Quarterly bill amount ($)</option>
            </select>
          </div>

          {/* Usage input */}
          {inputs.usageMode === "daily" ? (
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
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Quarterly Bill ($)
              </label>
              <input
                type="number"
                value={inputs.quarterlyBill}
                onChange={(e) =>
                  update("quarterlyBill", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={0}
                step={10}
              />
            </div>
          )}

          {/* Solar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solar System Size (kW)
            </label>
            <input
              type="number"
              value={inputs.solarSize}
              onChange={(e) => update("solarSize", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={15}
              step={0.5}
            />
            <p className="text-xs text-gray-400 mt-1">0 = no solar system</p>
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
                onChange={(e) =>
                  update("feedInTariff", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={0}
                max={20}
                step={0.5}
              />
            </div>
          )}

          {/* Gas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Gas Usage (MJ)
            </label>
            <input
              type="number"
              value={inputs.gasUsage}
              onChange={(e) => update("gasUsage", Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={200}
              step={5}
            />
            <p className="text-xs text-gray-400 mt-1">
              {STATE_DATA[inputs.state].gasRate > 0
                ? `${inputs.state} rate: ${STATE_DATA[inputs.state].gasRate}c/MJ`
                : "Gas not commonly used in this state"}
            </p>
          </div>

          {/* Household size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              People in Household
            </label>
            <input
              type="number"
              value={inputs.householdSize}
              onChange={(e) =>
                update("householdSize", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={1}
              max={10}
              step={1}
            />
          </div>

          {/* Home type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Type
            </label>
            <select
              value={inputs.homeType}
              onChange={(e) =>
                update("homeType", e.target.value as "house" | "apartment")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment / Unit</option>
            </select>
          </div>

          {/* AC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Air Conditioning (hours/day)
            </label>
            <input
              type="number"
              value={inputs.acHoursPerDay}
              onChange={(e) =>
                update("acHoursPerDay", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={0}
              max={24}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ResultCard
          label="Estimated Quarterly Bill"
          value={formatCurrency(result.quarterlyTotal)}
          subtext={`${DAYS_PER_QUARTER} days`}
        />
        <ResultCard
          label="Annual Cost"
          value={formatCurrency(result.annualTotal)}
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
        {inputs.solarSize > 0 && (
          <>
            <ResultCard
              label="Solar Savings"
              value={formatCurrency(result.solarSavingsAnnual) + "/yr"}
              subtext={`${inputs.solarSize}kW system`}
              highlight="green"
            />
            <ResultCard
              label="Feed-in Income"
              value={formatCurrency(result.solarExportIncomeQuarterly) + "/qtr"}
              subtext={`At ${inputs.feedInTariff}c/kWh`}
              highlight="green"
            />
          </>
        )}
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
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
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
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{
                      backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
            {result.solarExportIncomeQuarterly > 0 && (
              <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                  <span className="text-gray-700">Solar credit</span>
                </div>
                <span className="font-medium text-emerald-700">
                  -{formatCurrency(result.solarExportIncomeQuarterly)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm border-t pt-2 mt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(result.quarterlyTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* State Comparison Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Average Quarterly Bill by State
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stateComparisonData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                formatter={(value: number | string | (readonly (number | string)[]) | undefined) => [
                  formatCurrency(Number(value)),
                  "Avg Quarterly Bill",
                ]}
              />
              <Legend formatter={() => "Avg Quarterly Bill"} />
              <Bar
                dataKey="quarterly"
                radius={[6, 6, 0, 0]}
              >
                {stateComparisonData.map((entry) => (
                  <Cell
                    key={entry.state}
                    fill={entry.isSelected ? "#1e40af" : "#93c5fd"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Your state ({inputs.state}) is highlighted. Based on average household usage + 2h AC/day.
        </p>
      </div>

      {/* Tips to Reduce Bill */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-3">
          Tips to Reduce Your Energy Bill
        </h3>
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-amber-800">
              <span className="mt-0.5 shrink-0">*</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Superannuation Calculator</span>
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
            href="/calculators/stamp-duty"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
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
