-- Supabase Database Schema for Farm Plant Health Dashboard
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable PostGIS extension for location support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Plants table
CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    health VARCHAR(50) NOT NULL CHECK (health IN ('healthy', 'needs-check', 'unhealthy', 'unknown')),
    location GEOGRAPHY(POINT),
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    s3_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    exif_data JSONB,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID
);

-- AI Diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    photo_ids UUID[],
    diagnosis TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    confidence_score DECIMAL(5,2),
    detected_issues JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Snapshots table (NEW - for timeline feature)
CREATE TABLE IF NOT EXISTS health_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    health VARCHAR(50) NOT NULL CHECK (health IN ('healthy', 'needs-check', 'unhealthy', 'unknown')),
    photo_url TEXT,
    ai_analysis JSONB NOT NULL, -- {leafColor, diseaseIndicators, healthScore, confidence}
    sensor_data JSONB, -- {soilMoisture, temperature, humidity}
    treatment TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farm Metrics table (NEW - for performance dashboard)
CREATE TABLE IF NOT EXISTS farm_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- For multi-user support
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    weekly_grade VARCHAR(3) NOT NULL,
    streak INTEGER DEFAULT 0,
    badges JSONB NOT NULL DEFAULT '[]', -- Array of badge objects
    achievements JSONB NOT NULL DEFAULT '[]', -- Array of achievement objects
    trends JSONB NOT NULL, -- {healthImprovement, responseTime, preventionRate}
    roi JSONB NOT NULL, -- {costSaved, yieldIncrease, timeEfficiency}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensor readings table (for future IoT integration)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    reading_type VARCHAR(50),
    value DECIMAL(10,2),
    unit VARCHAR(20),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_plants_health ON plants(health);
CREATE INDEX IF NOT EXISTS idx_plants_type ON plants(type);
CREATE INDEX IF NOT EXISTS idx_plants_last_checked ON plants(last_checked DESC);
CREATE INDEX IF NOT EXISTS idx_photos_plant ON photos(plant_id);
CREATE INDEX IF NOT EXISTS idx_photos_uploaded ON photos(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnoses_plant ON diagnoses(plant_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_created ON diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_snapshots_plant ON health_snapshots(plant_id);
CREATE INDEX IF NOT EXISTS idx_health_snapshots_timestamp ON health_snapshots(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_farm_metrics_user ON farm_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_plant ON sensor_readings(plant_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_recorded ON sensor_readings(recorded_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_plants_updated_at ON plants;
CREATE TRIGGER update_plants_updated_at
    BEFORE UPDATE ON plants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_farm_metrics_updated_at ON farm_metrics;
CREATE TRIGGER update_farm_metrics_updated_at
    BEFORE UPDATE ON farm_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Enable for all tables
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- Public access policies (for demo/development)
-- TODO: Update these policies based on your authentication requirements
CREATE POLICY "Allow public read access on plants" ON plants
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on plants" ON plants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on plants" ON plants
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on plants" ON plants
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access on photos" ON photos
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on photos" ON photos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on diagnoses" ON diagnoses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on diagnoses" ON diagnoses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on health_snapshots" ON health_snapshots
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on health_snapshots" ON health_snapshots
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on health_snapshots" ON health_snapshots
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on farm_metrics" ON farm_metrics
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on farm_metrics" ON farm_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on farm_metrics" ON farm_metrics
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on sensor_readings" ON sensor_readings
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on sensor_readings" ON sensor_readings
    FOR INSERT WITH CHECK (true);

-- Insert sample data (10 diverse plants)
INSERT INTO plants (name, type, health, notes, last_checked) VALUES
    ('Tomato Plant A', 'Tomato', 'healthy', 'Thriving, no issues detected. Excellent fruit development.', NOW() - INTERVAL '2 hours'),
    ('Corn Stalk 12', 'Corn', 'needs-check', 'Yellowing leaves observed. May need nitrogen supplement.', NOW() - INTERVAL '5 days'),
    ('Pepper Plant B', 'Pepper', 'unhealthy', 'Aphid infestation detected. Treatment in progress.', NOW() - INTERVAL '1 day'),
    ('Lettuce Bed 3', 'Lettuce', 'healthy', 'Growing well, good color. Ready for harvest soon.', NOW() - INTERVAL '12 hours'),
    ('Strawberry 5', 'Strawberry', 'needs-check', 'Some wilting, check irrigation. Possible root issue.', NOW() - INTERVAL '3 days'),
    ('Cucumber Vine C', 'Cucumber', 'healthy', 'Strong growth, producing well. Good pollination.', NOW() - INTERVAL '6 hours'),
    ('Carrot Row 7', 'Carrot', 'healthy', 'Underground development excellent. No visible issues.', NOW() - INTERVAL '1 day'),
    ('Bean Plant 14', 'Bean', 'needs-check', 'Leaf curl noticed. Monitoring for pest activity.', NOW() - INTERVAL '2 days'),
    ('Zucchini Z1', 'Zucchini', 'healthy', 'Rapid growth, frequent harvests. Very productive.', NOW() - INTERVAL '8 hours'),
    ('Potato Field P3', 'Potato', 'unhealthy', 'Late blight symptoms visible. Fungicide applied.', NOW() - INTERVAL '4 days')
ON CONFLICT DO NOTHING;

-- Insert sample health snapshots for multiple plants
DO $$
DECLARE
    plant_id_1 UUID;
    plant_id_2 UUID;
    plant_id_3 UUID;
BEGIN
    -- Get first three plant IDs
    SELECT id INTO plant_id_1 FROM plants ORDER BY created_at LIMIT 1;
    SELECT id INTO plant_id_2 FROM plants ORDER BY created_at LIMIT 1 OFFSET 1;
    SELECT id INTO plant_id_3 FROM plants ORDER BY created_at LIMIT 1 OFFSET 2;
    
    -- Insert health snapshots for Plant 1 (Tomato) - showing improvement from unhealthy to healthy
    IF plant_id_1 IS NOT NULL THEN
        INSERT INTO health_snapshots (plant_id, timestamp, health, photo_url, ai_analysis, sensor_data, treatment, notes) VALUES
        (plant_id_1, NOW() - INTERVAL '15 days', 'unhealthy', 'https://picsum.photos/seed/tomato1/600/400', 
         '{"leafColor": "Yellow-green", "diseaseIndicators": ["Yellowing leaves", "Wilting"], "healthScore": 40, "confidence": 85}'::jsonb,
         '{"soilMoisture": 45, "temperature": 22, "humidity": 60}'::jsonb,
         NULL, 'Initial assessment - plant showing stress'),
        
        (plant_id_1, NOW() - INTERVAL '12 days', 'unhealthy', 'https://picsum.photos/seed/tomato2/600/400',
         '{"leafColor": "Yellow-green", "diseaseIndicators": ["Yellowing leaves"], "healthScore": 50, "confidence": 87}'::jsonb,
         '{"soilMoisture": 50, "temperature": 22.5, "humidity": 62}'::jsonb,
         'Applied nitrogen-rich fertilizer (10-10-10)', 'Treatment applied, monitoring response'),
        
        (plant_id_1, NOW() - INTERVAL '9 days', 'needs-check', 'https://picsum.photos/seed/tomato3/600/400',
         '{"leafColor": "Light green", "diseaseIndicators": ["Minor discoloration"], "healthScore": 60, "confidence": 89}'::jsonb,
         '{"soilMoisture": 55, "temperature": 23, "humidity": 64}'::jsonb,
         'Adjusted watering schedule to 2x daily', 'Slight improvement noted'),
        
        (plant_id_1, NOW() - INTERVAL '6 days', 'needs-check', 'https://picsum.photos/seed/tomato4/600/400',
         '{"leafColor": "Light green", "diseaseIndicators": ["Minor discoloration"], "healthScore": 70, "confidence": 91}'::jsonb,
         '{"soilMoisture": 60, "temperature": 23.5, "humidity": 66}'::jsonb,
         NULL, 'Continuing current treatment protocol'),
        
        (plant_id_1, NOW() - INTERVAL '3 days', 'healthy', 'https://picsum.photos/seed/tomato5/600/400',
         '{"leafColor": "Vibrant green", "diseaseIndicators": [], "healthScore": 80, "confidence": 93}'::jsonb,
         '{"soilMoisture": 65, "temperature": 24, "humidity": 68}'::jsonb,
         NULL, 'Significant recovery, new growth visible'),
        
        (plant_id_1, NOW(), 'healthy', 'https://picsum.photos/seed/tomato6/600/400',
         '{"leafColor": "Vibrant green", "diseaseIndicators": [], "healthScore": 90, "confidence": 95}'::jsonb,
         '{"soilMoisture": 70, "temperature": 24.5, "humidity": 70}'::jsonb,
         NULL, 'Excellent recovery, maintaining current care routine');
    END IF;
    
    -- Insert health snapshots for Plant 2 (Corn) - showing gradual decline
    IF plant_id_2 IS NOT NULL THEN
        INSERT INTO health_snapshots (plant_id, timestamp, health, photo_url, ai_analysis, sensor_data, treatment, notes) VALUES
        (plant_id_2, NOW() - INTERVAL '10 days', 'healthy', 'https://picsum.photos/seed/corn1/600/400',
         '{"leafColor": "Dark green", "diseaseIndicators": [], "healthScore": 85, "confidence": 90}'::jsonb,
         '{"soilMoisture": 65, "temperature": 23, "humidity": 65}'::jsonb,
         NULL, 'Plant looking strong and healthy'),
        
        (plant_id_2, NOW() - INTERVAL '7 days', 'healthy', 'https://picsum.photos/seed/corn2/600/400',
         '{"leafColor": "Green", "diseaseIndicators": [], "healthScore": 75, "confidence": 88}'::jsonb,
         '{"soilMoisture": 60, "temperature": 24, "humidity": 63}'::jsonb,
         NULL, 'Slight color change noted'),
        
        (plant_id_2, NOW() - INTERVAL '5 days', 'needs-check', 'https://picsum.photos/seed/corn3/600/400',
         '{"leafColor": "Light green", "diseaseIndicators": ["Tip yellowing"], "healthScore": 65, "confidence": 85}'::jsonb,
         '{"soilMoisture": 55, "temperature": 25, "humidity": 60}'::jsonb,
         'Increased watering frequency', 'Yellowing at leaf tips observed'),
        
        (plant_id_2, NOW() - INTERVAL '2 days', 'needs-check', 'https://picsum.photos/seed/corn4/600/400',
         '{"leafColor": "Yellow-green", "diseaseIndicators": ["Yellowing", "Stunted growth"], "healthScore": 55, "confidence": 87}'::jsonb,
         '{"soilMoisture": 50, "temperature": 26, "humidity": 58}'::jsonb,
         'Applied nitrogen supplement', 'Condition worsening, treatment started');
    END IF;
    
    -- Insert health snapshots for Plant 3 (Pepper) - showing critical condition
    IF plant_id_3 IS NOT NULL THEN
        INSERT INTO health_snapshots (plant_id, timestamp, health, photo_url, ai_analysis, sensor_data, treatment, notes) VALUES
        (plant_id_3, NOW() - INTERVAL '4 days', 'needs-check', 'https://picsum.photos/seed/pepper1/600/400',
         '{"leafColor": "Light green", "diseaseIndicators": ["Small spots on leaves"], "healthScore": 70, "confidence": 82}'::jsonb,
         '{"soilMoisture": 62, "temperature": 24, "humidity": 67}'::jsonb,
         NULL, 'First signs of pest activity'),
        
        (plant_id_3, NOW() - INTERVAL '2 days', 'unhealthy', 'https://picsum.photos/seed/pepper2/600/400',
         '{"leafColor": "Pale green", "diseaseIndicators": ["Aphid clusters", "Leaf curling"], "healthScore": 45, "confidence": 88}'::jsonb,
         '{"soilMoisture": 60, "temperature": 25, "humidity": 68}'::jsonb,
         'Applied neem oil spray', 'Heavy aphid infestation confirmed'),
        
        (plant_id_3, NOW() - INTERVAL '1 day', 'unhealthy', 'https://picsum.photos/seed/pepper3/600/400',
         '{"leafColor": "Pale green", "diseaseIndicators": ["Aphids", "Yellowing"], "healthScore": 35, "confidence": 90}'::jsonb,
         '{"soilMoisture": 58, "temperature": 25.5, "humidity": 70}'::jsonb,
         'Second neem oil application + introduced ladybugs', 'Continuing intensive treatment'),
        
        (plant_id_3, NOW(), 'unhealthy', 'https://picsum.photos/seed/pepper4/600/400',
         '{"leafColor": "Pale green", "diseaseIndicators": ["Reduced aphids", "Damage recovery"], "healthScore": 40, "confidence": 86}'::jsonb,
         '{"soilMoisture": 60, "temperature": 24, "humidity": 69}'::jsonb,
         NULL, 'Slight improvement, aphid population decreasing');
    END IF;
END $$;

-- Insert sample farm metrics
INSERT INTO farm_metrics (overall_score, weekly_grade, streak, badges, achievements, trends, roi) VALUES
(87, 'A', 14, 
 '[
    {"id": "badge-1", "name": "Early Bird", "icon": "shield", "description": "Caught 3 plant issues before they became critical", "earnedDate": "2025-10-25T10:00:00Z", "rarity": "rare"},
    {"id": "badge-2", "name": "Green Thumb", "icon": "star", "description": "Maintained 90%+ farm health for 30 consecutive days", "earnedDate": "2025-10-28T15:30:00Z", "rarity": "epic"},
    {"id": "badge-3", "name": "Documenter", "icon": "camera", "description": "Upload 50+ diagnostic photos", "progress": 76, "rarity": "common"},
    {"id": "badge-4", "name": "Speed Demon", "icon": "speed", "description": "Respond to 10 alerts within 1 hour", "progress": 40, "rarity": "rare"},
    {"id": "badge-5", "name": "Hot Streak", "icon": "fire", "description": "Check farm health for 30 consecutive days", "progress": 47, "rarity": "epic"},
    {"id": "badge-6", "name": "Master Farmer", "icon": "trophy", "description": "Achieve 95+ farm score for 7 consecutive days", "rarity": "legendary"},
    {"id": "badge-7", "name": "Pest Hunter", "icon": "shield", "description": "Prevent 5 pest infestations through early detection", "earnedDate": "2025-10-20T09:00:00Z", "rarity": "rare"},
    {"id": "badge-8", "name": "Data Scientist", "icon": "star", "description": "Log sensor data for 100+ data points", "progress": 89, "rarity": "common"}
 ]'::jsonb,
 '[
    {"id": "ach-1", "title": "First Detection", "description": "Successfully identified your first plant health issue using AI diagnosis", "unlockedDate": "2025-10-18T14:20:00Z", "category": "health"},
    {"id": "ach-2", "title": "Quick Response", "description": "Addressed a critical plant issue within 2 hours of detection", "unlockedDate": "2025-10-22T11:45:00Z", "category": "efficiency"},
    {"id": "ach-3", "title": "Prevention Expert", "description": "Caught 3 issues before they reached critical status", "unlockedDate": "2025-10-25T16:00:00Z", "category": "prevention"}
 ]'::jsonb,
 '{"healthImprovement": 23, "responseTime": 3.5, "preventionRate": 75}'::jsonb,
 '{"costSaved": 243, "yieldIncrease": 18, "timeEfficiency": 5.5}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Create storage bucket for plant photos
-- Note: This needs to be done in Supabase Storage UI or via API
-- Instructions:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named "plant-photos"
-- 3. Make it public or configure appropriate policies

COMMENT ON TABLE plants IS 'Stores information about farm plants';
COMMENT ON TABLE photos IS 'Stores photo metadata and S3 URLs for plant images';
COMMENT ON TABLE diagnoses IS 'Stores AI diagnosis results for plants';
COMMENT ON TABLE health_snapshots IS 'Stores historical health data for timeline feature';
COMMENT ON TABLE farm_metrics IS 'Stores gamification metrics and performance data';
COMMENT ON TABLE sensor_readings IS 'Stores IoT sensor data for plants';
