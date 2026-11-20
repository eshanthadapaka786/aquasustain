import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Grid,
  ActivitySquare,
  Droplets,
  PackageCheck,
  Receipt,
  BookOpen,
  CloudSun,
  CalendarCheck,
  LifeBuoy,
  User,
  Users,
  Shield,
  Sliders,
  FileText,
  BarChart3,
  ClipboardList,
  CheckCircle2,
  FolderTree,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, activeTab, setActiveTab, t } = useApp();

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  // Farmer Navigation Items
  const farmerNav = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'farms', label: t('navFarms'), icon: Grid },
    { id: 'assessment', label: t('navAssessments'), icon: ActivitySquare, badge: 'Smart' },
    { id: 'water-quality', label: t('navWaterQuality'), icon: Droplets },
    { id: 'feed', label: t('navFeed'), icon: PackageCheck },
    { id: 'expenses', label: t('navExpenses'), icon: Receipt },
    { id: 'learning', label: t('navLearning'), icon: BookOpen },
    { id: 'weather', label: t('navWeather'), icon: CloudSun },
    { id: 'reminders', label: t('navReminders'), icon: CalendarCheck },
    { id: 'support', label: t('navSupport'), icon: LifeBuoy },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  // Admin Navigation Items
  const adminNav = [
    { id: 'admin-overview', label: t('navAdminOverview'), icon: LayoutDashboard },
    { id: 'admin-users', label: t('navAdminUsers'), icon: Users },
    { id: 'admin-farms', label: t('navAdminFarms'), icon: Grid },
    { id: 'admin-content', label: t('navAdminContent'), icon: BookOpen },
    { id: 'admin-rules', label: t('navAdminRules'), icon: Sliders },
    { id: 'admin-support', label: t('navAdminSupport'), icon: LifeBuoy },
    { id: 'admin-analytics', label: t('navAdminAnalytics'), icon: BarChart3 },
    { id: 'admin-audit', label: t('navAdminAudit'), icon: ClipboardList },
  ];

  // Evaluator Navigation Items
  const evaluatorNav = [
    { id: 'eval-overview', label: t('navEvalOverview'), icon: LayoutDashboard },
    { id: 'eval-modules', label: t('navEvalModules'), icon: FolderTree },
    { id: 'eval-demo', label: t('navEvalDemo'), icon: Sparkles, badge: 'Live' },
    { id: 'eval-insights', label: t('navEvalInsights'), icon: BarChart3 },
    { id: 'eval-impact', label: t('navEvalImpact'), icon: CheckCircle2 },
  ];

  let currentNav = farmerNav;
  let roleTitle = 'Farmer Workspace';
  let badgeColor = 'bg-teal-50 text-teal-800 border-teal-200';

  if (role === 'admin') {
    currentNav = adminNav;
    roleTitle = 'System Administration';
    badgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';
  } else if (role === 'evaluator') {
    currentNav = evaluatorNav;
    roleTitle = 'Academic Evaluation Portal';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Role Section Header */}
          <div className="mb-4 px-2">
            <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-md border uppercase tracking-wider ${badgeColor}`}>
              {roleTitle}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-ocean-700 to-ocean-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-ocean-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-ocean-600 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[11px] text-slate-500 font-medium">
            <span className="font-semibold text-ocean-800">AquaSustain CSP</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Production Prototype v1.2 • Offline Mock Engine
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
