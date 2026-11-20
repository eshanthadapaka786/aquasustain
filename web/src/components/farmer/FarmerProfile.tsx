import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { LanguageCode } from '@aquasustain/shared';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const FarmerProfile: React.FC = () => {
  const { currentUser, language, setLanguage, showToast, t } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    phone: currentUser.phone,
    email: currentUser.email,
    village: currentUser.village,
    district: currentUser.district,
    state: currentUser.state,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateUserProfile(formData);
    showToast(t('recordSavedSuccess'), 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('profileTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered Aquaculture Farmer Profile • Coastal Aquaculture Authority verified account
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Verified Producer</span>
        </span>
      </div>

      {/* Main Settings Card */}
      <div className="aqua-card p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-ocean-800 to-ocean-600 text-white font-extrabold text-2xl flex items-center justify-center font-heading shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-ocean-900 font-heading">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500">
              {currentUser.village}, {currentUser.district} • {currentUser.state}
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
              <span>Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="font-semibold text-ocean-700">{currentUser.farmCount} Farms registered</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Mobile Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Village / Mandal *</label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{t('saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Language Preference Card */}
      <div className="aqua-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-ocean-800 font-bold text-sm">
          <Globe2 className="w-4 h-4 text-ocean-600" />
          <span>{t('languagePreference')}</span>
        </div>
        <p className="text-xs text-slate-500">
          Select your primary interface language. AquaSustain dynamically adapts all dashboard gauges, diagnostic forms, and learning articles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { code: 'en' as LanguageCode, label: 'English', desc: 'Default international terminology' },
            { code: 'te' as LanguageCode, label: 'తెలుగు (Telugu)', desc: 'ఆంధ్రప్రదేశ్ & తెలంగాణ తీర ప్రాంత రైతులకు' },
            { code: 'hi' as LanguageCode, label: 'हिंदी (Hindi)', desc: 'उत्तर एवं मध्य भारत के अंतर्देशीय मत्स्य पालकों के लिए' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                language === item.code
                  ? 'border-ocean-600 bg-ocean-50/60 ring-2 ring-ocean-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <span className="font-bold text-sm text-ocean-900 block">{item.label}</span>
                <span className="text-[11px] text-slate-500 mt-1 block leading-snug">{item.desc}</span>
              </div>
              {language === item.code && (
                <span className="mt-3 text-[10px] font-bold text-ocean-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active Language</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
