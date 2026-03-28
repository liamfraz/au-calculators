import type { StateCode } from "./constants";

export interface StampDutySuburb {
  slug: string;
  name: string;
  state: StateCode;
  medianPrice: number;
  description: string;
  marketInsight: string;
  nearbySuburbs: string[]; // slugs of nearby suburbs for internal linking
}

// 50 popular Australian suburbs — approximate 2025–2026 median house prices
// Sources: CoreLogic, Domain, REA Group publicly reported medians
export const SUBURBS: StampDutySuburb[] = [
  // --- NSW: Sydney suburbs ---
  {
    slug: "parramatta",
    name: "Parramatta",
    state: "NSW",
    medianPrice: 1_050_000,
    description:
      "Parramatta is Sydney's second CBD and a major commercial hub in Western Sydney, with excellent transport links including the new Metro West line and a growing apartment market.",
    marketInsight:
      "Parramatta is undergoing significant urban renewal. Government investment in infrastructure and the designation as Sydney's central city are driving long-term price growth.",
    nearbySuburbs: ["blacktown", "liverpool", "penrith", "bankstown"],
  },
  {
    slug: "bondi",
    name: "Bondi",
    state: "NSW",
    medianPrice: 2_800_000,
    description:
      "Bondi is one of Australia's most iconic coastal suburbs, famous for Bondi Beach, the coastal walk, and a vibrant cafe and dining scene in Sydney's Eastern Suburbs.",
    marketInsight:
      "Bondi consistently ranks among Sydney's most expensive suburbs. Freestanding homes regularly exceed $3M, while units offer a more accessible entry around $1M.",
    nearbySuburbs: ["surry-hills", "newtown", "manly", "chatswood"],
  },
  {
    slug: "chatswood",
    name: "Chatswood",
    state: "NSW",
    medianPrice: 2_100_000,
    description:
      "Chatswood is a bustling commercial and residential hub on Sydney's North Shore, known for its shopping centres, Asian dining scene, and excellent public transport.",
    marketInsight:
      "Chatswood benefits from strong demand from families and professionals. The mix of houses and high-rise apartments provides options across a wide price range.",
    nearbySuburbs: ["manly", "bondi", "parramatta", "surry-hills"],
  },
  {
    slug: "penrith",
    name: "Penrith",
    state: "NSW",
    medianPrice: 850_000,
    description:
      "Penrith is a major centre in Western Sydney at the foot of the Blue Mountains, offering affordable housing, growing infrastructure, and a family-friendly lifestyle.",
    marketInsight:
      "Penrith has benefited from the Western Sydney Aerotropolis and new metro rail. It remains one of Sydney's most affordable entry points for house buyers.",
    nearbySuburbs: ["blacktown", "parramatta", "liverpool", "bankstown"],
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    state: "NSW",
    medianPrice: 900_000,
    description:
      "Liverpool is a major commercial centre in South Western Sydney with a diverse community, strong hospital precinct, and proximity to the new Western Sydney Airport.",
    marketInsight:
      "Liverpool is positioned for growth with the Western Sydney Airport and Aerotropolis driving jobs and infrastructure investment in the region.",
    nearbySuburbs: ["bankstown", "parramatta", "penrith", "blacktown"],
  },
  {
    slug: "blacktown",
    name: "Blacktown",
    state: "NSW",
    medianPrice: 880_000,
    description:
      "Blacktown is one of Sydney's largest and most diverse suburbs, offering affordable housing, extensive parklands, and strong community facilities in Western Sydney.",
    marketInsight:
      "Blacktown's affordability relative to inner Sydney continues to attract first home buyers. New housing estates in the wider LGA provide modern housing stock.",
    nearbySuburbs: ["parramatta", "penrith", "liverpool", "bankstown"],
  },
  {
    slug: "manly",
    name: "Manly",
    state: "NSW",
    medianPrice: 2_500_000,
    description:
      "Manly is Sydney's Northern Beaches jewel — a ferry ride from Circular Quay with a laid-back beach culture, boutique shops, and national park walks.",
    marketInsight:
      "Manly attracts strong demand from families and professionals seeking beachside living with CBD connectivity. Supply is constrained by geography.",
    nearbySuburbs: ["chatswood", "bondi", "surry-hills", "newtown"],
  },
  {
    slug: "surry-hills",
    name: "Surry Hills",
    state: "NSW",
    medianPrice: 1_850_000,
    description:
      "Surry Hills is an inner-city Sydney suburb known for its heritage terrace houses, vibrant dining and bar scene, creative industries, and proximity to the CBD.",
    marketInsight:
      "Surry Hills commands premium prices for its walkability and lifestyle. Renovated terraces are tightly held, with strong competition at auction.",
    nearbySuburbs: ["newtown", "bondi", "chatswood", "parramatta"],
  },
  {
    slug: "newtown",
    name: "Newtown",
    state: "NSW",
    medianPrice: 1_700_000,
    description:
      "Newtown is Sydney's bohemian inner west hub, famous for King Street's eclectic mix of vintage shops, live music venues, and multicultural dining.",
    marketInsight:
      "Newtown's character homes and village atmosphere drive consistent demand. The suburb appeals to young professionals and creatives priced out of the eastern suburbs.",
    nearbySuburbs: ["surry-hills", "bondi", "parramatta", "manly"],
  },
  {
    slug: "bankstown",
    name: "Bankstown",
    state: "NSW",
    medianPrice: 950_000,
    description:
      "Bankstown is a thriving multicultural centre in South Western Sydney with a major shopping district, diverse food scene, and improving transport connections.",
    marketInsight:
      "The Sydney Metro Southwest extension is boosting Bankstown's appeal. Property prices remain accessible compared to inner suburbs while offering good rental yields.",
    nearbySuburbs: ["liverpool", "parramatta", "blacktown", "penrith"],
  },

  // --- VIC: Melbourne suburbs ---
  {
    slug: "richmond",
    name: "Richmond",
    state: "VIC",
    medianPrice: 1_350_000,
    description:
      "Richmond is a vibrant inner Melbourne suburb known for its iconic Bridge Road and Swan Street shopping strips, Victoria Street's Vietnamese restaurants, and proximity to the MCG.",
    marketInsight:
      "Richmond's mix of period homes and modern apartments appeals to a broad market. Excellent tram and train access makes it one of Melbourne's most connected suburbs.",
    nearbySuburbs: ["south-yarra", "fitzroy", "carlton", "brunswick"],
  },
  {
    slug: "st-kilda",
    name: "St Kilda",
    state: "VIC",
    medianPrice: 1_200_000,
    description:
      "St Kilda is Melbourne's iconic beachside suburb, home to Luna Park, the Esplanade, Acland Street cake shops, and a famous Sunday market along the foreshore.",
    marketInsight:
      "St Kilda offers beachside living at a more accessible price point than Sydney equivalents. The suburb's lifestyle appeal keeps demand strong across units and houses.",
    nearbySuburbs: ["south-yarra", "richmond", "fitzroy", "carlton"],
  },
  {
    slug: "fitzroy",
    name: "Fitzroy",
    state: "VIC",
    medianPrice: 1_450_000,
    description:
      "Fitzroy is Melbourne's oldest suburb and a creative hub, known for Brunswick Street galleries, street art, independent boutiques, and a thriving bar and restaurant scene.",
    marketInsight:
      "Fitzroy's heritage overlay and limited new supply keep prices elevated. The suburb is tightly held, with period terraces attracting strong auction results.",
    nearbySuburbs: ["carlton", "richmond", "brunswick", "south-yarra"],
  },
  {
    slug: "carlton",
    name: "Carlton",
    state: "VIC",
    medianPrice: 1_100_000,
    description:
      "Carlton is Melbourne's Little Italy, centred around Lygon Street's famous restaurants and cafes. It borders the University of Melbourne and the Royal Exhibition Building.",
    marketInsight:
      "Carlton's proximity to the CBD and university precinct supports strong rental demand. Period homes fetch premium prices while apartments serve the student market.",
    nearbySuburbs: ["fitzroy", "brunswick", "richmond", "south-yarra"],
  },
  {
    slug: "brunswick",
    name: "Brunswick",
    state: "VIC",
    medianPrice: 1_150_000,
    description:
      "Brunswick is a trendy inner-north Melbourne suburb famous for Sydney Road's diverse shops and restaurants, live music venues, and a strong community arts scene.",
    marketInsight:
      "Brunswick continues to gentrify while maintaining its multicultural character. First home buyers and young professionals drive demand for period homes and new developments.",
    nearbySuburbs: ["carlton", "fitzroy", "richmond", "footscray"],
  },
  {
    slug: "south-yarra",
    name: "South Yarra",
    state: "VIC",
    medianPrice: 1_400_000,
    description:
      "South Yarra is one of Melbourne's most vibrant inner suburbs, known for Chapel Street shopping, the Royal Botanic Gardens, and a diverse property mix from Victorian terraces to modern towers.",
    marketInsight:
      "South Yarra offers a mix of Victorian terraces, Art Deco apartments, and modern developments, appealing to a broad range of buyers across all price points.",
    nearbySuburbs: ["richmond", "st-kilda", "fitzroy", "carlton"],
  },
  {
    slug: "footscray",
    name: "Footscray",
    state: "VIC",
    medianPrice: 850_000,
    description:
      "Footscray is a rapidly gentrifying inner-west Melbourne suburb known for its multicultural food markets, vibrant arts scene, and excellent public transport links.",
    marketInsight:
      "Footscray offers inner-city convenience at a significant discount to eastern equivalents. Ongoing gentrification is driving steady capital growth.",
    nearbySuburbs: ["brunswick", "richmond", "carlton", "fitzroy"],
  },
  {
    slug: "box-hill",
    name: "Box Hill",
    state: "VIC",
    medianPrice: 1_200_000,
    description:
      "Box Hill is a major commercial centre in Melbourne's east, known for its thriving Asian dining scene, Box Hill Central shopping complex, and excellent train connections.",
    marketInsight:
      "Box Hill has transformed into a high-density hub with significant apartment development. Houses on larger blocks command premium prices in surrounding streets.",
    nearbySuburbs: ["glen-waverley", "richmond", "south-yarra", "frankston"],
  },
  {
    slug: "glen-waverley",
    name: "Glen Waverley",
    state: "VIC",
    medianPrice: 1_350_000,
    description:
      "Glen Waverley is a sought-after family suburb in Melbourne's south-east, known for The Glen shopping centre, top-performing schools, and a vibrant Asian restaurant strip.",
    marketInsight:
      "Glen Waverley's school zone premium is significant. Proximity to highly ranked schools like Glen Waverley Secondary drives strong competition for family homes.",
    nearbySuburbs: ["box-hill", "frankston", "richmond", "south-yarra"],
  },
  {
    slug: "frankston",
    name: "Frankston",
    state: "VIC",
    medianPrice: 750_000,
    description:
      "Frankston is a bayside suburb at the southern end of Melbourne's train network, offering affordable beachside living, a revitalised CBD, and access to the Mornington Peninsula.",
    marketInsight:
      "Frankston's foreshore and CBD redevelopment have improved the suburb's appeal. It remains one of Melbourne's most affordable bayside options.",
    nearbySuburbs: ["glen-waverley", "box-hill", "st-kilda", "south-yarra"],
  },

  // --- QLD: Brisbane suburbs ---
  {
    slug: "fortitude-valley",
    name: "Fortitude Valley",
    state: "QLD",
    medianPrice: 680_000,
    description:
      "Fortitude Valley is Brisbane's entertainment and nightlife hub, home to Chinatown, James Street boutiques, live music venues, and a growing number of high-rise apartments.",
    marketInsight:
      "The Valley's transformation from entertainment precinct to residential hub continues. New apartment developments target young professionals and investors.",
    nearbySuburbs: ["new-farm", "south-bank", "paddington-qld", "west-end"],
  },
  {
    slug: "south-bank",
    name: "South Bank",
    state: "QLD",
    medianPrice: 750_000,
    description:
      "South Bank is Brisbane's cultural heart, home to the Gallery of Modern Art, Queensland Performing Arts Centre, Streets Beach, and a popular riverside dining precinct.",
    marketInsight:
      "South Bank's lifestyle appeal and proximity to the CBD support strong apartment demand. The 2032 Olympics precinct will further boost the area's profile.",
    nearbySuburbs: ["west-end", "fortitude-valley", "new-farm", "woolloongabba"],
  },
  {
    slug: "new-farm",
    name: "New Farm",
    state: "QLD",
    medianPrice: 1_650_000,
    description:
      "New Farm is one of Brisbane's most prestigious inner suburbs, known for its Queenslander homes, New Farm Park, the Powerhouse arts centre, and riverside walks.",
    marketInsight:
      "New Farm is one of Brisbane's tightest-held suburbs. Character Queenslander homes on large lots are in extremely high demand with limited turnover.",
    nearbySuburbs: ["fortitude-valley", "paddington-qld", "south-bank", "toowong"],
  },
  {
    slug: "paddington-qld",
    name: "Paddington",
    state: "QLD",
    medianPrice: 1_300_000,
    description:
      "Paddington in Brisbane's inner west is known for its character Queenslander homes, Latrobe Terrace cafes, Suncorp Stadium, and antique shop precinct along Given Terrace.",
    marketInsight:
      "Paddington's heritage homes on large lots are in high demand. The suburb benefits from limited new supply, supporting steady price growth.",
    nearbySuburbs: ["new-farm", "toowong", "fortitude-valley", "west-end"],
  },
  {
    slug: "west-end",
    name: "West End",
    state: "QLD",
    medianPrice: 1_100_000,
    description:
      "West End is a progressive inner Brisbane suburb known for its weekend markets, multicultural dining on Boundary Street, and a mix of Queenslanders and modern apartments.",
    marketInsight:
      "West End's village atmosphere and walkability drive strong demand. The suburb's proximity to South Bank and the CBD supports consistent price growth.",
    nearbySuburbs: ["south-bank", "paddington-qld", "fortitude-valley", "toowong"],
  },
  {
    slug: "toowong",
    name: "Toowong",
    state: "QLD",
    medianPrice: 1_050_000,
    description:
      "Toowong is a leafy inner-western Brisbane suburb close to the University of Queensland, with a major shopping village, good bus and ferry connections, and river access.",
    marketInsight:
      "Toowong's proximity to UQ and the CBD supports strong rental demand. Family homes on hillside blocks with city views attract premium prices.",
    nearbySuburbs: ["paddington-qld", "indooroopilly", "west-end", "new-farm"],
  },
  {
    slug: "woolloongabba",
    name: "Woolloongabba",
    state: "QLD",
    medianPrice: 1_000_000,
    description:
      "Woolloongabba is an inner Brisbane suburb centred around the Gabba cricket ground, with a growing dining scene on Logan Road and easy access to South Bank and the CBD.",
    marketInsight:
      "The Cross River Rail station at Woolloongabba and the 2032 Olympics redevelopment of the Gabba are expected to significantly boost property values.",
    nearbySuburbs: ["south-bank", "west-end", "fortitude-valley", "carindale"],
  },
  {
    slug: "chermside",
    name: "Chermside",
    state: "QLD",
    medianPrice: 780_000,
    description:
      "Chermside is a major suburban centre in Brisbane's north, anchored by Westfield Chermside — one of Queensland's largest shopping centres — and the Prince Charles Hospital.",
    marketInsight:
      "Chermside offers good value compared to inner Brisbane. Its retail and medical precinct provides strong local employment and rental demand.",
    nearbySuburbs: ["fortitude-valley", "new-farm", "carindale", "indooroopilly"],
  },
  {
    slug: "carindale",
    name: "Carindale",
    state: "QLD",
    medianPrice: 950_000,
    description:
      "Carindale is a family-friendly suburb in Brisbane's south-east, home to Westfield Carindale and surrounded by parklands, good schools, and quiet residential streets.",
    marketInsight:
      "Carindale's large family homes and school zone appeal drive steady demand. The suburb offers a suburban lifestyle within 15 minutes of the CBD.",
    nearbySuburbs: ["woolloongabba", "chermside", "indooroopilly", "south-bank"],
  },
  {
    slug: "indooroopilly",
    name: "Indooroopilly",
    state: "QLD",
    medianPrice: 1_200_000,
    description:
      "Indooroopilly is a popular family suburb in Brisbane's western suburbs, known for Indooroopilly Shopping Centre, riverside parks, and proximity to the University of Queensland.",
    marketInsight:
      "Indooroopilly benefits from strong school catchment demand and UQ proximity. Large blocks with river views command significant premiums.",
    nearbySuburbs: ["toowong", "paddington-qld", "carindale", "chermside"],
  },

  // --- WA: Perth suburbs ---
  {
    slug: "fremantle",
    name: "Fremantle",
    state: "WA",
    medianPrice: 850_000,
    description:
      "Fremantle is Perth's historic port city, famous for its maritime heritage, cappuccino strip, weekend markets, and the restored Fremantle Prison World Heritage site.",
    marketInsight:
      "Fremantle's character and lifestyle appeal attract both owner-occupiers and investors. The port precinct redevelopment is expected to enhance the area's amenity.",
    nearbySuburbs: ["cottesloe", "subiaco", "rockingham", "joondalup"],
  },
  {
    slug: "subiaco",
    name: "Subiaco",
    state: "WA",
    medianPrice: 1_350_000,
    description:
      "Subiaco is an affluent inner Perth suburb known for its heritage streetscapes, Rokeby Road shopping, proximity to Kings Park, and the Subiaco Oval redevelopment precinct.",
    marketInsight:
      "Subiaco is one of Perth's most sought-after suburbs. The Subi East redevelopment on the former Subiaco Oval site is adding new housing and amenity.",
    nearbySuburbs: ["cottesloe", "fremantle", "joondalup", "rockingham"],
  },
  {
    slug: "cottesloe",
    name: "Cottesloe",
    state: "WA",
    medianPrice: 2_200_000,
    description:
      "Cottesloe is Perth's premier beachside suburb, renowned for its white-sand beach, Norfolk pines, the Indiana Teahouse, and heritage character homes.",
    marketInsight:
      "Cottesloe is a tightly held market with limited stock. Properties near the beach attract premium pricing, particularly freestanding homes with ocean views.",
    nearbySuburbs: ["subiaco", "fremantle", "joondalup", "rockingham"],
  },
  {
    slug: "joondalup",
    name: "Joondalup",
    state: "WA",
    medianPrice: 650_000,
    description:
      "Joondalup is a major suburban centre in Perth's north, home to Lakeside Joondalup shopping city, Edith Cowan University, and the Joondalup Health Campus.",
    marketInsight:
      "Joondalup offers affordable family housing with excellent amenity. The suburb's self-contained nature with retail, education, and health services supports demand.",
    nearbySuburbs: ["fremantle", "subiaco", "cottesloe", "rockingham"],
  },
  {
    slug: "rockingham",
    name: "Rockingham",
    state: "WA",
    medianPrice: 550_000,
    description:
      "Rockingham is a coastal suburb south of Perth, offering affordable beachside living, a revitalised foreshore, and access to Shoalwater Islands Marine Park.",
    marketInsight:
      "Rockingham is one of Perth's most affordable coastal options. The foreshore redevelopment and improved rail links are driving increased buyer interest.",
    nearbySuburbs: ["fremantle", "joondalup", "subiaco", "cottesloe"],
  },

  // --- SA: Adelaide suburbs ---
  {
    slug: "glenelg",
    name: "Glenelg",
    state: "SA",
    medianPrice: 850_000,
    description:
      "Glenelg is Adelaide's best-known beachside suburb, connected to the CBD by the iconic tram line and offering a resort-like lifestyle centred around Jetty Road and Moseley Square.",
    marketInsight:
      "Glenelg offers beachside living at a fraction of east-coast equivalents. The tram connection and Jetty Road precinct underpin consistent demand.",
    nearbySuburbs: ["norwood", "prospect", "unley", "henley-beach"],
  },
  {
    slug: "norwood",
    name: "Norwood",
    state: "SA",
    medianPrice: 1_100_000,
    description:
      "Norwood is one of Adelaide's most established inner suburbs, known for The Parade shopping strip, heritage homes, excellent schools, and a European village atmosphere.",
    marketInsight:
      "Norwood is one of Adelaide's premium suburbs with strong demand for character homes. The Parade's cafe culture and boutique retail drive lifestyle appeal.",
    nearbySuburbs: ["unley", "prospect", "glenelg", "henley-beach"],
  },
  {
    slug: "prospect",
    name: "Prospect",
    state: "SA",
    medianPrice: 850_000,
    description:
      "Prospect is a popular inner-north Adelaide suburb known for its tree-lined streets, character bungalows, Prospect Road cafes, and growing dining scene.",
    marketInsight:
      "Prospect has gentrified significantly, attracting young families and professionals. Its village atmosphere and proximity to the CBD support consistent demand.",
    nearbySuburbs: ["norwood", "unley", "glenelg", "henley-beach"],
  },
  {
    slug: "unley",
    name: "Unley",
    state: "SA",
    medianPrice: 1_200_000,
    description:
      "Unley is an affluent inner-south Adelaide suburb with heritage homes, King William Road boutiques, and tree-lined streets close to the Adelaide CBD and parklands.",
    marketInsight:
      "Unley is one of Adelaide's most prestigious suburbs. Period homes in the Unley Park area command among the highest prices in South Australia.",
    nearbySuburbs: ["norwood", "prospect", "glenelg", "henley-beach"],
  },
  {
    slug: "henley-beach",
    name: "Henley Beach",
    state: "SA",
    medianPrice: 1_050_000,
    description:
      "Henley Beach is a popular beachside suburb west of Adelaide CBD, known for its jetty, Henley Square dining precinct, and family-friendly coastal lifestyle.",
    marketInsight:
      "Henley Beach has seen strong price growth as Adelaide's broader market surges. The suburb offers beachside living with good value compared to Glenelg.",
    nearbySuburbs: ["glenelg", "prospect", "norwood", "unley"],
  },

  // --- TAS: Hobart ---
  {
    slug: "sandy-bay",
    name: "Sandy Bay",
    state: "TAS",
    medianPrice: 1_050_000,
    description:
      "Sandy Bay is Hobart's premier suburb, home to the University of Tasmania, the Wrest Point Casino, Sandy Bay Beach, and upmarket shopping on Sandy Bay Road.",
    marketInsight:
      "Sandy Bay is Hobart's most sought-after suburb with harbour and mountain views. The university and hospital precinct provide a stable rental market.",
    nearbySuburbs: [],
  },

  // --- ACT: Canberra ---
  {
    slug: "braddon",
    name: "Braddon",
    state: "ACT",
    medianPrice: 680_000,
    description:
      "Braddon is Canberra's trendiest inner suburb, known for Lonsdale Street's cafes, bars, and boutiques, street art, and a growing apartment market close to Civic.",
    marketInsight:
      "Braddon is predominantly apartments, attracting young professionals and public servants. Its walkable lifestyle precinct drives strong rental demand.",
    nearbySuburbs: [],
  },

  // --- NT: Darwin ---
  {
    slug: "nightcliff",
    name: "Nightcliff",
    state: "NT",
    medianPrice: 520_000,
    description:
      "Nightcliff is a popular Darwin suburb known for its foreshore markets, waterfront pool, tropical lifestyle, and sunset views over the Timor Sea.",
    marketInsight:
      "Nightcliff offers waterfront living at Darwin's most affordable coastal price point. The popular foreshore precinct and markets add lifestyle appeal.",
    nearbySuburbs: [],
  },

  // --- QLD: Gold Coast ---
  {
    slug: "surfers-paradise",
    name: "Surfers Paradise",
    state: "QLD",
    medianPrice: 850_000,
    description:
      "Surfers Paradise is the Gold Coast's premier beachfront destination, famous for its high-rise skyline, nightlife, theme parks, and kilometres of golden sand beach.",
    marketInsight:
      "Post-pandemic migration to the Gold Coast has driven strong price growth. Beachfront units command premium prices and rental yields from short-stay tourism.",
    nearbySuburbs: ["fortitude-valley", "south-bank", "new-farm", "woolloongabba"],
  },

  // --- NSW: Newcastle ---
  {
    slug: "merewether",
    name: "Merewether",
    state: "NSW",
    medianPrice: 1_500_000,
    description:
      "Merewether is Newcastle's premier beachside suburb, known for Merewether Beach, the ocean baths, The Junction dining precinct, and a relaxed coastal lifestyle.",
    marketInsight:
      "Merewether benefits from Newcastle's growing appeal as a lifestyle alternative to Sydney. Beachside homes are tightly held with strong auction competition.",
    nearbySuburbs: ["bondi", "manly", "surry-hills", "newtown"],
  },
];

export const SLUG_TO_SUBURB: Record<string, StampDutySuburb> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);
