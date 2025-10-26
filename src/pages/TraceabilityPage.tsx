import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, Chip } from '@mui/material';
import plants from '../data/plants.json'; // Note: In a real app, you'd fetch this data

export default function TraceabilityPage() {
  const { plantId } = useParams<{ plantId: string }>();
  const plant = plants.find(p => p.id === plantId);

  if (!plant) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error">Plant not found</Typography>
        <Typography>The QR code is valid, but we could not locate matching harvest records.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Harvest Journey
          </Typography>
          <Typography variant="h5" component="h2" color="primary">
            {plant.name} ({plant.type})
          </Typography>
          <Chip label={`Harvested on ${new Date().toLocaleDateString()}`} sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Farmer notes:</strong> {plant.notes || 'No additional notes were recorded for this batch.'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            This crop was grown using precision irrigation and organic soil amendments tailored for {plant.type.toLowerCase()} varieties.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
