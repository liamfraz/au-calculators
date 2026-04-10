export type StateCode = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

export const STATE_NAMES: Record<StateCode, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

export const ALL_STATES: StateCode[] = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

export interface ConcessionResult {
  fullDuty: number;
  concessionAmount: number;
  amountPayable: number;
  isFullyExempt: boolean;
  isPartiallyExempt: boolean;
  isNotEligible: boolean;
  eligibilityNote: string;
}

// --- Base Stamp Duty Calculations (Primary Residence / Owner-Occupier Rates) ---
// Copied from stamp-duty calculator for consistency.
// Rates are 2025-26 FY rates from official state revenue offices.

function calcNSW(value: number): number {
  if (value <= 0) return 0;
  if (value <= 17000) return value * 0.0125;
  if (value <= 37000) return 212 + (value - 17000) * 0.015;
  if (value <= 99000) return 512 + (value - 37000) * 0.0175;
  if (value <= 372000) return 1597 + (value - 99000) * 0.035;
  if (value <= 1240000) return 11152 + (value - 372000) * 0.045;
  if (value <= 3721000) return 50212 + (value - 1240000) * 0.055;
  return 186667 + (value - 3721000) * 0.07;
}

function calcVICPrimary(value: number): number {
  if (value <= 0) return 0;
  if (value > 550000) {
    // General rate applies above threshold
    if (value <= 25000) return value * 0.014;
    if (value <= 130000) return 350 + (value - 25000) * 0.024;
    if (value <= 960000) return 2870 + (value - 130000) * 0.06;
    if (value <= 2000000) return value * 0.055;
    return 110000 + (value - 2000000) * 0.065;
  }
  if (value <= 25000) return value * 0.014;
  if (value <= 130000) return 350 + (value - 25000) * 0.024;
  if (value <= 440000) return 2870 + (value - 130000) * 0.05;
  return 18370 + (value - 440000) * 0.06;
}

function calcQLDPrimary(value: number): number {
  if (value <= 0) return 0;
  if (value <= 350000) return value * 0.01;
  if (value <= 540000) return 3500 + (value - 350000) * 0.035;
  if (value <= 1000000) return 10150 + (value - 540000) * 0.045;
  return 30850 + (value - 1000000) * 0.0575;
}

function calcSA(value: number): number {
  if (value <= 0) return 0;
  if (value <= 12000) return value * 0.01;
  if (value <= 30000) return 120 + (value - 12000) * 0.02;
  if (value <= 50000) return 480 + (value - 30000) * 0.03;
  if (value <= 100000) return 1080 + (value - 50000) * 0.035;
  if (value <= 200000) return 2830 + (value - 100000) * 0.04;
  if (value <= 250000) return 6830 + (value - 200000) * 0.0425;
  if (value <= 300000) return 8955 + (value - 250000) * 0.0475;
  if (value <= 500000) return 11330 + (value - 300000) * 0.05;
  return 21330 + (value - 500000) * 0.055;
}

function calcWA(value: number): number {
  if (value <= 0) return 0;
  if (value <= 120000) return value * 0.019;
  if (value <= 150000) return 2280 + (value - 120000) * 0.0285;
  if (value <= 360000) return 3135 + (value - 150000) * 0.038;
  if (value <= 725000) return 11115 + (value - 360000) * 0.0475;
  return 28453 + (value - 725000) * 0.0515;
}

function calcTAS(value: number): number {
  if (value <= 3000) return 50;
  if (value <= 25000) return 50 + (value - 3000) * 0.0175;
  if (value <= 75000) return 435 + (value - 25000) * 0.0225;
  if (value <= 200000) return 1560 + (value - 75000) * 0.035;
  if (value <= 375000) return 5935 + (value - 200000) * 0.04;
  if (value <= 725000) return 12935 + (value - 375000) * 0.0425;
  return 27810 + (value - 725000) * 0.045;
}

function calcNT(value: number): number {
  if (value <= 0) return 0;
  if (value <= 525000) {
    const v = value / 1000;
    return 0.06571441 * v * v + 15 * v;
  }
  if (value <= 3000000) return value * 0.0495;
  if (value <= 5000000) return value * 0.0575;
  return value * 0.0595;
}

function calcACTOwner(value: number): number {
  if (value <= 0) return 0;
  if (value <= 260000) return value * 0.0028;
  if (value <= 300000) return 728 + (value - 260000) * 0.0049;
  if (value <= 500000) return 924 + (value - 300000) * 0.034;
  if (value <= 750000) return 7724 + (value - 500000) * 0.0415;
  if (value <= 1000000) return 18099 + (value - 750000) * 0.0432;
  if (value <= 1455000) return 28899 + (value - 1000000) * 0.0454;
  return value * 0.0454 - 35238;
}

export function getBaseDuty(state: StateCode, value: number): number {
  switch (state) {
    case "NSW": return calcNSW(value);
    case "VIC": return calcVICPrimary(value);
    case "QLD": return calcQLDPrimary(value);
    case "SA": return calcSA(value);
    case "WA": return calcWA(value);
    case "TAS": return calcTAS(value);
    case "NT": return calcNT(value);
    case "ACT": return calcACTOwner(value);
  }
}

// --- FHB Concession Calculation by State ---
// 2025-26 rules per state. Concession is the reduction from full duty.

function getFHBConcessionNSW(value: number, baseDuty: number): number {
  // Full exemption <= $800K, partial $800K-$1M, no concession > $1M
  if (value <= 800000) return baseDuty;
  if (value <= 1000000) return baseDuty * (1000000 - value) / 200000;
  return 0;
}

function getFHBConcessionVIC(value: number, baseDuty: number): number {
  // Full exemption <= $600K, partial $600K-$750K, no concession > $750K
  if (value <= 600000) return baseDuty;
  if (value <= 750000) return baseDuty * (750000 - value) / 150000;
  return 0;
}

function getFHBConcessionQLD(value: number, baseDuty: number): number {
  // Full concession (duty = $0) <= $700K, no concession > $700K
  if (value <= 700000) return baseDuty;
  return 0;
}

function getFHBConcessionSA(baseDuty: number, propertyIsNew: boolean): number {
  // Full exemption for new/off-the-plan homes (no cap). No concession for established homes.
  return propertyIsNew ? baseDuty : 0;
}

function getFHBConcessionWA(value: number, baseDuty: number): number {
  // Full exemption <= $430K, partial $430K-$530K, no concession > $530K
  if (value <= 430000) return baseDuty;
  if (value <= 530000) return baseDuty * (530000 - value) / 100000;
  return 0;
}

function getFHBConcessionTAS(value: number, baseDuty: number): number {
  // 50% duty reduction for eligible FHBs on properties <= $750K, no concession > $750K
  if (value <= 750000) return baseDuty * 0.5;
  return 0;
}

function getFHBConcessionNT(): number {
  // No stamp duty concession for FHBs
  return 0;
}

function getFHBConcessionACT(value: number, baseDuty: number): number {
  // Full duty concession <= $1,017,000, no concession above
  if (value <= 1017000) return baseDuty;
  return 0;
}

export function calculateFHBConcession(
  state: StateCode,
  value: number,
  propertyIsNew: boolean = true,
): ConcessionResult {
  const fullDuty = Math.round(getBaseDuty(state, value));

  let concessionAmount = 0;
  let eligibilityNote = "";

  switch (state) {
    case "NSW":
      concessionAmount = getFHBConcessionNSW(value, fullDuty);
      if (value <= 800000) {
        eligibilityNote = "Full stamp duty exemption for properties up to $800,000. Reduced exemption up to $1,000,000. No concession above $1,000,000.";
      } else if (value <= 1000000) {
        const remaining = 1000000 - value;
        const percentage = ((remaining / 200000) * 100).toFixed(1);
        eligibilityNote = `Partial stamp duty concession (${percentage}%). Full exemption applies to properties up to $800,000.`;
      } else {
        eligibilityNote = "No stamp duty concession. Full exemption applies to properties up to $800,000.";
      }
      break;

    case "VIC":
      concessionAmount = getFHBConcessionVIC(value, fullDuty);
      if (value <= 600000) {
        eligibilityNote = "Full stamp duty exemption for properties up to $600,000. Reduced exemption up to $750,000. No concession above $750,000.";
      } else if (value <= 750000) {
        const remaining = 750000 - value;
        const percentage = ((remaining / 150000) * 100).toFixed(1);
        eligibilityNote = `Partial stamp duty concession (${percentage}%). Full exemption applies to properties up to $600,000.`;
      } else {
        eligibilityNote = "No stamp duty concession. Full exemption applies to properties up to $600,000.";
      }
      break;

    case "QLD":
      concessionAmount = getFHBConcessionQLD(value, fullDuty);
      if (value <= 700000) {
        eligibilityNote = "Full stamp duty exemption for properties up to $700,000. No concession above $700,000.";
      } else {
        eligibilityNote = "No stamp duty concession. Full exemption applies to properties up to $700,000.";
      }
      break;

    case "SA":
      concessionAmount = getFHBConcessionSA(fullDuty, propertyIsNew);
      if (propertyIsNew) {
        eligibilityNote = "Full stamp duty exemption for new and off-the-plan homes (no price cap).";
      } else {
        eligibilityNote = "No stamp duty concession for established homes. Full exemption applies to new and off-the-plan homes only.";
      }
      break;

    case "WA":
      concessionAmount = getFHBConcessionWA(value, fullDuty);
      if (value <= 430000) {
        eligibilityNote = "Full stamp duty exemption for properties up to $430,000. Reduced exemption up to $530,000. No concession above $530,000.";
      } else if (value <= 530000) {
        const remaining = 530000 - value;
        const percentage = ((remaining / 100000) * 100).toFixed(1);
        eligibilityNote = `Partial stamp duty concession (${percentage}%). Full exemption applies to properties up to $430,000.`;
      } else {
        eligibilityNote = "No stamp duty concession. Full exemption applies to properties up to $430,000.";
      }
      break;

    case "TAS":
      concessionAmount = getFHBConcessionTAS(value, fullDuty);
      if (value <= 750000) {
        eligibilityNote = "50% stamp duty reduction for eligible first home buyers on properties up to $750,000. No concession above $750,000.";
      } else {
        eligibilityNote = "No stamp duty concession. 50% reduction applies to properties up to $750,000.";
      }
      break;

    case "NT":
      concessionAmount = getFHBConcessionNT();
      eligibilityNote = "No stamp duty concession for first home buyers. The NT offers a $50,000 HomeGrown First Home Owner Grant instead.";
      break;

    case "ACT":
      concessionAmount = getFHBConcessionACT(value, fullDuty);
      if (value <= 1017000) {
        eligibilityNote = "Full stamp duty concession for eligible first home buyers on properties up to $1,017,000. No concession above $1,017,000.";
      } else {
        eligibilityNote = "No stamp duty concession. Full concession applies to properties up to $1,017,000.";
      }
      break;
  }

  concessionAmount = Math.round(concessionAmount);
  const amountPayable = Math.max(0, fullDuty - concessionAmount);

  const isFullyExempt = concessionAmount === fullDuty && fullDuty > 0;
  const isPartiallyExempt = concessionAmount > 0 && concessionAmount < fullDuty;
  const isNotEligible = concessionAmount === 0 && fullDuty > 0;

  return {
    fullDuty,
    concessionAmount,
    amountPayable,
    isFullyExempt,
    isPartiallyExempt,
    isNotEligible,
    eligibilityNote,
  };
}

// --- State FHB Thresholds and Sources ---

export const STATE_FHB_THRESHOLDS: Record<StateCode, string> = {
  NSW: "$800,000 (full) / $1,000,000 (partial)",
  VIC: "$600,000 (full) / $750,000 (partial)",
  QLD: "$700,000 (full)",
  SA: "Unlimited (new homes only)",
  WA: "$430,000 (full) / $530,000 (partial)",
  TAS: "$750,000 (50% reduction)",
  NT: "N/A — grants instead",
  ACT: "$1,017,000 (full)",
};

export const STATE_FHB_SOURCES: Record<StateCode, string> = {
  NSW: "Revenue NSW",
  VIC: "State Revenue Office Victoria",
  QLD: "Office of State Revenue Queensland",
  SA: "South Australian Taxation Office",
  WA: "Department of Finance, WA",
  TAS: "Tasmanian Revenue Office",
  NT: "NT Revenue Office",
  ACT: "ACT Revenue Office",
};
