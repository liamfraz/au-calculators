export type StateCode = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT";

export interface SuburbData {
  slug: string;
  name: string;
  state: StateCode;
  city: string;
  postcode: string;
  medianPrice: number;
  typicalLoan: number;
  averageRent: number;
  rentalYield: number;
  description: string;
  marketInsight: string;
  nearbySuburbs: string[];
}

export const SUBURBS: SuburbData[] = [
  // ─── Sydney (NSW) ─────────────────────────────────────────────────────────────
  {
    slug: "sydney-cbd",
    name: "Sydney CBD",
    state: "NSW",
    city: "Sydney",
    postcode: "2000",
    medianPrice: 1350000,
    typicalLoan: 1080000,
    averageRent: 850,
    rentalYield: 3.3,
    description:
      "Sydney CBD is the commercial heart of Australia's largest city, home to a mix of luxury apartments and heritage buildings. With strong rental demand from professionals and international tenants, CBD properties offer solid yields despite high entry prices. The area benefits from world-class infrastructure, transport links, and employment opportunities.",
    marketInsight:
      "Sydney CBD apartments are popular with investors due to consistently low vacancy rates (~1.5%) and strong corporate rental demand. Studio and 1-bed apartments dominate the market, making entry prices more accessible than the headline median suggests. Proximity to Circular Quay and Barangaroo drives premium rents.",
    nearbySuburbs: ["surry-hills", "bondi", "newtown-nsw"],
  },
  {
    slug: "parramatta",
    name: "Parramatta",
    state: "NSW",
    city: "Sydney",
    postcode: "2150",
    medianPrice: 980000,
    typicalLoan: 784000,
    averageRent: 620,
    rentalYield: 3.3,
    description:
      "Parramatta is Sydney's second CBD and one of Australia's fastest-growing urban centres. Major government and corporate investment has transformed the area with new metro lines, commercial towers, and cultural precincts. Property prices remain well below Sydney's eastern suburbs while offering strong capital growth potential.",
    marketInsight:
      "The Parramatta Light Rail and Sydney Metro West are transforming accessibility, driving price growth in surrounding streets. Investors benefit from a large university student and young professional tenant pool. Units under $800K represent some of the best value-for-yield in Greater Sydney.",
    nearbySuburbs: ["sydney-cbd", "newtown-nsw"],
  },
  {
    slug: "bondi",
    name: "Bondi",
    state: "NSW",
    city: "Sydney",
    postcode: "2026",
    medianPrice: 3500000,
    typicalLoan: 2800000,
    averageRent: 1200,
    rentalYield: 1.8,
    description:
      "Bondi is one of Australia's most iconic coastal suburbs, famous for Bondi Beach and its vibrant lifestyle. The area attracts a mix of young professionals, families, and international visitors. Property here commands premium prices for the beachside location, with strong long-term capital growth driven by limited supply and exceptional amenity.",
    marketInsight:
      "Bondi's rental market benefits from seasonal short-stay demand and a large international tenant pool. While gross yields are modest due to high purchase prices, capital growth has averaged 7-8% annually over the past decade. Apartments offer more accessible entry points with yields around 2.5-3%.",
    nearbySuburbs: ["surry-hills", "sydney-cbd", "manly"],
  },
  {
    slug: "surry-hills",
    name: "Surry Hills",
    state: "NSW",
    city: "Sydney",
    postcode: "2010",
    medianPrice: 1850000,
    typicalLoan: 1480000,
    averageRent: 880,
    rentalYield: 2.5,
    description:
      "Surry Hills is an inner-city suburb known for its creative culture, cafe scene, and Victorian terrace houses. Located minutes from the CBD, it has gentrified significantly and now commands premium prices. The mix of terraces, apartments, and warehouse conversions appeals to professionals and young couples seeking urban convenience.",
    marketInsight:
      "Surry Hills benefits from proximity to major tech company offices and creative industry hubs. Terrace houses consistently outperform apartments for capital growth. The suburb has near-zero vacancy rates, making it one of Sydney's most reliable rental markets for investors.",
    nearbySuburbs: ["sydney-cbd", "newtown-nsw", "bondi"],
  },
  {
    slug: "newtown-nsw",
    name: "Newtown",
    state: "NSW",
    city: "Sydney",
    postcode: "2042",
    medianPrice: 1750000,
    typicalLoan: 1400000,
    averageRent: 780,
    rentalYield: 2.3,
    description:
      "Newtown is one of Sydney's most eclectic inner-west suburbs, famous for King Street's independent shops, live music venues, and diverse dining. Victorian terraces and Federation homes line its tree-lined streets. Strong demand from young professionals and students at nearby Sydney University keeps the rental market tight.",
    marketInsight:
      "Newtown's character housing stock is tightly held, with turnover rates well below the Sydney average. The WestConnex and Sydney Metro West projects are improving connectivity. Investors should note the suburb has some of Sydney's strictest heritage overlays, limiting new supply and supporting long-term price growth.",
    nearbySuburbs: ["surry-hills", "sydney-cbd", "parramatta"],
  },
  {
    slug: "manly",
    name: "Manly",
    state: "NSW",
    city: "Sydney",
    postcode: "2095",
    medianPrice: 3800000,
    typicalLoan: 3040000,
    averageRent: 1350,
    rentalYield: 1.8,
    description:
      "Manly on Sydney's Northern Beaches offers a premium coastal lifestyle with ferry access to the CBD. The suburb attracts families and professionals seeking a beach lifestyle without sacrificing city connectivity. Strong demand and limited land supply keep prices elevated, with houses regularly selling above $3.5 million.",
    marketInsight:
      "Manly's ferry commute makes it uniquely attractive among beach suburbs — 20 minutes to Circular Quay. The rental market benefits from tourism-driven short-stay demand alongside permanent tenants. Properties within walking distance of the beach command 15-20% premiums over those further inland.",
    nearbySuburbs: ["bondi", "sydney-cbd"],
  },
  {
    slug: "cronulla",
    name: "Cronulla",
    state: "NSW",
    city: "Sydney",
    postcode: "2230",
    medianPrice: 2600000,
    typicalLoan: 2080000,
    averageRent: 950,
    rentalYield: 1.9,
    description:
      "Cronulla is the Sutherland Shire's premier beachside suburb, offering a relaxed coastal lifestyle with direct train access to Sydney CBD. The area has undergone significant development with new apartment complexes complementing established houses. Popular with families, surfers, and professionals seeking an alternative to the Northern Beaches.",
    marketInsight:
      "Cronulla is one of the few Sydney beach suburbs with a train station, making it attractive for commuters. The suburb has seen strong apartment development, providing more affordable entry points. House prices have grown consistently at 6-7% annually, outperforming many inland suburbs.",
    nearbySuburbs: ["bondi", "sydney-cbd", "manly"],
  },
  // ─── Melbourne (VIC) ──────────────────────────────────────────────────────────
  {
    slug: "melbourne-cbd",
    name: "Melbourne CBD",
    state: "VIC",
    city: "Melbourne",
    postcode: "3000",
    medianPrice: 650000,
    typicalLoan: 520000,
    averageRent: 580,
    rentalYield: 4.6,
    description:
      "Melbourne CBD is a dense, cosmopolitan urban centre known for its laneways, arts culture, and dining scene. The apartment-dominated market offers some of the best rental yields in any Australian capital city CBD. Strong population growth and return-to-office trends are driving a rental market recovery following the pandemic.",
    marketInsight:
      "Melbourne CBD has rebounded strongly from pandemic-era oversupply, with vacancy rates dropping below 2%. One-bedroom apartments in the $400K-$600K range offer yields of 5%+, among the best in any major Australian CBD. Avoid older stock with high owner's corporation fees — newer buildings with better amenities attract higher rents.",
    nearbySuburbs: ["richmond-vic", "st-kilda", "fitzroy"],
  },
  {
    slug: "richmond-vic",
    name: "Richmond",
    state: "VIC",
    city: "Melbourne",
    postcode: "3121",
    medianPrice: 1450000,
    typicalLoan: 1160000,
    averageRent: 680,
    rentalYield: 2.4,
    description:
      "Richmond is one of Melbourne's most sought-after inner suburbs, located just 3km from the CBD. The suburb blends Victorian-era terraces with modern apartment developments along Swan Street and Bridge Road. Home to the MCG precinct and excellent public transport, Richmond attracts young professionals and families.",
    marketInsight:
      "Richmond's proximity to the MCG, sporting precinct, and multiple train lines makes it one of Melbourne's most connected suburbs. The warehouse conversion market has matured, with premium loft-style properties commanding strong rents. Victoria Street's Vietnamese dining precinct adds cultural appeal for tenants.",
    nearbySuburbs: ["melbourne-cbd", "fitzroy", "st-kilda"],
  },
  {
    slug: "st-kilda",
    name: "St Kilda",
    state: "VIC",
    city: "Melbourne",
    postcode: "3182",
    medianPrice: 1200000,
    typicalLoan: 960000,
    averageRent: 620,
    rentalYield: 2.7,
    description:
      "St Kilda is Melbourne's iconic beachside suburb, known for Luna Park, the Esplanade, and Acland Street's cake shops. The suburb offers a mix of Art Deco apartments, period homes, and modern developments. Its proximity to the beach and vibrant nightlife makes it perpetually popular with renters and buyers alike.",
    marketInsight:
      "St Kilda's apartment market offers better yields than many inner Melbourne suburbs due to strong rental demand from hospitality workers, students, and young professionals. The tram network provides excellent CBD connectivity. Period Art Deco buildings command premium rents for their character and larger floor plans.",
    nearbySuburbs: ["melbourne-cbd", "richmond-vic", "fitzroy"],
  },
  {
    slug: "fitzroy",
    name: "Fitzroy",
    state: "VIC",
    city: "Melbourne",
    postcode: "3065",
    medianPrice: 1550000,
    typicalLoan: 1240000,
    averageRent: 700,
    rentalYield: 2.3,
    description:
      "Fitzroy is Melbourne's original bohemian suburb, now a gentrified hotspot known for Brunswick Street's bars, galleries, and boutiques. Victorian terraces dominate the housing stock, with warehouse conversions adding industrial-chic appeal. The suburb has some of the lowest vacancy rates in Melbourne, reflecting its enduring popularity.",
    marketInsight:
      "Fitzroy's housing stock is tightly held with very low turnover. Period terraces have delivered consistent 6-7% annual capital growth over the past decade. The suburb's walkability score is among the highest in Melbourne, a key driver for the professional tenant demographic. Limited new supply supports long-term price growth.",
    nearbySuburbs: ["melbourne-cbd", "richmond-vic", "st-kilda"],
  },
  // ─── Brisbane (QLD) ───────────────────────────────────────────────────────────
  {
    slug: "brisbane-cbd",
    name: "Brisbane CBD",
    state: "QLD",
    city: "Brisbane",
    postcode: "4000",
    medianPrice: 720000,
    typicalLoan: 576000,
    averageRent: 620,
    rentalYield: 4.5,
    description:
      "Brisbane CBD is experiencing a transformation ahead of the 2032 Olympics, with major infrastructure projects reshaping the cityscape. The apartment-dominated market offers strong yields and is benefiting from interstate migration, particularly from Sydney and Melbourne. Queen's Wharf and Cross River Rail are catalysing growth.",
    marketInsight:
      "Brisbane CBD yields are among the best in any Australian capital, with 1-bed apartments regularly achieving 5%+. The 2032 Olympics infrastructure spend is creating a once-in-a-generation growth cycle. Avoid older walk-up buildings without lifts — modern stock with river views commands 20-30% rent premiums.",
    nearbySuburbs: ["paddington-qld", "gold-coast"],
  },
  {
    slug: "paddington-qld",
    name: "Paddington",
    state: "QLD",
    city: "Brisbane",
    postcode: "4064",
    medianPrice: 1650000,
    typicalLoan: 1320000,
    averageRent: 780,
    rentalYield: 2.5,
    description:
      "Paddington is one of Brisbane's premier inner-city suburbs, famous for its Queenslander homes with wide verandahs and character charm. Located just 3km from the CBD with views to Mt Coot-tha, the suburb offers a village atmosphere with boutique shopping on Latrobe Terrace. Popular with families and professionals.",
    marketInsight:
      "Paddington's Queenslander homes are heritage-protected, severely limiting new supply and supporting price growth. The suburb has benefited significantly from interstate migration, with Sydney and Melbourne buyers finding exceptional value relative to equivalent inner-city suburbs in those cities. Renovation potential adds value for hands-on investors.",
    nearbySuburbs: ["brisbane-cbd", "gold-coast"],
  },
  {
    slug: "gold-coast",
    name: "Gold Coast",
    state: "QLD",
    city: "Gold Coast",
    postcode: "4217",
    medianPrice: 1100000,
    typicalLoan: 880000,
    averageRent: 750,
    rentalYield: 3.5,
    description:
      "The Gold Coast is Australia's premier holiday destination turned booming residential market. Surfers Paradise and surrounding suburbs offer a mix of high-rise apartments, townhouses, and detached homes. Strong interstate migration and tourism underpin both rental demand and capital growth. The 2032 Olympics will further boost infrastructure.",
    marketInsight:
      "Gold Coast vacancy rates are at historic lows (~1%), driven by population growth of 2%+ annually. Beachfront apartments in the $600K-$900K range offer the best risk-adjusted yields. The light rail expansion is creating new growth corridors. Short-stay rental regulations are tightening — factor this into investment strategy.",
    nearbySuburbs: ["brisbane-cbd", "paddington-qld", "byron-bay"],
  },
  {
    slug: "byron-bay",
    name: "Byron Bay",
    state: "NSW",
    city: "Byron Bay",
    postcode: "2481",
    medianPrice: 2400000,
    typicalLoan: 1920000,
    averageRent: 1100,
    rentalYield: 2.4,
    description:
      "Byron Bay is a world-famous coastal town in northern NSW, known for its beaches, hinterland, and alternative lifestyle culture. The property market has exploded in recent years driven by remote workers, celebrities, and lifestyle seekers. Despite high prices, strong tourism and short-stay rental demand create unique investment opportunities.",
    marketInsight:
      "Byron Bay's market is driven by lifestyle demand rather than traditional fundamentals. Short-term rental yields can significantly exceed long-term rental returns, though council regulations are evolving. The Chris Hemsworth effect has put Byron on the global luxury map. Properties with DA-approved holiday letting command significant premiums.",
    nearbySuburbs: ["gold-coast"],
  },
  // ─── Perth (WA) ───────────────────────────────────────────────────────────────
  {
    slug: "perth-cbd",
    name: "Perth CBD",
    state: "WA",
    city: "Perth",
    postcode: "6000",
    medianPrice: 580000,
    typicalLoan: 464000,
    averageRent: 600,
    rentalYield: 5.4,
    description:
      "Perth CBD is the commercial centre of Western Australia, benefiting from the mining boom's wealth generation. The apartment market offers some of Australia's highest rental yields, driven by FIFO workers, students, and young professionals. Elizabeth Quay and the new Perth Museum have revitalised the waterfront precinct.",
    marketInsight:
      "Perth CBD offers the highest rental yields of any Australian capital CBD, with 1-bed apartments achieving 5.5-6.5%. The WA mining sector recovery has tightened the rental market significantly, with vacancy rates below 1%. FIFO worker demand provides reliable, consistent rental income. Avoid older 1970s stock — modern buildings attract 20%+ rent premiums.",
    nearbySuburbs: ["fremantle"],
  },
  {
    slug: "fremantle",
    name: "Fremantle",
    state: "WA",
    city: "Perth",
    postcode: "6160",
    medianPrice: 950000,
    typicalLoan: 760000,
    averageRent: 650,
    rentalYield: 3.6,
    description:
      "Fremantle is Perth's historic port city, known for its well-preserved Victorian and Edwardian architecture, vibrant markets, and maritime heritage. Located 20km south of Perth CBD, 'Freo' offers a distinct coastal character with a thriving arts and food scene. The suburb attracts a mix of creatives, professionals, and families.",
    marketInsight:
      "Fremantle's character housing stock is tightly held, similar to inner-city suburbs in Sydney and Melbourne but at a fraction of the price. The suburb benefits from both Perth CBD commuters and local employment in the port and maritime sectors. Heritage-listed properties with modern renovations command strong premiums.",
    nearbySuburbs: ["perth-cbd"],
  },
  // ─── Adelaide (SA) ────────────────────────────────────────────────────────────
  {
    slug: "adelaide-cbd",
    name: "Adelaide CBD",
    state: "SA",
    city: "Adelaide",
    postcode: "5000",
    medianPrice: 580000,
    typicalLoan: 464000,
    averageRent: 520,
    rentalYield: 4.7,
    description:
      "Adelaide CBD is a compact, walkable city centre surrounded by parklands. The property market offers exceptional value compared to eastern capitals, with strong yields and improving capital growth. Defence industry expansion at Osborne and tech sector growth are driving demand from interstate buyers and investors.",
    marketInsight:
      "Adelaide CBD has been one of Australia's best-performing markets, with prices growing 40%+ since 2020. Defence contracts worth $100B+ are generating thousands of high-paying jobs, supporting long-term rental demand. The Adelaide 500 revival and new cultural venues are boosting the city's lifestyle appeal. Entry prices remain accessible at $400K-$600K for apartments.",
    nearbySuburbs: [],
  },
  // ─── Canberra (ACT) ───────────────────────────────────────────────────────────
  {
    slug: "canberra",
    name: "Canberra",
    state: "ACT",
    city: "Canberra",
    postcode: "2601",
    medianPrice: 1050000,
    typicalLoan: 840000,
    averageRent: 700,
    rentalYield: 3.5,
    description:
      "Canberra is Australia's capital and the nation's highest-income city, with a property market underpinned by government employment. The inner-city apartment market offers solid yields while houses in established suburbs command premium prices. The light rail and expanding town centres are reshaping Canberra's traditionally car-dependent urban form.",
    marketInsight:
      "Canberra's government-driven economy provides exceptional rental stability — vacancy rates rarely exceed 1.5%. Average household incomes are 30-40% above the national average, supporting premium rents. The light rail corridor from Gungahlin to Woden is creating new investment hotspots. Defence and public service employment provides a recession-resistant tenant base.",
    nearbySuburbs: [],
  },
  // ─── Hobart (TAS) ─────────────────────────────────────────────────────────────
  {
    slug: "hobart",
    name: "Hobart",
    state: "TAS",
    city: "Hobart",
    postcode: "7000",
    medianPrice: 750000,
    typicalLoan: 600000,
    averageRent: 530,
    rentalYield: 3.7,
    description:
      "Hobart is Australia's second-oldest capital city, experiencing a renaissance driven by MONA, tourism, and lifestyle migration. The compact housing market has some of Australia's lowest vacancy rates, creating strong rental demand. Historic sandstone buildings, waterfront dining, and proximity to wilderness make Hobart increasingly attractive to mainland buyers.",
    marketInsight:
      "Hobart's rental market is one of Australia's tightest, with vacancy rates frequently below 0.5%. The limited land supply (constrained by Mt Wellington and the Derwent River) restricts new housing, supporting price growth. Tourism-driven short-stay demand competes with permanent rentals. Properties within walking distance of the waterfront and Salamanca Place command the highest premiums.",
    nearbySuburbs: [],
  },
];

export const SLUG_TO_SUBURB: Record<string, SuburbData> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);

export const SUBURBS_BY_STATE: Record<string, SuburbData[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.state]) acc[s.state] = [];
    acc[s.state].push(s);
    return acc;
  },
  {} as Record<string, SuburbData[]>
);

export const SUBURBS_BY_CITY: Record<string, SuburbData[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.city]) acc[s.city] = [];
    acc[s.city].push(s);
    return acc;
  },
  {} as Record<string, SuburbData[]>
);
