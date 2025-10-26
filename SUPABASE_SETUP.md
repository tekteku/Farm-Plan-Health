# 🚀 Supabase Setup Guide

This guide will help you set up Supabase for the Farm Plant Health Dashboard.

## 📋 Prerequisites

- A Supabase account (free tier is sufficient)
- Your project dependencies installed (`npm install`)

---

## Step 1: Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up/Login** with your GitHub account
3. **Create a new project**:
   - Click "New Project"
   - Choose organization (or create one)
   - Project name: `farm-plant-health`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to your location
   - Click "Create new project"
   - ⏰ Wait 2-3 minutes for setup to complete

---

## Step 2: Set Up Database Schema

1. **Open SQL Editor**:
   - In your Supabase project dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

2. **Run the schema**:
   - Open the `supabase-schema.sql` file in your project
   - Copy all the SQL code
   - Paste it into the SQL Editor
   - Click "Run" button (or press Ctrl+Enter)
   - ✅ You should see success messages

3. **Verify tables**:
   - Click "Table Editor" in the left sidebar
   - You should see: `plants`, `photos`, `diagnoses`, `sensor_readings`
   - Click on `plants` to see the sample data

---

## Step 3: Create Storage Bucket

1. **Go to Storage**:
   - Click "Storage" in the left sidebar
   - Click "Create a new bucket"

2. **Configure bucket**:
   - Name: `plant-photos`
   - Public bucket: ✅ **Check this** (for public access to images)
   - Click "Create bucket"

3. **Set storage policy** (optional):
   - Click on the `plant-photos` bucket
   - Go to "Policies" tab
   - The bucket is already public, but you can add size limits:
   ```sql
   -- Max file size: 10MB
   CREATE POLICY "Max file size 10MB"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'plant-photos' 
     AND (storage.foldername(name))[1] IS NOT NULL
     AND pg_column_size(metadata) < 10485760
   );
   ```

---

## Step 4: Get API Credentials

1. **Go to Settings**:
   - Click "Settings" (gear icon) in the left sidebar
   - Click "API" under "Configuration"

2. **Copy your credentials**:
   - **Project URL**: Copy the URL (looks like: `https://xxxxx.supabase.co`)
   - **anon public key**: Copy the `anon` key (long string starting with `eyJ...`)

3. **Update your project**:
   - Open the `.env` file in your project root
   - Replace the placeholder values:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - **Important**: Never commit the `.env` file to git!

---

## Step 5: Update Your Code to Use Supabase

### Option A: Keep Mock API (for testing)

Your code currently uses `mockApi.ts`. Keep it as is for local development.

### Option B: Switch to Supabase

Update `src/components/DataUpload.tsx`:

```typescript
// Change this line:
import { uploadImages, fetchPlants } from '../api/mockApi';

// To this:
import { uploadImagesToSupabase as uploadImages, fetchPlantsFromSupabase as fetchPlants } from '../api/supabaseApi';
```

Update `src/App.tsx`:

```typescript
// Change this line:
import { fetchPlants } from './api/mockApi'

// To this:
import { fetchPlants } from './api/supabaseApi'
```

---

## Step 6: Test the Integration

1. **Restart dev server**:
   ```bash
   npm run dev
   ```

2. **Test fetching plants**:
   - Open the app in your browser
   - You should see the 5 sample plants from Supabase
   - Check browser console for any errors

3. **Test uploading photos**:
   - Scroll to "Data Upload" section
   - Select an image
   - Choose a plant
   - Click "Upload & Get AI Diagnosis"
   - ✅ Photo should upload to Supabase Storage
   - ✅ Photo URL should be saved to database
   - ✅ AI diagnosis modal should open

4. **Verify in Supabase**:
   - Go to "Storage" → `plant-photos` bucket
   - You should see your uploaded image
   - Go to "Table Editor" → `photos` table
   - You should see a new photo record

---

## 🔒 Step 7: Security (Optional for Production)

### Current Setup (Development)
- All tables have public read/write access
- Storage bucket is public

### For Production (Recommended)

1. **Enable Authentication**:
   ```sql
   -- Update RLS policies to require authentication
   DROP POLICY "Allow public read access on plants" ON plants;
   DROP POLICY "Allow public insert on plants" ON plants;
   
   CREATE POLICY "Authenticated users can read plants" ON plants
       FOR SELECT USING (auth.role() = 'authenticated');
   
   CREATE POLICY "Authenticated users can insert plants" ON plants
       FOR INSERT WITH CHECK (auth.role() = 'authenticated');
   ```

2. **Implement Auth in your app**:
   ```typescript
   // src/api/auth.ts
   import { supabase } from './supabaseClient'
   
   export async function signUp(email: string, password: string) {
     const { data, error } = await supabase.auth.signUp({
       email,
       password
     })
     return { data, error }
   }
   
   export async function signIn(email: string, password: string) {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password
     })
     return { data, error }
   }
   ```

---

## 🐛 Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct credentials
- Restart the dev server after updating `.env`
- Make sure you copied the `anon` key, not the `service_role` key

### "relation 'plants' does not exist"
- The SQL schema didn't run properly
- Go back to SQL Editor and run `supabase-schema.sql` again
- Check for error messages in the SQL Editor

### Photos not uploading
- Check that the `plant-photos` bucket exists
- Verify the bucket is set to public
- Check browser console for CORS errors
- Try creating the bucket again if needed

### "Row Level Security" errors
- The RLS policies might be too restrictive
- For development, use the public policies in the schema
- For production, implement proper authentication

### CORS errors
- Supabase should handle CORS automatically
- Check that your Supabase URL is correct in `.env`
- Try clearing browser cache

---

## 📊 Monitoring & Management

### View Data
- **Table Editor**: Browse and edit data directly
- **SQL Editor**: Run custom queries
- **Storage**: View uploaded images

### Database Stats
- Go to "Database" → "Database" in sidebar
- See connection stats, size, and performance

### API Logs
- Go to "Logs" → "API" to see all API requests
- Useful for debugging

---

## 🎯 Next Steps

1. ✅ **Test the basic flow**: Fetch plants, upload photos
2. 🔄 **Add real-time updates**: Use Supabase subscriptions
3. 🔐 **Add authentication**: Implement user login/signup
4. 🤖 **Connect AI service**: Integrate real ML model for diagnosis
5. 📈 **Add analytics**: Track usage, errors, performance

---

## 💡 Supabase Features to Explore

### Real-time Subscriptions
Listen to database changes in real-time:

```typescript
const subscription = supabase
  .channel('plants-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'plants' },
    (payload) => {
      console.log('Plant changed:', payload)
      // Update UI automatically
    }
  )
  .subscribe()
```

### Storage Transformations
Automatically resize/optimize images:

```typescript
const { data: { publicUrl } } = supabase.storage
  .from('plant-photos')
  .getPublicUrl('image.jpg', {
    transform: {
      width: 500,
      height: 500,
      resize: 'cover'
    }
  })
```

### Edge Functions
Run serverless functions for AI processing:

```bash
supabase functions new analyze-plant
```

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Storage Guide**: https://supabase.com/docs/guides/storage
- **Auth Guide**: https://supabase.com/docs/guides/auth
- **Real-time**: https://supabase.com/docs/guides/realtime

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Storage bucket created (`plant-photos`)
- [ ] API credentials copied to `.env`
- [ ] App can fetch plants from Supabase
- [ ] App can upload photos to Supabase
- [ ] Photos visible in Supabase Storage
- [ ] Photo records saved in `photos` table

**Once all checked, you're ready to deploy!** 🚀

---

## 🤝 Need Help?

- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: File an issue in your repo
- **Documentation**: Check official Supabase docs first

Good luck! 🍀
