export const PALETTE = {
  primary: {
    deepOcean: '#123B4A',
    aquaTeal: '#168C83',
    darkTeal: '#105F5A',
  },
  secondary: {
    seafoam: '#DDF3EC',
    freshMint: '#A9DCC8',
    sand: '#F5F1E8',
    white: '#FFFFFF',
  },
  status: {
    success: '#24845B',
    warning: '#D99A38',
    danger: '#D96C64',
    neutral: '#64748B',
  },
  surface: {
    background: '#F8FAF9',
    card: '#FFFFFF',
    border: '#E2E8F0',
    borderSubtle: '#EEF2F6',
    hover: '#F1F7F5',
  },
} as const;

export const TYPOGRAPHY = {
  fontHeading: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontBody: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontTelugu: '"Noto Sans Telugu", "Gautami", "Vani", sans-serif',
  fontHindi: '"Noto Sans Devanagari", "Mangal", sans-serif',
} as const;

// Realistic Aquaculture parameter thresholds for Coastal Penaeus vannamei & freshwater carp culture (Demo/Prototype Rules v1.2)
export const WATER_QUALITY_GUIDELINES = {
  dissolvedOxygen: {
    unit: 'mg/L',
    optimalMin: 5.0,
    optimalMax: 8.5,
    warningLow: 4.0,
    criticalLow: 3.0,
    explanation: 'Dissolved Oxygen is vital for shrimp respiration and nitrifying bacteria in bottom soil.',
  },
  ph: {
    unit: 'pH',
    optimalMin: 7.5,
    optimalMax: 8.5,
    warningMin: 7.0,
    warningMax: 9.0,
    explanation: 'pH regulates ammonia toxicity and carbon dioxide equilibrium in aquaculture water.',
  },
  temperature: {
    unit: '°C',
    optimalMin: 26.0,
    optimalMax: 32.0,
    warningMin: 23.0,
    warningMax: 34.0,
    explanation: 'Metabolism and feeding activity double every 10°C increase within physiological limits.',
  },
  transparency: {
    unit: 'cm',
    optimalMin: 30.0,
    optimalMax: 45.0,
    warningMin: 20.0,
    warningMax: 60.0,
    explanation: 'Secchi disc transparency indicates plankton density and water productivity.',
  },
  ammonia: {
    unit: 'ppm (mg/L)',
    optimalMax: 0.1,
    warningMax: 0.5,
    criticalMax: 1.0,
    explanation: 'Un-ionized ammonia (NH3) damages shrimp gill lamellae and suppresses immunity.',
  },
  nitrite: {
    unit: 'ppm (mg/L)',
    optimalMax: 0.25,
    warningMax: 1.0,
    criticalMax: 2.0,
    explanation: 'Nitrite oxidizes shrimp hemocyanin, decreasing oxygen transport in hemolymph.',
  },
  salinity: {
    unit: 'ppt',
    optimalMin: 12.0,
    optimalMax: 25.0,
    explanation: 'Optimal osmotic pressure supports healthy shell moulting and osmoregulation.',
  },
  alkalinity: {
    unit: 'ppm CaCO3',
    optimalMin: 100.0,
    optimalMax: 160.0,
    explanation: 'Alkalinity buffers diurnal pH swings and supports microalgae photosynthesis.',
  },
} as const;
