import plants from '../data/plants.json'
import type { Plant } from '../types'

export async function fetchPlants(): Promise<Plant[]> {
  // Simulate a small delay
  await new Promise((r) => setTimeout(r, 200))
  return plants as Plant[]
}
