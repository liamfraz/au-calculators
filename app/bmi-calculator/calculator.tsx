"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── Type definitions ──────────────────────────────────────────────────────────

type Sex = "male" | "female";
type HeightUnit = "cm" | "imperial";
type WeightUnit = "kg" | "lbs";

interface Inputs {
  heightCm: number;
  heightFt: number;
  heightIn: number;
  weightKg: number;
  weightLbs: number;
  age: number;
  sex: Sex;
  waistCm: number;
  waistIn: number;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
}

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthyWeightMin: number;
  healthyWeightMax: number;
  gaugePercent: number;
}

interface WaistResult {
  ratio: number;
  category: string;
  categoryColor: string;
}

interface IdealWeightResult {
  devine: number;
  robinson: number;
  miller: number;
  hamwi: number;
}

// ── Conversion helpers ────────────────────────────────────────────────────────

function cmToInches(cm: number): number {
  return cm / 2.54;
}

function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * 2.54;
}

function lbsToKg(lbs: number): number {
  return lbs / 2.2046;
}

// ── Pure calculation functions ────────────────────────────────────────────────

function getEffectiveHeightCm(inputs: Inputs): number {
  if (inputs.heightUnit === "cm") return inputs.heightCm;
  return ftInToCm(inputs.heightFt, inputs.heightIn);
}

function getEffectiveWeightKg(inputs: Inputs): number {
  if (inputs.weightUnit === "kg") return inputs.weightKg;
  return lbsToKg(inputs.weightLbs);
}

function getEffectiveWaistCm(inputs: Inputs): number {
  if (inputs.heightUnit === "cm") return inputs.waistCm;
  return inputs.waistIn * 2.54;
}

function calculateBMI(inputs: Inputs): BMIResult {
  const heightCm = getEffectiveHeightCm(inputs);
  const weightKg = getEffectiveWeightKg(inputs);
  const heightM = heightCm / 100;

  if (heightM <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: "—",
      categoryColor: "text-gray-500",
      healthyWeightMin: 0,
      healthyWeightMax: 0,
      gaugePercent: 0,
    };
  }

  const bmi = weightKg / (heightM * heightM);

  let category: string;
  let categoryColor: string;
  if (bmi < 18.5) {
    category = "Underweight";
    categoryColor = "text-blue-600";
  } else if (bmi < 25) {
    category = "Normal weight";
    categoryColor = "text-green-600";
  } else if (bmi < 30) {
    category = "Overweight";
    categoryColor = "text-amber-600";
  } else {
    category = "Obese";
    categoryColor = "text-red-600";
  }

  // Healthy weight range for this height (BMI 18.5 – 24.9)
  const healthyWeightMin = 18.5 * heightM * heightM;
  const healthyWeightMax = 24.9 * heightM * heightM;

  // Gauge: scale 15 → 40, clamp
  const GAUGE_MIN = 15;
  const GAUGE_MAX = 40;
  const gaugePercent = Math.min(
    100,
    Math.max(0, ((bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100)
  );

  return { bmi, category, categoryColor, healthyWeightMin, healthyWeightMax, gaugePercent };
}

function calculateWaistRatio(inputs: Inputs): WaistResult | null {
  const heightCm = getEffectiveHeightCm(inputs);
  const waistCm = getEffectiveWaistCm(inputs);

  if (heightCm <= 0 || waistCm <= 0) return null;

  const ratio = waistCm / heightCm;

  let category: string;
  let categoryColor: string;
  if (ratio < 0.4) {
    category = "Underweight risk";
    categoryColor = "text-blue-600";
  } else if (ratio <= 0.5) {
    category = "Healthy";
    categoryColor = "text-green-600";
  } else if (ratio <= 0.6) {
    category = "Increased risk";
    categoryColor = "text-amber-600";
  } else {
    category = "High risk";
    categoryColor = "text-red-600";
  }

  return { ratio, category, categoryColor };
}

function calculateIdealWeight(inputs: Inputs): IdealWeightResult | null {
  const heightCm = getEffectiveHeightCm(inputs);
  if (heightCm <= 0) return null;

  const heightInches = cmToInches(heightCm);
  const extraInches = heightInches - 60;
  const { sex } = inputs;

  const devine =
    sex === "male"
      ? 50 + 2.3 * extraInches
      : 45.5 + 2.3 * extraInches;

  const robinson =
    sex === "male"
      ? 52 + 1.9 * extraInches
      : 49 + 1.7 * extraInches;

  const miller =
    sex === "male"
      ? 56.2 + 1.41 * extraInches
      : 53.1 + 1.36 * extraInches;

  const hamwi =
    sex === "male"
      ? 48 + 2.7 * extraInches
      : 45.5 + 2.2 * extraInches;

  return { devine, robinson, miller, hamwi };
}

// ── Formatting helpers ────────────────────────────────────────────────────────

function formatWeight(kg: number): string {
  return new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(kg) + " kg";
}

function formatBMI(bmi: number): string {
  return new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(bmi);
}

function formatRatio(r: number): string {
  return new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(r);
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
      <p className={`text-2xl font-bold ${valueClass ?? "text-blue-800"}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

function BMIGauge({ gaugePercent, bmi }: { gaugePercent: number; bmi: number }) {
  // Segment widths as % of 15–40 range (span = 25)
  // Underweight: 15–18.5 = 3.5 → 14%
  // Normal:      18.5–25  = 6.5 → 26%
  // Overweight:  25–30    = 5   → 20%
  // Obese:       30–40    = 10  → 40%
  const segments = [
    { label: "Underweight", color: "bg-blue-400", widthPct: 14 },
    { label: "Normal", color: "bg-green-500", widthPct: 26 },
    { label: "Overweight", color: "bg-amber-500", widthPct: 20 },
    { label: "Obese", color: "bg-red-500", widthPct: 40 },
  ];

  return (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-2">BMI Scale (15 – 40+)</p>
      {/* Bar */}
      <div className="relative h-6 flex rounded-full overflow-visible">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} h-full`}
            style={{ width: `${seg.widthPct}%` }}
          />
        ))}
        {/* Marker */}
        {bmi > 0 && (
          <div
            className="absolute top-0 bottom-0 flex flex-col items-center"
            style={{ left: `${gaugePercent}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-0.5 h-full bg-gray-800" />
            <div
              className="mt-1 text-xs font-bold text-gray-800 whitespace-nowrap"
              style={{ marginTop: "2px" }}
            >
              {formatBMI(bmi)}
            </div>
          </div>
        )}
      </div>
      {/* Labels */}
      <div className="flex mt-5 text-xs text-gray-500">
        <span style={{ width: "14%" }}>15</span>
        <span style={{ width: "26%" }}>18.5</span>
        <span style={{ width: "20%" }}>25</span>
        <span style={{ width: "40%" }}>30</span>
        <span>40+</span>
      </div>
      <div className="flex mt-1 text-xs">
        {segments.map((seg) => (
          <span key={seg.label} className="text-gray-500" style={{ width: `${seg.widthPct}%` }}>
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BMICalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    heightCm: 175,
    heightFt: 5,
    heightIn: 9,
    weightKg: 75,
    weightLbs: 165,
    age: 30,
    sex: "male",
    waistCm: 80,
    waistIn: 31.5,
    heightUnit: "cm",
    weightUnit: "kg",
  });

  const set = (partial: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...partial }));

  const bmiResult = useMemo(() => calculateBMI(inputs), [inputs]);
  const waistResult = useMemo(() => calculateWaistRatio(inputs), [inputs]);
  const idealWeightResult = useMemo(() => calculateIdealWeight(inputs), [inputs]);

  const isImperial = inputs.heightUnit === "imperial";

  return (
    <div className="space-y-8">
      {/* ── Inputs ── */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Your Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Height */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Height</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-300 text-xs">
                <button
                  type="button"
                  onClick={() => set({ heightUnit: "cm" })}
                  className={`px-3 py-1 font-medium transition-colors ${
                    !isImperial ? "bg-blue-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => set({ heightUnit: "imperial" })}
                  className={`px-3 py-1 font-medium transition-colors ${
                    isImperial ? "bg-blue-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  ft / in
                </button>
              </div>
            </div>
            {!isImperial ? (
              <input
                type="number"
                value={inputs.heightCm}
                onChange={(e) => set({ heightCm: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={50}
                max={250}
                step={1}
                placeholder="cm"
              />
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputs.heightFt}
                  onChange={(e) => set({ heightFt: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min={1}
                  max={8}
                  step={1}
                  placeholder="ft"
                />
                <input
                  type="number"
                  value={inputs.heightIn}
                  onChange={(e) => set({ heightIn: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min={0}
                  max={11}
                  step={0.5}
                  placeholder="in"
                />
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Weight</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-300 text-xs">
                <button
                  type="button"
                  onClick={() => set({ weightUnit: "kg" })}
                  className={`px-3 py-1 font-medium transition-colors ${
                    inputs.weightUnit === "kg" ? "bg-blue-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => set({ weightUnit: "lbs" })}
                  className={`px-3 py-1 font-medium transition-colors ${
                    inputs.weightUnit === "lbs" ? "bg-blue-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>
            {inputs.weightUnit === "kg" ? (
              <input
                type="number"
                value={inputs.weightKg}
                onChange={(e) => set({ weightKg: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={10}
                max={300}
                step={0.5}
                placeholder="kg"
              />
            ) : (
              <input
                type="number"
                value={inputs.weightLbs}
                onChange={(e) => set({ weightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={22}
                max={660}
                step={1}
                placeholder="lbs"
              />
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              value={inputs.age}
              onChange={(e) => set({ age: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={2}
              max={120}
              step={1}
            />
          </div>

          {/* Biological sex */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biological sex</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 w-full">
              <button
                type="button"
                onClick={() => set({ sex: "male" })}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  inputs.sex === "male" ? "bg-blue-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => set({ sex: "female" })}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  inputs.sex === "female" ? "bg-blue-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BMI Results ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">BMI Result</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultCard
            label="Your BMI"
            value={bmiResult.bmi > 0 ? formatBMI(bmiResult.bmi) : "—"}
            valueClass={`text-3xl font-extrabold ${bmiResult.categoryColor}`}
          />
          <ResultCard
            label="BMI Category"
            value={bmiResult.category}
            valueClass={`text-xl font-bold ${bmiResult.categoryColor}`}
          />
          <ResultCard
            label="Healthy Weight Range"
            value={
              bmiResult.healthyWeightMin > 0
                ? `${formatWeight(bmiResult.healthyWeightMin)} – ${formatWeight(bmiResult.healthyWeightMax)}`
                : "—"
            }
            valueClass="text-base font-semibold text-gray-700"
            subtext="for your height (BMI 18.5 – 24.9)"
          />
        </div>

        {/* Gauge */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <BMIGauge gaugePercent={bmiResult.gaugePercent} bmi={bmiResult.bmi} />
        </div>

        {/* Asian BMI note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <span className="text-blue-600 text-lg shrink-0">&#9432;</span>
          <p className="text-sm text-blue-800">
            <strong>Note for people of Asian descent:</strong> Australian health guidelines suggest lower BMI
            thresholds for Asian populations — overweight starts at BMI&nbsp;23 (not 25) and obese at
            BMI&nbsp;27.5 (not 30). If this applies to you, consider these adjusted cut-offs when interpreting
            your result.
          </p>
        </div>
      </div>

      {/* ── Waist-to-Height Ratio ── */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Waist-to-Height Ratio</h2>
          <p className="text-sm text-gray-500 mt-1">
            Waist-to-height ratio is a stronger predictor of cardiovascular and metabolic risk than BMI alone,
            because it captures central (abdominal) fat distribution. A ratio below 0.5 is generally considered
            healthy for most adults.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Waist circumference ({isImperial ? "inches" : "cm"})
            </label>
          </div>
          {!isImperial ? (
            <input
              type="number"
              value={inputs.waistCm}
              onChange={(e) => set({ waistCm: Number(e.target.value) })}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={30}
              max={200}
              step={0.5}
              placeholder="cm"
            />
          ) : (
            <input
              type="number"
              value={inputs.waistIn}
              onChange={(e) => set({ waistIn: Number(e.target.value) })}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={12}
              max={79}
              step={0.5}
              placeholder="inches"
            />
          )}
        </div>

        {waistResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Waist-to-Height Ratio"
              value={formatRatio(waistResult.ratio)}
              valueClass={`text-2xl font-bold ${waistResult.categoryColor}`}
            />
            <ResultCard
              label="Risk Category"
              value={waistResult.category}
              valueClass={`text-xl font-bold ${waistResult.categoryColor}`}
              subtext="< 0.4 underweight risk · 0.4–0.5 healthy · 0.5–0.6 increased · > 0.6 high"
            />
          </div>
        )}
      </div>

      {/* ── Ideal Weight ── */}
      {idealWeightResult && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ideal Weight Estimates</h2>
            <p className="text-sm text-gray-500 mt-1">
              Multiple clinical formulas estimate ideal body weight from height and sex. These are reference
              ranges, not prescriptive targets.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Formula</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-600">Ideal Weight</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Devine Formula", value: idealWeightResult.devine, note: "Most widely cited" },
                  { name: "Robinson Formula", value: idealWeightResult.robinson, note: "" },
                  { name: "Miller Formula", value: idealWeightResult.miller, note: "" },
                  { name: "Hamwi Formula", value: idealWeightResult.hamwi, note: "" },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-800">
                      {row.name}
                      {row.note && (
                        <span className="ml-2 text-xs text-gray-400">({row.note})</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-blue-800">
                      {row.value > 0 ? formatWeight(row.value) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              You are currently{" "}
              <strong>
                {formatWeight(
                  Math.abs(getEffectiveWeightKg(inputs) - idealWeightResult.devine)
                )}
              </strong>{" "}
              {getEffectiveWeightKg(inputs) > idealWeightResult.devine ? "above" : getEffectiveWeightKg(inputs) < idealWeightResult.devine ? "below" : "at"}{" "}
              the Devine ideal weight for your height and sex.
            </p>
          </div>
        </div>
      )}

      {/* ── Health Disclaimer ── */}
      <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-xl p-5">
        <p className="text-sm text-amber-900 font-medium mb-1">Health disclaimer</p>
        <p className="text-sm text-amber-800">
          BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density,
          or body composition. Always consult your GP or healthcare provider for a comprehensive health
          assessment.{" "}
          <a
            href="https://www.heartfoundation.org.au/healthy-living/healthy-weight"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-amber-950"
          >
            Learn more at the Heart Foundation Australia
          </a>
          .
        </p>
      </div>

      {/* ── Related Calculators ── */}
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
            href="/calculators/energy-bill"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Energy Bill Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/tax-withholding-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Income Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
