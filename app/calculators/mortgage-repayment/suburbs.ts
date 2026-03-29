export interface SuburbData {
  slug: string;
  name: string;
  state: string;
  city: string;
  medianPrice: number;
  avgLoanSize: number;
  typicalDeposit: number;
  description: string;
  marketInsight: string;
}

// 50 high-population Australian suburbs — approximate 2025–2026 median house/unit prices
// Sources: CoreLogic, Domain, REA Group publicly reported medians
// 10 suburbs each: Sydney, Melbourne, Brisbane, Perth, Adelaide

export const SUBURBS: SuburbData[] = [
  // ─── Sydney (NSW) ─────────────────────────────────────────────────────────────
  {
    slug: "parramatta",
    name: "Parramatta",
    state: "NSW",
    city: "Sydney",
    medianPrice: 950_000,
    avgLoanSize: 760_000,
    typicalDeposit: 190_000,
    description:
      "Parramatta is Sydney's second CBD and a major commercial hub in Western Sydney, with significant infrastructure investment including the Parramatta Light Rail and Western Sydney Airport connections.",
    marketInsight:
      "Parramatta's designation as Sydney's second CBD has driven strong apartment development. Proximity to the new Western Sydney Airport is expected to fuel further growth.",
  },
  {
    slug: "bondi",
    name: "Bondi",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2_800_000,
    avgLoanSize: 2_240_000,
    typicalDeposit: 560_000,
    description:
      "Bondi is one of Australia's most sought-after coastal suburbs, famous for its beach lifestyle, cafes, and strong community feel in Sydney's Eastern Suburbs.",
    marketInsight:
      "Bondi consistently ranks among Sydney's most expensive suburbs. Freestanding homes regularly exceed $3M, while units offer a more accessible entry point.",
  },
  {
    slug: "manly",
    name: "Manly",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2_500_000,
    avgLoanSize: 2_000_000,
    typicalDeposit: 500_000,
    description:
      "Manly is Sydney's Northern Beaches jewel — a ferry ride from Circular Quay with a laid-back beach culture, boutique shops, and national park walks.",
    marketInsight:
      "Manly attracts strong demand from families and professionals seeking beachside living with CBD connectivity. Supply is constrained by geography.",
  },
  {
    slug: "chatswood",
    name: "Chatswood",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_650_000,
    avgLoanSize: 1_320_000,
    typicalDeposit: 330_000,
    description:
      "Chatswood is a bustling commercial and residential centre on Sydney's North Shore, known for its shopping centres, diverse dining, and excellent transport links.",
    marketInsight:
      "Chatswood benefits from strong demand across both houses and apartments, driven by its position as a transport hub on the Metro and T1 North Shore line.",
  },
  {
    slug: "penrith",
    name: "Penrith",
    state: "NSW",
    city: "Sydney",
    medianPrice: 850_000,
    avgLoanSize: 680_000,
    typicalDeposit: 170_000,
    description:
      "Penrith is a major centre in Western Sydney at the foot of the Blue Mountains, offering affordable family homes and growing infrastructure including the new airport precinct.",
    marketInsight:
      "Penrith has seen strong price growth driven by the Western Sydney Airport and Aerotropolis development. It remains one of Sydney's most affordable entry points for houses.",
  },
  {
    slug: "blacktown",
    name: "Blacktown",
    state: "NSW",
    city: "Sydney",
    medianPrice: 880_000,
    avgLoanSize: 704_000,
    typicalDeposit: 176_000,
    description:
      "Blacktown is one of Sydney's largest and most diverse suburbs, with a thriving town centre, strong community facilities, and easy access to the M4 and M7 motorways.",
    marketInsight:
      "Blacktown offers strong value for families seeking houses in Sydney. The suburb benefits from major retail and employment centres, keeping demand consistent.",
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    state: "NSW",
    city: "Sydney",
    medianPrice: 820_000,
    avgLoanSize: 656_000,
    typicalDeposit: 164_000,
    description:
      "Liverpool is a growing regional centre in South-West Sydney with a major hospital, university campus, and proximity to the Western Sydney Aerotropolis.",
    marketInsight:
      "Liverpool is positioned for significant growth as the Western Sydney Airport and surrounding Aerotropolis bring jobs and infrastructure investment to the region.",
  },
  {
    slug: "cronulla",
    name: "Cronulla",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2_100_000,
    avgLoanSize: 1_680_000,
    typicalDeposit: 420_000,
    description:
      "Cronulla is the Sutherland Shire's premier beach suburb, offering a relaxed coastal lifestyle with direct train access to the Sydney CBD.",
    marketInsight:
      "Cronulla's beach lifestyle and train connectivity create strong demand. Limited supply of freestanding homes near the beach keeps prices elevated.",
  },
  {
    slug: "mosman",
    name: "Mosman",
    state: "NSW",
    city: "Sydney",
    medianPrice: 3_500_000,
    avgLoanSize: 2_800_000,
    typicalDeposit: 700_000,
    description:
      "Mosman on Sydney's Lower North Shore is a prestige suburb known for harbour views, Taronga Zoo, and tree-lined streets with heritage homes.",
    marketInsight:
      "Mosman is a trophy suburb with limited housing turnover. Properties with harbour views command significant premiums above the median.",
  },
  {
    slug: "castle-hill",
    name: "Castle Hill",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_550_000,
    avgLoanSize: 1_240_000,
    typicalDeposit: 310_000,
    description:
      "Castle Hill in Sydney's Hills District is a family-friendly suburb with top schools, Castle Towers shopping centre, and the new Sydney Metro Northwest station.",
    marketInsight:
      "The Sydney Metro Northwest has significantly boosted Castle Hill's appeal. Large family homes on generous blocks remain in high demand.",
  },

  // ─── Melbourne (VIC) ──────────────────────────────────────────────────────────
  {
    slug: "south-yarra",
    name: "South Yarra",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_400_000,
    avgLoanSize: 1_120_000,
    typicalDeposit: 280_000,
    description:
      "South Yarra is one of Melbourne's most vibrant inner suburbs, known for Chapel Street shopping, the Royal Botanic Gardens, and a diverse property mix.",
    marketInsight:
      "South Yarra offers a mix of Victorian terraces, Art Deco apartments, and modern developments, appealing to a broad range of buyers.",
  },
  {
    slug: "toorak",
    name: "Toorak",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 3_200_000,
    avgLoanSize: 2_560_000,
    typicalDeposit: 640_000,
    description:
      "Toorak is Melbourne's most prestigious suburb, home to grand estates, luxury boutiques on Toorak Road, and some of Australia's most expensive residential properties.",
    marketInsight:
      "Toorak's median house price consistently leads Melbourne. The suburb attracts high-net-worth buyers, keeping supply tight and prices elevated.",
  },
  {
    slug: "richmond",
    name: "Richmond",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_200_000,
    avgLoanSize: 960_000,
    typicalDeposit: 240_000,
    description:
      "Richmond is an inner-city Melbourne suburb known for its Vietnamese restaurants on Victoria Street, trendy Bridge Road shops, and proximity to the MCG.",
    marketInsight:
      "Richmond's excellent public transport and walkability make it a perennial favourite. Renovated Victorian terraces command strong premiums.",
  },
  {
    slug: "brunswick",
    name: "Brunswick",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_050_000,
    avgLoanSize: 840_000,
    typicalDeposit: 210_000,
    description:
      "Brunswick is a trendy inner-north suburb famous for Sydney Road's eclectic dining, live music venues, and a thriving arts and counter-culture scene.",
    marketInsight:
      "Brunswick attracts young professionals and creatives. The mix of period homes and new apartments keeps the market diverse and competitive.",
  },
  {
    slug: "footscray",
    name: "Footscray",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 780_000,
    avgLoanSize: 624_000,
    typicalDeposit: 156_000,
    description:
      "Footscray is an inner-west Melbourne suburb undergoing significant gentrification, with diverse food markets, arts spaces, and excellent train connections.",
    marketInsight:
      "Footscray offers some of inner Melbourne's best value. Ongoing urban renewal and its proximity to the CBD are driving steady capital growth.",
  },
  {
    slug: "brighton",
    name: "Brighton",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2_800_000,
    avgLoanSize: 2_240_000,
    typicalDeposit: 560_000,
    description:
      "Brighton is an affluent bayside suburb in Melbourne's south-east, famous for its colourful bathing boxes, wide sandy beach, and prestigious family homes.",
    marketInsight:
      "Brighton is one of Melbourne's most tightly held suburbs. Bayside living with top schools and village shopping drives consistent demand from established families.",
  },
  {
    slug: "doncaster",
    name: "Doncaster",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_250_000,
    avgLoanSize: 1_000_000,
    typicalDeposit: 250_000,
    description:
      "Doncaster is a popular eastern suburb known for Westfield Doncaster shopping centre, leafy streets, and strong schools in Melbourne's sought-after east.",
    marketInsight:
      "Doncaster has benefited from consistent demand, particularly from families and downsizers. The suburb's eastern freeway access and future Suburban Rail Loop may boost values further.",
  },
  {
    slug: "frankston",
    name: "Frankston",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 720_000,
    avgLoanSize: 576_000,
    typicalDeposit: 144_000,
    description:
      "Frankston is a bayside suburb at the gateway to the Mornington Peninsula, with a revitalised waterfront, growing dining scene, and direct train to the CBD.",
    marketInsight:
      "Frankston's waterfront revitalisation has lifted the suburb's profile. Affordable beachside living continues to attract first home buyers and investors.",
  },
  {
    slug: "glen-waverley",
    name: "Glen Waverley",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_350_000,
    avgLoanSize: 1_080_000,
    typicalDeposit: 270_000,
    description:
      "Glen Waverley is a popular family suburb in Melbourne's south-east, home to The Glen shopping centre, top-performing schools, and a vibrant Asian dining precinct.",
    marketInsight:
      "Glen Waverley's reputation for excellent schools — including Glen Waverley Secondary College — drives strong competition from families, particularly for larger homes.",
  },
  {
    slug: "st-kilda",
    name: "St Kilda",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_100_000,
    avgLoanSize: 880_000,
    typicalDeposit: 220_000,
    description:
      "St Kilda is Melbourne's iconic beachside suburb, known for Luna Park, the Esplanade, Acland Street cake shops, and a vibrant bar and live music scene.",
    marketInsight:
      "St Kilda offers beach living close to the CBD. The apartment market is dominant, with Art Deco buildings and modern developments attracting a mix of investors and owner-occupiers.",
  },

  // ─── Brisbane (QLD) ───────────────────────────────────────────────────────────
  {
    slug: "paddington-qld",
    name: "Paddington",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 1_300_000,
    avgLoanSize: 1_040_000,
    typicalDeposit: 260_000,
    description:
      "Paddington in Brisbane's inner west is known for its character Queenslander homes, Latrobe Terrace cafes, and proximity to Suncorp Stadium.",
    marketInsight:
      "Paddington's heritage homes on large lots are in high demand. The suburb benefits from limited new supply, supporting steady price growth.",
  },
  {
    slug: "newstead",
    name: "Newstead",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 900_000,
    avgLoanSize: 720_000,
    typicalDeposit: 180_000,
    description:
      "Newstead is Brisbane's fastest-transforming inner suburb, with riverfront apartments, James Street dining precinct, and easy CBD access.",
    marketInsight:
      "Newstead has seen significant new development. Off-the-plan purchases remain popular with investors targeting the Brisbane 2032 Olympics growth corridor.",
  },
  {
    slug: "west-end-qld",
    name: "West End",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 1_100_000,
    avgLoanSize: 880_000,
    typicalDeposit: 220_000,
    description:
      "West End is a trendy inner-city suburb on the Brisbane River, known for its multicultural markets, eclectic dining, and a strong arts community.",
    marketInsight:
      "West End's proximity to South Bank and the CBD, combined with its village character, makes it one of Brisbane's most desirable inner suburbs.",
  },
  {
    slug: "chermside",
    name: "Chermside",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 780_000,
    avgLoanSize: 624_000,
    typicalDeposit: 156_000,
    description:
      "Chermside is a major northside suburb anchored by Westfield Chermside, one of Queensland's largest shopping centres, with excellent bus and hospital access.",
    marketInsight:
      "Chermside offers good value for Brisbane's northside with a strong rental market driven by proximity to the Prince Charles Hospital and retail employment.",
  },
  {
    slug: "indooroopilly",
    name: "Indooroopilly",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 1_150_000,
    avgLoanSize: 920_000,
    typicalDeposit: 230_000,
    description:
      "Indooroopilly is a leafy western suburb popular with families, home to Indooroopilly Shopping Centre, the University of Queensland nearby, and quality schools.",
    marketInsight:
      "Indooroopilly benefits from proximity to UQ and strong school catchments. Family homes on larger blocks attract competitive bidding.",
  },
  {
    slug: "surfers-paradise",
    name: "Surfers Paradise",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 850_000,
    avgLoanSize: 680_000,
    typicalDeposit: 170_000,
    description:
      "Surfers Paradise is the Gold Coast's premier beachfront suburb, popular with owner-occupiers, holiday-let investors, and lifestyle seekers.",
    marketInsight:
      "Post-pandemic migration to the Gold Coast has driven strong price growth. Beachfront units command premium prices and rental yields.",
  },
  {
    slug: "springfield",
    name: "Springfield",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 650_000,
    avgLoanSize: 520_000,
    typicalDeposit: 130_000,
    description:
      "Springfield is a master-planned community in Brisbane's south-west corridor, with its own town centre, university campus, and direct rail to the CBD.",
    marketInsight:
      "Springfield's master-planned infrastructure and affordability attract first home buyers. The Springfield Central rail station provides direct CBD access.",
  },
  {
    slug: "carindale",
    name: "Carindale",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 1_000_000,
    avgLoanSize: 800_000,
    typicalDeposit: 200_000,
    description:
      "Carindale is an established eastside suburb known for Westfield Carindale, family-friendly streets, and proximity to Belmont Bushland reserves.",
    marketInsight:
      "Carindale's combination of retail convenience, green spaces, and established housing stock makes it a reliable family suburb with steady growth.",
  },
  {
    slug: "woolloongabba",
    name: "Woolloongabba",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 950_000,
    avgLoanSize: 760_000,
    typicalDeposit: 190_000,
    description:
      "Woolloongabba is an inner-south suburb adjacent to the Gabba cricket ground, undergoing major transformation as Brisbane's 2032 Olympics precinct.",
    marketInsight:
      "The 2032 Olympics redevelopment of the Gabba is set to transform Woolloongabba. Early investment in the area is driven by anticipated infrastructure upgrades.",
  },
  {
    slug: "nundah",
    name: "Nundah",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 820_000,
    avgLoanSize: 656_000,
    typicalDeposit: 164_000,
    description:
      "Nundah is a vibrant northside village suburb with a popular weekend farmers market, diverse dining on Sandgate Road, and excellent train connectivity.",
    marketInsight:
      "Nundah's village atmosphere and train station access have made it increasingly popular. The suburb offers a blend of renovated Queenslanders and modern apartments.",
  },

  // ─── Perth (WA) ───────────────────────────────────────────────────────────────
  {
    slug: "cottesloe",
    name: "Cottesloe",
    state: "WA",
    city: "Perth",
    medianPrice: 2_200_000,
    avgLoanSize: 1_760_000,
    typicalDeposit: 440_000,
    description:
      "Cottesloe is Perth's premier beachside suburb, renowned for its white-sand beach, Norfolk pines, and heritage character homes.",
    marketInsight:
      "Cottesloe is a tightly held market with limited stock. Properties near the beach attract premium pricing, particularly freestanding homes.",
  },
  {
    slug: "joondalup",
    name: "Joondalup",
    state: "WA",
    city: "Perth",
    medianPrice: 650_000,
    avgLoanSize: 520_000,
    typicalDeposit: 130_000,
    description:
      "Joondalup is a major suburban centre in Perth's northern corridor, with a university, hospital, lakeside shopping, and direct train to the CBD.",
    marketInsight:
      "Joondalup's self-contained amenities — university, hospital, and Lakeside Shopping City — make it a popular choice for families and first home buyers.",
  },
  {
    slug: "fremantle",
    name: "Fremantle",
    state: "WA",
    city: "Perth",
    medianPrice: 900_000,
    avgLoanSize: 720_000,
    typicalDeposit: 180_000,
    description:
      "Fremantle is Perth's historic port city, known for its well-preserved heritage architecture, vibrant markets, cappuccino strip, and thriving arts scene.",
    marketInsight:
      "Fremantle's heritage character and creative culture set it apart. The suburb attracts buyers seeking an alternative to Perth's suburban norm.",
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    state: "WA",
    city: "Perth",
    medianPrice: 800_000,
    avgLoanSize: 640_000,
    typicalDeposit: 160_000,
    description:
      "Scarborough is Perth's most popular beach suburb, with a recently redeveloped beachfront precinct featuring pools, parks, restaurants, and surf breaks.",
    marketInsight:
      "The Scarborough Beach redevelopment has transformed the suburb's appeal. New apartments and dining precincts have driven strong price growth since 2023.",
  },
  {
    slug: "subiaco",
    name: "Subiaco",
    state: "WA",
    city: "Perth",
    medianPrice: 1_400_000,
    avgLoanSize: 1_120_000,
    typicalDeposit: 280_000,
    description:
      "Subiaco is an inner-city suburb just west of Perth CBD, known for its heritage streetscapes, Rokeby Road cafes, and proximity to Kings Park.",
    marketInsight:
      "Subiaco's walkability and inner-city charm attract professionals and downsizers. The former Subiaco Oval redevelopment is bringing new housing stock.",
  },
  {
    slug: "rockingham",
    name: "Rockingham",
    state: "WA",
    city: "Perth",
    medianPrice: 550_000,
    avgLoanSize: 440_000,
    typicalDeposit: 110_000,
    description:
      "Rockingham is a coastal city south of Perth with a relaxed beach lifestyle, foreshore dining, and proximity to Garden Island and Penguin Island.",
    marketInsight:
      "Rockingham is one of Perth's most affordable coastal options. Strong population growth and the Rockingham Beach foreshore upgrade continue to attract buyers.",
  },
  {
    slug: "nedlands",
    name: "Nedlands",
    state: "WA",
    city: "Perth",
    medianPrice: 1_800_000,
    avgLoanSize: 1_440_000,
    typicalDeposit: 360_000,
    description:
      "Nedlands is a prestigious western suburb home to the University of Western Australia, leafy streets, and river-facing properties along the Swan River.",
    marketInsight:
      "Nedlands benefits from its proximity to UWA, QEII Medical Centre, and the river. Large family homes in the suburb's prime streets are tightly held.",
  },
  {
    slug: "morley",
    name: "Morley",
    state: "WA",
    city: "Perth",
    medianPrice: 620_000,
    avgLoanSize: 496_000,
    typicalDeposit: 124_000,
    description:
      "Morley is a well-connected suburb in Perth's north-east with Galleria shopping centre, diverse dining options, and good access to the CBD via Tonkin Highway.",
    marketInsight:
      "Morley offers solid value with a strong community feel. Its central location and retail amenities make it popular with both families and investors.",
  },
  {
    slug: "victoria-park",
    name: "Victoria Park",
    state: "WA",
    city: "Perth",
    medianPrice: 750_000,
    avgLoanSize: 600_000,
    typicalDeposit: 150_000,
    description:
      "Victoria Park is a vibrant inner-south suburb known for Albany Highway's cafe strip, multicultural dining, and its close proximity to the Perth CBD and Crown Perth.",
    marketInsight:
      "Victoria Park's gentrification and dining scene have lifted its profile. The suburb offers inner-city living at a fraction of western suburb prices.",
  },
  {
    slug: "claremont",
    name: "Claremont",
    state: "WA",
    city: "Perth",
    medianPrice: 1_850_000,
    avgLoanSize: 1_480_000,
    typicalDeposit: 370_000,
    description:
      "Claremont is an affluent western suburb known for its premium shopping quarter, proximity to the Swan River, and some of Perth's best private schools.",
    marketInsight:
      "Claremont's school catchments and village retail drive consistent demand. The suburb is popular with families seeking prestigious western suburbs living.",
  },

  // ─── Adelaide (SA) ────────────────────────────────────────────────────────────
  {
    slug: "glenelg",
    name: "Glenelg",
    state: "SA",
    city: "Adelaide",
    medianPrice: 850_000,
    avgLoanSize: 680_000,
    typicalDeposit: 170_000,
    description:
      "Glenelg is Adelaide's best-known beachside suburb, connected to the CBD by the iconic tram line and offering a resort-like lifestyle year-round.",
    marketInsight:
      "Glenelg offers beachside living at a fraction of east-coast equivalents. The tram connection and Jetty Road precinct underpin consistent demand.",
  },
  {
    slug: "adelaide-cbd",
    name: "Adelaide CBD",
    state: "SA",
    city: "Adelaide",
    medianPrice: 600_000,
    avgLoanSize: 480_000,
    typicalDeposit: 120_000,
    description:
      "Adelaide CBD sits within the parklands ring, offering a walkable city lifestyle with access to the Central Market, Rundle Mall, and the River Torrens.",
    marketInsight:
      "Adelaide has been one of Australia's best-performing markets since 2023, with the CBD offering strong rental yields and capital growth.",
  },
  {
    slug: "norwood",
    name: "Norwood",
    state: "SA",
    city: "Adelaide",
    medianPrice: 1_100_000,
    avgLoanSize: 880_000,
    typicalDeposit: 220_000,
    description:
      "Norwood is one of Adelaide's most established inner suburbs, known for The Parade shopping strip, heritage stone villas, and a thriving cafe culture.",
    marketInsight:
      "Norwood's character homes on The Parade precinct are highly sought after. Limited turnover and strong lifestyle appeal keep prices consistently elevated.",
  },
  {
    slug: "unley",
    name: "Unley",
    state: "SA",
    city: "Adelaide",
    medianPrice: 1_050_000,
    avgLoanSize: 840_000,
    typicalDeposit: 210_000,
    description:
      "Unley is a leafy inner-south suburb popular with families, featuring tree-lined streets, heritage homes, Unley Road shopping, and excellent schools.",
    marketInsight:
      "Unley's school catchments and character homes drive strong competition at auction. The suburb appeals to families upsizing from inner-city apartments.",
  },
  {
    slug: "prospect",
    name: "Prospect",
    state: "SA",
    city: "Adelaide",
    medianPrice: 850_000,
    avgLoanSize: 680_000,
    typicalDeposit: 170_000,
    description:
      "Prospect is a vibrant inner-north suburb with a thriving main street of cafes, boutiques, and the Prospect Road dining precinct just minutes from the CBD.",
    marketInsight:
      "Prospect has emerged as one of Adelaide's trendiest suburbs. Young professionals and families are drawn by the village atmosphere and inner-city proximity.",
  },
  {
    slug: "henley-beach",
    name: "Henley Beach",
    state: "SA",
    city: "Adelaide",
    medianPrice: 1_200_000,
    avgLoanSize: 960_000,
    typicalDeposit: 240_000,
    description:
      "Henley Beach is a popular coastal suburb in Adelaide's west, offering a long sandy beach, Henley Square dining precinct, and a family-friendly lifestyle.",
    marketInsight:
      "Henley Beach's coastal premium continues to grow as Adelaide's beachside suburbs attract more buyers priced out of east-coast equivalents.",
  },
  {
    slug: "elizabeth",
    name: "Elizabeth",
    state: "SA",
    city: "Adelaide",
    medianPrice: 380_000,
    avgLoanSize: 304_000,
    typicalDeposit: 76_000,
    description:
      "Elizabeth is a major suburban centre in Adelaide's northern corridor with Elizabeth City Centre, Lyell McEwin Hospital, and direct train access to the CBD.",
    marketInsight:
      "Elizabeth offers some of Adelaide's most affordable housing. Investor activity is strong due to high rental yields and ongoing public housing renewal programs.",
  },
  {
    slug: "modbury",
    name: "Modbury",
    state: "SA",
    city: "Adelaide",
    medianPrice: 600_000,
    avgLoanSize: 480_000,
    typicalDeposit: 120_000,
    description:
      "Modbury is a well-established north-eastern suburb with Tea Tree Plaza shopping centre, the O-Bahn busway providing fast CBD access, and proximity to the Adelaide Hills.",
    marketInsight:
      "Modbury's O-Bahn connection gives it one of Adelaide's fastest commutes. The suburb offers good value for families with established infrastructure.",
  },
  {
    slug: "marion",
    name: "Marion",
    state: "SA",
    city: "Adelaide",
    medianPrice: 650_000,
    avgLoanSize: 520_000,
    typicalDeposit: 130_000,
    description:
      "Marion is a southern suburbs hub anchored by Westfield Marion, South Australia's largest shopping centre, with good access to Flinders University and the beach.",
    marketInsight:
      "Marion's proximity to Westfield Marion and the Darlington upgrade has improved connectivity. The suburb attracts families and investors seeking southern suburbs value.",
  },
  {
    slug: "semaphore",
    name: "Semaphore",
    state: "SA",
    city: "Adelaide",
    medianPrice: 800_000,
    avgLoanSize: 640_000,
    typicalDeposit: 160_000,
    description:
      "Semaphore is a charming coastal suburb in Adelaide's west, known for its heritage main street, classic cinema, fish and chips, and relaxed beachside community.",
    marketInsight:
      "Semaphore's old-world charm and beachside lifestyle have attracted growing interest. The suburb offers a more affordable coastal alternative to Glenelg and Henley Beach.",
  },
];

export const SLUG_TO_SUBURB: Record<string, SuburbData> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);

export const SUBURBS_BY_CITY: Record<string, SuburbData[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.city]) acc[s.city] = [];
    acc[s.city].push(s);
    return acc;
  },
  {} as Record<string, SuburbData[]>
);

export const CITY_ORDER = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"];
