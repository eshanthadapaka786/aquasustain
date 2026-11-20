import {
  UserProfile,
  Farm,
  Pond,
  WaterQualityReading,
  AssessmentInput,
  AssessmentResult,
  FeedRecord,
  ExpenseRecord,
  Reminder,
  LearningArticle,
  SupportTicket,
  WeatherData,
  AuditLogItem,
  PlatformMetrics,
  UserRole,
  LanguageCode,
} from '../types';

import {
  INITIAL_USER,
  INITIAL_ADMIN_USER,
  INITIAL_EVALUATOR_USER,
  INITIAL_FARMS,
  INITIAL_PONDS,
  INITIAL_WATER_READINGS,
  INITIAL_FEEDS,
  INITIAL_EXPENSES,
  INITIAL_REMINDERS,
  INITIAL_ARTICLES,
  INITIAL_WEATHER,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLATFORM_METRICS,
} from '../mock/mockData';

import { evaluatePondConditions } from '../business-logic/pondAssessmentEngine';

interface StoreData {
  currentUser: UserProfile;
  farms: Farm[];
  ponds: Pond[];
  waterReadings: WaterQualityReading[];
  assessments: AssessmentResult[];
  feedRecords: FeedRecord[];
  expenseRecords: ExpenseRecord[];
  reminders: Reminder[];
  articles: LearningArticle[];
  weather: WeatherData;
  supportTickets: SupportTicket[];
  auditLogs: AuditLogItem[];
  metrics: PlatformMetrics;
}

const STORAGE_KEY = 'aquasustain_session_store_v1';

class DataService {
  private data: StoreData;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.data = this.loadInitialData();
  }

  private loadInitialData(): StoreData {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to parse localStorage data, falling back to seed', e);
      }
    }
    return this.getFreshSeedData();
  }

  private getFreshSeedData(): StoreData {
    return {
      currentUser: { ...INITIAL_USER },
      farms: [...INITIAL_FARMS],
      ponds: [...INITIAL_PONDS],
      waterReadings: [...INITIAL_WATER_READINGS],
      assessments: [
        evaluatePondConditions(
          {
            pondId: 'pond-01',
            waterTemperatureC: 27.8,
            ph: 7.9,
            dissolvedOxygenMgL: 5.6,
            transparencyCm: 34,
            ammoniaPpm: 0.08,
            feedIntakeCondition: 'Normal',
            stockBehaviour: 'Active and Schooling',
            mortalityObservations: 'None',
            waterColor: 'Light Green (Diatom)',
            aerationHoursPerDay: 14,
            wasteSludgeStatus: 'Clean / Skimmed',
          },
          'Pond A-1 (High-Yield Vannamei)'
        ),
      ],
      feedRecords: [...INITIAL_FEEDS],
      expenseRecords: [...INITIAL_EXPENSES],
      reminders: [...INITIAL_REMINDERS],
      articles: [...INITIAL_ARTICLES],
      weather: { ...INITIAL_WEATHER },
      supportTickets: [...INITIAL_SUPPORT_TICKETS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      metrics: { ...INITIAL_PLATFORM_METRICS },
    };
  }

  private persist() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
    this.notify();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Listener callback error', err);
      }
    });
  }

  // Session & Demo Data Reset
  public resetToDemoData() {
    this.data = this.getFreshSeedData();
    this.persist();
  }

  // User & Roles
  public getCurrentUser(): UserProfile {
    return this.data.currentUser;
  }

  public setLanguage(lang: LanguageCode) {
    this.data.currentUser.preferredLanguage = lang;
    this.persist();
  }

  public switchRole(role: UserRole) {
    if (role === 'admin') {
      this.data.currentUser = { ...INITIAL_ADMIN_USER, preferredLanguage: this.data.currentUser.preferredLanguage };
    } else if (role === 'evaluator') {
      this.data.currentUser = { ...INITIAL_EVALUATOR_USER, preferredLanguage: this.data.currentUser.preferredLanguage };
    } else {
      this.data.currentUser = { ...INITIAL_USER, preferredLanguage: this.data.currentUser.preferredLanguage };
    }
    this.persist();
  }

  public updateUserProfile(updates: Partial<UserProfile>) {
    this.data.currentUser = { ...this.data.currentUser, ...updates };
    this.persist();
  }

  // Farms
  public getFarms(): Farm[] {
    return [...this.data.farms];
  }

  public getFarmById(id: string): Farm | undefined {
    return this.data.farms.find((f) => f.id === id);
  }

  public addFarm(farmData: Omit<Farm, 'id' | 'farmerId'>): Farm {
    const newFarm: Farm = {
      ...farmData,
      id: `farm-${Date.now()}`,
      farmerId: this.data.currentUser.id,
    };
    this.data.farms.unshift(newFarm);
    this.data.currentUser.farmCount = this.data.farms.length;
    this.logAction('Registered Farm', 'Farm', newFarm.id, `Created ${newFarm.name}`);
    this.persist();
    return newFarm;
  }

  public updateFarm(id: string, updates: Partial<Farm>): Farm | undefined {
    const idx = this.data.farms.findIndex((f) => f.id === id);
    if (idx === -1) return undefined;
    this.data.farms[idx] = { ...this.data.farms[idx], ...updates };
    this.persist();
    return this.data.farms[idx];
  }

  public deleteFarm(id: string): boolean {
    const initialLen = this.data.farms.length;
    this.data.farms = this.data.farms.filter((f) => f.id !== id);
    // Also remove associated ponds
    this.data.ponds = this.data.ponds.filter((p) => p.farmId !== id);
    this.data.currentUser.farmCount = this.data.farms.length;
    this.data.currentUser.pondCount = this.data.ponds.length;
    this.persist();
    return this.data.farms.length < initialLen;
  }

  // Ponds
  public getPonds(farmId?: string): Pond[] {
    if (farmId) {
      return this.data.ponds.filter((p) => p.farmId === farmId);
    }
    return [...this.data.ponds];
  }

  public getPondById(id: string): Pond | undefined {
    return this.data.ponds.find((p) => p.id === id);
  }

  public addPond(pondData: Omit<Pond, 'id'>): Pond {
    const newPond: Pond = {
      ...pondData,
      id: `pond-${Date.now()}`,
    };
    this.data.ponds.unshift(newPond);
    this.data.currentUser.pondCount = this.data.ponds.length;
    this.logAction('Registered Pond', 'Pond', newPond.id, `Registered ${newPond.name}`);
    this.persist();
    return newPond;
  }

  public updatePond(id: string, updates: Partial<Pond>): Pond | undefined {
    const idx = this.data.ponds.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.data.ponds[idx] = { ...this.data.ponds[idx], ...updates };
    this.persist();
    return this.data.ponds[idx];
  }

  public deletePond(id: string): boolean {
    const initialLen = this.data.ponds.length;
    this.data.ponds = this.data.ponds.filter((p) => p.id !== id);
    this.data.currentUser.pondCount = this.data.ponds.length;
    this.persist();
    return this.data.ponds.length < initialLen;
  }

  // Water Quality Readings
  public getWaterReadings(pondId?: string): WaterQualityReading[] {
    if (pondId) {
      return this.data.waterReadings.filter((r) => r.pondId === pondId);
    }
    return [...this.data.waterReadings];
  }

  public addWaterReading(readingData: Omit<WaterQualityReading, 'id' | 'timestamp' | 'status' | 'recordedBy'>): WaterQualityReading {
    // Determine status
    let status: WaterQualityReading['status'] = 'Normal';
    const alerts: string[] = [];
    if (readingData.dissolvedOxygenMgL < 3.5 || readingData.ammoniaPpm > 1.0) {
      status = 'Critical';
      if (readingData.dissolvedOxygenMgL < 3.5) alerts.push('Low DO (<3.5 mg/L)');
      if (readingData.ammoniaPpm > 1.0) alerts.push('High Ammonia (>1.0 ppm)');
    } else if (readingData.dissolvedOxygenMgL < 4.5 || readingData.ph < 7.5 || readingData.ph > 8.8 || readingData.ammoniaPpm > 0.4) {
      status = 'Alert';
      if (readingData.dissolvedOxygenMgL < 4.5) alerts.push('Suboptimal DO');
      if (readingData.ph > 8.8) alerts.push('High afternoon pH');
      if (readingData.ammoniaPpm > 0.4) alerts.push('Elevated Ammonia');
    }

    const newReading: WaterQualityReading = {
      ...readingData,
      id: `wq-${Date.now()}`,
      timestamp: new Date().toISOString(),
      recordedBy: this.data.currentUser.name,
      status,
      alertsTriggered: alerts.length > 0 ? alerts : undefined,
    };

    this.data.waterReadings.unshift(newReading);

    // Update pond last test timestamp and status
    const pondIdx = this.data.ponds.findIndex((p) => p.id === readingData.pondId);
    if (pondIdx !== -1) {
      this.data.ponds[pondIdx].lastWaterQualityTest = newReading.timestamp;
      if (status === 'Critical') this.data.ponds[pondIdx].status = 'Critical';
      else if (status === 'Alert' && this.data.ponds[pondIdx].status !== 'Critical') {
        this.data.ponds[pondIdx].status = 'Attention';
      }
    }

    this.logAction('Logged Water Reading', 'WaterQuality', newReading.id, `DO: ${newReading.dissolvedOxygenMgL}, pH: ${newReading.ph}`);
    this.persist();
    return newReading;
  }

  // Assessments
  public getAssessments(pondId?: string): AssessmentResult[] {
    if (pondId) {
      return this.data.assessments.filter((a) => a.pondId === pondId);
    }
    return [...this.data.assessments];
  }

  public runAssessment(input: AssessmentInput): AssessmentResult {
    const pond = this.getPondById(input.pondId);
    const pondName = pond ? pond.name : 'Selected Pond';
    const result = evaluatePondConditions(input, pondName);

    this.data.assessments.unshift(result);

    // Update pond status
    if (pond) {
      if (result.status === 'Critical') pond.status = 'Critical';
      else if (result.status === 'Moderate') pond.status = 'Attention';
      else pond.status = 'Optimal';
    }

    this.logAction('Completed Pond Assessment', 'Pond', input.pondId, `Score: ${result.overallScore}/100, Status: ${result.status}`);
    this.persist();
    return result;
  }

  // Feed Management
  public getFeedRecords(pondId?: string): FeedRecord[] {
    if (pondId) {
      return this.data.feedRecords.filter((f) => f.pondId === pondId);
    }
    return [...this.data.feedRecords];
  }

  public addFeedRecord(feedData: Omit<FeedRecord, 'id' | 'totalCost'>): FeedRecord {
    const totalCost = Math.round(feedData.quantityKg * feedData.unitPricePerKg);
    const newRecord: FeedRecord = {
      ...feedData,
      id: `feed-${Date.now()}`,
      totalCost,
    };
    this.data.feedRecords.unshift(newRecord);

    const pondIdx = this.data.ponds.findIndex((p) => p.id === feedData.pondId);
    if (pondIdx !== -1) {
      this.data.ponds[pondIdx].lastFeedingRecorded = new Date().toISOString();
    }

    this.logAction('Recorded Feed', 'Feed', newRecord.id, `${feedData.quantityKg}kg ${feedData.feedBrand}`);
    this.persist();
    return newRecord;
  }

  // Expenses
  public getExpenses(farmId?: string): ExpenseRecord[] {
    if (farmId) {
      return this.data.expenseRecords.filter((e) => e.farmId === farmId);
    }
    return [...this.data.expenseRecords];
  }

  public addExpense(expenseData: Omit<ExpenseRecord, 'id'>): ExpenseRecord {
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    this.data.expenseRecords.unshift(newExpense);
    this.persist();
    return newExpense;
  }

  public deleteExpense(id: string): boolean {
    const initialLen = this.data.expenseRecords.length;
    this.data.expenseRecords = this.data.expenseRecords.filter((e) => e.id !== id);
    this.persist();
    return this.data.expenseRecords.length < initialLen;
  }

  // Reminders
  public getReminders(): Reminder[] {
    return [...this.data.reminders];
  }

  public addReminder(reminderData: Omit<Reminder, 'id' | 'farmerId' | 'createdAt' | 'status'>): Reminder {
    const newReminder: Reminder = {
      ...reminderData,
      id: `rem-${Date.now()}`,
      farmerId: this.data.currentUser.id,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    this.data.reminders.unshift(newReminder);
    this.persist();
    return newReminder;
  }

  public toggleReminderStatus(id: string): Reminder | undefined {
    const rem = this.data.reminders.find((r) => r.id === id);
    if (rem) {
      rem.status = rem.status === 'Pending' ? 'Completed' : 'Pending';
      this.persist();
    }
    return rem;
  }

  public deleteReminder(id: string): boolean {
    const initialLen = this.data.reminders.length;
    this.data.reminders = this.data.reminders.filter((r) => r.id !== id);
    this.persist();
    return this.data.reminders.length < initialLen;
  }

  // Learning Hub
  public getArticles(category?: string): LearningArticle[] {
    if (category && category !== 'all') {
      return this.data.articles.filter((a) => a.category === category);
    }
    return [...this.data.articles];
  }

  public getArticleBySlug(slug: string): LearningArticle | undefined {
    return this.data.articles.find((a) => a.slug === slug);
  }

  public addArticle(article: Omit<LearningArticle, 'id' | 'publishedDate'>): LearningArticle {
    const newArticle: LearningArticle = {
      ...article,
      id: `art-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    this.data.articles.unshift(newArticle);
    this.persist();
    return newArticle;
  }

  // Weather
  public getWeather(): WeatherData {
    return { ...this.data.weather };
  }

  // Support Tickets
  public getSupportTickets(): SupportTicket[] {
    return [...this.data.supportTickets];
  }

  public createSupportTicket(ticketData: Omit<SupportTicket, 'id' | 'farmerId' | 'farmerName' | 'farmerPhone' | 'createdAt' | 'updatedAt' | 'responses' | 'status'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      farmerId: this.data.currentUser.id,
      farmerName: this.data.currentUser.name,
      farmerPhone: this.data.currentUser.phone,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [
        {
          id: `resp-${Date.now()}`,
          senderName: this.data.currentUser.name,
          senderRole: 'Farmer',
          message: ticketData.description,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    this.data.supportTickets.unshift(newTicket);
    this.persist();
    return newTicket;
  }

  public addTicketResponse(ticketId: string, message: string, senderRole: 'Farmer' | 'Extension Officer' | 'AquaSustain Support') {
    const ticket = this.data.supportTickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.responses.push({
        id: `resp-${Date.now()}`,
        senderName: senderRole === 'Farmer' ? this.data.currentUser.name : 'Dr. K. Srinivas Rao (Extension Officer)',
        senderRole,
        message,
        timestamp: new Date().toISOString(),
      });
      ticket.updatedAt = new Date().toISOString();
      if (senderRole !== 'Farmer') {
        ticket.status = 'In Progress';
      }
      this.persist();
    }
  }

  // Admin & Audit
  public getAuditLogs(): AuditLogItem[] {
    return [...this.data.auditLogs];
  }

  public getPlatformMetrics(): PlatformMetrics {
    return {
      ...this.data.metrics,
      totalRegisteredFarms: this.data.farms.length + 640,
      totalActivePonds: this.data.ponds.length + 1836,
      openSupportTickets: this.data.supportTickets.filter((t) => t.status !== 'Closed').length,
    };
  }

  private logAction(action: string, entityType: AuditLogItem['entityType'], entityId: string, details: string) {
    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: this.data.currentUser.name,
      actorRole: this.data.currentUser.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '157.48.92.14 (Active Client)',
    };
    this.data.auditLogs.unshift(logItem);
  }
}

export const dataService = new DataService();
