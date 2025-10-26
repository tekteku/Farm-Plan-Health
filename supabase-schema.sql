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

-- Row Level Security (RLS) - Enable for all tables
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
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

CREATE POLICY "Allow public read access on sensor_readings" ON sensor_readings
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on sensor_readings" ON sensor_readings
    FOR INSERT WITH CHECK (true);

-- Insert sample data
INSERT INTO plants (name, type, health, notes, last_checked) VALUES
    ('Tomato Plant A', 'Tomato', 'healthy', 'Thriving, no issues detected.', NOW() - INTERVAL '2 hours'),
    ('Corn Stalk 12', 'Corn', 'needs-check', 'Yellowing leaves observed.', NOW() - INTERVAL '5 days'),
    ('Pepper Plant B', 'Pepper', 'unhealthy', 'Aphid infestation detected.', NOW() - INTERVAL '1 day'),
    ('Lettuce Bed 3', 'Lettuce', 'healthy', 'Growing well, good color.', NOW() - INTERVAL '12 hours'),
    ('Strawberry 5', 'Strawberry', 'needs-check', 'Some wilting, check irrigation.', NOW() - INTERVAL '3 days')
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
COMMENT ON TABLE sensor_readings IS 'Stores IoT sensor data for plants';
