export interface HecsSuburbData {
  slug: string;
  name: string;
  state: string;
  city: string;
  avgGraduateSalary: number;
  description: string;
  employmentNote: string;
}

// State-level average graduate salary (ABS 2025-26 proxy, full-time employed 1-5 yrs post-degree)
const STATE_GRAD_SALARY: Record<string, number> = {
  NSW: 72_000,
  VIC: 70_000,
  QLD: 67_000,
  WA: 75_000,
  SA: 65_000,
};

// 50 suburbs across 5 major cities — same set as mortgage-repayment pSEO
// avgGraduateSalary uses state-level ABS data with minor suburb-level adjustments
// based on proximity to CBD / major employment hubs

export const SUBURBS: HecsSuburbData[] = [
  // ─── Sydney (NSW) ─────────────────────────────────────────────────────────────
  {
    slug: "parramatta",
    name: "Parramatta",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 73_000,
    description:
      "Parramatta is Sydney's second CBD with a large concentration of government and corporate offices, making it a major employment hub for graduates across finance, health, and public administration.",
    employmentNote:
      "Parramatta's designation as a metropolitan centre means strong graduate employment in government services, Westmead Health Precinct, and corporate offices along Church Street.",
  },
  {
    slug: "bondi",
    name: "Bondi",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 74_000,
    description:
      "Bondi is one of Sydney's most iconic suburbs. Graduates living in the Eastern Suburbs typically work in the nearby CBD, with strong representation in media, creative industries, and professional services.",
    employmentNote:
      "Eastern Suburbs graduates benefit from proximity to Sydney CBD's financial and professional services sector, with above-average starting salaries in finance and tech.",
  },
  {
    slug: "manly",
    name: "Manly",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 73_000,
    description:
      "Manly on Sydney's Northern Beaches attracts graduates who commute to the CBD or work in North Sydney's corporate precinct, particularly in tech, marketing, and financial services.",
    employmentNote:
      "Northern Beaches graduates often commute to North Sydney or the CBD. The area has a growing tech startup scene and strong representation in digital marketing roles.",
  },
  {
    slug: "chatswood",
    name: "Chatswood",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 74_000,
    description:
      "Chatswood is a major commercial centre on Sydney's North Shore with its own corporate precinct. Graduates in the area benefit from local employment in finance, tech, and consulting.",
    employmentNote:
      "Chatswood's own commercial district provides local graduate employment, while easy Metro access to the CBD opens up the full range of Sydney's professional job market.",
  },
  {
    slug: "penrith",
    name: "Penrith",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 68_000,
    description:
      "Penrith is Western Sydney's major centre, with graduate employment concentrated in healthcare (Nepean Hospital), education (Western Sydney University), and the growing Aerotropolis precinct.",
    employmentNote:
      "Graduate salaries in Western Sydney tend to be slightly below the Sydney CBD average, though the Western Sydney Airport and Aerotropolis are expected to create higher-paying STEM roles.",
  },
  {
    slug: "blacktown",
    name: "Blacktown",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 68_000,
    description:
      "Blacktown is one of Sydney's most populous suburbs with a diverse economy. Graduates often work in local government, retail management, healthcare, and the growing logistics sector.",
    employmentNote:
      "Blacktown's large population supports local graduate roles in council administration, Blacktown Hospital, and the surrounding industrial and logistics precincts.",
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 69_000,
    description:
      "Liverpool is a major centre in South-West Sydney with strong graduate employment in health (Liverpool Hospital), education, and the expanding Western Sydney Aerotropolis nearby.",
    employmentNote:
      "Liverpool Hospital is one of NSW's largest, creating a steady pipeline of graduate roles in health sciences. The nearby Aerotropolis is attracting defence and aerospace employers.",
  },
  {
    slug: "cronulla",
    name: "Cronulla",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 72_000,
    description:
      "Cronulla in the Sutherland Shire offers a beachside lifestyle with train access to the CBD. Graduates in the area work across a range of industries, often commuting to the city centre.",
    employmentNote:
      "Shire-based graduates typically commute to the CBD or work in local businesses. The area has a mix of professional services and small-to-medium enterprises.",
  },
  {
    slug: "mosman",
    name: "Mosman",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 76_000,
    description:
      "Mosman on Sydney's Lower North Shore is one of the city's wealthiest suburbs. Graduates living here tend to work in high-paying sectors including finance, law, and consulting.",
    employmentNote:
      "Lower North Shore residents have above-average graduate salaries, reflecting the concentration of finance and professional services employers in nearby North Sydney and the CBD.",
  },
  {
    slug: "castle-hill",
    name: "Castle Hill",
    state: "NSW",
    city: "Sydney",
    avgGraduateSalary: 72_000,
    description:
      "Castle Hill in Sydney's Hills District is a family-friendly suburb with Metro access to the CBD. Graduates benefit from local employment in Norwest Business Park and Macquarie Park nearby.",
    employmentNote:
      "The Hills District benefits from the Norwest Business Park and proximity to Macquarie Park, both of which provide strong graduate opportunities in tech, pharma, and financial services.",
  },

  // ─── Melbourne (VIC) ──────────────────────────────────────────────────────────
  {
    slug: "south-yarra",
    name: "South Yarra",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 72_000,
    description:
      "South Yarra is one of Melbourne's most vibrant inner suburbs. Graduates in the area benefit from proximity to the CBD and the Cremorne tech precinct, with strong demand in digital and creative roles.",
    employmentNote:
      "South Yarra's proximity to the Cremorne/Richmond tech precinct (home to REA Group, Carsales, SEEK) makes it popular with graduates in software engineering and product roles.",
  },
  {
    slug: "toorak",
    name: "Toorak",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 75_000,
    description:
      "Toorak is Melbourne's most prestigious suburb. Graduates living here tend to work in Melbourne's top-tier professional services firms, investment banks, and law firms.",
    employmentNote:
      "Toorak residents skew toward higher-paying graduate roles in law, finance, and consulting, reflecting both proximity to the CBD and demographic factors.",
  },
  {
    slug: "richmond",
    name: "Richmond",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 72_000,
    description:
      "Richmond is an inner-city suburb and home to Melbourne's 'tech precinct' in Cremorne. It's a hotspot for graduates in software development, data science, and digital marketing.",
    employmentNote:
      "The Cremorne tech cluster in Richmond employs thousands of graduates at companies like REA Group, MYOB, and numerous startups, pushing local tech salaries above the state average.",
  },
  {
    slug: "brunswick",
    name: "Brunswick",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 69_000,
    description:
      "Brunswick is a trendy inner-north suburb popular with graduates and young professionals. Employment is diverse, spanning arts, education, hospitality, and the growing co-working/startup scene.",
    employmentNote:
      "Brunswick attracts graduates in creative industries, education, and social services. Salaries tend to be slightly below average due to the higher proportion of arts and education graduates.",
  },
  {
    slug: "footscray",
    name: "Footscray",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 68_000,
    description:
      "Footscray is a gentrifying inner-west suburb with growing appeal for graduates. Victoria University's campus and proximity to the CBD provide diverse employment options.",
    employmentNote:
      "Footscray's affordability relative to other inner suburbs attracts early-career graduates. The area has growing employment in education, health services, and community organisations.",
  },
  {
    slug: "brighton",
    name: "Brighton",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 74_000,
    description:
      "Brighton is an affluent bayside suburb in Melbourne's south-east. Graduates in the area often work in the CBD's financial district or in the growing Monash employment cluster.",
    employmentNote:
      "Bayside graduates tend to earn above-average salaries, with strong representation in financial services, consulting, and healthcare at the nearby Alfred Hospital precinct.",
  },
  {
    slug: "doncaster",
    name: "Doncaster",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 71_000,
    description:
      "Doncaster is a popular eastern suburb with strong family appeal. Graduates in the area commute to the CBD or work in the Box Hill/Doncaster commercial precincts.",
    employmentNote:
      "Eastern suburbs graduates benefit from the Box Hill health and education precinct, with growing opportunities at Box Hill Hospital and nearby Deakin University campus.",
  },
  {
    slug: "frankston",
    name: "Frankston",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 66_000,
    description:
      "Frankston is a bayside suburb at Melbourne's southern fringe. Graduates in the area work in local healthcare (Frankston Hospital), education, and retail, with some commuting to the CBD.",
    employmentNote:
      "Graduate salaries in Frankston tend to be below the Melbourne average due to the higher proportion of local employment in healthcare support, education, and retail management roles.",
  },
  {
    slug: "glen-waverley",
    name: "Glen Waverley",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 72_000,
    description:
      "Glen Waverley is a popular south-eastern suburb with excellent schools. Graduates benefit from the nearby Monash University employment cluster and growing tech sector in Clayton.",
    employmentNote:
      "Proximity to Monash University and the Clayton/Mulgrave business parks provides strong graduate pathways in STEM, particularly biotech, engineering, and IT services.",
  },
  {
    slug: "st-kilda",
    name: "St Kilda",
    state: "VIC",
    city: "Melbourne",
    avgGraduateSalary: 71_000,
    description:
      "St Kilda is Melbourne's iconic beachside suburb, popular with graduates and young professionals. The area offers easy CBD access and a thriving hospitality and creative industry scene.",
    employmentNote:
      "St Kilda's resident graduates span a wide range of industries. The area's proximity to the CBD and Port Melbourne creative precincts supports diverse career paths.",
  },

  // ─── Brisbane (QLD) ───────────────────────────────────────────────────────────
  {
    slug: "paddington-qld",
    name: "Paddington",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 69_000,
    description:
      "Paddington is a charming inner-west Brisbane suburb. Graduates in the area work across Brisbane's CBD, with the suburb popular among those in creative, professional services, and health sectors.",
    employmentNote:
      "Inner Brisbane graduates benefit from the concentration of government and professional services in the CBD, plus growing opportunities at the nearby RNA Showgrounds redevelopment.",
  },
  {
    slug: "newstead",
    name: "Newstead",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 70_000,
    description:
      "Newstead is Brisbane's fastest-growing inner suburb with a booming apartment market. The area is popular with graduates working at nearby Fortitude Valley and CBD employers.",
    employmentNote:
      "Newstead and nearby Fortitude Valley form Brisbane's emerging tech and creative hub, with above-average graduate salaries in software, design, and digital marketing.",
  },
  {
    slug: "west-end-qld",
    name: "West End",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 68_000,
    description:
      "West End is a trendy inner-city suburb on the Brisbane River. Popular with graduates in arts, education, and community services, it also benefits from proximity to South Bank and UQ.",
    employmentNote:
      "West End graduates often work at nearby University of Queensland, Mater Hospital, or South Bank's cultural precinct. The area has a higher proportion of education and arts graduates.",
  },
  {
    slug: "chermside",
    name: "Chermside",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 66_000,
    description:
      "Chermside is a major northside centre in Brisbane. Graduate employment is anchored by the Prince Charles Hospital and Westfield Chermside's retail and services sector.",
    employmentNote:
      "The Prince Charles Hospital precinct creates a strong pipeline of graduate roles in health sciences. Retail management and allied health are also significant local employers.",
  },
  {
    slug: "indooroopilly",
    name: "Indooroopilly",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 69_000,
    description:
      "Indooroopilly is a leafy western suburb close to the University of Queensland. The suburb is popular with recent graduates who studied at UQ and secured local or CBD-based roles.",
    employmentNote:
      "Proximity to UQ means many Indooroopilly graduates work in research, education, and STEM fields. The suburb also benefits from good access to the CBD's professional services sector.",
  },
  {
    slug: "surfers-paradise",
    name: "Surfers Paradise",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 63_000,
    description:
      "Surfers Paradise on the Gold Coast is a major tourism and lifestyle destination. Graduate salaries tend to be lower due to the tourism-heavy economy, though health and education sectors offer competitive pay.",
    employmentNote:
      "Gold Coast graduate salaries are typically below Brisbane CBD levels due to the region's tourism focus. Griffith University and Gold Coast University Hospital provide higher-paying graduate pathways.",
  },
  {
    slug: "springfield",
    name: "Springfield",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 65_000,
    description:
      "Springfield is a master-planned community in Brisbane's south-west. The area is growing as a graduate employment centre with the University of Southern Queensland campus and Mater Private Hospital Springfield.",
    employmentNote:
      "Springfield's economy is maturing with the university campus and health precinct. Graduate roles are emerging in health, education, and the growing professional services sector.",
  },
  {
    slug: "carindale",
    name: "Carindale",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 67_000,
    description:
      "Carindale is an established eastside suburb in Brisbane. Graduates in the area typically commute to the CBD or work in local retail, education, and professional services roles.",
    employmentNote:
      "Carindale offers a suburban lifestyle with reasonable CBD access. Local graduate employment centres include Westfield Carindale and schools in the Carindale/Carina corridor.",
  },
  {
    slug: "woolloongabba",
    name: "Woolloongabba",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 69_000,
    description:
      "Woolloongabba is an inner-south suburb undergoing transformation for the 2032 Olympics. The area is increasingly popular with graduates due to proximity to the CBD and growing health precinct.",
    employmentNote:
      "The Princess Alexandra Hospital and nearby Mater Hospital create strong graduate demand in health sciences. The 2032 Olympics redevelopment is expected to bring new employment opportunities.",
  },
  {
    slug: "nundah",
    name: "Nundah",
    state: "QLD",
    city: "Brisbane",
    avgGraduateSalary: 67_000,
    description:
      "Nundah is a vibrant northside village suburb popular with young professionals and graduates. Good train connectivity makes it easy to commute to the CBD and surrounding employment centres.",
    employmentNote:
      "Nundah's affordability and village atmosphere attract graduates who commute to the CBD. Local employment includes the nearby Royal Brisbane Hospital precinct and Nundah Village businesses.",
  },

  // ─── Perth (WA) ───────────────────────────────────────────────────────────────
  {
    slug: "cottesloe",
    name: "Cottesloe",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 78_000,
    description:
      "Cottesloe is Perth's premier beachside suburb. Graduates in the area tend to work in Perth's mining and resources sector head offices, with above-average salaries reflecting WA's resource economy.",
    employmentNote:
      "Western suburbs graduates benefit from Perth's mining and resources sector headquarters, which offer some of Australia's highest graduate salaries, particularly in engineering and geoscience.",
  },
  {
    slug: "joondalup",
    name: "Joondalup",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 72_000,
    description:
      "Joondalup is a major northern suburban centre with its own university (ECU) and hospital. The area provides diverse graduate employment in health, education, and professional services.",
    employmentNote:
      "ECU Joondalup campus and Joondalup Health Campus create local graduate pathways in nursing, allied health, and education, while the train line provides easy CBD commuting.",
  },
  {
    slug: "fremantle",
    name: "Fremantle",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 73_000,
    description:
      "Fremantle is Perth's historic port city with a creative and independent culture. Graduates in the area work across maritime, creative industries, and increasingly in tech and professional services.",
    employmentNote:
      "Fremantle's Notre Dame University campus and port-related industries provide local graduate employment. The suburb also has a growing creative and tech startup scene.",
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 74_000,
    description:
      "Scarborough is Perth's popular beach suburb. Graduates living here typically commute to Perth CBD or the nearby Stirling/Osborne Park commercial precincts.",
    employmentNote:
      "Scarborough's proximity to the Stirling/Innaloo commercial precinct and good road access to the CBD makes it popular with graduates across multiple industries.",
  },
  {
    slug: "subiaco",
    name: "Subiaco",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 77_000,
    description:
      "Subiaco is an inner-city Perth suburb known for its walkability and proximity to the CBD. Graduates here often work in mining head offices, professional services, and the nearby hospital precinct.",
    employmentNote:
      "Subiaco benefits from proximity to Perth CBD's mining company headquarters and the St John of God Subiaco Hospital, both of which attract well-paid graduate roles.",
  },
  {
    slug: "rockingham",
    name: "Rockingham",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 71_000,
    description:
      "Rockingham is a coastal city south of Perth with employment driven by the nearby HMAS Stirling naval base, Kwinana industrial strip, and local health and education services.",
    employmentNote:
      "The Australian Defence Force presence at HMAS Stirling and the Kwinana industrial area provide graduate roles in engineering, defence, and trades-related professional services.",
  },
  {
    slug: "nedlands",
    name: "Nedlands",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 78_000,
    description:
      "Nedlands is home to the University of Western Australia and QEII Medical Centre, making it a key hub for graduate employment in research, health, and academia.",
    employmentNote:
      "UWA and QEII Medical Centre form one of WA's largest graduate employment clusters. Research, medical, and academic roles offer competitive salaries, particularly in STEM and health.",
  },
  {
    slug: "morley",
    name: "Morley",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 73_000,
    description:
      "Morley is a well-connected suburban centre in Perth's north-east. Graduates in the area benefit from good access to the CBD and the Tonkin Highway industrial/commercial corridor.",
    employmentNote:
      "Morley's central location provides easy access to Perth CBD and the eastern suburbs' commercial zones. Graduate roles span retail management, professional services, and logistics.",
  },
  {
    slug: "victoria-park",
    name: "Victoria Park",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 74_000,
    description:
      "Victoria Park is a vibrant inner-south suburb close to Perth CBD and Curtin University. The area is popular with graduates working in the CBD's mining, finance, and government sectors.",
    employmentNote:
      "Curtin University's nearby Bentley campus and proximity to the CBD make Victoria Park attractive for graduates. The suburb is increasingly popular with tech and professional services workers.",
  },
  {
    slug: "claremont",
    name: "Claremont",
    state: "WA",
    city: "Perth",
    avgGraduateSalary: 77_000,
    description:
      "Claremont is an affluent western suburb with a premium shopping quarter. Graduates in the area tend to work in Perth CBD's high-paying mining, finance, and legal sectors.",
    employmentNote:
      "Western suburbs graduates have above-average salaries driven by the mining sector's head offices and Perth's Big Four consulting and legal firms concentrated in the CBD.",
  },

  // ─── Adelaide (SA) ────────────────────────────────────────────────────────────
  {
    slug: "glenelg",
    name: "Glenelg",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 66_000,
    description:
      "Glenelg is Adelaide's best-known beachside suburb. Graduates benefit from the tram connection to the CBD and work across Adelaide's government, health, and defence sectors.",
    employmentNote:
      "Adelaide's more affordable cost of living means graduate salaries are lower in nominal terms but purchasing power is competitive. Defence (ASC, BAE Systems) is a growing employer of STEM graduates.",
  },
  {
    slug: "adelaide-cbd",
    name: "Adelaide CBD",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 67_000,
    description:
      "Adelaide CBD is compact and walkable, with the state's highest concentration of graduate employers in government, professional services, tech, and health.",
    employmentNote:
      "The CBD houses SA government departments, BankSA/Westpac offices, and a growing tech scene around Lot Fourteen. Graduate salaries are competitive for Adelaide's lower cost of living.",
  },
  {
    slug: "norwood",
    name: "Norwood",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 67_000,
    description:
      "Norwood is one of Adelaide's most established inner suburbs. Graduates in the area benefit from easy CBD access and the concentration of professional services along The Parade.",
    employmentNote:
      "Norwood's inner-east location provides quick access to Adelaide's CBD employment centres. Local businesses along The Parade also provide graduate opportunities in professional services.",
  },
  {
    slug: "unley",
    name: "Unley",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 67_000,
    description:
      "Unley is a leafy inner-south suburb popular with families and professionals. Graduates benefit from proximity to the CBD and the growing South Road employment corridor.",
    employmentNote:
      "Inner southern suburbs graduates have good access to Adelaide's CBD and the Flinders Medical Centre / Flinders University precinct, which is a major graduate employer in health and research.",
  },
  {
    slug: "prospect",
    name: "Prospect",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 66_000,
    description:
      "Prospect is a vibrant inner-north suburb attracting graduates and young professionals. The area benefits from proximity to the CBD and the growing north Adelaide innovation precinct.",
    employmentNote:
      "Prospect's proximity to Lot Fourteen (Adelaide's innovation district) and the CBD makes it attractive for graduates in tech, defence innovation, and government roles.",
  },
  {
    slug: "henley-beach",
    name: "Henley Beach",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 66_000,
    description:
      "Henley Beach is a popular coastal suburb in Adelaide's west. Graduates enjoy a beachside lifestyle while commuting to the CBD, defence facilities at Edinburgh, or Osborne shipyards.",
    employmentNote:
      "Western suburbs graduates in Adelaide increasingly work in the defence sector, with ASC and BAE Systems shipbuilding at nearby Osborne creating demand for engineering and project management graduates.",
  },
  {
    slug: "elizabeth",
    name: "Elizabeth",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 62_000,
    description:
      "Elizabeth is a major suburban centre in Adelaide's north. Graduate employment centres include the Lyell McEwin Hospital, Edinburgh Defence Precinct, and local government services.",
    employmentNote:
      "Northern Adelaide graduate salaries are below the state average, though the Edinburgh Defence Precinct and health sector provide pathways to above-average earnings for STEM and health graduates.",
  },
  {
    slug: "modbury",
    name: "Modbury",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 64_000,
    description:
      "Modbury is a well-established north-eastern suburb with the O-Bahn providing fast CBD access. Graduates work in local health services (Modbury Hospital) and commute to the CBD.",
    employmentNote:
      "The O-Bahn busway gives Modbury one of Adelaide's fastest commutes to the CBD. Local graduate employment includes Modbury Hospital and Tea Tree Plaza's retail and services sector.",
  },
  {
    slug: "marion",
    name: "Marion",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 65_000,
    description:
      "Marion is a southern suburbs hub near Flinders University. Graduates in the area benefit from proximity to both the university's research precinct and the Tonsley Innovation District.",
    employmentNote:
      "The Tonsley Innovation District and nearby Flinders University provide growing graduate opportunities in advanced manufacturing, clean energy, and health research.",
  },
  {
    slug: "semaphore",
    name: "Semaphore",
    state: "SA",
    city: "Adelaide",
    avgGraduateSalary: 65_000,
    description:
      "Semaphore is a charming coastal suburb in Adelaide's west. Graduates in the area benefit from the growing Osborne Naval Shipbuilding precinct and Port Adelaide's redevelopment.",
    employmentNote:
      "The Osborne shipbuilding precinct (Hunter-class frigates, Attack-class submarines) is creating significant demand for engineering, project management, and trades graduates in the western suburbs.",
  },
];

export const SLUG_TO_SUBURB: Record<string, HecsSuburbData> = Object.fromEntries(
  SUBURBS.map((s) => [s.slug, s])
);

export const SUBURBS_BY_CITY: Record<string, HecsSuburbData[]> = SUBURBS.reduce(
  (acc, s) => {
    if (!acc[s.city]) acc[s.city] = [];
    acc[s.city].push(s);
    return acc;
  },
  {} as Record<string, HecsSuburbData[]>
);

export const CITY_ORDER = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"];

// Average HECS-HELP debt at graduation (2025-26 estimate, ABS/DESE)
export const AVG_HECS_DEBT = 26_500;

// National average graduate salary for comparison
export const NATIONAL_AVG_GRAD_SALARY = 70_000;

// State average graduate salaries for comparison tables
export const STATE_AVERAGES: Record<string, number> = STATE_GRAD_SALARY;
