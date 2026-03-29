export interface MortgageSuburb {
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

// 50 high-population Australian suburbs — approximate 2025-2026 median house/unit prices
// Sources: CoreLogic, Domain, REA Group publicly reported medians
// Distribution: Sydney 20, Melbourne 15, Brisbane 10, Perth 5

export const SUBURBS: MortgageSuburb[] = [
  // ─── Sydney (NSW) — 20 suburbs ──────────────────────────────────────────────
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
  {
    slug: "surry-hills",
    name: "Surry Hills",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_750_000,
    avgLoanSize: 1_400_000,
    typicalDeposit: 350_000,
    description:
      "Surry Hills is one of Sydney's trendiest inner-city suburbs, packed with award-winning restaurants, boutique shopping on Crown Street, and a thriving creative scene.",
    marketInsight:
      "Surry Hills' walkability and dining scene make it a premium inner-city address. Terrace houses dominate the market and command strong competition at auction.",
  },
  {
    slug: "marrickville",
    name: "Marrickville",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_450_000,
    avgLoanSize: 1_160_000,
    typicalDeposit: 290_000,
    description:
      "Marrickville in Sydney's Inner West is a multicultural suburb known for its Vietnamese dining on Illawarra Road, craft breweries, and rapidly evolving property market.",
    marketInsight:
      "Marrickville has gentrified significantly while retaining its character. The new Sydney Metro station has further boosted accessibility and demand.",
  },
  {
    slug: "randwick",
    name: "Randwick",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2_200_000,
    avgLoanSize: 1_760_000,
    typicalDeposit: 440_000,
    description:
      "Randwick is an established Eastern Suburbs locale home to the Royal Randwick Racecourse, UNSW, Prince of Wales Hospital, and easy access to Coogee Beach.",
    marketInsight:
      "Randwick benefits from the light rail connection to the CBD and Circular Quay. Proximity to UNSW and hospitals supports both owner-occupier and rental demand.",
  },
  {
    slug: "strathfield",
    name: "Strathfield",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2_400_000,
    avgLoanSize: 1_920_000,
    typicalDeposit: 480_000,
    description:
      "Strathfield is a prestigious Inner West suburb known for grand Federation homes, excellent schools, and its position as a major rail interchange.",
    marketInsight:
      "Strathfield's school catchments and transport connectivity drive premium pricing. Large family homes on wide blocks are particularly sought after.",
  },
  {
    slug: "hurstville",
    name: "Hurstville",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_500_000,
    avgLoanSize: 1_200_000,
    typicalDeposit: 300_000,
    description:
      "Hurstville is a major commercial centre in Sydney's south, with Westfield Hurstville, diverse dining options, and excellent express train services to the CBD.",
    marketInsight:
      "Hurstville's diverse community and strong retail hub support consistent property demand. The suburb offers relative value compared to nearby St George suburbs.",
  },
  {
    slug: "epping",
    name: "Epping",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_600_000,
    avgLoanSize: 1_280_000,
    typicalDeposit: 320_000,
    description:
      "Epping is a leafy suburb straddling Sydney's North Shore and Hills District, popular with families for its top schools, Metro station, and village shopping.",
    marketInsight:
      "The Sydney Metro interchange has transformed Epping's connectivity. Proximity to Macquarie Park's employment hub adds to the suburb's appeal for professionals.",
  },
  {
    slug: "ryde",
    name: "Ryde",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_700_000,
    avgLoanSize: 1_360_000,
    typicalDeposit: 340_000,
    description:
      "Ryde is a well-established suburb in Sydney's northern suburbs, close to Macquarie University, Top Ryde City shopping centre, and the Parramatta River foreshore.",
    marketInsight:
      "Ryde's proximity to Macquarie Park's tech employment corridor drives strong demand from professionals. A mix of family homes and modern apartments caters to varied buyers.",
  },
  {
    slug: "hornsby",
    name: "Hornsby",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_350_000,
    avgLoanSize: 1_080_000,
    typicalDeposit: 270_000,
    description:
      "Hornsby is a major Upper North Shore centre surrounded by bushland, offering Westfield Hornsby, a major hospital, and express trains to the CBD.",
    marketInsight:
      "Hornsby provides Upper North Shore living at more accessible prices than suburbs further south. The natural bushland setting and top schools are key drawcards.",
  },
  {
    slug: "bankstown",
    name: "Bankstown",
    state: "NSW",
    city: "Sydney",
    medianPrice: 950_000,
    avgLoanSize: 760_000,
    typicalDeposit: 190_000,
    description:
      "Bankstown is a vibrant multicultural hub in south-west Sydney with one of the city's busiest shopping centres, diverse dining, and the upcoming Bankstown Metro station.",
    marketInsight:
      "The Sydenham-to-Bankstown Metro conversion is expected to significantly boost Bankstown's property values. Current pricing offers relative value for the transformation ahead.",
  },
  {
    slug: "dee-why",
    name: "Dee Why",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1_800_000,
    avgLoanSize: 1_440_000,
    typicalDeposit: 360_000,
    description:
      "Dee Why is the Northern Beaches' commercial centre, with a revitalised beachfront, B-line express bus to the CBD, and a mix of apartments and family homes.",
    marketInsight:
      "Dee Why's beachfront redevelopment and improved transport have driven strong growth. The suburb offers a more affordable Northern Beaches entry point compared to Manly.",
  },

  // ─── Melbourne (VIC) — 15 suburbs ──────────────────────────────────────────
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
  {
    slug: "hawthorn",
    name: "Hawthorn",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_900_000,
    avgLoanSize: 1_520_000,
    typicalDeposit: 380_000,
    description:
      "Hawthorn is a leafy inner-eastern suburb with heritage streetscapes, Swinburne University, Glenferrie Road shopping strip, and some of Melbourne's best private schools.",
    marketInsight:
      "Hawthorn's school catchments and period architecture are key drawcards. The suburb commands premiums for renovated Victorian and Edwardian homes near Glenferrie Road.",
  },
  {
    slug: "carlton",
    name: "Carlton",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_050_000,
    avgLoanSize: 840_000,
    typicalDeposit: 210_000,
    description:
      "Carlton is Melbourne's historic Italian quarter, home to Lygon Street dining, the University of Melbourne, Royal Exhibition Building, and Carlton Gardens.",
    marketInsight:
      "Carlton's proximity to the University of Melbourne and CBD drives a strong rental market. Victorian terraces in the heritage precinct attract owner-occupier premiums.",
  },
  {
    slug: "heidelberg",
    name: "Heidelberg",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1_150_000,
    avgLoanSize: 920_000,
    typicalDeposit: 230_000,
    description:
      "Heidelberg is a north-eastern suburb known for the Austin Hospital precinct, the Heidelberg School art movement heritage, and family-friendly tree-lined streets.",
    marketInsight:
      "Heidelberg benefits from the Austin Hospital employment hub and quality schools. The suburb offers mid-range pricing for Melbourne's established north-east.",
  },
  {
    slug: "camberwell",
    name: "Camberwell",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2_100_000,
    avgLoanSize: 1_680_000,
    typicalDeposit: 420_000,
    description:
      "Camberwell is a prestigious eastern suburb known for its Sunday market, heritage homes, Burke Road shopping strip, and proximity to some of Melbourne's top schools.",
    marketInsight:
      "Camberwell consistently ranks among Melbourne's most desirable family suburbs. The combination of school zones, period homes, and village shopping drives strong auction competition.",
  },
  {
    slug: "coburg",
    name: "Coburg",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 950_000,
    avgLoanSize: 760_000,
    typicalDeposit: 190_000,
    description:
      "Coburg is a diverse inner-north suburb with Sydney Road shopping, Lake Merri parkland, and a growing cafe and dining scene driven by young families and professionals.",
    marketInsight:
      "Coburg offers relative value in Melbourne's inner north compared to Brunswick and Northcote. The suburb's affordability and train access attract first home buyers.",
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

  // ─── Brisbane (QLD) — 10 suburbs ───────────────────────────────────────────
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

  // ─── Perth (WA) — 5 suburbs ────────────────────────────────────────────────
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
];

export const SLUG_TO_SUBURB: Record<string, MortgageSuburb> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);

export const SUBURBS_BY_CITY: Record<string, MortgageSuburb[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.city]) acc[s.city] = [];
    acc[s.city].push(s);
    return acc;
  },
  {} as Record<string, MortgageSuburb[]>
);

export const CITY_ORDER = ["Sydney", "Melbourne", "Brisbane", "Perth"];
