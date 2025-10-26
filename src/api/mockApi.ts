import plants from '../data/plants.json';
import type { Plant } from '../types';

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

