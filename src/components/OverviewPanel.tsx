import React from 'react'
import { Avatar, Card, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from '@mui/material'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import SpaIcon from '@mui/icons-material/Spa'
import TimelineIcon from '@mui/icons-material/Timeline'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import type { Plant } from '../types'

const COLORS = ['#2d6a4f', '#f9844a']

export default function OverviewPanel({ plants }: { plants: Plant[] }) {
  const total = plants.length
  const healthy = plants.filter((p) => p.health === 'healthy').length
  const unhealthy = plants.filter((p) => p.health === 'unhealthy').length
  const healthyRate = total > 0 ? Number(((healthy / total) * 100).toFixed(1)) : 0
  const lastChecked = plants.reduce((acc, p) => (p.lastChecked > acc ? p.lastChecked : acc), '')

  const pieData = [
    { name: 'Healthy', value: healthy },
    { name: 'Unhealthy', value: unhealthy },
  ]

  const trend = [
    { date: 'Oct 20', healthy: 2, unhealthy: 1 },
    { date: 'Oct 21', healthy: 2, unhealthy: 1 },
    { date: 'Oct 22', healthy: 3, unhealthy: 0 },
    { date: 'Oct 23', healthy: 3, unhealthy: 0 },
    { date: 'Oct 24', healthy: 2, unhealthy: 1 },
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', background: 'linear-gradient(160deg, rgba(45,106,79,0.2), rgba(45,106,79,0.05))' }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <LocalFloristIcon />
                </Avatar>
                <div>
                  <Typography variant="subtitle1">Total Plants</Typography>
                  <Typography variant="h4">{total}</Typography>
                </div>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Last health check: {lastChecked ? new Date(lastChecked).toLocaleString() : '—'}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ letterSpacing: 1 }}>Healthy coverage</Typography>
                <LinearProgress
                  variant="determinate"
                  value={healthyRate}
                  sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(45,106,79,0.15)' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {healthy} of {total} plants are healthy
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: 240 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1">Health Distribution</Typography>
              <Chip label={`${healthyRate}% healthy`} color="success" size="small" />
            </Stack>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Stack direction="row" spacing={2} justifyContent="center">
              <LegendDot color={COLORS[0]} label="Healthy" value={healthy} />
              <LegendDot color={COLORS[1]} label="Unhealthy" value={unhealthy} />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: 240 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
              <Avatar sx={{ bgcolor: 'secondary.light' }}>
                <SpaIcon />
              </Avatar>
              <Typography variant="subtitle1">Weekly Trend</Typography>
            </Stack>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="date" stroke="#9e9e9e" fontSize={12} tickMargin={8} />
                <YAxis stroke="#9e9e9e" fontSize={12} tickMargin={8} width={35} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="healthy" stroke="#2d6a4f" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="unhealthy" stroke="#f9844a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <Chip icon={<TimelineIcon />} label="Stable week" color="info" variant="outlined" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

function LegendDot({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }} />
      <Typography variant="body2" color="text.secondary">
        {label}: {value}
      </Typography>
    </Stack>
  )
}
