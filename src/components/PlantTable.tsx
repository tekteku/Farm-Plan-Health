import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { Plant } from '../types'
import PlantDetail from './PlantDetail'

export default function PlantTable({ plants }: { plants: Plant[] }) {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Plant | null>(null)

  const filtered = plants.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.type.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <TextField size="small" placeholder="Search by name or type" value={q} onChange={(e) => setQ(e.target.value)} InputProps={{ endAdornment: <IconButton><SearchIcon /></IconButton> }} />
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Health</TableCell>
              <TableCell>Last Checked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} hover style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.type}</TableCell>
                <TableCell>{p.health}</TableCell>
                <TableCell>{new Date(p.lastChecked).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selected && <PlantDetail plant={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
