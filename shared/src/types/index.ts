export type UserRole = 'farmer' | 'admin' | 'evaluator';

export type LanguageCode = 'en' | 'te' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  preferredLanguage: LanguageCode;
  farmCount: number;
  pondCount: number;
  state: string;
  district: string;
  village: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  totalAreaAcres: number;
  waterSource: 'Borewell' | 'Canal' | 'Creek' | 'River' | 'Reservoir';
  soilType: 'Clay Loam' | 'Sandy Clay' | 'Alluvial' | 'Saline Soil';
  registrationNumber?: string;
  caaRegistrationNumber?: string; // Coastal Aquaculture Authority
  establishedYear: number;
  status: 'Active' | 'Under Preparation' | 'Fallow';
}

export type SpeciesType = 'L. vannamei (Whiteleg Shrimp)' | 'P. monodon (Black Tiger)' | 'Catla & Rohu (Carp)' | 'Tilapia' | 'Seabass';

export type CultureStage = 'Nursery' | 'Grow-out (Early)' | 'Grow-out (Mid)' | 'Pre-harvest' | 'Harvesting';

export interface Pond {
  id: string;
  farmId: string;
  name: string;
  code: string;
  waterAreaAcres: number;
  averageDepthMeters: number;
  species: SpeciesType;
  stockingDate: string;
  daysOfCulture: number;
  stockingDensityPerSqm: number;
  totalStockCount: number;
  estimatedSurvivalRatePercent: number;
  currentEstimatedBiomassKg: number;
  currentMeanBodyWeightGrams: number;
  targetHarvestWeightGrams: number;
  targetHarvestDate: string;
  cultureStage: CultureStage;
  aeratorHpTotal: number;
  status: 'Optimal' | 'Attention' | 'Critical' | 'Fallow';
  lastWaterQualityTest?: string;
  lastFeedingRecorded?: string;
}

export interface WaterQualityReading {
  id: string;
  pondId: string;
  pondName: string;
  timestamp: string;
  recordedBy: string;
  temperatureC: number;
  ph: number;
  dissolvedOxygenMgL: number;
  transparencyCm: number;
  salinityPpt: number;
  alkalinityPpm: number;
  ammoniaPpm: number;
  nitritePpm: number;
  hardnessPpm?: number;
  notes?: string;
  status: 'Normal' | 'Alert' | 'Critical';
  alertsTriggered?: string[];
}

export interface AssessmentInput {
  pondId: string;
  waterTemperatureC: number;
  ph: number;
  dissolvedOxygenMgL: number;
  transparencyCm: number;
  ammoniaPpm?: number;
  nitritePpm?: number;
  alkalinityPpm?: number;
  salinityPpt?: number;
  feedIntakeCondition: 'Normal' | 'Slightly Reduced (-15%)' | 'Severely Reduced (-40%)' | 'Refusing Feed';
  stockBehaviour: 'Active and Schooling' | 'Surfacing at Dawn / Gaspy' | 'Lethargic along Edges' | 'Normal Bottom Feeding';
  mortalityObservations: 'None' | 'Minimal (<5 observed)' | 'Moderate (5-25 observed)' | 'Significant (>25 observed)';
  waterColor: 'Light Green (Diatom)' | 'Dark Green (Cyanobacteria/Bloom)' | 'Brown / Tea (Healthy Mix)' | 'Turbid / Muddy Suspended' | 'Clear / Sterile';
  aerationHoursPerDay: number;
  wasteSludgeStatus: 'Clean / Skimmed' | 'Mild organic deposition' | 'Heavy black sludge / H2S odor';
}

export interface AssessmentResult {
  id: string;
  pondId: string;
  pondName: string;
  timestamp: string;
  ruleVersion: string;
  overallScore: number; // 0 - 100
  status: 'Optimal' | 'Good' | 'Moderate' | 'Critical';
  parameterEvaluations: {
    dissolvedOxygen: { value: number; unit: string; score: number; status: 'Optimal' | 'Warning' | 'Hazardous'; message: string };
    ph: { value: number; unit: string; score: number; status: 'Optimal' | 'Warning' | 'Hazardous'; message: string };
    temperature: { value: number; unit: string; score: number; status: 'Optimal' | 'Warning' | 'Hazardous'; message: string };
    transparency: { value: number; unit: string; score: number; status: 'Optimal' | 'Warning' | 'Hazardous'; message: string };
    ammonia?: { value: number; unit: string; score: number; status: 'Optimal' | 'Warning' | 'Hazardous'; message: string };
    biologicalHealth: { score: number; status: 'Optimal' | 'Warning' | 'Hazardous'; observations: string };
  };
  limitingFactors: string[];
  recommendations: Array<{
    id: string;
    priority: 'High' | 'Medium' | 'Low';
    category: 'Water Quality' | 'Feeding' | 'Aeration' | 'Sanitation' | 'Veterinary';
    title: string;
    description: string;
    whyThisMatters: string;
    actionableSteps: string[];
  }>;
  suggestedFollowUps: string[];
  missingParameters: string[];
  disclaimer: string;
}

export interface FeedRecord {
  id: string;
  pondId: string;
  pondName: string;
  date: string;
  feedSlot: 'Morning (06:00)' | 'Noon (11:00)' | 'Afternoon (15:00)' | 'Night (20:00)';
  feedBrand: string;
  feedType: 'Starter (0.8mm-1.2mm)' | 'Grower (1.4mm-1.8mm)' | 'Finisher (2.0mm-2.4mm)' | 'Mash / Organic';
  quantityKg: number;
  unitPricePerKg: number;
  totalCost: number;
  checkTrayObservation: '100% Consumed (Increase slightly)' | 'Clean (Nominal)' | '10-20% Leftover (Reduce 10%)' | 'Heavy Leftover (Halt feeding)';
  notes?: string;
}

export type ExpenseCategory =
  | 'Feed'
  | 'Electricity & Diesel'
  | 'Seed / Post-Larvae'
  | 'Probiotics & Minerals'
  | 'Labour Wages'
  | 'Pond Maintenance & Soil Prep'
  | 'Lab Testing & Diagnostics'
  | 'Equipment & Aeration Spares'
  | 'Harvest & Logistics'
  | 'Government / Licensing Fees';

export interface ExpenseRecord {
  id: string;
  farmId: string;
  farmName: string;
  pondId?: string;
  pondName?: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  vendorName: string;
  paymentMode: 'Cash' | 'UPI' | 'NEFT / Bank Transfer' | 'Trader Credit';
  invoiceNumber?: string;
}

export interface Reminder {
  id: string;
  farmerId: string;
  title: string;
  description: string;
  category: 'Water Quality Testing' | 'Feeding Schedule' | 'Probiotic Application' | 'Aerator Maintenance' | 'Biomass Sampling' | 'Harvest Inspection' | 'Govt Scheme / Subsidy';
  dueDate: string;
  dueTime: string;
  pondId?: string;
  pondName?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  createdAt: string;
}

export interface LearningArticle {
  id: string;
  slug: string;
  category: 'water_management' | 'feed_management' | 'disease_awareness' | 'sustainable_aquaculture' | 'pond_maintenance' | 'waste_management';
  readingTimeMinutes: number;
  publishedDate: string;
  author: string;
  authorRole: string;
  verifiedByExpert: boolean;
  expertName?: string;
  title: Record<LanguageCode, string>;
  summary: Record<LanguageCode, string>;
  contentMarkdown: Record<LanguageCode, string>;
  tags: string[];
  bannerGradient: string;
}

export interface SupportTicket {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmName: string;
  subject: string;
  category: 'Water Quality Issue' | 'Feed & FCR Advice' | 'Disease & Abnormal Mortality' | 'Platform / Technical Issue' | 'Extension Officer Request';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  description: string;
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    id: string;
    senderName: string;
    senderRole: 'Farmer' | 'Extension Officer' | 'AquaSustain Support' | 'System';
    message: string;
    timestamp: string;
  }>;
}

export interface WeatherData {
  location: string;
  state: string;
  district: string;
  asOf: string;
  current: {
    tempC: number;
    feelsLikeC: number;
    condition: string;
    conditionCode: 'sunny' | 'cloudy' | 'rainy' | 'storm' | 'humid';
    humidityPercent: number;
    windSpeedKmh: number;
    windDirection: string;
    rainfall24hMm: number;
    barometricPressureHpa: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    dayLabel: string;
    condition: string;
    minTempC: number;
    maxTempC: number;
    rainProbabilityPercent: number;
    windSpeedKmh: number;
  }>;
  advisories: Array<{
    id: string;
    severity: 'Warning' | 'Notice' | 'Favourable';
    title: Record<LanguageCode, string>;
    message: Record<LanguageCode, string>;
    aquacultureImpact: Record<LanguageCode, string>;
  }>;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'Pond' | 'Farm' | 'WaterQuality' | 'Feed' | 'User' | 'Article' | 'Rule';
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface PlatformMetrics {
  totalRegisteredFarmers: number;
  activeFarmers7Days: number;
  totalRegisteredFarms: number;
  totalActivePonds: number;
  waterReadingsLoggedThisMonth: number;
  assessmentsCompleted: number;
  openSupportTickets: number;
  learningArticlesPublished: number;
  totalCultureAreaAcres: number;
  estimatedHarvestProjectedTons: number;
}
