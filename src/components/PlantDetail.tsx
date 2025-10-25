import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import type { Plant } from '../types'

export default function PlantDetail({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{plant.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Type: {plant.type}</Typography>
        <Typography variant="subtitle1">Health: {plant.health}</Typography>
        <Typography variant="body2">Last checked: {new Date(plant.lastChecked).toLocaleString()}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Notes: {plant.notes ?? '—'}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary">Mark as checked</Button>
      </DialogActions>
    </Dialog>
  )
}
