import React from 'react';

interface ScoreGaugeProps {
  score: number;
  status: 'Optimal' | 'Good' | 'Moderate' | 'Critical';
  size?: number;
  label?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, status, size = 160, label }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 240 degree arc for gauge look
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#24845B'; // success
  let bgColor = '#DDF3EC';
  let statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (status === 'Good') {
    strokeColor = '#168C83'; // teal
    bgColor = '#E6F6F4';
    statusBadgeClass = 'bg-teal-100 text-teal-800 border-teal-300';
  } else if (status === 'Moderate') {
    strokeColor = '#D99A38'; // warning
    bgColor = '#FEF3C7';
    statusBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (status === 'Critical') {
    strokeColor = '#D96C64'; // danger
    bgColor = '#FEE2E2';
    statusBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300';
  }

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-ocean-800 font-heading">
            {score}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className={`inline-block px-3 py-0.5 text-xs font-bold rounded-full border ${statusBadgeClass}`}>
          {status} Health
        </span>
        {label && <p className="text-xs text-slate-500 mt-1">{label}</p>}
      </div>
    </div>
  );
};
