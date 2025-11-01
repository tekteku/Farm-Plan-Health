# Testing Checklist - Farm Health Dashboard Backend

## 🧪 Complete Testing Guide After Backend Setup

Use this checklist to verify everything works correctly with your Supabase backend.

---

## ✅ Pre-Testing Setup Verification

Before testing, confirm:

- [ ] Supabase project created and active
- [ ] `supabase-schema.sql` executed in Supabase SQL Editor
- [ ] `plant-photos` storage bucket created (public)
- [ ] `.env` file created with correct credentials
- [ ] API imports switched to `supabaseApi` in:
  - [ ] `src/App.tsx`
  - [ ] `src/components/PlantDetail.tsx`
  - [ ] `src/components/DataUpload.tsx`
- [ ] Development server restarted (`npm run dev`)

---

## 🧪 Test Cases

### Test 1: Database Connection ✅
**Goal:** Verify app connects to Supabase

**Steps:**
1. Open http://localhost:5173
2. Open browser console (F12)
3. Check for any error messages

**Expected Result:**
- ✅ No connection errors in console
- ✅ Plants table loads without errors

**If fails:**
- Check `.env` file has correct URL and key
- Verify no spaces in `.env` values
- Check Supabase project is active (not paused)

---

### Test 2: Fetch Plants ✅
**Goal:** Load plant data from database

**Steps:**
1. Open http://localhost:5173
2. Wait for table to load (loading spinner should appear briefly)

**Expected Result:**
- ✅ See **10 plants** in the table:
  1. Tomato Plant A (healthy, green chip)
  2. Corn Stalk 12 (needs-check, orange chip)
  3. Pepper Plant B (unhealthy, red chip)
  4. Lettuce Bed 3 (healthy)
  5. Strawberry 5 (needs-check)
  6. Cucumber Vine C (healthy)
  7. Carrot Row 7 (healthy)
  8. Bean Plant 14 (needs-check)
  9. Zucchini Z1 (healthy)
  10. Potato Field P3 (unhealthy)

**If fails:**
- Check Supabase Table Editor > plants (should have 10 rows)
- Re-run `supabase-schema.sql`
- Check browser console for API errors

---

### Test 3: Health Timeline Feature ✅
**Goal:** Verify timeline loads historical health data

**Steps:**
1. Click on **"Tomato Plant A"** row (first row)
2. Modal should open
3. Click **"Health Timeline"** tab
4. Wait for timeline to load

**Expected Result:**
- ✅ Timeline shows **6 snapshots**
- ✅ Dates span 15 days (oldest to newest)
- ✅ Health scores show improvement: 40% → 50% → 60% → 70% → 80% → 90%
- ✅ Timeline scrubber works (drag left/right)
- ✅ Photos change as you scrub
- ✅ Before/After slider appears when comparing snapshots
- ✅ Treatment notes visible on relevant snapshots:
  - "Applied nitrogen-rich fertilizer (10-10-10)"
  - "Adjusted watering schedule to 2x daily"
- ✅ AI Analysis shows:
  - Leaf color changes (Yellow-green → Vibrant green)
  - Disease indicators
  - Confidence scores (85%-95%)
- ✅ Sensor data displays:
  - Soil moisture (45% → 70%)
  - Temperature (22°C → 24.5°C)
  - Humidity (60% → 70%)

**If fails:**
- Check Supabase Table Editor > health_snapshots (should have 14 rows)
- Verify plant_id matches first plant in plants table
- Check console for fetchHealthSnapshots errors

---

### Test 4: Corn Plant Timeline (Declining Health) ✅
**Goal:** Verify timeline shows health decline pattern

**Steps:**
1. Click on **"Corn Stalk 12"** (second row)
2. Click **"Health Timeline"** tab

**Expected Result:**
- ✅ Timeline shows **4 snapshots**
- ✅ Health scores show decline: 85% → 75% → 65% → 55%
- ✅ Health status changes: healthy → healthy → needs-check → needs-check
- ✅ Treatment notes visible:
  - "Increased watering frequency"
  - "Applied nitrogen supplement"

---

### Test 5: Pepper Plant Timeline (Critical Condition) ✅
**Goal:** Verify timeline handles critical health situations

**Steps:**
1. Click on **"Pepper Plant B"** (third row)
2. Click **"Health Timeline"** tab

**Expected Result:**
- ✅ Timeline shows **4 snapshots**
- ✅ Health rapidly declines: 70% → 45% → 35% → 40%
- ✅ Disease indicators show aphid infestation
- ✅ Multiple treatment interventions visible:
  - "Applied neem oil spray"
  - "Second neem oil application + introduced ladybugs"
- ✅ Shows slight recovery in last snapshot

---

### Test 6: Performance Dashboard ✅
**Goal:** Verify gamification data loads correctly

**Steps:**
1. Look at top of page (header)
2. Find chip showing **"Score: 87/100"**
3. Click on it to expand dashboard

**Expected Result:**
- ✅ Dashboard expands smoothly
- ✅ Overall Score: **87/100**
- ✅ Weekly Grade: **A** (in green)
- ✅ Current Streak: **14 days** (with fire icon 🔥)
- ✅ **8 badges displayed:**
  - Early Bird (rare, EARNED)
  - Green Thumb (epic, EARNED)
  - Pest Hunter (rare, EARNED)
  - Documenter (common, 76% progress)
  - Speed Demon (rare, 40% progress)
  - Hot Streak (epic, 47% progress)
  - Master Farmer (legendary, locked)
  - Data Scientist (common, 89% progress)
- ✅ **3 achievements shown:**
  - First Detection
  - Quick Response
  - Prevention Expert
- ✅ **ROI Metrics displayed:**
  - Cost Saved: $243
  - Yield Increase: +18%
  - Time Efficiency: 5.5 hrs/week
- ✅ Performance insights graph shows data
- ✅ Click chip again to collapse dashboard

**If fails:**
- Check Supabase Table Editor > farm_metrics (should have 1 row)
- Verify JSONB data is properly formatted
- Check console for fetchFarmPerformanceMetrics errors

---

### Test 7: Photo Upload to Storage ✅
**Goal:** Verify file upload to Supabase Storage works

**Steps:**
1. Click **"Upload Photos"** button
2. Click on upload dropzone or drag image
3. Select any image file from your computer (JPG, PNG)
4. Wait for upload progress

**Expected Result:**
- ✅ Dropzone accepts file
- ✅ Upload progress indicator shows
- ✅ Success message appears
- ✅ Image appears in preview
- ✅ **Verify in Supabase Dashboard:**
  - Go to Storage > plant-photos bucket
  - Should see uploaded file with timestamp name
  - File size and metadata visible

**If fails:**
- Check bucket exists and is PUBLIC
- Check bucket name is exactly "plant-photos"
- Verify RLS policies allow INSERT on photos table
- Check console for upload errors

---

### Test 8: Data Persistence ✅
**Goal:** Confirm data persists across page refreshes

**Steps:**
1. Note current plant count and health statuses
2. Refresh page (F5 or Ctrl+R)
3. Wait for page to reload

**Expected Result:**
- ✅ Same 10 plants appear
- ✅ Same health statuses
- ✅ Performance score still 87/100
- ✅ No data loss

**Comparison with Mock API:**
- Mock API: Data resets on refresh
- Supabase: Data persists ✅

---

### Test 9: Create New Plant ✅
**Goal:** Test INSERT operation to database

**Steps:**
1. Click **"Add Plant"** button (if available) OR
2. Open browser console (F12) and run:
   ```javascript
   // This tests the API directly
   const { createPlant } = await import('./src/api/supabaseApi.ts');
   await createPlant({
     name: 'Test Basil',
     type: 'Herb',
     health: 'healthy',
     notes: 'Testing database insert'
   });
   ```
3. Refresh page

**Expected Result:**
- ✅ New plant appears in table
- ✅ Plant persists after refresh
- ✅ **Verify in Supabase:**
  - Table Editor > plants > Should see new row

**If fails:**
- Check RLS policies allow INSERT
- Verify all required fields provided
- Check console for validation errors

---

### Test 10: Update Plant Health ✅
**Goal:** Test UPDATE operation to database

**Steps:**
1. Click on any healthy plant
2. In plant detail modal, try to update health status (if UI allows)
3. Close modal
4. Refresh page

**Expected Result:**
- ✅ Health status updates
- ✅ Change persists after refresh
- ✅ Last checked timestamp updates
- ✅ Chip color changes (green/orange/red)

---

### Test 11: Query Performance ✅
**Goal:** Verify database queries are fast

**Steps:**
1. Open browser DevTools > Network tab
2. Refresh page
3. Look for Supabase API calls

**Expected Result:**
- ✅ `fetchPlants` completes in < 1 second
- ✅ `fetchFarmPerformanceMetrics` completes in < 1 second
- ✅ `fetchHealthSnapshots` completes in < 2 seconds
- ✅ No timeout errors

**If slow:**
- Check your Supabase region (should be close to you)
- Verify indexes exist (they're in schema)
- Check free tier database isn't paused

---

### Test 12: Error Handling ✅
**Goal:** Verify app handles errors gracefully

**Steps:**
1. Temporarily corrupt `.env` (change one character in URL)
2. Refresh page
3. Observe behavior
4. Fix `.env` and refresh

**Expected Result:**
- ✅ Error message appears (not blank page)
- ✅ Console shows meaningful error
- ✅ App doesn't crash
- ✅ Works after fixing `.env`

---

### Test 13: Multiple Plant Types ✅
**Goal:** Verify diverse plant data loads correctly

**Steps:**
1. Check plant table for variety
2. Verify different health statuses

**Expected Result:**
- ✅ Multiple plant types: Tomato, Corn, Pepper, Lettuce, Strawberry, Cucumber, Carrot, Bean, Zucchini, Potato
- ✅ Mixed health statuses: 5 healthy, 3 needs-check, 2 unhealthy
- ✅ Different last checked times
- ✅ Various notes displaying correctly

---

### Test 14: Browser Compatibility ✅
**Goal:** Test on different browsers

**Test in each browser:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

**Expected Result:**
- ✅ All features work identically
- ✅ No console errors
- ✅ UI renders correctly

---

### Test 15: Mobile Responsiveness ✅
**Goal:** Verify app works on mobile devices

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android)
4. Test key features

**Expected Result:**
- ✅ Table scrolls horizontally
- ✅ Plant detail modal fits screen
- ✅ Timeline is usable
- ✅ Performance dashboard readable
- ✅ Upload works on mobile

---

## 🎯 Success Criteria

### ✅ All Tests Pass Means:
- Database connection working
- All CRUD operations functional
- Data persists correctly
- Storage uploads work
- Timeline feature complete
- Performance dashboard operational
- No console errors
- Fast query performance

### 📊 Test Results Summary

| Category | Tests | Status |
|----------|-------|--------|
| Connection | 2 | ⏳ Pending |
| Data Loading | 3 | ⏳ Pending |
| Timeline | 3 | ⏳ Pending |
| Dashboard | 1 | ⏳ Pending |
| Storage | 1 | ⏳ Pending |
| CRUD Ops | 2 | ⏳ Pending |
| Performance | 1 | ⏳ Pending |
| Compatibility | 2 | ⏳ Pending |

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid API key"
```
✅ Solution: Check .env file formatting
- No spaces around =
- Full key copied (very long string)
- Quotes not needed
```

### Issue: "Failed to fetch"
```
✅ Solution: Network/CORS issue
- Check Supabase project isn't paused
- Verify project URL is correct
- Check internet connection
```

### Issue: "No rows returned"
```
✅ Solution: Data not seeded
- Re-run supabase-schema.sql
- Check Table Editor manually
- Verify SQL script completed without errors
```

### Issue: "403 Forbidden" on storage
```
✅ Solution: Storage permissions
- Bucket must be PUBLIC
- Check RLS policies on photos table
- Verify bucket name matches code
```

### Issue: Timeline loads but no photos
```
✅ Solution: Photo URLs invalid
- Mock URLs (picsum.photos) should work
- Check network tab for 404 errors
- Internet connection required for picsum images
```

---

## 📝 Testing Notes Template

**Date:** _______
**Tester:** _______
**Environment:** _______

| Test # | Test Name | Pass/Fail | Notes |
|--------|-----------|-----------|-------|
| 1 | Database Connection | [ ] | |
| 2 | Fetch Plants | [ ] | |
| 3 | Tomato Timeline | [ ] | |
| 4 | Corn Timeline | [ ] | |
| 5 | Pepper Timeline | [ ] | |
| 6 | Performance Dashboard | [ ] | |
| 7 | Photo Upload | [ ] | |
| 8 | Data Persistence | [ ] | |
| 9 | Create Plant | [ ] | |
| 10 | Update Health | [ ] | |
| 11 | Query Performance | [ ] | |
| 12 | Error Handling | [ ] | |
| 13 | Plant Variety | [ ] | |
| 14 | Browser Compat | [ ] | |
| 15 | Mobile Response | [ ] | |

**Overall Result:** [ ] PASS [ ] FAIL
**Issues Found:** _______
**Next Steps:** _______

---

## 🚀 Ready for Production

When all tests pass, you're ready to:
- ✅ Deploy to Vercel/Netlify
- ✅ Add production environment variables
- ✅ Share demo link with recruiters
- ✅ Add to portfolio/resume

---

## 📧 Demo Script for Recruiters

**"Let me show you the features:"**

1. **Data Loading** (Test 2)
   - "Here are 10 plants from our PostgreSQL database via Supabase"
   
2. **Health Timeline** (Test 3)
   - "Watch this tomato plant's recovery from 40% to 90% health over 15 days"
   - "I can compare before/after photos with this slider"
   - "Treatment notes and AI analysis show the intervention timeline"
   
3. **Performance Dashboard** (Test 6)
   - "The gamification system tracks farm performance at 87/100"
   - "Earned 3 badges so far, 5 more in progress"
   - "ROI metrics show $243 saved and 18% yield increase"
   
4. **Photo Upload** (Test 7)
   - "Upload stores directly to Supabase Storage"
   - "Metadata tracked in PostgreSQL"
   
5. **Data Persistence** (Test 8)
   - "Everything persists to the database"
   - [Refresh page] "See? No data loss"

**"The stack is React + TypeScript frontend, Supabase backend (PostgreSQL + Storage), fully type-safe with comprehensive mock data for testing."**

---

**Happy Testing! 🎉**

**Remember:** If something doesn't work, check the console first (F12), then Supabase Dashboard logs.
