import React from 'react'
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material'
import type { Plant } from '../types'

export default function AlertsPanel({ plants }: { plants: Plant[] }) {
  const needsAttention = plants.filter((p) => p.health === 'unhealthy')

  return (
    <div>
      <Typography variant="h6">Alerts</Typography>
      <Divider sx={{ mb: 1 }} />
      {needsAttention.length === 0 ? (
        <Typography color="text.secondary">No alerts</Typography>
      ) : (
        <List dense>
          {needsAttention.map((p) => (
            <ListItem key={p.id}>
              <ListItemText primary={p.name} secondary={`Last checked: ${new Date(p.lastChecked).toLocaleDateString()}`} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}
