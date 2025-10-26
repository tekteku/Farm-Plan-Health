import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import SpaTwoToneIcon from '@mui/icons-material/SpaTwoTone'
import GrassIcon from '@mui/icons-material/Grass'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import MicIcon from '@mui/icons-material/Mic';
import OverviewPanel from './components/OverviewPanel'
import PlantTable from './components/PlantTable'
import AlertsPanel from './components/AlertsPanel'
import DataUpload from './components/DataUpload'
import AmbientMode from './components/AmbientMode'
import ProactiveAdvisoryPanel from './components/ProactiveAdvisoryPanel'
import { fetchPlants } from './api/mockApi'
import type { Plant } from './types'

import { useAuth } from './auth'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isAmbientMode, setIsAmbientMode] = useState(false);
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPlants().then(setPlants)
  }, [])

  const handleLogout = () => {
    auth.signout(() => {
      navigate('/login')
    })
  }

  const metrics = useMemo(() => {
    if (plants.length === 0) {
      return {
        total: 0,
        healthyRate: 0,
        alertCount: 0,
        lastChecked: 'N/A',
      }
    }

    const healthy = plants.filter((plant) => plant.health === 'healthy').length
    const alertCount = plants.filter((plant) => plant.health === 'unhealthy').length
    const lastCheckedRaw = plants.reduce((latest, plant) => (
      plant.lastChecked > latest ? plant.lastChecked : latest
    ), plants[0]?.lastChecked ?? '')

    return {
      total: plants.length,
      healthyRate: Math.round((healthy / plants.length) * 100),
      alertCount,
      lastChecked: new Date(lastCheckedRaw).toLocaleString(),
    }
  }, [plants])

  if (isAmbientMode) {
    return <AmbientMode plants={plants} onExit={() => setIsAmbientMode(false)} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(45,106,79,0.08) 0%, rgba(64,145,108,0.18) 50%, rgba(255,255,255,0.9) 100%)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'radial-gradient(circle at 20% 20%, rgba(64,145,108,0.15), transparent 55%)',
              }}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Stack spacing={1} zIndex={1}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    <SpaTwoToneIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
                      Farm Intelligence
                    </Typography>
                    <Typography variant="h4">Farm Plant Health Dashboard</Typography>
                  </Box>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  Monitor plant vitality, respond to alerts faster, and keep your crops thriving with a unified command center.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Chip icon={<GrassIcon />} color="primary" label={`Healthy rate ${metrics.healthyRate}%`} sx={{ fontWeight: 600 }} />
                  <Chip icon={<WarningAmberIcon />} color={metrics.alertCount > 0 ? 'error' : 'success'} label={`${metrics.alertCount} active alerts`} sx={{ fontWeight: 600 }} />
                </Stack>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} zIndex={1}>
                <Button variant="contained" size="large" startIcon={<MicIcon />} onClick={() => setIsAmbientMode(true)}>
                  Ambient Mode
                </Button>
                <Button variant="outlined" size="large" onClick={handleLogout}>Logout</Button>
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4} zIndex={1}>
              <MetricTile label="Total Plants" value={metrics.total.toLocaleString()} />
              <MetricTile label="Last Check" value={metrics.lastChecked} />
            </Stack>
          </Paper>

          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Overview</Typography>
                <OverviewPanel plants={plants} />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <AlertsPanel plants={plants} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <ProactiveAdvisoryPanel plants={plants} />
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <PlantTable plants={plants} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <DataUpload />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{
      flex: 1,
      minWidth: { xs: '100%', sm: 180 },
      bgcolor: 'rgba(255,255,255,0.8)',
      borderRadius: 3,
      p: 2.5,
      border: '1px solid rgba(64,145,108,0.15)',
      backdropFilter: 'blur(6px)',
    }}>
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  )
}
