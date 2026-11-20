import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { ExpenseCategory, ExpenseRecord } from '@aquasustain/shared';
import {
  Receipt,
  Plus,
  DollarSign,
  TrendingUp,
  Trash2,
  Filter,
  X,
  CreditCard,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const FarmerExpenses: React.FC = () => {
  const { farms, selectedFarmId, expenseRecords, showToast, t } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form State
  const [formData, setFormData] = useState({
    farmId: selectedFarmId || (farms[0]?.id ?? 'farm-01'),
    date: new Date().toISOString().split('T')[0],
    category: 'Feed' as ExpenseCategory,
    amount: 15000,
    description: '',
    vendorName: '',
    paymentMode: 'UPI' as ExpenseRecord['paymentMode'],
    invoiceNumber: '',
  });

  const categories: ExpenseCategory[] = [
    'Feed',
    'Electricity & Diesel',
    'Seed / Post-Larvae',
    'Probiotics & Minerals',
    'Labour Wages',
    'Pond Maintenance & Soil Prep',
    'Lab Testing & Diagnostics',
    'Equipment & Aeration Spares',
  ];

  const totalExpense = expenseRecords.reduce((sum, item) => sum + item.amount, 0);

  // Group by category for charts
  const categoryTotals: Record<string, number> = {};
  expenseRecords.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const chartData = Object.keys(categoryTotals).map((cat) => ({
    name: cat.split(' ')[0], // short name
    fullName: cat,
    amount: categoryTotals[cat],
  }));

  const COLORS = ['#168C83', '#D99A38', '#123B4A', '#24845B', '#64748B', '#D96C64', '#0284C7', '#8B5CF6'];

  const filteredExpenses = selectedCategory === 'all'
    ? expenseRecords
    : expenseRecords.filter((e) => e.category === selectedCategory);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const farm = farms.find((f) => f.id === formData.farmId);
    if (!farm) {
      showToast('Please select a valid farm', 'error');
      return;
    }

    try {
      dataService.addExpense({
        ...formData,
        farmName: farm.name,
      });
      setShowAddModal(false);
      showToast('Expense recorded successfully', 'success');
    } catch (err) {
      showToast('Failed to record expense', 'error');
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense record?')) {
      dataService.deleteExpense(id);
      showToast('Expense record removed', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('navExpenses')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain transparent accounting for feed, energy, probiotics, seed procurement, and labour.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t('actionAddExpense')}</span>
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="aqua-card p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Total Operational Expenditure
          </span>
          <div className="text-2xl font-extrabold text-ocean-900 font-heading mt-1">
            ₹{totalExpense.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Across {farms.length} farms
          </span>
        </div>

        <div className="aqua-card p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Primary Cost Component
          </span>
          <div className="text-2xl font-extrabold text-ocean-900 font-heading mt-1">
            Feed (44.9%)
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ₹{(categoryTotals['Feed'] || 52800).toLocaleString('en-IN')} logged
          </span>
        </div>

        <div className="aqua-card p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Energy & Aeration Costs
          </span>
          <div className="text-2xl font-extrabold text-ocean-900 font-heading mt-1">
            ₹{(categoryTotals['Electricity & Diesel'] || 24500).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Grid tariff + diesel backup
          </span>
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      <div className="aqua-card p-5">
        <h3 className="text-base font-bold text-ocean-900 font-heading mb-4">
          Expenditure by Input Category
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} interval={0} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Transaction History */}
      <div className="aqua-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-ocean-900 font-heading">
            Expense Records
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-ocean-900 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3">Date</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Vendor</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 font-medium text-slate-700 whitespace-nowrap">
                    {exp.date}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-ocean-900 max-w-xs truncate">
                    {exp.description}
                  </td>
                  <td className="py-3 text-slate-600">
                    {exp.vendorName}
                  </td>
                  <td className="py-3 text-slate-500">
                    {exp.paymentMode}
                  </td>
                  <td className="py-3 font-extrabold text-ocean-900 whitespace-nowrap">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">Record Farm Expense</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Farm *</label>
                <select
                  value={formData.farmId}
                  onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Expense Category *</label>
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description / Item Details *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 50 bags Dolomite mineral powder"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Vendor / Store Name</label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    placeholder="e.g. Balaji Agro Agencies"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Payment Mode</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="NEFT / Bank Transfer">NEFT / Bank Transfer</option>
                    <option value="Trader Credit">Trader Credit</option>
                  </select>
                </div>
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
