"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type CareType = "centre" | "family" | "oshc" | "inhome";

const CARE_TYPES: Record<CareType, { label: string; hourlyRateCap: number }> = {
  centre: { label: "Centre-Based Day Care", hourlyRateCap: 15.6 },
  family: { label: "Family Day Care", hourlyRateCap: 13.73 },
  oshc: { label: "Outside School Hours Care", hourlyRateCap: 16.17 },
  inhome: { label: "In Home Care", hourlyRateCap: 36.81 },
};

/* ── CCS % by combined family income (2025-26) ── */
function getCcsPercentage(income: number): number {
  if (income <= 80000) return 90;
  if (income > 530000) return 0;
  // $80,001 – $530,000: sliding scale from 90% down to 0%
  // Drops by 1% for every ~$5,000 above $80K
  const excess = income - 80000;
  const range = 530000 - 80000; // 450,000
  const pct = 90 - (excess / range) * 90;
  return Math.max(0, Math.round(pct * 100) / 100);
}

/* ── Activity test: hours of subsidised care per fortnight ── */
function getSubsidisedHours(activityHours: number): number {
  if (activityHours < 8) return 0;
  if (activityHours < 16) return 36;
  if (activityHours < 48) return 72;
  return 100; // 48+ hours
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyCents(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function ResultCard({
  label,
  value,
  valueClass,
  subtext,
}: {
  label: string;
  value: string;
  valueClass?: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueClass ?? "text-gray-900"}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function ChildCareSubsidyCalculator() {
  const [familyIncome, setFamilyIncome] = useState(120000);
  const [activityHoursParent1, setActivityHoursParent1] = useState(40);
  const [activityHoursParent2, setActivityHoursParent2] = useState(40);
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [careType, setCareType] = useState<CareType>("centre");
  const [hourlyFee, setHourlyFee] = useState(12);
  const [hoursPerFortnight, setHoursPerFortnight] = useState(80);

  const results = useMemo(() => {
    const ccsPercentage = getCcsPercentage(familyIncome);
    const lowestActivity = Math.min(activityHoursParent1, activityHoursParent2);
    const subsidisedHoursPerFortnight = getSubsidisedHours(lowestActivity);
    const rateCap = CARE_TYPES[careType].hourlyRateCap;

    // Subsidy is applied to the lesser of: hourly fee or hourly rate cap
    const subsidisableRate = Math.min(hourlyFee, rateCap);
    const subsidyPerHour = subsidisableRate * (ccsPercentage / 100);
    const gapPerHour = hourlyFee - subsidyPerHour;

    // Actual hours used per fortnight (limited by subsidised hours)
    const actualSubsidisedHours = Math.min(hoursPerFortnight, subsidisedHoursPerFortnight);
    const unsubsidisedHours = Math.max(0, hoursPerFortnight - subsidisedHoursPerFortnight);

    // Per fortnight amounts (per child)
    const subsidyPerFortnight = subsidyPerHour * actualSubsidisedHours;
    const costPerFortnightSubsidised =
      gapPerHour * actualSubsidisedHours + hourlyFee * unsubsidisedHours;
    const costPerFortnightNoSubsidy = hourlyFee * hoursPerFortnight;

    // Annual (26 fortnights per year, multiplied by number of children)
    const annualSubsidy = subsidyPerFortnight * 26 * numberOfChildren;
    const annualOutOfPocket = costPerFortnightSubsidised * 26 * numberOfChildren;
    const annualWithoutSubsidy = costPerFortnightNoSubsidy * 26 * numberOfChildren;
    const annualSavings = annualWithoutSubsidy - annualOutOfPocket;

    return {
      ccsPercentage,
      subsidisedHoursPerFortnight,
      rateCap,
      subsidyPerHour,
      gapPerHour,
      subsidyPerFortnight,
      costPerFortnightSubsidised,
      costPerFortnightNoSubsidy,
      annualSubsidy,
      annualOutOfPocket,
      annualWithoutSubsidy,
      annualSavings,
      actualSubsidisedHours,
      unsubsidisedHours,
    };
  }, [familyIncome, activityHoursParent1, activityHoursParent2, numberOfChildren, careType, hourlyFee, hoursPerFortnight]);

  return (
    <div className="space-y-8">
      {/* Input section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Family Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="familyIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Combined Family Income (annual)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="familyIncome"
                type="number"
                min={0}
                step={1000}
                value={familyIncome}
                onChange={(e) => setFamilyIncome(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Children in Care
            </label>
            <input
              id="numberOfChildren"
              type="number"
              min={1}
              max={10}
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Activity test */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Activity Test</h2>
        <p className="text-sm text-gray-500 mb-4">
          Hours of recognised activity per fortnight for each parent (work, study, volunteering, looking for work).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="activityParent1" className="block text-sm font-medium text-gray-700 mb-1">
              Parent 1 — Activity Hours / Fortnight
            </label>
            <input
              id="activityParent1"
              type="number"
              min={0}
              max={200}
              value={activityHoursParent1}
              onChange={(e) => setActivityHoursParent1(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="activityParent2" className="block text-sm font-medium text-gray-700 mb-1">
              Parent 2 — Activity Hours / Fortnight
            </label>
            <input
              id="activityParent2"
              type="number"
              min={0}
              max={200}
              value={activityHoursParent2}
              onChange={(e) => setActivityHoursParent2(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Care details */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Care Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="careType" className="block text-sm font-medium text-gray-700 mb-1">
              Type of Care
            </label>
            <select
              id="careType"
              value={careType}
              onChange={(e) => setCareType(e.target.value as CareType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(CARE_TYPES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hourlyFee" className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Fee Charged
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="hourlyFee"
                type="number"
                min={0}
                step={0.5}
                value={hourlyFee}
                onChange={(e) => setHourlyFee(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="hoursPerFortnight" className="block text-sm font-medium text-gray-700 mb-1">
              Hours of Care Used / Fortnight
            </label>
            <input
              id="hoursPerFortnight"
              type="number"
              min={0}
              max={200}
              value={hoursPerFortnight}
              onChange={(e) => setHoursPerFortnight(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ResultCard
          label="CCS Percentage"
          value={`${results.ccsPercentage.toFixed(1)}%`}
          valueClass="text-blue-600"
          subtext="Based on family income"
        />
        <ResultCard
          label="Subsidised Hours"
          value={`${results.subsidisedHoursPerFortnight} hrs/fn`}
          valueClass="text-blue-600"
          subtext="Per child, per fortnight"
        />
        <ResultCard
          label="Hourly Rate Cap"
          value={formatCurrencyCents(results.rateCap)}
          valueClass="text-gray-900"
          subtext={CARE_TYPES[careType].label}
        />
        <ResultCard
          label="Annual Subsidy"
          value={formatCurrency(results.annualSubsidy)}
          valueClass="text-green-600"
          subtext={`${numberOfChildren} child${numberOfChildren > 1 ? "ren" : ""}`}
        />
        <ResultCard
          label="Annual Out-of-Pocket"
          value={formatCurrency(results.annualOutOfPocket)}
          valueClass="text-red-600"
          subtext="Your gap fees"
        />
        <ResultCard
          label="Annual Savings"
          value={formatCurrency(results.annualSavings)}
          valueClass="text-green-600"
          subtext="vs no subsidy"
        />
      </div>

      {/* Side-by-side comparison */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">With Subsidy vs Without Subsidy</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Period</th>
                <th className="text-right py-2 px-4 font-medium text-green-700">With CCS</th>
                <th className="text-right py-2 px-4 font-medium text-red-700">Without CCS</th>
                <th className="text-right py-2 pl-4 font-medium text-blue-700">You Save</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">Per Hour (gap fee)</td>
                <td className="py-2 px-4 text-right font-medium">{formatCurrencyCents(results.gapPerHour)}</td>
                <td className="py-2 px-4 text-right font-medium">{formatCurrencyCents(hourlyFee)}</td>
                <td className="py-2 pl-4 text-right font-medium text-green-600">{formatCurrencyCents(results.subsidyPerHour)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">Per Fortnight (per child)</td>
                <td className="py-2 px-4 text-right font-medium">{formatCurrency(results.costPerFortnightSubsidised)}</td>
                <td className="py-2 px-4 text-right font-medium">{formatCurrency(results.costPerFortnightNoSubsidy)}</td>
                <td className="py-2 pl-4 text-right font-medium text-green-600">{formatCurrency(results.subsidyPerFortnight)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">Annual Total</td>
                <td className="py-2 px-4 text-right font-bold text-green-700">{formatCurrency(results.annualOutOfPocket)}</td>
                <td className="py-2 px-4 text-right font-bold text-red-700">{formatCurrency(results.annualWithoutSubsidy)}</td>
                <td className="py-2 pl-4 text-right font-bold text-green-600">{formatCurrency(results.annualSavings)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Breakdown details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Subsidy Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">CCS percentage</span>
              <span className="font-medium">{results.ccsPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hourly fee charged</span>
              <span className="font-medium">{formatCurrencyCents(hourlyFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hourly rate cap</span>
              <span className="font-medium">{formatCurrencyCents(results.rateCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subsidy applied to</span>
              <span className="font-medium">{formatCurrencyCents(Math.min(hourlyFee, results.rateCap))}/hr</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-600 font-medium">Subsidy per hour</span>
              <span className="font-bold text-green-600">{formatCurrencyCents(results.subsidyPerHour)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Gap fee per hour</span>
              <span className="font-bold text-red-600">{formatCurrencyCents(results.gapPerHour)}</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Activity Test Result</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Parent 1 activity</span>
              <span className="font-medium">{activityHoursParent1} hrs/fn</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Parent 2 activity</span>
              <span className="font-medium">{activityHoursParent2} hrs/fn</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lower activity (used for test)</span>
              <span className="font-medium">{Math.min(activityHoursParent1, activityHoursParent2)} hrs/fn</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-600 font-medium">Subsidised hours</span>
              <span className="font-bold text-blue-600">{results.subsidisedHoursPerFortnight} hrs/fn</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Care hours used</span>
              <span className="font-medium">{hoursPerFortnight} hrs/fn</span>
            </div>
            {results.unsubsidisedHours > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Unsubsidised hours</span>
                <span className="font-medium text-amber-600">{results.unsubsidisedHours} hrs/fn</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Income tiers reference */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">CCS Income Tiers 2025-26</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Family Income</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">CCS %</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "$0 – $80,000", pct: "90%" },
                { range: "$80,001 – $100,000", pct: "~86%" },
                { range: "$100,001 – $150,000", pct: "~76%" },
                { range: "$150,001 – $200,000", pct: "~66%" },
                { range: "$200,001 – $250,000", pct: "~56%" },
                { range: "$250,001 – $350,000", pct: "~36%" },
                { range: "$350,001 – $450,000", pct: "~16%" },
                { range: "$450,001 – $530,000", pct: "~3%" },
                { range: "Over $530,000", pct: "0%" },
              ].map((tier) => (
                <tr key={tier.range} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-600">{tier.range}</td>
                  <td className="py-2 pl-4 text-right font-medium">{tier.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity test reference */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Activity Test Hours</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Activity Hours / Fortnight</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Subsidised Hours / Fortnight</th>
              </tr>
            </thead>
            <tbody>
              {[
                { activity: "Less than 8 hours", hours: "0 (no subsidy)" },
                { activity: "8 – 16 hours", hours: "36 hours" },
                { activity: "16 – 48 hours", hours: "72 hours" },
                { activity: "48+ hours", hours: "100 hours" },
              ].map((row) => (
                <tr key={row.activity} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-600">{row.activity}</td>
                  <td className="py-2 pl-4 text-right font-medium">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACCS note */}
      <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
        <h3 className="font-semibold text-gray-900 mb-2">Additional Child Care Subsidy (ACCS)</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Some families may be eligible for the <strong>Additional Child Care Subsidy</strong>, which provides a higher
          subsidy rate (up to 100% of the fee, up to the hourly rate cap). ACCS is available for families experiencing:
        </p>
        <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
          <li><strong>Child wellbeing</strong> — children at risk of serious abuse or neglect</li>
          <li><strong>Temporary financial hardship</strong> — significant decrease in income</li>
          <li><strong>Transition to work</strong> — moving from income support to employment</li>
          <li><strong>Grandparent carers</strong> — grandparents on income support caring for grandchildren</li>
        </ul>
        <p className="text-sm text-gray-500 mt-2">
          Contact <strong>Services Australia</strong> or visit{" "}
          <span className="font-medium">servicesaustralia.gov.au</span> to check your eligibility for ACCS.
        </p>
      </div>

      {/* Related calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/tax-withholding-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Income Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/centrelink-payment-estimator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Centrelink Payment Estimator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/age-pension"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Age Pension Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/salary-sacrifice-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Salary Sacrifice Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
