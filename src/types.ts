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
