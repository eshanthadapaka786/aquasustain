import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { FeedRecord } from '@aquasustain/shared';
import {
  PackageCheck,
  Plus,
  Scale,
  DollarSign,
  Clock,
  Sparkles,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';

export const FarmerFeed: React.FC = () => {
  const { ponds, selectedPondId, feedRecords, showToast, t } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Feed Form State
  const [formData, setFormData] = useState({
    pondId: selectedPondId || (ponds[0]?.id ?? 'pond-01'),
    date: new Date().toISOString().split('T')[0],
    feedSlot: 'Morning (06:00)' as FeedRecord['feedSlot'],
    feedBrand: 'CP Aquaculture Grower 35% Protein',
    feedType: 'Grower (1.4mm-1.8mm)' as FeedRecord['feedType'],
    quantityKg: 35,
    unitPricePerKg: 88,
    checkTrayObservation: 'Clean (Nominal)' as FeedRecord['checkTrayObservation'],
    notes: '',
  });

  const totalFeedToday = feedRecords
    .filter((f) => f.date === formData.date)
    .reduce((sum, item) => sum + item.quantityKg, 0);

  const totalFeedCost = feedRecords.reduce((sum, item) => sum + item.totalCost, 0);

  const handleRecordFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPond = ponds.find((p) => p.id === formData.pondId);
    if (!selectedPond) {
      showToast('Please select a valid pond', 'error');
      return;
    }

    try {
      dataService.addFeedRecord({
        ...formData,
        pondName: selectedPond.name,
      });
      setShowAddModal(false);
      showToast('Feed distribution record saved', 'success');
    } catch (err) {
      showToast('Failed to record feed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('navFeed')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor daily feeding schedules, check-tray consumption feedback, and feed cost efficiency (FCR).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t('actionRecordFeed')}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="aqua-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Feed Dispatched Today
            </span>
            <div className="text-2xl font-extrabold text-ocean-900 font-heading">
              {totalFeedToday} <span className="text-sm font-semibold text-slate-400">kg</span>
            </div>
          </div>
        </div>

        <div className="aqua-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Recorded Feed Cost
            </span>
            <div className="text-2xl font-extrabold text-ocean-900 font-heading">
              ₹{totalFeedCost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="aqua-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Average Check-Tray Efficiency
            </span>
            <div className="text-2xl font-extrabold text-ocean-900 font-heading">
              94.2% <span className="text-xs font-semibold text-emerald-700">Clean</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Records Table */}
      <div className="aqua-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-ocean-900 font-heading">
            Feed Distribution Log
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing {feedRecords.length} recorded feedings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3">Date & Slot</th>
                <th className="pb-3">Pond</th>
                <th className="pb-3">Feed Brand & Type</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Tray Consumption</th>
                <th className="pb-3">Total Cost</th>
                <th className="pb-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feedRecords.map((feed) => {
                let trayBadge = 'bg-emerald-100 text-emerald-800';
                if (feed.checkTrayObservation.includes('Reduce') || feed.checkTrayObservation.includes('Leftover')) {
                  trayBadge = 'bg-amber-100 text-amber-800';
                }
                if (feed.checkTrayObservation.includes('Halt')) {
                  trayBadge = 'bg-rose-100 text-rose-800';
                }

                return (
                  <tr key={feed.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-medium text-slate-700 whitespace-nowrap">
                      {feed.date}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {feed.feedSlot}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-ocean-900 whitespace-nowrap">
                      {feed.pondName}
                    </td>
                    <td className="py-3 font-medium text-slate-800">
                      {feed.feedBrand}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {feed.feedType}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-ocean-800">
                      {feed.quantityKg} kg
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trayBadge}`}>
                        {feed.checkTrayObservation}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-ocean-900 whitespace-nowrap">
                      ₹{feed.totalCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-slate-500 max-w-xs truncate">
                      {feed.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Feed Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">Record Pond Feeding</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordFeed} className="space-y-4 text-xs">
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Feeding Slot *</label>
                  <select
                    value={formData.feedSlot}
                    onChange={(e) => setFormData({ ...formData, feedSlot: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  >
                    <option value="Morning (06:00)">Morning (06:00)</option>
                    <option value="Noon (11:00)">Noon (11:00)</option>
                    <option value="Afternoon (15:00)">Afternoon (15:00)</option>
                    <option value="Night (20:00)">Night (20:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Feed Quantity (kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.quantityKg}
                    onChange={(e) => setFormData({ ...formData, quantityKg: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price per kg (₹)</label>
                  <input
                    type="number"
                    value={formData.unitPricePerKg}
                    onChange={(e) => setFormData({ ...formData, unitPricePerKg: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Check Tray Observation *</label>
                <select
                  value={formData.checkTrayObservation}
                  onChange={(e) => setFormData({ ...formData, checkTrayObservation: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                >
                  <option value="100% Consumed (Increase slightly)">100% Consumed (Trays completely clean - increase slightly)</option>
                  <option value="Clean (Nominal)">Clean (Nominal consumption)</option>
                  <option value="10-20% Leftover (Reduce 10%)">10-20% Leftover (Reduce next allocation 10%)</option>
                  <option value="Heavy Leftover (Halt feeding)">Heavy Leftover (Halt feeding and inspect DO/ammonia)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Notes / Feed Additives</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Coated with Vitamin C and gut probiotic"
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
                  Save Feed Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
