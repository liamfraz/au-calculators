"use client";

import { useState, useMemo } from "react";

// ── State electricity rates (2025-26 averages, GST inclusive) ────────
const STATE_DATA: Record<
  string,
  {
    label: string;
    usageRate: number;
    supplyCharge: number;
    avgDailyKwh: number;
    retailers: string;
  }
> = {
  NSW: {
    label: "New South Wales",
    usageRate: 0.35,
    supplyCharge: 1.1,
    avgDailyKwh: 18,
    retailers: "AGL, Origin Energy, EnergyAustralia, Red Energy",
  },
  VIC: {
    label: "Victoria",
    usageRate: 0.31,
    supplyCharge: 1.05,
    avgDailyKwh: 16,
    retailers: "AGL, Origin Energy, EnergyAustralia, Alinta Energy",
  },
  QLD: {
    label: "Queensland",
    usageRate: 0.3,
    supplyCharge: 1.0,
    avgDailyKwh: 19,
    retailers: "AGL, Origin Energy, EnergyAustralia, Ergon Energy",
  },
  SA: {
    label: "South Australia",
    usageRate: 0.42,
    supplyCharge: 1.2,
    avgDailyKwh: 16,
    retailers: "AGL, Origin Energy, EnergyAustralia, Simply Energy",
  },
  WA: {
    label: "Western Australia",
    usageRate: 0.31,
    supplyCharge: 1.06,
    avgDailyKwh: 20,
    retailers: "Synergy (regulated), Alinta Energy",
  },
  TAS: {
    label: "Tasmania",
    usageRate: 0.29,
    supplyCharge: 0.95,
    avgDailyKwh: 17,
    retailers: "Aurora Energy (regulated), 1st Energy",
  },
  ACT: {
    label: "Australian Capital Territory",
    usageRate: 0.28,
    supplyCharge: 0.98,
    avgDailyKwh: 18,
    retailers: "ActewAGL, Origin Energy, EnergyAustralia",
  },
  NT: {
    label: "Northern Territory",
    usageRate: 0.27,
    supplyCharge: 0.9,
    avgDailyKwh: 22,
    retailers: "Jacana Energy (regulated)",
  },
};

const STATES = Object.keys(STATE_DATA);

// ── Household size multipliers (relative to average 2.5-person household) ──
const HOUSEHOLD_MULTIPLIERS: Record<number, number> = {
  1: 0.6,
  2: 0.85,
  3: 1.0,
  4: 1.2,
  5: 1.4,
  6: 1.55,
};

// ── Common appliances with estimated daily kWh ──────────────────────
interface Appliance {
  name: string;
  kwhPerDay: number;
  category: string;
}

const APPLIANCES: Appliance[] = [
  { name: "Refrigerator (400L)", kwhPerDay: 1.5, category: "Kitchen" },
  { name: "Dishwasher (1 cycle/day)", kwhPerDay: 1.8, category: "Kitchen" },
  { name: "Electric oven (1 hr/day)", kwhPerDay: 2.0, category: "Kitchen" },
  { name: "Microwave (30 min/day)", kwhPerDay: 0.6, category: "Kitchen" },
  { name: "Kettle (4 boils/day)", kwhPerDay: 0.4, category: "Kitchen" },
  { name: "Washing machine (1 load/day)", kwhPerDay: 0.5, category: "Laundry" },
  { name: "Clothes dryer (1 load/day)", kwhPerDay: 3.5, category: "Laundry" },
  { name: "Split-system A/C (4 hrs/day)", kwhPerDay: 4.0, category: "Climate" },
  { name: "Ducted A/C (4 hrs/day)", kwhPerDay: 8.0, category: "Climate" },
  { name: "Portable heater (4 hrs/day)", kwhPerDay: 8.0, category: "Climate" },
  { name: "Electric hot water system", kwhPerDay: 6.0, category: "Hot Water" },
  { name: "Heat pump hot water", kwhPerDay: 2.0, category: "Hot Water" },
  { name: "TV (4 hrs/day)", kwhPerDay: 0.4, category: "Entertainment" },
  { name: "Desktop PC (4 hrs/day)", kwhPerDay: 0.6, category: "Entertainment" },
  { name: "Pool pump (6 hrs/day)", kwhPerDay: 4.5, category: "Outdoor" },
  { name: "EV charger (daily top-up)", kwhPerDay: 10.0, category: "Transport" },
  { name: "LED lighting (10 bulbs)", kwhPerDay: 0.3, category: "Lighting" },
];

const TIPS = [
  "Compare plans on Energy Made Easy (AER) or Victorian Energy Compare — switching retailers like AGL, Origin Energy, or EnergyAustralia could save $200–$500/year.",
  "Set air-conditioning to 24\u00B0C in summer and 20\u00B0C in winter. Every degree costs roughly 10% more energy.",
  "Switch to a heat pump hot water system — it uses 60–70% less energy than a traditional electric unit.",
  "Run dishwashers and washing machines during off-peak hours if you are on a time-of-use tariff.",
  "Install a 6.6 kW solar system — typically saves $1,000–$2,000/year and pays for itself in 3–5 years.",
];

function fmt(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
}

type UsageMode = "household" | "manual" | "appliances";

export default function ElectricityBillCalculator() {
  const [state, setState] = useState("NSW");
  const [householdSize, setHouseholdSize] = useState(3);
  const [manualKwh, setManualKwh] = useState(18);
  const [usageMode, setUsageMode] = useState<UsageMode>("household");
  const [selectedAppliances, setSelectedAppliances] = useState<Set<number>>(
    new Set()
  );

  function handleStateChange(s: string) {
    setState(s);
  }

  function toggleAppliance(idx: number) {
    setSelectedAppliances((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const dailyKwh = useMemo(() => {
    if (usageMode === "manual") return manualKwh;
    if (usageMode === "appliances") {
      let total = 0;
      selectedAppliances.forEach((idx) => {
        total += APPLIANCES[idx].kwhPerDay;
      });
      // Add baseline for standby/lighting if appliances selected
      return total > 0 ? total + 1.5 : 0;
    }
    // household mode
    const baseKwh = STATE_DATA[state].avgDailyKwh;
    return Math.round(baseKwh * HOUSEHOLD_MULTIPLIERS[householdSize]);
  }, [usageMode, manualKwh, selectedAppliances, householdSize, state]);

  const { usageRate, supplyCharge } = STATE_DATA[state];

  const results = useMemo(() => {
    const daysPerQuarter = 91;
    const daysPerYear = 365;

    const dailyUsageCost = dailyKwh * usageRate;
    const dailyTotal = dailyUsageCost + supplyCharge;
    const quarterlyBill = dailyTotal * daysPerQuarter;
    const annualBill = dailyTotal * daysPerYear;

    return {
      dailyKwh,
      dailyCost: dailyTotal,
      dailyUsageCost,
      quarterlyBill,
      annualBill,
      supplyPct: dailyTotal > 0 ? (supplyCharge / dailyTotal) * 100 : 0,
      usagePct: dailyTotal > 0 ? (dailyUsageCost / dailyTotal) * 100 : 0,
    };
  }, [dailyKwh, usageRate, supplyCharge]);

  // Group appliances by category
  const appliancesByCategory = useMemo(() => {
    const map = new Map<string, { appliance: Appliance; idx: number }[]>();
    APPLIANCES.forEach((a, i) => {
      if (!map.has(a.category)) map.set(a.category, []);
      map.get(a.category)!.push({ appliance: a, idx: i });
    });
    return map;
  }, []);

  return (
    <>
      {/* Calculator inputs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Details
        </h2>

        {/* State selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State / Territory
          </label>
          <select
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {STATE_DATA[s].label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Usage rate: {(usageRate * 100).toFixed(1)}c/kWh | Supply:{" "}
            {fmt(supplyCharge)}/day
          </p>
        </div>

        {/* Usage mode toggle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you like to estimate usage?
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["household", "By Household Size"],
                ["manual", "Enter kWh/day"],
                ["appliances", "Select Appliances"],
              ] as [UsageMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setUsageMode(mode)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  usageMode === mode
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Household size input */}
        {usageMode === "household" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Household Size
            </label>
            <select
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "person" : "people"}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Estimated daily usage: ~{dailyKwh} kWh/day for {householdSize}{" "}
              {householdSize === 1 ? "person" : "people"} in{" "}
              {STATE_DATA[state].label}
            </p>
          </div>
        )}

        {/* Manual kWh input */}
        {usageMode === "manual" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Usage (kWh)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={manualKwh}
              onChange={(e) => setManualKwh(Math.max(0, Number(e.target.value)))}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              AU average household: ~18 kWh/day (check your bill for exact
              figure)
            </p>
          </div>
        )}

        {/* Appliances checklist */}
        {usageMode === "appliances" && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-3">
              Select the appliances you use daily. A 1.5 kWh baseline
              (standby/lighting) is added automatically.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from(appliancesByCategory).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {items.map(({ appliance, idx }) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAppliances.has(idx)}
                          onChange={() => toggleAppliance(idx)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex-1">{appliance.name}</span>
                        <span className="text-xs text-gray-400">
                          {appliance.kwhPerDay} kWh
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Estimated daily usage: ~{dailyKwh.toFixed(1)} kWh/day
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Estimated Electricity Bill
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Daily Cost</p>
            <p className="text-2xl font-bold text-blue-900">
              {fmt(results.dailyCost)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {dailyKwh} kWh/day
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Quarterly Bill</p>
            <p className="text-2xl font-bold text-blue-900">
              {fmt(results.quarterlyBill)}
            </p>
            <p className="text-xs text-blue-600 mt-1">91 days</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Annual Cost</p>
            <p className="text-2xl font-bold text-blue-900">
              {fmt(results.annualBill)}
            </p>
            <p className="text-xs text-blue-600 mt-1">365 days</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Daily Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Usage ({dailyKwh} kWh x{" "}
                {(usageRate * 100).toFixed(1)}c/kWh)
              </span>
              <span className="font-medium">
                {fmt(results.dailyUsageCost)}/day
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supply charge</span>
              <span className="font-medium">{fmt(supplyCharge)}/day</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-900 font-medium">Daily total</span>
              <span className="font-bold">{fmt(results.dailyCost)}/day</span>
            </div>
          </div>
          {/* Cost split bar */}
          <div className="mt-3">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-500"
                style={{ width: `${results.usagePct}%` }}
                title={`Usage: ${results.usagePct.toFixed(0)}%`}
              />
              <div
                className="bg-gray-300"
                style={{ width: `${results.supplyPct}%` }}
                title={`Supply: ${results.supplyPct.toFixed(0)}%`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Usage {results.usagePct.toFixed(0)}%</span>
              <span>Supply {results.supplyPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* State comparison table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Average Electricity Rates by State (2025-26)
        </h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-700">
                  State
                </th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">
                  Usage Rate
                </th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">
                  Supply Charge
                </th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">
                  Est. Quarterly*
                </th>
                <th className="text-left py-2 px-2 font-medium text-gray-700 hidden sm:table-cell">
                  Major Retailers
                </th>
              </tr>
            </thead>
            <tbody>
              {STATES.map((s) => {
                const d = STATE_DATA[s];
                const quarterlyEst =
                  (d.avgDailyKwh * d.usageRate + d.supplyCharge) * 91;
                const isSelected = s === state;
                return (
                  <tr
                    key={s}
                    className={`border-b border-gray-100 ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="py-2 px-2">
                      <span className={isSelected ? "font-semibold" : ""}>
                        {s}
                      </span>
                    </td>
                    <td className="text-right py-2 px-2">
                      {(d.usageRate * 100).toFixed(1)}c/kWh
                    </td>
                    <td className="text-right py-2 px-2">
                      {fmt(d.supplyCharge)}/day
                    </td>
                    <td className="text-right py-2 px-2">
                      {fmt(quarterlyEst)}
                    </td>
                    <td className="py-2 px-2 text-xs text-gray-500 hidden sm:table-cell">
                      {d.retailers}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          *Based on average daily usage for each state. Actual bills vary by
          household. Rates sourced from AGL, Origin Energy, and EnergyAustralia
          default market offers.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          5 Ways to Reduce Your Electricity Bill in Australia
        </h2>
        <ul className="space-y-3">
          {TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-400 mt-4">
          Major Australian electricity retailers include AGL, Origin Energy, and
          EnergyAustralia. Use the Australian Energy Regulator&apos;s Energy Made
          Easy website to compare plans in your area.
        </p>
      </div>
    </>
  );
}
