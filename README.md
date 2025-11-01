# Farm Plant Health Dashboard (Frontend)

A comprehensive farm intelligence platform featuring AI-powered plant diagnosis through photo analysis, real-time monitoring, proactive health management, and gamified performance tracking.

## 🌟 Key Features

### 🏆 Farm Performance Dashboard (NEW!)
- **Overall Farm Score**: 0-100 scoring system with weekly letter grades (A+ to F)
- **Achievement Badges**: Earn badges for milestones
  - �️ Early Bird: Catch issues before they become critical
  - ⭐ Green Thumb: Maintain 90%+ health for 30 days
  - 📸 Documenter: Upload 50+ diagnostic photos
  - 🔥 Hot Streak: Monitor farm daily for 30 consecutive days
  - And more with progress tracking!
- **ROI Metrics**: See tangible value
  - Cost saved through early detection
  - Estimated yield improvements
  - Time efficiency gains
- **Performance Insights**: Track trends week-over-week
  - Health improvement percentages
  - Average response time to issues
  - Prevention success rate

### 📈 Plant Health Timeline (NEW!)
- **Visual Health Journey**: See plant recovery over time with photo comparisons
- **Before/After Slider**: Compare snapshots side-by-side
- **AI Health Scoring**: Track health scores from 0-100%
- **Treatment Tracking**: Log applied treatments and see their effectiveness
- **Sensor Integration**: View temperature, humidity, and soil moisture trends
- **Progress Metrics**: Calculate improvement percentages and recovery time
- **Export-Ready Reports**: Share success stories with data-backed evidence

### 📸 Photo Upload & AI Diagnosis
- **Multi-platform Image Capture**: Upload photos from any device
  - Desktop: Drag-and-drop or file picker
  - Mobile: Direct camera access with `capture="environment"` for rear camera
  - Support for multiple image selection
- **Real-time Preview**: View thumbnails of selected images before upload
- **Plant Association**: Select which plant the photos belong to via dropdown
- **AI-Powered Analysis**: Automatic diagnosis triggered after upload
  - Displays AI confidence scores
  - Shows diagnosis and actionable recommendations
  - Analyzes uploaded photos alongside sensor data
- **Photo Gallery**: View all uploaded photos in the Plant Detail modal

### 📊 Dashboard Core Features
- Overview panel with summary cards, pie chart and trend line (using Recharts)
- Sortable/filterable plant table with search and detail dialog
- Alerts panel listing plants needing attention
- Data upload for CSV / manual entry
- Sample mock data at `src/data/plants.json`

### 🎤 Ambient Mode
- Voice-activated monitoring interface
- Hands-free farm management

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18 recommended)
- Supabase account (free tier) - [Sign up here](https://supabase.com)

### Installation

1. **Install dependencies:**
```powershell
npm install
```

2. **Set up Supabase** (Optional - uses mock data by default):
   - Follow the detailed guide in `SUPABASE_SETUP.md`
   - Quick steps:
     - Create a Supabase project
     - Run `supabase-schema.sql` in SQL Editor
     - Create `plant-photos` storage bucket
     - Copy credentials to `.env` file

3. **Start the development server:**
```powershell
npm run dev
```

4. **Open in browser:**
   - Navigate to http://localhost:5173 (or the port shown in terminal)

### Project Structure
```
src/
├── api/
│   ├── mockApi.ts           # Mock API endpoints (for development)
│   ├── supabaseClient.ts    # Supabase client configuration
│   └── supabaseApi.ts       # Real API using Supabase
├── components/
│   ├── DataUpload.tsx       # Photo upload with drag-and-drop
│   ├── AIDiagnosisModal.tsx # AI diagnosis display with photos
│   ├── PlantDetail.tsx      # Plant details with photo gallery
│   ├── PlantTable.tsx       # Sortable plant table
│   └── ...
├── data/
│   └── plants.json          # Mock plant data
└── types.ts                 # TypeScript type definitions
```

## 📸 Photo Upload Feature - Technical Details

### How It Works

1. **Image Selection**:
   - Users can drag-and-drop images into the upload zone
   - Mobile users can click "Take Photo" to access the device camera
   - Desktop users can click the upload zone to open file picker

2. **Plant Selection**:
   - After selecting images, choose the target plant from a dropdown
   - Ensures photos are properly associated with plant records

3. **Upload Process**:
   - Images are sent to the `uploadImages()` API (mock implementation)
   - Progress indicator shows upload status
   - Success message confirms completion

4. **AI Diagnosis**:
   - Automatically opens `AIDiagnosisModal` after upload
   - Displays uploaded photos in a grid
   - Shows AI analysis with confidence score
   - Provides diagnosis and recommendations

### API Contract

**Upload Endpoint** (Mock: `src/api/mockApi.ts`)
```typescript
uploadImages(files: File[]): Promise<{ url: string; name: string }[]>
```

Returns an array of uploaded file metadata with URLs.

### Future Enhancements (Roadmap)

#### Production-Ready Features
- [ ] **Cloud Storage Integration**
  - Direct-to-S3/Firebase uploads with signed URLs
  - Automatic thumbnail generation
  - Image optimization and compression
  
- [ ] **EXIF Metadata Extraction**
  - GPS coordinates for location tagging
  - Timestamp for historical tracking
  - Camera info for quality assessment
  
- [ ] **Client-Side Image Processing**
  - Crop and rotate before upload
  - Auto-resize for bandwidth optimization
  - EXIF stripping for privacy
  
- [ ] **Offline Queue**
  - IndexedDB for pending uploads
  - Auto-retry with exponential backoff
  - Sync when connection restored
  
- [ ] **Advanced ML Integration**
  - Real-time disease detection
  - Pest identification
  - Growth stage classification
  - Yield prediction

#### UX Enhancements
- [ ] Multiple file progress bars
- [ ] Duplicate detection
- [ ] Bulk edit metadata
- [ ] Export diagnosis reports

#### Security & Privacy
- [ ] GPS consent dialog
- [ ] EXIF data opt-in/out
- [ ] Secure file validation
- [ ] Rate limiting

## 🎯 Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Library**: Material-UI (MUI) v5
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **File Upload**: react-dropzone
- **Charts**: Recharts
- **Routing**: React Router v7
- **Voice**: react-speech-recognition

## 📝 Notes and Next Steps

- [x] Scaffold core dashboard layout
- [x] **Photo upload with camera capture**
- [x] **AI diagnosis integration with image display**
- [x] **Plant photo gallery in detail view**
- [ ] Add Map View with `react-leaflet`
- [ ] Wire CSV import using `papaparse`
- [ ] Integrate email/SMS notifications (Twilio, SendGrid)
- [ ] Connect to real backend API
- [ ] Add automated tests (React Testing Library)
- [ ] Implement cloud storage (AWS S3 or Firebase)
- [ ] EXIF metadata extraction
- [ ] Offline queue with IndexedDB

## 🔒 Privacy & Data Usage

When uploading photos:
- Images are associated with specific plants for analysis
- AI analysis runs on uploaded images to detect health issues
- (Future) GPS data from EXIF will require explicit user consent
- (Future) Option to strip metadata before upload for privacy

## 📄 License

Private project for interview demonstration.

