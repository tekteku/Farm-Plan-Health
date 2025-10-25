import React, { useMemo, useState } from 'react'
import {
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
import PlantDetail from './PlantDetail'

export default function PlantTable({ plants }: { plants: Plant[] }) {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Plant | null>(null)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return plants
    return plants.filter((plant) =>
      plant.name.toLowerCase().includes(query) || plant.type.toLowerCase().includes(query)
    )
  }, [plants, q])

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <div>
          <Typography variant="h6">Plant Inventory</Typography>
          <Typography variant="body2" color="text.secondary">
            Click a row to inspect detailed history. Showing {filtered.length} of {plants.length} plants.
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
              <TableCell align="right">&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No plants match your search. Try a different keyword.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((plant) => (
                <TableRow
                  key={plant.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelected(plant)}
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
                      label={plant.health}
                      size="small"
                      color={plant.health === 'healthy' ? 'success' : 'warning'}
                      variant={plant.health === 'healthy' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell>{new Date(plant.lastChecked).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <ArrowForwardIosIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selected && <PlantDetail plant={selected} onClose={() => setSelected(null)} />}
    </Stack>
  )
}
