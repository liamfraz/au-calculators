"use client";
import Link from "next/link";

import { useState, useMemo } from "react";

type PropertyType = "house" | "unit" | "townhouse";

// --- Formatting ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// --- Constants ---

const CURRENT_YEAR = 2026;
const DIV43_RATE = 0.025;
const DIV43_LIFE_YEARS = 40;
const DIV43_ELIGIBLE_AFTER = 1987;
const DIV40_RATE = 0.20;
const DIV40_SCHEDULE_YEARS = 10;

// --- Year options ---

const YEAR_OPTIONS: number[] = [];
for (let y = CURRENT_YEAR; y >= 1985; y--) {
  YEAR_OPTIONS.push(y);
}

// --- Types ---

interface Div40Year {
  year: number;
  deduction: number;
  remaining: number;
}

// --- Component ---

export default function DepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(600000);
  const [constructionCost, setConstructionCost] = useState(350000);
  const [yearBuilt, setYearBuilt] = useState(2015);
  const [propertyType, setPropertyType] = useState<PropertyType>("house");
  const [isNew, setIsNew] = useState(false);
  const [plantEquipmentValue, setPlantEquipmentValue] = useState(30000);

  // --- Division 43 Calculation ---
  const div43 = useMemo(() => {
    const buildingAge = CURRENT_YEAR - yearBuilt;
    const eligible = yearBuilt >= DIV43_ELIGIBLE_AFTER;
    const remainingYears = Math.max(0, DIV43_LIFE_YEARS - buildingAge);
    const annualDeduction = eligible && remainingYears > 0 ? constructionCost * DIV43_RATE : 0;
    const totalRemaining = annualDeduction * remainingYears;

    return { buildingAge, eligible, remainingYears, annualDeduction, totalRemaining };
  }, [constructionCost, yearBuilt]);

  // --- Division 40 Calculation (Diminishing Value) ---
  const div40Schedule = useMemo(() => {
    const schedule: Div40Year[] = [];
    let remainingValue = plantEquipmentValue;

    for (let year = 1; year <= DIV40_SCHEDULE_YEARS; year++) {
      const deduction = Math.round(remainingValue * DIV40_RATE);
      remainingValue -= deduction;
      schedule.push({ year, deduction, remaining: remainingValue });
    }

    return schedule;
  }, [plantEquipmentValue]);

  // --- Totals ---
  const totals = useMemo(() => {
    const year1Div40 = div40Schedule.length > 0 ? div40Schedule[0].deduction : 0;
    const year1Total = div43.annualDeduction + year1Div40;

    const fiveYearDiv40 = div40Schedule
      .slice(0, 5)
      .reduce((sum, y) => sum + y.deduction, 0);
    const fiveYearDiv43 = div43.annualDeduction * Math.min(5, div43.remainingYears);
    const totalOver5Years = fiveYearDiv43 + fiveYearDiv40;

    const tenYearDiv40 = div40Schedule.reduce((sum, y) => sum + y.deduction, 0);
    const tenYearDiv43 = div43.annualDeduction * Math.min(10, div43.remainingYears);
    const totalOver10Years = tenYearDiv43 + tenYearDiv40;

    return { year1Total, totalOver5Years, totalOver10Years, year1Div40 };
  }, [div43, div40Schedule]);

  // --- 10-year schedule table data ---
  const scheduleTable = useMemo(() => {
    let cumulative = 0;
    return div40Schedule.map((row) => {
      const yearIndex = row.year;
      const d43 = yearIndex <= div43.remainingYears ? div43.annualDeduction : 0;
      const d40 = row.deduction;
      const total = d43 + d40;
      cumulative += total;
      return { year: yearIndex, div43: d43, div40: d40, total, cumulative };
    });
  }, [div40Schedule, div43]);

  const isSecondHand = !isNew;

  return (
    <div className="space-y-8">
      {/* Disclaimer */}
      <div className="border border-amber-200 rounded-xl p-4 bg-amber-50 text-amber-800 text-sm">
        <p className="font-semibold mb-1">Estimates Only</p>
        <p>
          This calculator provides estimates only. For accurate depreciation deductions, you must
          obtain a depreciation schedule from a qualified quantity surveyor (AIQS member). The cost
          of a schedule ($300–$800) is tax deductible.
        </p>
      </div>

      {/* Input Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Property Purchase Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="purchasePrice"
                type="number"
                min={0}
                step={10000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Construction Cost */}
          <div>
            <label htmlFor="constructionCost" className="block text-sm font-medium text-gray-700 mb-1">
              Construction Cost or Building Value ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="constructionCost"
                type="number"
                min={0}
                step={10000}
                value={constructionCost}
                onChange={(e) => setConstructionCost(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              If unknown, typically 60–70% of purchase price for houses, 80–90% for units
            </p>
          </div>

          {/* Year Built */}
          <div>
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <select
              id="yearBuilt"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <div className="flex gap-2">
              {([
                ["house", "House"],
                ["unit", "Unit / Apartment"],
                ["townhouse", "Townhouse"],
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

          {/* Is New Property */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is this a new property?
            </label>
            <div className="flex gap-2">
              {([
                [true, "Yes"],
                [false, "No"],
              ] as const).map(([value, label]) => (
                <button
                  key={String(value)}
                  onClick={() => setIsNew(value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    isNew === value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Plant & Equipment Value */}
          <div>
            <label htmlFor="plantEquipment" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Plant &amp; Equipment Value ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="plantEquipment"
                type="number"
                min={0}
                step={1000}
                value={plantEquipmentValue}
                onChange={(e) => setPlantEquipmentValue(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Fixtures, fittings, appliances. New properties typically $15,000–$50,000
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {!div43.eligible && (
        <div className="border border-amber-200 rounded-xl p-4 bg-amber-50 text-amber-800 text-sm">
          <p className="font-semibold mb-1">Division 43 Not Available</p>
          <p>
            Properties built before 16 September 1987 are not eligible for Division 43 building
            allowance deductions. You may still be able to claim Division 40 plant and equipment
            deductions.
          </p>
        </div>
      )}

      {isSecondHand && (
        <div className="border border-amber-200 rounded-xl p-4 bg-amber-50 text-amber-800 text-sm">
          <p className="font-semibold mb-1">Second-Hand Property — Division 40 Restrictions</p>
          <p>
            Since May 2017, Division 40 plant and equipment deductions cannot be claimed for
            previously used assets in second-hand residential investment properties. Only items
            you purchase new and install yourself can be claimed. The Division 40 amounts shown
            below may not be fully claimable — consult a tax professional.
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Annual Building Allowance (Div 43)</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(div43.annualDeduction)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Year 1 Plant &amp; Equipment (Div 40)</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.year1Div40)}</p>
        </div>
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-blue-700 mb-1">Total Year 1 Deduction</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(totals.year1Total)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Total Over 5 Years</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalOver5Years)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Total Over 10 Years</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalOver10Years)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Remaining Building Allowance Years</p>
          <p className="text-2xl font-bold text-gray-900">
            {div43.eligible ? `${div43.remainingYears} years` : "N/A"}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">How Depreciation Works</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Division 43 covers the building structure at 2.5% per year over 40 years. This is a
          straight-line deduction based on the original construction cost. Division 40 covers
          removable plant and equipment items which depreciate at varying rates using the
          diminishing value method. This calculator uses an average rate of 20% across typical
          residential items (carpets, blinds, hot water systems, ovens, air conditioning).
        </p>
      </div>

      {/* 10-Year Schedule Table */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">
          10-Year Depreciation Schedule
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Estimated annual deductions for a {formatCurrency(purchasePrice)}{" "}
          {propertyType === "house" ? "house" : propertyType === "unit" ? "unit/apartment" : "townhouse"}
          {" "}built in {yearBuilt}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Year</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Div 43</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Div 40</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Total</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {scheduleTable.map((row) => (
                <tr key={row.year} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-900">{row.year}</td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrency(row.div43)}
                  </td>
                  <td className="text-right py-2 px-4 text-gray-600">
                    {formatCurrency(row.div40)}
                  </td>
                  <td className="text-right py-2 px-4 font-semibold text-gray-900">
                    {formatCurrency(row.total)}
                  </td>
                  <td className="text-right py-2 pl-4 text-gray-500">
                    {formatCurrency(row.cumulative)}
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
            href="/calculators/negative-gearing"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Negative Gearing Calculator</span>
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
            href="/calculators/stamp-duty"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Stamp Duty Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
