import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '@aquasustain/shared';
import { Farm, Pond, SpeciesType, CultureStage } from '@aquasustain/shared';
import {
  Grid,
  Plus,
  MapPin,
  Droplets,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';

export const FarmerFarmsPonds: React.FC = () => {
  const { farms, ponds, showToast, t, selectedFarmId, setSelectedFarmId, setSelectedPondId, setActiveTab } = useApp();

  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddPondModal, setShowAddPondModal] = useState(false);

  // New Farm Form State
  const [farmForm, setFarmForm] = useState({
    name: '',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    mandal: '',
    village: '',
    totalAreaAcres: 5.0,
    waterSource: 'Canal' as Farm['waterSource'],
    soilType: 'Clay Loam' as Farm['soilType'],
    caaRegistrationNumber: '',
    establishedYear: 2024,
    status: 'Active' as Farm['status'],
  });

  // New Pond Form State
  const [pondForm, setPondForm] = useState({
    farmId: selectedFarmId || (farms[0]?.id ?? ''),
    name: '',
    code: '',
    waterAreaAcres: 1.5,
    averageDepthMeters: 1.4,
    species: 'L. vannamei (Whiteleg Shrimp)' as SpeciesType,
    stockingDate: new Date().toISOString().split('T')[0],
    daysOfCulture: 1,
    stockingDensityPerSqm: 45,
    totalStockCount: 250000,
    estimatedSurvivalRatePercent: 90,
    currentEstimatedBiomassKg: 200,
    currentMeanBodyWeightGrams: 1.0,
    targetHarvestWeightGrams: 28.0,
    targetHarvestDate: '',
    cultureStage: 'Grow-out (Early)' as CultureStage,
    aeratorHpTotal: 12,
    status: 'Optimal' as Pond['status'],
  });

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmForm.name.trim() || !farmForm.village.trim()) {
      showToast('Please fill in farm name and village location', 'error');
      return;
    }

    try {
      const created = dataService.addFarm(farmForm);
      setSelectedFarmId(created.id);
      setShowAddFarmModal(false);
      showToast(`Farm "${created.name}" registered successfully`, 'success');
    } catch (err) {
      showToast('Failed to register farm', 'error');
    }
  };

  const handleCreatePond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pondForm.name.trim() || !pondForm.code.trim()) {
      showToast('Please specify pond name and pond code', 'error');
      return;
    }

    try {
      const created = dataService.addPond(pondForm);
      setSelectedPondId(created.id);
      setShowAddPondModal(false);
      showToast(`Pond "${created.name}" added to farm successfully`, 'success');
    } catch (err) {
      showToast('Failed to register pond', 'error');
    }
  };

  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const farmPonds = ponds.filter((p) => p.farmId === activeFarm?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('navFarms')} & {t('navPonds')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your registered aquaculture holdings, stocking schedules and pond biology.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddFarmModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-ocean-900 font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register Farm</span>
          </button>
          <button
            onClick={() => setShowAddPondModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pond</span>
          </button>
        </div>
      </div>

      {/* Farm Selection Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {farms.map((farm) => {
          const isSelected = farm.id === activeFarm?.id;
          const pondCount = ponds.filter((p) => p.farmId === farm.id).length;
          return (
            <button
              key={farm.id}
              onClick={() => setSelectedFarmId(farm.id)}
              className={`px-4 py-3 rounded-xl border text-left shrink-0 transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-ocean-800 text-white border-ocean-800 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-xs">{farm.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-ocean-700 text-ocean-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {pondCount} Ponds
                </span>
              </div>
              <div
                className={`text-[11px] mt-2 flex items-center gap-1 ${
                  isSelected ? 'text-ocean-200' : 'text-slate-400'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>
                  {farm.village}, {farm.district} • {farm.totalAreaAcres} Acres
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Farm Information Card */}
      {activeFarm && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">CAA Registration</span>
              <span className="font-semibold text-ocean-900">{activeFarm.caaRegistrationNumber || 'CAA/REG/PENDING'}</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Water Source</span>
              <span className="font-semibold text-ocean-900">{activeFarm.waterSource}</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Soil Profile</span>
              <span className="font-semibold text-ocean-900">{activeFarm.soilType}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Aquaculture Facility</span>
          </span>
        </div>
      )}

      {/* Ponds Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-ocean-900 font-heading">
          Ponds under {activeFarm?.name}
        </h2>

        {farmPonds.length === 0 ? (
          <div className="aqua-card p-12 text-center text-slate-400">
            <Droplets className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-medium">No ponds registered under this farm yet.</p>
            <button
              onClick={() => setShowAddPondModal(true)}
              className="mt-3 px-4 py-2 bg-ocean-700 text-white rounded-xl text-xs font-bold"
            >
              Add First Pond
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {farmPonds.map((pond) => {
              let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              if (pond.status === 'Attention') statusBadge = 'bg-amber-100 text-amber-800 border-amber-200';
              if (pond.status === 'Critical') statusBadge = 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <div key={pond.id} className="aqua-card p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {pond.code}
                        </span>
                        <h3 className="text-sm font-bold text-ocean-900">{pond.name}</h3>
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">
                        {pond.species} • {pond.cultureStage}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusBadge}`}>
                      {pond.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">DOC (Age)</span>
                      <span className="font-bold text-ocean-900">{pond.daysOfCulture} Days</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Est. Biomass</span>
                      <span className="font-bold text-ocean-900">{pond.currentEstimatedBiomassKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Stock Density</span>
                      <span className="font-bold text-ocean-900">{pond.stockingDensityPerSqm}/m²</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">
                      Water Area: <strong className="text-ocean-900">{pond.waterAreaAcres} Acres</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPondId(pond.id);
                        setActiveTab('assessment');
                      }}
                      className="inline-flex items-center gap-1 font-bold text-ocean-600 hover:text-ocean-800 transition"
                    >
                      <span>Assess Pond</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Farm Modal */}
      {showAddFarmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">Register New Farm Facility</h3>
              <button
                onClick={() => setShowAddFarmModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={farmForm.name}
                  onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                  placeholder="e.g. Sri Venkateswara Aqua Farm"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    value={farmForm.village}
                    onChange={(e) => setFarmForm({ ...farmForm, village: e.target.value })}
                    placeholder="e.g. Undi"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">District</label>
                  <input
                    type="text"
                    value={farmForm.district}
                    onChange={(e) => setFarmForm({ ...farmForm, district: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={farmForm.totalAreaAcres}
                    onChange={(e) => setFarmForm({ ...farmForm, totalAreaAcres: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Water Source</label>
                  <select
                    value={farmForm.waterSource}
                    onChange={(e) => setFarmForm({ ...farmForm, waterSource: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  >
                    <option value="Canal">Canal</option>
                    <option value="Creek">Creek / Estuary</option>
                    <option value="Borewell">Borewell</option>
                    <option value="River">River</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">CAA Reg Number</label>
                <input
                  type="text"
                  value={farmForm.caaRegistrationNumber}
                  onChange={(e) => setFarmForm({ ...farmForm, caaRegistrationNumber: e.target.value })}
                  placeholder="e.g. CAA/2026/AP/WG/5512"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ocean-700 hover:bg-ocean-800 text-white rounded-xl font-bold"
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pond Modal */}
      {showAddPondModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">Add New Pond to Farm</h3>
              <button
                onClick={() => setShowAddPondModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePond} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Farm *</label>
                <select
                  value={pondForm.farmId}
                  onChange={(e) => setPondForm({ ...pondForm, farmId: e.target.value })}
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pond Name *</label>
                  <input
                    type="text"
                    required
                    value={pondForm.name}
                    onChange={(e) => setPondForm({ ...pondForm, name: e.target.value })}
                    placeholder="e.g. Pond B-2"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pond Code *</label>
                  <input
                    type="text"
                    required
                    value={pondForm.code}
                    onChange={(e) => setPondForm({ ...pondForm, code: e.target.value })}
                    placeholder="e.g. GDA-P4"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Water Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pondForm.waterAreaAcres}
                    onChange={(e) => setPondForm({ ...pondForm, waterAreaAcres: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Species</label>
                  <select
                    value={pondForm.species}
                    onChange={(e) => setPondForm({ ...pondForm, species: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  >
                    <option value="L. vannamei (Whiteleg Shrimp)">L. vannamei (Whiteleg Shrimp)</option>
                    <option value="P. monodon (Black Tiger)">P. monodon (Black Tiger)</option>
                    <option value="Catla & Rohu (Carp)">Catla & Rohu (Carp)</option>
                    <option value="Tilapia">Tilapia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Stocking Date</label>
                  <input
                    type="date"
                    value={pondForm.stockingDate}
                    onChange={(e) => setPondForm({ ...pondForm, stockingDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={pondForm.totalStockCount}
                    onChange={(e) => setPondForm({ ...pondForm, totalStockCount: parseInt(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-ocean-900 font-semibold focus:ring-1 focus:ring-ocean-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPondModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ocean-700 hover:bg-ocean-800 text-white rounded-xl font-bold"
                >
                  Add Pond
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
