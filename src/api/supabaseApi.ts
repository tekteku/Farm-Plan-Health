import { supabase } from './supabaseClient'
import type { Plant, HealthSnapshot, FarmPerformanceMetrics } from '../types'

// Fetch all plants from Supabase
export async function fetchPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select(`
      *,
      photos:photos(s3_url)
    `)
    .order('last_checked', { ascending: false })
  
  if (error) {
    console.error('Error fetching plants:', error)
    throw error
  }
  
  // Transform Supabase data to match our Plant type
  return data.map(plant => ({
    id: plant.id,
    name: plant.name,
    type: plant.type,
    health: plant.health,
    lastChecked: plant.last_checked,
    notes: plant.notes,
    location: plant.location ? {
      lat: plant.location.coordinates[1],
      lng: plant.location.coordinates[0]
    } : undefined,
    photos: plant.photos?.map((p: any) => p.s3_url) || []
  }))
}

// Upload images to Supabase Storage
export async function uploadImages(files: File[], plantId?: string): Promise<{ url: string; name: string }[]> {
  if (!plantId) {
    throw new Error('Plant ID is required for upload')
  }

  const uploadedPhotos = []
  
  for (const file of files) {
    // Generate unique filename
    const fileName = `${plantId}/${Date.now()}-${file.name}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('plant-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      throw uploadError
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('plant-photos')
      .getPublicUrl(fileName)
    
    // Save photo record in database
    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .insert({
        plant_id: plantId,
        s3_url: publicUrl,
        file_size: file.size,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (photoError) {
      console.error('Error saving photo record:', photoError)
      throw photoError
    }
    
    uploadedPhotos.push({
      url: publicUrl,
      name: file.name
    })
  }
  
  return uploadedPhotos
}

// Fetch health snapshots for timeline
export async function fetchHealthSnapshots(plantId: string): Promise<HealthSnapshot[]> {
  const { data, error } = await supabase
    .from('health_snapshots')
    .select('*')
    .eq('plant_id', plantId)
    .order('timestamp', { ascending: true })
  
  if (error) {
    console.error('Error fetching health snapshots:', error)
    throw error
  }
  
  return data.map(snapshot => ({
    id: snapshot.id,
    plantId: snapshot.plant_id,
    timestamp: snapshot.timestamp,
    health: snapshot.health,
    photoUrl: snapshot.photo_url,
    aiAnalysis: snapshot.ai_analysis,
    sensorData: snapshot.sensor_data,
    treatment: snapshot.treatment,
    notes: snapshot.notes
  }))
}

// Create health snapshot
export async function createHealthSnapshot(snapshot: Omit<HealthSnapshot, 'id'>): Promise<HealthSnapshot> {
  const { data, error } = await supabase
    .from('health_snapshots')
    .insert({
      plant_id: snapshot.plantId,
      timestamp: snapshot.timestamp,
      health: snapshot.health,
      photo_url: snapshot.photoUrl,
      ai_analysis: snapshot.aiAnalysis,
      sensor_data: snapshot.sensorData,
      treatment: snapshot.treatment,
      notes: snapshot.notes
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating health snapshot:', error)
    throw error
  }
  
  return {
    id: data.id,
    plantId: data.plant_id,
    timestamp: data.timestamp,
    health: data.health,
    photoUrl: data.photo_url,
    aiAnalysis: data.ai_analysis,
    sensorData: data.sensor_data,
    treatment: data.treatment,
    notes: data.notes
  }
}

// Fetch farm performance metrics
export async function fetchFarmPerformanceMetrics(): Promise<FarmPerformanceMetrics> {
  // In a real app, this would calculate metrics from database
  // For now, fetch from a dedicated metrics table or calculate on the fly
  const { data, error } = await supabase
    .from('farm_metrics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching metrics:', error)
    // Return default metrics if none exist
    return {
      overallScore: 0,
      weeklyGrade: 'F',
      streak: 0,
      badges: [],
      achievements: [],
      trends: {
        healthImprovement: 0,
        responseTime: 0,
        preventionRate: 0
      },
      roi: {
        costSaved: 0,
        yieldIncrease: 0,
        timeEfficiency: 0
      }
    }
  }
  
  return {
    overallScore: data.overall_score,
    weeklyGrade: data.weekly_grade,
    streak: data.streak,
    badges: data.badges,
    achievements: data.achievements,
    trends: data.trends,
    roi: data.roi
  }
}

// Update farm performance metrics
export async function updateFarmPerformanceMetrics(metrics: FarmPerformanceMetrics): Promise<void> {
  const { error } = await supabase
    .from('farm_metrics')
    .upsert({
      overall_score: metrics.overallScore,
      weekly_grade: metrics.weeklyGrade,
      streak: metrics.streak,
      badges: metrics.badges,
      achievements: metrics.achievements,
      trends: metrics.trends,
      roi: metrics.roi,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error updating metrics:', error)
    throw error
  }
}

// Create AI diagnosis record
export async function createDiagnosis(plantId: string, photoIds: string[], diagnosis: string, recommendations: string, confidence: number) {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert({
      plant_id: plantId,
      photo_ids: photoIds,
      diagnosis,
      recommendations,
      confidence_score: confidence,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating diagnosis:', error)
    throw error
  }
  
  return data
}

// Update plant health status
export async function updatePlantHealth(plantId: string, health: Plant['health'], notes?: string) {
  const { data, error } = await supabase
    .from('plants')
    .update({
      health,
      notes,
      last_checked: new Date().toISOString()
    })
    .eq('id', plantId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating plant:', error)
    throw error
  }
  
  return data
}

// Create a new plant
export async function createPlant(plant: Omit<Plant, 'id'>): Promise<Plant> {
  const { data, error } = await supabase
    .from('plants')
    .insert({
      name: plant.name,
      type: plant.type,
      health: plant.health,
      notes: plant.notes,
      last_checked: plant.lastChecked
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating plant:', error)
    throw error
  }
  
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    health: data.health,
    lastChecked: data.last_checked,
    notes: data.notes,
    photos: []
  }
}
