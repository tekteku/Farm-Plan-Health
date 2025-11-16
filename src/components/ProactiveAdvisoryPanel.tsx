import React, { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ShieldIcon from '@mui/icons-material/Shield'
import TimelineIcon from '@mui/icons-material/Timeline'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import ScienceIcon from '@mui/icons-material/Science'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import type { Plant, HealthStatus } from '../types'

type AdvisoryFocus = 'opportunity' | 'efficiency' | 'risk'

interface Advisory {
  id: string
  title: string
  description: string
  type: AdvisoryFocus
  impact: string
  confidence: number
  window: string
  tags: string[]
}

interface ScenarioSimulation {
  id: string
  label: string
  summary: string
  readiness: number
  moisture: number
  riskDelta: number
  advisory: string
  leadIndicator: string
}

const HEALTH_PRIORITY: Record<HealthStatus, number> = {
  unhealthy: 0,
  'needs-check': 1,
  unknown: 2,
  healthy: 3,
}

const ADVISORY_THEME: Record<AdvisoryFocus, { bg: string; fg: string; label: string }> = {
  opportunity: { bg: 'rgba(34,197,94,0.15)', fg: '#15803d', label: 'Opportunity' },
  efficiency: { bg: 'rgba(59,130,246,0.15)', fg: '#1d4ed8', label: 'Efficiency' },
  risk: { bg: 'rgba(248,113,113,0.18)', fg: '#b91c1c', label: 'Risk' },
}

export default function ProactiveAdvisoryPanel({ plants }: { plants: Plant[] }) {
  const derivedSignals = useMemo(() => {
    if (plants.length === 0) {
      return {
        total: 0,
        counts: { healthy: 0, unhealthy: 0, needsCheck: 0, unknown: 0 },
        stabilityScore: 64,
        aiConfidence: 78,
        focusPlants: [] as Plant[],
      }
    }

    const counts = {
      healthy: plants.filter((plant) => plant.health === 'healthy').length,
      unhealthy: plants.filter((plant) => plant.health === 'unhealthy').length,
      needsCheck: plants.filter((plant) => plant.health === 'needs-check').length,
      unknown: plants.filter((plant) => plant.health === 'unknown').length,
    }

    const focusPlants = [...plants]
      .sort((a, b) => {
        const priority = HEALTH_PRIORITY[a.health] - HEALTH_PRIORITY[b.health]
        if (priority !== 0) return priority
        return Date.parse(b.lastChecked) - Date.parse(a.lastChecked)
      })
      .slice(0, 4)

    const stressPenalty = counts.unhealthy * 12 + counts.needsCheck * 7 + counts.unknown * 4

    return {
      total: plants.length,
      counts,
      stabilityScore: Math.max(35, 100 - stressPenalty),
      aiConfidence: 75 + Math.min(18, Math.round(plants.length / 2)),
      focusPlants,
    }
  }, [plants])

  const scenarioDeck = useMemo<ScenarioSimulation[]>(() => {
    const { counts, stabilityScore } = derivedSignals
    const baseMoisture = Math.max(32, 74 - counts.needsCheck * 2 - counts.unhealthy * 4)
    const pathogenRisk = 28 + counts.unhealthy * 6 + counts.unknown * 3

    return [
      {
        id: 'baseline',
        label: 'Baseline',
        summary: 'Status quo with current treatments holding steady.',
        readiness: stabilityScore,
        moisture: baseMoisture,
        riskDelta: -4,
        advisory: 'Hold cadence, validate drift sensors in 8h, log photo proof.',
        leadIndicator: 'Moisture plateauing inside target band.',
      },
      {
        id: 'heatwave',
        label: 'Heat Spike +4°C',
        summary: 'Forecast shows rapid evapotranspiration risk.',
        readiness: Math.max(30, stabilityScore - 18),
        moisture: Math.max(18, baseMoisture - 14),
        riskDelta: +9,
        advisory: 'Pre-charge drip loops, deploy shading mesh on vulnerable rows.',
        leadIndicator: 'Leaf temp divergence beyond 2.5°C tolerance.',
      },
      {
        id: 'pathogen',
        label: 'Humidity Surge',
        summary: 'High humidity spike could trigger botrytis clusters.',
        readiness: Math.min(96, stabilityScore + 6),
        moisture: Math.min(92, baseMoisture + 11),
        riskDelta: pathogenRisk / 10,
        advisory: 'Queue airflow purge + copper-based foliar rotation.',
        leadIndicator: 'Spores detected on micro-camera channel 2.',
      },
    ]
  }, [derivedSignals])

  const [activeScenarioId, setActiveScenarioId] = useState(() => scenarioDeck[0]?.id ?? 'baseline')

  useEffect(() => {
    if (scenarioDeck.length === 0) return
    const stillValid = scenarioDeck.some((scenario) => scenario.id === activeScenarioId)
    if (!stillValid) {
      setActiveScenarioId(scenarioDeck[0].id)
    }
  }, [scenarioDeck, activeScenarioId])

  const activeScenario = scenarioDeck.find((scenario) => scenario.id === activeScenarioId) ?? scenarioDeck[0]

  const advisories = useMemo<Advisory[]>(() => {
    const { counts, focusPlants, aiConfidence } = derivedSignals
    const frontline = focusPlants[0]?.name ?? 'priority block'
    const diversityFlag = new Set(plants.map((plant) => plant.type)).size <= 2

    return [
      {
        id: 'adv-hydration',
        title: `Precision hydration for ${frontline}`,
        description: 'Blend 2-phase irrigation: short pulse now, verification pulse in 6h to keep stress under 40%.',
        type: counts.unhealthy > 0 ? 'risk' : 'efficiency',
        impact: counts.unhealthy > 0 ? 'Stability +18%' : 'Water savings 9%',
        confidence: aiConfidence,
        window: 'Execute within 4h',
        tags: ['Moisture AI', 'Telemetry'],
      },
      {
        id: 'adv-airflow',
        title: 'Airflow purge & bio-shield',
        description: 'Rotate fans clockwise for 30 min and atomize Bacillus-based inoculant along row edges.',
        type: 'risk',
        impact: 'Pathogen risk -32%',
        confidence: Math.min(98, aiConfidence + 6),
        window: 'Tonight between 22:00–23:00',
        tags: ['Botrytis watch', 'Night ops'],
      },
      {
        id: 'adv-diversify',
        title: 'Regenerative rotation unlock',
        description: diversityFlag
          ? 'Introduce cover crop strips to rebalance microbiome before next cycle.'
          : 'Rotation plan already diversified. Maintain and log outcomes.',
        type: diversityFlag ? 'opportunity' : 'efficiency',
        impact: diversityFlag ? 'Soil vitality +22%' : 'Baseline sustained',
        confidence: 72,
        window: 'Plan this week',
        tags: ['Soil lab', 'Carbon'],
      },
    ]
  }, [derivedSignals, plants])

  const operationalQueue = useMemo(() => {
    return derivedSignals.focusPlants.map((plant, index) => ({
      id: `queue-${plant.id}`,
      plantName: plant.name,
      focus: plant.health === 'unhealthy' ? 'Escalate remediation kit' : 'Sensor + photo audit',
      eta: index === 0 ? 'Now' : `${index * 2}h`,
      severity: plant.health === 'unhealthy' ? 'critical' : plant.health === 'needs-check' ? 'priority' : 'monitor',
      lastCheck: new Date(plant.lastChecked).toLocaleString(),
    }))
  }, [derivedSignals.focusPlants])

  const playbooks = useMemo(
    () => [
      {
        id: 'playbook-rehydrate',
        title: 'Rapid rehydration',
        summary: 'Nested drip + foliar mist for heatwave buffer.',
        icon: <WaterDropIcon fontSize="small" />,
        benefit: '+7% stress resilience',
      },
      {
        id: 'playbook-shield',
        title: 'Bio-shield deploy',
        summary: 'Dual microbe spray targeting fungal spores.',
        icon: <ShieldIcon fontSize="small" />,
        benefit: 'Pathogen risk -28%',
      },
      {
        id: 'playbook-scout',
        title: 'AI scout loop',
        summary: 'Capture macro/micro set – auto-upload to AI.',
        icon: <ScienceIcon fontSize="small" />,
        benefit: 'Confidence +11%',
      },
    ],
    []
  )

  const riskScore = derivedSignals.total === 0 ? 0 : Math.round((derivedSignals.counts.unhealthy / derivedSignals.total) * 100)

  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, background: 'linear-gradient(145deg, rgba(45,106,79,0.08), rgba(15,23,42,0.05))' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          <AutoAwesomeIcon />
        </Avatar>
        <div>
          <Typography variant="overline" sx={{ letterSpacing: 1 }}>AI COPILOT</Typography>
          <Typography variant="h5">Proactive Command Bridge</Typography>
        </div>
      </Stack>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={7}>
          <Stack spacing={3} height="100%">
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Live mission snapshot</Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>{derivedSignals.counts.unhealthy + derivedSignals.counts.needsCheck} plants flagged</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                      <Chip size="small" label={`AI confidence ${derivedSignals.aiConfidence}%`} color="primary" />
                      <Chip size="small" label={`Stability ${derivedSignals.stabilityScore}%`} color="success" />
                      <Chip size="small" label={`Risk ${riskScore}%`} color={riskScore > 35 ? 'error' : 'default'} />
                    </Stack>
                  </Box>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">Stability trajectory</Typography>
                    <Typography variant="h3" sx={{ mt: 1 }}>{derivedSignals.stabilityScore}%</Typography>
                    <LinearProgress variant="determinate" value={derivedSignals.stabilityScore} sx={{ mt: 1, height: 8, borderRadius: 999 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Goal ≥ 82%</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Scenario lab</Typography>
                <ButtonGroup size="small" sx={{ mb: 2, flexWrap: 'wrap' }}>
                  {scenarioDeck.map((scenario) => (
                    <Button
                      key={scenario.id}
                      variant={scenario.id === activeScenario?.id ? 'contained' : 'outlined'}
                      onClick={() => setActiveScenarioId(scenario.id)}
                      sx={{ textTransform: 'none' }}
                    >
                      {scenario.label}
                    </Button>
                  ))}
                </ButtonGroup>

                {activeScenario && (
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle1">{activeScenario.summary}</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(37,99,235,0.08)' }}>
                        <Typography variant="caption" color="text.secondary">Readiness</Typography>
                        <Typography variant="h5">{activeScenario.readiness}%</Typography>
                        <LinearProgress variant="determinate" value={activeScenario.readiness} sx={{ mt: 1, height: 6, borderRadius: 999 }} />
                      </Box>
                      <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(15,118,110,0.08)' }}>
                        <Typography variant="caption" color="text.secondary">Moisture trajectory</Typography>
                        <Typography variant="h5">{activeScenario.moisture}%</Typography>
                        <Typography variant="body2" color="text.secondary">Δ {activeScenario.riskDelta > 0 ? '+' : ''}{activeScenario.riskDelta} risk</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">Lead indicator: {activeScenario.leadIndicator}</Typography>
                    <Typography variant="body1">Next action: {activeScenario.advisory}</Typography>
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                    <RocketLaunchIcon />
                  </Avatar>
                  <div>
                    <Typography variant="subtitle1">Priority workstreams</Typography>
                    <Typography variant="body2" color="text.secondary">AI-ranked sequences ready for execution</Typography>
                  </div>
                </Stack>

                <Stack spacing={2}>
                  {advisories.map((advisory) => (
                    <Box key={advisory.id} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'rgba(15,23,42,0.08)' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip
                              size="small"
                              label={ADVISORY_THEME[advisory.type].label}
                              sx={{ bgcolor: ADVISORY_THEME[advisory.type].bg, color: ADVISORY_THEME[advisory.type].fg }}
                            />
                            <Typography variant="caption" color="text.secondary">{advisory.window}</Typography>
                          </Stack>
                          <Typography variant="subtitle1">{advisory.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{advisory.description}</Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="subtitle2">{advisory.impact}</Typography>
                          <Typography variant="caption" color="text.secondary">{advisory.confidence}% confidence</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                        {advisory.tags.map((tag) => (
                          <Chip key={tag} size="small" label={tag} variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                    <TimelineIcon />
                  </Avatar>
                  <div>
                    <Typography variant="subtitle1">Operational queue</Typography>
                    <Typography variant="body2" color="text.secondary">Top plants staged for action</Typography>
                  </div>
                </Stack>
                {operationalQueue.length === 0 ? (
                  <Typography color="text.secondary">No active interventions queued. Keep monitoring sensors.</Typography>
                ) : (
                  <List dense>
                    {operationalQueue.map((item) => (
                      <ListItem key={item.id} disableGutters sx={{ alignItems: 'flex-start', py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'rgba(15,23,42,0.06)', color: 'text.primary' }}>
                            {item.plantName.slice(0, 2).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle2">{item.plantName}</Typography>
                              <Chip
                                size="small"
                                label={item.severity}
                                color={item.severity === 'critical' ? 'error' : item.severity === 'priority' ? 'warning' : 'default'}
                              />
                            </Stack>
                          }
                          secondary={
                            <Stack spacing={0.5}>
                              <Typography variant="body2">{item.focus}</Typography>
                              <Typography variant="caption" color="text.secondary">Last check {item.lastCheck} · ETA {item.eta}</Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                    <WbSunnyIcon />
                  </Avatar>
                  <div>
                    <Typography variant="subtitle1">Rapid response playbooks</Typography>
                    <Typography variant="body2" color="text.secondary">One-click actions synced to AI advice</Typography>
                  </div>
                </Stack>
                <Stack spacing={2}>
                  {playbooks.map((playbook) => (
                    <Box key={playbook.id} sx={{ p: 2, borderRadius: 3, border: '1px dashed rgba(15,23,42,0.2)' }}>
                      <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: 'rgba(15,23,42,0.05)', color: 'primary.main', width: 28, height: 28 }}>
                              {playbook.icon}
                            </Avatar>
                            <Typography variant="subtitle2">{playbook.title}</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">{playbook.summary}</Typography>
                          <Typography variant="caption" color="success.main">{playbook.benefit}</Typography>
                        </Stack>
                        <Tooltip title="Trigger in workflow (coming soon)">
                          <span>
                            <Button variant="contained" size="small" disabled startIcon={<CheckCircleIcon fontSize="small" />}>
                              Launch
                            </Button>
                          </span>
                        </Tooltip>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
                    <WarningAmberIcon />
                  </Avatar>
                  <div>
                    <Typography variant="subtitle1">Signal glossary</Typography>
                    <Typography variant="body2" color="text.secondary">Keep the team aligned on triggers</Typography>
                  </div>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(248,113,113,0.12)' }}>
                      <Typography variant="caption" color="text.secondary">Critical trigger</Typography>
                      <Typography variant="subtitle1">AI stress index &gt; 65</Typography>
                      <Typography variant="body2" color="text.secondary">Escalate remediation squad immediately.</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(34,197,94,0.12)' }}>
                      <Typography variant="caption" color="text.secondary">Opportunity trigger</Typography>
                      <Typography variant="subtitle1">Diversity ratio &lt; 2</Typography>
                      <Typography variant="body2" color="text.secondary">Slot regenerative rotation into sprint board.</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}
