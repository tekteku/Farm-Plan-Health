# 🚀 Supabase Backend Setup Guide

## Step-by-Step Instructions

### Step 1: Create Supabase Account & Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up** (or log in if you have an account)
3. **Click "New Project"**
   - Organization: Select or create one
   - Name: `farm-health-dashboard` (or any name you prefer)
   - Database Password: **Save this password securely!**
   - Region: Choose closest to you
   - Pricing Plan: **Free tier is perfect for this project**
4. **Click "Create new project"** and wait ~2 minutes for setup

---

### Step 2: Run Database Schema

1. **In your Supabase dashboard**, click **"SQL Editor"** in the left sidebar
2. **Click "New query"**
3. **Copy the entire contents** of `supabase-schema.sql` from your project
4. **Paste it** into the SQL Editor
5. **Click "Run"** (or press Ctrl+Enter)
6. ✅ You should see success messages like "Success. No rows returned"

**What this creates:**
- ✅ 6 tables (plants, photos, diagnoses, health_snapshots, farm_metrics, sensor_readings)
- ✅ Sample data (5 plants, 6 health snapshots, performance metrics)
- ✅ Indexes for fast queries
- ✅ Row Level Security policies
- ✅ Auto-update triggers

---

### Step 3: Create Storage Bucket

1. **Click "Storage"** in the left sidebar
2. **Click "New bucket"**
3. **Bucket name**: `plant-photos`
4. **Public bucket**: ✅ Check this box (so uploaded photos are accessible)
5. **Click "Create bucket"**

**Optional: Configure bucket policies**
1. Click on the `plant-photos` bucket
2. Go to "Policies" tab
3. Add policies for insert/select/update if needed (default public bucket works for demo)

---

### Step 4: Get Your API Credentials

1. **Click "Settings"** in the left sidebar (bottom)
2. **Click "API"** under Project Settings
3. **Copy these values:**
   - **Project URL** (looks like: https://xxxxxxxxxxxxx.supabase.co)
   - **anon public** key (long string under "Project API keys")

---

### Step 5: Configure Your Project

1. **In your project folder**, create a file called `.env` (no extension, starts with a dot)
2. **Paste this content** and replace with your actual values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```bash
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI...
```

**⚠️ IMPORTANT:**
- Never commit `.env` to Git (it's already in `.gitignore`)
- Keep your keys private

---

### Step 6: Switch to Real API

Now we need to update your code to use the real Supabase API instead of mock data.

**I'll do this for you automatically, or you can:**

1. Update imports in components:
   - Change `from './api/mockApi'` to `from './api/supabaseApi'`
   - Files to update: `App.tsx`, `DataUpload.tsx`, `PlantDetail.tsx`

---

### Step 7: Restart Development Server

1. **Stop the current server** (Ctrl+C in terminal)
2. **Restart it:**
```powershell
npm run dev
```

3. **Open http://localhost:5173**

---

### Step 8: Test Everything

#### Test 1: View Plants
- ✅ You should see 5 sample plants in the table
- ✅ Click any plant to see details

#### Test 2: Upload Photos
1. Scroll to "Data Upload" section
2. Drag and drop an image (or click to select)
3. Select a plant from dropdown
4. Click "Upload & Get AI Diagnosis"
5. ✅ Photos should upload to Supabase Storage
6. ✅ AI diagnosis modal should open

#### Test 3: Health Timeline
1. Click any plant in the table
2. Go to "Health Timeline" tab
3. ✅ You should see 6 snapshots with photos
4. ✅ Use slider to navigate through time
5. ✅ Click "Compare Photos" to see before/after

#### Test 4: Performance Dashboard
1. Look at header - click "Score: 87/100" chip
2. ✅ Dashboard should expand showing badges and metrics
3. ✅ Some badges earned, some in progress

---

## Troubleshooting

### Problem: "Invalid API key" error
**Solution:** Double-check your `.env` file has correct URL and key

### Problem: "Storage bucket not found"
**Solution:** Make sure you created the `plant-photos` bucket in Supabase Storage

### Problem: "Table does not exist"
**Solution:** Re-run the `supabase-schema.sql` in SQL Editor

### Problem: Photos not uploading
**Solution:** 
1. Check bucket is public
2. Check bucket name is exactly `plant-photos`
3. Check browser console for specific error

### Problem: No sample data showing
**Solution:** Run just the INSERT statements from `supabase-schema.sql` again

---

## Verify Your Setup

Run these queries in Supabase SQL Editor to verify:

```sql
-- Check plants exist
SELECT COUNT(*) FROM plants;
-- Should return: 5

-- Check health snapshots exist  
SELECT COUNT(*) FROM health_snapshots;
-- Should return: 6

-- Check farm metrics exist
SELECT COUNT(*) FROM farm_metrics;
-- Should return: 1

-- Check storage bucket
SELECT * FROM storage.buckets WHERE name = 'plant-photos';
-- Should return: 1 row
```

---

## Database Schema Overview

### Tables Created:

1. **plants** - Main plant records
2. **photos** - Photo metadata and URLs
3. **diagnoses** - AI diagnosis results
4. **health_snapshots** - Timeline data (NEW!)
5. **farm_metrics** - Performance dashboard data (NEW!)
6. **sensor_readings** - IoT sensor data

### Sample Data Inserted:

- 5 plants (various health statuses)
- 6 health snapshots for first plant (showing recovery from 40% to 90%)
- 1 farm metrics record (score 87, grade A, 8 badges, 3 achievements)

---

## Next Steps After Setup

1. ✅ Test all features work with real database
2. ✅ Try uploading real photos
3. ✅ Add more plants using the app
4. ✅ Customize sample data to match your demo scenario
5. ✅ Practice your demo script

---

## Advanced: Customize Sample Data

Want to change the sample plants or metrics? Run custom SQL:

```sql
-- Add a new plant
INSERT INTO plants (name, type, health, notes) VALUES
('My Custom Plant', 'Basil', 'healthy', 'Looking great!');

-- Update farm score
UPDATE farm_metrics 
SET overall_score = 95, weekly_grade = 'A+'
WHERE id = (SELECT id FROM farm_metrics LIMIT 1);

-- Add a health snapshot
INSERT INTO health_snapshots (plant_id, timestamp, health, photo_url, ai_analysis, notes)
VALUES (
  (SELECT id FROM plants WHERE name = 'Tomato Plant A' LIMIT 1),
  NOW(),
  'healthy',
  'https://picsum.photos/600/400',
  '{"leafColor": "Dark green", "diseaseIndicators": [], "healthScore": 95, "confidence": 98}'::jsonb,
  'Perfect conditions!'
);
```

---

## Security Note

For production, you should:
- [ ] Enable Row Level Security with proper policies
- [ ] Add authentication (Supabase Auth)
- [ ] Restrict bucket access to authenticated users
- [ ] Add rate limiting
- [ ] Use service role key for admin operations

For portfolio/demo purposes, the current public setup is fine!

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Check browser console for errors
- Check Supabase logs: Dashboard → Logs
- Verify API key and URL are correct

---

## Success Checklist ✅

- [ ] Supabase project created
- [ ] SQL schema executed successfully
- [ ] Storage bucket `plant-photos` created
- [ ] `.env` file created with credentials
- [ ] Code updated to use supabaseApi
- [ ] Dev server restarted
- [ ] Can see 5 sample plants
- [ ] Can view health timeline
- [ ] Can see performance dashboard
- [ ] Photos upload successfully

**If all checkboxes are checked, you're ready to demo!** 🎉
