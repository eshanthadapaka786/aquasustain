# AquaSustain — Smart Aquaculture. Better Pond Management.

AquaSustain is a production-quality, trilingual aquaculture farm management and sustainability support platform built as a Community Service Project (CSP) for coastal and inland fish and shrimp producers.

---

## 🌊 Project Vision & Scope

AquaSustain equips smallholder aquaculture farmers with modern decision support:
1. **Pond Health Assessment Engine:** Versioned diagnostic rule engine evaluating diurnal DO fluctuations, pH, ammonia, feed response, and pond sludge to compute transparent health scores and actionable practical interventions.
2. **Water Quality Telemetry:** Track diurnal oxygen cycles, Secchi transparency, salinity, and nitrogenous toxins.
3. **Feed & FCR Optimization:** Calibrate feed rations using check-tray consumption feedback to reduce feed waste (saving up to ₹1.2 Lakhs/crop).
4. **Farm Accounting:** Track operational expenditure across Feed, Energy, Post-Larvae Seed, Probiotics, and Labour.
5. **Knowledge Hub:** Peer-reviewed practical aquaculture guides in **Telugu**, **English**, and **Hindi**.
6. **Coastal Agro-Climatic Weather Service:** 5-day forecasts and biological impact advisories for pond micro-climates.
7. **Tri-Role Experience:** Dedicated portals for **Farmers**, **Platform Administrators**, and **Project Evaluators**.

---

## 🎨 Design System

- **Primary Colors:**
  - Deep Ocean: `#123B4A`
  - Aqua Teal: `#168C83`
  - Dark Teal: `#105F5A`
- **Secondary Colors:**
  - Seafoam: `#DDF3EC`
  - Fresh Mint: `#A9DCC8`
  - Sand: `#F5F1E8`
  - White: `#FFFFFF`
- **Status Indicators:**
  - Success: `#24845B`
  - Warning: `#D99A38`
  - Danger: `#D96C64`
  - Neutral: `#64748B`
- **Typography:**
  - Headings: Manrope
  - Body: Inter
  - Multilingual: Noto Sans Telugu, Noto Sans Devanagari

---

## 📁 Repository Structure

```
csp frontend/
├── shared/                       # Shared domain models, rules engine, translations, and services
│   ├── src/
│   │   ├── types/                # Core domain types (Farm, Pond, WaterQuality, Feed, Assessment)
│   │   ├── constants/            # Design tokens & aquaculture thresholds
│   │   ├── business-logic/       # Pond Assessment Engine (v1.2.0-field-prototype)
│   │   ├── translations/         # Full localization dictionaries (en, te, hi)
│   │   ├── mock/                 # Calibrated seed data (farms, diurnal readings, feed, weather)
│   │   └── services/             # Supabase-ready mock service layer (dataService)
│   └── package.json
├── web/                          # Production React + Vite + Tailwind + Lucide + Recharts Web App
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Sidebar, ScoreGauge, ToastContainer
│   │   │   ├── farmer/           # 10 Farmer screens (Dashboard, Assessments, Water, Feed, Expenses, etc.)
│   │   │   ├── admin/            # Administrator command center (KPIs, Audit logs, Rule matrix)
│   │   │   └── evaluator/        # Academic evaluation console (Module coverage, Rubric checklist)
│   │   ├── context/              # AppContext with reactive subscriptions & role switcher
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
├── mobile/                       # Expo React Native Android Application
│   ├── src/
│   │   ├── screens/              # Farmer screens adapted for Android phones & tablets
│   │   ├── navigation/           # Tab & Stack navigators
│   │   └── theme/                # Native shared color tokens
│   ├── App.tsx
│   ├── app.json
│   └── package.json
└── package.json                  # Root orchestrator
```

---

## 🚀 Running the Web Application

To run the web application locally:

```bash
cd web
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

---

## 📱 Running the Mobile Android Application

```bash
cd mobile
npm install
npm start
```

---

## 🔒 Target Backend Integration (Supabase)

All frontend components communicate with `dataService`, which mirrors Supabase JavaScript client methods. When credentials are provided, migrating simply entails swapping the localStorage persistence with:

```typescript
const { data, error } = await supabase.from('water_readings').insert(readingData);
```
