"use client";
import Link from "next/link";
import { useState, useMemo } from "react";

// --- 2024-25 ATO Tax Brackets (Australian Resident) ---

const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 },
];

const MEDICARE_LEVY = 0.02;

// --- Simplified Land Tax by State (2024-25) ---
// Land tax is based on unimproved land value, not purchase price.
// These are simplified single-threshold estimates for investment properties.

type AUState = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

const LAND_TAX_RULES: Record<AUState, { threshold: number; rate: number; baseAmount: number; label: string }> = {
  NSW: { threshold: 1075000, rate: 0.016, baseAmount: 100, label: "New South Wales" },
  VIC: { threshold: 50000, rate: 0.005, baseAmount: 0, label: "Victoria" },
  QLD: { threshold: 600000, rate: 0.01, baseAmount: 0, label: "Queensland" },
  SA:  { threshold: 583000, rate: 0.005, baseAmount: 0, label: "South Australia" },
  WA:  { threshold: 300000, rate: 0.0025, baseAmount: 0, label: "Western Australia" },
  TAS: { threshold: 87000, rate: 0.005, baseAmount: 50, label: "Tasmania" },
  NT:  { threshold: Infinity, rate: 0, baseAmount: 0, label: "Northern Territory" },
  ACT: { threshold: Infinity, rate: 0, baseAmount: 0, label: "ACT" },
};

function calculateLandTax(state: AUState, landValue: number): number {
  const rules = LAND_TAX_RULES[state];
  if (landValue <= rules.threshold) return 0;
  return Math.round(rules.baseAmount + (landValue - rules.threshold) * rules.rate);
}

function calculateTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min) {
      if (taxableIncome <= bracket.max) {
        tax = bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate;
        break;
      }
    }
  }

  tax += taxableIncome * MEDICARE_LEVY;
  return Math.round(tax);
}

function getMarginalRate(taxableIncome: number): number {
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate;
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

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// --- Component ---

export default function NegativeGearingCalculator() {
  // Property
  const [purchasePrice, setPurchasePrice] = useState(750000);
  const [constructionCost, setConstructionCost] = useState(400000);
  const [buildYear, setBuildYear] = useState(2010);
  const [state, setState] = useState<AUState>("NSW");
  const [landValue, setLandValue] = useState(450000);

  // Income
  const [salary, setSalary] = useState(120000);
  const [weeklyRent, setWeeklyRent] = useState(550);

  // Mortgage
  const [loanAmount, setLoanAmount] = useState(600000);
  const [interestRate, setInterestRate] = useState(6.2);

  // Expenses
  const [councilRates, setCouncilRates] = useState(2000);
  const [insurance, setInsurance] = useState(1500);
  const [maintenance, setMaintenance] = useState(2000);
  const [managementFees, setManagementFees] = useState(7);
  const [strataFees, setStrataFees] = useState(0);
  const [waterRates, setWaterRates] = useState(800);
  const [otherExpenses, setOtherExpenses] = useState(0);

  // Depreciation
  const [div40Assets, setDiv40Assets] = useState(25000);
  const [div40Rate, setDiv40Rate] = useState(20);

  // Projection
  const [capitalGrowth, setCapitalGrowth] = useState(4);
  const [rentGrowth, setRentGrowth] = useState(3);
  const [expenseGrowth, setExpenseGrowth] = useState(2.5);

  const results = useMemo(() => {
    const annualRent = weeklyRent * 52;
    const mortgageInterest = loanAmount * (interestRate / 100);
    const mgmtFeeDollar = Math.round(annualRent * (managementFees / 100));

    // Division 43: 2.5% of construction cost for buildings built after Sep 1987
    const div43Eligible = buildYear >= 1988;
    const div43Deduction = div43Eligible ? Math.round(constructionCost * 0.025) : 0;

    // Division 40: plant & equipment (diminishing value)
    const div40Deduction = Math.round(div40Assets * (div40Rate / 100));

    const totalDepreciation = div43Deduction + div40Deduction;

    const landTax = calculateLandTax(state, landValue);

    const totalCashExpenses =
      mortgageInterest +
      councilRates +
      insurance +
      maintenance +
      mgmtFeeDollar +
      strataFees +
      waterRates +
      landTax +
      otherExpenses;

    const totalPropertyExpenses = totalCashExpenses + totalDepreciation;

    // Rental loss (negative = loss)
    const rentalResult = annualRent - totalPropertyExpenses;

    // Tax without property
    const taxWithoutProperty = calculateTax(salary);

    // Taxable income with property
    const taxableIncomeWithProperty = Math.max(0, salary + rentalResult);
    const taxWithProperty = calculateTax(taxableIncomeWithProperty);

    // Tax saving
    const taxSaving = taxWithoutProperty - taxWithProperty;

    // Cash flow (depreciation is non-cash)
    const cashShortfall = totalCashExpenses - annualRent;
    const afterTaxCost = cashShortfall - taxSaving;

    // Marginal rate
    const marginalRate = getMarginalRate(salary);
    const effectiveMarginalWithMedicare = marginalRate + MEDICARE_LEVY;

    // --- 10-year projection ---
    const projection: {
      year: number;
      propertyValue: number;
      annualRent: number;
      totalExpenses: number;
      depreciation: number;
      rentalResult: number;
      taxSaving: number;
      cashCost: number;
      cumulativeCash: number;
      equity: number;
    }[] = [];

    let cumulativeCash = 0;
    let remainingDiv40 = div40Assets;

    for (let yr = 1; yr <= 10; yr++) {
      const expMult = Math.pow(1 + expenseGrowth / 100, yr - 1);

      const yrPropertyValue = Math.round(purchasePrice * Math.pow(1 + capitalGrowth / 100, yr));
      const yrAnnualRent = Math.round(annualRent * Math.pow(1 + rentGrowth / 100, yr - 1));

      // Expenses grow with inflation
      const yrCashExpenses = Math.round(totalCashExpenses * expMult);

      // Depreciation: Div 43 stays flat (2.5% of construction cost, max 40 years)
      const yrDiv43 = div43Eligible && yr <= 40 ? div43Deduction : 0;

      // Div 40 diminishing value: each year is rate% of remaining value
      const yrDiv40 = Math.round(remainingDiv40 * (div40Rate / 100));
      remainingDiv40 = Math.max(0, remainingDiv40 - yrDiv40);

      const yrDepreciation = yrDiv43 + yrDiv40;
      const yrTotalExpenses = yrCashExpenses + yrDepreciation;
      const yrRentalResult = yrAnnualRent - yrTotalExpenses;

      const yrTaxableWithProperty = Math.max(0, salary + yrRentalResult);
      const yrTaxSaving = calculateTax(salary) - calculateTax(yrTaxableWithProperty);

      const yrCashCost = (yrCashExpenses - yrAnnualRent) - yrTaxSaving;
      cumulativeCash += yrCashCost;

      const yrEquity = yrPropertyValue - loanAmount;

      projection.push({
        year: yr,
        propertyValue: yrPropertyValue,
        annualRent: yrAnnualRent,
        totalExpenses: yrTotalExpenses,
        depreciation: yrDepreciation,
        rentalResult: yrRentalResult,
        taxSaving: yrTaxSaving,
        cashCost: yrCashCost,
        cumulativeCash,
        equity: yrEquity,
      });
    }

    // Break-even capital growth: annual growth rate needed to cover after-tax cost
    const breakEvenGrowth = purchasePrice > 0 ? (afterTaxCost / purchasePrice) * 100 : 0;

    return {
      annualRent,
      mortgageInterest,
      mgmtFeeDollar,
      landTax,
      div43Deduction,
      div43Eligible,
      div40Deduction,
      totalDepreciation,
      totalCashExpenses,
      totalPropertyExpenses,
      rentalResult,
      taxWithoutProperty,
      taxableIncomeWithProperty,
      taxWithProperty,
      taxSaving,
      cashShortfall,
      afterTaxCost,
      marginalRate,
      effectiveMarginalWithMedicare,
      breakEvenGrowth,
      projection,
    };
  }, [
    purchasePrice, constructionCost, buildYear, salary, weeklyRent,
    loanAmount, interestRate, councilRates, insurance, maintenance,
    managementFees, strataFees, waterRates, otherExpenses,
    div40Assets, div40Rate, capitalGrowth, rentGrowth, expenseGrowth,
    state, landValue,
  ]);

  return (
    <div className="space-y-8">
      {/* Property Details */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
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
          <div>
            <label htmlFor="constructionCost" className="block text-sm font-medium text-gray-700 mb-1">
              Construction Cost (for Div 43)
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
          </div>
          <div>
            <label htmlFor="buildYear" className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <input
              id="buildYear"
              type="number"
              min={1900}
              max={2026}
              step={1}
              value={buildYear}
              onChange={(e) => setBuildYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {!results.div43Eligible && (
              <p className="text-xs text-amber-600 mt-1">
                Div 43 not available for buildings constructed before 1988
              </p>
            )}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State (for land tax)
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value as AUState)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {(Object.keys(LAND_TAX_RULES) as AUState[]).map((s) => (
                <option key={s} value={s}>{LAND_TAX_RULES[s].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="landValue" className="block text-sm font-medium text-gray-700 mb-1">
              Unimproved Land Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="landValue"
                type="number"
                min={0}
                step={10000}
                value={landValue}
                onChange={(e) => setLandValue(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {results.landTax > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Est. land tax: {formatCurrency(results.landTax)}/year
              </p>
            )}
            {state === "NT" && (
              <p className="text-xs text-green-600 mt-1">NT has no land tax</p>
            )}
            {state === "ACT" && (
              <p className="text-xs text-gray-500 mt-1">ACT land tax is included in rates</p>
            )}
          </div>
        </div>
      </div>

      {/* Income & Loan */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Income &amp; Loan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Taxable Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="salary"
                type="number"
                min={0}
                step={5000}
                value={salary}
                onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="weeklyRent" className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Rent
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="weeklyRent"
                type="number"
                min={0}
                step={10}
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              = {formatCurrency(weeklyRent * 52)}/year
            </p>
          </div>
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="loanAmount"
                type="number"
                min={0}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              LVR: {purchasePrice > 0 ? formatPercent((loanAmount / purchasePrice) * 100) : "0%"}
            </p>
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (p.a.)
            </label>
            <div className="relative">
              <input
                id="interestRate"
                type="number"
                min={0}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                className="w-full pl-3 pr-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Interest: {formatCurrency(Math.round(loanAmount * interestRate / 100))}/year
            </p>
          </div>
        </div>
      </div>

      {/* Property Expenses */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Annual Property Expenses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="councilRates" className="block text-sm font-medium text-gray-700 mb-1">
              Council Rates
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="councilRates"
                type="number"
                min={0}
                step={100}
                value={councilRates}
                onChange={(e) => setCouncilRates(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
              Landlord Insurance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="insurance"
                type="number"
                min={0}
                step={100}
                value={insurance}
                onChange={(e) => setInsurance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="managementFees" className="block text-sm font-medium text-gray-700 mb-1">
              Management Fee (% of rent)
            </label>
            <div className="relative">
              <input
                id="managementFees"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={managementFees}
                onChange={(e) => setManagementFees(Math.max(0, Number(e.target.value)))}
                className="w-full pl-3 pr-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              = {formatCurrency(results.mgmtFeeDollar)}/year
            </p>
          </div>
          <div>
            <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance / Repairs
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="maintenance"
                type="number"
                min={0}
                step={100}
                value={maintenance}
                onChange={(e) => setMaintenance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="strataFees" className="block text-sm font-medium text-gray-700 mb-1">
              Strata / Body Corporate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="strataFees"
                type="number"
                min={0}
                step={100}
                value={strataFees}
                onChange={(e) => setStrataFees(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="waterRates" className="block text-sm font-medium text-gray-700 mb-1">
              Water Rates
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="waterRates"
                type="number"
                min={0}
                step={100}
                value={waterRates}
                onChange={(e) => setWaterRates(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="otherExpenses" className="block text-sm font-medium text-gray-700 mb-1">
              Other Deductible Expenses
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="otherExpenses"
                type="number"
                min={0}
                step={100}
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Depreciation Schedule */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Depreciation Schedule
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Division 43 — Capital Works</h3>
            <p className="text-xs text-gray-500 mb-3">
              2.5% of construction cost per year for buildings built after Sep 1987
            </p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Construction cost:</span>
              <span className="font-medium">{formatCurrency(constructionCost)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Annual deduction:</span>
              <span className="font-semibold text-blue-700">
                {results.div43Eligible ? formatCurrency(results.div43Deduction) : "N/A"}
              </span>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Division 40 — Plant &amp; Equipment</h3>
            <p className="text-xs text-gray-500 mb-3">
              Fixtures, fittings, appliances (diminishing value method)
            </p>
            <div>
              <label htmlFor="div40Assets" className="block text-xs font-medium text-gray-600 mb-1">
                Total Plant &amp; Equipment Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  id="div40Assets"
                  type="number"
                  min={0}
                  step={1000}
                  value={div40Assets}
                  onChange={(e) => setDiv40Assets(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="div40Rate" className="block text-xs font-medium text-gray-600 mb-1">
                Average Depreciation Rate
              </label>
              <div className="relative">
                <input
                  id="div40Rate"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={div40Rate}
                  onChange={(e) => setDiv40Rate(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-3 pr-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-600">Year 1 deduction:</span>
              <span className="font-semibold text-blue-700">{formatCurrency(results.div40Deduction)}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-3">
          <span className="text-sm font-medium text-gray-700">Total Annual Depreciation</span>
          <span className="text-lg font-bold text-blue-800">{formatCurrency(results.totalDepreciation)}</span>
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Net Rental {results.rentalResult < 0 ? "Loss" : "Income"}</p>
          <p className={`text-2xl font-bold ${results.rentalResult < 0 ? "text-red-600" : "text-green-600"}`}>
            {formatCurrency(results.rentalResult)}
          </p>
        </div>
        <div className="border border-green-200 rounded-xl p-5 bg-green-50 text-center">
          <p className="text-sm text-green-700 mb-1">Annual Tax Saving</p>
          <p className="text-2xl font-bold text-green-800">
            {formatCurrency(results.taxSaving)}
          </p>
        </div>
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-blue-700 mb-1">After-Tax Annual Cost</p>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(results.afterTaxCost)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {formatCurrency(Math.round(results.afterTaxCost / 52))}/week
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Marginal Rate (incl. Medicare)</p>
          <p className="text-2xl font-bold text-gray-900">
            {(results.effectiveMarginalWithMedicare * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {(results.marginalRate * 100).toFixed(0)}% + 2% Medicare
          </p>
        </div>
      </div>

      {/* Break-even Capital Growth */}
      <div className="border border-amber-200 rounded-xl p-5 bg-amber-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-amber-800">Break-even Capital Growth Needed</p>
            <p className="text-xs text-amber-700 mt-1">
              The annual property growth rate required to cover your after-tax holding cost
            </p>
          </div>
          <p className="text-3xl font-bold text-amber-900">
            {formatPercent(results.breakEvenGrowth)}
            <span className="text-sm font-normal text-amber-700 ml-1">p.a.</span>
          </p>
        </div>
      </div>

      {/* Income vs Expenses Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Income vs Expenses Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between font-medium text-green-700 border-b border-gray-100 pb-2">
            <span>Rental Income ({formatCurrency(weeklyRent)}/wk x 52)</span>
            <span>{formatCurrency(results.annualRent)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Mortgage Interest ({formatPercent(interestRate)} on {formatCurrency(loanAmount)})</span>
            <span>{formatCurrency(Math.round(results.mortgageInterest))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Council Rates</span>
            <span>{formatCurrency(councilRates)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Insurance</span>
            <span>{formatCurrency(insurance)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Maintenance / Repairs</span>
            <span>{formatCurrency(maintenance)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Management Fees ({managementFees}%)</span>
            <span>{formatCurrency(results.mgmtFeeDollar)}</span>
          </div>
          {strataFees > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Strata Fees</span>
              <span>{formatCurrency(strataFees)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Water Rates</span>
            <span>{formatCurrency(waterRates)}</span>
          </div>
          {results.landTax > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Land Tax ({state})</span>
              <span>{formatCurrency(results.landTax)}</span>
            </div>
          )}
          {otherExpenses > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Other Expenses</span>
              <span>{formatCurrency(otherExpenses)}</span>
            </div>
          )}
          <div className="flex justify-between text-blue-700 border-t border-gray-100 pt-2">
            <span>Depreciation (Div 43 + Div 40)</span>
            <span>{formatCurrency(results.totalDepreciation)}</span>
          </div>

          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total Property Expenses</span>
            <span className="text-gray-900">{formatCurrency(results.totalPropertyExpenses)}</span>
          </div>
          <div className={`flex justify-between font-semibold ${results.rentalResult < 0 ? "text-red-700" : "text-green-700"}`}>
            <span>Net Rental {results.rentalResult < 0 ? "Loss" : "Income"}</span>
            <span>{formatCurrency(results.rentalResult)}</span>
          </div>
        </div>
      </div>

      {/* Tax Bracket Comparison */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Tax Comparison — Before &amp; After Property</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700"></th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Without Property</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">With Property</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">Taxable Income</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(salary)}</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(results.taxableIncomeWithProperty)}</td>
                <td className="text-right py-2 pl-4 font-medium text-red-600">
                  {formatCurrency(results.rentalResult)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">Income Tax + Medicare</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(results.taxWithoutProperty)}</td>
                <td className="text-right py-2 px-4 font-medium">{formatCurrency(results.taxWithProperty)}</td>
                <td className="text-right py-2 pl-4 font-medium text-green-600">
                  -{formatCurrency(results.taxSaving)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Annual Cash Flow Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Cash expenses (excluding depreciation)</span>
            <span className="font-medium">{formatCurrency(Math.round(results.totalCashExpenses))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Rental income received</span>
            <span className="font-medium">{formatCurrency(results.annualRent)}</span>
          </div>
          <div className="flex justify-between text-gray-600 border-t border-gray-100 pt-2">
            <span>Cash out of pocket (before tax benefit)</span>
            <span className="font-medium text-red-600">{formatCurrency(Math.round(results.cashShortfall))}</span>
          </div>
          <div className="flex justify-between text-green-700">
            <span>Tax saving from negative gearing</span>
            <span className="font-medium">-{formatCurrency(results.taxSaving)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
            <span>After-tax annual cost</span>
            <span className="text-blue-800">{formatCurrency(Math.round(results.afterTaxCost))}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs">
            <span>Per week</span>
            <span>{formatCurrency(Math.round(results.afterTaxCost / 52))}/wk</span>
          </div>
        </div>
      </div>

      {/* 10-Year Projection */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">10-Year Projection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="capitalGrowth" className="block text-xs font-medium text-gray-600 mb-1">
              Capital Growth (% p.a.)
            </label>
            <div className="relative">
              <input
                id="capitalGrowth"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={capitalGrowth}
                onChange={(e) => setCapitalGrowth(Number(e.target.value))}
                className="w-full pl-3 pr-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
          <div>
            <label htmlFor="rentGrowth" className="block text-xs font-medium text-gray-600 mb-1">
              Rent Growth (% p.a.)
            </label>
            <div className="relative">
              <input
                id="rentGrowth"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={rentGrowth}
                onChange={(e) => setRentGrowth(Number(e.target.value))}
                className="w-full pl-3 pr-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
          <div>
            <label htmlFor="expenseGrowth" className="block text-xs font-medium text-gray-600 mb-1">
              Expense Growth (% p.a.)
            </label>
            <div className="relative">
              <input
                id="expenseGrowth"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={expenseGrowth}
                onChange={(e) => setExpenseGrowth(Number(e.target.value))}
                className="w-full pl-3 pr-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-2 font-medium text-gray-700">Yr</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Property Value</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Rent</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Net Result</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Tax Saving</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Cash Cost</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Cumul. Cost</th>
                <th className="text-right py-2 pl-2 font-medium text-gray-700">Equity</th>
              </tr>
            </thead>
            <tbody>
              {results.projection.map((row) => (
                <tr key={row.year} className="border-b border-gray-100">
                  <td className="py-2 pr-2 text-gray-600">{row.year}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(row.propertyValue)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(row.annualRent)}</td>
                  <td className={`text-right py-2 px-2 ${row.rentalResult < 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(row.rentalResult)}
                  </td>
                  <td className="text-right py-2 px-2 text-green-600">{formatCurrency(row.taxSaving)}</td>
                  <td className={`text-right py-2 px-2 ${row.cashCost > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(Math.round(row.cashCost))}
                  </td>
                  <td className="text-right py-2 px-2 text-red-600">{formatCurrency(Math.round(row.cumulativeCash))}</td>
                  <td className="text-right py-2 pl-2 font-medium">{formatCurrency(row.equity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Projection assumes interest-only loan, constant salary, and no change to tax brackets.
          Equity = property value minus loan balance (interest-only, no principal reduction).
        </p>
      </div>

      {/* How Negative Gearing Works */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How Negative Gearing Works in Australia</h2>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>Negative gearing</strong> occurs when the total costs of owning an investment property
            — including mortgage interest, property expenses, and depreciation — exceed the rental income it
            earns. The resulting net rental loss can be deducted from your other taxable income (such as your
            salary), reducing your overall tax liability.
          </p>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Key Rules</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>There is <strong>no cap</strong> on negative gearing deductions in Australia</li>
              <li>Losses are offset against all assessable income in the same financial year</li>
              <li>The property must be <strong>genuinely available for rent</strong> at market rates</li>
              <li>Only the <strong>interest portion</strong> of loan repayments is deductible — not principal</li>
              <li>Depreciation is a <strong>non-cash deduction</strong> — it increases tax savings without requiring actual spending</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Depreciation: Division 43 vs Division 40</h3>
            <p className="text-gray-600">
              <strong>Division 43 (Capital Works)</strong> allows a deduction of 2.5% per year on the
              original construction cost for residential properties built after 15 September 1987. This covers
              the building structure itself and runs for up to 40 years.
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Division 40 (Plant &amp; Equipment)</strong> covers removable assets like ovens,
              dishwashers, carpets, blinds, and air conditioners. Each asset has its own effective life set by
              the ATO, and you can claim using either the diminishing value or prime cost method. For properties
              where contracts were exchanged after 9 May 2017, Division 40 claims on previously used assets are
              restricted for subsequent owners — only new plant and equipment qualifies.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Who Benefits Most?</h3>
            <p className="text-gray-600">
              Negative gearing provides the greatest tax benefit to investors in the highest marginal tax
              brackets (37% or 45% + Medicare levy). A $10,000 rental loss saves $4,700 for someone in the 45%
              bracket but only $1,800 for someone in the 16% bracket. The strategy relies on long-term capital
              growth to generate an overall return, as the annual holding cost is real even after the tax benefit.
            </p>
          </div>
        </div>
      </div>

      {/* Tax Brackets Reference */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">2024-25 ATO Tax Brackets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Taxable Income</th>
                <th className="text-right py-2 px-4 font-medium text-gray-700">Rate</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Tax On This Bracket</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$0 - $18,200</td>
                <td className="text-right py-2 px-4">Nil</td>
                <td className="text-right py-2 pl-4 text-gray-500">$0</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$18,201 - $45,000</td>
                <td className="text-right py-2 px-4">16%</td>
                <td className="text-right py-2 pl-4 text-gray-500">$4,288</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$45,001 - $135,000</td>
                <td className="text-right py-2 px-4">30%</td>
                <td className="text-right py-2 pl-4 text-gray-500">$27,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-600">$135,001 - $190,000</td>
                <td className="text-right py-2 px-4">37%</td>
                <td className="text-right py-2 pl-4 text-gray-500">$20,350</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-gray-600">$190,001+</td>
                <td className="text-right py-2 px-4">45%</td>
                <td className="text-right py-2 pl-4 text-gray-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Plus Medicare levy of 2% on total taxable income. Your marginal rate including Medicare is{" "}
          {(results.effectiveMarginalWithMedicare * 100).toFixed(0)}%.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Disclaimer:</span> This calculator provides estimates only
          based on the 2024-25 ATO tax rates. It does not account for the Medicare Levy Surcharge,
          private health insurance rebate adjustments, HELP debt repayments, capital gains tax on sale,
          or other offsets. Depreciation estimates are simplified — obtain a quantity surveyor report for
          accurate depreciation schedules. Consult a registered tax agent for specific tax advice about
          your investment property.
        </p>
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
            href="/calculators/capital-gains-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Capital Gains Tax Calculator</span>
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
            href="/calculators/depreciation"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Depreciation Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
