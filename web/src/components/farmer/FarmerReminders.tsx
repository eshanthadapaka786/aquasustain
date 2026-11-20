import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { Reminder } from '@aquasustain/shared';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  X,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const FarmerReminders: React.FC = () => {
  const { ponds, selectedPondId, reminders, showToast, t } = useApp();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water Quality Testing' as Reminder['category'],
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '06:00',
    priority: 'High' as Reminder['priority'],
    pondId: selectedPondId || (ponds[0]?.id ?? ''),
  });

  const categories: Reminder['category'][] = [
    'Water Quality Testing',
    'Feeding Schedule',
    'Probiotic Application',
    'Aerator Maintenance',
    'Biomass Sampling',
    'Harvest Inspection',
    'Govt Scheme / Subsidy',
  ];

  const filteredReminders = reminders.filter((r) => {
    if (filterStatus === 'Pending') return r.status === 'Pending';
    if (filterStatus === 'Completed') return r.status === 'Completed';
    return true;
  });

  const handleToggle = (id: string) => {
    const updated = dataService.toggleReminderStatus(id);
    if (updated) {
      showToast(`Task marked as ${updated.status}`, 'info');
    }
  };

  const handleDelete = (id: string) => {
    dataService.deleteReminder(id);
    showToast('Task removed', 'info');
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a task title', 'error');
      return;
    }

    const pond = ponds.find((p) => p.id === formData.pondId);
    try {
      dataService.addReminder({
        ...formData,
        pondName: pond?.name,
      });
      setShowAddModal(false);
      showToast('New reminder created successfully', 'success');
      setFormData({
        title: '',
        description: '',
        category: 'Water Quality Testing',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '06:00',
        priority: 'High',
        pondId: selectedPondId || (ponds[0]?.id ?? ''),
      });
    } catch (err) {
      showToast('Failed to create reminder', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('navReminders')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep all pond maintenance routines, aerator oil checks, probe calibrations, and feed schedules on track.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task Reminder</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'Pending', 'Completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === status
                ? 'bg-ocean-800 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status} ({reminders.filter((r) => status === 'All' || r.status === status).length})
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="aqua-card p-12 text-center text-slate-400">
            <CalendarCheck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-medium">{t('noRemindersDue')}</p>
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const isCompleted = reminder.status === 'Completed';

            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(reminder.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${isCompleted ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`}
                    />
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-ocean-900'
                        }`}
                      >
                        {reminder.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {reminder.category}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          reminder.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {reminder.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {reminder.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-medium text-ocean-800">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due {reminder.dueDate} at {reminder.dueTime}</span>
                      </span>
                      {reminder.pondName && (
                        <span>• {reminder.pondName}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Remove reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Create Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">Create Task Reminder</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dose agricultural lime 50kg"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Due Time</label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Associated Pond</label>
                <select
                  value={formData.pondId}
                  onChange={(e) => setFormData({ ...formData, pondId: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                >
                  <option value="">General Farm Task</option>
                  {ponds.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Detailed Instructions</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Broadcast evenly along water flow vortex."
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
