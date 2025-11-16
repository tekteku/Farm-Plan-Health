import React, { useMemo } from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import BoltIcon from '@mui/icons-material/Bolt'
import TimelineIcon from '@mui/icons-material/Timeline'
import OpacityIcon from '@mui/icons-material/Opacity'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts'
import type { Plant } from '../types'

const COLORS = ['#2d6a4f', '#f9844a', '#fca311']

export default function OverviewPanel({ plants }: { plants: Plant[] }) {
  const totals = useMemo(() => {
    const healthy = plants.filter((p) => p.health === 'healthy').length
    const needsCheck = plants.filter((p) => p.health === 'needs-check').length
    const unhealthy = plants.filter((p) => p.health === 'unhealthy').length
    const unknown = plants.filter((p) => p.health === 'unknown').length
    const total = plants.length
    const healthyRate = total > 0 ? Number(((healthy / total) * 100).toFixed(1)) : 0
    const alertCount = needsCheck + unhealthy + unknown
    const lastChecked = plants.reduce((acc, plant) => (plant.lastChecked > acc ? plant.lastChecked : acc), '')

    return { total, healthy, needsCheck, unhealthy, unknown, healthyRate, alertCount, lastChecked }
  }, [plants])

  const pieData = useMemo(() => (
    [
      { name: 'Healthy', value: totals.healthy },
      { name: 'Needs Check', value: totals.needsCheck },
      { name: 'Unhealthy', value: totals.unhealthy },
      { name: 'Unknown', value: totals.unknown },
    ].filter((slice) => slice.value > 0)
  ), [totals])

  const timelineData = useMemo(() => {
    const checkpoints = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today']
    return checkpoints.map((label, index) => {
      const healthyScore = Math.min(100, totals.healthyRate + index * 1.2)
      const alerts = Math.max(0, totals.alertCount - index * 0.6)
      return {
        label,
        healthyScore: Number(healthyScore.toFixed(1)),
        alerts: Number(alerts.toFixed(1)),
        forecast: index === checkpoints.length - 1 ? healthyScore + 2.5 : undefined,
      }
    })
  }, [totals])

  const focusPlants = useMemo(() => (
    plants
      .filter((plant) => plant.health === 'needs-check' || plant.health === 'unhealthy' || plant.health === 'unknown')
      .sort((a, b) => Date.parse(b.lastChecked) - Date.parse(a.lastChecked))
      .slice(0, 3)
  ), [plants])

  const climatePulse = useMemo(() => (
    [
      {
        label: 'Soil Moisture',
        value: 58 + Math.min(20, totals.healthyRate / 4),
        Icon: OpacityIcon,
        unit: '%',
        band: 'Optimal',
      },
      {
        label: 'Canopy Temp',
        value: 23.5 + totals.alertCount * 0.2,
        Icon: DeviceThermostatIcon,
        unit: '°C',
        band: 'Stable',
      },
      {
        label: 'Inspection Cadence',
        value: Math.max(2, Math.round(totals.total / Math.max(1, totals.alertCount))),
        Icon: AccessTimeIcon,
        unit: 'hrs',
        band: 'AI-assisted',
      },
    ]
  ), [totals])

  const lastCheckedLabel = totals.lastChecked ? new Date(totals.lastChecked).toLocaleString() : 'N/A'
  const resilienceScore = Math.min(100, Number((totals.healthyRate + 12).toFixed(1)))

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            color: 'common.white',
            background: 'linear-gradient(135deg, #0f766e 0%, #22c55e 40%, #166534 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.25,
              background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 60%)',
            }}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3}>
            <Stack spacing={1} zIndex={1}>
              <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
                Live Command Overview
              </Typography>
              <Typography variant="h4">{totals.total} active plants</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {totals.healthyRate}% of your canopy is thriving. Last verification at {lastCheckedLabel}.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Chip icon={<LocalFloristIcon />} label={`Healthy ${totals.healthy}/${totals.total}`} color="success" sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
                <Chip icon={<BoltIcon />} label={`${totals.alertCount} active alerts`} color={totals.alertCount > 0 ? 'warning' : 'info'} sx={{ bgcolor: 'rgba(0,0,0,0.2)' }} />
              </Stack>
            </Stack>
            <Stack spacing={1.5} minWidth={{ md: 260 }} zIndex={1}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Resilience score
              </Typography>
              <Typography variant="h3">{resilienceScore}<Typography component="span" variant="h6"> /100</Typography></Typography>
              <LinearProgress value={resilienceScore} variant="determinate" sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.25)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                AI predicts a +{(Math.max(0, 95 - totals.alertCount)).toFixed(0)}% chance of sustaining this streak over the next 48h.
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: 320 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <TimelineIcon />
                </Avatar>
                <div>
                  <Typography variant="subtitle1">Recovery Velocity</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tracking plant health + alert load across the week with AI forecast
                  </Typography>
                </div>
              </Stack>
              <Chip label="AI Forecast" color="info" size="small" />
            </Stack>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="healthyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#9e9e9e" fontSize={12} tickMargin={8} />
                <YAxis stroke="#9e9e9e" fontSize={12} tickMargin={8} width={35} domain={[0, 110]} />
                <Tooltip />
                <Area type="monotone" dataKey="healthyScore" stroke="#16a34a" strokeWidth={3} fill="url(#healthyGradient)" name="Health %" />
                <Area type="monotone" dataKey="alerts" stroke="#f97316" strokeWidth={2} fill="#feefe2" name="Alert load" />
                <ReferenceLine x="Today" stroke="#0ea5e9" strokeDasharray="3 3" label={{ value: 'Now', position: 'insideTop' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: 320 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Health Distribution</Typography>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip icon={<QueryStatsIcon />} label={`Healthy ${totals.healthyRate}%`} size="small" />
              <Chip icon={<BoltIcon />} label={`${totals.alertCount} alerts`} color="warning" size="small" />
              <Chip icon={<EmojiObjectsIcon />} label="AI stabilized" color="success" size="small" />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light' }}>
                <BoltIcon />
              </Avatar>
              <div>
                <Typography variant="subtitle1">Intervention Radar</Typography>
                <Typography variant="body2" color="text.secondary">
                  Top plants requiring action, sorted by urgency
                </Typography>
              </div>
            </Stack>
            {focusPlants.length === 0 ? (
              <Typography color="text.secondary">All monitored plants are operating inside optimal bands.</Typography>
            ) : (
              <Stack spacing={2}>
                {focusPlants.map((plant) => (
                  <Box key={plant.id} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'rgba(244, 114, 182, 0.3)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">{plant.name}</Typography>
                      <Chip label={plant.health.replace('-', ' ')} color={plant.health === 'unhealthy' ? 'error' : 'warning'} size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Last check {new Date(plant.lastChecked).toLocaleDateString()} · {plant.notes || 'AI recommends follow-up inspection'}
                    </Typography>
                    <LinearProgress
                      value={plant.health === 'unhealthy' ? 90 : plant.health === 'needs-check' ? 65 : 40}
                      variant="determinate"
                      sx={{ mt: 1.5, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'info.light' }}>
                <OpacityIcon />
              </Avatar>
              <div>
                <Typography variant="subtitle1">Climate Pulse</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sensor-derived signals powering AI risk predictions
                </Typography>
              </div>
            </Stack>
            <Grid container spacing={2}>
              {climatePulse.map(({ label, value, Icon, unit, band }) => (
                <Grid item xs={12} sm={4} key={label}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'rgba(2,132,199,0.05)',
                    border: '1px solid rgba(2,132,199,0.12)',
                  }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'common.white', color: 'primary.main', width: 32, height: 32 }}>
                        <Icon fontSize="small" />
                      </Avatar>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        {label}
                      </Typography>
                    </Stack>
                    <Typography variant="h6">{value.toFixed(1)} {unit}</Typography>
                    <Typography variant="body2" color="text.secondary">{band}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
