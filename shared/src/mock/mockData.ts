import {
  UserProfile,
  Farm,
  Pond,
  WaterQualityReading,
  FeedRecord,
  ExpenseRecord,
  Reminder,
  LearningArticle,
  SupportTicket,
  WeatherData,
  AuditLogItem,
  PlatformMetrics,
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-farmer-01',
  name: 'Ramesh Varma',
  phone: '+91 98480 23456',
  email: 'ramesh.varma@aquasustain.in',
  role: 'farmer',
  preferredLanguage: 'en',
  farmCount: 2,
  pondCount: 4,
  state: 'Andhra Pradesh',
  district: 'West Godavari',
  village: 'Undi (Bhimavaram Region)',
  createdAt: '2026-03-15T09:00:00.000Z',
};

export const INITIAL_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  name: 'Dr. K. Srinivas Rao',
  phone: '+91 94401 88765',
  email: 'srinivas.rao@aquasustain.gov.in',
  role: 'admin',
  preferredLanguage: 'en',
  farmCount: 0,
  pondCount: 0,
  state: 'Andhra Pradesh',
  district: 'Visakhapatnam',
  village: 'Central Aquaculture Mission',
  createdAt: '2025-12-01T08:00:00.000Z',
};

export const INITIAL_EVALUATOR_USER: UserProfile = {
  id: 'usr-eval-01',
  name: 'Prof. Ananya Sen',
  phone: '+91 97321 44550',
  email: 'ananya.sen@academics-eval.org',
  role: 'evaluator',
  preferredLanguage: 'en',
  farmCount: 0,
  pondCount: 0,
  state: 'West Bengal / AP',
  district: 'Academic Evaluation Council',
  village: 'Department of Marine Science & Community Service',
  createdAt: '2026-11-01T10:00:00.000Z',
};

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-01',
    farmerId: 'usr-farmer-01',
    name: 'Godavari Delta Aqua Greens',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    mandal: 'Undi',
    village: 'Undi Delta',
    totalAreaAcres: 8.5,
    waterSource: 'Canal',
    soilType: 'Clay Loam',
    registrationNumber: 'CAA/2025/AP/WG/4412',
    caaRegistrationNumber: 'CAA/REG/9924/2025',
    establishedYear: 2021,
    status: 'Active',
  },
  {
    id: 'farm-02',
    farmerId: 'usr-farmer-01',
    name: 'Krishna Coastal Shrimp Haven',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    mandal: 'Nagayalanka',
    village: 'Edurumondi',
    totalAreaAcres: 5.0,
    waterSource: 'Creek',
    soilType: 'Saline Soil',
    registrationNumber: 'CAA/2024/AP/KR/8120',
    caaRegistrationNumber: 'CAA/REG/7701/2024',
    establishedYear: 2023,
    status: 'Active',
  },
];

export const INITIAL_PONDS: Pond[] = [
  {
    id: 'pond-01',
    farmId: 'farm-01',
    name: 'Pond A-1 (High-Yield Vannamei)',
    code: 'GDA-P1',
    waterAreaAcres: 1.8,
    averageDepthMeters: 1.4,
    species: 'L. vannamei (Whiteleg Shrimp)',
    stockingDate: '2026-09-28',
    daysOfCulture: 54,
    stockingDensityPerSqm: 45,
    totalStockCount: 327000,
    estimatedSurvivalRatePercent: 84,
    currentEstimatedBiomassKg: 4620,
    currentMeanBodyWeightGrams: 16.8,
    targetHarvestWeightGrams: 28.0,
    targetHarvestDate: '2026-12-15',
    cultureStage: 'Grow-out (Mid)',
    aeratorHpTotal: 16,
    status: 'Optimal',
    lastWaterQualityTest: '2026-11-20T06:15:00.000Z',
    lastFeedingRecorded: '2026-11-20T11:00:00.000Z',
  },
  {
    id: 'pond-02',
    farmId: 'farm-01',
    name: 'Pond A-2 (Nursery Vannamei)',
    code: 'GDA-P2',
    waterAreaAcres: 1.0,
    averageDepthMeters: 1.2,
    species: 'L. vannamei (Whiteleg Shrimp)',
    stockingDate: '2026-10-30',
    daysOfCulture: 22,
    stockingDensityPerSqm: 65,
    totalStockCount: 263000,
    estimatedSurvivalRatePercent: 91,
    currentEstimatedBiomassKg: 1120,
    currentMeanBodyWeightGrams: 4.7,
    targetHarvestWeightGrams: 25.0,
    targetHarvestDate: '2027-01-20',
    cultureStage: 'Grow-out (Early)',
    aeratorHpTotal: 12,
    status: 'Attention',
    lastWaterQualityTest: '2026-11-19T18:00:00.000Z',
    lastFeedingRecorded: '2026-11-20T06:00:00.000Z',
  },
  {
    id: 'pond-03',
    farmId: 'farm-01',
    name: 'Pond B-1 (Indian Major Carp Poly)',
    code: 'GDA-P3',
    waterAreaAcres: 3.2,
    averageDepthMeters: 1.8,
    species: 'Catla & Rohu (Carp)',
    stockingDate: '2026-06-10',
    daysOfCulture: 164,
    stockingDensityPerSqm: 1.5,
    totalStockCount: 19400,
    estimatedSurvivalRatePercent: 88,
    currentEstimatedBiomassKg: 11800,
    currentMeanBodyWeightGrams: 690,
    targetHarvestWeightGrams: 1000,
    targetHarvestDate: '2026-12-30',
    cultureStage: 'Pre-harvest',
    aeratorHpTotal: 10,
    status: 'Optimal',
    lastWaterQualityTest: '2026-11-18T07:30:00.000Z',
    lastFeedingRecorded: '2026-11-19T15:00:00.000Z',
  },
  {
    id: 'pond-04',
    farmId: 'farm-02',
    name: 'Pond K-1 (Coastal Monodon Nursery)',
    code: 'KCS-P1',
    waterAreaAcres: 2.2,
    averageDepthMeters: 1.3,
    species: 'P. monodon (Black Tiger)',
    stockingDate: '2026-10-05',
    daysOfCulture: 47,
    stockingDensityPerSqm: 25,
    totalStockCount: 222000,
    estimatedSurvivalRatePercent: 78,
    currentEstimatedBiomassKg: 3100,
    currentMeanBodyWeightGrams: 17.9,
    targetHarvestWeightGrams: 35.0,
    targetHarvestDate: '2027-01-10',
    cultureStage: 'Grow-out (Mid)',
    aeratorHpTotal: 14,
    status: 'Critical',
    lastWaterQualityTest: '2026-11-20T05:45:00.000Z',
    lastFeedingRecorded: '2026-11-20T06:00:00.000Z',
  },
];

export const INITIAL_WATER_READINGS: WaterQualityReading[] = [
  {
    id: 'wq-01',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    timestamp: '2026-11-20T06:15:00.000Z',
    recordedBy: 'Ramesh Varma',
    temperatureC: 27.8,
    ph: 7.9,
    dissolvedOxygenMgL: 5.6,
    transparencyCm: 34,
    salinityPpt: 18.5,
    alkalinityPpm: 135,
    ammoniaPpm: 0.08,
    nitritePpm: 0.15,
    hardnessPpm: 4200,
    notes: 'Morning test. Dissolved oxygen stable with 8 aerators on during night.',
    status: 'Normal',
  },
  {
    id: 'wq-02',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    timestamp: '2026-11-19T17:30:00.000Z',
    recordedBy: 'Ramesh Varma',
    temperatureC: 30.2,
    ph: 8.3,
    dissolvedOxygenMgL: 7.4,
    transparencyCm: 32,
    salinityPpt: 18.5,
    alkalinityPpm: 138,
    ammoniaPpm: 0.07,
    nitritePpm: 0.12,
    notes: 'Afternoon reading. Photosynthesis peaked; DO healthy.',
    status: 'Normal',
  },
  {
    id: 'wq-03',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    timestamp: '2026-11-19T06:00:00.000Z',
    recordedBy: 'Ramesh Varma',
    temperatureC: 27.5,
    ph: 7.8,
    dissolvedOxygenMgL: 5.2,
    transparencyCm: 36,
    salinityPpt: 18.2,
    alkalinityPpm: 132,
    ammoniaPpm: 0.09,
    nitritePpm: 0.18,
    status: 'Normal',
  },
  {
    id: 'wq-04',
    pondId: 'pond-02',
    pondName: 'Pond A-2 (Nursery Vannamei)',
    timestamp: '2026-11-19T18:00:00.000Z',
    recordedBy: 'Ramesh Varma',
    temperatureC: 30.8,
    ph: 8.8,
    dissolvedOxygenMgL: 6.8,
    transparencyCm: 22,
    salinityPpt: 20.0,
    alkalinityPpm: 110,
    ammoniaPpm: 0.45,
    nitritePpm: 0.65,
    notes: 'High plankton bloom. Transparency down to 22cm; slight afternoon pH surge.',
    status: 'Alert',
    alertsTriggered: ['Elevated pH (8.8)', 'Dense bloom transparency (22cm)', 'Elevated Ammonia (0.45 ppm)'],
  },
  {
    id: 'wq-05',
    pondId: 'pond-04',
    pondName: 'Pond K-1 (Coastal Monodon Nursery)',
    timestamp: '2026-11-20T05:45:00.000Z',
    recordedBy: 'Ramesh Varma',
    temperatureC: 28.1,
    ph: 7.2,
    dissolvedOxygenMgL: 3.4,
    transparencyCm: 26,
    salinityPpt: 22.0,
    alkalinityPpm: 88,
    ammoniaPpm: 1.15,
    nitritePpm: 1.80,
    notes: 'Critical DO drop predawn. Strong ammonia spike. 2 aerator motors tripped overnight.',
    status: 'Critical',
    alertsTriggered: ['Critical Hypoxia (<3.5 mg/L)', 'Hazardous Ammonia Spike (1.15 ppm)', 'Low Alkalinity (<100 ppm)'],
  },
];

export const INITIAL_FEEDS: FeedRecord[] = [
  {
    id: 'feed-01',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    date: '2026-11-20',
    feedSlot: 'Morning (06:00)',
    feedBrand: 'CP Aquaculture Grower 35% Protein',
    feedType: 'Grower (1.4mm-1.8mm)',
    quantityKg: 38,
    unitPricePerKg: 88,
    totalCost: 3344,
    checkTrayObservation: 'Clean (Nominal)',
    notes: 'Check trays completely cleared within 90 minutes. Healthy feeding response.',
  },
  {
    id: 'feed-02',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    date: '2026-11-20',
    feedSlot: 'Noon (11:00)',
    feedBrand: 'CP Aquaculture Grower 35% Protein',
    feedType: 'Grower (1.4mm-1.8mm)',
    quantityKg: 42,
    unitPricePerKg: 88,
    totalCost: 3696,
    checkTrayObservation: '100% Consumed (Increase slightly)',
  },
  {
    id: 'feed-03',
    pondId: 'pond-02',
    pondName: 'Pond A-2 (Nursery Vannamei)',
    date: '2026-11-20',
    feedSlot: 'Morning (06:00)',
    feedBrand: 'Grobest Starter Crumble',
    feedType: 'Starter (0.8mm-1.2mm)',
    quantityKg: 18,
    unitPricePerKg: 104,
    totalCost: 1872,
    checkTrayObservation: '10-20% Leftover (Reduce 10%)',
    notes: 'Leftovers observed in tray 3. Trimmed midday allocation.',
  },
  {
    id: 'feed-04',
    pondId: 'pond-04',
    pondName: 'Pond K-1 (Coastal Monodon Nursery)',
    date: '2026-11-20',
    feedSlot: 'Morning (06:00)',
    feedBrand: 'Avanti Feeds Marine Feed',
    feedType: 'Grower (1.4mm-1.8mm)',
    quantityKg: 15,
    unitPricePerKg: 92,
    totalCost: 1380,
    checkTrayObservation: 'Heavy Leftover (Halt feeding)',
    notes: 'Feeding suspended due to predawn hypoxia and ammonia spike.',
  },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-01',
    farmId: 'farm-01',
    farmName: 'Godavari Delta Aqua Greens',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    date: '2026-11-18',
    category: 'Feed',
    amount: 52800,
    description: 'Bulk purchase: 600kg CP Aquaculture Grower Pellets',
    vendorName: 'Bhimavaram Aqua Agencies',
    paymentMode: 'UPI',
    invoiceNumber: 'INV-2026-1189',
  },
  {
    id: 'exp-02',
    farmId: 'farm-01',
    farmName: 'Godavari Delta Aqua Greens',
    date: '2026-11-15',
    category: 'Electricity & Diesel',
    amount: 24500,
    description: 'Monthly APEPDCL agricultural power bill for 8 aerator connections',
    vendorName: 'APEPDCL Substation Undi',
    paymentMode: 'NEFT / Bank Transfer',
    invoiceNumber: 'APEPDCL-UND-99120',
  },
  {
    id: 'exp-03',
    farmId: 'farm-01',
    farmName: 'Godavari Delta Aqua Greens',
    pondId: 'pond-02',
    pondName: 'Pond A-2 (Nursery Vannamei)',
    date: '2026-11-12',
    category: 'Probiotics & Minerals',
    amount: 14200,
    description: 'Rhodococcus soil probiotic & dolomite lime (20 bags)',
    vendorName: 'Sri Balaji Agro-Chemicals',
    paymentMode: 'UPI',
  },
  {
    id: 'exp-04',
    farmId: 'farm-01',
    farmName: 'Godavari Delta Aqua Greens',
    date: '2026-11-10',
    category: 'Labour Wages',
    amount: 18000,
    description: 'Fortnightly wages for 3 resident farm assistants',
    vendorName: 'Farm Crew',
    paymentMode: 'Cash',
  },
  {
    id: 'exp-05',
    farmId: 'farm-02',
    farmName: 'Krishna Coastal Shrimp Haven',
    pondId: 'pond-04',
    pondName: 'Pond K-1 (Coastal Monodon Nursery)',
    date: '2026-11-08',
    category: 'Equipment & Aeration Spares',
    amount: 8500,
    description: 'Paddlewheel nylon bushes, shaft couplers and SS bolts replacement',
    vendorName: 'Machilipatnam Marine Workshop',
    paymentMode: 'Cash',
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-01',
    farmerId: 'usr-farmer-01',
    title: 'Predawn DO Check & Aerator RPM Audit',
    description: 'Check DO with handheld probe at 05:30 AM across all four corners of Pond A-1.',
    category: 'Water Quality Testing',
    dueDate: '2026-11-21',
    dueTime: '05:30',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-11-19T14:00:00.000Z',
  },
  {
    id: 'rem-02',
    farmerId: 'usr-farmer-01',
    title: 'Apply Nitrosomonas / Soil Probiotic Mix',
    description: 'Dose 1kg fermented pond probiotic with 10kg jaggery solution along the windward dyke.',
    category: 'Probiotic Application',
    dueDate: '2026-11-21',
    dueTime: '09:00',
    pondId: 'pond-02',
    pondName: 'Pond A-2 (Nursery Vannamei)',
    priority: 'Medium',
    status: 'Pending',
    createdAt: '2026-11-19T10:00:00.000Z',
  },
  {
    id: 'rem-03',
    farmerId: 'usr-farmer-01',
    title: 'Weekly Shrimp Cast-Net Sampling & Weighing',
    description: 'Cast net in 3 spots; count 100 shrimp to calculate Mean Body Weight (MBW) and survival rate.',
    category: 'Biomass Sampling',
    dueDate: '2026-11-22',
    dueTime: '07:00',
    pondId: 'pond-01',
    pondName: 'Pond A-1 (High-Yield Vannamei)',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-11-18T16:00:00.000Z',
  },
  {
    id: 'rem-04',
    farmerId: 'usr-farmer-01',
    title: 'MPEDA CAA License Renewal Verification',
    description: 'Review digital renewal certificate and submit groundwater salinity survey to district office.',
    category: 'Govt Scheme / Subsidy',
    dueDate: '2026-11-25',
    dueTime: '11:00',
    priority: 'Low',
    status: 'Pending',
    createdAt: '2026-11-10T08:00:00.000Z',
  },
];

export const INITIAL_ARTICLES: LearningArticle[] = [
  {
    id: 'art-01',
    slug: 'managing-diurnal-dissolved-oxygen-swings',
    category: 'water_management',
    readingTimeMinutes: 5,
    publishedDate: '2026-10-15',
    author: 'Dr. T. Venkataramana',
    authorRole: 'Senior Aquaculture Scientist, CIBA',
    verifiedByExpert: true,
    expertName: 'Dr. T. Venkataramana (CIBA Chennai)',
    bannerGradient: 'from-emerald-700 to-teal-900',
    tags: ['Dissolved Oxygen', 'Aeration', 'Penaeus vannamei', 'Water Chemistry'],
    title: {
      en: 'Managing Diurnal Dissolved Oxygen Fluctuation in High-Density Shrimp Ponds',
      te: 'రొయ్యల చెరువులలో ఆక్సిజన్ హెచ్చుతగ్గుల నియంత్రణ మరియు ఏరియేషన్ నిర్వహణ',
      hi: 'सघन झींगा तालाबों में घुलित ऑक्सीजन के उतार-चढ़ाव का वैज्ञानिक प्रबंधन',
    },
    summary: {
      en: 'A practical guide to preventing predawn hypoxia, optimizing aerator placement, and using check trays to calibrate feeding according to dissolved oxygen levels.',
      te: 'తెల్లవారుజామున ఆక్సిజన్ కొరతను నివారించడం, ఏరియేటర్ల సరైన అమరిక మరియు ఆక్సిజన్ ఆధారిత మేత నియంత్రణపై సమగ్ర మార్గదర్శిని.',
      hi: 'प्रातःकाल ऑक्सीजन की कमी को रोकने, एरेटरों के सही स्थान और ऑक्सीजन स्तर के अनुसार चारे के समायोजन पर व्यावहारिक मार्गदर्शिका।',
    },
    contentMarkdown: {
      en: `### 1. The Physics of Diurnal Oxygen Swings
In intensive shrimp aquaculture, oxygen levels follow a predictable 24-hour sinusoidal curve:
- **06:00 AM:** Predawn minimum (lowest DO of the day due to overnight respiration of shrimp and microalgae).
- **02:00 PM:** Afternoon peak (supersaturation of DO reaching up to 10-12 mg/L driven by microalgal photosynthesis).

### 2. Critical Thresholds for *L. vannamei*
- **Above 5.0 mg/L:** Optimal growth, active digestion, immune vigor.
- **3.5 - 4.5 mg/L:** Sub-lethal stress. Feeding appetite declines by 30%.
- **Below 3.0 mg/L:** Acute hypoxia. Shrimp crowd shallow pond dikes and surface. Risk of mass asphyxiation within 120 minutes.

### 3. Practical Action Steps for Farmers
1. **The 3:00 AM Rule:** Never rely on afternoon DO readings to judge pond safety. Test DO between 04:30 AM and 05:30 AM.
2. **Impeller Direction:** Align paddlewheel aerators to establish a continuous circular water vortex. This concentrates sludge into the central drain pit while distributing oxygenated water uniformly.
3. **Emergency Oxygenation:** Keep Sodium Percarbonate granules on site. Broad-spread 2.5 kg/acre when DO drops under 3.5 mg/L during calm overcast weather.`,
      te: `### 1. ఆక్సిజన్ హెచ్చుతగ్గుల శాస్త్రీయ కారణాలు
తీవ్రతర రొయ్యల సాగులో నీటిలో ఆక్సిజన్ పరిమాణం 24 గంటలలో మారుతూ ఉంటుంది:
- **ఉదయం 06:00:** అత్యల్ప ఆక్సిజన్ సమయం (రాత్రిపూట నాచు మరియు రొయ్యల శ్వాసక్రియ వల్ల ఆక్సిజన్ బాగా తగ్గుతుంది).
- **మధ్యాహ్నం 02:00:** అత్యధిక ఆక్సిజన్ సమయం (సూర్యరశ్మి మరియు కిరణజన్య సంయోగక్రియ వల్ల ఆక్సిజన్ 10-12 mg/L వరకు పెరుగుతుంది).

### 2. వనామి రొయ్యలకు అవసరమైన ప్రామాణిక విలువలు
- **5.0 mg/L కంటే ఎక్కువ:** అత్యంత అనుకూలం, చురుకైన ఎదుగుదల మరియు రోగనిరోధక శక్తి.
- **3.5 - 4.5 mg/L:** ఒత్తిడి పరిస్థితి. మేత తినడం 30% తగ్గుతుంది.
- **3.0 mg/L కంటే తక్కువ:** అత్యవసర పరిస్థితి. రొయ్యలు గట్లపైకి రావడం మరియు ఊపిరాడక చనిపోయే ప్రమాదం.

### 3. రైతులకు ముఖ్యమైన ఆచరణాత్మక సూచనలు
1. **తెల్లవారుజామున పరీక్ష:** ఎప్పుడూ మధ్యాహ్నం పరీక్షించిన ఆక్సిజన్‌ను నమ్ముకోవద్దు. ఉదయం 4:30 నుండి 5:30 మధ్య ఖచ్చితంగా టెస్ట్ చేయండి.
2. **ఏరియేటర్ల అమరిక:** ఏరియేటర్లు తిరిగే దిశ చెరువు నీటిలో గుండ్రని ప్రవాహాన్ని సృష్టించాలి. దీనివల్ల మధ్యలో పూడిక పోగుపడుతుంది.
3. **అత్యవసర ఆక్సిజన్:** క్లిష్ట సమయాల్లో చల్లడానికి సోడియం పెర్కార్బోనేట్ పొడి ఎల్లప్పుడూ సిద్ధంగా ఉంచుకోండి.`,
      hi: `### 1. दैनिक ऑक्सीजन चक्र
झींगा पालन में पानी में घुलित ऑक्सीजन का स्तर 24 घंटे में बदलता रहता है:
- **सुबह 06:00 बजे:** सबसे कम स्तर (रात भर जलीय जीवों और शैवाल के श्वसन के कारण)।
- **दोपहर 02:00 बजे:** उच्चतम स्तर (सूर्य के प्रकाश में प्रकाश संश्लेषण के कारण)।

### 2. वन्नामी झींगा के लिए महत्वपूर्ण सीमाएं
- **5.0 mg/L से अधिक:** सर्वोत्तम स्वास्थ्य, तेज वृद्धि और अच्छा पाचन।
- **3.5 - 4.5 mg/L:** तनावपूर्ण स्थिति। चारे की खपत 30% तक कम हो जाती है।
- **3.0 mg/L से कम:** आपातकालीन संकट। झींगे पानी की सतह पर आने लगते हैं और दम घुटने का खतरा होता है।

### 3. किसानों के लिए व्यावहारिक सुझाव
1. **सुबह की जांच:** हमेशा सुबह 4:30 से 5:30 बजे के बीच ऑक्सीजन नापें।
2. **एरेटर की दिशा:** एरेटर को ऐसे लगाएं कि पानी में गोलाकार बहाव बने और मैल केंद्र में इकट्ठा हो।
3. **आपातकालीन दवा:** ऑक्सीजन 3.5 से नीचे जाने पर सोडियम परकार्बोनेट का छिड़काव करें।`,
    },
  },
  {
    id: 'art-02',
    slug: 'feed-conversion-ratio-optimization',
    category: 'feed_management',
    readingTimeMinutes: 6,
    publishedDate: '2026-10-22',
    author: 'Dr. S. K. Roy',
    authorRole: 'Feed Nutrition Specialist',
    verifiedByExpert: true,
    expertName: 'Dr. S. K. Roy (NBFGR)',
    bannerGradient: 'from-amber-700 to-emerald-900',
    tags: ['FCR', 'Feed Management', 'Check Tray', 'Cost Reduction'],
    title: {
      en: 'Mastering Feed Conversion Ratio (FCR) & Check-Tray Optimization',
      te: 'మేత మార్పిడి నిష్పత్తి (FCR) తగ్గింపు మరియు చెక్-ట్రే నిర్వహణ సూత్రాలు',
      hi: 'चारा रूपांतरण अनुपात (FCR) में सुधार और चेक-ट्रे प्रबंधन',
    },
    summary: {
      en: 'Feed represents 55-65% of total aquaculture operational costs. Learn how to calibrate check trays, avoid overfeeding, and reduce FCR from 1.6 to 1.25.',
      te: 'సాగు మొత్తం ఖర్చులో మేతకే 55-65% ఖర్చవుతుంది. మేత వృధాను అరికట్టి FCR ని తగ్గించే సాంకేతిక పద్ధతులు.',
      hi: 'मत्स्य पालन में 55-65% खर्च चारे पर होता है। चेक-ट्रे के माध्यम से चारे की बर्बादी रोकने के उपाय।',
    },
    contentMarkdown: {
      en: `### 1. What FCR Means in Real Currency
Feed Conversion Ratio (FCR) is calculated as:
**FCR = Total Feed Used (kg) ÷ Total Biomass Harvested (kg)**
- At an FCR of 1.6 with feed at ₹88/kg, feed cost is **₹140.80 per kg of shrimp**.
- At an FCR of 1.25, feed cost drops to **₹110.00 per kg of shrimp**.
- On a 4-ton crop, optimizing FCR saves **₹1,23,200 pure profit**.

### 2. Standard Check-Tray Protocol
- Place 4 check trays per 1-acre pond (one near each aerator zone, away from dikes).
- Place **1.0% to 1.2%** of the scheduled meal quantity into the trays.
- Inspect trays after:
  - 2.0 hours (for shrimp under 10 grams)
  - 1.5 hours (for shrimp between 10g and 20g)
  - 1.0 hour (for shrimp above 20g)

### 3. Tray Decision Rules
- **Tray completely empty:** Increase the next feeding by 5%.
- **Small scattered granules remaining:** Maintain identical ration.
- **More than 15% leftover:** Cut subsequent ration by 25%.
- **Heavy leftover across all trays:** Immediately halt next feeding, inspect DO, pH, and bottom water for hydrogen sulfide.`,
      te: `### 1. FCR మరియు రైతు లాభం
మేత మార్పిడి నిష్పత్తి (FCR):
**FCR = ఇచ్చిన మొత్తం మేత (కిలోలు) ÷ పట్టిన మొత్తం దిగుబడి (కిలోలు)**
- 1.6 FCR ఉంటే కిలో రొయ్యల ఉత్పత్తికి మేత ఖర్చు **₹140.80**.
- అదే FCR ని 1.25 కి తగ్గించగలిగితే మేత ఖర్చు **₹110.00** కి తగ్గుతుంది.
- 4 టన్నుల పంటపై రైతుకు **₹1,23,200 నికర ఆదా** లభిస్తుంది.

### 2. చెక్-ట్రేల సరైన పరిశీలన
- ఒక ఎకరాకు 4 చెక్ ట్రేలను సమ దూరంలో ఏర్పాటు చేయండి.
- వేసే మేతలో **1.0% నుండి 1.2%** భాగం ట్రేలలో ఉంచండి.
- రొయ్యల బరువును బట్టి 1.5 గంటల తర్వాత పరిశీలించండి.

### 3. నిర్ణయాత్మక చర్యలు
- **ట్రే పూర్తిగా ఖాళీ:** తదుపరి విడతలో 5% మేత పెంచండి.
- **స్వల్పంగా మిగిలి ఉంటే:** అదే పరిమాణంలో కొనసాగించండి.
- **15% కంటే ఎక్కువ మిగిలితే:** తదుపరి విడతలో 25% మేత తగ్గించండి.
- **అన్ని ట్రేలలో మేత మిగిలిపోతే:** తక్షణమే తదుపరి మేత ఆపి నీటిలో ఆక్సిజన్ మరియు అమ్మోనియా పరీక్షించండి.`,
      hi: `### 1. FCR और बचत का गणित
चारा रूपांतरण अनुपात (FCR):
**FCR = कुल दिया गया चारा (kg) ÷ कुल प्राप्त उत्पादन (kg)**
- FCR 1.6 होने पर 1 किलो झींगे पर चारे का खर्च लगभग **₹140.80** आता है।
- FCR 1.25 करने पर यह खर्च घटकर **₹110.00** रह जाता है।
- 4 टन की फसल में सीधे **₹1,23,200 की अतिरिक्त बचत** होती है।

### 2. चेक-ट्रे जांच का सही तरीका
- प्रति एकड़ 4 चेक-ट्रे लगाएं।
- कुल खुराक का **1% हिस्सा** ट्रे में रखें।
- 1.5 घंटे बाद ट्रे को बाहर निकालकर देखें।
- यदि चारा बच रहा है तो तुरंत खुराक घटाएं ताकि तालाब की तली खराब न हो।`,
    },
  },
  {
    id: 'art-03',
    slug: 'early-detection-white-spot-and-ehp',
    category: 'disease_awareness',
    readingTimeMinutes: 7,
    publishedDate: '2026-10-30',
    author: 'Dr. M. Sailaja',
    authorRole: 'Aquatic Pathologist',
    verifiedByExpert: true,
    expertName: 'Dr. M. Sailaja (State Fisheries)',
    bannerGradient: 'from-rose-800 to-slate-900',
    tags: ['EHP', 'WSSV', 'Biosecurity', 'Shrimp Health'],
    title: {
      en: 'Early Symptom Identification for White Spot (WSSV) and Enterocytozoon hepatopenaei (EHP)',
      te: 'తెల్ల మచ్చ వ్యాధి (WSSV) మరియు EHP పరాన్నజీవి ప్రారంభ గుర్తింపు పద్ధతులు',
      hi: 'व्हाइट स्पॉट रोग (WSSV) और EHP के प्रारंभिक लक्षण और बचाव',
    },
    summary: {
      en: 'Visual symptoms, gut fullness checks, hepatopancreas discoloration signs, and bio-security protocols to prevent disease outbreaks.',
      te: 'రొయ్యలలో వ్యాధి లక్షణాలు, ప్రేగుల ఖాళీదనం, కాలేయ రంగు మార్పు మరియు బయో-సెక్యూరిటీ నిబంధనలు.',
      hi: 'झींगे में रोग के शुरुआती लक्षण, आंत का खालीपन, हेपाटोपैनक्रियास की जांच और जैव-सुरक्षा नियम।',
    },
    contentMarkdown: {
      en: `### 1. Warning Signs of White Spot Syndrome Virus (WSSV)
- **Early Signs (Day 1-2):** Sudden surge in feeding followed by rapid complete cessation of feed intake within 24 hours.
- **Physical Signs:** Lethargic shrimp swimming slowly along pond dikes during bright daylight. Reddish body discoloration and loose carapace.
- **Diagnostic Spots:** White calcium deposits of 0.5 to 2.0 mm diameter inside the carapace (observable when shell is peeled).

### 2. Detecting Microsporidian EHP (*Enterocytozoon hepatopenaei*)
- Does not cause mass mortality directly, but stunts growth severely (size variation of 5g to 18g within the same pond).
- **White Feces Syndrome (WFS):** White floating fecal strands accumulating along the windward dikes.
- Pale, liquefied hepatopancreas that squashes easily between fingers without firm yellow lipid droplets.

### 3. Immediate Action on Suspicion
1. Do not pump drainage water directly into communal canals.
2. Disinfect cast nets and sampling equipment in 20 ppm chlorine solution.
3. Send PCR sample to a recognized state laboratory before deciding on emergency harvest or curative regimens.`,
      te: `### 1. తెల్ల మచ్చ వ్యాధి (WSSV) లక్షణాలు
- **ప్రారంభ దశ:** మొదట ఒక రోజు మేత ఎక్కువగా తిని, మరుసటి రోజు అకస్మాత్తుగా మేత పూర్తిగా తినడం మానేస్తాయి.
- **శరీర లక్షణాలు:** పగటిపూట రొయ్యలు గట్ల వెంబడి నిదానంగా తిరగడం, శరీరం ఎర్రబడటం మరియు పెంకు వదులుగా మారడం.
- **తెల్ల మచ్చలు:** పెంకును తొలగించి చూసినప్పుడు లోపలి భాగంలో 0.5 నుండి 2 మి.మీ సైజులో తెల్లటి మచ్చలు కనిపిస్తాయి.

### 2. EHP పరాన్నజీవి గుర్తింపు
- ఇది వెంటనే చంపదు కానీ రొయ్యల ఎదుగుదలను పూర్తిగా ఆపేస్తుంది (ఒకే చెరువులో రకరకాల సైజులు).
- చెరువు గట్లపై తెల్లటి మలపు తీగలు తేలియాడుతుంటాయి.
- రొయ్య కాలేయం పాలిపోయి, మెత్తగా మారుతుంది.

### 3. అనుమానం వచ్చిన వెంటనే చేయాల్సిన పనులు
1. చెరువు నీటిని బయట కాలువల్లోకి వదలకండి.
2. వలలు, బకెట్లను క్లోరిన్ ద్రావణంలో శుభ్రం చేయండి.
3. వెంటనే అధీకృత ల్యాబ్‌కు నమూనాలను పంపించి PCR టెస్ట్ చేయించండి.`,
      hi: `### 1. व्हाइट स्पॉट (WSSV) के लक्षण
- झींगा अचानक चारा खाना बंद कर देता है।
- दिन के समय झींगे मेड़ों के किनारे सुस्त तैरते नजर आते हैं।
- कवच (खोल) के अंदर सफेद गोल धब्बे दिखाई देने लगते हैं।

### 2. EHP की पहचान
- झींगों की बढ़त रुक जाती है और एक ही तालाब में अलग-अलग आकार के झींगे मिलते हैं।
- पानी के किनारों पर सफेद मल तैरता दिखाई देता है।

### 3. तत्काल सावधानियां
- तालाब का पानी बाहर न निकालें।
- उपयोग किए गए जाल को क्लोरीन से धोएं।
- तुरंत सरकारी लैब में पीसीआर जांच कराएं।`,
    },
  },
  {
    id: 'art-04',
    slug: 'sludge-management-and-probiotic-bioremediation',
    category: 'waste_management',
    readingTimeMinutes: 5,
    publishedDate: '2026-11-04',
    author: 'K. R. Murthy',
    authorRole: 'Soil & Water Quality Consultant',
    verifiedByExpert: true,
    expertName: 'K. R. Murthy (Aquaculture Specialist)',
    bannerGradient: 'from-slate-700 to-cyan-900',
    tags: ['Bottom Sludge', 'Probiotics', 'Hydrogen Sulfide', 'Soil Preparation'],
    title: {
      en: 'Bottom Sludge Management and Probiotic Bioremediation',
      te: 'చెరువు అడుగు పూడిక నియంత్రణ మరియు ప్రోబయోటిక్ వాడకం',
      hi: 'तालाब की तली में कीचड़ और हानिकारक गैसों का उपचार',
    },
    summary: {
      en: 'Eliminate toxic hydrogen sulfide (H2S) pockets, syphon central sludge pits, and apply Bacillus and photosynthetic bacteria effectively.',
      te: 'హైడ్రోజన్ సల్ఫైడ్ విషవాయువు నివారణ, సెంట్రల్ డ్రైన్ల ద్వారా పూడిక తొలగింపు మరియు ప్రోబయోటిక్స్ సమర్థ వినియోగం.',
      hi: 'जहरीली हाइड्रोजन सल्फाइड गैस से बचाव, कीचड़ की सफाई और प्रोबायोटिक्स का प्रभावी उपयोग।',
    },
    contentMarkdown: {
      en: `### 1. The Danger of Pond Bottom Sludge
Uneaten feed, shrimp feces, and dead microalgae settle to the pond floor, forming an anaerobic black mud layer. Under oxygen-depleted sediment conditions, sulfate-reducing bacteria generate **Hydrogen Sulfide (H2S)**.
- **H2S is 100 times more toxic than ammonia.**
- Even 0.01 ppm H2S causes bottom-dwelling shrimp to stop feeding and triggers high mortality during molting.

### 2. Bioremediation Strategy
- **Bacillus subtilis & Bacillus licheniformis:** Break down complex organic matter into simple nitrogen compounds.
- **Rhodobacter & Rhodopseudomonas (Photosynthetic Bacteria - PSB):** Utilize toxic H2S as an electron donor, neutralizing sulfide odor directly.
- **Central Drain / Sludge Syphon:** Drain the central waste cone daily for 5-10 minutes if configured with gravity pipes.`,
      te: `### 1. చెరువు అడుగు పూడిక ప్రమాదాలు
మిగిలిపోయిన మేత, రొయ్యల విసర్జితాలు మరియు చనిపోయిన నాచు అడుగున చేరి నల్లటి పూడికగా మారుతుంది. ఆక్సిజన్ లేని అడుగు భాగంలో ప్రమాదకరమైన **హైడ్రోజన్ సల్ఫైడ్ (H2S)** వాయువు పుడుతుంది.
- ఇది అమ్మోనియా కంటే **100 రెట్లు ఎక్కువ విషపూరితమైనది**.
- అడుగున ఉండే రొయ్యలకు ఇది ప్రాణాంతకం.

### 2. జీవ పరిష్కార పద్ధతులు
- బసిల్లస్ మరియు ఫోటోసింథటిక్ బ్యాక్టీరియా (PSB) కల్చర్లను క్రమం తప్పకుండా అడుగున వాడాలి.
- బెల్లం నీటితో పులియబెట్టిన ప్రోబయోటిక్స్ వేయడం వల్ల పూడిక త్వరగా కరుగుతుంది.
- వీలైతే సెంట్రల్ డ్రైన్ ద్వారా రోజుకు 5 నిమిషాలు అడుగు పూడికను బయటకు పంపండి.`,
      hi: `### 1. तली में जमा कीचड़ का खतरा
बचा हुआ चारा और झींगे का मल सड़कर जहरीली **हाइड्रोजन सल्फाइड (H2S)** गैस बनाते हैं। यह गैस अमोनिया से भी अधिक खतरनाक है और मौल्टिंग के समय झींगे को मार देती है।

### 2. उपचार के उपाय
- बैसिलस और फोटोसिंथेटिक बैक्टीरिया युक्त प्रोबायोटिक्स का उपयोग करें।
- गुड़ और चावल की भूसी के साथ किण्वित घोल बनाकर तालाब में डालें।
- समय-समय पर सेंट्रल ड्रेन से कीचड़ बाहर निकालें।`,
    },
  },
];

export const INITIAL_WEATHER: WeatherData = {
  location: 'Bhimavaram Delta Agro-Climatic Zone',
  state: 'Andhra Pradesh',
  district: 'West Godavari',
  asOf: '2026-11-20T21:00:00.000Z',
  current: {
    tempC: 28.5,
    feelsLikeC: 31.0,
    condition: 'Partly Cloudy with Coastal Breeze',
    conditionCode: 'cloudy',
    humidityPercent: 78,
    windSpeedKmh: 14.5,
    windDirection: 'ESE (East-South-East)',
    rainfall24hMm: 0.0,
    barometricPressureHpa: 1012,
    uvIndex: 6,
  },
  forecast: [
    { date: '2026-11-21', dayLabel: 'Tomorrow', condition: 'Partly Sunny', minTempC: 24, maxTempC: 32, rainProbabilityPercent: 20, windSpeedKmh: 15 },
    { date: '2026-11-22', dayLabel: 'Sun', condition: 'Scattered Showers', minTempC: 23, maxTempC: 30, rainProbabilityPercent: 65, windSpeedKmh: 22 },
    { date: '2026-11-23', dayLabel: 'Mon', condition: 'Moderate Coastal Rain', minTempC: 23, maxTempC: 29, rainProbabilityPercent: 80, windSpeedKmh: 28 },
    { date: '2026-11-24', dayLabel: 'Tue', condition: 'Cloudy with Breezes', minTempC: 24, maxTempC: 31, rainProbabilityPercent: 35, windSpeedKmh: 18 },
    { date: '2026-11-25', dayLabel: 'Wed', condition: 'Clear Sky', minTempC: 23, maxTempC: 32, rainProbabilityPercent: 10, windSpeedKmh: 12 },
  ],
  advisories: [
    {
      id: 'adv-01',
      severity: 'Warning',
      title: {
        en: 'Depression Forming in Bay of Bengal: Expected Rain on Nov 22-23',
        te: 'బంగాళాఖాతంలో అల్పపీడనం: నవంబర్ 22-23 తేదీలలో మోస్తరు వర్ష సూచన',
        hi: 'बंगाल की खाड़ी में कम दबाव का क्षेत्र: 22-23 नवंबर को तटीय वर्षा की संभावना',
      },
      message: {
        en: 'Heavy cloud cover and moderate rain will cause photosynthetic DO to drop by 25-35%. Farmers are advised to inspect diesel generators, clear dyke spillways, and maintain lime stocks.',
        te: 'మబ్బులు పట్టడం మరియు వర్షం వల్ల నీటిలో ఆక్సిజన్ తగ్గే ప్రమాదం ఉంది. ఏరియేటర్లు మరియు జనరేటర్లను సిద్ధం చేసుకోండి, సున్నం నిల్వలను ఉంచుకోండి.',
        hi: 'बादल छाए रहने से पानी में ऑक्सीजन घट सकती है। जनरेटर चालू रखें और चूने का स्टॉक रखें।',
      },
      aquacultureImpact: {
        en: 'High risk of sudden plankton crash and predawn hypoxia during overcast rainfall periods.',
        te: 'వర్షం పడినప్పుడు నాచు చనిపోవడం మరియు ఆక్సిజన్ అకస్మాత్తుగా పడిపోయే ప్రమాదం ఎక్కువ.',
        hi: 'बारिश के दौरान शैवाल नष्ट होने और ऑक्सीजन की भारी कमी का जोखिम रहता है।',
      },
    },
    {
      id: 'adv-02',
      severity: 'Notice',
      title: {
        en: 'Moderate Diurnal Temperature Swing (8°C)',
        te: 'పగలు-రాత్రి ఉష్ణోగ్రతలో 8°C వ్యత్యాసం',
        hi: 'दिन और रात के तापमान में 8°C का अंतर',
      },
      message: {
        en: 'Cool nights and warm afternoons may alter morning feeding rates. Adjust check trays accordingly.',
        te: 'రాత్రిపూట చలి వల్ల ఉదయం వేళ రొయ్యలు నెమ్మదిగా మేత తింటాయి. ట్రేలను సరిచూసి మేత ఇవ్వండి.',
        hi: 'ठंडी रातों के कारण सुबह चारे की खपत धीमी हो सकती है। चेक-ट्रे देखकर ही चारा दें।',
      },
      aquacultureImpact: {
        en: 'Digestion rate slows by 15-20% when water temperature drops below 26°C.',
        te: 'ఉష్ణోగ్రత 26°C కంటే తగ్గితే జీర్ణక్రియ 15-20% నెమ్మదిస్తుంది.',
        hi: 'पानी का तापमान कम होने पर पाचन धीमा हो जाता है।',
      },
    },
  ],
};

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-01',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Varma',
    farmerPhone: '+91 98480 23456',
    farmName: 'Godavari Delta Aqua Greens',
    subject: 'Sudden Morning pH Swing and White Feces in Pond A-2',
    category: 'Water Quality Issue',
    priority: 'High',
    status: 'In Progress',
    description: 'Since 2 days, morning pH is 7.8 but jumps to 8.9 by 3 PM. Floating white strands noticed near aeration corner. Need guidance on probiotic dosage.',
    createdAt: '2026-11-19T11:20:00.000Z',
    updatedAt: '2026-11-20T10:15:00.000Z',
    responses: [
      {
        id: 'resp-01',
        senderName: 'Ramesh Varma',
        senderRole: 'Farmer',
        message: 'Since 2 days, morning pH is 7.8 but jumps to 8.9 by 3 PM. Floating white strands noticed near aeration corner. Need guidance on probiotic dosage.',
        timestamp: '2026-11-19T11:20:00.000Z',
      },
      {
        id: 'resp-02',
        senderName: 'Dr. K. Srinivas Rao',
        senderRole: 'Extension Officer',
        message: 'This pH swing indicates an over-dense cyanobacterial bloom. Apply 15 kg/acre fermented jaggery at 7 AM, and dose gut probiotic with garlic extract in midday feed.',
        timestamp: '2026-11-20T10:15:00.000Z',
      },
    ],
  },
  {
    id: 'tkt-02',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Varma',
    farmerPhone: '+91 98480 23456',
    farmName: 'Krishna Coastal Shrimp Haven',
    subject: 'Assistance for Electricity Subsidy Tariff Application',
    category: 'Extension Officer Request',
    priority: 'Medium',
    status: 'Open',
    description: 'Looking to link CAA registration certificate for AP DISCOM aquaculture concessional power tariff (₹1.50/unit scheme).',
    createdAt: '2026-11-18T16:40:00.000Z',
    updatedAt: '2026-11-18T16:40:00.000Z',
    responses: [
      {
        id: 'resp-03',
        senderName: 'Ramesh Varma',
        senderRole: 'Farmer',
        message: 'Looking to link CAA registration certificate for AP DISCOM aquaculture concessional power tariff (₹1.50/unit scheme).',
        timestamp: '2026-11-18T16:40:00.000Z',
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-01',
    timestamp: '2026-11-20T06:15:22.000Z',
    actorName: 'Ramesh Varma',
    actorRole: 'farmer',
    action: 'Logged Water Quality Test',
    entityType: 'WaterQuality',
    entityId: 'wq-01',
    details: 'DO: 5.6 mg/L, pH: 7.9, Temp: 27.8°C recorded for Pond A-1',
    ipAddress: '157.48.92.14',
  },
  {
    id: 'log-02',
    timestamp: '2026-11-20T06:05:10.000Z',
    actorName: 'Ramesh Varma',
    actorRole: 'farmer',
    action: 'Logged Feed Dispatch',
    entityType: 'Feed',
    entityId: 'feed-01',
    details: '38kg CP Grower Feed logged for Morning slot',
    ipAddress: '157.48.92.14',
  },
  {
    id: 'log-03',
    timestamp: '2026-11-19T14:20:00.000Z',
    actorName: 'Dr. K. Srinivas Rao',
    actorRole: 'admin',
    action: 'Updated Assessment Rule Threshold',
    entityType: 'Rule',
    entityId: 'rule-do-v1.2',
    details: 'Calibrated critical DO threshold to 3.0 mg/L for winter months',
    ipAddress: '182.73.110.5',
  },
  {
    id: 'log-04',
    timestamp: '2026-11-18T17:00:00.000Z',
    actorName: 'Dr. K. Srinivas Rao',
    actorRole: 'admin',
    action: 'Published Knowledge Article',
    entityType: 'Article',
    entityId: 'art-04',
    details: 'Published guide on Sludge Management in EN, TE, HI',
    ipAddress: '182.73.110.5',
  },
];

export const INITIAL_PLATFORM_METRICS: PlatformMetrics = {
  totalRegisteredFarmers: 384,
  activeFarmers7Days: 298,
  totalRegisteredFarms: 642,
  totalActivePonds: 1840,
  waterReadingsLoggedThisMonth: 12490,
  assessmentsCompleted: 3120,
  openSupportTickets: 19,
  learningArticlesPublished: 16,
  totalCultureAreaAcres: 3420,
  estimatedHarvestProjectedTons: 6840,
};
