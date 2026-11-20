import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Waves,
  Globe2,
  UserCheck,
  RotateCcw,
  Menu,
  X,
  Bell,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { UserRole, LanguageCode } from '@aquasustain/shared';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentUser,
    role,
    language,
    setLanguage,
    switchRole,
    resetDemoData,
    farms,
    ponds,
    selectedFarmId,
    selectedPondId,
    setSelectedFarmId,
    setSelectedPondId,
    t,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'farmer', label: 'Farmer Portal', icon: UserCheck, color: 'text-teal-700 bg-teal-50' },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck, color: 'text-indigo-700 bg-indigo-50' },
    { id: 'evaluator', label: 'Evaluator Review', icon: GraduationCap, color: 'text-amber-700 bg-amber-50' },
  ];

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Mobile Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-ocean-800 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ocean-800 to-ocean-600 flex items-center justify-center text-white shadow-sm">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-ocean-800 leading-none block">
                  Aqua<span className="text-ocean-600">Sustain</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 tracking-tight leading-none mt-0.5">
                  Smart Aquaculture. Better Pond Management.
                </span>
              </div>
            </div>
          </div>

          {/* Center: Farm & Pond Quick Switcher (Visible for Farmer role) */}
          {role === 'farmer' && (
            <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-medium px-2">Farm:</span>
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="bg-white border border-slate-200 text-ocean-800 font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-ocean-600 cursor-pointer"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <span className="text-slate-300">|</span>

              <span className="text-slate-400 font-medium px-1">Pond:</span>
              <select
                value={selectedPondId}
                onChange={(e) => setSelectedPondId(e.target.value)}
                className="bg-white border border-slate-200 text-ocean-800 font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-ocean-600 cursor-pointer"
              >
                {ponds
                  .filter((p) => p.farmId === selectedFarmId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Right: Controls & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Reset Button */}
            <button
              onClick={resetDemoData}
              title="Reset session to original demo dataset"
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-ocean-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetDemoData')}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown);
                  setShowRoleDropdown(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                <Globe2 className="w-4 h-4 text-ocean-600" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition ${
                        language === l.code
                          ? 'font-bold text-ocean-700 bg-ocean-50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[11px] text-slate-400">{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowLangDropdown(false);
                  setShowNotifications(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                  role === 'farmer'
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : role === 'admin'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}
              >
                {role === 'farmer' && <UserCheck className="w-4 h-4 text-teal-600" />}
                {role === 'admin' && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                {role === 'evaluator' && <GraduationCap className="w-4 h-4 text-amber-600" />}
                <span className="capitalize">{role}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch User Role
                  </div>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          switchRole(r.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition ${
                          role === r.id
                            ? 'font-bold bg-slate-100 text-ocean-800'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${r.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold">{r.label}</div>
                          <div className="text-[10px] text-slate-400">
                            {r.id === 'farmer'
                              ? 'Manage ponds, readings & feed'
                              : r.id === 'admin'
                              ? 'System oversight & content CMS'
                              : 'Academic evaluation & demo checklist'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowLangDropdown(false);
                  setShowRoleDropdown(false);
                }}
                className="relative p-2 rounded-lg text-slate-500 hover:text-ocean-800 hover:bg-slate-100 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Notifications & Alerts</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                      2 Unresolved
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    <div className="p-3 text-xs hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex items-center gap-1.5 text-rose-600 font-bold mb-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>Hypoxia Alert: Pond K-1</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Predawn DO tested at 3.4 mg/L. Emergency paddlewheel check advised.
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Today, 05:45 AM</span>
                    </div>

                    <div className="p-3 text-xs hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Weather Advisory: Depression in Bay</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Expected rainfall on Nov 22-23. Prepare backup generator fuel.
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Yesterday, 06:00 PM</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ocean-700 to-ocean-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-ocean-900 block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 capitalize block leading-tight">
                  {currentUser.role} • {currentUser.district}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
