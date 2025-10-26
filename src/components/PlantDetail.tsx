import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Stack, Box, Grid } from '@mui/material'
import type { Plant } from '../types'

export default function PlantDetail({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  const healthStatusLabel: Record<Plant['health'], string> = {
    healthy: 'Healthy',
    'needs-check': 'Needs Check',
    unhealthy: 'Unhealthy',
    unknown: 'Unknown',
  };
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{plant.name}</DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Type</Typography>
                <Typography variant="body1" fontWeight="medium">{plant.type}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Health Status</Typography>
                <Chip
                  label={healthStatusLabel[plant.health]}
                  size="small"
                  color={plant.health === 'healthy' ? 'success' : (plant.health === 'unhealthy' ? 'error' : 'warning')}
                  variant={plant.health === 'healthy' ? 'outlined' : 'filled'}
                />
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Last Checked</Typography>
            <Typography variant="body1">{new Date(plant.lastChecked).toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Notes</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {plant.notes ?? 'No notes recorded.'}
            </Typography>
          </Box>
          {plant.photos && plant.photos.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Photos ({plant.photos.length})
              </Typography>
              <Grid container spacing={1}>
                {plant.photos.map((photoUrl, index) => (
                  <Grid item xs={4} key={index}>
                    <img
                      src={photoUrl}
                      alt={`${plant.name} photo ${index + 1}`}
                      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => window.open(photoUrl, '_blank')}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary">Mark as Checked</Button>
      </DialogActions>
    </Dialog>
  )
}
