import plants from '../data/plants.json';
import type { Plant, HealthSnapshot, FarmPerformanceMetrics } from '../types';

export async function fetchPlants(): Promise<Plant[]> {
  // Simulate a small delay
  await new Promise((r) => setTimeout(r, 200));
  return plants as Plant[];
}

export async function uploadImages(files: File[]): Promise<{ url: string; name: string }[]> {
  console.log('Mock API: Starting image upload for', files);
  // Simulate an upload process that takes 1.5 seconds
  await new Promise((r) => setTimeout(r, 1500));

  const uploadedFiles = files.map((file, i) => ({
    // In a real app, this would be a URL to a cloud storage bucket (e.g., S3)
    url: `https://picsum.photos/seed/${Date.now() + i}/400/300`,
    name: file.name,
  }));

  console.log('Mock API: Upload complete', uploadedFiles);
  return uploadedFiles;
}

// Mock health snapshots for timeline feature
export async function fetchHealthSnapshots(plantId: string): Promise<HealthSnapshot[]> {
  await new Promise((r) => setTimeout(r, 300));
  
  const baseDate = new Date('2025-10-15');
  const snapshots: HealthSnapshot[] = [];
  
  // Generate 6 snapshots over the past 2 weeks showing health improvement
  for (let i = 0; i < 6; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + (i * 3)); // Every 3 days
    
    const healthScore = 40 + (i * 10); // Gradual improvement from 40% to 90%
    const diseaseIndicators = i < 2 ? ['Yellowing leaves', 'Wilting'] : i < 4 ? ['Minor discoloration'] : [];
    
    snapshots.push({
      id: `snap-${plantId}-${i}`,
      plantId,
      timestamp: date.toISOString(),
      health: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'needs-check' : 'unhealthy',
      photoUrl: `https://picsum.photos/seed/${plantId}-${i}/600/400`,
      aiAnalysis: {
        leafColor: healthScore < 60 ? 'Yellow-green' : healthScore < 80 ? 'Light green' : 'Vibrant green',
        diseaseIndicators,
        healthScore,
        confidence: 85 + (i * 2),
      },
      sensorData: {
        soilMoisture: 45 + (i * 5),
        temperature: 22 + (i * 0.5),
        humidity: 60 + (i * 2),
      },
      treatment: i === 2 ? 'Applied nitrogen-rich fertilizer (10-10-10)' : 
                 i === 3 ? 'Adjusted watering schedule to 2x daily' : undefined,
      notes: i === 0 ? 'Initial assessment - plant showing stress' :
             i === 2 ? 'Treatment applied, monitoring response' :
             i === 5 ? 'Excellent recovery, maintaining current care routine' : undefined,
    });
  }
  
  return snapshots;
}

// Mock farm performance metrics
export async function fetchFarmPerformanceMetrics(): Promise<FarmPerformanceMetrics> {
  await new Promise((r) => setTimeout(r, 200));
  
  return {
    overallScore: 87,
    weeklyGrade: 'A',
    streak: 14,
    badges: [
      {
        id: 'badge-1',
        name: 'Early Bird',
        icon: 'shield',
        description: 'Caught 3 plant issues before they became critical',
        earnedDate: '2025-10-25T10:00:00Z',
        rarity: 'rare',
      },
      {
        id: 'badge-2',
        name: 'Green Thumb',
        icon: 'star',
        description: 'Maintained 90%+ farm health for 30 consecutive days',
        earnedDate: '2025-10-28T15:30:00Z',
        rarity: 'epic',
      },
      {
        id: 'badge-3',
        name: 'Documenter',
        icon: 'camera',
        description: 'Upload 50+ diagnostic photos',
        progress: 76,
        rarity: 'common',
      },
      {
        id: 'badge-4',
        name: 'Speed Demon',
        icon: 'speed',
        description: 'Respond to 10 alerts within 1 hour',
        progress: 40,
        rarity: 'rare',
      },
      {
        id: 'badge-5',
        name: 'Hot Streak',
        icon: 'fire',
        description: 'Check farm health for 30 consecutive days',
        progress: 47,
        rarity: 'epic',
      },
      {
        id: 'badge-6',
        name: 'Master Farmer',
        icon: 'trophy',
        description: 'Achieve 95+ farm score for 7 consecutive days',
        rarity: 'legendary',
      },
      {
        id: 'badge-7',
        name: 'Pest Hunter',
        icon: 'shield',
        description: 'Prevent 5 pest infestations through early detection',
        earnedDate: '2025-10-20T09:00:00Z',
        rarity: 'rare',
      },
      {
        id: 'badge-8',
        name: 'Data Scientist',
        icon: 'star',
        description: 'Log sensor data for 100+ data points',
        progress: 89,
        rarity: 'common',
      },
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'First Detection',
        description: 'Successfully identified your first plant health issue using AI diagnosis',
        unlockedDate: '2025-10-18T14:20:00Z',
        category: 'health',
      },
      {
        id: 'ach-2',
        title: 'Quick Response',
        description: 'Addressed a critical plant issue within 2 hours of detection',
        unlockedDate: '2025-10-22T11:45:00Z',
        category: 'efficiency',
      },
      {
        id: 'ach-3',
        title: 'Prevention Expert',
        description: 'Caught 3 issues before they reached critical status',
        unlockedDate: '2025-10-25T16:00:00Z',
        category: 'prevention',
      },
    ],
    trends: {
      healthImprovement: 23,
      responseTime: 3.5,
      preventionRate: 75,
    },
    roi: {
      costSaved: 243,
      yieldIncrease: 18,
      timeEfficiency: 5.5,
    },
  };
}

