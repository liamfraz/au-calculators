export interface MortgageOffsetSuburbData {
  slug: string;
  name: string;
  state: string;
  city: string;
  medianPrice: number;
  typicalLoan: number;
  typicalOffset: number;
  description: string;
  marketInsight: string;
  nearbySuburbs: string[];
}

export const SUBURBS: MortgageOffsetSuburbData[] = [
  // ─── Sydney (NSW) ─────────────────────────────────────────────────────────────
  {
    slug: "mosman",
    name: "Mosman",
    state: "NSW",
    city: "Sydney",
    medianPrice: 4200000,
    typicalLoan: 3360000,
    typicalOffset: 250000,
    description:
      "Mosman on Sydney's Lower North Shore is one of Australia's most affluent suburbs, with harbour views commanding premium prices. The high median price means large mortgages where offset accounts deliver substantial interest savings — a $250,000 offset on a $3.36M loan saves over $500,000 in interest over the loan term.",
    marketInsight:
      "Mosman buyers typically have higher incomes and larger savings balances, making salary parking strategies particularly effective. Many professionals here maintain $200K-$400K in offset accounts, saving $30,000-$60,000 in interest annually.",
    nearbySuburbs: ["neutral-bay", "cremorne"],
  },
  {
    slug: "bondi",
    name: "Bondi",
    state: "NSW",
    city: "Sydney",
    medianPrice: 3500000,
    typicalLoan: 2800000,
    typicalOffset: 200000,
    description:
      "Bondi is one of Sydney's most iconic coastal suburbs, attracting a mix of young professionals and established families. The median house price reflects the premium for beachside living. With loans averaging $2.8M, even a modest offset balance generates significant daily interest savings.",
    marketInsight:
      "Bondi's mix of apartments and houses means mortgage sizes vary widely. Apartment buyers with $1.5M-$2M loans can still save $150,000+ in interest with a $100K offset balance over the loan term.",
    nearbySuburbs: ["paddington", "surry-hills"],
  },
  {
    slug: "manly",
    name: "Manly",
    state: "NSW",
    city: "Sydney",
    medianPrice: 3800000,
    typicalLoan: 3040000,
    typicalOffset: 220000,
    description:
      "Manly on the Northern Beaches offers a coastal lifestyle with ferry access to the CBD. Strong demand from families and professionals keeps prices elevated. The large loan sizes typical in Manly make offset accounts particularly valuable — every dollar in the offset reduces interest on a multi-million dollar balance.",
    marketInsight:
      "Many Manly residents commute via ferry and maintain dual-income households. Directing both salaries into a single offset account before expenses can maintain a $150K-$250K average balance, saving thousands monthly in interest.",
    nearbySuburbs: ["mosman", "neutral-bay", "cremorne"],
  },
  {
    slug: "double-bay",
    name: "Double Bay",
    state: "NSW",
    city: "Sydney",
    medianPrice: 5500000,
    typicalLoan: 4400000,
    typicalOffset: 350000,
    description:
      "Double Bay in Sydney's Eastern Suburbs is among Australia's most exclusive addresses. With a median house price of $5.5M, mortgages here are substantial. A $350,000 offset account on a $4.4M loan at 6.5% saves approximately $22,750 in interest in the first year alone.",
    marketInsight:
      "Double Bay's ultra-premium market means many buyers use offset accounts strategically for investment property tax planning. Keeping savings in an offset on the PPOR preserves full deductibility on investment loans — critical at these loan sizes.",
    nearbySuburbs: ["paddington", "bondi"],
  },
  {
    slug: "vaucluse",
    name: "Vaucluse",
    state: "NSW",
    city: "Sydney",
    medianPrice: 7500000,
    typicalLoan: 5000000,
    typicalOffset: 500000,
    description:
      "Vaucluse is one of Sydney's most prestigious harbourside suburbs, with some of Australia's highest property values. Even with a substantial deposit, loans of $5M+ are common. At these loan sizes, a $500,000 offset account saves over $32,000 in interest per year — equivalent to earning 10%+ on savings after tax.",
    marketInsight:
      "At Vaucluse price points, the tax-free equivalent return of an offset account is extraordinary. A $500K offset at 6.5% provides the same after-tax benefit as a savings account paying over 10% for someone in the top tax bracket.",
    nearbySuburbs: ["double-bay", "bondi"],
  },
  {
    slug: "neutral-bay",
    name: "Neutral Bay",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2800000,
    typicalLoan: 2240000,
    typicalOffset: 160000,
    description:
      "Neutral Bay on the Lower North Shore offers proximity to the CBD with a village atmosphere. The mix of apartments and houses provides entry points for professionals building equity. A $160,000 offset on a $2.24M loan saves approximately $10,400 in interest annually.",
    marketInsight:
      "Neutral Bay's apartment market attracts first-time buyers upgrading from renting. Even a $50,000 offset balance on a $1.5M apartment loan saves $3,250/year in interest — more than offsetting any package loan fees.",
    nearbySuburbs: ["mosman", "cremorne"],
  },
  {
    slug: "cremorne",
    name: "Cremorne",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2900000,
    typicalLoan: 2320000,
    typicalOffset: 170000,
    description:
      "Cremorne sits between Neutral Bay and Mosman on Sydney's Lower North Shore. The suburb's mix of period homes and modern apartments attracts professionals who value the harbour proximity and lifestyle. With typical loans exceeding $2.3M, offset account savings compound rapidly.",
    marketInsight:
      "Cremorne buyers often upgrade from Neutral Bay apartments to houses. If you've built up savings in your offset from a previous property, transferring that balance to your new, larger loan amplifies the interest savings proportionally.",
    nearbySuburbs: ["neutral-bay", "mosman"],
  },
  {
    slug: "paddington",
    name: "Paddington",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2600000,
    typicalLoan: 2080000,
    typicalOffset: 150000,
    description:
      "Paddington's Victorian terrace houses are among Sydney's most sought-after properties. The compact heritage streetscapes and proximity to the CBD drive strong demand. With typical loans around $2.08M, an offset account is a key wealth-building tool for Paddington homeowners.",
    marketInsight:
      "Paddington's terrace market tends to attract high-income professionals and couples. Using a credit card for daily expenses while parking salary in the offset maximises the average daily balance — a $150K average offset saves over $9,750/year at current rates.",
    nearbySuburbs: ["surry-hills", "bondi", "double-bay"],
  },
  {
    slug: "surry-hills",
    name: "Surry Hills",
    state: "NSW",
    city: "Sydney",
    medianPrice: 1900000,
    typicalLoan: 1520000,
    typicalOffset: 110000,
    description:
      "Surry Hills is an inner-city Sydney suburb known for its creative scene, restaurants, and converted warehouse apartments. The relatively lower median compared to eastern suburbs makes it accessible for professionals, while the loan sizes still benefit significantly from offset accounts.",
    marketInsight:
      "Surry Hills' apartment-heavy market means many buyers are on smaller loans of $800K-$1.5M. Even a $50,000-$100,000 offset balance on these loans saves $3,250-$6,500 per year and cuts 3-5 years off the loan term.",
    nearbySuburbs: ["paddington", "bondi"],
  },
  {
    slug: "balmain",
    name: "Balmain",
    state: "NSW",
    city: "Sydney",
    medianPrice: 2400000,
    typicalLoan: 1920000,
    typicalOffset: 140000,
    description:
      "Balmain on Sydney's Inner West peninsula combines harbour views with a village atmosphere. The suburb attracts young families upgrading from apartments, often taking on substantial mortgages. A $140,000 offset on a $1.92M loan saves approximately $9,100 in interest annually.",
    marketInsight:
      "Balmain families with dual incomes can build offset balances quickly. Directing both salaries into the offset and paying expenses via credit card (cleared monthly) can maintain a $100K-$200K average balance, saving $6,500-$13,000/year.",
    nearbySuburbs: ["surry-hills", "paddington"],
  },

  // ─── Melbourne (VIC) ──────────────────────────────────────────────────────────
  {
    slug: "toorak",
    name: "Toorak",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 5200000,
    typicalLoan: 4160000,
    typicalOffset: 400000,
    description:
      "Toorak is Melbourne's most prestigious suburb, with tree-lined streets and grand period homes. The median price of $5.2M means substantial loans where offset accounts have an outsized impact. A $400,000 offset on a $4.16M loan saves approximately $26,000 in interest per year.",
    marketInsight:
      "Toorak buyers frequently hold multiple properties. Using an offset on the non-deductible PPOR loan while maximising deductible investment debt is a common and effective strategy at these loan sizes — consult a tax adviser for optimal structuring.",
    nearbySuburbs: ["south-yarra", "armadale", "malvern"],
  },
  {
    slug: "south-yarra",
    name: "South Yarra",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2200000,
    typicalLoan: 1760000,
    typicalOffset: 130000,
    description:
      "South Yarra is one of Melbourne's most vibrant inner suburbs, blending heritage homes with luxury apartments along Chapel Street and Toorak Road. With typical loans around $1.76M, an offset account can cut years off the mortgage while maintaining full access to your savings.",
    marketInsight:
      "South Yarra's large apartment market means many first-home buyers enter with loans of $600K-$1M. Building an offset balance of even $30,000-$50,000 from the start saves $15,000-$25,000 over the first five years.",
    nearbySuburbs: ["toorak", "armadale", "albert-park"],
  },
  {
    slug: "brighton",
    name: "Brighton",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 3400000,
    typicalLoan: 2720000,
    typicalOffset: 200000,
    description:
      "Brighton on Melbourne's Bayside is renowned for its beach boxes, period homes, and family-friendly streets. The premium property market means large mortgages where offset accounts deliver meaningful daily interest reductions. A $200,000 offset saves approximately $13,000/year in interest.",
    marketInsight:
      "Brighton's family demographic means many households maintain emergency funds and school fee reserves. Keeping these in an offset account rather than a savings account provides the same liquidity while saving interest tax-free.",
    nearbySuburbs: ["albert-park", "hawthorn"],
  },
  {
    slug: "hawthorn",
    name: "Hawthorn",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2800000,
    typicalLoan: 2240000,
    typicalOffset: 160000,
    description:
      "Hawthorn in Melbourne's inner east is known for its leafy streets, period architecture, and proximity to prestigious schools. The established market attracts families willing to take on larger mortgages for the lifestyle. A $160,000 offset on a $2.24M loan provides $10,400/year in interest savings.",
    marketInsight:
      "Hawthorn's proximity to private schools means many families hold tuition reserves. Parking $50K-$100K in school fee savings in your offset account instead of a term deposit saves thousands in interest while keeping funds accessible for annual fee payments.",
    nearbySuburbs: ["kew", "camberwell", "malvern"],
  },
  {
    slug: "malvern",
    name: "Malvern",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 3100000,
    typicalLoan: 2480000,
    typicalOffset: 180000,
    description:
      "Malvern in Melbourne's inner south-east combines grand period homes with excellent school zones. The high median reflects strong demand from families prioritising education. With loans averaging $2.48M, an offset account with $180,000 saves approximately $11,700/year in interest.",
    marketInsight:
      "Malvern buyers often stretch for the school zone premium. An offset account helps manage this larger debt — even if you can only maintain a $50K-$80K balance initially, it still saves $3,250-$5,200/year and reduces total interest by $60K-$100K over the loan.",
    nearbySuburbs: ["armadale", "toorak", "hawthorn", "camberwell"],
  },
  {
    slug: "armadale",
    name: "Armadale",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2600000,
    typicalLoan: 2080000,
    typicalOffset: 150000,
    description:
      "Armadale sits between Toorak and Malvern, offering High Street shopping and tree-lined residential streets. The suburb's boutique feel attracts professionals and downsizers. With typical loans around $2.08M, a $150,000 offset saves approximately $9,750/year.",
    marketInsight:
      "Armadale's mix of houses and apartments creates diverse mortgage profiles. Even apartment buyers with $800K-$1.2M loans benefit significantly — a $75K offset on a $1M loan saves $4,875/year and cuts 4+ years off a 30-year term.",
    nearbySuburbs: ["toorak", "south-yarra", "malvern"],
  },
  {
    slug: "kew",
    name: "Kew",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2900000,
    typicalLoan: 2320000,
    typicalOffset: 170000,
    description:
      "Kew in Melbourne's inner east is prized for its period homes, gardens, and access to elite schools. The family-oriented market drives strong demand and premium pricing. A $170,000 offset on a $2.32M loan saves approximately $11,050/year in interest at current rates.",
    marketInsight:
      "Kew families often receive financial gifts from parents for deposits. If you've received a gift that exceeds your deposit needs, placing the surplus in an offset account rather than reducing the loan keeps your options open for future investment borrowing.",
    nearbySuburbs: ["hawthorn", "camberwell"],
  },
  {
    slug: "camberwell",
    name: "Camberwell",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2700000,
    typicalLoan: 2160000,
    typicalOffset: 160000,
    description:
      "Camberwell is a prestigious Melbourne suburb anchored by Burke Road shopping and excellent schools. The established housing stock of period homes on large blocks commands premium prices. With typical loans of $2.16M, a $160,000 offset delivers $10,400/year in interest savings.",
    marketInsight:
      "Camberwell's renovation culture means many buyers plan upgrades after purchase. Holding renovation funds in the offset account until needed provides interest savings on your mortgage while the money accumulates — far better than a savings account where interest is taxed.",
    nearbySuburbs: ["hawthorn", "kew", "malvern"],
  },
  {
    slug: "albert-park",
    name: "Albert Park",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 2500000,
    typicalLoan: 2000000,
    typicalOffset: 150000,
    description:
      "Albert Park is an inner Melbourne suburb known for its Victorian streetscapes, the Grand Prix circuit, and Albert Park Lake. The lifestyle appeal drives strong demand from professionals. With typical loans of $2M, a $150,000 offset saves approximately $9,750/year.",
    marketInsight:
      "Albert Park's proximity to the CBD means many residents earn professional salaries that can rapidly build offset balances. Starting with even a $50K offset and adding $2K/month grows to $150K within 4 years, saving over $50,000 in cumulative interest.",
    nearbySuburbs: ["south-yarra", "brighton"],
  },
  {
    slug: "st-kilda",
    name: "St Kilda",
    state: "VIC",
    city: "Melbourne",
    medianPrice: 1600000,
    typicalLoan: 1280000,
    typicalOffset: 90000,
    description:
      "St Kilda is one of Melbourne's most eclectic beachside suburbs, with a vibrant entertainment scene and heritage buildings. The relatively accessible median makes it a popular first-home buyer destination. A $90,000 offset on a $1.28M loan saves approximately $5,850/year.",
    marketInsight:
      "St Kilda's apartment-dominated market means many buyers have loans under $1M. At this level, a $50,000 offset balance still saves $3,250/year and cuts 3-4 years off a 30-year loan — well worth the $0-$395 annual offset package fee.",
    nearbySuburbs: ["albert-park", "south-yarra"],
  },

  // ─── Brisbane (QLD) ─────────────────────────────────────────────────────────
  {
    slug: "new-farm",
    name: "New Farm",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 2100000,
    typicalLoan: 1680000,
    typicalOffset: 120000,
    description:
      "New Farm is Brisbane's premier inner-city suburb, nestled in a bend of the Brisbane River with leafy streets, heritage Queenslanders, and the popular Powerhouse arts precinct. Strong demand from professionals and downsizers keeps median prices elevated. A $120,000 offset on a $1.68M loan saves approximately $7,800/year in interest.",
    marketInsight:
      "New Farm's café culture and walkability attract high-income professionals who can build offset balances quickly. Directing salary into the offset and using a credit card for daily expenses at nearby James Street retailers maintains a higher average balance year-round.",
    nearbySuburbs: ["paddington-qld", "ascot"],
  },
  {
    slug: "paddington-qld",
    name: "Paddington",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 1600000,
    typicalLoan: 1280000,
    typicalOffset: 90000,
    description:
      "Paddington is one of Brisbane's most charming inner suburbs, known for its heritage Queenslander homes on stilts, Latrobe Terrace cafés, and village atmosphere. The suburb's character homes attract renovators and families. A $90,000 offset on a $1.28M loan saves approximately $5,850/year.",
    marketInsight:
      "Paddington renovators often hold building funds in their offset account while planning and quoting works. This provides interest savings during the planning phase — $100K in renovation funds sitting in the offset for 6 months saves roughly $3,250 before a single nail is hammered.",
    nearbySuburbs: ["new-farm", "ascot"],
  },
  {
    slug: "ascot",
    name: "Ascot",
    state: "QLD",
    city: "Brisbane",
    medianPrice: 2400000,
    typicalLoan: 1920000,
    typicalOffset: 140000,
    description:
      "Ascot is Brisbane's blue-ribbon suburb, home to the Eagle Farm racecourse and grand colonial homes on wide, tree-lined streets. The prestige market commands premium prices with strong capital growth. A $140,000 offset on a $1.92M loan saves approximately $9,100/year in interest.",
    marketInsight:
      "Ascot's high-net-worth residents often hold multiple properties. Using an offset account on the non-deductible PPOR loan while maximising deductible debt on investment properties is a standard strategy at these price points — consult a mortgage broker familiar with the local market.",
    nearbySuburbs: ["new-farm", "paddington-qld"],
  },

  // ─── Perth (WA) ─────────────────────────────────────────────────────────────
  {
    slug: "cottesloe",
    name: "Cottesloe",
    state: "WA",
    city: "Perth",
    medianPrice: 3200000,
    typicalLoan: 2560000,
    typicalOffset: 190000,
    description:
      "Cottesloe is Perth's premier beachside suburb, famous for its white-sand beach, Norfolk pines, and Indian Ocean sunsets. The combination of coastal lifestyle and proximity to the CBD makes it one of WA's most expensive suburbs. A $190,000 offset on a $2.56M loan saves approximately $12,350/year.",
    marketInsight:
      "Perth's mining boom cycles mean Cottesloe buyers often receive large bonuses or contract payments. Parking a $100K+ bonus in the offset account immediately rather than making a lump-sum loan repayment preserves flexibility while delivering the same interest savings.",
    nearbySuburbs: ["dalkeith", "nedlands"],
  },
  {
    slug: "dalkeith",
    name: "Dalkeith",
    state: "WA",
    city: "Perth",
    medianPrice: 3800000,
    typicalLoan: 3040000,
    typicalOffset: 220000,
    description:
      "Dalkeith is Perth's most prestigious riverfront suburb, with sprawling properties overlooking the Swan River and proximity to elite schools. The median of $3.8M reflects the exclusive nature of this tightly-held market. A $220,000 offset on a $3.04M loan saves approximately $14,300/year.",
    marketInsight:
      "Dalkeith's large block sizes and renovation potential mean many buyers hold substantial building reserves. Keeping $200K-$500K of renovation funds in the offset during the 12-18 month build process saves $13,000-$32,500 in interest — effectively reducing the renovation cost.",
    nearbySuburbs: ["cottesloe", "nedlands"],
  },
  {
    slug: "nedlands",
    name: "Nedlands",
    state: "WA",
    city: "Perth",
    medianPrice: 2200000,
    typicalLoan: 1760000,
    typicalOffset: 130000,
    description:
      "Nedlands sits between the Swan River and Kings Park, with UWA on its doorstep. The suburb attracts academics, professionals, and families drawn to the leafy streets and school zones. A $130,000 offset on a $1.76M loan saves approximately $8,450/year in interest.",
    marketInsight:
      "Nedlands' proximity to UWA and major hospitals means many residents are dual-income professional households. Two salaries flowing into a single offset account can maintain a $100K-$180K average balance, saving $6,500-$11,700/year while funds remain fully accessible.",
    nearbySuburbs: ["cottesloe", "dalkeith"],
  },

  // ─── Adelaide (SA) ──────────────────────────────────────────────────────────
  {
    slug: "unley",
    name: "Unley",
    state: "SA",
    city: "Adelaide",
    medianPrice: 1500000,
    typicalLoan: 1200000,
    typicalOffset: 85000,
    description:
      "Unley is one of Adelaide's most desirable inner-south suburbs, featuring tree-lined streets, heritage homes, and King William Road's boutique shopping strip. Adelaide's more affordable market means strong offset returns relative to loan size. An $85,000 offset on a $1.2M loan saves approximately $5,525/year.",
    marketInsight:
      "Adelaide's lower property prices mean offset accounts can proportionally reduce loan terms faster than in Sydney or Melbourne. An $85K offset on a $1.2M loan at 6.5% cuts approximately 5 years off a 30-year term — one of the best offset-to-time-saved ratios nationally.",
    nearbySuburbs: ["norwood"],
  },
  {
    slug: "norwood",
    name: "Norwood",
    state: "SA",
    city: "Adelaide",
    medianPrice: 1350000,
    typicalLoan: 1080000,
    typicalOffset: 75000,
    description:
      "Norwood is Adelaide's vibrant inner-east suburb, centred on The Parade — one of Australia's great shopping streets. The mix of heritage cottages and character homes attracts young professionals and families. A $75,000 offset on a $1.08M loan saves approximately $4,875/year in interest.",
    marketInsight:
      "Norwood's café culture and walkability appeal to professionals who value lifestyle over commute time. The relatively affordable entry point compared to eastern seaboard cities means buyers can build offset balances faster — many reach a $100K offset within 3-4 years of purchase.",
    nearbySuburbs: ["unley"],
  },

  // ─── Canberra (ACT) ─────────────────────────────────────────────────────────
  {
    slug: "griffith",
    name: "Griffith",
    state: "ACT",
    city: "Canberra",
    medianPrice: 2000000,
    typicalLoan: 1600000,
    typicalOffset: 115000,
    description:
      "Griffith is one of Canberra's most established inner-south suburbs, close to Parliament House, embassies, and Manuka's dining precinct. The suburb attracts senior public servants and professionals. A $115,000 offset on a $1.6M loan saves approximately $7,475/year in interest.",
    marketInsight:
      "Canberra's high average incomes and stable public sector employment mean Griffith residents can build offset balances consistently. The security of government employment also makes lenders more comfortable with larger offset-eligible loan packages.",
    nearbySuburbs: ["forrest"],
  },
  {
    slug: "forrest",
    name: "Forrest",
    state: "ACT",
    city: "Canberra",
    medianPrice: 3000000,
    typicalLoan: 2400000,
    typicalOffset: 180000,
    description:
      "Forrest is Canberra's most exclusive suburb, home to embassies, diplomatic residences, and some of the capital's grandest homes. The tightly-held market and proximity to Parliament House command premium prices. A $180,000 offset on a $2.4M loan saves approximately $11,700/year.",
    marketInsight:
      "Forrest's diplomatic and senior government community often receives allowances and lump-sum payments. Directing these into the offset account provides immediate interest savings while maintaining full access — ideal for those who may relocate internationally at short notice.",
    nearbySuburbs: ["griffith"],
  },
];

export const SLUG_TO_SUBURB: Record<string, MortgageOffsetSuburbData> =
  Object.fromEntries(SUBURBS.map((s) => [s.slug, s]));

export const SUBURBS_BY_CITY: Record<string, MortgageOffsetSuburbData[]> =
  SUBURBS.reduce(
    (acc, s) => {
      if (!acc[s.city]) acc[s.city] = [];
      acc[s.city].push(s);
      return acc;
    },
    {} as Record<string, MortgageOffsetSuburbData[]>
  );
