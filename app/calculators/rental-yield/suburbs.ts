export interface RentalYieldSuburbData {
  slug: string;
  name: string;
  state: string;
  city: string;
  medianPrice: number;
  averageWeeklyRent: number;
  grossYield: number;
  description: string;
  investmentInsight: string;
  nearbySuburbs: string[];
}

export const SUBURBS: RentalYieldSuburbData[] = [
  // ─── NSW ──────────────────────────────────────────────────────────────────────
  {
    slug: "parramatta-nsw",
    name: "Parramatta",
    state: "NSW",
    city: "Sydney",
    medianPrice: 850000,
    averageWeeklyRent: 580,
    grossYield: 3.55,
    description:
      "Parramatta is Sydney's second CBD and a major growth corridor with billions in infrastructure investment including the Parramatta Light Rail and Western Sydney Metro. Strong rental demand is driven by government offices, Westfield, universities, and a growing commercial precinct attracting corporate tenants.",
    investmentInsight:
      "Parramatta's status as Sydney's second CBD creates consistent rental demand from professionals. The ongoing light rail and metro projects are expected to further boost property values and rental yields as connectivity improves. Unit yields tend to outperform houses here — apartments near the station achieve 4%+ gross yields.",
    nearbySuburbs: ["blacktown-nsw", "liverpool-nsw", "penrith-nsw"],
  },
  {
    slug: "blacktown-nsw",
    name: "Blacktown",
    state: "NSW",
    city: "Sydney",
    medianPrice: 780000,
    averageWeeklyRent: 550,
    grossYield: 3.67,
    description:
      "Blacktown is one of Western Sydney's most populated suburbs with excellent transport links via the T1 Western Line and proximity to the future Western Sydney Airport. Affordable entry prices relative to inner Sydney make it popular with investors seeking stronger yields and long-term capital growth from infrastructure spending.",
    investmentInsight:
      "Blacktown benefits from the Western Sydney Airport development at Badgerys Creek, expected to create 200,000+ jobs in the region. Properties within walking distance of the station command premium rents. The suburb's diverse tenant pool — families, professionals, and students — keeps vacancy rates low at around 1.5%.",
    nearbySuburbs: ["parramatta-nsw", "penrith-nsw", "liverpool-nsw"],
  },
  {
    slug: "liverpool-nsw",
    name: "Liverpool",
    state: "NSW",
    city: "Sydney",
    medianPrice: 820000,
    averageWeeklyRent: 560,
    grossYield: 3.55,
    description:
      "Liverpool is a major regional hub in South-Western Sydney with a thriving health and education precinct anchored by Liverpool Hospital (one of NSW's largest). The suburb is well-connected via the T2 and T5 train lines and is positioned to benefit from the Western Sydney Aerotropolis development.",
    investmentInsight:
      "Liverpool's health precinct expansion and proximity to the Western Sydney Aerotropolis make it a strong long-term investment. Hospital workers and university students provide reliable rental demand year-round. Newer apartment stock near the station tends to achieve higher yields than older houses further out.",
    nearbySuburbs: ["parramatta-nsw", "blacktown-nsw", "penrith-nsw"],
  },
  {
    slug: "penrith-nsw",
    name: "Penrith",
    state: "NSW",
    city: "Sydney",
    medianPrice: 750000,
    averageWeeklyRent: 530,
    grossYield: 3.67,
    description:
      "Penrith sits at the foot of the Blue Mountains and serves as the gateway to Western Sydney. With direct train access to the CBD and proximity to the new Western Sydney International Airport, Penrith offers affordable entry prices with strong infrastructure-driven growth potential.",
    investmentInsight:
      "Penrith is one of Western Sydney's best-positioned suburbs for the airport-driven boom. Property prices remain well below the Sydney median, offering better yields for investors. The Panthers precinct redevelopment and new commercial precincts are expanding local employment, reducing reliance on CBD commuting and strengthening local rental demand.",
    nearbySuburbs: ["blacktown-nsw", "parramatta-nsw", "wollongong-nsw"],
  },
  {
    slug: "wollongong-nsw",
    name: "Wollongong",
    state: "NSW",
    city: "Wollongong",
    medianPrice: 870000,
    averageWeeklyRent: 560,
    grossYield: 3.35,
    description:
      "Wollongong is the Illawarra region's capital, offering a coastal lifestyle just 80km south of Sydney. The University of Wollongong drives strong student rental demand, while the city's growing tech and creative industries attract young professionals. The direct South Coast Line provides CBD access for commuters.",
    investmentInsight:
      "Wollongong's dual demand from university students (30,000+ enrolled) and Sydney commuters provides a resilient rental market. Properties near the university or station perform best. The city's ongoing urban renewal along the foreshore is lifting property values in the CBD and surrounding blocks.",
    nearbySuburbs: ["liverpool-nsw", "penrith-nsw"],
  },

  // ─── VIC ──────────────────────────────────────────────────────────────────────
  {
    slug: "dandenong-vic",
    name: "Dandenong",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 620000,
    averageWeeklyRent: 450,
    grossYield: 3.77,
    description:
      "Dandenong is a major commercial and multicultural hub in Melbourne's south-east, anchored by Dandenong Market and the revitalised CBD precinct. The Cranbourne and Pakenham train lines provide direct city access, and the suburb's relative affordability makes it a magnet for investors looking for stronger yields in metropolitan Melbourne.",
    investmentInsight:
      "Dandenong's ongoing urban renewal has lifted rental values significantly over the past five years. The suburb's diversity means a wide tenant pool — families, new migrants, and workers at the nearby industrial precinct. Houses on smaller lots near the station are the sweet spot for yield-focused investors.",
    nearbySuburbs: ["frankston-vic", "werribee-vic", "craigieburn-vic"],
  },
  {
    slug: "frankston-vic",
    name: "Frankston",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 700000,
    averageWeeklyRent: 480,
    grossYield: 3.56,
    description:
      "Frankston is a bayside suburb on the Mornington Peninsula fringe, offering beach access and improving infrastructure. The Frankston railway line electrification and CBD revitalisation have repositioned the suburb as a lifestyle-and-value proposition. Monash University's Peninsula campus adds student rental demand.",
    investmentInsight:
      "Frankston's transformation from affordable outer suburb to lifestyle destination has driven consistent rental growth. Properties near the foreshore or station command premium rents. The suburb still offers entry prices well below the Melbourne median, making it attractive for yield-conscious investors who also want capital growth upside.",
    nearbySuburbs: ["dandenong-vic", "geelong-vic", "werribee-vic"],
  },
  {
    slug: "geelong-vic",
    name: "Geelong",
    state: "VIC",
    city: "Geelong",
    medianPrice: 720000,
    averageWeeklyRent: 470,
    grossYield: 3.39,
    description:
      "Geelong is Victoria's second-largest city and has experienced strong population growth driven by Melbourne commuters seeking affordability and lifestyle. The Geelong waterfront precinct, Deakin University, and growing health sector provide diverse employment. V/Line fast rail connects to Melbourne Southern Cross in under an hour.",
    investmentInsight:
      "Geelong's rapid population growth has tightened the rental market significantly, with vacancy rates below 1% for much of 2025. The city's transition from manufacturing to knowledge-economy jobs is attracting higher-income tenants. Properties in the CBD and waterfront precinct achieve the best yields due to proximity to employment and amenities.",
    nearbySuburbs: ["werribee-vic", "frankston-vic"],
  },
  {
    slug: "werribee-vic",
    name: "Werribee",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 590000,
    averageWeeklyRent: 430,
    grossYield: 3.79,
    description:
      "Werribee is one of Melbourne's fastest-growing western suburbs, part of the Wyndham growth corridor. Major investment in Pacific Werribee shopping centre, the Werribee Open Range Zoo precinct, and new housing estates have transformed the area. Direct V/Line and metro services connect to the CBD.",
    investmentInsight:
      "Werribee's population growth (Wyndham is Australia's fastest-growing municipality) creates persistent rental demand that outstrips supply. New-build houses in estate developments attract family tenants on long leases. The suburb's affordability relative to inner Melbourne means yields consistently outperform eastern suburbs by 0.5-1 percentage points.",
    nearbySuburbs: ["geelong-vic", "dandenong-vic", "craigieburn-vic"],
  },
  {
    slug: "craigieburn-vic",
    name: "Craigieburn",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 600000,
    averageWeeklyRent: 440,
    grossYield: 3.81,
    description:
      "Craigieburn is a rapidly expanding northern suburb along the Hume Corridor with excellent freeway access and a growing town centre anchored by Craigieburn Central. The suburb's family-friendly estates and relatively affordable housing attract both owner-occupiers and renters, keeping demand strong.",
    investmentInsight:
      "Craigieburn's northern corridor location means continued population growth as Melbourne expands. The suburb offers some of the best yields in metropolitan Melbourne due to affordable purchase prices paired with solid rents. Properties near Craigieburn Central or the train station are most sought-after by tenants.",
    nearbySuburbs: ["dandenong-vic", "werribee-vic", "frankston-vic"],
  },

  // ─── QLD ──────────────────────────────────────────────────────────────────────
  {
    slug: "logan-qld",
    name: "Logan",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 580000,
    averageWeeklyRent: 480,
    grossYield: 4.30,
    description:
      "Logan is a major growth area between Brisbane and the Gold Coast, benefiting from infrastructure investment in both corridors. The M1 motorway and Logan Motorway provide connectivity, while affordable housing attracts families and first-home buyers. Logan's diverse economy includes retail, logistics, health, and education.",
    investmentInsight:
      "Logan consistently delivers some of Brisbane's highest rental yields due to affordable entry prices and strong tenant demand. The suburb benefits from dual commuter demand — workers heading to both Brisbane CBD and Gold Coast. Houses in established areas like Woodridge and Beenleigh achieve yields above 5% for well-maintained properties.",
    nearbySuburbs: ["ipswich-qld", "caboolture-qld", "toowoomba-qld"],
  },
  {
    slug: "ipswich-qld",
    name: "Ipswich",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 550000,
    averageWeeklyRent: 460,
    grossYield: 4.35,
    description:
      "Ipswich is Queensland's fastest-growing city, positioned 40km west of Brisbane with direct rail and motorway access. The Springfield development, RAAF Base Amberley, and University of Southern Queensland campus drive employment. Ipswich offers some of the most affordable housing in South-East Queensland.",
    investmentInsight:
      "Ipswich's affordability makes it one of the highest-yielding markets in SEQ. Defence families near RAAF Amberley provide reliable, long-term tenants. The Springfield corridor is attracting significant commercial investment, creating local jobs and reducing the commuter stigma. Properties under $500K can achieve 5%+ gross yields.",
    nearbySuburbs: ["logan-qld", "toowoomba-qld", "caboolture-qld"],
  },
  {
    slug: "caboolture-qld",
    name: "Caboolture",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 560000,
    averageWeeklyRent: 470,
    grossYield: 4.36,
    description:
      "Caboolture is a Moreton Bay region suburb about 50km north of Brisbane, serving as a service centre for the northern corridor. The suburb benefits from the Bruce Highway and North Coast rail line, with ongoing development at Caboolture West expected to add 30,000+ residents over coming decades.",
    investmentInsight:
      "Caboolture offers excellent yields for Brisbane-region investors due to affordable entry prices. The Caboolture West master-planned community will drive infrastructure upgrades benefiting existing properties. Hospital workers, retail employees, and young families form the core tenant base. Vacancy rates remain tight at under 1%.",
    nearbySuburbs: ["logan-qld", "ipswich-qld", "toowoomba-qld"],
  },
  {
    slug: "toowoomba-qld",
    name: "Toowoomba",
    state: "QLD",
    city: "Toowoomba",
    medianPrice: 520000,
    averageWeeklyRent: 430,
    grossYield: 4.30,
    description:
      "Toowoomba is Queensland's largest inland city, located on the Great Dividing Range west of Brisbane. The Garden City is a major agricultural, education, and health hub with the University of Southern Queensland and multiple hospitals. The Toowoomba Second Range Crossing has dramatically improved Brisbane access.",
    investmentInsight:
      "Toowoomba's diversified economy (agriculture, defence, education, health) provides resilient rental demand less correlated to Brisbane market cycles. The Second Range Crossing has unlocked growth potential. Student housing near USQ offers 5-6% yields, while family homes in established suburbs like East Toowoomba and Newtown deliver reliable 4-5% returns.",
    nearbySuburbs: ["ipswich-qld", "logan-qld"],
  },

  // ─── WA ───────────────────────────────────────────────────────────────────────
  {
    slug: "rockingham-wa",
    name: "Rockingham",
    state: "WA",
    city: "Perth",
    medianPrice: 520000,
    averageWeeklyRent: 480,
    grossYield: 4.80,
    description:
      "Rockingham is a coastal city 40km south of Perth CBD, popular with families for its beaches and relaxed lifestyle. The suburb serves as a regional hub with a large shopping centre, hospital, and TAFE campus. The Mandurah train line provides direct CBD access in 45 minutes.",
    investmentInsight:
      "Rockingham's combination of coastal lifestyle, affordability, and transport connectivity makes it one of Perth's best yield markets. FIFO workers and naval base personnel (HMAS Stirling at Garden Island) provide consistent rental demand. The coastal premium means properties hold value well during downturns while delivering strong yields.",
    nearbySuburbs: ["mandurah-wa", "joondalup-wa"],
  },
  {
    slug: "mandurah-wa",
    name: "Mandurah",
    state: "WA",
    city: "Perth",
    medianPrice: 490000,
    averageWeeklyRent: 460,
    grossYield: 4.88,
    description:
      "Mandurah is a waterfront city at the southern end of the Perth metropolitan area, known for its canals, estuary, and relaxed coastal living. The Mandurah train line terminus provides 70-minute CBD access. The city has transformed from a retiree haven into a mixed-demographic growth area.",
    investmentInsight:
      "Mandurah offers some of Perth's best rental yields due to affordable prices and strong demand from FIFO workers, defence personnel, and retirees. The canal estates attract premium tenants willing to pay for waterfront living. Properties near the train station benefit from commuter demand while canal-front homes achieve lower yields but stronger capital growth.",
    nearbySuburbs: ["rockingham-wa", "joondalup-wa"],
  },
  {
    slug: "joondalup-wa",
    name: "Joondalup",
    state: "WA",
    city: "Perth",
    medianPrice: 620000,
    averageWeeklyRent: 530,
    grossYield: 4.44,
    description:
      "Joondalup is Perth's northern CBD, a planned city centre with Joondalup Health Campus, Edith Cowan University, Lakeside Joondalup Shopping City, and extensive parklands. The Joondalup Line provides fast CBD access, and the suburb's self-contained amenities reduce commuter dependency.",
    investmentInsight:
      "Joondalup's status as a secondary CBD means rental demand comes from local workers, not just CBD commuters. ECU students and hospital staff provide year-round tenant demand. The suburb's higher median price is offset by premium rents — well-presented properties near the university or hospital achieve above-average yields for the northern corridor.",
    nearbySuburbs: ["rockingham-wa", "mandurah-wa"],
  },

  // ─── SA ───────────────────────────────────────────────────────────────────────
  {
    slug: "salisbury-sa",
    name: "Salisbury",
    state: "SA",
    city: "Adelaide",
    medianPrice: 480000,
    averageWeeklyRent: 420,
    grossYield: 4.55,
    description:
      "Salisbury is Adelaide's largest northern suburb and a major employment hub with the Edinburgh Defence Precinct (RAAF Edinburgh, Technology Park) and Parafield Airport. The Gawler Line provides direct CBD access. Affordable housing and strong infrastructure make it a popular investment destination.",
    investmentInsight:
      "Salisbury benefits enormously from the defence and technology precinct at Edinburgh, which employs thousands and creates reliable tenant demand from defence personnel and contractors. Properties near the interchange or Technology Park command premium rents. The suburb's affordability means yields consistently sit above 4.5%, well above Adelaide's average.",
    nearbySuburbs: ["elizabeth-sa"],
  },
  {
    slug: "elizabeth-sa",
    name: "Elizabeth",
    state: "SA",
    city: "Adelaide",
    medianPrice: 400000,
    averageWeeklyRent: 380,
    grossYield: 4.94,
    description:
      "Elizabeth is a northern Adelaide suburb undergoing significant transformation following the closure of the Holden factory. The $250M Lyell McEwin Hospital expansion, new retail developments, and proximity to the Edinburgh Defence Precinct are driving renewal. The Gawler Line provides CBD access.",
    investmentInsight:
      "Elizabeth offers Adelaide's highest rental yields with entry prices under $400K. The suburb's transformation from manufacturing to health and defence employment is improving tenant quality. Renovated 3-bedroom houses attract families on long-term leases. Investors should target properties near the hospital or train station for the best yield-to-risk profile.",
    nearbySuburbs: ["salisbury-sa"],
  },

  // ─── ACT ──────────────────────────────────────────────────────────────────────
  {
    slug: "gungahlin-act",
    name: "Gungahlin",
    state: "ACT",
    city: "Canberra",
    medianPrice: 820000,
    averageWeeklyRent: 580,
    grossYield: 3.68,
    description:
      "Gungahlin is Canberra's fastest-growing district in the city's north, connected to the CBD via the Canberra Light Rail. The town centre has matured rapidly with shopping, dining, and services. A large public service workforce and proximity to the University of Canberra drive strong rental demand.",
    investmentInsight:
      "Gungahlin's light rail connection has significantly boosted property values and rents since opening. Public servants make up the majority of tenants — they offer reliable income and tend toward longer leases. Townhouses and modern apartments near the light rail stops achieve the best yields. The district's continued population growth supports both rental demand and capital appreciation.",
    nearbySuburbs: [],
  },
];

export const SLUG_TO_SUBURB: Record<string, RentalYieldSuburbData> =
  Object.fromEntries(SUBURBS.map((s) => [s.slug, s]));

export const SUBURBS_BY_CITY: Record<string, RentalYieldSuburbData[]> =
  SUBURBS.reduce(
    (acc, s) => {
      (acc[s.city] ??= []).push(s);
      return acc;
    },
    {} as Record<string, RentalYieldSuburbData[]>
  );
