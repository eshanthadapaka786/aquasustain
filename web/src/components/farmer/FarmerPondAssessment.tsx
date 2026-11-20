import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScoreGauge } from '../common/ScoreGauge';
import { dataService } from '@aquasustain/shared';
import { AssessmentInput, AssessmentResult } from '@aquasustain/shared';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const FarmerPondAssessment: React.FC = () => {
  const { ponds, selectedPondId, showToast, t } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // Form State
  const [formData, setFormData] = useState<AssessmentInput>({
    pondId: selectedPondId || (ponds[0]?.id ?? 'pond-01'),
    waterTemperatureC: 28.5,
    ph: 7.9,
    dissolvedOxygenMgL: 5.6,
    transparencyCm: 35,
    ammoniaPpm: 0.1,
    nitritePpm: 0.15,
    feedIntakeCondition: 'Normal',
    stockBehaviour: 'Active and Schooling',
    mortalityObservations: 'None',
    waterColor: 'Light Green (Diatom)',
    aerationHoursPerDay: 14,
    wasteSludgeStatus: 'Clean / Skimmed',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof AssessmentInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.pondId) errs.pondId = 'Please select a pond';
      if (formData.aerationHoursPerDay < 0 || formData.aerationHoursPerDay > 24) {
        errs.aerationHoursPerDay = 'Aeration hours must be between 0 and 24';
      }
    } else if (step === 2) {
      if (formData.waterTemperatureC < 15 || formData.waterTemperatureC > 40) {
        errs.waterTemperatureC = 'Temperature must be between 15°C and 40°C';
      }
      if (formData.ph < 5.0 || formData.ph > 11.0) {
        errs.ph = 'pH must be between 5.0 and 11.0';
      }
      if (formData.dissolvedOxygenMgL < 0.5 || formData.dissolvedOxygenMgL > 16.0) {
        errs.dissolvedOxygenMgL = 'Dissolved oxygen must be between 0.5 and 16.0 mg/L';
      }
      if (formData.transparencyCm < 5 || formData.transparencyCm > 120) {
        errs.transparencyCm = 'Transparency must be between 5 and 120 cm';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    if (!validateStep(3)) return;

    try {
      const result = dataService.runAssessment(formData);
      setAssessmentResult(result);
      setCurrentStep(4);
      showToast('Pond Assessment computed successfully', 'success');
    } catch (err) {
      showToast('Assessment evaluation failed', 'error');
    }
  };

  const handleReset = () => {
    setAssessmentResult(null);
    setCurrentStep(1);
  };

  const steps = [
    { num: 1, title: t('stepPondInfo') },
    { num: 2, title: t('stepWaterParams') },
    { num: 3, title: t('stepBiology') },
    { num: 4, title: t('stepReview') },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Description */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-ocean-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4" />
          <span>Diagnostic Decision Engine v1.2</span>
        </div>
        <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
          {t('assessmentTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {t('assessmentSubtitle')}
        </p>

        {/* Multi-step progress indicator */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border transition ${
                  isCurrent
                    ? 'border-ocean-600 bg-ocean-50/50'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-100 bg-slate-50/40 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-ocean-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-semibold truncate ${
                      isCurrent ? 'text-ocean-900 font-bold' : isCompleted ? 'text-emerald-900' : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Pond & Aeration */}
      {currentStep === 1 && (
        <div className="aqua-card p-6 space-y-5 animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-ocean-900 font-heading">
            Pond Selection & Operational Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Active Pond *
              </label>
              <select
                value={formData.pondId}
                onChange={(e) => handleInputChange('pondId', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
              >
                {ponds.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} • DOC {p.daysOfCulture})
                  </option>
                ))}
              </select>
              {errors.pondId && <p className="text-xs text-rose-600 mt-1">{errors.pondId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Daily Aeration Operating Hours *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.aerationHoursPerDay}
                  onChange={(e) => handleInputChange('aerationHoursPerDay', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                  Hours / Day
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Recommended: 12-16 hours for DOC &gt; 45</p>
              {errors.aerationHoursPerDay && <p className="text-xs text-rose-600 mt-1">{errors.aerationHoursPerDay}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Predominant Water Color
              </label>
              <select
                value={formData.waterColor}
                onChange={(e) => handleInputChange('waterColor', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
              >
                <option value="Light Green (Diatom)">Light Green (Diatom - Healthy)</option>
                <option value="Brown / Tea (Healthy Mix)">Brown / Tea (Healthy Plankton Mix)</option>
                <option value="Dark Green (Cyanobacteria/Bloom)">Dark Green (Cyanobacteria / Dense Bloom)</option>
                <option value="Turbid / Muddy Suspended">Turbid / Muddy Suspended Clay</option>
                <option value="Clear / Sterile">Clear / Sterile (Insufficient Plankton)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bottom Sludge & Waste Status
              </label>
              <select
                value={formData.wasteSludgeStatus}
                onChange={(e) => handleInputChange('wasteSludgeStatus', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
              >
                <option value="Clean / Skimmed">Clean / Skimmed (Minimal sludge)</option>
                <option value="Mild organic deposition">Mild organic deposition (Light odor)</option>
                <option value="Heavy black sludge / H2S odor">Heavy black sludge / H2S gas odor</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
            >
              <span>{t('actionNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Water Chemistry */}
      {currentStep === 2 && (
        <div className="aqua-card p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ocean-900 font-heading">
              Water Chemistry & Quality Parameters
            </h2>
            <span className="text-xs text-slate-400">Tested with reliable kits / probes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dissolved Oxygen */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Dissolved Oxygen (DO) *
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">Optimal: 5.0 - 8.5 mg/L</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.dissolvedOxygenMgL}
                  onChange={(e) => handleInputChange('dissolvedOxygenMgL', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">mg/L</span>
              </div>
              {errors.dissolvedOxygenMgL && <p className="text-xs text-rose-600 mt-1">{errors.dissolvedOxygenMgL}</p>}
            </div>

            {/* pH */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Water pH *
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">Optimal: 7.5 - 8.5</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">pH Units</span>
              </div>
              {errors.ph && <p className="text-xs text-rose-600 mt-1">{errors.ph}</p>}
            </div>

            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Water Temperature *
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">Optimal: 26 - 32 °C</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.waterTemperatureC}
                  onChange={(e) => handleInputChange('waterTemperatureC', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">°C</span>
              </div>
              {errors.waterTemperatureC && <p className="text-xs text-rose-600 mt-1">{errors.waterTemperatureC}</p>}
            </div>

            {/* Transparency */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Secchi Disc Transparency *
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">Optimal: 30 - 45 cm</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={formData.transparencyCm}
                  onChange={(e) => handleInputChange('transparencyCm', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">cm</span>
              </div>
              {errors.transparencyCm && <p className="text-xs text-rose-600 mt-1">{errors.transparencyCm}</p>}
            </div>

            {/* Total Ammonia (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Total Ammonia Nitrogen (TAN)
                </label>
                <span className="text-[11px] text-slate-400">Safe: &lt; 0.1 ppm</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.ammoniaPpm ?? ''}
                  onChange={(e) => handleInputChange('ammoniaPpm', parseFloat(e.target.value) || undefined)}
                  placeholder="Optional, e.g. 0.08"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">ppm</span>
              </div>
            </div>

            {/* Nitrite (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nitrite (NO2)
                </label>
                <span className="text-[11px] text-slate-400">Safe: &lt; 0.25 ppm</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.nitritePpm ?? ''}
                  onChange={(e) => handleInputChange('nitritePpm', parseFloat(e.target.value) || undefined)}
                  placeholder="Optional, e.g. 0.15"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">ppm</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('actionPrevious')}</span>
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
            >
              <span>{t('actionNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Biological Health */}
      {currentStep === 3 && (
        <div className="aqua-card p-6 space-y-5 animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-ocean-900 font-heading">
            Biological Indicators & Stock Behaviour
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Feed Intake / Check-Tray Response *
              </label>
              <select
                value={formData.feedIntakeCondition}
                onChange={(e) => handleInputChange('feedIntakeCondition', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
              >
                <option value="Normal">Normal (Trays cleared within scheduled time)</option>
                <option value="Slightly Reduced (-15%)">Slightly Reduced (10-20% leftover in trays)</option>
                <option value="Severely Reduced (-40%)">Severely Reduced (Over 30% leftover in trays)</option>
                <option value="Refusing Feed">Refusing Feed (Trays completely untouched)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Stock Swimming & Surface Behaviour *
              </label>
              <select
                value={formData.stockBehaviour}
                onChange={(e) => handleInputChange('stockBehaviour', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
              >
                <option value="Active and Schooling">Active and Schooling (Normal bottom activity)</option>
                <option value="Surfacing at Dawn / Gaspy">Surfacing at Dawn / Gaspy (Oxygen distress)</option>
                <option value="Lethargic along Edges">Lethargic along Edges (Disease/stress sign)</option>
                <option value="Normal Bottom Feeding">Normal Bottom Feeding</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mortality Observations in Dikes / Bottom *
              </label>
              <select
                value={formData.mortalityObservations}
                onChange={(e) => handleInputChange('mortalityObservations', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-ocean-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-600"
              >
                <option value="None">None (Zero dead shrimp/fish observed)</option>
                <option value="Minimal (<5 observed)">Minimal (&lt;5 isolated specimens in cast-net/dike)</option>
                <option value="Moderate (5-25 observed)">Moderate (5 - 25 specimens; requires attention)</option>
                <option value="Significant (>25 observed)">Significant (&gt;25 specimens; emergency action required)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('actionPrevious')}</span>
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-ocean-800 hover:from-teal-800 hover:to-ocean-900 text-white font-bold text-xs transition shadow-md"
            >
              <Sparkles className="w-4 h-4 text-mint" />
              <span>{t('actionSubmit')}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Assessment Results View */}
      {currentStep === 4 && assessmentResult && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Card with Score Gauge */}
          <div className="aqua-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-ocean-700 border border-teal-200">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Diagnostic Assessment Complete • {assessmentResult.ruleVersion}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-ocean-900 font-heading">
                {assessmentResult.pondName}
              </h2>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Evaluated against Coastal Aquaculture Authority and benchmark tropical aquaculture thresholds.
              </p>
              <div className="text-[11px] text-slate-400">
                Assessment Timestamp: {new Date(assessmentResult.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <ScoreGauge
                score={assessmentResult.overallScore}
                status={assessmentResult.status}
                size={160}
                label="Overall Pond Score"
              />
            </div>
          </div>

          {/* Parameter Evaluations Table */}
          <div className="aqua-card p-6">
            <h3 className="text-base font-bold text-ocean-900 font-heading mb-4">
              Water Chemistry & Parameter Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Parameter</th>
                    <th className="pb-3">Measured Value</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Impact Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* DO */}
                  <tr>
                    <td className="py-3 font-bold text-ocean-900">Dissolved Oxygen</td>
                    <td className="py-3 font-semibold">
                      {assessmentResult.parameterEvaluations.dissolvedOxygen.value} mg/L
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          assessmentResult.parameterEvaluations.dissolvedOxygen.status === 'Optimal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {assessmentResult.parameterEvaluations.dissolvedOxygen.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {assessmentResult.parameterEvaluations.dissolvedOxygen.message}
                    </td>
                  </tr>

                  {/* pH */}
                  <tr>
                    <td className="py-3 font-bold text-ocean-900">Water pH</td>
                    <td className="py-3 font-semibold">
                      {assessmentResult.parameterEvaluations.ph.value}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          assessmentResult.parameterEvaluations.ph.status === 'Optimal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {assessmentResult.parameterEvaluations.ph.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {assessmentResult.parameterEvaluations.ph.message}
                    </td>
                  </tr>

                  {/* Temperature */}
                  <tr>
                    <td className="py-3 font-bold text-ocean-900">Temperature</td>
                    <td className="py-3 font-semibold">
                      {assessmentResult.parameterEvaluations.temperature.value} °C
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800">
                        {assessmentResult.parameterEvaluations.temperature.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {assessmentResult.parameterEvaluations.temperature.message}
                    </td>
                  </tr>

                  {/* Transparency */}
                  <tr>
                    <td className="py-3 font-bold text-ocean-900">Secchi Transparency</td>
                    <td className="py-3 font-semibold">
                      {assessmentResult.parameterEvaluations.transparency.value} cm
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800">
                        {assessmentResult.parameterEvaluations.transparency.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {assessmentResult.parameterEvaluations.transparency.message}
                    </td>
                  </tr>

                  {/* Ammonia (if measured) */}
                  {assessmentResult.parameterEvaluations.ammonia && (
                    <tr>
                      <td className="py-3 font-bold text-ocean-900">Total Ammonia (TAN)</td>
                      <td className="py-3 font-semibold">
                        {assessmentResult.parameterEvaluations.ammonia.value} ppm
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            assessmentResult.parameterEvaluations.ammonia.status === 'Optimal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {assessmentResult.parameterEvaluations.ammonia.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {assessmentResult.parameterEvaluations.ammonia.message}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Limiting Factors Card */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>{t('factorsLimitingScore')}</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-xs text-amber-950 font-medium">
              {assessmentResult.limitingFactors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>

          {/* Actionable Practical Recommendations */}
          <div className="aqua-card p-6 space-y-4">
            <h3 className="text-base font-bold text-ocean-900 font-heading">
              {t('practicalRecs')}
            </h3>

            {assessmentResult.recommendations.length === 0 ? (
              <p className="text-xs text-emerald-700 font-medium">
                Pond parameters and biological indicators are balanced. Maintain routine aeration and check-tray protocol.
              </p>
            ) : (
              <div className="space-y-4">
                {assessmentResult.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-ocean-500/50 transition space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            rec.priority === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                        <span className="text-xs font-bold text-ocean-800">{rec.title}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{rec.category}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rec.description}</p>

                    {/* Why this matters explanation */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
                      <span className="font-bold text-ocean-900 block mb-0.5">Scientific Rationale:</span>
                      {rec.whyThisMatters}
                    </div>

                    {/* Actionable Steps checklist */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Action Steps:
                      </span>
                      <ul className="space-y-1 pl-5 list-disc text-xs text-slate-700">
                        {rec.actionableSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-up steps and disclaimer */}
          <div className="aqua-card p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('followUpActions')}
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              {assessmentResult.suggestedFollowUps.map((action, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <span>{assessmentResult.disclaimer}</span>
            </div>
          </div>

          {/* New Assessment Button */}
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Perform Another Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
