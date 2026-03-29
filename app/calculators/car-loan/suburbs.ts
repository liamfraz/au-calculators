export interface CarLoanSuburbData {
  slug: string;
  name: string;
  state: string;
  city: string;
  avgCarPrice: number;
  popularDealers: string[];
  description: string;
  localInsight: string;
}

export const SUBURBS: CarLoanSuburbData[] = [
  // ─── Sydney (NSW) ─────────────────────────────────────────────────────────────
  {
    slug: "parramatta",
    name: "Parramatta",
    state: "NSW",
    city: "Sydney",
    avgCarPrice: 42_000,
    popularDealers: ["Parramatta Auto Centre", "Western Sydney car yards on Church Street"],
    description:
      "Parramatta is Sydney's second CBD and a major hub for car dealerships in Western Sydney. Church Street and the surrounding auto precinct offer a wide range of new and used car dealers.",
    localInsight:
      "Parramatta's large dealer network means strong competition on finance rates. Many dealers offer in-house finance, but comparing with bank pre-approval typically saves 1–2% on interest.",
  },
  {
    slug: "penrith",
    name: "Penrith",
    state: "NSW",
    city: "Sydney",
    avgCarPrice: 38_000,
    popularDealers: ["Penrith auto dealers on the Great Western Highway", "Western Sydney motor groups"],
    description:
      "Penrith at the foot of the Blue Mountains is a major car buying centre in outer Western Sydney. The Great Western Highway corridor hosts numerous dealerships and used car lots.",
    localInsight:
      "Penrith buyers often need reliable vehicles for longer commutes. Secured car loans with lower rates are popular here — typical rates run 1–3% below unsecured loans.",
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    state: "NSW",
    city: "Sydney",
    avgCarPrice: 36_000,
    popularDealers: ["Liverpool auto dealers on Hume Highway", "South-West Sydney motor groups"],
    description:
      "Liverpool in South-West Sydney is a growing regional centre with a strong car sales market along the Hume Highway corridor, offering everything from budget used cars to prestige brands.",
    localInsight:
      "Liverpool's proximity to the Western Sydney Aerotropolis is driving population growth and car demand. First-time buyers can often negotiate better rates by getting pre-approved before visiting dealers.",
  },
  {
    slug: "blacktown",
    name: "Blacktown",
    state: "NSW",
    city: "Sydney",
    avgCarPrice: 35_000,
    popularDealers: ["Blacktown auto precinct", "Richmond Road car dealers"],
    description:
      "Blacktown is one of Sydney's largest suburbs with a thriving used and new car market. The area's auto precincts along Richmond Road and Main Street serve a large catchment area.",
    localInsight:
      "Blacktown's diverse market means a wide range of price points. Budget-conscious buyers should compare credit union rates alongside big-4 bank offers — credit unions often beat them by 0.5–1%.",
  },
  {
    slug: "chatswood",
    name: "Chatswood",
    state: "NSW",
    city: "Sydney",
    avgCarPrice: 55_000,
    popularDealers: ["North Shore prestige dealers", "Chatswood auto galleries"],
    description:
      "Chatswood on Sydney's North Shore is a commercial hub where prestige and luxury car dealerships sit alongside mainstream brands, catering to the area's higher-income demographic.",
    localInsight:
      "North Shore buyers often finance higher-value vehicles. For loans above $50,000, negotiating a lower rate directly with your bank can save thousands compared to dealer finance.",
  },

  // ─── Melbourne (VIC) ──────────────────────────────────────────────────────────
  {
    slug: "dandenong",
    name: "Dandenong",
    state: "VIC",
    city: "Melbourne",
    avgCarPrice: 34_000,
    popularDealers: ["Dandenong auto precinct on Princes Highway", "South-East Melbourne car yards"],
    description:
      "Dandenong is Melbourne's south-east automotive hub, with one of Victoria's largest concentrations of car dealerships along the Princes Highway.",
    localInsight:
      "Dandenong's competitive dealer strip means buyers can negotiate aggressively. Getting quotes from 3+ dealers and having pre-approved finance gives you the strongest bargaining position.",
  },
  {
    slug: "frankston",
    name: "Frankston",
    state: "VIC",
    city: "Melbourne",
    avgCarPrice: 32_000,
    popularDealers: ["Frankston auto dealers on Nepean Highway", "Mornington Peninsula motor groups"],
    description:
      "Frankston at the gateway to the Mornington Peninsula has a well-established car sales strip along the Nepean Highway, popular with families and tradies seeking reliable vehicles.",
    localInsight:
      "Frankston buyers often look for utes and SUVs suited to peninsula living. Chattel mortgages can offer tax advantages for ABN holders buying work vehicles.",
  },
  {
    slug: "ringwood",
    name: "Ringwood",
    state: "VIC",
    city: "Melbourne",
    avgCarPrice: 40_000,
    popularDealers: ["Ringwood auto strip on Maroondah Highway", "Eastern suburbs motor groups"],
    description:
      "Ringwood in Melbourne's outer east is a key automotive retail centre along the Maroondah Highway, serving the eastern suburbs with a mix of mainstream and premium brands.",
    localInsight:
      "The Maroondah Highway auto strip offers strong competition between dealers. Comparing secured vs unsecured loan rates here can save $2,000–$5,000 over a typical 5-year loan.",
  },
  {
    slug: "werribee",
    name: "Werribee",
    state: "VIC",
    city: "Melbourne",
    avgCarPrice: 33_000,
    popularDealers: ["Werribee auto dealers", "Western Melbourne motor groups on Princes Freeway"],
    description:
      "Werribee is one of Melbourne's fastest-growing western suburbs, with increasing demand for car finance as new housing estates drive population growth.",
    localInsight:
      "Werribee's growing population means more first-time car buyers. Young buyers should check eligibility for novated leases through their employer — it can reduce the effective cost significantly.",
  },
  {
    slug: "geelong",
    name: "Geelong",
    state: "VIC",
    city: "Melbourne",
    avgCarPrice: 35_000,
    popularDealers: ["Geelong auto dealers on Latrobe Terrace", "Moorabool Street car yards"],
    description:
      "Geelong is Victoria's second-largest city with a strong automotive market. The Latrobe Terrace and Moorabool Street precincts host major dealer groups serving the greater Geelong region.",
    localInsight:
      "Geelong buyers benefit from regional competition. Local credit unions and community banks often offer car loan rates 0.5–1.5% below the big-4 banks for Geelong-based borrowers.",
  },

  // ─── Brisbane (QLD) ───────────────────────────────────────────────────────────
  {
    slug: "ipswich",
    name: "Ipswich",
    state: "QLD",
    city: "Brisbane",
    avgCarPrice: 33_000,
    popularDealers: ["Ipswich auto dealers on Brisbane Road", "West Ipswich motor groups"],
    description:
      "Ipswich is a major centre west of Brisbane with a strong car sales market. Brisbane Road and the Ipswich Motorway corridor are home to numerous dealerships.",
    localInsight:
      "Ipswich buyers often commute to Brisbane, making reliable vehicles essential. Fixed-rate car loans are popular here to lock in repayments and avoid rate rises.",
  },
  {
    slug: "logan",
    name: "Logan",
    state: "QLD",
    city: "Brisbane",
    avgCarPrice: 30_000,
    popularDealers: ["Logan auto precinct on Pacific Highway", "Logan Road car dealers"],
    description:
      "Logan between Brisbane and the Gold Coast is a high-growth corridor with a competitive car market along the Pacific Highway, serving one of Queensland's most populated areas.",
    localInsight:
      "Logan's affordable car market suits first-time buyers. For cars under $20,000, a personal loan or credit union loan may offer better rates than traditional secured car finance.",
  },
  {
    slug: "caboolture",
    name: "Caboolture",
    state: "QLD",
    city: "Brisbane",
    avgCarPrice: 31_000,
    popularDealers: ["Caboolture auto dealers on Morayfield Road", "Moreton Bay motor groups"],
    description:
      "Caboolture in the Moreton Bay region is a growing satellite centre north of Brisbane, with car dealerships serving the rapidly expanding northern corridor.",
    localInsight:
      "Caboolture's growing population creates strong demand for family vehicles. Buyers should compare online lenders alongside local dealers — online-only lenders can offer rates 1–2% lower.",
  },
  {
    slug: "redcliffe",
    name: "Redcliffe",
    state: "QLD",
    city: "Brisbane",
    avgCarPrice: 34_000,
    popularDealers: ["Redcliffe and Kippa-Ring auto dealers", "Moreton Bay motor groups"],
    description:
      "Redcliffe on the Moreton Bay peninsula is a popular coastal suburb north of Brisbane, with growing car finance demand driven by the Moreton Bay Rail Link improving CBD connectivity.",
    localInsight:
      "Redcliffe's coastal lifestyle attracts retirees and families. For buyers over 55, some lenders offer tailored car loan products with flexible end-of-term options.",
  },
  {
    slug: "toowoomba",
    name: "Toowoomba",
    state: "QLD",
    city: "Brisbane",
    avgCarPrice: 36_000,
    popularDealers: ["Toowoomba auto dealers on Ruthven Street", "Darling Downs motor groups"],
    description:
      "Toowoomba is Queensland's largest inland city, sitting atop the Great Dividing Range. The Ruthven Street auto precinct serves the Darling Downs and wider regional Queensland.",
    localInsight:
      "Regional buyers in Toowoomba often need 4WDs and utes for rural access. Chattel mortgages are popular for primary producers and ABN holders buying work vehicles.",
  },

  // ─── Other Capitals ───────────────────────────────────────────────────────────
  {
    slug: "joondalup",
    name: "Joondalup",
    state: "WA",
    city: "Perth",
    avgCarPrice: 37_000,
    popularDealers: ["Joondalup auto dealers on Wanneroo Road", "Northern suburbs motor groups"],
    description:
      "Joondalup is a major suburban centre in Perth's northern corridor, with car dealerships along Wanneroo Road serving the fast-growing northern suburbs.",
    localInsight:
      "Perth's northern corridor growth means increasing competition among Joondalup dealers. WA buyers should check RAC Finance rates — they're often competitive with the big banks.",
  },
  {
    slug: "salisbury",
    name: "Salisbury",
    state: "SA",
    city: "Adelaide",
    avgCarPrice: 30_000,
    popularDealers: ["Salisbury auto precinct", "Main North Road car dealers"],
    description:
      "Salisbury in Adelaide's northern suburbs is a key car buying hub along Main North Road, offering a wide range of new and used vehicles at competitive prices.",
    localInsight:
      "Salisbury's affordable car market is popular with first-time buyers. South Australian buyers can access competitive rates through local credit unions like People's Choice.",
  },
  {
    slug: "glenorchy",
    name: "Glenorchy",
    state: "TAS",
    city: "Hobart",
    avgCarPrice: 28_000,
    popularDealers: ["Glenorchy auto dealers on Main Road", "Hobart motor groups"],
    description:
      "Glenorchy is Hobart's largest northern suburb, with car dealerships along Main Road serving Greater Hobart's car buying market.",
    localInsight:
      "Tasmania's smaller market means fewer dealer options but also less pressure-selling. Comparing mainland online lenders with local Tasmanian dealers can uncover better rates.",
  },
  {
    slug: "belconnen",
    name: "Belconnen",
    state: "ACT",
    city: "Canberra",
    avgCarPrice: 42_000,
    popularDealers: ["Belconnen auto dealers", "Phillip auto precinct (Canberra's main auto hub)"],
    description:
      "Belconnen is one of Canberra's largest town centres. While the Phillip auto precinct is Canberra's main dealer hub, Belconnen residents represent a major share of the ACT car market.",
    localInsight:
      "Canberra's high average income supports stronger car budgets. ACT buyers benefit from no stamp duty on new EVs — worth considering if comparing petrol vs electric vehicle financing.",
  },
  {
    slug: "palmerston",
    name: "Palmerston",
    state: "NT",
    city: "Darwin",
    avgCarPrice: 40_000,
    popularDealers: ["Darwin and Palmerston auto dealers on Stuart Highway", "Territory motor groups"],
    description:
      "Palmerston is Darwin's largest satellite city, with car dealerships along the Stuart Highway serving the Top End's vehicle market.",
    localInsight:
      "Territory buyers often need 4WDs for outback travel. Secured loans on 4WDs and utes typically attract lower rates than unsecured loans — the vehicle acts as collateral.",
  },
];

export const SLUG_TO_SUBURB: Record<string, CarLoanSuburbData> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);

export const SUBURBS_BY_CITY: Record<string, CarLoanSuburbData[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.city]) acc[s.city] = [];
    acc[s.city].push(s);
    return acc;
  },
  {} as Record<string, CarLoanSuburbData[]>
);

export const CITY_ORDER = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Hobart", "Canberra", "Darwin"];
