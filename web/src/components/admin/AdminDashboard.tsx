import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { WATER_QUALITY_GUIDELINES } from '@aquasustain/shared';
import {
  ShieldCheck,
  Users,
  Grid,
  Droplets,
  BookOpen,
  Sliders,
  LifeBuoy,
  ClipboardList,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { metrics, auditLogs, farms, ponds, supportTickets, articles, showToast, t, activeTab, setActiveTab } = useApp();

  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'rules' | 'audit'>('overview');

  const districtDistribution = [
    { district: 'West Godavari', farms: 284, ponds: 810 },
    { district: 'Krishna', farms: 162, ponds: 460 },
    { district: 'Bapatla', farms: 88, ponds: 245 },
    { district: 'Nellore', farms: 74, ponds: 215 },
    { district: 'East Godavari', farms: 34, ponds: 110 },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-ocean-900 via-indigo-950 to-ocean-800 rounded-2xl p-6 text-white shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Platform Administration & State Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              AquaSustain Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Oversight across 384 registered aquaculture farms, water quality telemetry, knowledge CMS, and extension diagnostic rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30">
              Demo Simulation Mode
            </span>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview' as const, label: 'Overview Metrics', icon: BarChart3 },
          { id: 'users' as const, label: 'Farmer Accounts (384)', icon: Users },
          { id: 'rules' as const, label: 'Assessment Rule Thresholds', icon: Sliders },
          { id: 'audit' as const, label: 'System Audit Logs', icon: ClipboardList },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isCurrent
                  ? 'bg-ocean-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION: Overview */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="aqua-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Registered Farmers
              </span>
              <div className="text-2xl font-extrabold text-ocean-900 font-heading mt-1">
                {metrics.totalRegisteredFarmers}
              </div>
              <span className="text-xs text-emerald-700 font-semibold mt-1 block">
                {metrics.activeFarmers7Days} active in last 7 days
              </span>
            </div>

            <div className="aqua-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Active Culture Ponds
              </span>
              <div className="text-2xl font-extrabold text-ocean-900 font-heading mt-1">
                {metrics.totalActivePonds}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {metrics.totalCultureAreaAcres} Total Water Acres
              </span>
            </div>

            <div className="aqua-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Water Tests Logged (Month)
              </span>
              <div className="text-2xl font-extrabold text-ocean-900 font-heading mt-1">
                {metrics.waterReadingsLoggedThisMonth.toLocaleString()}
              </div>
              <span className="text-xs text-emerald-700 font-semibold mt-1 block">
                +14.2% telemetric surge
              </span>
            </div>

            <div className="aqua-card p-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Open Support Inquiries
              </span>
              <div className="text-2xl font-extrabold text-amber-700 font-heading mt-1">
                {metrics.openSupportTickets}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Avg resolution: 4.2 hours
              </span>
            </div>
          </div>

          {/* Regional Aquaculture Chart */}
          <div className="aqua-card p-5">
            <h3 className="text-base font-bold text-ocean-900 font-heading mb-4">
              Registered Acreage & Pond Density by Coastal District (Simulated Demonstration)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="district" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar name="Registered Ponds" dataKey="ponds" fill="#168C83" radius={[4, 4, 0, 0]} />
                  <Bar name="Active Farms" dataKey="farms" fill="#D99A38" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Platform Activity */}
          <div className="aqua-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ocean-900 font-heading">
                Recent Farmer Diagnostic & Telemetric Events
              </h3>
              <span className="text-xs text-slate-400">Live event stream</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <div>
                      <span className="font-bold text-ocean-900">{log.action}</span>
                      <span className="text-slate-500 block text-[11px]">{log.details}</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <span>{log.actorName} ({log.actorRole})</span>
                    <span className="block text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Users */}
      {activeSection === 'users' && (
        <div className="aqua-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ocean-900 font-heading">
              Registered Farmers Registry
            </h3>
            <span className="text-xs bg-teal-50 text-teal-800 px-3 py-1 rounded-full font-bold">
              384 Producers Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Farmer Name</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Farms / Ponds</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-ocean-900">Ramesh Varma</td>
                  <td className="py-3 text-slate-600">+91 98480 23456</td>
                  <td className="py-3 text-slate-600">Undi, West Godavari</td>
                  <td className="py-3 font-semibold text-ocean-800">2 Farms • 4 Ponds</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">Mar 15, 2026</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-ocean-900">V. Ramakrishna Raju</td>
                  <td className="py-3 text-slate-600">+91 94402 11982</td>
                  <td className="py-3 text-slate-600">Bhimavaram Delta</td>
                  <td className="py-3 font-semibold text-ocean-800">3 Farms • 8 Ponds</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">Feb 20, 2026</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-ocean-900">K. Subrahmanyam</td>
                  <td className="py-3 text-slate-600">+91 98491 55670</td>
                  <td className="py-3 text-slate-600">Nagayalanka, Krishna</td>
                  <td className="py-3 font-semibold text-ocean-800">1 Farm • 2 Ponds</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">Apr 02, 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: Assessment Rules */}
      {activeSection === 'rules' && (
        <div className="aqua-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-ocean-900 font-heading">
                Assessment Engine Decision Matrix (v1.2.0-field-prototype)
              </h3>
              <p className="text-xs text-slate-500">
                Scientific benchmark thresholds configured for Penaeus vannamei and freshwater polyculture.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
              Calibrated Thresholds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(WATER_QUALITY_GUIDELINES).map(([key, item]) => (
              <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ocean-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Unit: {item.unit}</span>
                </div>
                <div className="text-xs text-slate-700 flex items-center gap-3">
                  {'optimalMin' in item && <span>Min: <strong>{item.optimalMin}</strong></span>}
                  {'optimalMax' in item && <span>Max: <strong>{item.optimalMax}</strong></span>}
                  {'criticalLow' in item && <span className="text-rose-600 font-bold">Critical: &lt;{item.criticalLow}</span>}
                  {'criticalMax' in item && <span className="text-rose-600 font-bold">Critical: &gt;{item.criticalMax}</span>}
                </div>
                <p className="text-[11px] text-slate-500">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Audit Logs */}
      {activeSection === 'audit' && (
        <div className="aqua-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ocean-900 font-heading">
              Platform Audit & Tamper-Evident Security Log
            </h3>
            <span className="text-xs text-slate-400">Session logs recorded in state store</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Actor</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Entity</th>
                  <th className="pb-3">Details</th>
                  <th className="pb-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 font-bold text-ocean-900 whitespace-nowrap">
                      {log.actorName} <span className="text-[10px] text-slate-400 font-normal">({log.actorRole})</span>
                    </td>
                    <td className="py-2.5 font-semibold text-ocean-700">
                      {log.action}
                    </td>
                    <td className="py-2.5 text-slate-600">
                      {log.entityType}
                    </td>
                    <td className="py-2.5 text-slate-600 max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 text-slate-400 font-mono text-[10px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
