# 🎯 Supabase Quick Reference

## Your Next Steps

### 1. Create Supabase Account (5 minutes)
1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project: `farm-plant-health`
4. Save your database password!

### 2. Set Up Database (2 minutes)
1. Open **SQL Editor** in Supabase dashboard
2. Copy all content from `supabase-schema.sql`
3. Paste and click **Run**
4. ✅ Check **Table Editor** - you should see 4 tables with sample data

### 3. Create Storage Bucket (1 minute)
1. Go to **Storage** in Supabase
2. Click **New bucket**
3. Name: `plant-photos`
4. ✅ Check "Public bucket"
5. Click **Create**

### 4. Get Your Credentials (1 minute)
1. Go to **Settings** → **API**
2. Copy **Project URL** (e.g., `https://abc123.supabase.co`)
3. Copy **anon public** key (starts with `eyJ...`)

### 5. Update Your .env File
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Switch to Supabase API

**Option A: Update imports in `DataUpload.tsx`**
```typescript
// Change line 8:
import { uploadImages, fetchPlants } from '../api/mockApi';

// To:
import { uploadImagesToSupabase as uploadImages, fetchPlantsFromSupabase as fetchPlants } from '../api/supabaseApi';
```

**Option B: Update imports in `App.tsx`**
```typescript
// Change line 13:
import { fetchPlants } from './api/mockApi'

// To:
import { fetchPlants } from './api/supabaseApi'
```

### 7. Test It!
```bash
npm run dev
```

Then:
- ✅ Dashboard should show 5 sample plants from Supabase
- ✅ Upload a photo → check Supabase Storage
- ✅ Check `photos` table in Table Editor

---

## 🔑 Key Files Created

| File | Purpose |
|------|---------|
| `src/api/supabaseClient.ts` | Supabase connection config |
| `src/api/supabaseApi.ts` | API functions (fetch plants, upload photos) |
| `supabase-schema.sql` | Database schema to run in SQL Editor |
| `SUPABASE_SETUP.md` | Detailed setup guide |
| `.env.example` | Template for credentials |
| `.env` | Your actual credentials (NOT in git) |

---

## 🚀 What You Can Do Now

### Fetch Plants
```typescript
import { fetchPlantsFromSupabase } from './api/supabaseApi'

const plants = await fetchPlantsFromSupabase()
```

### Upload Photos
```typescript
import { uploadImagesToSupabase } from './api/supabaseApi'

const results = await uploadImagesToSupabase(files, plantId)
```

### Update Plant Health
```typescript
import { updatePlantHealth } from './api/supabaseApi'

await updatePlantHealth(plantId, 'healthy', 'Looking great!')
```

### Save Diagnosis
```typescript
import { createDiagnosis } from './api/supabaseApi'

await createDiagnosis(plantId, photoIds, diagnosis, recommendations, 87)
```

---

## 📊 Database Tables

### `plants`
- id, name, type, health, location, notes, last_checked

### `photos`
- id, plant_id, s3_url, file_size, exif_data, uploaded_at

### `diagnoses`
- id, plant_id, photo_ids, diagnosis, recommendations, confidence_score

### `sensor_readings`
- id, plant_id, reading_type, value, unit, recorded_at

---

## 🎨 Sample Data Included

- 5 plants with different health statuses
- Ready to test photo upload
- Ready to test AI diagnosis

---

## 🐛 Quick Troubleshooting

**"Invalid API key"**
→ Check `.env` file, restart dev server

**"Table not found"**
→ Run `supabase-schema.sql` in SQL Editor

**Photos not uploading**
→ Create `plant-photos` bucket, make it public

**CORS errors**
→ Check Supabase URL in `.env` is correct

---

## 📚 Full Documentation

- **Setup Guide**: `SUPABASE_SETUP.md`
- **Supabase Docs**: https://supabase.com/docs
- **JS Client Docs**: https://supabase.com/docs/reference/javascript

---

## ✅ Current Status

- ✅ Supabase client installed
- ✅ API functions created
- ✅ Database schema ready
- ✅ Setup guide written
- ✅ All pushed to GitHub

**Next**: Follow the 7 steps above to activate Supabase! 🎉
