import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  LanguageCode,
  Farm,
  Pond,
  WaterQualityReading,
  AssessmentResult,
  FeedRecord,
  ExpenseRecord,
  Reminder,
  LearningArticle,
  WeatherData,
  SupportTicket,
  PlatformMetrics,
  AuditLogItem,
} from '@aquasustain/shared';
import { dataService } from '@aquasustain/shared';
import { getTranslation } from '@aquasustain/shared';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentUser: UserProfile;
  role: UserRole;
  language: LanguageCode;
  t: (key: string) => string;
  setLanguage: (lang: LanguageCode) => void;
  switchRole: (role: UserRole) => void;
  resetDemoData: () => void;
  farms: Farm[];
  ponds: Pond[];
  selectedFarmId: string;
  selectedPondId: string;
  setSelectedFarmId: (id: string) => void;
  setSelectedPondId: (id: string) => void;
  activePond: Pond | undefined;
  activeFarm: Farm | undefined;
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
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedArticle: LearningArticle | null;
  setSelectedArticle: (art: LearningArticle | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(dataService.getCurrentUser());
  const [language, setLanguageState] = useState<LanguageCode>(currentUser.preferredLanguage);
  const [farms, setFarms] = useState<Farm[]>(dataService.getFarms());
  const [ponds, setPonds] = useState<Pond[]>(dataService.getPonds());
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
  const [selectedPondId, setSelectedPondId] = useState<string>(ponds[0]?.id || '');
  const [waterReadings, setWaterReadings] = useState<WaterQualityReading[]>(dataService.getWaterReadings());
  const [assessments, setAssessments] = useState<AssessmentResult[]>(dataService.getAssessments());
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>(dataService.getFeedRecords());
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>(dataService.getExpenses());
  const [reminders, setReminders] = useState<Reminder[]>(dataService.getReminders());
  const [articles, setArticles] = useState<LearningArticle[]>(dataService.getArticles());
  const [weather, setWeather] = useState<WeatherData>(dataService.getWeather());
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(dataService.getSupportTickets());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(dataService.getAuditLogs());
  const [metrics, setMetrics] = useState<PlatformMetrics>(dataService.getPlatformMetrics());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedArticle, setSelectedArticle] = useState<LearningArticle | null>(null);

  // Sync with service data changes
  const refreshFromService = () => {
    const user = dataService.getCurrentUser();
    const allFarms = dataService.getFarms();
    const allPonds = dataService.getPonds();

    setCurrentUser(user);
    setLanguageState(user.preferredLanguage);
    setFarms(allFarms);
    setPonds(allPonds);
    setWaterReadings(dataService.getWaterReadings());
    setAssessments(dataService.getAssessments());
    setFeedRecords(dataService.getFeedRecords());
    setExpenseRecords(dataService.getExpenses());
    setReminders(dataService.getReminders());
    setArticles(dataService.getArticles());
    setWeather(dataService.getWeather());
    setSupportTickets(dataService.getSupportTickets());
    setAuditLogs(dataService.getAuditLogs());
    setMetrics(dataService.getPlatformMetrics());

    // Keep active selection valid
    if (allFarms.length > 0 && !allFarms.some((f) => f.id === selectedFarmId)) {
      setSelectedFarmId(allFarms[0].id);
    }
    if (allPonds.length > 0 && !allPonds.some((p) => p.id === selectedPondId)) {
      setSelectedPondId(allPonds[0].id);
    }
  };

  useEffect(() => {
    const unsubscribe = dataService.subscribe(refreshFromService);
    return () => unsubscribe();
  }, [selectedFarmId, selectedPondId]);

  const setLanguage = (lang: LanguageCode) => {
    dataService.setLanguage(lang);
    setLanguageState(lang);
    showToast(`Language updated to ${lang === 'en' ? 'English' : lang === 'te' ? 'తెలుగు' : 'हिंदी'}`, 'info');
  };

  const switchRole = (newRole: UserRole) => {
    dataService.switchRole(newRole);
    if (newRole === 'farmer') setActiveTab('dashboard');
    else if (newRole === 'admin') setActiveTab('admin-overview');
    else if (newRole === 'evaluator') setActiveTab('eval-overview');
    showToast(`Switched role to ${newRole.toUpperCase()}`, 'info');
  };

  const resetDemoData = () => {
    dataService.resetToDemoData();
    showToast('Demo data restored to initial baseline', 'success');
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const activePond = ponds.find((p) => p.id === selectedPondId) || ponds[0];
  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        language,
        t,
        setLanguage,
        switchRole,
        resetDemoData,
        farms,
        ponds,
        selectedFarmId,
        selectedPondId,
        setSelectedFarmId,
        setSelectedPondId,
        activePond,
        activeFarm,
        waterReadings,
        assessments,
        feedRecords,
        expenseRecords,
        reminders,
        articles,
        weather,
        supportTickets,
        auditLogs,
        metrics,
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab,
        selectedArticle,
        setSelectedArticle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
