# Farm Plant Health Dashboard (Frontend)

This is a minimal Vite + React + TypeScript scaffold for the Farm Plant Health Dashboard UI.

Features included in this scaffold:
- Overview panel with summary cards, pie chart and trend line (using Recharts)
- Sortable/filterable plant table with search and detail dialog
- Alerts panel listing plants needing attention
- Data upload placeholder (CSV / manual entry)
- Sample mock data at `src/data/plants.json`

Getting started:
1. Install Node.js (>= 18 recommended).
2. From this `frontend/` folder run:

```powershell
npm install
npm run dev
```

Open the dev server URL printed by Vite (usually http://localhost:5173).

Notes and next steps:
- [x] Scaffold core dashboard layout with overview cards, table, alerts, and upload placeholder.
- [ ] Add a Map View with `react-leaflet`, clustered markers, and color-coded pins.
- [ ] Wire CSV import using `papaparse` to preview and batch insert records.
- [ ] Integrate email/SMS notifications via a provider (e.g., Twilio, SendGrid).
- [ ] Connect action buttons to a real backend API for persistence.
- [ ] Add automated tests (React Testing Library) and CI workflows to guard builds.                                                                                                 <img width="1308" height="592" alt="Image" src="https://github.com/user-attachments/assets/34ae493a-e7d4-4c81-9ab5-c67a11ef1c46" />
