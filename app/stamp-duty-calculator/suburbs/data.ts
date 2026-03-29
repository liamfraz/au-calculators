import type { StateCode } from "../../calculators/stamp-duty/constants";

export interface StampDutySuburb {
  slug: string;
  name: string;
  state: StateCode;
  postcode: string;
  medianPrice: number;
  description: string;
  marketInsight: string;
  nearbySuburbs: string[]; // slugs
}

// 50 major Australian suburbs — approximate 2025–2026 median house prices
// Sources: CoreLogic, Domain, REA Group publicly reported medians
// 10 each: Sydney, Melbourne, Brisbane, Perth, Adelaide

export const SUBURBS: StampDutySuburb[] = [
  // ─── Sydney (NSW) ─────────────────────────────────────────────────────
  {
    slug: "parramatta",
    name: "Parramatta",
    state: "NSW",
    postcode: "2150",
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
    postcode: "2026",
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
    postcode: "2067",
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
    postcode: "2750",
    medianPrice: 850_000,
    description:
      "Penrith is a major centre in Western Sydney at the foot of the Blue Mountains, offering affordable housing, growing infrastructure, and proximity to the new Western Sydney Airport.",
    marketInsight:
      "Penrith has benefited from the Western Sydney Aerotropolis and new metro rail. It remains one of Sydney's most affordable entry points for house buyers.",
    nearbySuburbs: ["blacktown", "parramatta", "liverpool", "bankstown"],
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    state: "NSW",
    postcode: "2170",
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
    postcode: "2148",
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
    postcode: "2095",
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
    postcode: "2010",
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
    postcode: "2042",
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
    postcode: "2200",
    medianPrice: 950_000,
    description:
      "Bankstown is a thriving multicultural centre in South Western Sydney with a major shopping district, diverse food scene, and improving transport connections.",
    marketInsight:
      "The Sydney Metro Southwest extension is boosting Bankstown's appeal. Property prices remain accessible compared to inner suburbs while offering good rental yields.",
    nearbySuburbs: ["liverpool", "parramatta", "blacktown", "penrith"],
  },

  // ─── Melbourne (VIC) ──────────────────────────────────────────────────
  {
    slug: "richmond",
    name: "Richmond",
    state: "VIC",
    postcode: "3121",
    medianPrice: 1_350_000,
    description:
      "Richmond is a vibrant inner Melbourne suburb known for Bridge Road and Swan Street shopping strips, Victoria Street's Vietnamese restaurants, and proximity to the MCG.",
    marketInsight:
      "Richmond's mix of period homes and modern apartments appeals to a broad market. Excellent tram and train access makes it one of Melbourne's most connected suburbs.",
    nearbySuburbs: ["south-yarra", "fitzroy", "carlton", "brunswick"],
  },
  {
    slug: "st-kilda",
    name: "St Kilda",
    state: "VIC",
    postcode: "3182",
    medianPrice: 1_200_000,
    description:
      "St Kilda is Melbourne's iconic beachside suburb, home to Luna Park, the Esplanade, Acland Street cake shops, and a famous Sunday market along the foreshore.",
    marketInsight:
      "St Kilda offers beachside living at a more accessible price point than Sydney equivalents. The suburb's lifestyle appeal keeps demand strong across units and houses.",
    nearbySuburbs: ["south-yarra", "richmond", "fitzroy", "carlton"],
  },
  {
    slug: "south-yarra",
    name: "South Yarra",
    state: "VIC",
    postcode: "3141",
    medianPrice: 1_500_000,
    description:
      "South Yarra is one of Melbourne's most vibrant inner suburbs, known for Chapel Street shopping, the Royal Botanic Gardens, and a diverse property mix from terraces to luxury apartments.",
    marketInsight:
      "South Yarra's proximity to the CBD and lifestyle amenities underpins strong demand. The suburb attracts professionals, downsizers, and investors.",
    nearbySuburbs: ["richmond", "st-kilda", "fitzroy", "carlton"],
  },
  {
    slug: "fitzroy",
    name: "Fitzroy",
    state: "VIC",
    postcode: "3065",
    medianPrice: 1_400_000,
    description:
      "Fitzroy is Melbourne's original bohemian suburb, known for Brunswick Street's bars, galleries, and vintage shops, and Smith Street's evolving dining scene.",
    marketInsight:
      "Fitzroy's character terraces and warehouse conversions command premium prices. Limited housing stock keeps competition fierce at auction.",
    nearbySuburbs: ["carlton", "richmond", "brunswick", "south-yarra"],
  },
  {
    slug: "carlton",
    name: "Carlton",
    state: "VIC",
    postcode: "3053",
    medianPrice: 1_250_000,
    description:
      "Carlton is Melbourne's Italian quarter, home to Lygon Street's famous restaurants, the University of Melbourne, and elegant Victorian terraces near the CBD.",
    marketInsight:
      "Carlton benefits from proximity to the University of Melbourne and the CBD. Heritage overlays protect the suburb's character, limiting new development and supporting prices.",
    nearbySuburbs: ["fitzroy", "richmond", "brunswick", "south-yarra"],
  },
  {
    slug: "brunswick",
    name: "Brunswick",
    state: "VIC",
    postcode: "3056",
    medianPrice: 1_100_000,
    description:
      "Brunswick is a trendy inner-north Melbourne suburb famous for Sydney Road's eclectic dining, live music venues, and a thriving arts and counter-culture scene.",
    marketInsight:
      "Brunswick attracts young professionals and creatives. The mix of period homes and new apartments keeps the market diverse and competitive.",
    nearbySuburbs: ["carlton", "fitzroy", "richmond", "south-yarra"],
  },
  {
    slug: "brighton",
    name: "Brighton",
    state: "VIC",
    postcode: "3186",
    medianPrice: 2_800_000,
    description:
      "Brighton is an affluent bayside suburb in Melbourne's south-east, famous for its colourful bathing boxes, sandy beach, and prestigious family homes.",
    marketInsight:
      "Brighton is one of Melbourne's most tightly held suburbs. Bayside living with top schools and village shopping drives consistent demand from established families.",
    nearbySuburbs: ["south-yarra", "st-kilda", "richmond", "fitzroy"],
  },
  {
    slug: "glen-waverley",
    name: "Glen Waverley",
    state: "VIC",
    postcode: "3150",
    medianPrice: 1_350_000,
    description:
      "Glen Waverley is a popular family suburb in Melbourne's south-east, home to The Glen shopping centre, top-performing schools, and a vibrant Asian dining precinct.",
    marketInsight:
      "Glen Waverley's reputation for excellent schools drives strong competition from families, particularly for larger homes near Glen Waverley Secondary College.",
    nearbySuburbs: ["richmond", "south-yarra", "brighton", "carlton"],
  },
  {
    slug: "footscray",
    name: "Footscray",
    state: "VIC",
    postcode: "3011",
    medianPrice: 800_000,
    description:
      "Footscray is an inner-west Melbourne suburb undergoing significant gentrification, with diverse food markets, arts spaces, and excellent train connections to the CBD.",
    marketInsight:
      "Footscray offers some of inner Melbourne's best value. Ongoing urban renewal and proximity to the CBD are driving steady capital growth.",
    nearbySuburbs: ["brunswick", "carlton", "fitzroy", "richmond"],
  },
  {
    slug: "frankston",
    name: "Frankston",
    state: "VIC",
    postcode: "3199",
    medianPrice: 720_000,
    description:
      "Frankston is a bayside suburb at the gateway to the Mornington Peninsula, with a revitalised waterfront, growing dining scene, and direct train to the CBD.",
    marketInsight:
      "Frankston's waterfront revitalisation has lifted the suburb's profile. Affordable beachside living continues to attract first home buyers and investors.",
    nearbySuburbs: ["brighton", "glen-waverley", "st-kilda", "south-yarra"],
  },

  // ─── Brisbane (QLD) ───────────────────────────────────────────────────
  {
    slug: "paddington-qld",
    name: "Paddington",
    state: "QLD",
    postcode: "4064",
    medianPrice: 1_350_000,
    description:
      "Paddington in Brisbane's inner west is known for its character Queenslander homes, Latrobe Terrace cafes, and proximity to Suncorp Stadium and the CBD.",
    marketInsight:
      "Paddington's heritage homes on large lots are in high demand. The suburb benefits from limited new supply, supporting steady price growth.",
    nearbySuburbs: ["west-end-qld", "woolloongabba", "newstead", "indooroopilly"],
  },
  {
    slug: "newstead",
    name: "Newstead",
    state: "QLD",
    postcode: "4006",
    medianPrice: 900_000,
    description:
      "Newstead is Brisbane's fastest-transforming inner suburb, with riverfront apartments, James Street dining precinct, and easy CBD access.",
    marketInsight:
      "Newstead has seen significant new development. Off-the-plan purchases remain popular with investors targeting the Brisbane 2032 Olympics growth corridor.",
    nearbySuburbs: ["paddington-qld", "west-end-qld", "woolloongabba", "nundah"],
  },
  {
    slug: "west-end-qld",
    name: "West End",
    state: "QLD",
    postcode: "4101",
    medianPrice: 1_150_000,
    description:
      "West End is a trendy inner-city suburb on the Brisbane River, known for its multicultural markets, eclectic dining, and strong arts community.",
    marketInsight:
      "West End's proximity to South Bank and the CBD, combined with its village character, makes it one of Brisbane's most desirable inner suburbs.",
    nearbySuburbs: ["paddington-qld", "woolloongabba", "newstead", "indooroopilly"],
  },
  {
    slug: "chermside",
    name: "Chermside",
    state: "QLD",
    postcode: "4032",
    medianPrice: 800_000,
    description:
      "Chermside is a major northside suburb anchored by Westfield Chermside, one of Queensland's largest shopping centres, with proximity to the Prince Charles Hospital.",
    marketInsight:
      "Chermside offers good value for Brisbane's northside with a strong rental market driven by proximity to the hospital and retail employment.",
    nearbySuburbs: ["nundah", "newstead", "paddington-qld", "indooroopilly"],
  },
  {
    slug: "indooroopilly",
    name: "Indooroopilly",
    state: "QLD",
    postcode: "4068",
    medianPrice: 1_200_000,
    description:
      "Indooroopilly is a leafy western suburb popular with families, home to Indooroopilly Shopping Centre, proximity to the University of Queensland, and quality schools.",
    marketInsight:
      "Indooroopilly benefits from proximity to UQ and strong school catchments. Family homes on larger blocks attract competitive bidding.",
    nearbySuburbs: ["paddington-qld", "west-end-qld", "chermside", "carindale"],
  },
  {
    slug: "surfers-paradise",
    name: "Surfers Paradise",
    state: "QLD",
    postcode: "4217",
    medianPrice: 850_000,
    description:
      "Surfers Paradise is the Gold Coast's premier beachfront suburb, popular with owner-occupiers, holiday-let investors, and lifestyle seekers.",
    marketInsight:
      "Post-pandemic migration to the Gold Coast has driven strong price growth. Beachfront units command premium prices and rental yields.",
    nearbySuburbs: ["paddington-qld", "newstead", "west-end-qld", "chermside"],
  },
  {
    slug: "woolloongabba",
    name: "Woolloongabba",
    state: "QLD",
    postcode: "4102",
    medianPrice: 1_000_000,
    description:
      "Woolloongabba is an inner-south suburb adjacent to the Gabba cricket ground, undergoing major transformation as Brisbane's 2032 Olympics precinct.",
    marketInsight:
      "The 2032 Olympics redevelopment of the Gabba is set to transform Woolloongabba. Early investment in the area is driven by anticipated infrastructure upgrades.",
    nearbySuburbs: ["west-end-qld", "paddington-qld", "newstead", "carindale"],
  },
  {
    slug: "carindale",
    name: "Carindale",
    state: "QLD",
    postcode: "4152",
    medianPrice: 1_050_000,
    description:
      "Carindale is an established eastside suburb known for Westfield Carindale, family-friendly streets, and proximity to Belmont Bushland reserves.",
    marketInsight:
      "Carindale's combination of retail convenience, green spaces, and established housing stock makes it a reliable family suburb with steady growth.",
    nearbySuburbs: ["woolloongabba", "indooroopilly", "chermside", "nundah"],
  },
  {
    slug: "nundah",
    name: "Nundah",
    state: "QLD",
    postcode: "4012",
    medianPrice: 850_000,
    description:
      "Nundah is a vibrant northside village suburb with a popular weekend farmers market, diverse dining on Sandgate Road, and excellent train connectivity.",
    marketInsight:
      "Nundah's village atmosphere and train station access have made it increasingly popular. The suburb offers a blend of renovated Queenslanders and modern apartments.",
    nearbySuburbs: ["chermside", "newstead", "woolloongabba", "paddington-qld"],
  },
  {
    slug: "springfield",
    name: "Springfield",
    state: "QLD",
    postcode: "4300",
    medianPrice: 650_000,
    description:
      "Springfield is a master-planned community in Brisbane's south-west corridor, with its own town centre, university campus, and direct rail to the CBD.",
    marketInsight:
      "Springfield's master-planned infrastructure and affordability attract first home buyers. The Springfield Central rail station provides direct CBD access.",
    nearbySuburbs: ["indooroopilly", "woolloongabba", "paddington-qld", "chermside"],
  },

  // ─── Perth (WA) ───────────────────────────────────────────────────────
  {
    slug: "cottesloe",
    name: "Cottesloe",
    state: "WA",
    postcode: "6011",
    medianPrice: 2_200_000,
    description:
      "Cottesloe is Perth's premier beachside suburb, renowned for its white-sand beach, Norfolk pines, and heritage character homes near the Indian Ocean.",
    marketInsight:
      "Cottesloe is a tightly held market with limited stock. Properties near the beach attract premium pricing, particularly freestanding homes.",
    nearbySuburbs: ["fremantle", "subiaco", "scarborough", "claremont"],
  },
  {
    slug: "fremantle",
    name: "Fremantle",
    state: "WA",
    postcode: "6160",
    medianPrice: 900_000,
    description:
      "Fremantle is Perth's historic port city, known for its well-preserved heritage architecture, vibrant markets, cappuccino strip, and thriving arts scene.",
    marketInsight:
      "Fremantle's heritage character and creative culture set it apart. The suburb attracts buyers seeking an alternative to Perth's suburban norm.",
    nearbySuburbs: ["cottesloe", "scarborough", "rockingham", "subiaco"],
  },
  {
    slug: "subiaco",
    name: "Subiaco",
    state: "WA",
    postcode: "6008",
    medianPrice: 1_400_000,
    description:
      "Subiaco is an inner-city suburb just west of Perth CBD, known for its heritage streetscapes, Rokeby Road cafes, and proximity to Kings Park.",
    marketInsight:
      "Subiaco's walkability and inner-city charm attract professionals and downsizers. The former Subiaco Oval redevelopment is bringing new housing stock.",
    nearbySuburbs: ["cottesloe", "claremont", "nedlands", "victoria-park"],
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    state: "WA",
    postcode: "6019",
    medianPrice: 800_000,
    description:
      "Scarborough is Perth's most popular beach suburb, with a recently redeveloped beachfront precinct featuring pools, parks, restaurants, and surf breaks.",
    marketInsight:
      "The Scarborough Beach redevelopment has transformed the suburb's appeal. New apartments and dining precincts have driven strong price growth since 2023.",
    nearbySuburbs: ["cottesloe", "joondalup", "fremantle", "morley"],
  },
  {
    slug: "joondalup",
    name: "Joondalup",
    state: "WA",
    postcode: "6027",
    medianPrice: 650_000,
    description:
      "Joondalup is a major suburban centre in Perth's northern corridor, with a university, hospital, lakeside shopping, and direct train to the CBD.",
    marketInsight:
      "Joondalup's self-contained amenities — university, hospital, and Lakeside Shopping City — make it a popular choice for families and first home buyers.",
    nearbySuburbs: ["scarborough", "morley", "cottesloe", "fremantle"],
  },
  {
    slug: "rockingham",
    name: "Rockingham",
    state: "WA",
    postcode: "6168",
    medianPrice: 550_000,
    description:
      "Rockingham is a coastal city south of Perth with a relaxed beach lifestyle, foreshore dining, and proximity to Garden Island and Penguin Island.",
    marketInsight:
      "Rockingham is one of Perth's most affordable coastal options. Strong population growth and the foreshore upgrade continue to attract buyers.",
    nearbySuburbs: ["fremantle", "joondalup", "victoria-park", "morley"],
  },
  {
    slug: "nedlands",
    name: "Nedlands",
    state: "WA",
    postcode: "6009",
    medianPrice: 1_800_000,
    description:
      "Nedlands is a prestigious western suburb home to the University of Western Australia, leafy streets, and river-facing properties along the Swan River.",
    marketInsight:
      "Nedlands benefits from proximity to UWA, QEII Medical Centre, and the river. Large family homes in the suburb's prime streets are tightly held.",
    nearbySuburbs: ["subiaco", "claremont", "cottesloe", "victoria-park"],
  },
  {
    slug: "claremont",
    name: "Claremont",
    state: "WA",
    postcode: "6010",
    medianPrice: 1_850_000,
    description:
      "Claremont is an affluent western suburb known for its premium shopping quarter, proximity to the Swan River, and some of Perth's best private schools.",
    marketInsight:
      "Claremont's school catchments and village retail drive consistent demand. The suburb is popular with families seeking prestigious western suburbs living.",
    nearbySuburbs: ["nedlands", "subiaco", "cottesloe", "fremantle"],
  },
  {
    slug: "morley",
    name: "Morley",
    state: "WA",
    postcode: "6062",
    medianPrice: 620_000,
    description:
      "Morley is a well-connected suburb in Perth's north-east with Galleria shopping centre, diverse dining options, and good access to the CBD via Tonkin Highway.",
    marketInsight:
      "Morley offers solid value with a strong community feel. Its central location and retail amenities make it popular with both families and investors.",
    nearbySuburbs: ["joondalup", "scarborough", "victoria-park", "subiaco"],
  },
  {
    slug: "victoria-park",
    name: "Victoria Park",
    state: "WA",
    postcode: "6100",
    medianPrice: 750_000,
    description:
      "Victoria Park is a vibrant inner-south suburb known for Albany Highway's cafe strip, multicultural dining, and close proximity to the Perth CBD and Crown Perth.",
    marketInsight:
      "Victoria Park's gentrification and dining scene have lifted its profile. The suburb offers inner-city living at a fraction of western suburb prices.",
    nearbySuburbs: ["subiaco", "fremantle", "morley", "scarborough"],
  },

  // ─── Adelaide (SA) ────────────────────────────────────────────────────
  {
    slug: "glenelg",
    name: "Glenelg",
    state: "SA",
    postcode: "5045",
    medianPrice: 850_000,
    description:
      "Glenelg is Adelaide's best-known beachside suburb, connected to the CBD by the iconic tram line and offering a resort-like lifestyle year-round.",
    marketInsight:
      "Glenelg offers beachside living at a fraction of east-coast equivalents. The tram connection and Jetty Road precinct underpin consistent demand.",
    nearbySuburbs: ["henley-beach", "semaphore", "unley", "norwood"],
  },
  {
    slug: "norwood",
    name: "Norwood",
    state: "SA",
    postcode: "5067",
    medianPrice: 1_100_000,
    description:
      "Norwood is one of Adelaide's most established inner suburbs, known for The Parade shopping strip, heritage stone villas, and a thriving cafe culture.",
    marketInsight:
      "Norwood's character homes on The Parade precinct are highly sought after. Limited turnover and strong lifestyle appeal keep prices consistently elevated.",
    nearbySuburbs: ["unley", "prospect", "glenelg", "henley-beach"],
  },
  {
    slug: "unley",
    name: "Unley",
    state: "SA",
    postcode: "5061",
    medianPrice: 1_050_000,
    description:
      "Unley is a leafy inner-south suburb popular with families, featuring tree-lined streets, heritage homes, Unley Road shopping, and excellent schools.",
    marketInsight:
      "Unley's school catchments and character homes drive strong competition at auction. The suburb appeals to families upsizing from inner-city apartments.",
    nearbySuburbs: ["norwood", "glenelg", "prospect", "henley-beach"],
  },
  {
    slug: "prospect",
    name: "Prospect",
    state: "SA",
    postcode: "5082",
    medianPrice: 850_000,
    description:
      "Prospect is a vibrant inner-north suburb with a thriving main street of cafes, boutiques, and the Prospect Road dining precinct just minutes from the CBD.",
    marketInsight:
      "Prospect has emerged as one of Adelaide's trendiest suburbs. Young professionals and families are drawn by the village atmosphere and inner-city proximity.",
    nearbySuburbs: ["norwood", "unley", "glenelg", "modbury"],
  },
  {
    slug: "henley-beach",
    name: "Henley Beach",
    state: "SA",
    postcode: "5022",
    medianPrice: 1_200_000,
    description:
      "Henley Beach is a popular coastal suburb in Adelaide's west, offering a long sandy beach, Henley Square dining precinct, and a family-friendly lifestyle.",
    marketInsight:
      "Henley Beach's coastal premium continues to grow as Adelaide's beachside suburbs attract more buyers priced out of east-coast equivalents.",
    nearbySuburbs: ["glenelg", "semaphore", "prospect", "norwood"],
  },
  {
    slug: "semaphore",
    name: "Semaphore",
    state: "SA",
    postcode: "5019",
    medianPrice: 800_000,
    description:
      "Semaphore is a charming coastal suburb in Adelaide's west, known for its heritage main street, classic cinema, fish and chips, and relaxed beachside community.",
    marketInsight:
      "Semaphore's old-world charm and beachside lifestyle have attracted growing interest. It offers a more affordable coastal alternative to Glenelg and Henley Beach.",
    nearbySuburbs: ["henley-beach", "glenelg", "prospect", "elizabeth"],
  },
  {
    slug: "elizabeth",
    name: "Elizabeth",
    state: "SA",
    postcode: "5112",
    medianPrice: 380_000,
    description:
      "Elizabeth is a major suburban centre in Adelaide's northern corridor with Elizabeth City Centre, Lyell McEwin Hospital, and direct train access to the CBD.",
    marketInsight:
      "Elizabeth offers some of Adelaide's most affordable housing. Investor activity is strong due to high rental yields and ongoing public housing renewal programs.",
    nearbySuburbs: ["modbury", "prospect", "semaphore", "glenelg"],
  },
  {
    slug: "modbury",
    name: "Modbury",
    state: "SA",
    postcode: "5092",
    medianPrice: 600_000,
    description:
      "Modbury is a well-established north-eastern suburb with Tea Tree Plaza shopping centre, the O-Bahn busway providing fast CBD access, and proximity to the Adelaide Hills.",
    marketInsight:
      "Modbury's O-Bahn connection gives it one of Adelaide's fastest commutes. The suburb offers good value for families with established infrastructure.",
    nearbySuburbs: ["prospect", "elizabeth", "norwood", "unley"],
  },
  {
    slug: "marion",
    name: "Marion",
    state: "SA",
    postcode: "5043",
    medianPrice: 650_000,
    description:
      "Marion is a southern suburbs hub anchored by Westfield Marion, South Australia's largest shopping centre, with good access to Flinders University and the beach.",
    marketInsight:
      "Marion's proximity to Westfield Marion and the Darlington upgrade has improved connectivity. The suburb attracts families and investors seeking southern suburbs value.",
    nearbySuburbs: ["glenelg", "unley", "henley-beach", "semaphore"],
  },
  {
    slug: "adelaide-cbd",
    name: "Adelaide CBD",
    state: "SA",
    postcode: "5000",
    medianPrice: 600_000,
    description:
      "Adelaide CBD sits within the parklands ring, offering a walkable city lifestyle with access to the Central Market, Rundle Mall, and the River Torrens.",
    marketInsight:
      "Adelaide has been one of Australia's best-performing markets since 2023, with the CBD offering strong rental yields and capital growth.",
    nearbySuburbs: ["norwood", "unley", "prospect", "glenelg"],
  },
];

export const SLUG_TO_SUBURB: Record<string, StampDutySuburb> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);

export const SUBURBS_BY_STATE: Record<string, StampDutySuburb[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.state]) acc[s.state] = [];
    acc[s.state].push(s);
    return acc;
  },
  {} as Record<string, StampDutySuburb[]>
);
