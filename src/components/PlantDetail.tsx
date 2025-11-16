import React, { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import HistoryIcon from '@mui/icons-material/History'
import SpaIcon from '@mui/icons-material/Spa'
import BoltIcon from '@mui/icons-material/Bolt'
import TimelineIcon from '@mui/icons-material/Timeline'
import OpacityIcon from '@mui/icons-material/Opacity'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import GrainIcon from '@mui/icons-material/Grain'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import type { Plant, HealthSnapshot } from '../types'
import PlantHealthTimeline from './PlantHealthTimeline'
import { fetchHealthSnapshots } from '../api/mockApi'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
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
  )
}

const HEALTH_STATUS_THEME: Record<Plant['health'], { label: string; chipColor: 'success' | 'warning' | 'error' | 'default'; gradient: string; accent: string }> = {
  healthy: {
    label: 'Healthy',
    chipColor: 'success',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #22c55e 60%, #166534 100%)',
    accent: '#22c55e',
  },
  'needs-check': {
    label: 'Needs Check',
    chipColor: 'warning',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #f97316 60%, #ea580c 100%)',
    accent: '#f97316',
  },
  unhealthy: {
    label: 'Critical',
    chipColor: 'error',
    gradient: 'linear-gradient(135deg, #be123c 0%, #f43f5e 60%, #9f1239 100%)',
    accent: '#f43f5e',
  },
  unknown: {
    label: 'Unknown',
    chipColor: 'default',
    gradient: 'linear-gradient(135deg, #334155 0%, #64748b 60%, #0f172a 100%)',
    accent: '#94a3b8',
  },
}

const ACTION_LIBRARY: Record<Plant['health'], string[]> = {
  healthy: ['Maintain current irrigation plan', 'Schedule preventative foliar spray', 'Log sensor calibration weekly'],
  'needs-check': ['Run AI diagnosis with new photo set', 'Inspect nutrient mix before next irrigation', 'Increase monitoring cadence to every 6 hours'],
  unhealthy: ['Trigger remediation workflow with agronomist', 'Isolate plant row to prevent spread', 'Upload follow-up photos after treatment'],
  unknown: ['Capture additional sensor data points', 'Upload macro + micro photos for AI comparison', 'Verify sensor connectivity and firmware'],
}

function formatRelativeTime(dateStr: string) {
  const ts = Date.parse(dateStr)
  if (Number.isNaN(ts)) return 'Unknown'
  const diffMs = Date.now() - ts
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function MetricCard({ label, value, caption, Icon }: { label: string; value: string; caption?: string; Icon: React.ElementType }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 36, height: 36 }}>
            <Icon fontSize="small" />
          </Avatar>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {label}
          </Typography>
        </Stack>
        <Typography variant="h5">{value}</Typography>
        {caption && (
          <Typography variant="body2" color="text.secondary">
            {caption}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default function PlantDetail({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  const [tabValue, setTabValue] = useState(0)
  const [healthSnapshots, setHealthSnapshots] = useState<HealthSnapshot[]>([])
  const [loadingSnapshots, setLoadingSnapshots] = useState(true)

  const statusTheme = HEALTH_STATUS_THEME[plant.health]

  useEffect(() => {
    setLoadingSnapshots(true)
    fetchHealthSnapshots(plant.id)
      .then(setHealthSnapshots)
      .finally(() => setLoadingSnapshots(false))
  }, [plant.id])

  const latestSnapshot = healthSnapshots[healthSnapshots.length - 1]
  const previousSnapshot = healthSnapshots[healthSnapshots.length - 2]
  const healthDelta = latestSnapshot && previousSnapshot
    ? latestSnapshot.aiAnalysis.healthScore - previousSnapshot.aiAnalysis.healthScore
    : null
  const aiConfidence = latestSnapshot?.aiAnalysis.confidence ?? 82
  const aiHealthScore = latestSnapshot?.aiAnalysis.healthScore ?? (plant.health === 'healthy' ? 88 : plant.health === 'unhealthy' ? 52 : 68)
  const lastCheckedRelative = formatRelativeTime(plant.lastChecked)
  const recommendedActions = ACTION_LIBRARY[plant.health]
  const photos = plant.photos ?? []
  const hasPhotos = photos.length > 0
  const timelinePreview = healthSnapshots.slice(-3).reverse()

  const aiNarrative = useMemo(() => {
    if (!latestSnapshot) {
      return 'AI has not ingested recent imagery for this plant. Upload a new diagnostic photo set to unlock guidance.'
    }
    const direction = healthDelta && healthDelta >= 0 ? 'improving' : 'declining'
    const actionLine = direction === 'improving'
      ? 'Continue the current remediation routine and confirm stability in 24 hours.'
      : 'Escalate to agronomist review and collect leaf samples if decline continues.'
    const issues = latestSnapshot.aiAnalysis.diseaseIndicators.length > 0
      ? `Key signals: ${latestSnapshot.aiAnalysis.diseaseIndicators.join(', ')}.`
      : 'No disease signatures detected in the last scan.'
    return `${issues} Trend is ${direction} with ${aiConfidence}% confidence. ${actionLine}`
  }, [latestSnapshot, healthDelta, aiConfidence])

  const sensorSignals = useMemo(() => {
    const base = latestSnapshot?.sensorData ?? {}
    const fallbackMoisture = plant.health === 'unhealthy' ? 42 : plant.health === 'needs-check' ? 55 : 67
    const fallbackTemp = plant.health === 'unhealthy' ? 25.5 : 23.5
    const fallbackHumidity = plant.health === 'unhealthy' ? 58 : 64
    return [
      {
        label: 'Soil moisture',
        value: (base.soilMoisture ?? fallbackMoisture).toFixed(1),
        unit: '%',
        Icon: OpacityIcon,
        band: base.soilMoisture && base.soilMoisture >=     55 ? 'Optimal' : 'Needs balance',
      },
      {
        label: 'Canopy temp',
        value: (base.temperature ?? fallbackTemp).toFixed(1),
        unit: '°C',
        Icon: DeviceThermostatIcon,
        band: (base.temperature ?? fallbackTemp) > 26 ? 'High' : 'Stable',
      },
      {
        label: 'Ambient humidity',
        value: (base.humidity ?? fallbackHumidity).toFixed(0),
        unit: '%',
        Icon: GrainIcon,
        band: (base.humidity ?? fallbackHumidity) < 55 ? 'Low' : 'Balanced',
      },
    ]
  }, [latestSnapshot, plant.health])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{plant.name}</Typography>
          <Chip label={statusTheme.label} color={statusTheme.chipColor} variant="filled" size="small" />
        </Stack>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="plant detail tabs">
          <Tab icon={<InfoIcon />} iconPosition="start" label="Overview" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Health Timeline" />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{ p: 3, minHeight: 460 }}>
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                color: 'common.white',
                background: statusTheme.gradient,
              }}
            >
              <Box sx={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 60%)' }} />
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} zIndex={1}>
                <Stack spacing={1}>
                  <Typography variant="overline" sx={{ letterSpacing: 1 }}>Plant profile</Typography>
                  <Typography variant="h4">{plant.name}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip icon={<SpaIcon />} label={plant.type} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.2)', color: 'common.white' }} />
                    <Chip icon={<BoltIcon />} label={`Last check ${lastCheckedRelative}`} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.2)', color: 'common.white' }} />
                    <Chip icon={<CameraAltIcon />} label={`${plant.photos?.length ?? 0} photos`} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.2)', color: 'common.white' }} />
                  </Stack>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    ID {plant.id}
                  </Typography>
                </Stack>
                <Grid container spacing={2} maxWidth={{ md: 420 }}>
                  <Grid item xs={12} sm={4}>
                    <MetricCard
                      label="Health score"
                      value={`${aiHealthScore}%`}
                      caption={healthDelta ? `${healthDelta >= 0 ? '+' : ''}${healthDelta.toFixed(1)}% vs last scan` : 'Awaiting delta'}
                      Icon={TimelineIcon}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MetricCard label="AI confidence" value={`${aiConfidence}%`} caption="Model agreement" Icon={AutoAwesomeIcon} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MetricCard label="Check cadence" value={lastCheckedRelative} caption="Next verification in 12h" Icon={HistoryIcon} />
                  </Grid>
                </Grid>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                        <InfoIcon />
                      </Avatar>
                      <div>
                        <Typography variant="subtitle1">Care briefing</Typography>
                        <Typography variant="body2" color="text.secondary">AI-generated insight plus human notes</Typography>
                      </div>
                    </Stack>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {aiNarrative}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Recommended actions</Typography>
                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                      {recommendedActions.map((action) => (
                        <Stack key={action} direction="row" spacing={1.5} alignItems="center">
                          <BoltIcon sx={{ color: statusTheme.accent }} fontSize="small" />
                          <Typography variant="body2">{action}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    {plant.notes && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Field notes</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{plant.notes}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                        <OpacityIcon />
                      </Avatar>
                      <div>
                        <Typography variant="subtitle1">Sensor pulse</Typography>
                        <Typography variant="body2" color="text.secondary">Telemetry powering AI forecasts</Typography>
                      </div>
                    </Stack>
                    <Grid container spacing={2}>
                      {sensorSignals.map(({ label, value, unit, Icon, band }) => (
                        <Grid item xs={12} key={label}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              border: '1px solid',
                              borderColor: 'rgba(15,23,42,0.08)',
                              bgcolor: 'rgba(15,118,110,0.05)',
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ bgcolor: 'common.white', color: 'primary.main', width: 36, height: 36 }}>
                                <Icon fontSize="small" />
                              </Avatar>
                              <div>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>{label}</Typography>
                                <Typography variant="h6">{value}{unit}</Typography>
                                <Typography variant="body2" color="text.secondary">{band}</Typography>
                              </div>
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {hasPhotos && (
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Photo intelligence</Typography>
                    <Chip label={`${photos.length} assets`} size="small" />
                  </Stack>
                  <Grid container spacing={1.5}>
                    {photos.map((photoUrl, index) => (
                      <Grid item xs={12} sm={index === 0 && photos.length > 1 ? 6 : 3} key={`${photoUrl}-${index}`}>
                        <Tooltip title="Open full resolution">
                          <Box
                            component="img"
                            src={photoUrl}
                            alt={`${plant.name} photo ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: index === 0 && photos.length > 1 ? 220 : 140,
                              objectFit: 'cover',
                              borderRadius: 3,
                              cursor: 'pointer',
                              boxShadow: '0 8px 24px rgba(15,23,42,0.25)',
                            }}
                            onClick={() => window.open(photoUrl, '_blank')}
                          />
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                    <TimelineIcon />
                  </Avatar>
                  <div>
                    <Typography variant="subtitle1">Latest recovery signals</Typography>
                    <Typography variant="body2" color="text.secondary">Snapshot of the last AI assessments</Typography>
                  </div>
                </Stack>
                {loadingSnapshots ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={28} />
                  </Box>
                ) : timelinePreview.length === 0 ? (
                  <Typography color="text.secondary">No health snapshots available yet.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {timelinePreview.map((snapshot) => (
                      <Box key={snapshot.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle2">{new Date(snapshot.timestamp).toLocaleDateString()}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {snapshot.aiAnalysis.healthScore}% health · {snapshot.aiAnalysis.diseaseIndicators[0] ?? 'No alerts'}
                          </Typography>
                        </Stack>
                        <Chip label={snapshot.health.replace('-', ' ')} color={snapshot.health === 'healthy' ? 'success' : snapshot.health === 'unhealthy' ? 'error' : 'warning'} size="small" />
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loadingSnapshots ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
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
