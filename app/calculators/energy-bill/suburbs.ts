export interface EnergyBillSuburbData {
  slug: string;
  name: string;
  state: string;
  city: string;
  avgQuarterlyBill: number;
  avgDailyUsageKwh: number;
  avgRateCentsKwh: number;
  localRetailers: string[];
  description: string;
  localInsight: string;
}

export const SUBURBS: EnergyBillSuburbData[] = [
  // ─── Sydney (NSW) ─────────────────────────────────────────────────────────────
  {
    slug: "parramatta",
    name: "Parramatta",
    state: "NSW",
    city: "Sydney",
    avgQuarterlyBill: 480,
    avgDailyUsageKwh: 18,
    avgRateCentsKwh: 35,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Red Energy"],
    description:
      "Parramatta is Sydney's second CBD and one of NSW's most densely populated areas. The mix of apartments and older houses means electricity usage varies widely — high-rise units typically use 10-14 kWh/day while freestanding homes average 18-22 kWh/day.",
    localInsight:
      "Parramatta's growing apartment stock means many residents are on embedded networks. Check if your building has a bulk energy contract — you may still be able to switch to a cheaper market offer under NSW energy regulations.",
  },
  {
    slug: "blacktown",
    name: "Blacktown",
    state: "NSW",
    city: "Sydney",
    avgQuarterlyBill: 520,
    avgDailyUsageKwh: 20,
    avgRateCentsKwh: 35,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Momentum Energy"],
    description:
      "Blacktown in Western Sydney is one of Australia's largest suburbs by population. The predominantly freestanding housing stock and hot summers drive higher-than-average electricity consumption, particularly from air conditioning.",
    localInsight:
      "Western Sydney's heat island effect means Blacktown homes run air conditioning more than coastal suburbs. Time-of-use plans can save 15-20% if you pre-cool your home before the 2pm-8pm peak window.",
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    state: "NSW",
    city: "Sydney",
    avgQuarterlyBill: 500,
    avgDailyUsageKwh: 19,
    avgRateCentsKwh: 35,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Alinta Energy"],
    description:
      "Liverpool in South-West Sydney is a rapidly growing regional centre. New housing estates in the surrounding area feature modern insulation standards but also larger floor plans that increase cooling loads during summer.",
    localInsight:
      "Liverpool's new housing estates often come with solar-ready roofs. A 6.6kW solar system here generates around 26 kWh/day on average, potentially cutting quarterly bills by 40-50% with typical self-consumption rates.",
  },
  {
    slug: "penrith",
    name: "Penrith",
    state: "NSW",
    city: "Sydney",
    avgQuarterlyBill: 540,
    avgDailyUsageKwh: 21,
    avgRateCentsKwh: 35,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Red Energy"],
    description:
      "Penrith at the foot of the Blue Mountains records some of Sydney's highest summer temperatures, regularly exceeding 40°C. This drives significant air conditioning usage and higher electricity bills compared to coastal suburbs.",
    localInsight:
      "Penrith residents pay some of Sydney's highest cooling costs. Investing in a controlled load tariff for your hot water system (around 20c/kWh vs 35c/kWh standard) can save $150-$200 per year alone.",
  },
  {
    slug: "bondi",
    name: "Bondi",
    state: "NSW",
    city: "Sydney",
    avgQuarterlyBill: 420,
    avgDailyUsageKwh: 15,
    avgRateCentsKwh: 35,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Red Energy"],
    description:
      "Bondi is one of Sydney's most iconic coastal suburbs. The temperate ocean breezes mean less reliance on air conditioning compared to Western Sydney, but the high proportion of older apartments can mean poor insulation and draughty windows.",
    localInsight:
      "Bondi's coastal climate reduces cooling costs, but many older apartments lack ceiling insulation. Simple draught-proofing around windows and doors can cut winter heating bills by 10-15% for under $100.",
  },

  // ─── Melbourne (VIC) ──────────────────────────────────────────────────────────
  {
    slug: "dandenong",
    name: "Dandenong",
    state: "VIC",
    city: "Melbourne",
    avgQuarterlyBill: 440,
    avgDailyUsageKwh: 17,
    avgRateCentsKwh: 31,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Lumo Energy", "Dodo Power & Gas"],
    description:
      "Dandenong in Melbourne's south-east is a diverse suburb with a mix of older weatherboard homes and new developments. Victorian homes typically have higher heating costs due to colder winters but lower cooling costs than northern states.",
    localInsight:
      "Victoria's Victorian Default Offer (VDO) caps retailer prices, but many plans undercut it by 10-20%. Use the Victorian Energy Compare website (run by the state government) to find the cheapest plan for your Dandenong address.",
  },
  {
    slug: "frankston",
    name: "Frankston",
    state: "VIC",
    city: "Melbourne",
    avgQuarterlyBill: 460,
    avgDailyUsageKwh: 18,
    avgRateCentsKwh: 31,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Simply Energy", "Momentum Energy"],
    description:
      "Frankston at the gateway to the Mornington Peninsula has a mix of established homes and new estates. The coastal location moderates temperatures but winter heating remains the biggest energy cost for most households.",
    localInsight:
      "Frankston homes with gas heating should compare the total cost of gas + electricity vs switching to a reverse-cycle air conditioner on an all-electric plan. All-electric homes can access cheaper single-fuel energy deals in Victoria.",
  },
  {
    slug: "werribee",
    name: "Werribee",
    state: "VIC",
    city: "Melbourne",
    avgQuarterlyBill: 470,
    avgDailyUsageKwh: 18,
    avgRateCentsKwh: 31,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Powershop", "Tango Energy"],
    description:
      "Werribee is one of Melbourne's fastest-growing western suburbs, with large new housing estates featuring modern energy efficiency standards. Despite this, the flat western plains can experience temperature extremes.",
    localInsight:
      "Werribee's new builds often include 6-star energy ratings but large open-plan living areas. Zoning your heating and cooling to occupied rooms only can reduce energy use by 20-30% compared to heating the whole house.",
  },
  {
    slug: "ringwood",
    name: "Ringwood",
    state: "VIC",
    city: "Melbourne",
    avgQuarterlyBill: 450,
    avgDailyUsageKwh: 17,
    avgRateCentsKwh: 31,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Red Energy", "Lumo Energy"],
    description:
      "Ringwood in Melbourne's outer east is an established suburb with mature trees providing natural shade. The mix of 1960s-80s brick homes and newer townhouses creates varied energy profiles across the area.",
    localInsight:
      "Many Ringwood homes still have old halogen downlights consuming 50W each. Replacing 20 downlights with LEDs (5W each) saves around 900 kWh/year — about $280 at current Victorian rates.",
  },
  {
    slug: "carlton",
    name: "Carlton",
    state: "VIC",
    city: "Melbourne",
    avgQuarterlyBill: 380,
    avgDailyUsageKwh: 14,
    avgRateCentsKwh: 31,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Lumo Energy", "GloBird Energy"],
    description:
      "Carlton near Melbourne's CBD is characterised by Victorian-era terraces and university student apartments. The dense, inner-city housing stock typically has lower electricity usage due to smaller floor plans and proximity to public transport reducing EV charging needs.",
    localInsight:
      "Carlton's many renters can still switch energy providers without landlord permission. Comparing plans on Energy Made Easy or Victorian Energy Compare takes 5 minutes and can save $200-$400 per year.",
  },

  // ─── Brisbane (QLD) ───────────────────────────────────────────────────────────
  {
    slug: "logan",
    name: "Logan",
    state: "QLD",
    city: "Brisbane",
    avgQuarterlyBill: 420,
    avgDailyUsageKwh: 18,
    avgRateCentsKwh: 28,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Alinta Energy", "ReAmped Energy"],
    description:
      "Logan between Brisbane and the Gold Coast is a major population centre in South-East Queensland. The subtropical climate means air conditioning dominates energy bills in summer, while winter heating costs are minimal.",
    localInsight:
      "Queensland has no daily supply charge cap like some southern states. Logan residents should compare supply charges (80c-$1.20/day) alongside usage rates — a plan with lower kWh rates but higher supply charges can cost more overall.",
  },
  {
    slug: "ipswich",
    name: "Ipswich",
    state: "QLD",
    city: "Brisbane",
    avgQuarterlyBill: 440,
    avgDailyUsageKwh: 19,
    avgRateCentsKwh: 28,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Ergon Energy (regional)"],
    description:
      "Ipswich west of Brisbane sits in a valley that traps heat during summer, pushing temperatures above Brisbane CBD. The predominantly freestanding housing stock with larger block sizes means higher cooling loads.",
    localInsight:
      "Ipswich's inland location makes it one of SE Queensland's hottest suburbs. Solar panels perform exceptionally well here with around 27 kWh/day generation from a 6.6kW system — among the best returns in the Brisbane region.",
  },
  {
    slug: "caboolture",
    name: "Caboolture",
    state: "QLD",
    city: "Brisbane",
    avgQuarterlyBill: 430,
    avgDailyUsageKwh: 18,
    avgRateCentsKwh: 28,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Alinta Energy"],
    description:
      "Caboolture in the Moreton Bay region is a growing satellite centre north of Brisbane. The area's mix of established homes and new estates on larger blocks means significant variation in energy usage patterns.",
    localInsight:
      "Caboolture's newer estates often feature solar-ready roofs and battery-ready switchboards. Pairing solar with a home battery can push self-consumption above 80%, virtually eliminating grid electricity costs.",
  },
  {
    slug: "redcliffe",
    name: "Redcliffe",
    state: "QLD",
    city: "Brisbane",
    avgQuarterlyBill: 400,
    avgDailyUsageKwh: 16,
    avgRateCentsKwh: 28,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "ReAmped Energy"],
    description:
      "Redcliffe on the Moreton Bay peninsula benefits from coastal breezes that reduce the need for air conditioning compared to inland Brisbane suburbs. The seaside lifestyle translates to lower average electricity bills.",
    localInsight:
      "Redcliffe's sea breezes mean you can delay turning on the AC until temperatures hit 32°C+. Setting your thermostat to 25°C instead of 22°C saves roughly 30% on cooling costs — about $80-$120 per summer quarter.",
  },
  {
    slug: "gold-coast",
    name: "Gold Coast",
    state: "QLD",
    city: "Brisbane",
    avgQuarterlyBill: 410,
    avgDailyUsageKwh: 17,
    avgRateCentsKwh: 28,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Alinta Energy", "ReAmped Energy"],
    description:
      "The Gold Coast is Queensland's second-largest city with a coastal subtropical climate. High-rise apartments along the beachfront use less energy per dwelling than the sprawling hinterland suburbs with larger homes and pools.",
    localInsight:
      "Gold Coast pool owners can cut pump running costs by 40-50% by switching to a variable-speed pool pump and running it during off-peak hours. Pool pumps are often the second-largest energy user after air conditioning.",
  },

  // ─── Other Capitals ───────────────────────────────────────────────────────────
  {
    slug: "joondalup",
    name: "Joondalup",
    state: "WA",
    city: "Perth",
    avgQuarterlyBill: 460,
    avgDailyUsageKwh: 19,
    avgRateCentsKwh: 32,
    localRetailers: ["Synergy (default)", "Alinta Energy", "Kleenheat"],
    description:
      "Joondalup in Perth's northern corridor is a major suburban centre. Western Australia's hot, dry summers drive significant air conditioning use, while Synergy remains the dominant retailer in the WA market.",
    localInsight:
      "WA's deregulated market has fewer retailers than the east coast, but Alinta Energy and Kleenheat often undercut Synergy's standard rates by 5-10%. Perth's abundant sunshine also makes Joondalup ideal for rooftop solar.",
  },
  {
    slug: "salisbury",
    name: "Salisbury",
    state: "SA",
    city: "Adelaide",
    avgQuarterlyBill: 560,
    avgDailyUsageKwh: 18,
    avgRateCentsKwh: 42,
    localRetailers: ["AGL", "Origin Energy", "EnergyAustralia", "Alinta Energy", "Simply Energy"],
    description:
      "Salisbury in Adelaide's northern suburbs is part of South Australia — the state with Australia's highest electricity rates. However, SA also leads the nation in rooftop solar adoption, with over 40% of homes having panels.",
    localInsight:
      "South Australia's high rates make solar payback periods the shortest in Australia — often under 3 years. Salisbury's flat rooflines are ideal for north-facing panels. Check SA's Home Battery Scheme for subsidies on battery storage.",
  },
  {
    slug: "glenorchy",
    name: "Glenorchy",
    state: "TAS",
    city: "Hobart",
    avgQuarterlyBill: 480,
    avgDailyUsageKwh: 20,
    avgRateCentsKwh: 29,
    localRetailers: ["Aurora Energy (default)", "1st Energy", "Lumo Energy"],
    description:
      "Glenorchy is Hobart's largest northern suburb. Tasmania's cooler climate means heating dominates energy bills, especially in winter. Aurora Energy is the incumbent retailer, though competition has increased since market deregulation.",
    localInsight:
      "Tasmania's hydro-powered grid means some of Australia's lowest carbon electricity. Glenorchy residents switching from gas or wood heating to efficient heat pumps can cut heating costs by 50-70% while accessing cheaper TAS electricity rates.",
  },
  {
    slug: "belconnen",
    name: "Belconnen",
    state: "ACT",
    city: "Canberra",
    avgQuarterlyBill: 450,
    avgDailyUsageKwh: 18,
    avgRateCentsKwh: 29,
    localRetailers: ["ActewAGL (default)", "Origin Energy", "EnergyAustralia", "ReAmped Energy"],
    description:
      "Belconnen is one of Canberra's largest town centres. The ACT's continental climate brings cold winters and warm summers, but the territory's 100% renewable electricity target means all ACT grid power is matched by wind and solar contracts.",
    localInsight:
      "The ACT government offers interest-free loans of up to $15,000 for energy-efficient upgrades through the Sustainable Household Scheme. Belconnen residents can use this for solar panels, batteries, efficient heating, and insulation.",
  },
  {
    slug: "palmerston",
    name: "Palmerston",
    state: "NT",
    city: "Darwin",
    avgQuarterlyBill: 520,
    avgDailyUsageKwh: 24,
    avgRateCentsKwh: 27,
    localRetailers: ["Jacana Energy (default)", "Rimfire Energy"],
    description:
      "Palmerston is Darwin's largest satellite city. The tropical climate means air conditioning runs almost year-round, driving some of Australia's highest per-household electricity usage despite the NT's relatively low per-kWh rates.",
    localInsight:
      "Darwin's tropical climate means AC accounts for 50-70% of electricity bills. Palmerston residents can save significantly by setting AC to 25°C and using ceiling fans — each degree below 25°C adds roughly 10% to cooling costs.",
  },
];

export const SLUG_TO_SUBURB: Record<string, EnergyBillSuburbData> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);

export const SUBURBS_BY_CITY: Record<string, EnergyBillSuburbData[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.city]) acc[s.city] = [];
    acc[s.city].push(s);
    return acc;
  },
  {} as Record<string, EnergyBillSuburbData[]>
);

export const CITY_ORDER = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Hobart", "Canberra", "Darwin"];
