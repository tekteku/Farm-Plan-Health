import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Typography } from '@mui/material'
import OverviewPanel from './components/OverviewPanel'
import PlantTable from './components/PlantTable'
import AlertsPanel from './components/AlertsPanel'
import DataUpload from './components/DataUpload'
import { fetchPlants } from './api/mockApi'
import type { Plant } from './types'

export default function App() {
  const [plants, setPlants] = useState<Plant[]>([])

  useEffect(() => {
    fetchPlants().then(setPlants)
  }, [])

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Farm Plant Health Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2 }}>
            <OverviewPanel plants={plants} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2 }}>
            <AlertsPanel plants={plants} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <PlantTable plants={plants} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <DataUpload />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
