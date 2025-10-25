import React from 'react'
import { Grid, Card, CardContent, Typography } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import type { Plant } from '../types'

const COLORS = ['#4caf50', '#f44336', '#9e9e9e']

export default function OverviewPanel({ plants }: { plants: Plant[] }) {
  const total = plants.length
  const healthy = plants.filter((p) => p.health === 'healthy').length
  const unhealthy = plants.filter((p) => p.health === 'unhealthy').length
  const lastChecked = plants.reduce((acc, p) => (p.lastChecked > acc ? p.lastChecked : acc), '')

  const pieData = [
    { name: 'Healthy', value: healthy },
    { name: 'Unhealthy', value: unhealthy },
  ]

  // Simple mock trend data
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
        <Card>
          <CardContent>
            <Typography variant="h6">Total Plants</Typography>
            <Typography variant="h4">{total}</Typography>
            <Typography color="text.secondary">Last checked: {lastChecked ? new Date(lastChecked).toLocaleString() : 'N/A'}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent style={{ height: 200 }}>
            <Typography variant="h6">Health Distribution</Typography>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={30} outerRadius={50}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent style={{ height: 200 }}>
            <Typography variant="h6">Trend</Typography>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="healthy" stroke="#4caf50" />
                <Line type="monotone" dataKey="unhealthy" stroke="#f44336" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
