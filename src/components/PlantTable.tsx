import React, { useMemo, useState } from 'react'
import {
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import type { Plant } from '../types'
import AIDiagnosisModal from './AIDiagnosisModal'
import HarvestModal from './HarvestModal'

export default function PlantTable({ plants }: { plants: Plant[] }) {
  const [q, setQ] = useState('')
  const [selectedForDiagnosis, setSelectedForDiagnosis] = useState<Plant | null>(null)
  const [selectedForHarvest, setSelectedForHarvest] = useState<Plant | null>(null)

  const healthStatusLabel: Record<Plant['health'], string> = {
    healthy: 'Healthy',
    'needs-check': 'Needs Check',
    unhealthy: 'Unhealthy',
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return plants
    return plants.filter((plant) =>
      plant.name.toLowerCase().includes(query) || plant.type.toLowerCase().includes(query)
    )
  }, [plants, q])

  const handleRowClick = (plant: Plant) => {
    if (plant.health !== 'healthy') {
      setSelectedForDiagnosis(plant);
    }
  };

  const handleHarvestClick = (e: React.MouseEvent, plant: Plant) => {
    e.stopPropagation(); // Prevent row click from firing
    setSelectedForHarvest(plant);
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <div>
          <Typography variant="h6">Plant Inventory</Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {filtered.length} of {plants.length} plants
          </Typography>
        </div>
        <TextField
          size="small"
          placeholder="Search by name or type"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Health</TableCell>
              <TableCell>Last Checked</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No plants match your search.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((plant) => (
                <TableRow
                  key={plant.id}
                  hover
                  sx={{ cursor: plant.health !== 'healthy' ? 'pointer' : 'default' }}
                  onClick={() => handleRowClick(plant)}
                >
                  <TableCell>
                    <Typography variant="subtitle2">{plant.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {plant.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{plant.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={healthStatusLabel[plant.health]}
                      size="small"
                      color={plant.health === 'healthy' ? 'success' : (plant.health === 'unhealthy' ? 'error' : 'warning')}
                      variant={plant.health === 'healthy' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell>{new Date(plant.lastChecked).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    {plant.health === 'healthy' ? (
                      <Button variant="outlined" size="small" onClick={(e) => handleHarvestClick(e, plant)}>
                        Harvest
                      </Button>
                    ) : (
                      <IconButton size="small" aria-label="View plant actions">
                        <ArrowForwardIosIcon fontSize="inherit" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AIDiagnosisModal plant={selectedForDiagnosis} open={!!selectedForDiagnosis} onClose={() => setSelectedForDiagnosis(null)} />
      <HarvestModal plant={selectedForHarvest} open={!!selectedForHarvest} onClose={() => setSelectedForHarvest(null)} />
    </Stack>
  )
}
