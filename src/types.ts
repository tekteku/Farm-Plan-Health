export type HealthStatus = 'healthy' | 'unhealthy' | 'needs-check' | 'unknown'

export interface Plant {
  id: string
  name: string
  type: string
  location?: { lat: number; lng: number }
  health: HealthStatus
  lastChecked: string
  notes?: string
  photos?: string[]
}

// Health Timeline Types
export interface HealthSnapshot {
  id: string
  plantId: string
  timestamp: string
  health: HealthStatus
  photoUrl?: string
  aiAnalysis: {
    leafColor: string
    diseaseIndicators: string[]
    healthScore: number // 0-100
    confidence: number
  }
  sensorData?: {
    soilMoisture?: number
    temperature?: number
    humidity?: number
  }
  treatment?: string
  notes?: string
}

// Farm Performance Types
export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earnedDate?: string
  progress?: number // 0-100 if in progress
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedDate: string
  category: 'health' | 'efficiency' | 'prevention' | 'documentation'
}

export interface FarmPerformanceMetrics {
  overallScore: number // 0-100
  badges: Badge[]
  achievements: Achievement[]
  trends: {
    healthImprovement: number // week-over-week %
    responseTime: number // average hours to address issues
    preventionRate: number // % of caught-early issues
  }
  roi: {
    costSaved: number // $ saved by early detection
    yieldIncrease: number // % yield improvement estimate
    timeEfficiency: number // hours saved per week
  }
  weeklyGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  streak: number // days of consecutive monitoring
}
