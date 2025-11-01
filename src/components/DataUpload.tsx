import React, { useState, useCallback, useEffect } from 'react';
import { Button, Stack, Typography, Box, Paper, IconButton, LinearProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImages, fetchPlants } from '../api/mockApi';
import type { Plant } from '../types';
import AIDiagnosisModal from './AIDiagnosisModal';

export default function DataUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string>('');
  const [diagnosisPlant, setDiagnosisPlant] = useState<Plant | null>(null);
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);

  useEffect(() => {
    fetchPlants().then(setPlants);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))]);
    setUploadSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const removeFile = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
  };

  const handleUpload = async () => {
    if (!selectedPlantId) {
      alert('Please select a plant to associate with these photos');
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    try {
      const uploadedFiles = await uploadImages(files, selectedPlantId);
      setUploadSuccess(true);
      
      // Find the selected plant and trigger AI diagnosis
      const plant = plants.find(p => p.id === selectedPlantId);
      if (plant) {
        setDiagnosisPlant({ ...plant, photos: uploadedFiles.map(f => f.url) });
        setDiagnosisOpen(true);
      }
      
      setFiles([]); // Clear files after successful upload
      setSelectedPlantId(''); // Reset plant selection
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const previews = files.map((file, index) => (
    <Box key={index} sx={{ position: 'relative', display: 'inline-flex', m: 1 }}>
      <IconButton
        size="small"
        onClick={() => removeFile(file)}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <img
        src={(file as any).preview}
        alt={`preview ${file.name}`}
        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
        onLoad={() => { URL.revokeObjectURL((file as any).preview); }}
      />
    </Box>
  ));

  return (
    <div>
      <Typography variant="h6">Data Upload</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload plant photos for AI diagnosis or import sensor logs.
      </Typography>

      <Paper
        {...getRootProps()}
        variant="outlined"
        sx={{
          p: 3,
          mb: 2,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          borderStyle: 'dashed',
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
        <Typography color="text.secondary">
          {isDragActive ? 'Drop the images here...' : "Drag 'n' drop some images here, or click to select images"}
        </Typography>
      </Paper>

      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
          Take Photo
          <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))} />
        </Button>
        <Button variant="outlined">Upload CSV</Button>
        <Button variant="contained">Add Plant</Button>
      </Stack>

      {files.length > 0 && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Previews</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {previews}
          </Box>
          
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="plant-select-label">Select Plant</InputLabel>
            <Select
              labelId="plant-select-label"
              id="plant-select"
              value={selectedPlantId}
              label="Select Plant"
              onChange={(e) => setSelectedPlantId(e.target.value)}
            >
              {plants.map((plant) => (
                <MenuItem key={plant.id} value={plant.id}>
                  {plant.name} - {plant.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !selectedPlantId}
            sx={{ mt: 2 }}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} Image${files.length > 1 ? 's' : ''} & Get AI Diagnosis`}
          </Button>
        </Box>
      )}

      {uploading && <LinearProgress sx={{ mt: 2 }} />}
      {uploadSuccess && <Alert severity="success" sx={{ mt: 2 }}>Upload successful! Opening AI diagnosis...</Alert>}
      
      <AIDiagnosisModal 
        plant={diagnosisPlant} 
        open={diagnosisOpen} 
        onClose={() => {
          setDiagnosisOpen(false);
          setDiagnosisPlant(null);
        }} 
      />
    </div>
  );
}

