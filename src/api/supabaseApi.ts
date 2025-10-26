import { supabase } from './supabaseClient'
import type { Plant } from '../types'

// Fetch all plants from Supabase
export async function fetchPlantsFromSupabase(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select(`
      *,
      photos:photos(*)
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
export async function uploadImagesToSupabase(files: File[], plantId: string) {
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
