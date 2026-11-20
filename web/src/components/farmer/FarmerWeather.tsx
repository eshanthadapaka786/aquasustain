import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CloudSun,
  Wind,
  Droplets,
  Gauge,
  CloudRain,
  Sun,
  AlertTriangle,
  Info,
  Compass,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const FarmerWeather: React.FC = () => {
  const { weather, language, showToast, t } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshWeather = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Weather telemetric adapter synchronized', 'info');
    }, 600);
  };

  const { current, forecast, advisories } = weather;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-ocean-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4" />
            <span>Coastal Agro-Climatic Station</span>
          </div>
          <h1 className="text-2xl font-extrabold text-ocean-900 font-heading">
            {t('weatherTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live telemetry for {weather.location}, {weather.state} • Synced as of {new Date(weather.asOf).toLocaleTimeString()}
          </p>
        </div>

        <button
          onClick={handleRefreshWeather}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-ocean-900 font-bold text-xs transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Forecast</span>
        </button>
      </div>

      {/* Current Conditions Card */}
      <div className="bg-gradient-to-tr from-ocean-800 to-ocean-700 rounded-2xl p-6 text-white shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Temperature & Condition */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <CloudSun className="w-12 h-12 text-mint" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold font-heading">
                {current.tempC}°<span className="text-2xl font-normal text-ocean-200">C</span>
              </div>
              <div className="text-sm font-semibold text-ocean-100 mt-1">
                {current.condition}
              </div>
              <div className="text-xs text-ocean-200 mt-0.5">
                Feels like {current.feelsLikeC}°C
              </div>
            </div>
          </div>

          {/* Meteorological Parameters */}
          <div className="grid grid-cols-2 gap-4 border-y md:border-y-0 md:border-x border-white/15 py-4 md:py-0 md:px-6">
            <div>
              <span className="text-[11px] text-ocean-200 block">{t('humidityLabel')}</span>
              <span className="text-lg font-bold font-heading">{current.humidityPercent}%</span>
            </div>
            <div>
              <span className="text-[11px] text-ocean-200 block">{t('windLabel')}</span>
              <span className="text-lg font-bold font-heading">{current.windSpeedKmh} km/h</span>
              <span className="text-[10px] text-ocean-300 block">{current.windDirection}</span>
            </div>
            <div>
              <span className="text-[11px] text-ocean-200 block">{t('rainfallLabel')}</span>
              <span className="text-lg font-bold font-heading">{current.rainfall24hMm} mm</span>
            </div>
            <div>
              <span className="text-[11px] text-ocean-200 block">{t('pressureLabel')}</span>
              <span className="text-lg font-bold font-heading">{current.barometricPressureHpa} hPa</span>
            </div>
          </div>

          {/* Real-time Aquaculture Warning */}
          <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-mint">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pond Micro-Climate Impact</span>
            </div>
            <p className="text-ocean-100 leading-relaxed text-[11px]">
              High humidity ({current.humidityPercent}%) limits atmospheric evaporation. Ensure nighttime aerators maintain minimum 14 RPM impeller speed.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      <div className="aqua-card p-5 space-y-3">
        <h3 className="text-base font-bold text-ocean-900 font-heading">
          {t('forecast7Day')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col items-center text-center space-y-2 hover:border-ocean-500/40 transition"
            >
              <span className="text-xs font-bold text-ocean-900">{day.dayLabel}</span>
              <span className="text-[10px] text-slate-400">{day.date}</span>

              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs">
                {day.rainProbabilityPercent > 50 ? (
                  <CloudRain className="w-5 h-5 text-blue-600" />
                ) : (
                  <CloudSun className="w-5 h-5 text-amber-500" />
                )}
              </div>

              <div className="text-xs font-bold text-ocean-900">
                {day.maxTempC}° <span className="text-slate-400 font-normal">/ {day.minTempC}°</span>
              </div>

              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {day.rainProbabilityPercent}% Rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Aquaculture Impact Advisories */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-ocean-900 font-heading">
          Expert Coastal Weather Advisories & Farm Guidelines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advisories.map((adv) => {
            const title = adv.title[language] || adv.title.en;
            const msg = adv.message[language] || adv.message.en;
            const impact = adv.aquacultureImpact[language] || adv.aquacultureImpact.en;

            return (
              <div
                key={adv.id}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                      {adv.severity} Advisory
                    </span>
                    <span className="text-xs font-bold text-amber-950">{title}</span>
                  </div>
                </div>

                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {msg}
                </p>

                <div className="p-3 rounded-xl bg-white/80 border border-amber-200/80 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-ocean-900 block">{t('advisoryImpact')}:</span>
                  <p className="text-[11px] leading-relaxed">{impact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
