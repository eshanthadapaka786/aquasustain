import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { WATER_QUALITY_GUIDELINES } from '@aquasustain/shared';
import {
  Droplets,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const FarmerWaterQuality: React.FC = () => {
  const { ponds, selectedPondId, waterReadings, showToast, t } = useApp();

  const [activePondFilter, setActivePondFilter] = useState<string>(selectedPondId || 'all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Reading Form State
  const [formData, setFormData] = useState({
    pondId: selectedPondId || (ponds[0]?.id ?? 'pond-01'),
    temperatureC: 28.0,
    ph: 7.9,
    dissolvedOxygenMgL: 5.5,
    transparencyCm: 35,
    salinityPpt: 18.0,
    alkalinityPpm: 130,
    ammoniaPpm: 0.08,
    nitritePpm: 0.15,
    hardnessPpm: 4000,
    notes: '',
  });

  const filteredReadings = activePondFilter === 'all'
    ? waterReadings
    : waterReadings.filter((r) => r.pondId === activePondFilter);

  const handleSaveReading = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPond = ponds.find((p) => p.id === formData.pondId);
    if (!selectedPond) {
      showToast('Please select a valid pond', 'error');
      return;
    }

    try {
      dataService.addWaterReading({
        ...formData,
        pondName: selectedPond.name,
      });
      setShowAddModal(false);
      showToast('Water parameter reading saved successfully', 'success');
    } catch (err) {
      showToast('Failed to record water test', 'error');
    }
  };

  const chartData = [...filteredReadings].reverse().map((r) => ({
    timestamp: new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    do: r.dissolvedOxygenMgL,
    ph: r.ph,
    temp: r.temperatureC,
    ammonia: r.ammoniaPpm,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('navWaterQuality')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track Dissolved Oxygen, pH equilibrium, temperature, transparency and toxic nitrogenous compounds.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t('actionAddReading')}</span>
        </button>
      </div>

      {/* Threshold Reference Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50">
          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
            Dissolved Oxygen (DO)
          </span>
          <span className="text-lg font-extrabold text-teal-950 font-heading mt-0.5 block">
            5.0 - 8.5 <span className="text-xs font-semibold text-teal-700">mg/L</span>
          </span>
          <span className="text-[10px] text-teal-800/80 mt-1 block">Critical below 3.5 mg/L</span>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Water pH Equilibrium
          </span>
          <span className="text-lg font-extrabold text-amber-950 font-heading mt-0.5 block">
            7.5 - 8.5 <span className="text-xs font-semibold text-amber-700">pH</span>
          </span>
          <span className="text-[10px] text-amber-800/80 mt-1 block">Daily swing &lt; 0.5 units</span>
        </div>

        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
            Secchi Transparency
          </span>
          <span className="text-lg font-extrabold text-blue-950 font-heading mt-0.5 block">
            30 - 45 <span className="text-xs font-semibold text-blue-700">cm</span>
          </span>
          <span className="text-[10px] text-blue-800/80 mt-1 block">Healthy diatom bloom</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Total Ammonia (TAN)
          </span>
          <span className="text-lg font-extrabold text-slate-900 font-heading mt-0.5 block">
            &lt; 0.10 <span className="text-xs font-semibold text-slate-500">ppm</span>
          </span>
          <span className="text-[10px] text-slate-600 mt-1 block">Toxicity spikes with pH &gt; 8.5</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="aqua-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-ocean-900 font-heading">
              Water Parameter Trends
            </h3>
            <p className="text-xs text-slate-500">
              Diurnal fluctuations across recorded morning and afternoon testing cycles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activePondFilter}
              onChange={(e) => setActivePondFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-ocean-900 focus:outline-none"
            >
              <option value="all">All Ponds</option>
              {ponds.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                name="DO (mg/L)"
                dataKey="do"
                stroke="#168C83"
                strokeWidth={2.5}
                dot={{ fill: '#168C83', r: 3 }}
              />
              <Line
                type="monotone"
                name="pH"
                dataKey="ph"
                stroke="#D99A38"
                strokeWidth={2}
                dot={{ fill: '#D99A38', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Readings Table */}
      <div className="aqua-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-ocean-900 font-heading">
            {t('readingHistoryTitle')}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredReadings.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Pond</th>
                <th className="pb-3">DO (mg/L)</th>
                <th className="pb-3">pH</th>
                <th className="pb-3">Temp (°C)</th>
                <th className="pb-3">Transp.</th>
                <th className="pb-3">TAN (ppm)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReadings.map((reading) => {
                let badge = 'bg-emerald-100 text-emerald-800';
                if (reading.status === 'Alert') badge = 'bg-amber-100 text-amber-800';
                if (reading.status === 'Critical') badge = 'bg-rose-100 text-rose-800';

                return (
                  <tr key={reading.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-medium text-slate-700 whitespace-nowrap">
                      {new Date(reading.timestamp).toLocaleDateString()}{' '}
                      <span className="text-[10px] text-slate-400">
                        {new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-ocean-900 whitespace-nowrap">
                      {reading.pondName}
                    </td>
                    <td className="py-3 font-bold text-ocean-800">
                      {reading.dissolvedOxygenMgL}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      {reading.ph}
                    </td>
                    <td className="py-3 text-slate-600">
                      {reading.temperatureC}
                    </td>
                    <td className="py-3 text-slate-600">
                      {reading.transparencyCm} cm
                    </td>
                    <td className="py-3 text-slate-600">
                      {reading.ammoniaPpm}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge}`}>
                        {reading.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 max-w-xs truncate">
                      {reading.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Reading Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">{t('logNewReadingTitle')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReading} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Pond *</label>
                <select
                  value={formData.pondId}
                  onChange={(e) => setFormData({ ...formData, pondId: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                >
                  {ponds.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">DO (mg/L) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.dissolvedOxygenMgL}
                    onChange={(e) => setFormData({ ...formData, dissolvedOxygenMgL: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">pH Value *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Temperature (°C) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.temperatureC}
                    onChange={(e) => setFormData({ ...formData, temperatureC: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Transparency (cm)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.transparencyCm}
                    onChange={(e) => setFormData({ ...formData, transparencyCm: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Ammonia TAN (ppm)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ammoniaPpm}
                    onChange={(e) => setFormData({ ...formData, ammoniaPpm: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Alkalinity (ppm)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.alkalinityPpm}
                    onChange={(e) => setFormData({ ...formData, alkalinityPpm: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Field Notes / Observations</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Aerators ran for 8 hours. Plankton bloom healthy light green."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ocean-700 hover:bg-ocean-800 text-white rounded-xl font-bold"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
