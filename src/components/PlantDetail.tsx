import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Stack, Box, Grid, Tabs, Tab, CircularProgress } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import InfoIcon from '@mui/icons-material/Info'
import type { Plant, HealthSnapshot } from '../types'
import PlantHealthTimeline from './PlantHealthTimeline'
import { fetchHealthSnapshots } from '../api/mockApi'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plant-detail-tabpanel-${index}`}
      aria-labelledby={`plant-detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function PlantDetail({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  const [tabValue, setTabValue] = useState(0);
  const [healthSnapshots, setHealthSnapshots] = useState<HealthSnapshot[]>([]);
  const [loadingSnapshots, setLoadingSnapshots] = useState(false);

  const healthStatusLabel: Record<Plant['health'], string> = {
    healthy: 'Healthy',
    'needs-check': 'Needs Check',
    unhealthy: 'Unhealthy',
    unknown: 'Unknown',
  };

  useEffect(() => {
    if (tabValue === 1 && healthSnapshots.length === 0) {
      setLoadingSnapshots(true);
      fetchHealthSnapshots(plant.id)
        .then(setHealthSnapshots)
        .finally(() => setLoadingSnapshots(false));
    }
  }, [tabValue, plant.id, healthSnapshots.length]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{plant.name}</Typography>
          <Chip
            label={healthStatusLabel[plant.health]}
            size="small"
            color={plant.health === 'healthy' ? 'success' : (plant.health === 'unhealthy' ? 'error' : 'warning')}
            variant={plant.health === 'healthy' ? 'outlined' : 'filled'}
          />
        </Stack>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="plant detail tabs">
          <Tab icon={<InfoIcon />} iconPosition="start" label="Overview" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Health Timeline" />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{ p: 3, minHeight: 400 }}>
        <TabPanel value={tabValue} index={0}>
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
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>ID</Typography>
                  <Typography variant="body1" fontFamily="monospace">{plant.id}</Typography>
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loadingSnapshots ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
              <CircularProgress />
            </Box>
          ) : (
            <PlantHealthTimeline snapshots={healthSnapshots} plantName={plant.name} />
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary">Mark as Checked</Button>
      </DialogActions>
    </Dialog>
  )
}
