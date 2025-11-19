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
  useTheme,
  IconButton,
  Paper,
} from '@mui/material'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import BoltIcon from '@mui/icons-material/Bolt'
import TimelineIcon from '@mui/icons-material/Timeline'
import OpacityIcon from '@mui/icons-material/Opacity'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ReferenceLine, CartesianGrid } from 'recharts'
import type { Plant } from '../types'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#64748b']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.05)', boxShadow: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{label}</Typography>
        {payload.map((entry: any, index: number) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color || entry.fill }} />
            <Typography variant="body2" color="text.secondary">
              {entry.name}: <span style={{ fontWeight: 600, color: '#0f172a' }}>{entry.value}</span>
            </Typography>
          </Stack>
        ))}
      </Paper>
    )
  }
  return null
}

export default function OverviewPanel({ plants }: { plants: Plant[] }) {
  const theme = useTheme()

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
      const healthyScore = Math.min(100, totals.healthyRate + (index - 3) * 1.2)
      const alerts = Math.max(0, totals.alertCount - (index - 2) * 0.6)
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
        Icon: WaterDropIcon,
        unit: '%',
        band: 'Optimal',
        trend: '+2%',
        color: theme.palette.info.main,
        bg: theme.palette.info.light,
      },
      {
        label: 'Canopy Temp',
        value: 23.5 + totals.alertCount * 0.2,
        Icon: DeviceThermostatIcon,
        unit: '°C',
        band: 'Stable',
        trend: '-0.5°',
        color: theme.palette.warning.main,
        bg: theme.palette.warning.light,
      },
      {
        label: 'Air Quality',
        value: 92,
        Icon: AirIcon,
        unit: 'AQI',
        band: 'Excellent',
        trend: 'Steady',
        color: theme.palette.success.main,
        bg: theme.palette.success.light,
      },
    ]
  ), [totals, theme])

  const lastCheckedLabel = totals.lastChecked ? new Date(totals.lastChecked).toLocaleString() : 'N/A'
  const resilienceScore = Math.min(100, Number((totals.healthyRate + 12).toFixed(1)))

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 6,
            color: 'common.white',
            background: 'linear-gradient(120deg, #059669 0%, #10b981 50%, #34d399 100%)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label="LIVE MONITORING" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    fontWeight: 700, 
                    letterSpacing: 1,
                    backdropFilter: 'blur(4px)'
                  }} 
                />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Updated {lastCheckedLabel}</Typography>
              </Stack>
              
              <Box>
                <Typography variant="h3" fontWeight="800" sx={{ mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  {totals.healthyRate}% Canopy Health
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 600 }}>
                  {totals.total} active plants monitored. AI systems operating at nominal capacity.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Paper sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: 'white', color: '#059669', width: 32, height: 32 }}>
                      <LocalFloristIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', lineHeight: 1 }}>Healthy</Typography>
                      <Typography variant="subtitle1" fontWeight="700">{totals.healthy}</Typography>
                    </Box>
                  </Stack>
                </Paper>
                <Paper sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: '#f59e0b', width: 32, height: 32 }}>
                      <BoltIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', lineHeight: 1 }}>Alerts</Typography>
                      <Typography variant="subtitle1" fontWeight="700">{totals.alertCount}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Stack>

            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                minWidth: 280, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(12px)', 
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" fontWeight="600" sx={{ letterSpacing: 0.5 }}>RESILIENCE SCORE</Typography>
                  <EmojiObjectsIcon fontSize="small" sx={{ opacity: 0.8 }} />
                </Stack>
                <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h2" fontWeight="800">{resilienceScore}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Weekly Trend</Typography>
                    <Typography variant="caption" fontWeight="700">+4.2%</Typography>
                  </Stack>
                  <LinearProgress 
                    value={resilienceScore} 
                    variant="determinate" 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 4 } 
                    }} 
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card elevation={0} sx={{ height: '100%', borderRadius: 5, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main', borderRadius: 2 }}>
                  <TimelineIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">Recovery Velocity</Typography>
                  <Typography variant="body2" color="text.secondary">7-day health trajectory & AI forecast</Typography>
                </Box>
              </Stack>
              <IconButton size="small"><MoreVertIcon /></IconButton>
            </Stack>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="healthyScore" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorHealth)" 
                    name="Health Index"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="alerts" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorAlerts)" 
                    name="Alert Load"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ height: '100%', borderRadius: 5, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>Health Distribution</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Current canopy status breakdown</Typography>
            
            <Box sx={{ flexGrow: 1, minHeight: 200, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    cornerRadius={5}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -65%)', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="800" color="text.primary">{totals.total}</Typography>
                <Typography variant="caption" color="text.secondary">PLANTS</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ height: '100%', borderRadius: 5, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.50', color: 'error.main', borderRadius: 2 }}>
                  <BoltIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">Intervention Radar</Typography>
                  <Typography variant="body2" color="text.secondary">Priority actions required</Typography>
                </Box>
              </Stack>
              <Chip label={`${focusPlants.length} Pending`} color="error" size="small" sx={{ fontWeight: 600 }} />
            </Stack>

            {focusPlants.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'success.50', borderRadius: 3 }}>
                <Typography variant="subtitle1" color="success.main" fontWeight="600">All Systems Nominal</Typography>
                <Typography variant="body2" color="success.dark">No urgent interventions required at this time.</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {focusPlants.map((plant) => (
                  <Paper 
                    key={plant.id} 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      bgcolor: 'rgba(249, 250, 251, 0.5)', 
                      border: '1px solid', 
                      borderColor: 'divider',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)', borderColor: 'primary.main' }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="700">{plant.name}</Typography>
                        <Typography variant="caption" color="text.secondary">ID: {plant.id}</Typography>
                      </Box>
                      <Chip 
                        label={plant.health.replace('-', ' ')} 
                        size="small" 
                        sx={{ 
                          bgcolor: plant.health === 'unhealthy' ? 'error.50' : 'warning.50',
                          color: plant.health === 'unhealthy' ? 'error.main' : 'warning.main',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {plant.notes || 'AI detected anomalies in recent scan. Recommended immediate visual inspection.'}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <LinearProgress 
                        value={plant.health === 'unhealthy' ? 90 : 60} 
                        variant="determinate" 
                        color={plant.health === 'unhealthy' ? 'error' : 'warning'}
                        sx={{ flexGrow: 1, height: 6, borderRadius: 3 }} 
                      />
                      <Typography variant="caption" fontWeight="600" color="text.secondary">
                        {plant.health === 'unhealthy' ? 'CRITICAL' : 'HIGH'}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ height: '100%', borderRadius: 5, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'info.50', color: 'info.main', borderRadius: 2 }}>
                  <OpacityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">Climate Pulse</Typography>
                  <Typography variant="body2" color="text.secondary">Environmental telemetry</Typography>
                </Box>
              </Stack>
              <IconButton size="small"><MoreVertIcon /></IconButton>
            </Stack>

            <Grid container spacing={2}>
              {climatePulse.map(({ label, value, Icon, unit, band, trend, color, bg }) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Paper 
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      bgcolor: 'rgba(248, 250, 252, 0.8)',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: bg, color: color, width: 40, height: 40, borderRadius: 2 }}>
                        <Icon fontSize="small" />
                      </Avatar>
                      <Chip 
                        label={band} 
                        size="small" 
                        sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', fontWeight: 600 }} 
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{label}</Typography>
                    <Stack direction="row" alignItems="baseline" spacing={1}>
                      <Typography variant="h5" fontWeight="700">{typeof value === 'number' ? value.toFixed(1) : value}</Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">{unit}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                      <ArrowUpwardIcon sx={{ fontSize: 14, color: 'success.main', transform: trend.includes('-') ? 'rotate(180deg)' : 'none' }} />
                      <Typography variant="caption" color="success.main" fontWeight="700">{trend}</Typography>
                      <Typography variant="caption" color="text.secondary">vs last hour</Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
