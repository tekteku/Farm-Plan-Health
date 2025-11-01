# 🚀 Quick Start - Backend Setup (10 Minutes)

## Your backend is READY with comprehensive mock data!

---

## What You Have Now:

✅ **Enhanced Database Schema** (`supabase-schema.sql`)
- 10 diverse plants with different health statuses
- 14 health snapshots across 3 plants showing:
  - **Tomato:** Recovery story (40% → 90% health)
  - **Corn:** Declining health (85% → 55%)
  - **Pepper:** Critical condition with treatment
- 1 farm metrics record (Score: 87/100, 8 badges, 3 achievements)

✅ **Complete API Layer** (`src/api/supabaseApi.ts`)
- All CRUD operations implemented
- Photo upload to Supabase Storage
- Timeline data fetching
- Performance metrics tracking

✅ **Setup Documentation**
- Step-by-step Supabase setup guide
- Testing checklist (15 test cases)
- Environment configuration template

---

## 🎯 Your Next 3 Steps:

### Step 1: Set Up Supabase (5 mins)
```bash
# Follow: BACKEND_SETUP_COMPLETE_GUIDE.md
# Quick summary:
1. Create account at supabase.com
2. Create new project "farm-health-dashboard"
3. Run supabase-schema.sql in SQL Editor
4. Create "plant-photos" storage bucket (public)
5. Copy URL + anon key
```

### Step 2: Configure Environment (1 min)
```bash
# Create .env file in project root:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Switch to Real Backend (1 min)
```bash
# Option A: Use script
node switch-api.js supabase

# Option B: Manual (update 3 files)
# Change in src/App.tsx, src/components/PlantDetail.tsx, src/components/DataUpload.tsx:
# FROM: import { ... } from './api/mockApi';
# TO:   import { ... } from './api/supabaseApi';

# Restart dev server
npm run dev
```

---

## ✅ Test Everything Works:

```bash
# Open http://localhost:5173

# Should see:
✅ 10 plants in table
✅ Click "Tomato Plant A" → Health Timeline tab → 6 snapshots
✅ Click "Score: 87/100" chip → Performance dashboard
✅ Upload photo → Goes to Supabase Storage
✅ Refresh page (F5) → Data persists!
```

---

## 📚 Documentation Files:

| File | Purpose |
|------|---------|
| `BACKEND_SETUP_COMPLETE_GUIDE.md` | Complete step-by-step setup (10 min) |
| `TESTING_CHECKLIST.md` | 15 test cases to verify everything |
| `supabase-schema.sql` | Database structure + 10 plants + 14 snapshots |
| `.env.example` | Template for credentials |
| `switch-api.js` | Script to switch mock ↔ supabase |

---

## 🎓 What You Can Tell Recruiters:

**"I built a full-stack farm management dashboard with:**
- ✅ React + TypeScript frontend
- ✅ PostgreSQL database (Supabase)
- ✅ RESTful API integration
- ✅ Cloud storage for photos
- ✅ Health timeline with photo comparison (40% → 90% recovery)
- ✅ Gamification dashboard (badges, achievements, ROI)
- ✅ Real-time data persistence"

---

## 🐛 If Something Breaks:

```bash
# Check these:
1. .env file exists with correct values
2. Supabase project is active (not paused)
3. SQL script ran without errors
4. plant-photos bucket created and PUBLIC
5. Dev server restarted after changing .env
6. Browser console (F12) for error messages
```

---

## 🎉 You're All Set!

**Next:** Follow `BACKEND_SETUP_COMPLETE_GUIDE.md` → 10 minutes → Full backend ready!

**Then:** Run through `TESTING_CHECKLIST.md` → Verify all 15 tests → Show recruiters!

---

**Questions?** Check browser console (F12) or Supabase Dashboard > Logs
